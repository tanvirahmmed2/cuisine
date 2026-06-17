'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MdStar, MdDelete, MdRateReview } from 'react-icons/md'
import toast from 'react-hot-toast'

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/api/review', { withCredentials: true })
      setReviews(res.data.payload || [])
    } catch (error) {
      console.error("Failed to fetch reviews", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return

    try {
      const res = await axios.delete('/api/review', { 
        data: { id },
        withCredentials: true 
      })
      toast.success(res.data.message)
      setReviews(reviews.filter(r => r.id !== id))
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete review")
    }
  }

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <MdStar key={i} className={`text-sm ${i < rating ? 'text-amber-400' : 'text-gray-100'}`} />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Customer Reviews</h1>
        <p className="text-gray-500 text-sm">Manage feedback and testimonials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col justify-between gap-4 group hover:border-pink-500 transition-all">
              
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{review.name}</h3>
                    <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-xl relative border border-gray-50">
                  <p className="text-gray-600 text-xs italic leading-relaxed">&quot;{review.comment}&quot;</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">{review.email}</p>
                <button 
                  onClick={() => handleDelete(review.id)}
                  className="p-1.5 text-rose-300 hover:text-rose-600 transition-colors"
                  title="Delete Review"
                >
                  <MdDelete size={18} />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center flex flex-col items-center gap-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <MdRateReview size={32} className="text-gray-300" />
            <p className="text-gray-400 text-sm font-medium">No reviews received yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewsPage
