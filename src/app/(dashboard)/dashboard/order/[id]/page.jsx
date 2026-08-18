// src/app/(dashboard)/dashboard/order/[id]/page.jsx
'use client'
import { generateReceipt } from '@/lib/database/print'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { 
  MdArrowBack, 
  MdPrint, 
  MdReceiptLong, 
  MdPerson, 
  MdPhone, 
  MdTableRestaurant, 
  MdDeliveryDining, 
  MdPayment 
} from 'react-icons/md'

const OrderDetailsPage = () => {
  const params = useParams()
  const router = useRouter()
  const orderId = params?.id

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [siteData, setSiteData] = useState({})

  useEffect(() => {
    if (!orderId) return

    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`/api/order/${orderId}`, { withCredentials: true })
        if (res.data.success) {
          setOrder(res.data.payload)
        } else {
          toast.error(res.data.message || 'Order not found')
        }
      } catch (err) {
        console.error("Error fetching order details:", err)
        toast.error(err?.response?.data?.message || 'Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    const fetchSiteSettings = async () => {
      try {
        const res = await axios.get('/api/admin/site-setting', { withCredentials: true })
        if (res.data.success) {
          setSiteData(res.data.payload || {})
        }
      } catch (err) {
        console.error("Failed to fetch site settings:", err)
      }
    }

    fetchOrderDetails()
    fetchSiteSettings()
  }, [orderId])

  const handlePrint = () => {
    if (!order) return
    generateReceipt({ ...order, receipt_type: 'Sales Copy' }, siteData)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-3 border-tertiary-dark/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <MdReceiptLong size={64} className="text-tertiary-dark/20" />
        <h2 className="text-xl font-bold text-tertiary-dark">Order Not Found</h2>
        <p className="text-xs text-tertiary-dark/60">The requested order does not exist or has been removed.</p>
        <button 
          onClick={() => router.back()} 
          className="mt-2 px-4 py-2 bg-primary text-tertiary-light rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary-dark transition-all cursor-pointer flex items-center gap-2"
        >
          <MdArrowBack size={16} /> Go Back
        </button>
      </div>
    )
  }

  const orderDate = order?.created_at ? new Date(order.created_at) : null
  const formattedDate = orderDate ? orderDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'
  const formattedTime = orderDate ? orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : ''

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase()
    if (s === 'delivered' || s === 'completed') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    } else if (s === 'cooking' || s === 'confirmed') {
      return 'bg-sky-100 text-sky-800 border-sky-200'
    } else if (s === 'cancelled') {
      return 'bg-rose-100 text-rose-800 border-rose-200'
    }
    return 'bg-amber-100 text-amber-800 border-amber-200'
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-tertiary-dark/10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-2 rounded-xl border border-tertiary-dark/15 hover:bg-tertiary-dark/5 text-tertiary-dark transition-colors cursor-pointer"
            title="Go Back"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-tertiary-dark tracking-tight">Order #{String(order.id).padStart(5, '0')}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(order.status)}`}>
                {order.status || 'pending'}
              </span>
            </div>
            <p className="text-xs text-tertiary-dark/60 font-medium">Placed on {formattedDate} at {formattedTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="px-4 py-2.5 bg-primary text-tertiary-light rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary-dark transition-all cursor-pointer shadow-xs flex items-center gap-2"
          >
            <MdPrint size={18} /> Print Receipt
          </button>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Customer Details Card */}
        <div className="bg-tertiary-light p-5 rounded-2xl border border-tertiary-dark/10 shadow-xs flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-tertiary-dark/50 flex items-center gap-2">
            <MdPerson size={16} /> Customer Information
          </h3>
          <div className="flex flex-col gap-2.5 text-xs text-tertiary-dark">
            <div className="flex justify-between items-center pb-2 border-b border-tertiary-dark/5">
              <span className="text-tertiary-dark/60 font-medium flex items-center gap-1.5"><MdPerson className="text-tertiary-dark/40" /> Name:</span>
              <span className="font-bold">{order.name || 'Guest'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-tertiary-dark/60 font-medium flex items-center gap-1.5"><MdPhone className="text-tertiary-dark/40" /> Phone:</span>
              <span className="font-mono font-bold">{order.phone || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Dining & Settlement Card */}
        <div className="bg-tertiary-light p-5 rounded-2xl border border-tertiary-dark/10 shadow-xs flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-tertiary-dark/50 flex items-center gap-2">
            <MdTableRestaurant size={16} /> Dining & Payment
          </h3>
          <div className="flex flex-col gap-2.5 text-xs text-tertiary-dark">
            <div className="flex justify-between items-center pb-2 border-b border-tertiary-dark/5">
              <span className="text-tertiary-dark/60 font-medium flex items-center gap-1.5"><MdDeliveryDining className="text-tertiary-dark/40" /> Service Type:</span>
              <span className="font-bold uppercase">{order.delivery_method || 'TAKEIN'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-tertiary-dark/5">
              <span className="text-tertiary-dark/60 font-medium flex items-center gap-1.5"><MdTableRestaurant className="text-tertiary-dark/40" /> Table Number:</span>
              <span className="font-bold">{order.table_no && order.table_no !== 'N/A' ? `Table ${order.table_no}` : 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-tertiary-dark/60 font-medium flex items-center gap-1.5"><MdPayment className="text-tertiary-dark/40" /> Payment Method:</span>
              <span className="font-bold uppercase">{order.payment_method || 'CASH'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Section - Grid Layout */}
      <div className="bg-tertiary-light rounded-2xl border border-tertiary-dark/10 overflow-hidden shadow-xs flex flex-col">
        <div className="p-4 bg-tertiary-dark/5 border-b border-tertiary-dark/10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-tertiary-dark/70">Order Items</h3>
        </div>

        {/* Grid Header */}
        <div className="hidden sm:grid grid-cols-12 p-3.5 bg-tertiary-dark/5 border-b border-tertiary-dark/10 font-bold uppercase text-[9px] tracking-wider text-tertiary-dark/50 gap-3 items-center">
          <div className="col-span-5">Item</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-1 text-center">Qty</div>
          <div className="col-span-2 text-right">Discount</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        {/* Grid Rows */}
        <div className="flex flex-col divide-y divide-tertiary-dark/5 text-xs">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, idx) => {
              const lineTotal = (Number(item.price) - Number(item.discount || 0)) * Number(item.quantity);
              return (
                <div key={item.id || idx} className="grid grid-cols-1 sm:grid-cols-12 p-3.5 items-center gap-3 hover:bg-tertiary-dark/5 transition-colors">
                  {/* Item Details */}
                  <div className="sm:col-span-5 flex flex-col">
                    <span className="font-bold text-tertiary-dark">{item.title}</span>
                    {item.variants && item.variants.length > 0 && (
                      <span className="text-[10px] text-tertiary-dark/60 font-medium">
                        {item.variants.map(v => `${v.name}: ${v.value}`).join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="sm:col-span-2 sm:text-right font-medium text-tertiary-dark/80 flex items-center justify-between sm:justify-end">
                    <span className="sm:hidden text-[10px] uppercase text-tertiary-dark/40 font-normal">Price:</span>
                    <span>৳{Number(item.price).toLocaleString()}</span>
                  </div>

                  {/* Qty */}
                  <div className="sm:col-span-1 sm:text-center font-bold text-tertiary-dark flex items-center justify-between sm:justify-center">
                    <span className="sm:hidden text-[10px] uppercase text-tertiary-dark/40 font-normal">Qty:</span>
                    <span>{item.quantity}</span>
                  </div>

                  {/* Discount */}
                  <div className="sm:col-span-2 sm:text-right font-medium text-secondary-dark flex items-center justify-between sm:justify-end">
                    <span className="sm:hidden text-[10px] uppercase text-tertiary-dark/40 font-normal">Discount:</span>
                    <span>{item.discount > 0 ? `৳${Number(item.discount).toLocaleString()}` : '-'}</span>
                  </div>

                  {/* Line Total */}
                  <div className="sm:col-span-2 sm:text-right font-bold text-tertiary-dark flex items-center justify-between sm:justify-end">
                    <span className="sm:hidden text-[10px] uppercase text-tertiary-dark/40 font-normal">Total:</span>
                    <span>৳{lineTotal.toLocaleString()}</span>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-6 text-center text-tertiary-dark/40 font-medium">No item details recorded</div>
          )}
        </div>
      </div>

      {/* Financial Settlement Box */}
      <div className="w-full max-w-md ml-auto bg-primary text-tertiary-light p-6 rounded-2xl flex flex-col gap-3 shadow-md">
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 pb-2 border-b border-tertiary-light/20">Settlement Summary</h3>
        
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider opacity-90">
          <span>Subtotal</span>
          <span>৳{Number(order.sub_total || 0).toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-secondary-light">
          <span>Total Discount</span>
          <span>-৳{Number(order.total_discount || 0).toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center border-t border-tertiary-light/20 pt-3 text-sm font-bold uppercase tracking-wider">
          <span>Total Payable</span>
          <span className="text-2xl font-black text-white tracking-tight">৳{Number(order.total_price || 0).toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center border-t border-tertiary-light/20 pt-3 text-xs font-bold">
          <span className="uppercase tracking-wider opacity-90">Paid Amount</span>
          <span className="text-sm font-extrabold text-white">৳{Number(order.paid_amount || order.total_price || 0).toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-xs font-bold">
          <span className="uppercase tracking-wider opacity-90">Change Return</span>
          <span className="text-sm font-extrabold text-emerald-300">৳{Number(order.change_amount || 0).toLocaleString()}</span>
        </div>
      </div>

    </div>
  )
}

export default OrderDetailsPage
