'use client'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { Context } from '../context/Context'

const AddCategoryForm = () => {
    const {fetchCategories}= useContext(Context)
    const [formData, setFormData]=useState({
        name:'',
        image:null
    })
    const handleChange=(e)=>{
        const { name, value, files } = e.target
        if (files) {
            setFormData({ ...formData, image: files[0] })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const data= new FormData()
            data.append('name', formData.name)
            data.append('image', formData.image)
            const res= await axios.post('/api/category', data, {withCredentials:true})
            toast.success(res.data.message)
            fetchCategories()
            e.target.reset()
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add category')
            
        }
    }
  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col items-center justify-center gap-4 text-tertiary-dark'>
        <h1 className='text-3xl font-semibold text-center text-tertiary-dark'>New Category</h1>
        <div className='w-full flex flex-col gap-1'>
            <label htmlFor="name" className='text-xs font-semibold text-tertiary-dark/80'>Name</label>
            <input type="text" name='name' id='name' onChange={handleChange} value={formData.name} required className='input-style' />
        </div>
        <div className='w-full flex flex-col gap-1'>
            <label htmlFor="image" className='text-xs font-semibold text-tertiary-dark/80'>Image</label>
            <input type="file" name='image' id='image' required onChange={handleChange} className='input-style file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tertiary-dark/10 file:text-tertiary-dark hover:file:bg-tertiary-dark/20'/>
        </div>
        <button className='bg-primary text-tertiary-light py-2 px-8 font-bold hover:bg-primary-dark cursor-pointer rounded-xl transition-all'>Submit</button>
      
    </form>
  )
}

export default AddCategoryForm
