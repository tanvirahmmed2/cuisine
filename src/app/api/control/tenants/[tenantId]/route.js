import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { tenantId } = await params;

    const [
      tenantRes,
      websiteRes,
      domainsRes,
      usersRes,
      subsRes,
      purchasesRes,
      invoicesRes
    ] = await Promise.all([
      query("SELECT * FROM ress_tenants WHERE tenant_id = $1", [tenantId]),
      query("SELECT * FROM restaurant_websites WHERE tenant_id = $1", [tenantId]),
      query("SELECT * FROM ress_domains WHERE tenant_id = $1", [tenantId]),
      query(`
        SELECT DISTINCT u.user_id, u.name, u.email, u.phone, u.is_verified, u.role, u.created_at
        FROM ress_users u
        JOIN ress_purchases p ON p.user_id = u.user_id
        WHERE p.tenant_id = $1
      `, [tenantId]),
      query(`
        SELECT s.*, p.name as package_name, p.monthly_price, p.setup_fee 
        FROM ress_subscriptions s 
        LEFT JOIN ress_packages p ON s.package_id = p.package_id 
        WHERE s.tenant_id = $1 
        ORDER BY s.created_at DESC
      `, [tenantId]),
      query(`
        SELECT p.*, pkg.name as package_name 
        FROM ress_purchases p
        LEFT JOIN ress_packages pkg ON p.package_id = pkg.package_id
        WHERE p.tenant_id = $1 
        ORDER BY p.created_at DESC
      `, [tenantId]),
      query("SELECT * FROM ress_invoices WHERE tenant_id = $1 ORDER BY created_at DESC", [tenantId])
    ]);

    if(tenantRes.rows.length === 0) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    
    const tenantData = {
      ...tenantRes.rows[0],
      website: websiteRes.rows[0] || null,
      domains: domainsRes.rows,
      users: usersRes.rows,
      subscriptions: subsRes.rows,
      purchases: purchasesRes.rows,
      invoices: invoicesRes.rows
    };

    return NextResponse.json({ success: true, data: { tenant: tenantData } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { status, name, subscription_id, subscription_status, primary_domain } = await request.json();
    const { tenantId } = await params;
    
    // 1. Update Tenant
    await query("UPDATE ress_tenants SET status = COALESCE($1, status), name = COALESCE($2, name) WHERE tenant_id = $3", [status, name, tenantId]);

    // 2. Update Subscription Status
    if (subscription_status && subscription_id) {
      await query("UPDATE ress_subscriptions SET status = $1 WHERE subscription_id = $2 AND tenant_id = $3", [subscription_status, subscription_id, tenantId]);
    }

    // 3. Update Primary Domain
    if (primary_domain !== undefined) {
      const domainCheck = await query("SELECT domain_id FROM ress_domains WHERE tenant_id = $1 AND is_primary = true", [tenantId]);
      if (domainCheck.rows.length > 0) {
        if (primary_domain.trim() === '') {
          await query("DELETE FROM ress_domains WHERE tenant_id = $1 AND is_primary = true", [tenantId]);
        } else {
          await query("UPDATE ress_domains SET domain = $1 WHERE tenant_id = $2 AND is_primary = true", [primary_domain, tenantId]);
        }
      } else if (primary_domain.trim() !== '') {
        await query("INSERT INTO ress_domains (tenant_id, domain, is_primary) VALUES ($1, $2, true)", [tenantId, primary_domain]);
      }
    }

    return NextResponse.json({ success: true, message: 'Configuration saved successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
