'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
export function TrustStats() {
  
  const fetchUrl = '/api/public/stats';
  const [data, setData] = __useState(null);
  const [loading, setLoading] = __useState(true);
  const [error, setError] = __useState(null);

  const fetchData = __useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(fetchUrl, { withCredentials: true });
      setData(res.data?.data || null);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        window.location.href = '/login';
        return;
      }
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchUrl]);

  __useEffect(() => { fetchData(); }, [fetchData]);
  


  if (loading) return <div className="text-center p-12 text-text-3 font-semibold">Loading stats...</div>;
  if (error || !data) return <div className="text-center p-12 text-text-3 font-semibold">No stats found.</div>;

  const stats = data;
  
  const items = [
    { value: `${loading ? '...' : stats.tenants}+`, label: 'restaurants', icon: '🏢' },
    { value: `${loading ? '...' : (stats.reservations / 1000).toFixed(1)}K+`, label: 'Reservations Monthly', icon: '📅' },
    { value: `${loading ? '...' : stats.countries}+`, label: 'Countries', icon: '🌍' },
    { value: '99.9%', label: 'Uptime SLA', icon: '⚡' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-0 max-w-6xl mx-auto border border-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white divide-x divide-y divide-slate-100 md:divide-y-0 shadow-lg shadow-slate-100/50">
      {items.map((item, index) => (
        <div key={item.label} className="group flex flex-col items-center p-12 px-6 gap-3 transition-all duration-300 hover:bg-slate-50/80">
          <span className="text-4xl filter drop-shadow-[0_4px_8px_rgba(99,102,241,0.1)] group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
          <span className="text-4xl font-black text-text tracking-tight mt-2">{item.value}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-text-3">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
