'use client'
import React, { useContext } from 'react'
import { Context } from '@/components/context/Context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MdPerson, MdShoppingBag, MdSettings, MdRateReview, MdSupportAgent, MdExitToApp, MdPublic } from 'react-icons/md'
import axios from 'axios'
import toast from 'react-hot-toast'

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

  return (
    <aside className={`fixed top-16 left-0 bottom-0 z-40 w-72 bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out flex flex-col p-6 gap-6 overflow-y-auto ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      {/* Session Badge */}
      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-[10px] font-semibold uppercase text-gray-400 tracking-widest">Logged In As</p>
        <p className="text-sm font-semibold text-black truncate capitalize">{userData?.name || 'User'}</p>
        <p className="text-[10px] text-gray-400 font-medium truncate">{userData?.email}</p>
      </div>

      {/* Nav Menu Links */}
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-[10px] font-semibold uppercase text-gray-400 tracking-widest px-4 mb-2">Profile Navigation</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm ${
                isActive
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-pink-600'
              }`}
            >
              <span className="text-xl">{item.icon}</span> {item.name}
            </Link>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-1 pt-6 border-t border-gray-100">
        <Link href="/" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 font-semibold text-sm hover:bg-gray-50 hover:text-pink-600 transition-all">
          <span className="text-xl"><MdPublic /></span> Website Home
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 font-semibold text-sm hover:bg-rose-50 transition-all text-left cursor-pointer"
        >
          <span className="text-xl"><MdExitToApp /></span> Logout
        </button>
      </div>
    </aside>
  )
}

export default ProfileSidebar
