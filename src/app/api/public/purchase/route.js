import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { hashPassword, signToken, buildSessionCookie, getAuthenticatedContext } from '@/lib/middleware';

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 50);
}

export async function POST(request) {
  try {
    const { packageId, companyName, subdomain, name, email, password } = await request.json();

    if (!packageId || !companyName || !subdomain || !name || !email || !password) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    let user_id = null;
    const session = await getAuthenticatedContext();
    
    if (session && session.user_id && !session.tenant_id) {
      user_id = session.user_id;
    } else {
      const existingUser = await query("SELECT user_id FROM ress_users WHERE email = $1 LIMIT 1", [emailLower]);
      if (existingUser.rows.length > 0) {
        user_id = existingUser.rows[0].user_id;
      }
    }

    const packageRes = await query("SELECT * FROM ress_packages WHERE package_id = $1", [packageId]);
    if (packageRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid package selected' }, { status: 400 });
    }
    const pkg = packageRes.rows[0];

    let slug = generateSlug(subdomain);
    const slugCheck = await query("SELECT tenant_id FROM ress_tenants WHERE slug = $1 LIMIT 1", [slug]);
    if (slugCheck.rows.length > 0) {
       return NextResponse.json({ success: false, message: 'This subdomain is already taken' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    
    const result = await withTransaction(async (client) => {
      let finalUserId = user_id;
      let newUser = null;

      if (!finalUserId) {
        const userResult = await client.query(
          "INSERT INTO ress_users (name, email, password, role) VALUES ($1, $2, $3, 'customer') RETURNING *",
          [name, emailLower, hashedPassword]
        );
        finalUserId = userResult.rows[0].user_id;
        newUser = userResult.rows[0];
      }

      const metadata = {
        companyName,
        subdomain: slug,
        tenantAdminName: name,
        tenantAdminEmail: emailLower,
        tenantAdminPasswordHashed: hashedPassword
      };

      const purchaseResult = await client.query(
        "INSERT INTO ress_purchases (user_id, package_id, amount, status, metadata) VALUES ($1, $2, $3, 'pending', $4) RETURNING *",
        [finalUserId, pkg.package_id, pkg.monthly_price, metadata]
      );
      
      const purchaseId = purchaseResult.rows[0].purchase_id;

      // Create pending invoice
      const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
      await client.query(
        "INSERT INTO ress_invoices (purchase_id, invoice_number, amount, status) VALUES ($1, $2, $3, 'unpaid')",
        [purchaseId, invoiceNumber, pkg.monthly_price]
      );

      // Create pending payment (using a dummy transaction_id for public requests or leave it null if allowed, but schema says UNIQUE. Let's generate a temporary one)
      const tempTrxId = `PENDING-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await client.query(
        "INSERT INTO ress_subscription_payments (purchase_id, amount, provider, transaction_id, status) VALUES ($1, $2, $3, $4, 'pending')",
        [purchaseId, pkg.monthly_price, 'system', tempTrxId]
      );

      return { purchase: purchaseResult.rows[0], newUser };
    });

    let cookie = null;
    if (result.newUser && (!session || session.tenant_id)) {
      const tokenPayload = {
        user_id: result.newUser.user_id,
        name: result.newUser.name,
        email: result.newUser.email,
        role: result.newUser.role,
      };
      const token = signToken(tokenPayload);
      cookie = buildSessionCookie(token);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Purchase submitted. Your workspace is pending manager approval.',
      tenantUrl: '/dashboard'
    }, { status: 201 });

    if (cookie) {
      response.headers.set('Set-Cookie', cookie);
    }
    return response;
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
