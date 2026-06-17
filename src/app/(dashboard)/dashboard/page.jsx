'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { 
  MdAnalytics, 
  MdPeople, 
  MdSettings, 
  MdInventory, 
  MdHistory, 
  MdEvent, 
  MdRateReview, 
  MdSupportAgent, 
  MdLocalOffer, 
  MdSell, 
  MdPendingActions, 
  MdCheckCircle 
} from 'react-icons/md'
import { Context } from '@/components/context/Context'

const Manage = () => {
  const { userData, siteData } = useContext(Context)
  const role = userData?.role || ''

  const getRoleActions = () => {
    if (role === 'admin') {
      return [
        { title: 'Overview', desc: 'Business summary and metrics', href: '/dashboard/admin', icon: <MdAnalytics />, color: 'bg-pink-50 text-pink-600' },
        { title: 'Order History', desc: 'Full business transaction logs', href: '/dashboard/admin/history', icon: <MdHistory />, color: 'bg-gray-50 text-gray-600' },
        { title: 'Analytics', desc: 'Deep performance reports', href: '/dashboard/admin/analytics', icon: <MdAnalytics />, color: 'bg-pink-50 text-pink-600' },
        { title: 'People', desc: 'Staff access and permissions', href: '/dashboard/admin/people', icon: <MdPeople />, color: 'bg-emerald-50 text-emerald-600' },
        { title: 'Settings', desc: 'Website and brand information', href: '/dashboard/admin/settings', icon: <MdSettings />, color: 'bg-amber-50 text-amber-600' },
      ]
    }

    if (role === 'manager') {
      return [
        { title: 'Inventory', desc: 'Items and stock management', href: '/dashboard/manager/items', icon: <MdInventory />, color: 'bg-rose-50 text-rose-600' },
        { title: 'Expenses', desc: 'Track business expenditures', href: '/dashboard/manager/expenses', icon: <MdSell />, color: 'bg-orange-50 text-orange-600' },
        { title: 'History', desc: 'Order fulfillment records', href: '/dashboard/manager/history', icon: <MdHistory />, color: 'bg-gray-50 text-gray-600' },
        { title: 'Reservations', desc: 'Table booking management', href: '/dashboard/manager/reservation', icon: <MdEvent />, color: 'bg-pink-50 text-pink-600' },
        { title: 'Reviews', desc: 'Customer feedback moderation', href: '/dashboard/manager/reviews', icon: <MdRateReview />, color: 'bg-teal-50 text-teal-600' },
        { title: 'Support', desc: 'Customer assistance center', href: '/dashboard/manager/support', icon: <MdSupportAgent />, color: 'bg-pink-50 text-pink-600' },
        { title: 'Offers', desc: 'Promotions and discounts', href: '/dashboard/manager/offers', icon: <MdLocalOffer />, color: 'bg-purple-50 text-purple-600' },
      ]
    }

    if (role === 'sales') {
      return [
        { title: 'Sales POS', desc: 'Create new orders and billing', href: '/dashboard/sales/sale', icon: <MdSell />, color: 'bg-orange-50 text-orange-600' },
        { title: 'Pending Orders', desc: 'Active and unpaid transactions', href: '/dashboard/sales/pending', icon: <MdPendingActions />, color: 'bg-purple-50 text-purple-600' },
        { title: 'Deliveries', desc: 'Fulfill and complete orders', href: '/dashboard/sales/deliver', icon: <MdCheckCircle />, color: 'bg-emerald-50 text-emerald-600' },
        { title: 'Order Logs', desc: 'View delivered order history', href: '/dashboard/sales/orders', icon: <MdHistory />, color: 'bg-gray-50 text-gray-600' },
      ]
    }

    return []
  }

  const actions = getRoleActions()

  return (
    <div className="w-full min-h-[90vh] flex flex-col p-8 md:p-12 gap-12 bg-white">
      <div className="flex flex-col gap-2">
        <div className='inline-block w-fit px-4 py-1 bg-gray-100 text-gray-900 text-[10px] font-semibold uppercase tracking-widest rounded-full'>
          {role} Dashboard
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
          Welcome back, <br />
          <span className="text-gray-400 italic">{userData?.name || 'Staff'}</span>
        </h1>
        <p className="text-gray-500 font-medium max-w-md">
          Control <span className="text-gray-900">{siteData?.name || "your platform"}</span> with precision.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {actions.map((action, index) => (
          <Link 
            key={index} 
            href={action.href} 
            className="group p-8 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-2xl hover:shadow-pink-900/5 transition-all flex flex-col gap-6"
          >
            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 tracking-tight">{action.title}</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">{action.desc}</p>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 group-hover:text-pink-600 transition-colors">Launch Module</span>
              <div className="w-6 h-px bg-gray-100 group-hover:w-10 transition-all group-hover:bg-pink-500" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">System Online: {userData?.email}</p>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 italic">
          Access Level: {role?.toUpperCase()}
        </p>
      </div>
    </div>
  )
}

export default Manage
