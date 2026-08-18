'use client'
import Link from 'next/link'
import React, { useContext, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import {
  MdDashboard,
  MdSell,
  MdPendingActions,
  MdCheckCircle,
  MdHistory,
  MdInventory,
  MdCategory,
  MdPayments,
  MdPeople,
  MdAnalytics,
  MdEvent,
  MdSupportAgent,
  MdSettings,
  MdExitToApp,
  MdPublic,
  MdLocalOffer,
  MdRateReview,
  MdDownload,
  MdPerson,
  MdMessage,
  MdTableRestaurant
} from 'react-icons/md'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Context } from '../context/Context'

import { name, tagline } from '@/lib/database/secret'

const ManageSidebar = () => {
  const pathname = usePathname()
  const { manageSidebar, setManageSidebar, userData } = useContext(Context)
  const role = userData?.role || ''

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/user/logout', { withCredentials: true })
      toast.success(res.data.message)
      window.location.replace('/login')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to logout')
    }
  }

  const handleDownloadDB = async () => {
    try {
      toast.loading('Preparing database...')
      window.location.href = '/api/admin/database/download'
      toast.dismiss()
    } catch (error) {
      toast.error('Failed to download database')
    }
  }

  const linkStyle = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm
     ${pathname === path
      ? 'bg-primary text-tertiary-light shadow-lg shadow-primary/10'
      : 'text-tertiary-dark/60 hover:bg-tertiary-dark/5 hover:text-primary'}`

  const menuItems = useMemo(() => {
    const items = {
      sales: [
        { name: 'Sale', href: '/dashboard/sales/sale', icon: <MdSell /> },
        { name: 'Pending', href: '/dashboard/sales/pending', icon: <MdPendingActions /> },
        { name: 'Delivery', href: '/dashboard/sales/delivery', icon: <MdCheckCircle /> },
        { name: 'History', href: '/dashboard/sales/orders', icon: <MdHistory /> },
      ],
      manager: [
        { name: 'Items', href: '/dashboard/manager/items', icon: <MdInventory /> },
        { name: 'Categories', href: '/dashboard/manager/categories', icon: <MdCategory /> },
        { name: 'Expenses', href: '/dashboard/manager/expenses', icon: <MdPayments /> },
        { name: 'History', href: '/dashboard/manager/history', icon: <MdHistory /> },
        { name: 'Reservations', href: '/dashboard/manager/reservation', icon: <MdEvent /> },
        { name: 'Tables', href: '/dashboard/manager/tables', icon: <MdTableRestaurant /> },
        { name: 'Reviews', href: '/dashboard/manager/reviews', icon: <MdRateReview /> },
        { name: 'Contact', href: '/dashboard/manager/contact', icon: <MdSupportAgent /> },
        { name: 'Chat', href: '/dashboard/manager/support', icon: <MdMessage /> },
        { name: 'Offers', href: '/dashboard/manager/offers', icon: <MdLocalOffer /> },
      ],
      admin: [
        { name: 'Overview', href: '/dashboard/admin', icon: <MdDashboard /> },
        { name: 'History', href: '/dashboard/admin/history', icon: <MdHistory /> },
        { name: 'Analytics', href: '/dashboard/admin/analytics', icon: <MdAnalytics /> },
        { name: 'People', href: '/dashboard/admin/people', icon: <MdPeople /> },
        { name: 'Customers', href: '/dashboard/admin/customers', icon: <MdPerson /> },
        { name: 'Settings', href: '/dashboard/admin/settings', icon: <MdSettings /> },
      ]
    }
    return items
  }, [])

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setManageSidebar(false)
    }
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {manageSidebar && (
        <div
          onClick={() => setManageSidebar(false)}
          className="fixed inset-0 bg-tertiary-dark/30 backdrop-blur-[2px] z-30 lg:hidden top-14"
        />
      )}

      <aside className={`fixed top-14 left-0 bottom-0 z-40 w-72 bg-tertiary-light border-r border-tertiary-dark/10 transition-transform duration-300 ease-in-out flex flex-col p-6 gap-6 overflow-y-auto ${manageSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}>

        <div className="space-y-3">
          <div className="px-4 py-2.5 bg-tertiary-dark/5 rounded-xl border border-tertiary-dark/10">
            <p className="text-[9px] font-semibold uppercase text-tertiary-dark/60 tracking-widest">Active Session</p>
            <p className="text-xs font-semibold text-tertiary-dark capitalize">{role} Access</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">

          {/* Dashboard Home */}
          <div className="flex flex-col gap-1">
            <Link href="/dashboard" onClick={handleNavClick} className={linkStyle('/dashboard')}>
              <span className="text-xl"><MdDashboard /></span> Home
            </Link>
          </div>

          {/* Role Specific Section */}
          {role === 'admin' && (
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold uppercase text-tertiary-dark/60 tracking-widest px-4 mb-2">Admin Panel</p>
              {menuItems.admin.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleNavClick} className={linkStyle(item.href)}>
                  <span className="text-xl">{item.icon}</span> {item.name}
                </Link>
              ))}
              <button
                onClick={handleDownloadDB}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm text-tertiary-dark/60 hover:bg-tertiary-dark/5 hover:text-primary w-full text-left cursor-pointer"
              >
                <span className="text-xl"><MdDownload /></span> Download DB
              </button>
            </div>
          )}

          {role === 'manager' && (
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold uppercase text-tertiary-dark/60 tracking-widest px-4 mb-2">Management</p>
              {menuItems.manager.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleNavClick} className={linkStyle(item.href)}>
                  <span className="text-xl">{item.icon}</span> {item.name}
                </Link>
              ))}
            </div>
          )}

          {role === 'sales' && (
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold uppercase text-tertiary-dark/60 tracking-widest px-4 mb-2">Sales Ops</p>
              {menuItems.sales.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleNavClick} className={linkStyle(item.href)}>
                  <span className="text-xl">{item.icon}</span> {item.name}
                </Link>
              ))}
            </div>
          )}

        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-1 pt-6 border-t border-tertiary-dark/10">
          <Link href="/" onClick={handleNavClick} className="flex items-center gap-3 px-4 py-3 rounded-xl text-tertiary-dark/60 font-semibold text-sm hover:bg-tertiary-dark/5 hover:text-primary transition-all">
            <span className="text-xl"><MdPublic /></span> Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary-dark font-semibold text-sm hover:bg-primary/10 transition-all cursor-pointer"
          >
            <span className="text-xl"><MdExitToApp /></span> Logout
          </button>
        </div>

      </aside>
    </>
  )
}

export default ManageSidebar