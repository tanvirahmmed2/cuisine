'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { generateReceipt } from '@/lib/database/print'
import { MdHistory, MdMoreVert, MdPrint, MdVisibility, MdDeleteSweep } from 'react-icons/md'

const AdminHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMenuId, setActiveMenuId] = useState(null)

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/order', { withCredentials: true })
      setOrders(res.data.payload || [])
    } catch (error) {
      console.error("Failed to fetch history", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleDelete = async (id) => {
    setActiveMenuId(null)
    const confirmAction = window.confirm('Are you sure you want to delete this order record?')
    if (!confirmAction) return
    try {
      const res = await axios.delete('/api/order', { data: { id }, withCredentials: true })
      toast.success(res.data.message)
      fetchHistory()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete order")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Order History</h1>
        <p className="text-gray-500 text-sm">Overview of all purchases, payments, and delivered orders.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className='grid grid-cols-12 bg-gray-50/50 p-3 sm:p-4 rounded-xl font-bold text-[10px] uppercase text-gray-500 tracking-wider items-center gap-2 sm:gap-3 border-b border-gray-100'>
          <div className='col-span-3 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1'>Order ID</div>
          <div className='col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-2 xl:col-span-2'>Customer</div>
          <div className='hidden md:block md:col-span-3 lg:col-span-3 xl:col-span-3'>Items</div>
          <div className='hidden sm:block sm:col-span-2 md:col-span-2 lg:col-span-1 xl:col-span-1 text-center'>Note</div>
          <div className='col-span-3 sm:col-span-3 md:col-span-2 lg:col-span-2 xl:col-span-2 text-right'>Total Price</div>
          <div className='hidden xl:block xl:col-span-1 text-right'>Discount</div>
          <div className='hidden lg:block lg:col-span-2 xl:col-span-1 text-right'>Paid</div>
          <div className='col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1 text-center'>Actions</div>
        </div>

        <div className="flex flex-col divide-y divide-gray-50">
          {orders.length > 0 ? (
            orders.map((order) => {
              const isMenuOpen = activeMenuId === order.id;

              return (
                <div key={order.id} className="grid grid-cols-12 gap-2 sm:gap-4 p-3 sm:p-4 items-center hover:bg-gray-50 transition-colors relative">
                  {/* 1. Order ID */}
                  <div className='col-span-3 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1 font-mono font-bold text-pink-600 text-xs truncate'>
                    <span>#{String(order.id).padStart(5, '0')}</span>
                  </div>

                  {/* 2. Customer */}
                  <div className='col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-2 xl:col-span-2 flex flex-col justify-center min-w-0'>
                    <span className='font-bold text-xs text-gray-800 truncate'>{order.name || 'Guest'}</span>
                    <span className='text-[10px] text-gray-400 font-mono truncate'>{order.phone}</span>
                  </div>

                  {/* 3. Items */}
                  <div className='hidden md:flex md:col-span-3 lg:col-span-3 xl:col-span-3 flex-col gap-0.5 min-w-0'>
                    {order?.items?.map((item) => (
                      <span key={item.id} className='text-xs text-gray-600 truncate' title={`${item.quantity}x ${item.title}`}>
                        {item.quantity}x {item.title}
                      </span>
                    ))}
                  </div>

                  {/* 4. Note */}
                  <div className='hidden sm:flex sm:col-span-2 md:col-span-2 lg:col-span-1 xl:col-span-1 items-center justify-center'>
                    <span 
                      className={`inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] font-bold truncate max-w-full ${
                        order.note 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300/50' 
                          : 'bg-gray-100 text-gray-500'
                      }`}
                      title={order.note || (order.table_no && order.table_no !== 'N/A' ? `Table ${order.table_no}` : 'None')}
                    >
                      {order.note || (order.table_no && order.table_no !== 'N/A' ? `Table ${order.table_no}` : 'None')}
                    </span>
                  </div>

                  {/* 5. Total Price */}
                  <div className='col-span-3 sm:col-span-3 md:col-span-2 lg:col-span-2 xl:col-span-2 font-bold text-gray-900 text-xs text-right flex items-center justify-end truncate'>
                    <span>৳{Number(order.total_price || 0).toLocaleString()}</span>
                  </div>

                  {/* 6. Discount */}
                  <div className='hidden xl:flex xl:col-span-1 font-semibold text-rose-500 text-xs text-right items-center justify-end truncate'>
                    <span>৳{Number(order.total_discount || 0).toLocaleString()}</span>
                  </div>

                  {/* 7. Total Paid */}
                  <div className='hidden lg:flex lg:col-span-2 xl:col-span-1 font-bold text-emerald-700 text-xs text-right items-center justify-end truncate'>
                    <span>৳{Number(order.paid_amount || 0).toLocaleString()}</span>
                  </div>

                  {/* 8. Actions (Three Dot Button & Dropdown Menu) */}
                  <div className='col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1 flex items-center justify-end sm:justify-center relative'>
                    <button
                      type='button'
                      onClick={() => setActiveMenuId(isMenuOpen ? null : order.id)}
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

                        <div className='absolute right-0 top-10 z-50 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 flex flex-col gap-0.5 text-left text-xs font-semibold animate-in fade-in zoom-in-95 duration-100'>
                          <button
                            type='button'
                            onClick={() => { setActiveMenuId(null); generateReceipt(order); }}
                            className='w-full px-3 py-2 text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-2 cursor-pointer'
                          >
                            <MdPrint size={16} />
                            <span>Print Receipt</span>
                          </button>

                          <Link
                            href={`/dashboard/sales/orders/${order.id}`}
                            onClick={() => setActiveMenuId(null)}
                            className='w-full px-3 py-2 text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center gap-2 cursor-pointer'
                          >
                            <MdVisibility size={16} />
                            <span>View Details</span>
                          </Link>

                          <div className='border-t border-gray-100 my-0.5' />

                          <button
                            type='button'
                            onClick={() => handleDelete(order.id)}
                            className='w-full px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer'
                          >
                            <MdDeleteSweep size={16} />
                            <span>Delete Record</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <MdHistory size={48} className="text-gray-300" />
              <p className="text-gray-500 font-medium">No history records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminHistory
