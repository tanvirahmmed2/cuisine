'use client';
import { useState } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '@/components/dashboard/ui';

export function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      await axios.post('/api/public/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mb-4 text-emerald-600">✓</div>
        <h3 className="text-xl font-bold text-emerald-900 mb-2">Message Sent!</h3>
        <p className="text-emerald-700">We've received your message and will get back to you shortly.</p>
        <button onClick={() => setStatus('idle')} className="mt-6 text-emerald-600 font-bold hover:underline">Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm shadow-slate-100/50 flex flex-col gap-5">
      {status === 'error' && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
          {errorMsg}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
          <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone (Optional)</label>
        <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
        <textarea required rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
      </div>
      <button disabled={status === 'loading'} type="submit" className="btn-custom-primary mt-2 w-full flex justify-center items-center h-12">
        {status === 'loading' ? <LoadingSpinner /> : 'Send Message'}
      </button>
    </form>
  );
}
