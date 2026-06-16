'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import { LoadingSpinner, ErrorMessage, EmptyState } from '@/components/dashboard/ui';

export default function ControlAnalyticsPage() {
  
  const fetchUrl = '/api/control/analytics';
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

  const { metrics = {}, tenantGrowth = [] } = data;

  const METRICS = [
    { icon: '🏢', label: 'Active Tenants',  value: metrics.active_tenants   || 0, sub: `+${metrics.new_tenants_30d || 0} this month` },
    { icon: '📝', label: 'Reservations (30d)',   value: metrics.bookings_30d     || 0 },
    { icon: '🗺️', label: 'Active Menu Items',     value: metrics.active_tours     || 0 },
    { icon: '💰', label: 'Total Revenue',    value: `$${Number(metrics.total_revenue || 0).toLocaleString()}` },
    { icon: '📅', label: 'Revenue (30d)',    value: `$${Number(metrics.revenue_30d   || 0).toLocaleString()}` },
    { icon: '📈', label: 'MRR',             value: `$${Number(metrics.revenue_30d   || 0).toLocaleString()}` },
  ];

  const maxCount = Math.max(...tenantGrowth.map((r) => parseInt(r.count) || 0), 1);

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Analytics</h1>
          <p className="text-xs text-slate-500 mt-1.5 uppercase tracking-wider font-bold font-sans">Metrics overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        {METRICS.map((m) => (
          <div 
            key={m.label} 
            className="relative bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:border-pink-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-center gap-4 mb-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{m.label}</div>
              <div className="text-xl filter drop-shadow-sm">{m.icon}</div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">{m.value}</div>
            {m.sub && <div className="text-[10px] font-bold text-emerald-600 tracking-wide">{m.sub}</div>}
          </div>
        ))}
      </div>

      {/* Tenant Growth */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 px-6 border-b border-slate-100 bg-slate-50/50">
          <span className="text-base font-bold text-slate-900 tracking-tight">Tenant Growth (last 6 months)</span>
        </div>
        {tenantGrowth.length === 0 ? (
          <EmptyState icon="📊" title="No growth data yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Month</th>
                  <th className="px-6 py-4 font-semibold">New Tenants</th>
                  <th className="px-6 py-4 font-semibold min-w-[200px]">Visual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenantGrowth.map((row) => {
                  const pct = (parseInt(row.count) / maxCount) * 100;
                  return (
                    <tr key={row.month} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                        {new Date(row.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-slate-900 text-sm">{row.count}</td>
                      <td className="px-6 py-4">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden w-full max-w-md">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)' }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
