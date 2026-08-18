'use client'
import { generateReceipt } from '@/lib/database/print'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState, useContext } from 'react'
import toast from 'react-hot-toast'
import { Context } from '@/components/context/Context'
import { MdMoreVert, MdLocalShipping, MdPrint, MdVisibility, MdCancel, MdClose } from 'react-icons/md'

const DeliverOrder = () => {
  const { siteData } = useContext(Context)
  const [orders, setOrders] = useState([])
  const [activeMenuId, setActiveMenuId] = useState(null)

  // Payment Settlement Modal state
  const [paymentModalOrder, setPaymentModalOrder] = useState(null)
  const [paidInput, setPaidInput] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [submittingPayment, setSubmittingPayment] = useState(false)

  const fethcOrders = async () => {
    try {
      const res = await axios.get('/api/order/confirmed', { withCredentials: true })
      setOrders(res.data.payload)
    } catch (error) {
      setOrders([])
    }
  }

  useEffect(() => { fethcOrders() }, [])

  const handleCancel = async (id) => {
    setActiveMenuId(null)
    const confirm = window.confirm('Are your sure?')
    if (!confirm) return
    try {
      const res = await axios.post('/api/order/cancel', { id }, { withCredentials: true })
      toast.success(res.data.message)
      fethcOrders()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to cancel order")
    }
  }

  const openPaymentModal = (order) => {
    setActiveMenuId(null)
    setPaymentModalOrder(order)
    setPaidInput(String(order.total_price || 0))
    setPaymentMethod(order.payment_method || 'cash')
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
      const res = await axios.post('/api/order/delivery', {
        id: paymentModalOrder.id,
        paid_amount: paidAmount,
        change_amount: changeAmount,
        payment_method: paymentMethod,
        payment_status: 'paid'
      }, { withCredentials: true });

      toast.success(res.data.message || "Order delivered & payment saved");
      setPaymentModalOrder(null);
      fethcOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to deliver order");
    } finally {
      setSubmittingPayment(false);
    }
  }
  return (
    <div className='w-full flex flex-col items-center gap-4 min-h-screen'>
      {
        orders.length === 0 ? <p className='text-gray-400 text-sm font-medium py-16'>No order to deliver</p> : <div className='w-full flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <h1 className='text-2xl font-semibold text-tertiary-dark tracking-tight'>Waiting Orders</h1>
            <p className='text-tertiary-dark/60 text-xs font-medium'>Orders waiting for delivery.</p>
          </div>
          <div className='w-full grid grid-cols-12 bg-gray-50/50 p-3 sm:p-4 rounded-xl font-semibold text-[10px] uppercase text-gray-500 tracking-wider items-center gap-2 sm:gap-3 border border-gray-100'>
            <div className='col-span-3 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1'>Order ID</div>
            <div className='col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-2 xl:col-span-2'>Customer</div>
            <div className='hidden md:block md:col-span-3 lg:col-span-3 xl:col-span-3'>Items</div>
            <div className='hidden sm:block sm:col-span-2 md:col-span-2 lg:col-span-1 xl:col-span-1 text-center'>Note</div>
            <div className='col-span-3 sm:col-span-3 md:col-span-2 lg:col-span-2 xl:col-span-2 text-right'>Total Price</div>
            <div className='hidden xl:block xl:col-span-1 text-right'>Discount</div>
            <div className='hidden lg:block lg:col-span-2 xl:col-span-1 text-right'>Paid</div>
            <div className='col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1 text-center'>Actions</div>
          </div>

          <div className='w-full flex flex-col gap-2'>
            {
              orders.map((order) => {
                const isMenuOpen = activeMenuId === order.id;

                return (
                  <div
                    key={order.id}
                    className='w-full grid grid-cols-12 p-3 sm:p-4 items-center bg-white border border-gray-100 rounded-xl hover:border-pink-500 transition-all gap-2 sm:gap-3 relative shadow-2xs group'
                  >
                    {/* 1. Order ID */}
                    <div className='col-span-3 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1 font-mono font-semibold text-pink-600 text-xs truncate'>
                      <span>#{String(order.id).padStart(5, '0')}</span>
                    </div>

                    {/* 2. Customer */}
                    <div className='col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-2 xl:col-span-2 flex flex-col justify-center min-w-0'>
                      <span className='font-semibold text-xs text-gray-900 truncate'>{order.name || 'Guest'}</span>
                      <span className='text-[10px] text-gray-500 font-mono truncate'>{order.phone}</span>
                    </div>

                    {/* 3. Items */}
                    <div className='hidden md:flex md:col-span-3 lg:col-span-3 xl:col-span-3 flex-col gap-0.5 min-w-0'>
                      {order?.items?.map((item) => (
                        <span key={item.id} className='text-xs text-gray-700 truncate' title={`${item.quantity}x ${item.title}`}>
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
                            : 'bg-gray-100 text-gray-500'
                        }`}
                        title={order.note || (order.table_no && order.table_no !== 'N/A' ? `Table ${order.table_no}` : 'None')}
                      >
                        {order.note || (order.table_no && order.table_no !== 'N/A' ? `Table ${order.table_no}` : 'None')}
                      </span>
                    </div>

                    {/* 5. Total Price */}
                    <div className='col-span-3 sm:col-span-3 md:col-span-2 lg:col-span-2 xl:col-span-2 font-semibold text-gray-900 text-xs text-right flex items-center justify-end truncate'>
                      <span>৳{Number(order.total_price || 0).toLocaleString()}</span>
                    </div>

                    {/* 6. Discount */}
                    <div className='hidden xl:flex xl:col-span-1 font-semibold text-rose-500 text-xs text-right items-center justify-end truncate'>
                      <span>৳{Number(order.total_discount || 0).toLocaleString()}</span>
                    </div>

                    {/* 7. Total Paid */}
                    <div className='hidden lg:flex lg:col-span-2 xl:col-span-1 font-semibold text-emerald-700 text-xs text-right items-center justify-end truncate'>
                      <span>৳{Number(order.paid_amount || 0).toLocaleString()}</span>
                    </div>

                    {/* 8. Actions (Three Dot Button & Dropdown Menu) */}
                    <div className='col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1 flex items-center justify-end sm:justify-center relative'>
                      <button
                        type='button'
                        onClick={() => setActiveMenuId(isMenuOpen ? null : order.id)}
                        className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer'
                        title='Actions'
                      >
                        <MdMoreVert size={20} />
                      </button>

                      {isMenuOpen && (
                        <>
                          <div
                            className='fixed inset-0 z-40'
                            onClick={() => setActiveMenuId(null)}
                          />

                          <div className='absolute right-0 top-10 z-50 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 flex flex-col gap-0.5 text-left text-xs font-semibold animate-in fade-in zoom-in-95 duration-100'>
                            <button
                              type='button'
                              onClick={() => openPaymentModal(order)}
                              className='w-full px-3 py-2 text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-2 cursor-pointer'
                            >
                              <MdLocalShipping size={16} />
                              <span>Serve Order</span>
                            </button>

                            <button
                              type='button'
                              onClick={() => { setActiveMenuId(null); generateReceipt(order, siteData); }}
                              className='w-full px-3 py-2 text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-2 cursor-pointer'
                            >
                              <MdPrint size={16} />
                              <span>Print Receipt</span>
                            </button>

                            <Link
                              href={`/dashboard/sales/orders/${order.id}`}
                              onClick={() => setActiveMenuId(null)}
                              className='w-full px-3 py-2 text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center gap-2 cursor-pointer'
                            >
                              <MdVisibility size={16} />
                              <span>View Details</span>
                            </Link>

                            {order.status !== 'delivered' && (
                              <>
                                <div className='border-t border-gray-100 my-0.5' />

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
              })
            }
          </div>
        </div>
      }

      {/* Payment Settlement Modal */}
      {paymentModalOrder && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150'>
          <div className='bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-100 flex flex-col gap-5 animate-in zoom-in-95 duration-150 text-left text-gray-900'>
            <div className='flex items-center justify-between border-b border-gray-100 pb-3'>
              <div>
                <h2 className='text-lg font-semibold text-gray-900'>Serve Order & Settle Payment</h2>
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
                    className={`w-full px-3 py-2 rounded-xl border outline-none text-xs font-semibold transition-all ${!isPaymentValid
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
                    <span>Serve & Save Payment</span>
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

export default DeliverOrder
