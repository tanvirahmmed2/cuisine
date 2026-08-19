'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../context/Context'
import Link from 'next/link'
import Image from 'next/image'
import { MdDeleteOutline, MdArrowBack, MdPayment, MdLocalShipping, MdPerson, MdReceiptLong, MdCheckCircle } from 'react-icons/md'
import axios from 'axios'
import toast from 'react-hot-toast'

const deliveryOptions = [
    { id: 'takein', label: 'Dine In', icon: '🍽️' },
    { id: 'takeaway', label: 'Takeaway', icon: '🛍️' }
]

const paymentOptions = [
    { id: 'bkash', label: 'bKash' },
    { id: 'nagad', label: 'Nagad' },
    { id: 'rocket', label: 'Rocket' },
    { id: 'card', label: 'Card' },
    { id: 'cash', label: 'Cash on Delivery' }
]

const UserOrderForm = () => {
    const { subTotal, totalPrice, totalDiscount, addToCart, removeFromCart, decreaseQuantity, clearCart, userData, cart, siteData } = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    const isServiceOffline = siteData && siteData.is_service_available === false;

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        delivery_method: 'takein',
        payment_method: 'bkash',
        transaction_id: '',
        note: '',
    })

    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                name: userData.name || '',
                phone: userData.phone || ''
            }))
        }
    }, [userData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const [couponInput, setCouponInput] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [checkingCoupon, setCheckingCoupon] = useState(false)

    const couponDiscountAmount = appliedCoupon ? Number(appliedCoupon.discount_amount) : 0
    const effectiveDiscount = Number(totalDiscount || 0) + couponDiscountAmount
    const finalPayable = Math.max(0, Number(totalPrice || 0) - couponDiscountAmount)

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return
        setCheckingCoupon(true)
        try {
            const res = await axios.post('/api/coupon/apply', {
                code: couponInput.trim(),
                total_price: subTotal,
                user_id: userData?.id
            })
            if (res.data.success) {
                setAppliedCoupon(res.data.payload)
                setCouponInput('')
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Invalid coupon code')
        } finally {
            setCheckingCoupon(false)
        }
    }

    const handleOrder = async (e) => {
        e.preventDefault()

        if (isServiceOffline) {
            toast.error("Restaurant service is currently unavailable. We are not accepting orders at this time.")
            return
        }

        if (!formData.name.trim() || !formData.phone.trim()) {
            toast.error("Please enter your name and phone number")
            return
        }

        if (formData.payment_method !== 'cash' && !formData.transaction_id.trim()) {
            toast.error("Please enter the transaction reference ID")
            return
        }

        setLoading(true)
        try {
            const cleanedPhone = formData.phone ? formData.phone.replace(/\D/g, '').slice(-11) : '';
            const orderPayload = {
                ...formData,
                phone: cleanedPhone || formData.phone,
                items: cart.items,
                sub_total: subTotal,
                total_discount: effectiveDiscount,
                total_price: finalPayable,
                coupon_id: appliedCoupon?.coupon_id || null,
                coupon_code: appliedCoupon?.code || null,
                coupon_discount: couponDiscountAmount,
                status: 'pending'
            }
            const res = await axios.post('/api/order', orderPayload, { withCredentials: true })
            toast.success(res.data.message)
            clearCart()
            window.location.replace('/profile')
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || "Failed to place order")
        } finally {
            setLoading(false)
        }
    }

    if (!isMounted) return null;

    if (!cart?.items || cart.items.length === 0) {
        return (
            <div className='w-full max-w-md mx-auto min-h-[50vh] p-8 flex flex-col items-center justify-center gap-6 text-center bg-white rounded-3xl border border-gray-100 shadow-sm my-12'>
                <div className='w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center text-3xl shadow-inner'>🥣</div>
                <div className='space-y-1.5'>
                    <h2 className='text-2xl font-semibold text-gray-900'>Your Cart is Empty</h2>
                    <p className='text-xs text-gray-500 max-w-xs'>Explore our delicious menu items and add your favorites to checkout.</p>
                </div>
                <Link href='/menu' className='px-8 py-3 bg-pink-500 text-white rounded-xl font-semibold text-xs tracking-wider hover:bg-pink-600 transition-all shadow-md shadow-pink-500/20'>
                    Browse Menu
                </Link>
            </div>
        )
    }

    return (
        <div className='w-full min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6'>
            <div className='max-w-6xl mx-auto flex flex-col gap-6'>
                
                {/* Header */}
                <div className='flex items-center justify-between border-b border-gray-200/80 pb-4'>
                    <div className='flex items-center gap-3'>
                        <Link href="/menu" className='p-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-pink-600 hover:border-pink-200 transition-all shadow-2xs'>
                            <MdArrowBack size={20} />
                        </Link>
                        <div>
                            <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Checkout</h1>
                            <p className='text-xs text-gray-500 font-medium'>Review your items and complete your order</p>
                        </div>
                    </div>
                </div>

                {/* Service Unavailable Alert Banner */}
                {isServiceOffline && (
                    <div className='w-full bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold'>
                        <span className='text-lg'>⚠️</span>
                        <span>Restaurant service is currently offline. We are not accepting new orders at this time.</span>
                    </div>
                )}

                {/* Main 2-Column Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
                    
                    {/* Left Column: Customer Form & Payment */}
                    <div className='lg:col-span-7 flex flex-col gap-6'>
                        
                        {/* 1. Recipient Information */}
                        <div className='bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4'>
                            <div className='flex items-center gap-2.5 border-b border-gray-100 pb-3'>
                                <MdPerson size={20} className='text-pink-500' />
                                <h2 className='text-base font-semibold text-gray-900'>Customer Details</h2>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-xs font-semibold text-gray-700'>Full Name *</label>
                                    <input 
                                        type="text" 
                                        name='name' 
                                        required 
                                        onChange={handleChange} 
                                        value={formData.name} 
                                        placeholder="Enter your name"
                                        className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none text-xs font-medium focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all'
                                    />
                                </div>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-xs font-semibold text-gray-700'>Phone Number *</label>
                                    <input 
                                        type="text" 
                                        name='phone' 
                                        required 
                                        onChange={handleChange} 
                                        value={formData.phone} 
                                        placeholder="01XXXXXXXXX"
                                        className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none text-xs font-medium focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all font-mono'
                                    />
                                </div>
                                <div className='flex flex-col gap-1.5 sm:col-span-2'>
                                    <label className='text-xs font-semibold text-gray-700'>Order Note / Special Instructions (Optional)</label>
                                    <input 
                                        type="text" 
                                        name='note' 
                                        onChange={handleChange} 
                                        value={formData.note || ''} 
                                        placeholder="e.g. Extra spicy, no onion, call on arrival"
                                        className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none text-xs font-medium focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Fulfillment Method */}
                        <div className='bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4'>
                            <div className='flex items-center gap-2.5 border-b border-gray-100 pb-3'>
                                <MdLocalShipping size={20} className='text-pink-500' />
                                <h2 className='text-base font-semibold text-gray-900'>Fulfillment Option</h2>
                            </div>
                            <div className='grid grid-cols-2 gap-3'>
                                {deliveryOptions.map((opt) => (
                                    <button 
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setFormData(p => ({...p, delivery_method: opt.id}))}
                                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                            formData.delivery_method === opt.id 
                                            ? 'border-pink-500 bg-pink-50/50 text-pink-600 font-semibold shadow-2xs' 
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50/30'
                                        }`}
                                    >
                                        <span className="text-lg">{opt.icon}</span>
                                        <span className='text-xs font-semibold'>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Payment Method */}
                        <div className='bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4'>
                            <div className='flex items-center gap-2.5 border-b border-gray-100 pb-3'>
                                <MdPayment size={20} className='text-pink-500' />
                                <h2 className='text-base font-semibold text-gray-900'>Payment Method</h2>
                            </div>
                            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2.5'>
                                {paymentOptions.map((opt) => {
                                    const isSelected = formData.payment_method === opt.id;
                                    return (
                                        <button 
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setFormData(p => ({...p, payment_method: opt.id}))}
                                            className={`p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                                isSelected 
                                                ? 'border-pink-500 bg-pink-50/60 text-pink-600 shadow-2xs' 
                                                : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-gray-50/30'
                                            }`}
                                        >
                                            <span>{opt.label}</span>
                                            {isSelected && <MdCheckCircle size={16} className='text-pink-500' />}
                                        </button>
                                    )
                                })}
                            </div>

                            {formData.payment_method !== 'cash' && (
                                <div className='flex flex-col gap-1.5 pt-2 animate-in fade-in duration-150'>
                                    <label className='text-xs font-semibold text-gray-700'>Transaction Reference ID *</label>
                                    <input 
                                        type="text" 
                                        name='transaction_id' 
                                        required 
                                        onChange={handleChange} 
                                        value={formData.transaction_id} 
                                        placeholder="Enter TrxID / Reference"
                                        className='w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none text-xs font-mono font-semibold text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all' 
                                    />
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Cart Items & Order Summary */}
                    <div className='lg:col-span-5 sticky top-24 space-y-6'>
                        
                        <div className='bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col gap-5'>
                            
                            {/* Title & Discard Button */}
                            <div className='flex items-center justify-between border-b border-gray-100 pb-3'>
                                <div className='flex items-center gap-2'>
                                    <MdReceiptLong size={20} className='text-pink-500' />
                                    <h2 className='text-base font-semibold text-gray-900'>Order Items ({cart?.items.length})</h2>
                                </div>
                                <button 
                                    onClick={() => clearCart()} 
                                    className='text-[11px] font-semibold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer'
                                >
                                    Clear Cart
                                </button>
                            </div>

                            {/* Items List */}
                            <div className='flex flex-col gap-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar'>
                                {cart?.items.map((item) => (
                                    <div key={item.cartItemId} className='flex items-center justify-between gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-all'>
                                        <div className='flex items-center gap-3 min-w-0'>
                                            <div className='w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200/50'>
                                                <Image src={item?.image} alt={item.title} width={60} height={60} className='w-full h-full object-cover' />
                                            </div>
                                            <div className='min-w-0'>
                                                <h3 className='font-semibold text-xs text-gray-900 truncate'>{item.title}</h3>
                                                <p className='text-[11px] text-gray-500 font-semibold'>৳{(item.salePrice || item.price).toLocaleString()} × {item.quantity}</p>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-3 shrink-0'>
                                            <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700'>
                                                <button type='button' onClick={() => decreaseQuantity(item.cartItemId)} className='hover:text-pink-600 px-1 cursor-pointer'>-</button>
                                                <span>{item.quantity}</span>
                                                <button type='button' onClick={() => addToCart(item)} className='hover:text-pink-600 px-1 cursor-pointer'>+</button>
                                            </div>
                                            <button type='button' onClick={() => removeFromCart(item.cartItemId)} className='text-gray-400 hover:text-rose-500 transition-colors cursor-pointer p-1'>
                                                <MdDeleteOutline size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Code Section */}
                            <div className='border-t border-gray-100 pt-3 flex flex-col gap-2'>
                                {appliedCoupon ? (
                                    <div className='flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs'>
                                        <div className='flex flex-col'>
                                            <span className='font-bold text-emerald-800 flex items-center gap-1'>
                                                🎟️ {appliedCoupon.code}
                                            </span>
                                            <span className='text-[10px] text-emerald-600 font-medium'>
                                                {appliedCoupon.title} (-৳{appliedCoupon.discount_amount.toLocaleString()})
                                            </span>
                                        </div>
                                        <button
                                            type='button'
                                            onClick={() => setAppliedCoupon(null)}
                                            className='text-rose-500 hover:text-rose-700 font-bold text-xs p-1 cursor-pointer'
                                            title='Remove Coupon'
                                        >
                                            ✕ Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className='flex gap-2 items-center'>
                                        <input
                                            type='text'
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                            placeholder='Enter Coupon Code'
                                            className='w-full px-3 py-2 border border-gray-200 rounded-xl outline-none text-xs font-mono font-bold uppercase focus:border-pink-500 transition-all bg-gray-50/50'
                                        />
                                        <button
                                            type='button'
                                            onClick={handleApplyCoupon}
                                            disabled={checkingCoupon || !couponInput.trim()}
                                            className='px-4 py-2 bg-gray-900 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shrink-0 cursor-pointer'
                                        >
                                            {checkingCoupon ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className='border-t border-gray-100 pt-4 space-y-2.5 text-xs text-gray-600 font-medium'>
                                <div className='flex justify-between'>
                                    <span>Subtotal</span>
                                    <span className='font-semibold text-gray-900'>৳{subTotal.toLocaleString()}</span>
                                </div>
                                {effectiveDiscount > 0 && (
                                    <div className='flex justify-between text-emerald-600'>
                                        <span>Total Discount Savings</span>
                                        <span className='font-semibold'>-৳{effectiveDiscount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className='flex justify-between items-center text-base font-semibold text-pink-600 pt-3 border-t border-gray-100'>
                                    <span>Total Payable</span>
                                    <span className='text-xl'>৳{finalPayable.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button 
                                onClick={handleOrder}
                                disabled={loading || isServiceOffline}
                                className='w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold text-xs tracking-wider transition-all shadow-md shadow-pink-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2'
                            >
                                {loading ? 'Placing Order...' : 'Confirm & Place Order'}
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default UserOrderForm