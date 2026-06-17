'use client'
import { generateReceipt } from '@/lib/database/print'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MdDelete, MdRateReview } from 'react-icons/md'

const DeliveredOrder = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fethcOrders = async () => {
    try {
      const res = await axios.get('/api/order/delivery', { withCredentials: true })
      setOrders(res.data.payload)
    } catch (error) {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fethcOrders() }, [])

  const handleCancel = async (id) => {
    const confirm = window.confirm('Are you sure you want to cancel this order?')
    if (!confirm) return
    try {
      const res = await axios.post('/api/order/cancel', { id }, { withCredentials: true })
      toast.success(res.data.message)
      fethcOrders()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to cancel order")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-7xl mx-auto flex flex-col gap-8'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Delivered Orders</h1>
        <p className='text-gray-500 text-sm'>History of completed transactions.</p>
      </div>

      <div className='w-full flex flex-col gap-4'>
        {orders.length > 0 ? (
          <div className='flex flex-col gap-1.5'>
            <div className='w-full grid grid-cols-12 bg-gray-50/50 p-4 rounded-xl font-semibold text-[10px] uppercase text-gray-400 tracking-widest border border-gray-100'>
              <p className='col-span-1'>ID</p>
              <p className='col-span-2'>Customer</p>
              <p className='col-span-3'>Items</p>
              <p className='col-span-2'>Payment</p>
              <p className='col-span-2'>Total</p>
              <p className='col-span-2 text-right'>Action</p>
            </div>
            
            <div className='flex flex-col gap-1.5'>
              {orders.map((order) => (
                <div key={order.id} className='w-full grid grid-cols-12 p-3 items-center bg-white border border-gray-100 rounded-xl hover:border-pink-500 transition-all group'>
                  <p className='col-span-1 font-mono text-[10px] text-gray-400 uppercase tracking-tighter'>#{String(order.id).padStart(5, '0')}</p>
                  <div className='col-span-2 flex flex-col'>
                    <p className='text-sm font-semibold text-gray-800 line-clamp-1'>{order.name || 'Guest'}</p>
                    <p className='text-[10px] text-gray-400 font-semibold'>{order.phone}</p>
                  </div>
                  <div className='col-span-3 flex flex-col gap-0.5'>
                    {order?.items?.map((item) => (
                      <p key={item.id} className='text-[10px] text-gray-500 line-clamp-1'>
                        {item.quantity}x {item.title}
                      </p>
                    ))}
                  </div>
                  <div className='col-span-2 flex flex-col gap-1'>
                    <span className={`w-fit px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                      order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {order.payment_status}
                    </span>
                    <p className='text-[9px] uppercase font-semibold text-gray-300 tracking-widest'>{order.payment_method}</p>
                  </div>
                  <p className='col-span-2 font-semibold text-gray-900 text-sm'>৳{Number(order.total_price).toLocaleString()}</p>
                  
                  <div className='col-span-2 flex flex-row items-center justify-end gap-1.5'>
                    <Link href={`/dashboard/sales/orders/${order.id}`} className='p-2 text-gray-400 hover:text-pink-600 transition-colors' title="View Detail">
                      <MdRateReview size={18} />
                    </Link>
                    <button className='p-2 text-rose-300 hover:text-rose-600 transition-colors' onClick={() => handleCancel(order.id)} title="Cancel Order">
                      <MdDelete size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='text-center py-24 bg-gray-50/50 rounded-xl border border-dashed border-gray-200'>
            <p className='text-gray-400 text-sm font-medium'>No delivered orders found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeliveredOrder
