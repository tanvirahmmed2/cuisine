'use client'
import { Context } from '@/components/context/Context'
import LoginForm from '@/components/forms/LoginForm'
import { motion } from 'framer-motion'
import React, { useContext } from 'react'

const Login = () => {
    const { siteData } = useContext(Context)
    return (
        <div className='w-full min-h-screen bg-gray-50 flex items-center justify-center p-6'>
            
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-1/3 h-full bg-white -z-10" />

            <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
                
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.8 }} 
                    className='hidden lg:flex flex-col gap-6 order-last lg:order-first'
                >
                    <div className='inline-block w-fit px-4 py-1 bg-pink-500 text-white text-[10px] font-semibold uppercase tracking-widest rounded-full'>
                        {siteData?.name || 'Grand Kitchen'}
                    </div>
                    <h1 className='text-6xl font-semibold text-gray-900 leading-[1.1] tracking-tight'>
                        Welcome to <br />
                        <span className='text-gray-300 italic'>Premium Dining</span>
                    </h1>
                    <p className='text-gray-500 text-lg font-medium max-w-sm leading-relaxed'>
                        Sign in to access your profile, manage your reservations, and explore our curated seasonal menu.
                    </p>
                    
                    <div className='flex items-center gap-4 mt-4'>
                        <div className='w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm'>
                            <div className='w-2 h-2 bg-emerald-500 rounded-full' />
                        </div>
                        <p className='text-xs font-semibold text-gray-400 uppercase tracking-widest'>System Secure</p>
                    </div>
                </motion.div>

                <div className="flex justify-center lg:justify-start">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default Login
