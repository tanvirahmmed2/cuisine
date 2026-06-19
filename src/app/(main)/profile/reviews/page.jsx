'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '@/components/context/Context'
import { RiStarFill } from 'react-icons/ri'
import { MdCheckCircle } from 'react-icons/md'
import TiptapEditor from '@/components/forms/TiptapEditor'
import axios from 'axios'
import toast from 'react-hot-toast'

const ReviewsPage = () => {
  const { userData } = useContext(Context)
  const [myReview, setMyReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
    rating: 5
  })

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || ''
      }))
    }
  }, [userData])

  const checkMyReview = async () => {
    try {
      const res = await axios.get('/api/review', { withCredentials: true })
      const allReviews = res.data.payload || []
      const userReview = allReviews.find(r => r.email === userData?.email)
      if (userReview) {
        setMyReview(userReview)
      } else {
        setMyReview(null)
      }
    } catch (error) {
      console.error("Failed to check reviews", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userData?.email) {
      checkMyReview()
    }
  }, [userData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.comment || formData.comment === '<p></p>') {
      toast.error("Please add a comment for your review")
      return
    }
    setSubmitting(true)
    try {
      const res = await axios.post('/api/review', formData)
      toast.success(res.data.message)
      checkMyReview()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Review</h1>
        <p className="text-gray-500 text-sm mt-1">Share your dining experiences and thoughts with us.</p>
      </div>

      <div>
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500"></div>
          </div>
        ) : myReview ? (
          /* Already submitted a review */
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-5 max-w-2xl">
            <div className="flex items-center gap-3 text-emerald-600">
              <MdCheckCircle size={28} />
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-tight">Thank you for sharing your feedback!</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">We have received your testimonial.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 relative space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">{myReview.name}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{myReview.email}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <RiStarFill
                      key={i}
                      className={`text-xs ${i < myReview.rating ? 'text-amber-400' : 'text-gray-100'}`}
                    />
                  ))}
                </div>
              </div>
              <div
                className="prose prose-sm prose-slate text-gray-600 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: myReview.comment }}
              />
            </div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
              To update or delete this review, please contact the restaurant manager.
            </p>
          </div>
        ) : (
          /* Submit a new review form */
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Display Name</label>
                  <input
                    required
                    type="text"
                    disabled
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-pink-500/20 transition-all text-gray-400 cursor-not-allowed font-medium"
                    value={formData.name}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    disabled
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-pink-500/20 transition-all text-gray-400 cursor-not-allowed font-medium"
                    value={formData.email}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Rating</label>
                <div className="flex gap-1.5 p-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-2xl transition-all ${
                        star <= formData.rating ? 'text-amber-400 scale-110' : 'text-gray-200 hover:text-gray-300'
                      }`}
                    >
                      <RiStarFill />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Comment</label>
                <TiptapEditor
                  content={formData.comment}
                  onChange={(html) => setFormData({ ...formData, comment: html })}
                />
              </div>

              <button
                disabled={submitting}
                type="submit"
                className="w-full py-3 bg-gray-900 hover:bg-pink-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewsPage
