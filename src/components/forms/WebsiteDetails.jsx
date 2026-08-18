// components/forms/WebsiteDetails.jsx
'use client'
import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import toast from 'react-hot-toast'
import { Context } from '../context/Context'
import { name, tagline } from '@/lib/database/secret'

const WebsiteDetails = () => {
    const { siteData, setSiteData, fetchWebsiteData } = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        address: '',
        open_time: '09:00 AM',
        close_time: '10:00 PM',
        fb_link: '',
        insta_link: '',
        twitter_link: '',
        yt_link: '',
        is_service_available: true
    })

    useEffect(() => {
        if (siteData) {
            setFormData({
                email: siteData.email || '',
                phone: siteData.phone || '',
                address: siteData.address || '',
                open_time: siteData.open_time || '09:00 AM',
                close_time: siteData.close_time || '10:00 PM',
                fb_link: siteData.fb_link || '',
                insta_link: siteData.insta_link || '',
                twitter_link: siteData.twitter_link || '',
                yt_link: siteData.yt_link || '',
                is_service_available: siteData.is_service_available ?? true
            })
        }
    }, [siteData])

    const handleChange = (e) => {
        const { name: fieldName, value, type, checked } = e.target
        setFormData((prev) => ({ 
            ...prev, 
            [fieldName]: type === 'checkbox' ? checked : value 
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post('/api/website', formData, { withCredentials: true })
            toast.success(response.data.message || 'Settings saved successfully')
            if (response.data.payload && setSiteData) {
                setSiteData(response.data.payload)
            } else if (fetchWebsiteData) {
                fetchWebsiteData()
            }
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || 'Failed to update settings')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='p-6 sm:p-8 flex flex-col gap-8'>
            <div className='flex items-center justify-between border-b border-tertiary-dark/10 pb-6'>
                <div>
                    <h2 className='text-xl font-bold text-tertiary-dark'>{name}</h2>
                    <p className='text-sm text-tertiary-dark/60'>{tagline}</p>
                </div>
                <button 
                    type='submit' 
                    disabled={loading}
                    className='px-6 py-2.5 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-md shadow-pink-500/20'
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
            
            <div className='flex flex-col gap-8 max-w-2xl'>
                {/* Service Availability Toggle Box */}
                <div className='bg-gray-50 border border-gray-100 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4'>
                    <div className='flex flex-col gap-0.5'>
                        <span className='font-bold text-sm text-gray-900'>Restaurant Service Availability</span>
                        <p className='text-xs text-gray-500'>
                            {formData.is_service_available 
                                ? 'Service is ONLINE. Customers can place orders.' 
                                : 'Service is OFFLINE. New orders are blocked across the app.'}
                        </p>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer flex-shrink-0'>
                        <input 
                            type='checkbox' 
                            name='is_service_available' 
                            checked={formData.is_service_available} 
                            onChange={handleChange}
                            className='sr-only peer' 
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </div>

                {/* Contact & Location */}
                <div className='flex flex-col gap-4'>
                    <h3 className='text-xs font-bold uppercase text-pink-600 tracking-wider'>Contact & Location Details</h3>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-semibold text-gray-600 uppercase'>Email Address</label>
                            <input type="email" name='email' value={formData.email} required onChange={handleChange} className='input-style' />
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-semibold text-gray-600 uppercase'>Phone Number</label>
                            <input type="text" name='phone' value={formData.phone} required onChange={handleChange} className='input-style' />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-xs font-semibold text-gray-600 uppercase'>Street Address</label>
                        <input type="text" name='address' value={formData.address} required onChange={handleChange} className='input-style' />
                    </div>
                </div>

                {/* Operating Hours */}
                <div className='flex flex-col gap-4'>
                    <h3 className='text-xs font-bold uppercase text-pink-600 tracking-wider'>Operating Hours</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-semibold text-gray-600 uppercase'>Opening Time</label>
                            <input type="text" name='open_time' value={formData.open_time} placeholder="e.g. 09:00 AM" onChange={handleChange} className='input-style' />
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-semibold text-gray-600 uppercase'>Closing Time</label>
                            <input type="text" name='close_time' value={formData.close_time} placeholder="e.g. 10:00 PM" onChange={handleChange} className='input-style' />
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className='flex flex-col gap-4'>
                    <h3 className='text-xs font-bold uppercase text-pink-600 tracking-wider'>Social Media Profiles</h3>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-semibold text-gray-600 uppercase'>Facebook Page Link</label>
                            <input type="url" name='fb_link' value={formData.fb_link} placeholder="https://facebook.com/..." onChange={handleChange} className='input-style'/>
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-semibold text-gray-600 uppercase'>Instagram Link</label>
                            <input type="url" name='insta_link' value={formData.insta_link} placeholder="https://instagram.com/..." onChange={handleChange} className='input-style'/>
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-semibold text-gray-600 uppercase'>Twitter / X Link</label>
                            <input type="url" name='twitter_link' value={formData.twitter_link} placeholder="https://twitter.com/..." onChange={handleChange} className='input-style'/>
                        </div>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-semibold text-gray-600 uppercase'>YouTube Channel Link</label>
                            <input type="url" name='yt_link' value={formData.yt_link} placeholder="https://youtube.com/..." onChange={handleChange} className='input-style'/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default WebsiteDetails
