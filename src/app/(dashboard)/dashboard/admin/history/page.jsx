'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MdHistory, MdReceipt, MdCheckCircle } from 'react-icons/md'

const AdminHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/order', { withCredentials: true })
        // Admin history should show all orders (purchases, payments, delivered)
        setOrders(res.data.payload || [])
      } catch (error) {
        console.error("Failed to fetch history", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business History</h1>
        <p className="text-gray-500 text-sm">Overview of all purchases, payments, and delivered orders.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-6 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <div className="col-span-2">Order ID & Date</div>
          <div>Customer</div>
          <div>Status</div>
          <div>Payment</div>
          <div className="text-right">Total</div>
        </div>

        <div className="flex flex-col divide-y divide-gray-50">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="grid grid-cols-6 gap-4 p-6 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-2 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' :
                    order.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                    'bg-pink-100 text-pink-600'
                  }`}>
                    {order.status === 'delivered' ? <MdCheckCircle /> : <MdReceipt />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">#{String(order.id).padStart(5, '0')}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{order.name}</p>
                  <p className="text-xs text-gray-400">{order.phone}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'canceled' ? 'bg-red-100 text-red-700' :
                    'bg-pink-100 text-pink-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {order.payment_status || 'unpaid'}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase">{order.payment_method}</p>
                </div>
                <div className="text-right font-black text-gray-900 tracking-tighter text-lg">
                  ৳{Number(order.total_price).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <MdHistory size={48} className="text-gray-300" />
              <p className="text-gray-500 font-medium">No history records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminHistory
