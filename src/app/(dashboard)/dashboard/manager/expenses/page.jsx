'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md'
import toast from 'react-hot-toast'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('/api/expense', { withCredentials: true })
      setExpenses(res.data.payload)
    } catch (error) {
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm('This action cannot be undone. Proceed?')
    if (!confirm) return 
    try {
      const res = await axios.delete('/api/expense', { data: { id }, withCredentials: true })
      toast.success(res.data.message)
      fetchExpenses()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete record')
    }
  }

  useEffect(() => { fetchExpenses() }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-6xl mx-auto flex flex-col gap-8'>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Expense Records</h1>
          <p className='text-gray-500 text-sm'>Monitor your business expenditures.</p>
        </div>
        <Link 
          href="/dashboard/manager/new-expense" 
          className='flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white rounded-xl font-semibold text-sm hover:bg-pink-600 transition-all active:scale-[0.98]'
        >
          <MdDeleteOutline size={16} className="rotate-45" />
          <span>New Expense</span>
        </Link>
      </div>

      <div className='w-full flex flex-col gap-4'>
        <div className='w-full grid grid-cols-12 bg-gray-50/50 p-4 rounded-xl font-semibold text-[10px] uppercase text-gray-400 tracking-widest border border-gray-100'>
          <p className='col-span-1'>ID</p>
          <p className='col-span-2'>Date</p>
          <p className='col-span-2'>Title</p>
          <p className='col-span-3'>Note</p>
          <p className='col-span-2'>Amount</p>
          <p className='col-span-2 text-right'>Action</p>
        </div>

        <div className='flex flex-col gap-1.5'>
          {expenses.map((e) => (
            <div key={e.id} className='w-full grid grid-cols-12 p-3 items-center bg-white border border-gray-100 rounded-xl hover:border-pink-500 transition-all group'>
              <p className='col-span-1 text-[10px] font-semibold text-gray-400 uppercase'>#{String(e.id).padStart(4, '0')}</p>
              <p className='col-span-2 text-xs text-gray-500'>{new Date(e.created_at).toLocaleDateString()}</p>
              <p className='col-span-2 font-semibold text-gray-800 text-sm'>{e.title}</p>
              <p className='col-span-3 text-xs text-gray-400 truncate pr-4'>{e.note || '-'}</p>
              <p className='col-span-2 font-semibold text-gray-900 text-sm'>৳{Number(e.amount).toLocaleString()}</p>
              <div className='col-span-2 flex justify-end'>
                <button 
                  onClick={() => handleDelete(e.id)} 
                  className='p-2 text-rose-300 hover:text-rose-600 transition-colors'
                >
                  <MdDeleteOutline size={20}/>
                </button>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className='text-center py-24 bg-gray-50/50 rounded-xl border border-dashed border-gray-200'>
              <p className='text-gray-400 text-sm font-medium'>No expense records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Expenses
