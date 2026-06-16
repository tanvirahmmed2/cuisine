'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import Link from 'next/link';

import { LoadingSpinner, ErrorMessage, EmptyState, StatusBadge } from '@/components/dashboard/ui';

export default function ControlDashboard() {
  
  const fetchUrl = '/api/control/overview';
  const [data, setData] = __useState(null);
  const [loading, setLoading] = __useState(true);
  const [error, setError] = __useState(null);

  const fetchData = __useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(fetchUrl, { withCredentials: true });
      setData(res.data.data || res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        window.location.href = '/login';
        return;
      }
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchUrl]);

  __useEffect(() => { fetchData(); }, [fetchData]);
  const refetch = fetchData;

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />;

  const { stats = {}, recentTenants = [], recentPayments = [] } = data;

  const STAT_CARDS = [
    { icon: '🏢', label: 'Total Tenants', value: stats.totalTenants, trend: `${stats.activeTenants} active` },
    { icon: '👥', label: 'Total Users', value: stats.totalUsers?.toLocaleString(), trend: 'across all tenants' },
    { icon: '📝', label: 'Total Reservations', value: stats.totalBookings?.toLocaleString(), trend: 'all time' },
    { icon: '💰', label: 'Revenue (30d)', value: `$${Number(stats.monthlyRevenue || 0).toLocaleString()}`, trend: 'last 30 days' },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {data.user?.name?.split(' ')[0] || 'Manager'} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">Here's what's happening on your SaaS platform today.</p>
        </div>
        <Link 
          href="/control/tenants" 
          className="btn-custom-primary px-5 py-2.5 text-xs inline-block"
        >
          Manage Tenants →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {STAT_CARDS.map((s) => (
          <div 
            key={s.label} 
            className="relative bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:border-pink-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-center gap-4 mb-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</div>
              <div className="text-xl filter drop-shadow-sm">{s.icon}</div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">{s.value}</div>
            <div className="text-[10px] font-bold text-pink-600 tracking-wide">{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tenants */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5 px-6 border-b border-slate-100 bg-slate-50/50">
            <span className="text-base font-bold text-slate-900 tracking-tight">Recent Tenants</span>
            <Link href="/control/tenants" className="text-xs text-pink-600 hover:underline font-bold">View all →</Link>
          </div>
          {recentTenants.length === 0 ? (
            <EmptyState icon="🏢" title="No tenants yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Plan</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTenants.map((t) => (
                    <tr key={t.tenant_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{t.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm font-bold">{t.plan_name || 'No Plan'}</td>
                      <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5 px-6 border-b border-slate-100 bg-slate-50/50">
            <span className="text-base font-bold text-slate-900 tracking-tight">Recent Payments</span>
            <Link href="/control/payments" className="text-xs text-pink-600 hover:underline font-bold">View all →</Link>
          </div>
          {recentPayments.length === 0 ? (
            <EmptyState icon="💰" title="No payments yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Tenant</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentPayments.map((p) => (
                    <tr key={p.payment_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">{p.tenant_name}</td>
                      <td className="px-6 py-4 font-extrabold text-emerald-600 text-sm">
                        ${parseFloat(p.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
