// src/app/(dashboard)/dashboard/sales/pending/page.jsx
'use client'
import { generateReceipt } from '@/lib/database/print'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { 
  MdMoreVert, 
  MdCancel, 
  MdCheckCircle, 
  MdLocalShipping, 
  MdPrint, 
  MdVisibility 
} from 'react-icons/md'

const PendingOrder = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [siteData, setSiteData] = useState({})

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/order/pending', { withCredentials: true })
      setOrders(res.data.payload || [])
    } catch (error) {
      console.error("Failed to fetch pending orders:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    let isMounted = true;
    const loadData = async () => {
      try {
        const [ordersRes, siteRes] = await Promise.all([
          axios.get('/api/order/pending', { withCredentials: true }),
          axios.get('/api/admin/site-setting', { withCredentials: true }).catch(() => ({ data: {} }))
        ]);
        if (isMounted) {
          setOrders(ordersRes.data.payload || []);
          if (siteRes.data?.success) {
            setSiteData(siteRes.data.payload || {});
          }
        }
      } catch (err) {
        console.error("Failed to fetch pending orders:", err);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [])

  // Action handlers
  const handleCancel = async (id) => {
    setActiveMenuId(null)
    const confirmAction = window.confirm('Are you sure you want to cancel this order?')
    if (!confirmAction) return
    try {
      const res = await axios.post('/api/order/cancel', { id }, { withCredentials: true })
      toast.success(res.data.message || "Order cancelled")
      fetchOrders()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to cancel order")
    }
  }

  const handleConfirm = async (id) => {
    setActiveMenuId(null)
    const confirmAction = window.confirm('Confirm this order?')
    if (!confirmAction) return
    try {
      const res = await axios.post('/api/order/confirmed', { id }, { withCredentials: true })
      toast.success(res.data.message || "Order confirmed")
      fetchOrders()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to confirm order")
    }
  }

  const handleDelivery = async (id) => {
    setActiveMenuId(null)
    const confirmAction = window.confirm('Mark order as delivered?')
    if (!confirmAction) return
    try {
      const res = await axios.post('/api/order/delivery', { id }, { withCredentials: true })
      toast.success(res.data.message || "Order delivered")
      fetchOrders()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update order status")
    }
  }

  const handlePrint = (order) => {
    setActiveMenuId(null)
    generateReceipt({ ...order, receipt_type: 'Sales Copy' }, siteData)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="w-8 h-8 border-2 border-tertiary-dark/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className='w-full  flex flex-col gap-6 p-4 md:p-8'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-bold text-tertiary-dark tracking-tight'>Pending Orders</h1>
        <p className='text-tertiary-dark/60 text-xs font-medium'>Orders waiting for confirmation or processing.</p>
      </div>

      <div className='w-full flex flex-col gap-3'>
        {orders.length > 0 ? (
          <div className='w-full flex flex-col gap-2 min-h-screen'>
            
            <div className='grid grid-cols-12 bg-tertiary-dark/5 p-3 sm:p-4 rounded-xl font-bold text-[10px] uppercase text-tertiary-dark/60 tracking-widest border border-tertiary-dark/10 gap-2 sm:gap-3 items-center'>
              <div className='col-span-3 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1'>Order ID</div>
              <div className='col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-2 xl:col-span-2'>Customer</div>
              <div className='hidden md:block md:col-span-3 lg:col-span-3 xl:col-span-3'>Items</div>
              <div className='hidden sm:block sm:col-span-2 md:col-span-2 lg:col-span-1 xl:col-span-1 text-center'>Table</div>
              <div className='col-span-3 sm:col-span-3 md:col-span-2 lg:col-span-2 xl:col-span-2 text-right'>Total Price</div>
              <div className='hidden xl:block xl:col-span-1 text-right'>Discount</div>
              <div className='hidden lg:block lg:col-span-2 xl:col-span-1 text-right'>Paid</div>
              <div className='col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1 text-center'>Actions</div>
            </div>

            <div className='flex flex-col gap-2'>
              {orders.map((order) => {
                const isMenuOpen = activeMenuId === order.id;

                return (
                  <div 
                    key={order.id} 
                    className='w-full grid grid-cols-12 p-3 sm:p-4 items-center bg-tertiary-light border border-tertiary-dark/10 rounded-xl hover:border-primary/40 transition-all gap-2 sm:gap-3 relative shadow-2xs'
                  >
                    {/* 1. Order ID */}
                    <div className='col-span-3 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1 font-mono font-bold text-primary text-xs truncate'>
                      <span>#{String(order.id).padStart(5, '0')}</span>
                    </div>

                    {/* 2. Customer */}
                    <div className='col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-2 xl:col-span-2 flex flex-col justify-center min-w-0'>
                      <span className='font-bold text-xs text-tertiary-dark truncate'>{order.name || 'Guest'}</span>
                      <span className='text-[10px] text-tertiary-dark/60 font-mono truncate'>{order.phone}</span>
                      {order.table_no && order.table_no !== 'N/A' && (
                        <span className='sm:hidden text-[9px] font-bold text-amber-800 uppercase tracking-wider mt-0.5 truncate'>
                          Table {order.table_no}
                        </span>
                      )}
                    </div>

                    {/* 3. Items */}
                    <div className='hidden md:flex md:col-span-3 lg:col-span-3 xl:col-span-3 flex-col gap-0.5 min-w-0'>
                      {order?.items?.map((item) => (
                        <span key={item.id} className='text-xs text-tertiary-dark/80 truncate' title={`${item.quantity}x ${item.title}`}>
                          {item.quantity}x {item.title}
                        </span>
                      ))}
                    </div>

                    {/* 4. Table */}
                    <div className='hidden sm:flex sm:col-span-2 md:col-span-2 lg:col-span-1 xl:col-span-1 items-center justify-center'>
                      <span className={`inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] font-bold uppercase tracking-wider truncate ${
                        order.table_no && order.table_no !== 'N/A' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300/50' 
                          : 'bg-tertiary-dark/5 text-tertiary-dark/50'
                      }`}>
                        {order.table_no && order.table_no !== 'N/A' ? `Table ${order.table_no}` : 'Takeaway'}
                      </span>
                    </div>

                    {/* 5. Total Price */}
                    <div className='col-span-3 sm:col-span-3 md:col-span-2 lg:col-span-2 xl:col-span-2 font-bold text-tertiary-dark text-xs text-right flex items-center justify-end truncate'>
                      <span>৳{Number(order.total_price || 0).toLocaleString()}</span>
                    </div>

                    {/* 6. Discount */}
                    <div className='hidden xl:flex xl:col-span-1 font-semibold text-secondary-dark text-xs text-right items-center justify-end truncate'>
                      <span>৳{Number(order.total_discount || 0).toLocaleString()}</span>
                    </div>

                    {/* 7. Total Paid */}
                    <div className='hidden lg:flex lg:col-span-2 xl:col-span-1 font-bold text-emerald-700 text-xs text-right items-center justify-end truncate'>
                      <span>৳{Number(order.paid_amount || 0).toLocaleString()}</span>
                    </div>

                    {/* 8. Actions */}
                    <div className='col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1 flex items-center justify-end md:justify-center relative'>
                      <button
                        type='button'
                        onClick={() => setActiveMenuId(isMenuOpen ? null : order.id)}
                        className='p-1.5 rounded-lg hover:bg-tertiary-dark/10 transition-colors text-tertiary-dark/70 hover:text-tertiary-dark cursor-pointer'
                        title='Actions'
                      >
                        <MdMoreVert size={20} />
                      </button>

                      {/* Dropdown Menu Popup */}
                      {isMenuOpen && (
                        <>
                          <div 
                            className='fixed inset-0 z-40' 
                            onClick={() => setActiveMenuId(null)}
                          />

                          <div className='absolute right-0 top-10 z-50 w-44 bg-tertiary-light rounded-xl shadow-xl border border-tertiary-dark/10 py-1.5 flex flex-col gap-0.5 text-left text-xs font-semibold animate-in fade-in zoom-in-95 duration-100'>
                            <button
                              type='button'
                              onClick={() => handleConfirm(order.id)}
                              className='w-full px-3 py-2 text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-2 cursor-pointer'
                            >
                              <MdCheckCircle size={16} />
                              <span>Confirm Order</span>
                            </button>

                            <button
                              type='button'
                              onClick={() => handleDelivery(order.id)}
                              className='w-full px-3 py-2 text-sky-700 hover:bg-sky-50 transition-colors flex items-center gap-2 cursor-pointer'
                            >
                              <MdLocalShipping size={16} />
                              <span>Mark Delivered</span>
                            </button>

                            <button
                              type='button'
                              onClick={() => handlePrint(order)}
                              className='w-full px-3 py-2 text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-2 cursor-pointer'
                            >
                              <MdPrint size={16} />
                              <span>Print Receipt</span>
                            </button>

                            <Link
                              href={`/dashboard/order/${order.id}`}
                              onClick={() => setActiveMenuId(null)}
                              className='w-full px-3 py-2 text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center gap-2 cursor-pointer'
                            >
                              <MdVisibility size={16} />
                              <span>View Details</span>
                            </Link>

                            <div className='border-t border-tertiary-dark/10 my-0.5' />

                            <button
                              type='button'
                              onClick={() => handleCancel(order.id)}
                              className='w-full px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer'
                            >
                              <MdCancel size={16} />
                              <span>Cancel Order</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        ) : (
          <div className='text-center py-20 bg-tertiary-light rounded-xl border border-dashed border-tertiary-dark/20 flex flex-col items-center gap-2'>
            <p className='text-tertiary-dark/40 text-sm font-semibold'>No pending orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PendingOrder
