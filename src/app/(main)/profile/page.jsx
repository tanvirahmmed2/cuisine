'use client'
import { Context } from '@/components/context/Context'
import React, { useContext, useState, useEffect } from 'react'
import { MdShoppingBag, MdHistory, MdPerson, MdCheckCircle, MdEmail, MdPhone } from 'react-icons/md'
import axios from 'axios'
import Link from 'next/link'

const Profile = () => {
  const { userData } = useContext(Context)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/order/user', { withCredentials: true })
        setOrders(res.data.payload || [])
      } catch (error) {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    if (userData) fetchOrders()
  }, [userData])

  return (
    <div className='space-y-8'>
      {/* Title Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>Account Overview</h1>
        <p className='text-gray-500 text-sm mt-1'>Welcome back, {userData?.name || 'Guest'}!</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-1'>
          <span className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Total Orders</span>
          <h2 className='text-2xl font-bold text-gray-900 tracking-tight'>{orders.length}</h2>
          <span className='text-xs text-gray-400 font-medium'>Lifetime transactions</span>
        </div>
        <div className='p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-1'>
          <span className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Account Status</span>
          <h2 className='text-2xl font-bold text-emerald-600 tracking-tight flex items-center gap-1.5'>
            Active
            <MdCheckCircle size={20} />
          </h2>
          <span className='text-xs text-gray-400 font-medium'>Verified customer</span>
        </div>
        <div className='p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-1'>
          <span className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>Access Level</span>
          <h2 className='text-2xl font-bold text-gray-900 tracking-tight capitalize'>{userData?.role || 'Customer'}</h2>
          <span className='text-xs text-gray-400 font-medium'>Standard permissions</span>
        </div>
      </div>

      {/* Details Summary */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100'>
        {/* Profile Info Details */}
        <div className='space-y-4'>
          <h2 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
            <MdPerson className='text-pink-500' />
            Personal Details
          </h2>
          <div className='bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='w-9 h-9 rounded-xl bg-white flex items-center justify-center text-gray-400'>
                <MdPerson size={18} />
              </div>
              <div>
                <p className='text-[9px] font-bold uppercase tracking-widest text-gray-400'>Full Name</p>
                <p className='text-sm font-bold text-gray-800'>{userData?.name}</p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='w-9 h-9 rounded-xl bg-white flex items-center justify-center text-gray-400'>
                <MdEmail size={18} />
              </div>
              <div>
                <p className='text-[9px] font-bold uppercase tracking-widest text-gray-400'>Email Address</p>
                <p className='text-sm font-bold text-gray-800 truncate max-w-[220px]'>{userData?.email}</p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='w-9 h-9 rounded-xl bg-white flex items-center justify-center text-gray-400'>
                <MdPhone size={18} />
              </div>
              <div>
                <p className='text-[9px] font-bold uppercase tracking-widest text-gray-400'>Contact Phone</p>
                <p className='text-sm font-bold text-gray-800'>{userData?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
          <Link
            href="/profile/update"
            className="inline-block px-6 py-2.5 bg-gray-900 hover:bg-pink-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all text-center"
          >
            Update Details
          </Link>
        </div>

        {/* Recent Orders List */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
              <MdShoppingBag className='text-pink-500' />
              Recent Orders
            </h2>
            {orders.length > 3 && (
              <Link href="/profile/orders" className='text-xs font-bold text-gray-400 hover:text-pink-600 uppercase tracking-widest'>
                View All ({orders.length})
              </Link>
            )}
          </div>
          <div className='flex flex-col gap-3'>
            {loading ? (
              <div className="bg-gray-50 py-12 rounded-2xl border border-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-pink-500"></div>
              </div>
            ) : orders.length > 0 ? (
              orders.slice(0, 3).map((order) => (
                <div key={order.id} className='bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between group hover:bg-pink-50/20 hover:border-pink-200/50 transition-all'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg text-gray-400 group-hover:text-pink-500 transition-colors'>
                      <MdHistory />
                    </div>
                    <div>
                      <h4 className='font-bold text-gray-900 text-xs'>Order #{String(order.id).padStart(5, '0')}</h4>
                      <p className='text-[10px] text-gray-400 font-semibold'>{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-black text-gray-900 tracking-tight text-xs'>৳{Number(order.total_price).toFixed(2)}</p>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                      order.status === 'delivered' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className='bg-gray-50 p-10 rounded-2xl border border-dashed border-gray-200 text-center space-y-2'>
                <p className='text-gray-400 text-xs font-medium'>No orders placed yet.</p>
                <Link href="/menu" className='inline-block text-pink-600 font-bold text-xs uppercase tracking-widest hover:underline'>Order Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
