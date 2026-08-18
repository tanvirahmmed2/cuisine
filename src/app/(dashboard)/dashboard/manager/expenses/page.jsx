'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MdDeleteOutline, MdMoreVert } from 'react-icons/md'
import toast from 'react-hot-toast'
import Link from 'next/link'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMenuId, setActiveMenuId] = useState(null)

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
    setActiveMenuId(null)
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
        <div className='w-full grid grid-cols-12 bg-gray-50/50 p-3 sm:p-4 rounded-xl font-semibold text-[10px] uppercase text-gray-400 tracking-widest border border-gray-100 items-center gap-2 sm:gap-3'>
          <div className='col-span-3 sm:col-span-2 md:col-span-1'>ID</div>
          <div className='hidden sm:block sm:col-span-3 md:col-span-2'>Date</div>
          <div className='col-span-5 sm:col-span-4 md:col-span-3'>Title</div>
          <div className='hidden md:block md:col-span-3'>Note</div>
          <div className='col-span-3 sm:col-span-2 md:col-span-2 text-right'>Amount</div>
          <div className='col-span-1 text-right sm:text-center'>Action</div>
        </div>

        <div className='flex flex-col gap-1.5'>
          {expenses.map((e) => {
            const isMenuOpen = activeMenuId === e.id;

            return (
              <div key={e.id} className='w-full grid grid-cols-12 p-3 items-center bg-white border border-gray-100 rounded-xl hover:border-pink-500 transition-all gap-2 sm:gap-3 relative group'>
                <div className='col-span-3 sm:col-span-2 md:col-span-1 text-[10px] sm:text-xs font-semibold text-gray-400 uppercase truncate'>
                  #{String(e.id).padStart(4, '0')}
                </div>

                <div className='hidden sm:block sm:col-span-3 md:col-span-2 text-xs text-gray-500 truncate'>
                  {new Date(e.created_at).toLocaleDateString()}
                </div>

                <div className='col-span-5 sm:col-span-4 md:col-span-3 flex flex-col justify-center min-w-0'>
                  <p className='font-semibold text-gray-800 text-xs sm:text-sm truncate'>{e.title}</p>
                  <p className='sm:hidden text-[9px] text-gray-400 truncate'>{new Date(e.created_at).toLocaleDateString()}</p>
                </div>

                <div className='hidden md:block md:col-span-3 text-xs text-gray-400 truncate pr-4'>
                  {e.note || '-'}
                </div>

                <div className='col-span-3 sm:col-span-2 md:col-span-2 font-semibold text-gray-900 text-xs sm:text-sm text-right truncate'>
                  ৳{Number(e.amount || 0).toLocaleString()}
                </div>

                {/* Three Dot Action Button & Dropdown Menu */}
                <div className='col-span-1 flex justify-end sm:justify-center items-center relative'>
                  <button
                    type='button'
                    onClick={() => setActiveMenuId(isMenuOpen ? null : e.id)}
                    className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer'
                    title='Actions'
                  >
                    <MdMoreVert size={20} />
                  </button>

                  {isMenuOpen && (
                    <>
                      <div 
                        className='fixed inset-0 z-40' 
                        onClick={() => setActiveMenuId(null)}
                      />

                      <div className='absolute right-0 top-10 z-50 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 flex flex-col gap-0.5 text-left text-xs font-semibold animate-in fade-in zoom-in-95 duration-100'>
                        <button
                          type='button'
                          onClick={() => handleDelete(e.id)}
                          className='w-full px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer'
                        >
                          <MdDeleteOutline size={16} />
                          <span>Delete Record</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
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
