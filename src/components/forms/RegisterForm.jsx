'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaUser, FaPhone, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa'

const RegisterForm = () => {
    const [loading, setLoading] = useState(false)
    const [registered, setRegistered] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
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
            const res = await axios.post('/api/user', formData, { withCredentials: true })
            toast.success(res.data.message)
            setRegistered(true)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }
    if (registered) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }} 
                className='flex-1 w-full max-w-md bg-tertiary-light p-10 rounded-xl border border-tertiary-dark/10 text-center space-y-6 flex flex-col items-center justify-center'
            >
                <div className='w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold'>✉</div>
                <h2 className='text-3xl font-semibold text-tertiary-dark tracking-tight'>Verify your email</h2>
                <p className='text-tertiary-dark/60 text-sm leading-relaxed'>
                    We've sent a verification link to <strong className="text-tertiary-dark">{formData.email}</strong>. 
                    Please check your inbox and click the link to verify your account.
                </p>
                <Link href='/login' className='inline-block w-full py-4 bg-primary text-tertiary-light rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-primary-dark transition-all text-center'>
                    Go to Login
                </Link>
            </motion.div>
        )
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className='flex-1 w-full max-w-md'
        >
            <form onSubmit={handleSubmit} className='flex flex-col gap-8 bg-tertiary-light p-10 rounded-xl border border-tertiary-dark/10'>
                <div className='space-y-2'>
                    <div className='inline-block px-3 py-1 bg-tertiary-dark/5 text-tertiary-dark/60 text-[10px] font-semibold uppercase tracking-widest rounded-full'>
                        New Account
                    </div>
                    <h2 className='text-3xl font-semibold text-tertiary-dark tracking-tight'>Join the experience.</h2>
                    <p className='text-tertiary-dark/60 text-xs font-medium'>Experience culinary excellence at your fingertips.</p>
                </div>

                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="name" className='text-[10px] font-semibold uppercase text-tertiary-dark/60 tracking-widest ml-1'>Full Name</label>
                        <input 
                            type="text" 
                            name='name' 
                            id='name' 
                            required 
                            onChange={handleChange} 
                            value={formData.name} 
                            className='input-style'
                        />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="phone" className='text-[10px] font-semibold uppercase text-tertiary-dark/60 tracking-widest ml-1'>Phone Number</label>
                        <input 
                            type="text" 
                            name='phone' 
                            id='phone' 
                            onChange={handleChange} 
                            value={formData.phone} 
                            required 
                            className='input-style'
                        />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="email" className='text-[10px] font-semibold uppercase text-tertiary-dark/60 tracking-widest ml-1'>Email Address</label>
                        <input 
                            type="email" 
                            name='email' 
                            id='email' 
                            onChange={handleChange} 
                            required 
                            value={formData.email} 
                            className='input-style'
                        />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="password" className='text-[10px] font-semibold uppercase text-tertiary-dark/60 tracking-widest ml-1'>Secure Password</label>
                        <input 
                            type="password" 
                            name='password' 
                            onChange={handleChange} 
                            id='password' 
                            value={formData.password} 
                            required 
                            className='input-style'
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 pt-2">
                    <button 
                        type='submit' 
                        disabled={loading}
                        className='w-full py-4 bg-primary text-tertiary-light rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-primary-dark transition-all active:scale-[0.98] shadow-xl shadow-primary/10 disabled:opacity-50'
                    >
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </button>

                    <p className='text-center text-xs text-tertiary-dark/60 font-medium'>
                        Already registered? <Link href='/login' className='text-tertiary-dark font-semibold hover:underline'>Sign In</Link>
                    </p>
                </div>
            </form>
        </motion.div>
    )
}

export default RegisterForm
