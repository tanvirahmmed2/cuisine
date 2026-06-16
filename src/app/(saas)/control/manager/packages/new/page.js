'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TiptapEditor from '@/components/ui/TiptapEditor';

export default function NewPackagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '', description: '', 
    monthly_price: 0, setup_fee: 0,
    max_menu_items: 10, max_orders_per_month: 100, max_tables: 2,
    is_active: true,
    features: []
  });

  useEffect(() => {
    axios.get('/api/control/features', { withCredentials: true })
      .then(res => setAvailableFeatures(res.data.data.features))
      .catch(err => console.error("Failed to load features", err));
  }, []);

  const handleFeatureToggle = (featureId) => {
    setFormData(prev => {
      const isSelected = prev.features.includes(featureId);
      if (isSelected) {
        return { ...prev, features: prev.features.filter(id => id !== featureId) };
      } else {
        return { ...prev, features: [...prev.features, featureId] };
      }
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/control/packages', formData, { withCredentials: true });
      router.push('/control/manager/packages');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create package');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/control/manager/packages" className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
          ← Back
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900">Add New Package</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-custom" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
          <TiptapEditor
            value={formData.description}
            onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
           
          />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Monthly Price ($)</label>
            <input type="number" name="monthly_price" value={formData.monthly_price} onChange={handleChange} className="input-custom" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">One-time Setup Fee ($)</label>
            <input type="number" name="setup_fee" value={formData.setup_fee} onChange={handleChange} className="input-custom" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Menu Items</label>
            <input type="number" name="max_menu_items" value={formData.max_menu_items} onChange={handleChange} className="input-custom" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Orders/mo</label>
            <input type="number" name="max_orders_per_month" value={formData.max_orders_per_month} onChange={handleChange} className="input-custom" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Tables</label>
            <input type="number" name="max_tables" value={formData.max_tables} onChange={handleChange} className="input-custom" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-slate-700">Key Features (Included in plan)</label>
            <Link href="/control/manager/features" className="text-sm font-bold text-pink-600 hover:underline">Manage Features</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {availableFeatures.map(f => (
              <label key={f.feature_id} className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-pink-200 hover:shadow-sm transition-all group">
                <input 
                  type="checkbox" 
                  checked={formData.features.includes(f.feature_id)} 
                  onChange={() => handleFeatureToggle(f.feature_id)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500 focus:ring-offset-2 transition-all accent-pink-600 cursor-pointer" 
                />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors leading-tight">{f.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-8 mt-2 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-pink-600 focus:ring-pink-500 focus:ring-offset-2 transition-all cursor-pointer accent-pink-600" />
            </div>
            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">Is Active</span>
          </label>
        </div>

        <div className="mt-4 pt-6 border-t border-slate-200">
          <button type="submit" disabled={loading} className="btn-custom-primary w-full py-3.5 text-base shadow-sm">
            {loading ? 'Creating Package...' : 'Create Package'}
          </button>
        </div>
      </form>
    </div>
  );
}
