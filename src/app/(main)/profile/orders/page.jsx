'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '@/components/context/Context'
import { generateReceipt } from '@/lib/database/print'
import { MdShoppingBag, MdHistory, MdPrint } from 'react-icons/md'
import axios from 'axios'
import Link from 'next/link'

const OrdersPage = () => {
  const { userData, siteData } = useContext(Context)
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order History</h1>
        <p className="text-gray-500 text-sm mt-1">Track and print receipts of all your purchases.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pink-500"></div>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-50 p-5 rounded-2xl border border-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-pink-550/10 hover:border-pink-200/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl text-gray-400 group-hover:text-pink-500 transition-colors shrink-0">
                  <MdHistory />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Order #{String(order.id).padStart(5, '0')}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">
                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {order.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[9px] font-bold uppercase tracking-wider">
                      {order.delivery_method}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex-1 md:px-6 border-t md:border-t-0 md:border-l border-gray-200/60 pt-4 md:pt-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Items Ordered</p>
                <div className="space-y-1 max-h-24 overflow-y-auto pr-2">
                  {order.items?.map((item, idx) => (
                    <p key={idx} className="text-xs text-gray-600 font-medium">
                      {item.quantity}x {item.title} <span className="text-[10px] text-gray-400 font-semibold">(@ ৳{(item.price - (item.discount || 0)).toFixed(2)})</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Total & Action Button */}
              <div className="flex items-center justify-between md:flex-col md:items-end justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200/60">
                <div className="md:text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Price</p>
                  <p className="font-black text-gray-900 tracking-tight text-lg">৳{Number(order.total_price).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => generateReceipt(order, siteData)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-pink-500 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <MdPrint size={15} />
                  Print Receipt
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 py-20 rounded-2xl border border-dashed border-gray-200 text-center space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <MdShoppingBag size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 text-sm">No Orders Found</h3>
              <p className="text-xs text-gray-400 font-medium">You haven&apos;t placed any orders yet.</p>
            </div>
            <Link
              href="/menu"
              className="inline-block px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              Explore Menu
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
