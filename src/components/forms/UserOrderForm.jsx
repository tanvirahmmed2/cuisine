'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../context/Context'
import Link from 'next/link'
import Image from 'next/image'
import { MdDeleteOutline, MdArrowBack, MdPayment, MdLocalShipping, MdPerson, MdReceiptLong } from 'react-icons/md'
import axios from 'axios'
import toast from 'react-hot-toast'

const deliveryOptions = [
    { id: 'takeaway', label: 'Takeaway', icon: '🛍️' },
    { id: 'takein', label: 'Dine In', icon: '🍽️' }
]
const paymentOptions = [
    { id: 'bkash', label: 'bKash', color: 'bg-primary' },
    { id: 'nagad', label: 'Nagad', color: 'bg-primary-light' },
    { id: 'rocket', label: 'Rocket', color: 'bg-secondary' },
    { id: 'card', label: 'Card', color: 'bg-secondary-dark' },
    { id: 'cash', label: 'Cash on Delivery', color: 'bg-tertiary-dark' }
]

const UserOrderForm = () => {
    const { subTotal, totalPrice, totalDiscount, addToCart, removeFromCart, decreaseQuantity, clearCart, userData, cart } = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        delivery_method: 'takein',
        payment_method: 'bkash',
        transaction_id: '',
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

    const handleOrder = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const orderPayload = {
                ...formData,
                items: cart.items,
                sub_total: subTotal,
                total_discount: totalDiscount,
                total_price: totalPrice,
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

    if (cart?.items?.length === 0) {
        return (
            <div className='w-full md:w-1/2 min-h-[60vh] p-10 flex flex-col items-center justify-center gap-10 pt-20 px-6 bg-tertiary-light rounded-[3rem]'>
                <div className='w-32 h-32 bg-tertiary-dark/5 rounded-[3rem] flex items-center justify-center text-6xl shadow-inner'>🥣</div>
                <div className='text-center space-y-4'>
                    <h2 className='text-4xl font-semibold text-tertiary-dark tracking-tighter'>The kitchen is quiet...</h2>
                    <p className='text-tertiary-dark/60 font-medium max-w-sm'>Your cart is waiting for some delicious flavors. Let's find something amazing for you.</p>
                </div>
                <Link href={'/menu'} className='px-12 py-5 bg-primary text-tertiary-light rounded-2xl font-semibold text-sm uppercase tracking-[0.2em] hover:bg-primary-dark transition-all shadow-2xl shadow-primary/20'>Explore Menu</Link>
            </div>
        )
    }

    return (
        <div className='w-full min-h-screen bg-tertiary-dark/5 p-6'>
            <div className='max-w-7xl mx-auto flex flex-col gap-6'>
                
                <div className='flex items-center gap-6'>
                    <Link href="/menu" className='p-4 bg-tertiary-light rounded-2xl border border-tertiary-dark/10 text-tertiary-dark/40 hover:text-primary hover:shadow-2xl transition-all'>
                        <MdArrowBack size={28} />
                    </Link>
                    <div>
                        <h1 className='text-5xl font-semibold text-tertiary-dark tracking-tight'>Checkout</h1>
                        <p className='text-tertiary-dark/60 text-[10px] font-semibold uppercase tracking-[0.3em] mt-2 ml-1'>Order Settlement & Details</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
                    
                    <div className='lg:col-span-7 flex flex-col gap-6'>
                        
                        <section className='bg-tertiary-light p-4 rounded-[2.5rem] border border-tertiary-dark/10 shadow-2xl shadow-primary/5 space-y-8'>
                            <div className='flex items-center gap-4 border-b border-tertiary-dark/5 pb-6'>
                                <div className='w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-sm'><MdPerson size={20}/></div>
                                <h2 className='text-2xl font-semibold text-tertiary-dark tracking-tight'>Recipient Details</h2>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[10px] font-semibold uppercase text-tertiary-dark/60 tracking-[0.2em] ml-1'>Full Name</label>
                                    <input type="text" name='name' required onChange={handleChange} value={formData.name} className='input-style' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[10px] font-semibold uppercase text-tertiary-dark/60 tracking-[0.2em] ml-1'>Phone Number</label>
                                    <input type="text" name='phone' required onChange={handleChange} value={formData.phone} className='input-style' />
                                </div>
                            </div>
                        </section>

                        <section className='space-y-2'>
                            <div className='flex items-center justify-between px-2'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center shadow-sm'><MdReceiptLong size={20}/></div>
                                    <h2 className='text-2xl font-semibold text-tertiary-dark tracking-tight'>Order Review</h2>
                                </div>
                                <button onClick={() => clearCart()} className='text-[10px] font-semibold text-tertiary-dark/40 hover:text-primary-dark uppercase tracking-widest transition-colors cursor-pointer'>Discard Cart</button>
                            </div>
                            <div className='flex flex-col gap-5'>
                                {cart?.items.map((item) => (
                                    <div key={item.cartItemId} className='bg-tertiary-light p-2 rounded-lg border border-tertiary-dark/10 shadow w-full flex items-center gap-8 group transition-all duration-500'>
                                        <div className='w-28 h-28 rounded-2xl overflow-hidden shadow-sm shrink-0 bg-tertiary-dark/5'>
                                            <Image src={item?.image} alt={item.title} width={150} height={150} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700' />
                                        </div>
                                        <div className='flex-1 flex flex-col justify-between py-1'>
                                            <div className='flex justify-between items-start gap-4'>
                                                <div>
                                                    <h3 className='font-semibold text-tertiary-dark text-xl tracking-tight leading-tight'>{item.title}</h3>
                                                    {item.selectedVariants && (
                                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                                            {Object.values(item.selectedVariants).map(v => (
                                                                
                                                                <span key={v.id} className='text-[9px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full'>
                                                                    {v.value}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className='font-semibold text-tertiary-dark text-xl tracking-tighter'>৳{item.salePrice || item.price}</p>
                                            </div>
                                            <div className='flex items-center justify-between mt-6'>
                                                <div className='flex items-center gap-6 bg-tertiary-dark/5 rounded-2xl px-6 py-2.5 border border-transparent hover:border-tertiary-dark/10 transition-all'>
                                                    <button className='text-tertiary-dark/60 hover:text-primary font-semibold text-xl' onClick={() => decreaseQuantity(item.cartItemId)}>-</button>
                                                    <span className='font-semibold text-tertiary-dark w-6 text-center'>{item.quantity}</span>
                                                    <button className='text-tertiary-dark/60 hover:text-primary font-semibold text-xl' onClick={() => addToCart(item)}>+</button>
                                                </div>
                                                <button className='p-3 text-tertiary-dark/40 hover:text-primary-dark hover:bg-primary/10 rounded-xl transition-all cursor-pointer' onClick={() => removeFromCart(item.cartItemId)}><MdDeleteOutline size={24} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className='lg:col-span-5 sticky top-32 space-y-4'>
                        
                        <section className='bg-tertiary-light p-4 rounded-[3rem] border border-tertiary-dark/10 shadow-[0_30px_100px_rgba(0,0,0,0.06)] space-y-10'>
                            <div className='space-y-2'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center shadow-sm'><MdLocalShipping size={20}/></div>
                                    <h2 className='text-xl font-semibold text-tertiary-dark tracking-tight'>Fulfillment</h2>
                                </div>
                                <div className='grid grid-cols-2 gap-5'>
                                    {deliveryOptions.map((opt) => (
                                        <button 
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setFormData(p => ({...p, delivery_method: opt.id}))}
                                            className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer ${
                                                formData.delivery_method === opt.id 
                                                ? 'border-primary bg-tertiary-dark/5 shadow-inner' 
                                                : 'border-tertiary-dark/5 hover:border-tertiary-dark/10'
                                            }`}
                                        >
                                            <span className="text-3xl">{opt.icon}</span>
                                            <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${formData.delivery_method === opt.id ? 'text-tertiary-dark' : 'text-tertiary-dark/40'}`}>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className='space-y-6 border-t border-tertiary-dark/5 pt-10'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-sm'><MdPayment size={20}/></div>
                                    <h2 className='text-xl font-semibold text-tertiary-dark tracking-tight'>Payment Mode</h2>
                                </div>
                                <div className='grid grid-cols-3 gap-3'>
                                    {paymentOptions.map((opt) => (
                                        <button 
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setFormData(p => ({...p, payment_method: opt.id}))}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                                                formData.payment_method === opt.id 
                                                ? 'border-primary bg-tertiary-dark/5' 
                                                : 'border-tertiary-dark/5 hover:border-tertiary-dark/10'
                                            }`}
                                        >
                                            <div className={`w-full h-1 rounded-full ${opt.color} mb-1`} />
                                            <span className={`text-[9px] font-semibold uppercase tracking-tighter text-center ${formData.payment_method === opt.id ? 'text-tertiary-dark' : 'text-tertiary-dark/40'}`}>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {formData.payment_method !== 'cash' && (
                                    <div className='flex flex-col gap-2 animate-in fade-in slide-in-from-top-2'>
                                        <label className='text-[10px] font-semibold uppercase text-tertiary-dark/60 tracking-[0.2em] ml-1'>Transaction Ref</label>
                                        <input 
                                            type="text" 
                                            name='transaction_id' 
                                            required 
                                            onChange={handleChange} 
                                            value={formData.transaction_id} 
                                           
                                            className='input-style' 
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className='space-y-4 border-t border-tertiary-dark/5 pt-10'>
                                <div className='flex justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-tertiary-dark/60'>
                                    <span>Gross Amount</span>
                                    <span className='font-semibold text-tertiary-dark'>৳{subTotal}</span>
                                </div>
                                <div className='flex justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary'>
                                    <span>Gourmet Savings</span>
                                    <span>-৳{totalDiscount}</span>
                                </div>
                                <div className='flex justify-between text-4xl font-semibold text-tertiary-dark pt-6 border-t border-dashed border-tertiary-dark/10'>
                                    <span>Total</span>
                                    <span className='tracking-tighter'>৳{totalPrice}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleOrder}
                                disabled={loading}
                                className='w-full py-6 bg-primary text-tertiary-light rounded-xl font-semibold text-sm uppercase tracking-[0.2em] hover:bg-primary-dark transition-all shadow-[0_20px_60px_rgba(0,0,0,0.2)] active:scale-[0.98] disabled:opacity-50 mt-6'
                            >
                                {loading ? 'CONFIRMING ORDER...' : 'FINALIZE ORDER'}
                            </button>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UserOrderForm