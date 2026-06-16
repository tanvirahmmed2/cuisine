'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '@/components/dashboard/ui';

export default function CustomerReviewPage() {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchReview();
  }, []);

  const fetchReview = async () => {
    try {
      const res = await axios.get('/api/customer/reviews');
      if (res.data.data.review) {
        setReview(res.data.data.review);
        setFormData({ rating: res.data.data.review.rating, comment: res.data.data.review.comment });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/customer/reviews', formData);
      alert('Review submitted successfully! It will be visible after approval.');
      fetchReview();
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Rate Your Experience</h1>
      <p className="text-slate-500 mb-8">Leave a review for the Cuisine platform. Your feedback helps us improve!</p>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        {review?.is_approved && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm mb-4 border border-emerald-100 flex items-center gap-2">
            <span className="font-bold">✓ Approved</span> Your review is public.
          </div>
        )}
        {review && !review.is_approved && (
          <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-sm mb-4 border border-amber-100 flex items-center gap-2">
            <span className="font-bold">⏳ Pending Approval</span> Your review is waiting for a manager to approve it.
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({...formData, rating: star})}
                className={`text-3xl ${star <= formData.rating ? 'text-yellow-400' : 'text-slate-200'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Your Review</label>
          <textarea 
            required 
            rows={5} 
            value={formData.comment} 
            onChange={e => setFormData({...formData, comment: e.target.value})} 
            className="input-custom"
           
          />
        </div>

        {review?.reply && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Reply from Cuisine:</div>
            <p className="text-sm text-slate-700">{review.reply}</p>
          </div>
        )}

        <button disabled={saving} type="submit" className="w-full btn-custom-primary">
          {saving ? 'Saving...' : (review ? 'Update Review' : 'Submit Review')}
        </button>
      </form>
    </div>
  );
}
