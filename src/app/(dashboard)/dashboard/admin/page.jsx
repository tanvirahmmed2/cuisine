'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MdTrendingUp, MdShoppingCart, MdPeople, MdInventory, MdPendingActions } from 'react-icons/md'

const AdminOverview = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get('/api/admin/overview', { withCredentials: true })
        setStats(res.data.payload)
      } catch (error) {
        console.error("Failed to fetch admin overview", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOverview()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Business Overview</h1>
        <p className="text-gray-500 text-sm">Real-time performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Revenue Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col gap-3 group hover:border-pink-500 transition-all duration-300">
          <div className="w-10 h-10 bg-gray-50 text-gray-900 rounded-lg flex items-center justify-center text-xl transition-colors group-hover:bg-pink-500 group-hover:text-white">
            <MdTrendingUp />
          </div>
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-widest text-[9px]">Total Revenue</p>
            <h2 className="text-2xl font-semibold text-gray-900 mt-0.5">৳{stats?.totalRevenue?.toLocaleString()}</h2>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col gap-3 group hover:border-pink-500 transition-all duration-300">
          <div className="w-10 h-10 bg-gray-50 text-gray-900 rounded-lg flex items-center justify-center text-xl transition-colors group-hover:bg-pink-500 group-hover:text-white">
            <MdShoppingCart />
          </div>
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-widest text-[9px]">Total Orders</p>
            <h2 className="text-2xl font-semibold text-gray-900 mt-0.5">{stats?.totalOrders}</h2>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col gap-3 group hover:border-pink-500 transition-all duration-300">
          <div className="w-10 h-10 bg-gray-50 text-gray-900 rounded-lg flex items-center justify-center text-xl transition-colors group-hover:bg-pink-500 group-hover:text-white">
            <MdPendingActions />
          </div>
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-widest text-[9px]">Pending</p>
            <h2 className="text-2xl font-semibold text-gray-900 mt-0.5">{stats?.pendingOrders}</h2>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col gap-3 group hover:border-pink-500 transition-all duration-300">
          <div className="w-10 h-10 bg-gray-50 text-gray-900 rounded-lg flex items-center justify-center text-xl transition-colors group-hover:bg-pink-500 group-hover:text-white">
            <MdPeople />
          </div>
          <div>
            <p className="text-gray-400 font-semibold uppercase tracking-widest text-[9px]">Customers</p>
            <h2 className="text-2xl font-semibold text-gray-900 mt-0.5">{stats?.totalCustomers}</h2>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminOverview
