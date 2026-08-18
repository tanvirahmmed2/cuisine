// components/forms/Orderform.jsx
'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../context/Context'
import toast from 'react-hot-toast'
import axios from 'axios'
import Image from 'next/image'
import { MdDeleteOutline, MdChevronRight } from 'react-icons/md'
import { generateReceipt } from '@/lib/database/print'

const paymentOptions = ['cash', 'bkash', 'card', 'nagad', 'rocket']
const deliveryOptions = ['takein', 'takeaway']

const Orderform = () => {
    const { addToCart, removeFromCart, decreaseQuantity, clearCart, cart, siteData } = useContext(Context)

    const [discountType, setDiscountType] = useState('flat')
    const [discountValue, setDiscountValue] = useState(0)
    const [paidAmount, setPaidAmount] = useState('')

    const [formData, setFormData] = useState({
        phone: '01',
        payment_method: 'cash',
        delivery_method: 'takein',
        payment_status: 'paid',
        transaction_id: '',
        status: 'confirmed',
        table_id: '',
        table_no: '',
        note: ''
    })

    const [popUp, setPopUp] = useState(false)
    const [dbTables, setDbTables] = useState([])

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await axios.get('/api/table', { withCredentials: true })
                if (res.data.success) {
                    setDbTables(res.data.payload || [])
                }
            } catch (err) {
                console.error("Failed to fetch tables in POS:", err)
            }
        }
        fetchTables()
    }, [])

    const availableTables = dbTables.filter(t => t.status === 'available' || String(t.id) === String(formData.table_id))

    let subTotal = 0
    let tempTotalPrice = 0

    cart?.items.forEach((item) => {
        subTotal += item.price * item.quantity
        tempTotalPrice += item.salePrice
    })

    let manualDiscount = 0
    if (discountType === 'percent') {
        manualDiscount = tempTotalPrice * (discountValue / 100)
    } else {
        manualDiscount = discountValue
    }

    if (manualDiscount > tempTotalPrice) {
        manualDiscount = tempTotalPrice
    }

    const totalPrice = tempTotalPrice - manualDiscount
    const totalDiscount = subTotal - totalPrice

    const numericPaid = parseFloat(paidAmount) || 0
    const changeAmount = numericPaid > totalPrice ? numericPaid - totalPrice : 0

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const isServiceOffline = siteData && siteData.is_service_available === false;

    const handleOpenReview = () => {
        if (isServiceOffline) {
            return toast.error("Restaurant service is currently unavailable. Orders cannot be placed at this time.");
        }
        if (!cart?.items || cart.items.length === 0) {
            return toast.error("Cart is empty");
        }
        const enteredPaid = paidAmount !== '' ? parseFloat(paidAmount) : totalPrice;
        if (enteredPaid < totalPrice) {
            return toast.error(`Paid amount (৳${enteredPaid}) must be equal to or greater than total payable (৳${totalPrice.toLocaleString()})`);
        }
        setPopUp(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isServiceOffline) {
            return toast.error("Restaurant service is currently unavailable. Orders cannot be placed at this time.");
        }

        const actualPaid = paidAmount !== '' ? parseFloat(paidAmount) : totalPrice;
        if (actualPaid < totalPrice) {
            return toast.error(`Paid amount (৳${actualPaid}) must be equal to or greater than total payable (৳${totalPrice.toLocaleString()})`);
        }

        const actualChange = actualPaid > totalPrice ? actualPaid - totalPrice : 0;
        const cleanedPhone = formData.phone ? formData.phone.replace(/\D/g, '').slice(-11) : '';

        const finalOrderData = {
            ...formData,
            phone: cleanedPhone || formData.phone.trim(),
            sub_total: subTotal,
            total_discount: totalDiscount,
            total_price: totalPrice,
            paid_amount: actualPaid,
            change_amount: actualChange,
            items: cart?.items || []
        };

        if (finalOrderData.items.length === 0) {
            return toast.error("Cart is empty");
        }

        try {
            const res = await axios.post('/api/order', finalOrderData, { withCredentials: true });
            toast.success(res.data.message);

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
                paid_amount: actualPaid,
                change_amount: actualChange,
                delivery_method: formData.delivery_method,
                table_no: formData.table_no || 'N/A',
                payment_method: formData.payment_method,
                payment_status: formData.payment_status || 'paid',
                status: formData.status || 'confirmed'
            };

            generateReceipt({ ...orderForPrinting, receipt_type: 'Customer Copy' }, siteData);
            setTimeout(() => {
                generateReceipt({ ...orderForPrinting, receipt_type: 'Kitchen Copy' }, siteData);
            }, 1000);

            setPopUp(false);
            setPaidAmount('');
            clearCart();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Failed to place order');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6 bg-tertiary-light rounded-xl border border-tertiary-dark/10 p-4'>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full'>

                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="phone" className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/60 ml-1'>Customer Phone</label>
                    <input
                        type="text" name='phone' id='phone'
                        onChange={handleChange} value={formData.phone}
                        className='input-style font-semibold'
                        placeholder="Customer phone"
                    />
                </div>

                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="delivery_method" className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/60 ml-1'>Delivery Type</label>
                    <select
                        name="delivery_method"
                        id="delivery_method"
                        onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                                ...prev,
                                delivery_method: val,
                                table_id: val === 'takein' ? prev.table_id : '',
                                table_no: val === 'takein' ? prev.table_no : ''
                            }));
                        }}
                        value={formData.delivery_method}
                        className='input-style font-semibold appearance-none cursor-pointer bg-tertiary-light'
                    >
                        {deliveryOptions.map((d) => (
                            <option value={d} key={d}>{d.toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                {formData.delivery_method === 'takein' && (
                    <div className='w-full flex flex-col gap-1.5 sm:col-span-2'>
                        <label htmlFor="table_id" className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/60 ml-1'>Select Table</label>
                        <select
                            name="table_id"
                            id="table_id"
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const foundTable = dbTables.find(t => String(t.id) === String(selectedId));
                                setFormData((prev) => ({
                                    ...prev,
                                    table_id: selectedId,
                                    table_no: foundTable ? foundTable.table_no : ''
                                }));
                            }}
                            value={formData.table_id}
                            className='input-style font-semibold appearance-none cursor-pointer bg-tertiary-light'
                        >
                            <option value="">Select Table...</option>
                            {availableTables.map((t) => (
                                <option value={t.id} key={t.id}>
                                    Table {t.table_no} ({t.capacity} Seats - {t.location || 'Main'})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className='w-full flex flex-col gap-1.5 sm:col-span-2'>
                    <label htmlFor="note" className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/60 ml-1'>Order Note / Instructions</label>
                    <input
                        type="text" name='note' id='note'
                        onChange={handleChange} value={formData.note || ''}
                        className='input-style font-semibold'
                        placeholder="e.g. Extra spicy, no onion, less oil"
                    />
                </div>
            </div>

            {/* Order Items Section */}
            <div className='w-full flex flex-col gap-3'>
                <div className='flex items-center justify-between px-2 pb-2 border-b border-tertiary-dark/5'>
                    <p className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/40'>Order Items</p>
                    <button type='button' className='text-[10px] font-semibold text-primary-dark hover:text-primary uppercase tracking-widest transition-colors cursor-pointer' onClick={() => clearCart()}>Clear Cart</button>
                </div>

                {cart?.items.length > 0 ? (
                    <div className='w-full flex flex-col gap-3'>
                        {/* Column Headers for Single Line Layout */}
                        <div className='w-full hidden sm:flex items-center text-[9px] font-semibold uppercase tracking-wider text-tertiary-dark/50 px-2 pb-1 border-b border-tertiary-dark/5 gap-2'>
                            <div className='w-8 shrink-0'>Img</div>
                            <div className='flex-1 min-w-0'>Title</div>
                            <div className='w-20 shrink-0'>Variant</div>
                            <div className='w-14 shrink-0 text-right'>Price</div>
                            <div className='w-12 shrink-0 text-right'>Disc</div>
                            <div className='w-20 shrink-0 text-center'>Qty</div>
                            <div className='w-16 shrink-0 text-right'>Total</div>
                            <div className='w-6 shrink-0 text-center'></div>
                        </div>

                        <div className='max-h-87.5 overflow-y-auto w-full pr-1 space-y-1.5'>
                            {cart.items.map((item) => {
                                const variantText = item.selectedVariants && Object.values(item.selectedVariants).length > 0
                                    ? Object.values(item.selectedVariants).map(v => v.value).join(', ')
                                    : '-';
                                const discountText = item.discount ? `৳${item.discount}` : '৳0';

                                return (
                                    <div key={item.cartItemId} className='w-full flex items-center justify-between gap-2 py-2 px-2 border-b border-tertiary-dark/5 last:border-0 hover:bg-tertiary-dark/5 rounded-lg transition-colors'>
                                        {/* 1. Image */}
                                        <div className='w-8 h-8 overflow-hidden rounded-md bg-tertiary-dark/5 border border-tertiary-dark/10 shrink-0'>
                                            <Image src={item.image} alt={item.title} width={32} height={32} className='w-full h-full object-cover' />
                                        </div>

                                        <div className='flex-1 min-w-0'>
                                            <p className='text-xs font-semibold text-tertiary-dark truncate' title={item.title}>{item.title}</p>
                                        </div>

                                        <div className='w-20 shrink-0 min-w-0'>
                                            <p className='text-[10px] text-tertiary-dark/60 font-medium truncate' title={variantText}>{variantText}</p>
                                        </div>

                                        <div className='w-14 shrink-0 text-right font-medium text-tertiary-dark/80 text-[11px]'>
                                            ৳{item.price.toLocaleString()}
                                        </div>

                                        <div className='w-12 shrink-0 text-right font-medium text-secondary-dark text-[10px]'>
                                            {discountText}
                                        </div>

                                        {/* 6. Quantity */}
                                        <div className='w-20 shrink-0 flex items-center justify-center bg-tertiary-dark/5 rounded-lg p-0.5'>
                                            <button className='w-4 h-4 flex items-center justify-center font-semibold text-tertiary-dark/60 hover:text-primary transition-colors cursor-pointer text-xs' type='button' onClick={() => decreaseQuantity(item.cartItemId)}>-</button>
                                            <span className='text-[10px] font-semibold w-5 text-center text-tertiary-dark'>{item.quantity}</span>
                                            <button className='w-4 h-4 flex items-center justify-center font-semibold text-tertiary-dark/60 hover:text-primary transition-colors cursor-pointer text-xs' type='button' onClick={() => addToCart(item)}>+</button>
                                        </div>

                                        {/* 7. Total Price */}
                                        <div className='w-16 shrink-0 text-right font-semibold text-tertiary-dark text-xs'>
                                            ৳{item.salePrice.toLocaleString()}
                                        </div>

                                        {/* 8. Delete */}
                                        <button className='w-6 shrink-0 flex items-center justify-center text-tertiary-dark/40 hover:text-primary-dark transition-all cursor-pointer' type='button' title='Delete item' onClick={() => removeFromCart(item.cartItemId)}>
                                            <MdDeleteOutline size={16} />
                                        </button>
                                    </div>
                                )
                            })}
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

                        <div className='bg-primary text-tertiary-light p-5 rounded-xl w-full flex flex-col gap-2 shadow-sm'>
                            
                            <div className='flex justify-between items-center text-xs font-semibold uppercase tracking-widest opacity-90'>
                                <p>Subtotal</p>
                                <p>৳{subTotal.toLocaleString()}</p>
                            </div>

                            <div className='flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-tertiary-light'>
                                <p>Discounts</p>
                                <p>-৳{totalDiscount.toLocaleString()}</p>
                            </div>

                            <div className='flex justify-between items-center border-t border-tertiary-light/20 pt-3 text-sm font-semibold uppercase tracking-wider'>
                                <p>Total Payable</p>
                                <p className='text-2xl font-black text-tertiary-light tracking-tight'>৳{totalPrice.toLocaleString()}</p>
                            </div>

                            <div className='flex justify-between items-center text-xs font-semibold'>
                                <label htmlFor="payment_method" className='uppercase tracking-widest text-tertiary-light/90 shrink-0'>Payment Method</label>
                                <select
                                    name="payment_method"
                                    id="payment_method"
                                    onChange={handleChange}
                                    value={formData.payment_method}
                                    className='px-3 py-1 rounded-lg text-xs font-semibold bg-tertiary-light text-tertiary-dark appearance-none cursor-pointer border-0 outline-none w-36 text-right'
                                >
                                    {paymentOptions.map((p) => (
                                        <option value={p} key={p}>{p.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex justify-between items-center text-xs font-semibold'>
                                <label htmlFor="paid_amount" className='uppercase tracking-widest text-tertiary-light/90 shrink-0'>Paid Amount (৳)</label>
                                <input
                                    type="number"
                                    name='paid_amount'
                                    id='paid_amount'
                                    min="0"
                                    step="any"
                                    value={paidAmount}
                                    onChange={(e) => setPaidAmount(e.target.value)}
                                    className='px-3 py-1.5 rounded-lg text-xs font-semibold bg-tertiary-light text-tertiary-dark border-0 outline-none placeholder:text-gray-400 w-36 text-right'

                                />
                            </div>

                            <div className='flex justify-between items-center text-xs font-semibold'>
                                <span className='uppercase tracking-widest text-tertiary-light/90'>Change Return (৳)</span>
                                <div className='px-3 py-1.5 rounded-lg text-xs font-extrabold bg-tertiary-light/15 text-tertiary-light border border-tertiary-light/20 min-w-36 text-right'>
                                    ৳{changeAmount.toLocaleString()}
                                </div>
                            </div>

                            <div className='pt-2 border-t border-tertiary-light/20'>
                                <button
                                    className='w-full py-3 bg-tertiary-light text-tertiary-dark rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-tertiary-light transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2'
                                    type='button'
                                    onClick={handleOpenReview}
                                >
                                    Confirm & Pay Order <MdChevronRight size={18} />
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

            {/* Simple Confirmation Modal */}
            {popUp && (
                <div className='flex items-center justify-center fixed inset-0 backdrop-blur-sm bg-tertiary-dark/40 z-[60]'>
                    <div className='w-full max-w-sm mx-4 flex flex-col p-6 gap-6 bg-tertiary-light rounded-2xl border border-tertiary-dark/10 shadow-2xl'>
                        <div className='flex justify-between items-center border-b border-tertiary-dark/10 pb-4'>
                            <div>
                                <h2 className='text-lg font-semibold text-tertiary-dark tracking-tight'>Confirm Order</h2>
                                <p className='text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/60'>Please confirm order settlement</p>
                            </div>
                            <p className='text-xl font-black text-tertiary-dark tracking-tight'>৳{totalPrice.toLocaleString()}</p>
                        </div>

                        <div className='flex flex-col gap-2.5 bg-tertiary-dark/5 p-4 rounded-xl text-xs'>
                            <div className='flex justify-between items-center text-tertiary-dark/70'>
                                <span className='font-medium'>Payment Method:</span>
                                <span className='font-semibold text-tertiary-dark uppercase'>{formData.payment_method}</span>
                            </div>
                            <div className='flex justify-between items-center text-tertiary-dark/70'>
                                <span className='font-medium'>Order Type:</span>
                                <span className='font-semibold text-tertiary-dark uppercase'>{formData.delivery_method}</span>
                            </div>
                            <div className='flex justify-between items-center text-tertiary-dark/70'>
                                <span className='font-medium'>Table:</span>
                                <span className='font-semibold text-tertiary-dark'>{formData.table_no || 'N/A'}</span>
                            </div>
                            <div className='flex justify-between items-center text-tertiary-dark/70 border-t border-tertiary-dark/10 pt-2'>
                                <span className='font-medium'>Paid Amount:</span>
                                <span className='font-semibold text-tertiary-dark'>৳{(numericPaid > 0 ? numericPaid : totalPrice).toLocaleString()}</span>
                            </div>
                            <div className='flex justify-between items-center text-emerald-700 font-semibold'>
                                <span>Change Return:</span>
                                <span>৳{changeAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className='flex flex-row gap-3 mt-2'>
                            <button
                                className='flex-1 py-3 border border-tertiary-dark/15 rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-tertiary-dark/5 transition-all text-tertiary-dark/70 cursor-pointer'
                                type='button'
                                onClick={() => setPopUp(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className='flex-1 py-3 bg-primary text-tertiary-light rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-primary-dark transition-all cursor-pointer shadow-sm'
                                type='submit'
                            >
                                Confirm Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}

export default Orderform
