import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { isLogin } from '@/lib/middleware';

export async function POST(request) {
  try {
    const auth = await isLogin();
    if (!auth.success) return NextResponse.json(auth, { status: 401 });

    const user = auth.data;

    const { packageId, requested_tenant_name, requested_tenant_slug, requested_custom_domain, transaction_id, duration_months = 1 } = await request.json();

    if (!packageId || !requested_tenant_name || !requested_tenant_slug || !transaction_id) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    // Check if the requested slug already exists
    const slugCheck = await query("SELECT tenant_id FROM ress_tenants WHERE slug = $1 LIMIT 1", [requested_tenant_slug.toLowerCase()]);
    if (slugCheck.rows.length > 0) {
      return NextResponse.json({ success: false, message: 'This workspace URL is already taken. Please choose another one.' }, { status: 400 });
    }

    // Get the package price
    const pkgRes = await query("SELECT monthly_price, setup_fee FROM ress_packages WHERE package_id = $1 LIMIT 1", [packageId]);
    if (pkgRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid package' }, { status: 400 });
    }
    
    const pkg = pkgRes.rows[0];
    const parsedDuration = parseInt(duration_months) || 1;
    const totalAmount = (Number(pkg.monthly_price) * parsedDuration) + Number(pkg.setup_fee || 0);

    const noteText = requested_custom_domain ? `Preferred domain: ${requested_custom_domain}` : null;

    await withTransaction(async (client) => {
      // 1. Create a pending purchase
      const purchaseRes = await client.query(
        `INSERT INTO ress_purchases 
         (user_id, package_id, amount, status, requested_tenant_name, requested_tenant_slug, requested_custom_domain, transaction_id, payment_method, duration_months, note) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING purchase_id`,
        [user.user_id, packageId, totalAmount, 'pending', requested_tenant_name, requested_tenant_slug.toLowerCase(), requested_custom_domain, transaction_id, 'bKash', parsedDuration, noteText]
      );
      const purchaseId = purchaseRes.rows[0].purchase_id;

      // 2. Create pending invoice
      const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
      await client.query(
        "INSERT INTO ress_invoices (purchase_id, invoice_number, amount, status) VALUES ($1, $2, $3, 'unpaid')",
        [purchaseId, invoiceNumber, totalAmount]
      );

      // 3. Create pending payment
      await client.query(
        "INSERT INTO ress_subscription_payments (purchase_id, amount, provider, transaction_id, status) VALUES ($1, $2, $3, $4, 'pending')",
        [purchaseId, totalAmount, 'bKash', transaction_id]
      );
    });

    return NextResponse.json({ success: true, message: 'Purchase request submitted' });

  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
