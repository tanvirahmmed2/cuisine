import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const [statsRes, recentTenantsRes, recentPaymentsRes] = await Promise.all([
      query(`
        SELECT
          (SELECT COUNT(*) FROM ress_tenants)                                                   AS total_tenants,
          (SELECT COUNT(*) FROM ress_tenants WHERE status = 'active')                           AS active_tenants,
          (SELECT COUNT(*) FROM ress_users WHERE role = 'customer')                             AS total_users,
          (SELECT COUNT(*) FROM ress_purchases WHERE status = 'paid')                           AS total_bookings,
          (SELECT COALESCE(SUM(amount), 0) FROM ress_subscription_payments
           WHERE status = 'success' AND created_at > NOW() - INTERVAL '30 days')              AS monthly_revenue
      `),
      query(`
        SELECT t.tenant_id, t.name, t.slug, t.status, t.created_at, p.name AS plan_name
        FROM ress_tenants t
        LEFT JOIN ress_subscriptions ss ON ss.tenant_id = t.tenant_id AND ss.status = 'active'
        LEFT JOIN ress_packages p       ON p.package_id = ss.package_id
        ORDER BY t.created_at DESC LIMIT 8
      `),
      query(`
        SELECT sp.payment_id, sp.amount, sp.status, sp.created_at, 
               COALESCE(t.name, pur.requested_tenant_name, 'New Workspace') AS tenant_name
        FROM ress_subscription_payments sp
        LEFT JOIN ress_purchases pur ON pur.purchase_id = sp.purchase_id
        LEFT JOIN ress_subscriptions s ON s.subscription_id = sp.subscription_id
        LEFT JOIN ress_tenants t ON t.tenant_id = COALESCE(s.tenant_id, pur.tenant_id)
        ORDER BY sp.created_at DESC LIMIT 6
      `),
    ]);

    const row = statsRes.rows[0] || {};
    return NextResponse.json({ success: true, data: {
      stats: {
        totalTenants:   parseInt(row.total_tenants || 0),
        activeTenants:  parseInt(row.active_tenants || 0),
        totalUsers:     parseInt(row.total_users || 0),
        totalBookings:  parseInt(row.total_bookings || 0),
        monthlyRevenue: parseFloat(row.monthly_revenue || 0),
      },
      recentTenants:  recentTenantsRes.rows,
      recentPayments: recentPaymentsRes.rows,
      user: { name: auth.data.name, role: auth.data.role }
    }});
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
