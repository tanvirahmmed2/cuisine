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
  MdVisibility,
  MdClose
} from 'react-icons/md'

const PendingOrder = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [siteData, setSiteData] = useState({})

  // Payment Settlement Modal state
  const [paymentModalOrder, setPaymentModalOrder] = useState(null)
  const [paymentModalType, setPaymentModalType] = useState('confirm') // 'confirm' | 'deliver'
  const [paidInput, setPaidInput] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [submittingPayment, setSubmittingPayment] = useState(false)

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

  const openPaymentModal = (order, type) => {
    setActiveMenuId(null)
    setPaymentModalOrder(order)
    setPaymentModalType(type)
    setPaidInput(String(order.total_price || 0))
    setPaymentMethod(order.payment_method || 'cash')
  }

  const handlePrint = (order) => {
    setActiveMenuId(null)
    generateReceipt({ ...order, receipt_type: 'Sales Copy' }, siteData)
  }

  // Payment Calculations
  const totalPrice = Number(paymentModalOrder?.total_price || 0);
  const paidAmount = Number(paidInput || 0);
  const changeAmount = paidAmount >= totalPrice ? paidAmount - totalPrice : 0;
  const isPaymentValid = paidInput !== '' && !isNaN(paidAmount) && paidAmount >= totalPrice;

  const handleSavePayment = async (e) => {
    e.preventDefault();
    if (!paymentModalOrder) return;
    if (!isPaymentValid) {
      toast.error(`Paid amount must be at least total price (৳${totalPrice.toLocaleString()})`);
      return;
    }

    setSubmittingPayment(true);
    try {
      const endpoint = paymentModalType === 'confirm' ? '/api/order/confirmed' : '/api/order/delivery';
      const res = await axios.post(endpoint, {
        id: paymentModalOrder.id,
        paid_amount: paidAmount,
        change_amount: changeAmount,
        payment_method: paymentMethod,
        payment_status: 'paid'
      }, { withCredentials: true });

      toast.success(res.data.message || (paymentModalType === 'confirm' ? "Order confirmed & payment saved" : "Order delivered & payment saved"));
      setPaymentModalOrder(null);
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to process payment");
    } finally {
      setSubmittingPayment(false);
    }
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
        <h1 className='text-2xl font-semibold text-tertiary-dark tracking-tight'>Pending Orders</h1>
        <p className='text-tertiary-dark/60 text-xs font-medium'>Orders waiting for confirmation or processing.</p>
      </div>

      <div className='w-full flex flex-col gap-3'>
        {orders.length > 0 ? (
          <div className='w-full flex flex-col gap-2 min-h-screen'>
            
            <div className='grid grid-cols-12 bg-tertiary-dark/5 p-3 sm:p-4 rounded-xl font-semibold text-[10px] uppercase text-tertiary-dark/60 tracking-widest border border-tertiary-dark/10 gap-2 sm:gap-3 items-center'>
              <div className='col-span-3 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1'>Order ID</div>
              <div className='col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-2 xl:col-span-2'>Customer</div>
              <div className='hidden md:block md:col-span-3 lg:col-span-3 xl:col-span-3'>Items</div>
              <div className='hidden sm:block sm:col-span-2 md:col-span-2 lg:col-span-1 xl:col-span-1 text-center'>Note</div>
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
                    <div className='col-span-3 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1 font-mono font-semibold text-primary text-xs truncate'>
                      <span>#{String(order.id).padStart(5, '0')}</span>
                    </div>

                    {/* 2. Customer */}
                    <div className='col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-2 xl:col-span-2 flex flex-col justify-center min-w-0'>
                      <span className='font-semibold text-xs text-tertiary-dark truncate'>{order.name || 'Guest'}</span>
                      <span className='text-[10px] text-tertiary-dark/60 font-mono truncate'>{order.phone}</span>
                    </div>

                    {/* 3. Items */}
                    <div className='hidden md:flex md:col-span-3 lg:col-span-3 xl:col-span-3 flex-col gap-0.5 min-w-0'>
                      {order?.items?.map((item) => (
                        <span key={item.id} className='text-xs text-tertiary-dark/80 truncate' title={`${item.quantity}x ${item.title}`}>
                          {item.quantity}x {item.title}
                        </span>
                      ))}
                    </div>

                    {/* 4. Note */}
                    <div className='hidden sm:flex sm:col-span-2 md:col-span-2 lg:col-span-1 xl:col-span-1 items-center justify-center'>
                      <span 
                        className={`inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] font-semibold truncate max-w-full ${
                          order.note 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300/50' 
                            : 'bg-tertiary-dark/5 text-tertiary-dark/50'
                        }`}
                        title={order.note || (order.table_no && order.table_no !== 'N/A' ? `Table ${order.table_no}` : 'None')}
                      >
                        {order.note || (order.table_no && order.table_no !== 'N/A' ? `Table ${order.table_no}` : 'None')}
                      </span>
                    </div>

                    {/* 5. Total Price */}
                    <div className='col-span-3 sm:col-span-3 md:col-span-2 lg:col-span-2 xl:col-span-2 font-semibold text-tertiary-dark text-xs text-right flex items-center justify-end truncate'>
                      <span>৳{Number(order.total_price || 0).toLocaleString()}</span>
                    </div>

                    {/* 6. Discount */}
                    <div className='hidden xl:flex xl:col-span-1 font-semibold text-secondary-dark text-xs text-right items-center justify-end truncate'>
                      <span>৳{Number(order.total_discount || 0).toLocaleString()}</span>
                    </div>

                    {/* 7. Total Paid */}
                    <div className='hidden lg:flex lg:col-span-2 xl:col-span-1 font-semibold text-emerald-700 text-xs text-right items-center justify-end truncate'>
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
                              onClick={() => openPaymentModal(order, 'confirm')}
                              className='w-full px-3 py-2 text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-2 cursor-pointer'
                            >
                              <MdCheckCircle size={16} />
                              <span>Confirm Order</span>
                            </button>

                            <button
                              type='button'
                              onClick={() => openPaymentModal(order, 'deliver')}
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

                            {order.status !== 'delivered' && (
                              <>
                                <div className='border-t border-tertiary-dark/10 my-0.5' />

                                <button
                                  type='button'
                                  onClick={() => handleCancel(order.id)}
                                  className='w-full px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer'
                                >
                                  <MdCancel size={16} />
                                  <span>Cancel Order</span>
                                </button>
                              </>
                            )}
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

      {/* Payment Settlement Modal */}
      {paymentModalOrder && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150'>
          <div className='bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-100 flex flex-col gap-5 animate-in zoom-in-95 duration-150 text-left text-gray-900'>
            <div className='flex items-center justify-between border-b border-gray-100 pb-3'>
              <div>
                <h2 className='text-lg font-semibold text-gray-900'>
                  {paymentModalType === 'confirm' ? 'Confirm Order & Collect Payment' : 'Mark Delivered & Settle Payment'}
                </h2>
                <p className='text-xs text-gray-500 font-medium mt-0.5'>
                  Order #{String(paymentModalOrder.id).padStart(5, '0')} • {paymentModalOrder.name || 'Guest'} ({paymentModalOrder.phone})
                </p>
              </div>
              <button
                type='button'
                onClick={() => setPaymentModalOrder(null)}
                className='p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer'
              >
                <MdClose size={22} />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className='flex flex-col gap-4'>
              {/* Total Price Display Box */}
              <div className='bg-pink-50/70 border border-pink-100 rounded-xl p-4 flex items-center justify-between'>
                <div>
                  <span className='text-[10px] uppercase font-semibold text-pink-600 tracking-wider'>Total Payable</span>
                  <p className='text-2xl font-black text-pink-600 tracking-tight'>৳{totalPrice.toLocaleString()}</p>
                </div>
                {paymentModalOrder.id && (
                  <span className='px-3 py-1 rounded-lg bg-pink-100 text-pink-700 text-xs font-semibold uppercase font-mono'>
                    #{String(paymentModalOrder.id).padStart(5, '0')}
                  </span>
                )}
              </div>

              {/* Inputs Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {/* Payment Method */}
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-semibold text-gray-700'>Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className='w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-xs font-semibold bg-white cursor-pointer'
                  >
                    <option value='cash'>Cash</option>
                    <option value='card'>Card</option>
                    <option value='bkash'>bKash</option>
                    <option value='nagad'>Nagad</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                {/* Paid Amount Input */}
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-semibold text-gray-700'>Paid Amount (৳)</label>
                  <input
                    type='number'
                    min='0'
                    step='any'
                    value={paidInput}
                    onChange={(e) => setPaidInput(e.target.value)}
                    placeholder='Enter paid amount...'
                    className={`w-full px-3 py-2 rounded-xl border outline-none text-xs font-semibold transition-all ${
                      !isPaymentValid
                        ? 'border-rose-400 bg-rose-50/40 text-rose-700 focus:ring-2 focus:ring-rose-100'
                        : 'border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 text-gray-900'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Quick Amount Presets */}
              <div className='flex flex-wrap gap-1.5 items-center'>
                <span className='text-[10px] font-semibold text-gray-400 uppercase tracking-wider mr-1'>Presets:</span>
                <button
                  type='button'
                  onClick={() => setPaidInput(String(totalPrice))}
                  className='px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer'
                >
                  Exact (৳{totalPrice.toLocaleString()})
                </button>
                {[500, 1000, 2000, 5000].map((amt) => (
                  amt >= totalPrice && (
                    <button
                      key={amt}
                      type='button'
                      onClick={() => setPaidInput(String(amt))}
                      className='px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer'
                    >
                      ৳{amt.toLocaleString()}
                    </button>
                  )
                ))}
              </div>

              {/* Change Amount Display Box */}
              <div className='bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex items-center justify-between'>
                <span className='text-xs font-semibold text-gray-600'>Return Change</span>
                <span className={`text-base font-semibold font-mono ${changeAmount > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                  ৳{changeAmount.toLocaleString()}
                </span>
              </div>

              {/* Mandatory Total Payment Alert */}
              {!isPaymentValid && (
                <div className='text-xs text-rose-700 font-semibold bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2'>
                  <span>⚠️ Must take total payment! Paid amount cannot be less than ৳{totalPrice.toLocaleString()}.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex justify-end items-center gap-2 pt-2 border-t border-gray-100'>
                <button
                  type='button'
                  onClick={() => setPaymentModalOrder(null)}
                  className='px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer'
                  disabled={submittingPayment}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={!isPaymentValid || submittingPayment}
                  className='px-5 py-2 rounded-xl text-xs font-semibold text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-pink-500/20'
                >
                  {submittingPayment ? (
                    <>
                      <div className='w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{paymentModalType === 'confirm' ? 'Confirm & Save Payment' : 'Deliver & Save Payment'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PendingOrder
