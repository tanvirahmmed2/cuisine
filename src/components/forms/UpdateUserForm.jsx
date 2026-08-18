'use client'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Context } from '../context/Context'
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa'

const UpdateUserForm = () => {
    const { userData } = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const cleanedPhone = formData.phone ? formData.phone.replace(/\D/g, '').slice(-11) : '';
            const payload = { ...formData, phone: cleanedPhone || formData.phone };
            const res = await axios.patch('/api/user', payload, { withCredentials: true })
            toast.success(res.data.message)
            window.location.replace('/profile')
        } catch (error) {
            toast.error(error?.response?.data?.message || "Update failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6'>
            <div className='flex flex-col gap-5'>
                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="name" className='text-[10px] font-black uppercase text-tertiary-dark/60 tracking-widest ml-1'>Display Name</label>
                    <div className='relative'>
                        <FaUser className='absolute left-4 top-1/2 -translate-y-1/2 text-tertiary-dark/40' />
                        <input 
                            type="text" 
                            name='name' 
                            id='name' 
                            required 
                            onChange={handleChange} 
                            value={formData.name} 
                            className='input-style pl-12' 
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="email" className='text-[10px] font-black uppercase text-tertiary-dark/60 tracking-widest ml-1'>Email Address</label>
                    <div className='relative'>
                        <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-tertiary-dark/40' />
                        <input 
                            type="email" 
                            name='email' 
                            id='email' 
                            onChange={handleChange} 
                            required 
                            value={formData.email} 
                            className='input-style pl-12' 
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="phone" className='text-[10px] font-black uppercase text-tertiary-dark/60 tracking-widest ml-1'>Contact Number</label>
                    <div className='relative'>
                        <FaPhone className='absolute left-4 top-1/2 -translate-y-1/2 text-tertiary-dark/40' />
                        <input 
                            type="tel" 
                            name='phone' 
                            id='phone' 
                            maxLength={11}
                            placeholder="e.g. 01712345678"
                            onChange={handleChange} 
                            required 
                            value={formData.phone} 
                            className='input-style pl-12' 
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="password" className='text-[10px] font-black uppercase text-tertiary-dark/60 tracking-widest ml-1'>New Password (Optional)</label>
                    <div className='relative'>
                        <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-tertiary-dark/40' />
                        <input 
                            type="password" 
                            name='password' 
                            onChange={handleChange} 
                            id='password' 
                            value={formData.password} 
                            placeholder="Leave blank to keep current password"
                            className='input-style pl-12' 
                        />
                    </div>
                </div>
            </div>

            <button 
                type='submit'
                disabled={loading}
                className='w-full py-4 bg-primary text-tertiary-light rounded-2xl font-black text-sm hover:bg-primary-dark transition-all active:scale-[0.98] mt-4 disabled:opacity-50'
            >
                {loading ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
            </button>
        </form>
    )
}

export default UpdateUserForm
