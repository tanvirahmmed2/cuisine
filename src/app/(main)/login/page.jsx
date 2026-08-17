'use client'
import { Context } from '@/components/context/Context'
import LoginForm from '@/components/forms/LoginForm'
import { motion } from 'framer-motion'
import React, { useContext } from 'react'

import { name } from '@/lib/database/secret'

const Login = () => {
    return (
        <div className='w-full min-h-screen bg-tertiary-dark/5 flex items-center justify-center p-6'>
            
            <div className="absolute top-0 left-0 w-1/3 h-full bg-tertiary-light -z-10" />

            <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
                
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.8 }} 
                    className='hidden lg:flex flex-col gap-6 order-last lg:order-first'
                >
                    
                    <h1 className='text-6xl font-semibold text-tertiary-dark leading-[1.1] tracking-tight'>
                        Welcome to <br />
                        <span className='text-primary'>{name}</span>
                    </h1>
                    <p className='text-tertiary-dark/60 text-lg font-medium max-w-sm leading-relaxed'>
                        Login to access your profile, manage your reservations, and explore our curated seasonal menu.
                    </p>
                    
                   
                </motion.div>

                <div className="flex justify-center lg:justify-start">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default Login
