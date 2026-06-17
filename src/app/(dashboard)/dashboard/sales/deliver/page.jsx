'use client'
import { generateReceipt } from '@/lib/database/print'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState, useContext } from 'react'
import toast from 'react-hot-toast'
import { Context } from '@/components/context/Context'

const DeliverOrder = () => {
  const { siteData } = useContext(Context)
  const [orders, setOrders] = useState([])

  const fethcOrders = async () => {
    try {
      const res = await axios.get('/api/order/confirmed', { withCredentials: true })
      setOrders(res.data.payload)
    } catch (error) {
      setOrders([])
    }
  }


  useEffect(() => { fethcOrders() }, [])

  const handleCancel = async (id) => {
    const confirm = window.confirm('Are your sure?')
    if (!confirm) return
    try {
      const res = await axios.post('/api/order/cancel', { id }, { withCredentials: true })
      toast.success(res.data.message)
      fethcOrders()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to cancel order")
    }
  }
  const handleDeliver = async (id) => {
    const confirm = window.confirm('Are your sure?')
    if (!confirm) return
    try {
      const res = await axios.post('/api/order/delivery', { id }, { withCredentials: true })
      toast.success(res.data.message)
      fethcOrders()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to deliver order")
    }
  }
  return (
    <div className='w-full flex flex-col items-center gap-4 min-h-screen'>
      {
        orders.length === 0 ? <p>No order to deliver</p> : <div className='w-full flex flex-col items-center gap-4'>
          <h1 className='w-full text-center text-base md:text-xl font-semibold'>Waiting orders to be served</h1>
          <div className='w-full grid grid-cols-10 bg-gray-100 p-4 rounded-xl font-bold text-[10px] uppercase text-gray-500 tracking-wider items-center'>
            <p className='col-span-1'>ID</p>
            <p className='col-span-1'>Date</p>
            <p className='col-span-1'>Customer</p>
            <p className='col-span-2'>Items</p>
            <p className='col-span-1'>Total</p>
            <p className='col-span-1'>Payment</p>
            <p className='col-span-1'>Method</p>
            <p className='col-span-2 text-right'>Actions</p>
          </div>
          <div className='w-full flex flex-col gap-3'>
            {
              orders.map((order) => (
                <div key={order.id} className='w-full grid grid-cols-10 bg-white border border-gray-100 p-4 rounded-2xl items-center hover:shadow-md transition-all'>
                  <p className='col-span-1 font-mono text-xs'>#{String(order.id).padStart(5, '0')}</p>
                  <p className='col-span-1 text-xs text-gray-500'>{new Date(order.created_at).toLocaleDateString()}</p>
                  <div className='col-span-1'>
                    <p className='text-xs font-bold'>{order.name || 'Guest'}</p>
                    <p className='text-[10px] text-gray-400'>{order.phone}</p>
                  </div>
                  <div className='col-span-2 flex flex-col gap-1'>
                    {
                      order?.items?.map((item) => (
                        <p key={item.id} className='text-[10px] text-gray-600 line-clamp-1'>
                          {item.quantity}x {item.title}
                        </p>
                      ))
                    }
                  </div>
                  <p className='col-span-1 font-bold text-gray-900'>${Number(order.total_price).toFixed(2)}</p>
                  <p className='col-span-1'>
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                      order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {order.payment_status}
                    </span>
                  </p>
                  <p className='col-span-1 text-[10px] uppercase font-bold text-gray-400'>{order.payment_method}</p>
                  
                  <div className='col-span-2 flex flex-row items-center justify-end gap-2'>
                    <Link href={`/dashboard/sales/orders/${order.id}`} className='p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-pink-500 hover:text-white transition-all'>
                      View
                    </Link>
                    <button className='p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-600 hover:text-white transition-all' onClick={() => generateReceipt(order, siteData)}>
                      Print
                    </button>
                    <button className='p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all' onClick={() => handleDeliver(order.id)}>
                      Deliver
                    </button>
                    <button className='p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all' onClick={() => handleCancel(order.id)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      }

    </div>
  )
}

export default DeliverOrder
