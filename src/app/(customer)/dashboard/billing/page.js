import { isLogin } from '@/lib/middleware';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import Link from 'next/link';

export default async function BillingPage() {
  const auth = await isLogin();
  if (!auth.success) redirect('/login');
  const session = auth.data;

  const billingRes = await query(`
    SELECT DISTINCT p.payment_id, p.amount, p.status, p.created_at, p.provider,
           COALESCE(t.name, pur.requested_tenant_name, 'Unknown Workspace') AS tenant_name,
           pkg.name AS package_name
    FROM ress_subscription_payments p
    LEFT JOIN ress_purchases pur ON pur.purchase_id = p.purchase_id
    LEFT JOIN ress_subscriptions s ON s.subscription_id = p.subscription_id
    LEFT JOIN ress_tenants t ON t.tenant_id = COALESCE(s.tenant_id, pur.tenant_id)
    LEFT JOIN ress_packages pkg ON pkg.package_id = COALESCE(s.package_id, pur.package_id)
    WHERE p.purchase_id IN (SELECT purchase_id FROM ress_purchases WHERE user_id = $1)
       OR s.tenant_id IN (SELECT DISTINCT tenant_id FROM ress_purchases WHERE user_id = $1 AND tenant_id IS NOT NULL)
    ORDER BY p.created_at DESC
  `, [session.user_id]);

  const payments = billingRes.rows;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Billing & Subscriptions</h1>
        <p className="text-slate-500 text-sm mt-1">View your payment history and active plans</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Payment History</h2>
        </div>
        
        {payments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            No payment history found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4 border-b border-slate-100">Date</th>
                  <th className="p-4 border-b border-slate-100">Workspace</th>
                  <th className="p-4 border-b border-slate-100">Plan</th>
                  <th className="p-4 border-b border-slate-100">Amount</th>
                  <th className="p-4 border-b border-slate-100">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-slate-600">
                {payments.map(payment => (
                  <tr key={payment.payment_id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 border-b border-slate-50">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 border-b border-slate-50 text-slate-900 font-bold">
                      {payment.tenant_name}
                    </td>
                    <td className="p-4 border-b border-slate-50">
                      {payment.package_name}
                    </td>
                    <td className="p-4 border-b border-slate-50 font-bold">
                      ৳{parseFloat(payment.amount).toFixed(2)}
                    </td>
                    <td className="p-4 border-b border-slate-50">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider
                        ${payment.status === 'paid' || payment.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 
                          payment.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
