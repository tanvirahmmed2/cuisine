'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { RiCloseLine, RiChatQuoteLine, RiStarFill } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import TiptapEditor from '../forms/TiptapEditor'
import ReviewCard from '../card/ReviewCard'
import Link from 'next/link'

const Review = ({ initialReviews = [] }) => {
    const [reviews, setReviews] = useState(initialReviews)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        comment: '',
        rating: 5
    })

    const fetchReviews = async () => {
        try {
            const res = await axios.get('/api/review', { withCredentials: true })
            setReviews(res.data.payload || [])
        } catch (error) {
            setReviews([])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post('/api/review', formData)
            toast.success(res.data.message)
            setIsFormOpen(false)
            setFormData({ name: '', email: '', comment: '', rating: 5 })
            fetchReviews()
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='w-full py-32 bg-tertiary-light overflow-hidden border-t border-tertiary-dark/10'>
            <div className='max-w-7xl mx-auto px-6'>
                
                <div className='flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20'>
                    <div className='space-y-4'>
                        <div className='flex items-center gap-3 text-primary font-sans font-bold uppercase tracking-[0.4em] text-[10px]'>
                            <RiChatQuoteLine className='text-lg' />
                            Testimonials
                        </div>
                        <h2 className='text-5xl md:text-6xl font-serif text-tertiary-dark tracking-tight'>
                            Guest <span className='font-normal text-tertiary-dark/40'>Voices</span>
                        </h2>
                    </div>
                    
                    <div className='flex items-center gap-4'>
                        <Link 
                            href='/reviews'
                            className='group relative px-8 py-4 bg-tertiary-dark/5 text-tertiary-dark rounded-full font-sans font-bold text-[10px] uppercase tracking-widest hover:bg-tertiary-dark/10 transition-all active:scale-95'
                        >
                            See All
                        </Link>
                        <button 
                            onClick={() => setIsFormOpen(true)}
                            className='group relative px-8 py-4 border border-tertiary-dark/20 text-tertiary-dark rounded-full font-sans font-bold text-[10px] uppercase tracking-widest hover:bg-tertiary-dark hover:text-tertiary-light transition-all active:scale-95'
                        >
                            Share Story
                        </button>
                    </div>
                </div>

                {reviews.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {reviews.slice(0, 8).map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                ) : (
                    <div className='h-[200px] flex items-center justify-center text-tertiary-dark/40 font-serif text-xl bg-tertiary-dark/5 rounded-[2rem]'>
                        Awaiting your first story...
                    </div>
                )}
            </div>

            {/* Review Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className='fixed inset-0 z-[100] flex items-center justify-center p-6'>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className='absolute inset-0 bg-tertiary-dark/20 backdrop-blur-md'
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className='relative w-full max-w-lg bg-tertiary-light rounded-[2.5rem] shadow-2xl overflow-hidden'
                        >
                            <div className='p-8 border-b border-tertiary-dark/10 flex items-center justify-between'>
                                <div>
                                    <h3 className='text-2xl font-serif text-tertiary-dark'>Your Experience</h3>
                                    <p className='text-[10px] uppercase tracking-[0.2em] text-tertiary-dark/60 font-bold mt-1'>We value your feedback</p>
                                </div>
                                <button 
                                    onClick={() => setIsFormOpen(false)}
                                    className='w-12 h-12 flex items-center justify-center bg-tertiary-dark/5 text-tertiary-dark/60 hover:text-tertiary-dark rounded-2xl transition-all'
                                >
                                    <RiCloseLine size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className='p-8 space-y-6'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-2'>
                                        <label className='text-[10px] font-bold uppercase tracking-widest text-tertiary-dark/60 ml-1'>Name</label>
                                        <input 
                                            required
                                            type='text' 
                                            className='input-style'
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <label className='text-[10px] font-bold uppercase tracking-widest text-tertiary-dark/60 ml-1'>Email</label>
                                        <input 
                                            required
                                            type='email' 
                                            className='input-style'
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-[10px] font-bold uppercase tracking-widest text-tertiary-dark/60 ml-1'>Rating</label>
                                    <div className='flex gap-2 p-2'>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type='button'
                                                onClick={() => setFormData({...formData, rating: star})}
                                                className={`text-2xl transition-all ${star <= formData.rating ? 'text-secondary scale-110' : 'text-tertiary-dark/20 hover:text-tertiary-dark/40'}`}
                                            >
                                                <RiStarFill />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-[10px] font-bold uppercase tracking-widest text-tertiary-dark/60 ml-1'>Comment</label>
                                    <TiptapEditor 
                                        content={formData.comment}
                                        onChange={(html) => setFormData({...formData, comment: html})}
                                    />
                                </div>

                                <button 
                                    disabled={loading}
                                    type='submit'
                                    className='w-full py-5 bg-primary text-tertiary-light rounded-2xl font-sans font-bold text-xs uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/10 active:scale-[0.98] disabled:opacity-50'
                                >
                                    {loading ? 'Submitting...' : 'Send Review'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default Review