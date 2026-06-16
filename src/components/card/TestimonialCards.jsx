'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
export function TestimonialCards() {
  
  const fetchUrl = '/api/public/testimonials';
  const [data, setData] = __useState(null);
  const [loading, setLoading] = __useState(true);
  const [error, setError] = __useState(null);

  const fetchData = __useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(fetchUrl, { withCredentials: true });
      setData(res.data);
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

  if (loading) return <div className="text-center p-12 text-text-3 font-semibold">Loading stories...</div>;
  
  const testimonials = data?.data?.testimonials || [];
  if (error || testimonials.length === 0) return <div className="text-center p-12 text-text-3 font-semibold">No testimonials found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
      {testimonials.map((t, index) => (
        <div key={t.id || index} className="group relative border border-slate-200 rounded-2xl p-8 flex flex-col gap-6 bg-white shadow-sm hover:shadow-md hover:border-pink-200 hover:-translate-y-1 transition-all duration-300" style={{ animationDelay: `${index * 0.15}s` }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-50 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-warning text-sm tracking-wide">
            {'★'.repeat(t.rating || 5)}
          </div>
          <p className="text-[15px] text-slate-600 leading-relaxed italic flex-1 relative z-10 font-medium">
            "{t.message}"
          </p>
          <div className="flex items-center gap-4 pt-5 border-t border-slate-100/80">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-md">
              {t.name ? t.name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="text-xs font-bold text-text">{t.name || 'User'}</div>
              <div className="text-[10px] font-bold text-text-3 tracking-wider uppercase mt-0.5">{t.role || 'Customer'} · {t.company || 'Cuisine'}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
