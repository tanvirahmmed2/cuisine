// components/forms/Orderform.jsx
'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../context/Context'
import toast from 'react-hot-toast'
import axios from 'axios'
import Image from 'next/image'
import { MdDeleteOutline, MdChevronRight } from 'react-icons/md'
import { generateReceipt } from '@/lib/database/print'

const paymentOptions = ['bkash', 'card', 'nagad', 'rocket', 'cash']
const deliveryOptions = ['takeaway', 'takein']

const Orderform = () => {
    const { addToCart, removeFromCart, decreaseQuantity, clearCart, cart, siteData } = useContext(Context)

    const [subTotal, setSubTotal] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalDiscount, setTotalDiscount] = useState(0)
    const [discountType, setDiscountType] = useState('flat') // 'flat' or 'percent'
    const [discountValue, setDiscountValue] = useState(0)
    
    const [formData, setFormData] = useState({
        phone: '',
        payment_method: 'cash',
        delivery_method: 'takein',
        payment_status: 'paid',
        transaction_id: '',
        status: 'confirmed',
        table_no: ''
    })

    const [popUp, setPopUp] = useState(false)

    useEffect(() => {
        let tempSubTotal = 0
        let tempTotalPrice = 0

        cart?.items.forEach((item) => {
            tempSubTotal += item.price * item.quantity
            tempTotalPrice += item.salePrice
        })

        let manualDiscount = 0
        if (discountType === 'percent') {
            manualDiscount = tempTotalPrice * (discountValue / 100)
        } else {
            manualDiscount = discountValue
        }

        // Cap manual discount to ensure total price is not negative
        if (manualDiscount > tempTotalPrice) {
            manualDiscount = tempTotalPrice
        }

        setSubTotal(tempSubTotal)
        setTotalPrice(tempTotalPrice - manualDiscount)
        setTotalDiscount(tempSubTotal - (tempTotalPrice - manualDiscount))
    }, [cart, discountType, discountValue])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalOrderData = {
            ...formData,
            phone: formData.phone.trim(),
            sub_total: subTotal,
            total_discount: totalDiscount,
            total_price: totalPrice,
            items: cart?.items || []
        };

        if (finalOrderData.items.length === 0) {
            return toast.error("Cart is empty");
        }

        try {
            const res = await axios.post('/api/order', finalOrderData, { withCredentials: true });
            toast.success(res.data.message);
            
            // Build formatting for print receipt
            const orderForPrinting = {
                id: res.data.orderId,
                created_at: new Date(),
                name: res.data.customerName || 'guest',
                items: (cart?.items || []).map(item => {
                    let title = item.title;
                    if (item.selectedVariants) {
                        const variantNames = Object.values(item.selectedVariants).map(v => v.value).join(', ');
                        if (variantNames) {
                            title += ` (${variantNames})`;
                        }
                    }
                    return {
                        title,
                        price: item.price,
                        discount: item.discount || 0,
                        quantity: item.quantity
                    };
                }),
                sub_total: subTotal,
                total_discount: totalDiscount,
                total_price: totalPrice,
                delivery_method: formData.delivery_method,
                table_no: formData.table_no || 'N/A',
                payment_method: formData.payment_method,
                payment_status: formData.payment_status || 'paid',
                status: formData.status || 'confirmed'
            };

            // Trigger printing twice: Customer Copy & Kitchen Copy
            generateReceipt({ ...orderForPrinting, receipt_type: 'Customer Copy' }, siteData);
            setTimeout(() => {
                generateReceipt({ ...orderForPrinting, receipt_type: 'Kitchen Copy' }, siteData);
            }, 1000);

            setPopUp(false);
            clearCart();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Failed to place order');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6 bg-tertiary-light rounded-xl border border-tertiary-dark/10'>
            <div className='w-full flex flex-col gap-1.5'>
                <label htmlFor="phone" className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/60 ml-1'>Customer Phone</label>
                <input 
                    type="text" name='phone' id='phone' 
                    onChange={handleChange} value={formData.phone} 
                    className='input-style font-semibold' 
                />
            </div>
            
            <div className='w-full flex flex-col gap-3'>
                <div className='flex items-center justify-between px-2 pb-2 border-b border-tertiary-dark/5'>
                    <p className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/40'>Order Items</p>
                    <button type='button' className='text-[10px] font-semibold text-primary-dark hover:text-primary uppercase tracking-widest transition-colors' onClick={() => clearCart()}>Clear Cart</button>
                </div>

                {cart?.items.length > 0 ? (
                    <div className='w-full flex flex-col gap-4'>
                        <div className='max-h-[350px] overflow-y-auto w-full pr-1 space-y-2'>
                            {cart.items.map((item) => (
                                <div key={item.cartItemId} className='w-full flex items-center gap-3 py-2 border-b border-tertiary-dark/5 last:border-0'>
                                    <div className='w-10 h-10 overflow-hidden rounded-lg bg-tertiary-dark/5 border border-tertiary-dark/10'>
                                        <Image src={item.image} alt={item.title} width={40} height={40} className='w-full h-full object-cover' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-xs font-semibold text-tertiary-dark truncate'>{item.title}</p>
                                        <div className='flex items-center gap-1.5 mt-0.5'>
                                            <p className='text-[10px] font-semibold text-tertiary-dark'>৳{item.salePrice.toLocaleString()}</p>
                                            {item.selectedVariants && Object.values(item.selectedVariants).length > 0 && (
                                                <span className='text-[8px] text-tertiary-dark/60 uppercase font-medium tracking-tighter'>
                                                    • {Object.values(item.selectedVariants).map(v => v.value).join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex items-center bg-tertiary-dark/5 rounded-lg p-1'>
                                        <button className='w-5 h-5 flex items-center justify-center font-semibold text-tertiary-dark/60 hover:text-primary transition-colors' type='button' onClick={() => decreaseQuantity(item.cartItemId)}>-</button>
                                        <span className='text-[10px] font-semibold w-5 text-center text-tertiary-dark'>{item.quantity}</span>
                                        <button className='w-5 h-5 flex items-center justify-center font-semibold text-tertiary-dark/60 hover:text-primary transition-colors' type='button' onClick={() => addToCart(item)}>+</button>
                                    </div>
                                    <button className='p-1.5 text-tertiary-dark/40 hover:text-primary-dark transition-all' type='button' onClick={() => removeFromCart(item.cartItemId)}>
                                        <MdDeleteOutline size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {/* Manual Discount Section */}
                        <div className='w-full p-4 bg-tertiary-dark/5 border border-tertiary-dark/10 rounded-xl flex flex-col gap-3'>
                            <p className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/60'>Manual Discount</p>
                            <div className='flex items-center gap-3'>
                                <div className='flex bg-tertiary-light border border-tertiary-dark/20 rounded-lg p-0.5 shadow-sm'>
                                    <button 
                                        type='button' 
                                        onClick={() => { setDiscountType('flat'); setDiscountValue(0); }}
                                        className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase transition-all cursor-pointer ${discountType === 'flat' ? 'bg-primary text-tertiary-light shadow-xs' : 'text-tertiary-dark/60 hover:text-tertiary-dark'}`}
                                    >
                                        ৳ Flat
                                    </button>
                                    <button 
                                        type='button' 
                                        onClick={() => { setDiscountType('percent'); setDiscountValue(0); }}
                                        className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase transition-all cursor-pointer ${discountType === 'percent' ? 'bg-primary text-tertiary-light shadow-xs' : 'text-tertiary-dark/60 hover:text-tertiary-dark'}`}
                                    >
                                        % Percent
                                    </button>
                                </div>
                                <input 
                                    type="number" 
                                    min="0"
                                    max={discountType === 'percent' ? 100 : undefined}
                                    value={discountValue || ''} 
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        setDiscountValue(val >= 0 ? val : 0);
                                    }}
                                    placeholder={discountType === 'percent' ? 'Discount %' : 'Discount ৳'}
                                    className='input-style flex-1 font-semibold'
                                />
                            </div>
                        </div>

                        <div className='bg-primary text-tertiary-light p-5 rounded-xl w-full flex flex-col gap-3'>
                            <div className='space-y-1.5'>
                                <div className='flex justify-between text-[10px] font-semibold uppercase tracking-widest opacity-80'>
                                    <p>Subtotal</p>
                                    <p>৳{subTotal.toLocaleString()}</p>
                                </div>
                                <div className='flex justify-between text-[10px] font-semibold uppercase tracking-widest text-secondary-light'>
                                    <p>Discounts</p>
                                    <p>-৳{totalDiscount.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className='flex justify-between items-center border-t border-tertiary-light/20 pt-3'>
                                <div>
                                    <p className='text-[10px] font-semibold uppercase tracking-widest opacity-80'>Total Payable</p>
                                    <p className='text-2xl font-semibold tracking-tight'>৳{totalPrice.toLocaleString()}</p>
                                </div>
                                <button 
                                    className='px-5 py-2.5 bg-tertiary-light text-tertiary-dark rounded-lg font-semibold text-[11px] uppercase tracking-wider hover:bg-tertiary text-tertiary-dark transition-all flex items-center gap-1.5' 
                                    type='button' 
                                    onClick={() => setPopUp(true)}
                                >
                                    Review <MdChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='py-20 flex flex-col items-center gap-3 text-tertiary-dark/30'>
                         <MdDeleteOutline size={48} className='opacity-20' />
                         <p className='font-semibold uppercase tracking-widest text-[9px]'>Cart is empty</p>
                    </div>
                )}
            </div>

            {popUp && (
                <div className='flex items-center justify-center fixed inset-0 backdrop-blur-sm bg-tertiary-dark/40 z-[60]'>
                    <div className='w-full max-w-sm mx-4 flex flex-col p-6 gap-6 bg-tertiary-light rounded-xl border border-tertiary-dark/10'>
                        <div className='flex justify-between items-center border-b border-tertiary-dark/10 pb-4'>
                            <div>
                                <h2 className='text-lg font-semibold text-tertiary-dark tracking-tight'>Checkout</h2>
                                <p className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/60'>Order Settlement</p>
                            </div>
                            <p className='text-xl font-semibold text-tertiary-dark tracking-tight'>৳{totalPrice.toLocaleString()}</p>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1.5'>
                                <label htmlFor="payment_method" className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/60 ml-1'>Payment</label>
                                <select name="payment_method" id="payment_method" onChange={handleChange} required value={formData.payment_method} className='input-style font-semibold appearance-none cursor-pointer'>
                                    {paymentOptions.map((p) => (
                                        <option value={p} key={p}>{p.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex flex-col gap-1.5'>
                                <label htmlFor="delivery_method" className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/60 ml-1'>Type</label>
                                <select name="delivery_method" id="delivery_method" onChange={handleChange} required value={formData.delivery_method} className='input-style font-semibold appearance-none cursor-pointer'>
                                    {deliveryOptions.map((d) => (
                                        <option value={d} key={d}>{d.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex flex-col gap-1.5'>
                                <label htmlFor="table_no" className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/60 ml-1'>Table (Optional)</label>
                                <input name="table_no" id="table_no" onChange={handleChange} value={formData.table_no} className='input-style font-semibold'/>
                            </div>
                        </div>

                        <div className='flex flex-row gap-3 mt-2'>
                            <button className='flex-1 py-3 border border-tertiary-dark/10 rounded-xl font-semibold text-[10px] uppercase tracking-widest hover:bg-tertiary-dark/5 transition-all text-tertiary-dark/60' type='button' onClick={() => setPopUp(false)}>Cancel</button>
                            <button className='flex-1 py-3 bg-primary text-tertiary-light rounded-xl font-semibold text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all' type='submit'>Pay Now</button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}

export default Orderform
