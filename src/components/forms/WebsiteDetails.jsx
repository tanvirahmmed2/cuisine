// components/forms/WebsiteDetails.jsx
'use client'
import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import toast from 'react-hot-toast'
import { Context } from '../context/Context'
import { name, tagline } from '@/lib/database/secret'

const WebsiteDetails = () => {
    const { siteData } = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        address: '',
        sociallink: ''
    })

    useEffect(() => {
        if (siteData) {
            setFormData({
                email: siteData.email || '',
                phone: siteData.phone || '',
                address: siteData.address || '',
                sociallink: siteData.sociallink || ''
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
            toast.success(response.data.message)
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || 'Failed to update settings')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='p-8 flex flex-col gap-8'>
            <div className='flex items-center justify-between border-b border-tertiary-dark/10 pb-6'>
                <div>
                    <h2 className='text-xl font-bold text-tertiary-dark'>{name}</h2>
                    <p className='text-sm text-tertiary-dark/60'>{tagline}</p>
                </div>
                <button 
                    type='submit' 
                    disabled={loading}
                    className='px-6 py-2 bg-primary text-tertiary-light rounded-xl font-bold hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50'
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
            
            <div className='flex flex-col gap-6 max-w-2xl'>
                <h3 className='text-xs font-bold uppercase text-primary tracking-wider'>Contact & Location Details</h3>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex flex-col gap-1'>
                        <label className='text-xs font-bold text-tertiary-dark/60 uppercase'>Email</label>
                        <input type="email" name='email' value={formData.email} required onChange={handleChange} className='input-style' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-xs font-bold text-tertiary-dark/60 uppercase'>Phone</label>
                        <input type="text" name='phone' value={formData.phone} required onChange={handleChange} className='input-style' />
                    </div>
                </div>

                <div className='flex flex-col gap-1'>
                    <label className='text-xs font-bold text-tertiary-dark/60 uppercase'>Street Address</label>
                    <input type="text" name='address' value={formData.address} required onChange={handleChange} className='input-style' />
                </div>

                <div className='flex flex-col gap-1'>
                    <label className='text-xs font-bold text-tertiary-dark/60 uppercase'>Social Link</label>
                    <input type="text" name='sociallink' value={formData.sociallink} onChange={handleChange} className='input-style'/>
                </div>
            </div>
        </form>
    )
}

export default WebsiteDetails
