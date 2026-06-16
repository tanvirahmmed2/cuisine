import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isAdmin();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const [statsRes, listRes] = await Promise.all([
      query(`
        SELECT 
          COALESCE(SUM(amount) FILTER (WHERE status = 'success'), 0) AS total_collected,
          COALESCE(SUM(amount) FILTER (WHERE status = 'success' AND created_at >= NOW() - INTERVAL '30 days'), 0) AS last_30d,
          COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
          COUNT(*) AS total_count
        FROM ress_subscription_payments
      `),
      query(`
        SELECT p.payment_id, p.amount, p.status, p.created_at, p.provider AS payment_method,
               t.name AS tenant_name, t.slug AS slug, pkg.name AS package_name
        FROM ress_subscription_payments p
        JOIN ress_subscriptions s ON s.subscription_id = p.subscription_id
        JOIN ress_tenants t ON t.tenant_id = s.tenant_id
        JOIN ress_packages pkg ON pkg.package_id = s.package_id
        ORDER BY p.created_at DESC
      `)
    ]);

    return NextResponse.json({ success: true, data: {
      stats: statsRes.rows[0],
      payments: listRes.rows
    }});
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
