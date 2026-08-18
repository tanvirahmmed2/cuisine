'use client'
import React, { useContext } from 'react'
import { Context } from '@/components/context/Context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MdPerson, MdShoppingBag, MdSettings, MdRateReview, MdSupportAgent, MdExitToApp, MdPublic } from 'react-icons/md'
import axios from 'axios'
import toast from 'react-hot-toast'
import { name } from '@/lib/database/secret'

const ProfileSidebar = ({ isOpen, onClose }) => {
  const { userData } = useContext(Context)
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      const response = await axios.get('/api/user/logout', { withCredentials: true })
      toast.success(response.data.message)
      window.location.replace('/login')
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to Logout")
    }
  }

  const menuItems = [
    { name: 'Overview', href: '/profile', icon: <MdPerson /> },
    { name: 'Edit Details', href: '/profile/update', icon: <MdSettings /> },
    { name: 'Order History', href: '/profile/orders', icon: <MdShoppingBag /> },
    { name: 'My Reviews', href: '/profile/reviews', icon: <MdRateReview /> },
    { name: 'Support Tickets', href: '/profile/support', icon: <MdSupportAgent /> },
  ]

  const initials = userData?.name
    ? userData.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <aside className={`fixed top-0 left-0 bottom-0 z-40 w-72 bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out flex flex-col overflow-y-auto ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>

      {/* Brand + User Info */}
      <div className='p-6 border-b border-gray-100'>
        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-4'>{name}</p>
        {userData && (
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold shrink-0'>
              {initials}
            </div>
            <div className='min-w-0'>
              <p className='font-bold text-gray-900 text-sm truncate'>{userData.name}</p>
              <p className='text-[10px] text-gray-400 font-medium capitalize tracking-wider'>{userData.role || 'Customer'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Nav Menu Links */}
      <div className='flex-1 flex flex-col gap-1 p-4'>
        <p className='text-[9px] font-bold uppercase text-gray-400 tracking-widest px-3 mb-1'>Navigation</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm ${isActive
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <span className='text-lg'>{item.icon}</span> {item.name}
            </Link>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className='flex flex-col gap-1 p-4 border-t border-gray-100'>
        <Link href="/" onClick={onClose} className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 font-semibold text-sm hover:bg-gray-50 hover:text-gray-900 transition-all'>
          <span className='text-lg'><MdPublic /></span> Website Home
        </Link>
        <button
          onClick={handleLogout}
          className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 font-semibold text-sm hover:bg-rose-50 transition-all text-left cursor-pointer'
        >
          <span className='text-lg'><MdExitToApp /></span> Logout
        </button>
      </div>
    </aside>
  )
}

export default ProfileSidebar
