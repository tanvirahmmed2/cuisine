'use client'
import { Context } from '@/components/context/Context'
import axios from 'axios'
import Image from 'next/image'
import React, { useContext } from 'react'
import { MdDeleteOutline, MdEdit } from 'react-icons/md'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { FaPlus } from 'react-icons/fa'

const CategorListPage = () => {
  const { categories, fetchCategories } = useContext(Context)

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure to delete this category?')
    if (!confirm) return
    try {
      const res = await axios.delete('/api/category', { data: { id }, withCredentials: true })
      toast.success(res.data.message)
      fetchCategories()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete category")
    }
  }

  return (
    <div className='w-full max-w-4xl mx-auto flex flex-col gap-8'>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Categories</h1>
          <p className='text-gray-500 text-sm'>Organize your menu items into groups.</p>
        </div>
        <Link 
          href="/dashboard/manager/new-category" 
          className='flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white rounded-xl font-semibold text-sm hover:bg-pink-600 transition-all active:scale-[0.98]'
        >
          <FaPlus size={12}/>
          <span>Add Category</span>
        </Link>
      </div>

      <div className='w-full flex flex-col gap-4'>
        {categories && categories.length > 0 ? (
          <div className='flex flex-col gap-1.5'>
            <div className='w-full grid grid-cols-12 bg-gray-50/50 p-4 rounded-xl font-semibold text-[10px] uppercase text-gray-400 tracking-widest border border-gray-100'>
              <p className='col-span-10'>Category Detail</p>
              <p className='col-span-2 text-right'>Action</p>
            </div>
            
            <div className='flex flex-col gap-1.5'>
              {categories.map((cat) => (
                <div key={cat.id} className='w-full grid grid-cols-12 p-3 items-center bg-white border border-gray-100 rounded-xl hover:border-pink-500 transition-all group'>
                  <div className='col-span-10 flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-lg overflow-hidden border border-gray-50'>
                      <Image src={cat?.image} alt={cat?.name} width={40} height={40} className='object-cover w-full h-full'/>
                    </div>
                    <p className='font-semibold text-gray-800 text-sm'>{cat?.name}</p>
                  </div>
                  <div className='col-span-2 flex flex-row items-center justify-end gap-2'>
                    <button className='p-2 text-gray-400 hover:text-pink-600 transition-colors'><MdEdit/></button>
                    <button className='p-2 text-rose-300 hover:text-rose-600 transition-colors' onClick={() => handleDelete(cat.id)}><MdDeleteOutline /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='text-center py-24 bg-gray-50/50 rounded-xl border border-dashed border-gray-200'>
            <p className='text-gray-400 text-sm font-medium'>No categories found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategorListPage
