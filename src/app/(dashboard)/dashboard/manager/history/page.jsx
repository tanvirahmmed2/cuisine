'use client'
import { generateReceipt } from '@/lib/database/print'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState, useContext } from 'react'
import toast from 'react-hot-toast'
import { Context } from '@/components/context/Context'
import { MdHistory, MdPrint, MdVisibility, MdDeleteSweep } from 'react-icons/md'

const DeliveredOrder = () => {
  const { siteData } = useContext(Context)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/order', { withCredentials: true })
      setOrders(res.data.payload || [])
    } catch (error) {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this order record?')
    if (!confirm) return
    try {
      const res = await axios.delete('/api/order', { data: { id }, withCredentials: true })
      toast.success(res.data.message)
      fetchOrders()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete order")
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
    <div className='w-full flex flex-col gap-10'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Order History</h1>
        <p className='text-gray-500 text-sm'>Review and manage completed fulfillment records.</p>
      </div>

      <div className='w-full border border-gray-100 rounded-xl overflow-hidden'>
        <div className='grid grid-cols-12 gap-4 p-4 bg-gray-50/50 text-[10px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100'>
          <p className='col-span-2'>Order & Date</p>
          <p className='col-span-2'>Customer</p>
          <p className='col-span-3'>Items</p>
          <p className='col-span-1 text-center'>Payment</p>
          <p className='col-span-1 text-center'>Status</p>
          <p className='col-span-1 text-right'>Total</p>
          <p className='col-span-2 text-right'>Actions</p>
        </div>

        <div className='flex flex-col divide-y divide-gray-50 bg-white'>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className='grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/50 transition-colors group'>
                <div className='col-span-2'>
                  <p className='font-semibold text-gray-900 text-sm'>#{String(order.id).padStart(5, '0')}</p>
                  <p className='text-[10px] text-gray-400 font-semibold uppercase'>{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className='col-span-2'>
                  <p className='text-xs font-semibold text-gray-700 truncate'>{order.name}</p>
                  <p className='text-[10px] text-gray-400 font-semibold'>{order.phone}</p>
                </div>
                <div className='col-span-3 flex flex-col gap-1'>
                  {order.items && order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className='flex items-center gap-2'>
                      <p className='text-[10px] font-semibold text-gray-600 truncate'>
                        {item.quantity}x {item.title}
                      </p>
                    </div>
                  ))}
                  {order.items && order.items.length > 2 && (
                    <p className='text-[8px] text-gray-300 font-semibold italic'>+ {order.items.length - 2} more items</p>
                  )}
                </div>
                <div className='col-span-1 text-center'>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-widest ${
                    order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
                <div className='col-span-1 text-center'>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-widest ${
                    order.status === 'delivered' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className='col-span-1 text-right font-semibold text-gray-900 tracking-tight text-sm'>
                  ৳{order.total_price}
                </div>
                <div className='col-span-2 flex items-center justify-end gap-2'>
                  <button className='p-2 text-gray-400 hover:text-pink-600 transition-colors' onClick={() => generateReceipt(order, siteData)} title="Print"><MdPrint size={18}/></button>
                  <button className='p-2 text-gray-400 hover:text-rose-600 transition-colors' onClick={() => handleDelete(order.id)} title="Delete"><MdDeleteSweep size={18}/></button>
                </div>
              </div>
            ))
          ) : (
            <div className='p-12 text-center flex flex-col items-center gap-2 text-gray-300'>
              <MdHistory size={48} className='opacity-20' />
              <p className='font-semibold uppercase tracking-widest text-[10px]'>No records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeliveredOrder
