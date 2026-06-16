'use client';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { LoadingSpinner, ErrorMessage, EmptyState } from '@/components/dashboard/ui';
import Link from 'next/link';

export default function PackagesPage() {
  const fetchUrl = '/api/control/packages';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
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

  useEffect(() => { fetchData(); }, [fetchData]);
  const refetch = fetchData;

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      await axios.delete(`/api/control/packages/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete package');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const packages = data?.packages || [];

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Packages</h1>
          <p className="text-sm text-slate-600 mt-1">Manage SaaS subscription plans</p>
        </div>
        <Link href="/control/manager/packages/new" className="btn-custom-primary px-4 py-2 text-sm">
          + Add Package
        </Link>
      </div>

      {packages.length === 0 ? (
        <EmptyState icon="📦" title="No packages defined yet" subtitle="Click 'Add Package' to create one." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packages.map((pkg) => {
            const features = (() => {
              try { return typeof pkg.features === 'string' ? JSON.parse(pkg.features) : (pkg.features || []); }
              catch { return []; }
            })();

            return (
              <div key={pkg.package_id} className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col gap-5 transition-all hover:border-pink-200 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-lg text-slate-900">{pkg.name}</h3>
                  <span className="px-2.5 py-1 bg-pink-50 text-pink-700 border border-pink-100 text-xs font-bold rounded-lg">{pkg.subscriber_count || 0} tenants</span>
                </div>
                <div 
                  className="text-sm text-slate-600 min-h-[40px] leading-relaxed font-medium prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: pkg.description }}
                />
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <div className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly</div>
                    <div className="text-lg font-extrabold text-slate-900">৳{Number(pkg.monthly_price).toFixed(0)}</div>
                  </div>
                  <div>
                    <div className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider mb-1">Yearly</div>
                    <div className="text-lg font-extrabold text-emerald-600">৳{Number(pkg.yearly_price).toFixed(0)}</div>
                  </div>
                  <div>
                    <div className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider mb-1">Setup Fee</div>
                    <div className="text-lg font-extrabold text-pink-600">৳{Number(pkg.setup_fee || 0).toFixed(0)}</div>
                  </div>
                </div>
                {features.length > 0 && (
                  <ul className="list-none flex flex-col gap-2 mt-2">
                    {features.slice(0, 5).map((f, i) => (
                      <li key={i} className="text-sm font-medium text-slate-600 flex gap-3 items-start">
                        <span className="text-pink-600 font-bold shrink-0">✓</span> {f.name || f}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-3 mt-auto pt-5 border-t border-slate-100">
                  <Link href={`/control/manager/packages/${pkg.package_id}`} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl flex-1 text-center hover:bg-slate-50 transition-colors">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(pkg.package_id)} className="px-4 py-2 bg-white border border-red-200 text-red-600 font-semibold text-sm rounded-xl flex-1 text-center hover:bg-red-50 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
