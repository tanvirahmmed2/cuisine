'use client'
import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  MdPayments,
  MdRefresh,
  MdSearch,
  MdFilterList,
  MdCheckCircle,
  MdPendingActions,
  MdPrint,
  MdVisibility,
  MdAttachMoney,
  MdAccountBalanceWallet,
  MdReceipt,
  MdCreditCard,
  MdPointOfSale
} from 'react-icons/md'
import { generateReceipt } from '@/lib/database/print'

const OrderPayments = ({ role = 'manager' }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/payment', { withCredentials: true })
      if (res.data.success) {
        setOrders(res.data.payload || [])
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch payments data')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        String(order.id).toLowerCase().includes(q) ||
        String(order.customer_name || order.name || '').toLowerCase().includes(q) ||
        String(order.customer_phone || order.phone || '').toLowerCase().includes(q) ||
        String(order.transaction_id || '').toLowerCase().includes(q)

      const matchesMethod =
        selectedMethod === 'all' ||
        String(order.payment_method || '').toLowerCase() === selectedMethod.toLowerCase()

      const matchesStatus =
        selectedStatus === 'all' ||
        String(order.payment_status || '').toLowerCase() === selectedStatus.toLowerCase()

      return matchesSearch && matchesMethod && matchesStatus
    })
  }, [orders, searchQuery, selectedMethod, selectedStatus])

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalCollected = orders.reduce((sum, o) => sum + (Number(o.paid_amount) || 0), 0)
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0)
    const paidCount = orders.filter(o => o.payment_status === 'paid').length
    const unpaidCount = orders.filter(o => o.payment_status !== 'paid').length
    const totalDiscount = orders.reduce((sum, o) => sum + (Number(o.total_discount) || 0), 0)

    return { totalCollected, totalRevenue, paidCount, unpaidCount, totalDiscount }
  }, [orders])

  const formatCurrency = (val) => `৳${Number(val || 0).toLocaleString()}`

  return (
    <div className='w-full max-w-7xl mx-auto flex flex-col gap-8 pb-12 min-h-screen'>

      {/* Page Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2.5'>
            <MdPayments className='text-emerald-600' size={30} /> Order Payments
          </h1>
          <p className='text-gray-500 text-sm'>
            Comprehensive view of customer transactions, payment methods, and revenue records.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={fetchPayments}
            className='p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-semibold'
            title='Refresh Data'
          >
            <MdRefresh size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>

        <div className='bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs flex flex-col gap-2 relative overflow-hidden'>
          <div className='flex items-center justify-between'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-emerald-600'>Total Collected</span>
            <div className='w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600'>
              <MdAttachMoney size={20} />
            </div>
          </div>
          <p className='text-2xl font-black text-gray-900'>{formatCurrency(metrics.totalCollected)}</p>
          <p className='text-xs text-gray-400 font-medium'>Total payments received</p>
        </div>

        <div className='bg-white border border-indigo-100 p-5 rounded-2xl shadow-xs flex flex-col gap-2 relative overflow-hidden'>
          <div className='flex items-center justify-between'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-indigo-600'>Paid Transactions</span>
            <div className='w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600'>
              <MdCheckCircle size={20} />
            </div>
          </div>
          <p className='text-2xl font-black text-gray-900'>{metrics.paidCount}</p>
          <p className='text-xs text-gray-400 font-medium'>Completed order payments</p>
        </div>

        <div className='bg-white border border-amber-100 p-5 rounded-2xl shadow-xs flex flex-col gap-2 relative overflow-hidden'>
          <div className='flex items-center justify-between'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-amber-600'>Pending / Unpaid</span>
            <div className='w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600'>
              <MdPendingActions size={20} />
            </div>
          </div>
          <p className='text-2xl font-black text-amber-700'>{metrics.unpaidCount}</p>
          <p className='text-xs text-gray-400 font-medium'>Awaiting payment</p>
        </div>

        <div className='bg-white border border-pink-100 p-5 rounded-2xl shadow-xs flex flex-col gap-2 relative overflow-hidden'>
          <div className='flex items-center justify-between'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-pink-600'>Discounts Allowed</span>
            <div className='w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600'>
              <MdReceipt size={20} />
            </div>
          </div>
          <p className='text-2xl font-black text-gray-900'>{formatCurrency(metrics.totalDiscount)}</p>
          <p className='text-xs text-gray-400 font-medium'>Promotions & discounts</p>
        </div>

      </div>

      {/* Filter & Search Controls */}
      <div className='bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4'>

        {/* Search Bar */}
        <div className='relative w-full sm:w-80'>
          <MdSearch size={20} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search Order ID, Customer, Phone...'
            className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all'
          />
        </div>

        {/* Filter Dropdowns */}
        <div className='flex items-center gap-3 w-full sm:w-auto justify-end'>
          <div className='flex items-center gap-1.5 text-xs text-gray-500 font-semibold shrink-0'>
            <MdFilterList size={18} /> Filters:
          </div>

          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className='px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 transition-all cursor-pointer'
          >
            <option value='all'>All Methods</option>
            <option value='cash'>Cash</option>
            <option value='card'>Card</option>
            <option value='bkash'>bKash</option>
            <option value='nagad'>Nagad</option>
            <option value='online'>Online</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className='px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500 transition-all cursor-pointer'
          >
            <option value='all'>All Payment Status</option>
            <option value='paid'>Paid</option>
            <option value='unpaid'>Unpaid / Pending</option>
          </select>
        </div>

      </div>

      {/* Main Payments Table */}
      {loading ? (
        <div className='py-20 text-center text-gray-400 text-sm font-medium'>Loading order payments...</div>
      ) : filteredOrders.length === 0 ? (
        <div className='py-24 bg-white rounded-2xl border border-dashed border-gray-200 text-center flex flex-col items-center gap-3'>
          <MdPayments size={48} className='text-gray-300' />
          <p className='text-gray-500 font-medium text-sm'>No payment records matching your filters.</p>
        </div>
      ) : (
        <div className='bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-gray-50/70 border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400 tracking-wider'>
                  <th className='py-4 px-5'>Order ID</th>
                  <th className='py-4 px-5'>Customer</th>
                  <th className='py-4 px-5'>Date & Time</th>
                  <th className='py-4 px-5'>Payment Method</th>
                  <th className='py-4 px-5 text-right'>Bill Amount</th>
                  <th className='py-4 px-5 text-right'>Discount</th>
                  <th className='py-4 px-5 text-right'>Paid Amount</th>
                  <th className='py-4 px-5 text-center'>Status</th>
                  <th className='py-4 px-5 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 text-xs font-medium text-gray-700'>
                {filteredOrders.map((order) => {
                  const isPaid = order.payment_status === 'paid'
                  const method = (order.payment_method || 'cash').toLowerCase()

                  return (
                    <tr key={order.id} className='hover:bg-gray-50/60 transition-colors'>

                      {/* Order ID */}
                      <td className='py-4 px-5 font-mono font-bold text-emerald-600'>
                        #{String(order.id).padStart(5, '0')}
                      </td>

                      {/* Customer Info */}
                      <td className='py-4 px-5'>
                        <div className='flex flex-col'>
                          <span className='font-bold text-gray-900'>{order.customer_name || order.name || 'Guest'}</span>
                          <span className='text-[10px] text-gray-400 font-mono'>{order.customer_phone || order.phone || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className='py-4 px-5 text-gray-500 text-[11px] whitespace-nowrap'>
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString() + ' ' + new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'N/A'}
                      </td>

                      {/* Payment Method Badge */}
                      <td className='py-4 px-5'>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          method === 'cash'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : method === 'card'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : method.includes('bkash') || method.includes('nagad')
                            ? 'bg-pink-50 text-pink-700 border border-pink-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {method === 'cash' ? <MdPointOfSale size={14} /> : <MdCreditCard size={14} />}
                          {order.payment_method || 'Cash'}
                        </span>
                      </td>

                      {/* Total Price */}
                      <td className='py-4 px-5 text-right font-bold text-gray-900'>
                        {formatCurrency(order.total_price)}
                      </td>

                      {/* Discount */}
                      <td className='py-4 px-5 text-right font-semibold text-rose-500'>
                        {formatCurrency(order.total_discount)}
                      </td>

                      {/* Paid Amount */}
                      <td className='py-4 px-5 text-right font-black text-emerald-600'>
                        {formatCurrency(order.paid_amount)}
                      </td>

                      {/* Payment Status Badge */}
                      <td className='py-4 px-5 text-center'>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className='py-4 px-5 text-center'>
                        <div className='flex items-center justify-center gap-2'>
                          <Link
                            href={`/dashboard/order/${order.id}`}
                            className='p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer'
                            title='View Order Details'
                          >
                            <MdVisibility size={18} />
                          </Link>
                          <button
                            onClick={() => generateReceipt(order)}
                            className='p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer'
                            title='Print Receipt'
                          >
                            <MdPrint size={18} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}

export default OrderPayments
