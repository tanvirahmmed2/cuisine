'use client'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const StaffLoginForm = () => {
    const [formData, setFormData]= useState({
        email:"",
        password:''
    })
    
    const handleChange=(e)=>{
        const {name, value}= e.target
        setFormData((prev)=>({...prev, [name]:value}))
    }

    const loginHandle=async (e) => {
        e.preventDefault()
        try {
            const response= await axios.post('/api/user/login', formData, {withCredentials:true})
            toast.success(response.data.message)
            window.location.replace('/manage')
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
            
        }
        
    }
  return (
    <form onSubmit={loginHandle} className='flex-1 flex flex-col gap-4'>
          <div className='w-full flex flex-col text-tertiary-dark'>
            <label htmlFor="email" className='text-xs font-semibold text-tertiary-dark/80 mb-1'>Email</label>
            <input type="email" id='email' name='email' required value={formData.email} onChange={handleChange} className='input-style'/>
          </div>
          <div className='w-full flex flex-col text-tertiary-dark'>
            <label htmlFor="password" className='text-xs font-semibold text-tertiary-dark/80 mb-1'>Password</label>
            <input type="password" id='password' name='password' required value={formData.password} onChange={handleChange} className='input-style'/>
          </div>
          <button type='submit' className='bg-primary/90 hover:bg-primary text-tertiary-light py-3 rounded-lg font-bold transition-all cursor-pointer'>Next</button>
        </form>
  )
}

export default StaffLoginForm
