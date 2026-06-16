'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function CreateTenantPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', slug: '', status: 'active' });
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => {
    const val = e.target.value;
    setForm((f) => ({
      ...f,
      [field]: val,
      // Auto-slug from name
      ...(field === 'name' && !f._slugEdited
        ? { slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
        : {}),
    }));
  };
  const setSlug = (e) => setForm((f) => ({ ...f, slug: e.target.value, _slugEdited: true }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await axios.post('/api/control/tenants', form);
      router.push('/control/tenants');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create tenant');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className={"flex items-start justify-between mb-8"}>
        <div>
          <h1 className={"text-3xl font-extrabold text-slate-900 tracking-tight"}>New Tenant</h1>
          <p className={"text-sm text-slate-600 mt-1"}>Register a new organisation on the platform</p>
        </div>
      </div>

      <div className={"bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden"}>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 mb-1">Organisation Name *</label>
            <input className="input-custom" value={form.name} onChange={set('name')} required />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 mb-1">Workspace Slug *</label>
            <div className="flex items-center">
              <input
                className="input-custom rounded-r-none border-r-0 flex-1"
                value={form.slug}
                onChange={setSlug}
                required
               
                pattern="[a-z0-9\-]+"
                title="Lowercase letters, numbers, and hyphens only"
              />
              <span className="bg-slate-50 border border-slate-200 border-l-0 px-3.5 py-2.5 text-sm text-slate-500 rounded-r-lg whitespace-nowrap font-medium">
                .yourdomain.com
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 mb-1">Status</label>
            <select className="input-custom" value={form.status} onChange={set('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button type="button" className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition disabled:opacity-50 shadow-sm" onClick={() => router.back()} disabled={saving}>Cancel</button>
            <button type="submit" className="btn-custom-primary px-5 py-2.5 text-sm" disabled={saving}>
              {saving ? 'Creating…' : 'Create Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
