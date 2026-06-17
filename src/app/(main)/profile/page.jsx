'use client'
import Logout from '@/components/buttons/Logout'
import { Context } from '@/components/context/Context'
import UpdateUserForm from '@/components/forms/UpdateUserForm'
import React, { useContext, useState, useEffect } from 'react'
import { CiEdit, CiUser } from 'react-icons/ci'
import { MdCancel, MdShoppingBag, MdSettings, MdHistory, MdPerson } from 'react-icons/md'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const Profile = () => {
  const { userData, updateUserBox, setUpdateUserBox } = useContext(Context)
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
    <div className='w-full min-h-screen bg-gray-50/50 pt-28 pb-20 px-6'>
      <div className='max-w-6xl mx-auto flex flex-col gap-10'>
        
        {/* Profile Header Card */}
        <section className='bg-white p-8 md:p-12 rounded-[40px] shadow-xl shadow-pink-900/5 border border-gray-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50' />
          
          <div className='relative'>
            <div className='w-32 h-32 md:w-40 md:h-40 bg-pink-500 text-white rounded-full flex items-center justify-center text-7xl shadow-2xl'>
              <MdPerson />
            </div>
            <button 
              onClick={() => setUpdateUserBox(true)}
              className='absolute bottom-2 right-2 p-3 bg-white text-black rounded-full shadow-lg border border-gray-100 hover:scale-110 transition-transform cursor-pointer'
            >
              <CiEdit size={24} />
            </button>
          </div>

          <div className='flex-1 text-center md:text-left space-y-2 relative'>
            <h1 className='text-4xl font-black text-gray-900 tracking-tight'>{userData?.name}</h1>
            <p className='text-gray-500 font-medium'>{userData?.email}</p>
            <div className='flex flex-wrap justify-center md:justify-start gap-3 mt-4'>
              <span className='px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest'>
                {userData?.role || 'Customer'}
              </span>
              <span className='px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest'>
                Verified Account
              </span>
            </div>
          </div>

          <div className='md:border-l border-gray-100 md:pl-12 flex flex-col gap-3 relative'>
            <Logout />
            <p className='text-[10px] text-gray-400 font-bold uppercase tracking-tighter text-center'>Secure Logout</p>
          </div>
        </section>

        {/* Content Tabs / Sections */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          
          {/* Recent Orders Section */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='flex items-center justify-between px-2'>
              <h2 className='text-2xl font-black text-gray-900 flex items-center gap-3'>
                <MdShoppingBag className='text-pink-600' />
                Recent Orders
              </h2>
              <button className='text-xs font-bold text-gray-400 hover:text-pink-600 uppercase tracking-widest'>View All</button>
            </div>

            <div className='flex flex-col gap-4'>
              {loading ? (
                <div className="bg-white p-20 rounded-[32px] border border-gray-100 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500"></div>
                </div>
              ) : orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <div key={order.id} className='bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all'>
                    <div className='flex items-center gap-5'>
                      <div className='w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-pink-500 group-hover:text-white transition-colors'>
                        <MdHistory />
                      </div>
                      <div>
                        <h4 className='font-bold text-gray-900'>Order #{String(order.id).padStart(5, '0')}</h4>
                        <p className='text-xs text-gray-400 font-medium'>{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-black text-gray-900 tracking-tighter text-lg'>৳{Number(order.total_price).toFixed(2)}</p>
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                        order.status === 'delivered' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className='bg-white p-20 rounded-[32px] border border-dashed border-gray-200 text-center space-y-3'>
                  <p className='text-gray-400 font-medium'>No orders placed yet.</p>
                  <Link href="/menu" className='text-pink-600 font-black text-sm uppercase tracking-widest hover:underline'>Order Now</Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Settings / Info */}
          <div className='space-y-6'>
            <h2 className='text-2xl font-black text-gray-900 flex items-center gap-3 px-2'>
              <MdSettings className='text-gray-400' />
              Settings
            </h2>
            <div className='bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6'>
              <div className='space-y-2'>
                <p className='text-[10px] font-black uppercase text-gray-400 tracking-widest'>Registered Email</p>
                <p className='font-bold text-gray-800'>{userData?.email}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-[10px] font-black uppercase text-gray-400 tracking-widest'>Contact Number</p>
                <p className='font-bold text-gray-800'>{userData?.phone || 'Not provided'}</p>
              </div>
              <div className='pt-4 border-t border-gray-50'>
                <button 
                  onClick={() => setUpdateUserBox(true)}
                  className='w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-pink-500 transition-all shadow-xl shadow-pink-900/10'
                >
                  Edit Profile Details
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {updateUserBox && (
          <div className='fixed inset-0 z-[100] flex items-center justify-center p-6'>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUpdateUserBox(false)}
              className='absolute inset-0 bg-pink-500/60 backdrop-blur-md'
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className='bg-white w-full max-w-md p-8 rounded-[40px] shadow-2xl relative'
            >
              <button 
                className='absolute top-6 right-6 p-2 text-gray-300 hover:text-pink-600 transition-colors cursor-pointer' 
                onClick={() => setUpdateUserBox(false)}
              >
                <MdCancel size={28} />
              </button>
              <div className='mb-8'>
                <h3 className='text-2xl font-black text-gray-900 tracking-tight'>Edit Profile</h3>
                <p className='text-gray-400 text-sm'>Update your personal information</p>
              </div>
              <UpdateUserForm />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Profile
