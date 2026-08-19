'use client'
import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  MdConfirmationNumber,
  MdRefresh,
  MdSearch,
  MdAttachMoney,
  MdTrendingUp,
  MdReceiptLong,
  MdArrowBack,
  MdVisibility,
  MdLoyalty
} from 'react-icons/md'

const CouponUsages = ({ role = 'manager' }) => {
  const [usages, setUsages] = useState([])
  const [stats, setStats] = useState({
    total_usages: 0,
    total_savings: 0,
    unique_coupons_used: 0,
    avg_discount_per_order: 0
  })
  const [topCoupons, setTopCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchUsages = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/coupon/usage', { withCredentials: true })
      if (res.data.success) {
        setUsages(res.data.payload.usages || [])
        setStats(res.data.payload.stats || {})
        setTopCoupons(res.data.payload.top_coupons || [])
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch coupon usages')
      setUsages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsages()
  }, [])

  // Filtered usages
  const filteredUsages = useMemo(() => {
    return usages.filter(u => {
      const q = searchQuery.toLowerCase().trim()
      if (!q) return true
      return (
        String(u.coupon_code || '').toLowerCase().includes(q) ||
        String(u.coupon_title || '').toLowerCase().includes(q) ||
        String(u.customer_name || '').toLowerCase().includes(q) ||
        String(u.customer_phone || '').toLowerCase().includes(q) ||
        String(u.order_id || '').toLowerCase().includes(q)
      )
    })
  }, [usages, searchQuery])

  const formatCurrency = (val) => `৳${Number(val || 0).toLocaleString()}`

  return (
    <div className='w-full max-w-7xl mx-auto flex flex-col gap-8 pb-12 min-h-screen'>

      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2.5'>
            <MdConfirmationNumber className='text-pink-500' size={30} /> Coupon Usages History
          </h1>
          <p className='text-gray-500 text-sm'>
            Detailed log of promo code redemptions and customer discount savings.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Link
            href={`/dashboard/${role}/coupons`}
            className='px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer'
          >
            <MdArrowBack size={18} /> Manage Coupons
          </Link>
          <button
            onClick={fetchUsages}
            className='p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-xs cursor-pointer'
            title='Refresh'
          >
            <MdRefresh size={18} />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>

        <div className='bg-white border border-pink-100 p-5 rounded-2xl shadow-xs flex flex-col gap-2 relative overflow-hidden'>
          <div className='flex items-center justify-between'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-pink-600'>Total Redemptions</span>
            <div className='w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600'>
              <MdConfirmationNumber size={20} />
            </div>
          </div>
          <p className='text-2xl font-black text-gray-900'>{stats.total_usages}</p>
          <p className='text-xs text-gray-400 font-medium'>Total times coupons applied</p>
        </div>

        <div className='bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs flex flex-col gap-2 relative overflow-hidden'>
          <div className='flex items-center justify-between'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-emerald-600'>Total Customer Savings</span>
            <div className='w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600'>
              <MdAttachMoney size={20} />
            </div>
          </div>
          <p className='text-2xl font-black text-emerald-600'>{formatCurrency(stats.total_savings)}</p>
          <p className='text-xs text-gray-400 font-medium'>Total money saved by customers</p>
        </div>

        <div className='bg-white border border-indigo-100 p-5 rounded-2xl shadow-xs flex flex-col gap-2 relative overflow-hidden'>
          <div className='flex items-center justify-between'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-indigo-600'>Active Promo Codes</span>
            <div className='w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600'>
              <MdLoyalty size={20} />
            </div>
          </div>
          <p className='text-2xl font-black text-gray-900'>{stats.unique_coupons_used}</p>
          <p className='text-xs text-gray-400 font-medium'>Unique codes redeemed</p>
        </div>

        <div className='bg-white border border-amber-100 p-5 rounded-2xl shadow-xs flex flex-col gap-2 relative overflow-hidden'>
          <div className='flex items-center justify-between'>
            <span className='text-[10px] font-bold uppercase tracking-widest text-amber-600'>Avg. Discount / Order</span>
            <div className='w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600'>
              <MdTrendingUp size={20} />
            </div>
          </div>
          <p className='text-2xl font-black text-gray-900'>{formatCurrency(stats.avg_discount_per_order)}</p>
          <p className='text-xs text-gray-400 font-medium'>Average savings per redemption</p>
        </div>

      </div>

      {/* Top Coupons Leaderboard Cards */}
      {topCoupons.length > 0 && (
        <div className='flex flex-col gap-3'>
          <h2 className='text-xs font-bold uppercase tracking-wider text-gray-400'>Top Performing Coupons</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {topCoupons.slice(0, 4).map((c, idx) => (
              <div key={c.code} className='bg-white border border-gray-100 rounded-xl p-4 shadow-2xs flex items-center justify-between gap-3'>
                <div className='flex items-center gap-3'>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    idx === 0 ? 'bg-amber-100 text-amber-800' : idx === 1 ? 'bg-gray-100 text-gray-700' : 'bg-orange-50 text-orange-700'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-mono font-bold text-pink-600 text-xs'>{c.code}</span>
                    <span className='text-[11px] text-gray-500 font-medium truncate max-w-[130px]'>{c.title}</span>
                  </div>
                </div>
                <div className='text-right'>
                  <span className='text-xs font-black text-gray-900'>{c.usage_count} uses</span>
                  <p className='text-[10px] text-emerald-600 font-bold'>{formatCurrency(c.total_discount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search Controls */}
      <div className='bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='relative w-full sm:w-80'>
          <MdSearch size={20} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search Code, Title, Customer, Order ID...'
            className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-pink-500 transition-all'
          />
        </div>

        <div className='text-xs text-gray-400 font-medium'>
          Showing <span className='font-bold text-gray-700'>{filteredUsages.length}</span> redemption records
        </div>
      </div>

      {/* Redemptions Table */}
      {loading ? (
        <div className='py-20 text-center text-gray-400 text-sm font-medium'>Loading coupon usage records...</div>
      ) : filteredUsages.length === 0 ? (
        <div className='py-24 bg-white rounded-2xl border border-dashed border-gray-200 text-center flex flex-col items-center gap-3'>
          <MdConfirmationNumber size={48} className='text-gray-300' />
          <p className='text-gray-500 font-medium text-sm'>No coupon usage records found.</p>
        </div>
      ) : (
        <div className='bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-gray-50/70 border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400 tracking-wider'>
                  <th className='py-4 px-5'>Usage Date</th>
                  <th className='py-4 px-5'>Promo Code & Title</th>
                  <th className='py-4 px-5'>Order ID</th>
                  <th className='py-4 px-5'>Customer</th>
                  <th className='py-4 px-5 text-right'>Subtotal</th>
                  <th className='py-4 px-5 text-right'>Discount Saved</th>
                  <th className='py-4 px-5 text-right'>Final Bill</th>
                  <th className='py-4 px-5 text-center'>Payment Status</th>
                  <th className='py-4 px-5 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 text-xs font-medium text-gray-700'>
                {filteredUsages.map((usage) => {
                  return (
                    <tr key={usage.usage_id} className='hover:bg-gray-50/60 transition-colors'>

                      {/* Date & Time */}
                      <td className='py-4 px-5 text-gray-500 text-[11px] whitespace-nowrap'>
                        {usage.used_at
                          ? new Date(usage.used_at).toLocaleDateString() + ' ' + new Date(usage.used_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'N/A'}
                      </td>

                      {/* Code & Title */}
                      <td className='py-4 px-5'>
                        <div className='flex flex-col gap-1 items-start'>
                          <span className='px-2 py-0.5 rounded-md bg-pink-50 border border-pink-200 font-mono font-bold text-pink-600 text-[11px]'>
                            {usage.coupon_code}
                          </span>
                          <span className='text-[11px] text-gray-500 font-medium truncate max-w-[180px]'>
                            {usage.coupon_title || 'Discount Coupon'}
                          </span>
                        </div>
                      </td>

                      {/* Order ID */}
                      <td className='py-4 px-5 font-mono font-bold text-indigo-600'>
                        #{String(usage.order_id).padStart(5, '0')}
                      </td>

                      {/* Customer */}
                      <td className='py-4 px-5'>
                        <div className='flex flex-col'>
                          <span className='font-bold text-gray-900'>{usage.customer_name || 'Guest'}</span>
                          <span className='text-[10px] text-gray-400 font-mono'>{usage.customer_phone || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className='py-4 px-5 text-right text-gray-600'>
                        {formatCurrency(usage.sub_total)}
                      </td>

                      {/* Discount Saved */}
                      <td className='py-4 px-5 text-right font-black text-rose-500'>
                        {formatCurrency(usage.discount_amount)}
                      </td>

                      {/* Final Bill */}
                      <td className='py-4 px-5 text-right font-bold text-gray-900'>
                        {formatCurrency(usage.total_price)}
                      </td>

                      {/* Payment Status */}
                      <td className='py-4 px-5 text-center'>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          usage.payment_status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {usage.payment_status || 'unpaid'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className='py-4 px-5 text-center'>
                        <Link
                          href={`/dashboard/order/${usage.order_id}`}
                          className='p-1.5 inline-block text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer'
                          title='View Order'
                        >
                          <MdVisibility size={18} />
                        </Link>
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

export default CouponUsages
