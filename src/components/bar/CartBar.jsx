'use client'
import React, { useContext, useState, useMemo } from 'react'
import { Context } from '../context/Context'
import Link from 'next/link'
import Image from 'next/image'
import { MdDeleteOutline, MdClose, MdEdit } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

const VariantEditor = ({ item, onClose }) => {
    const { updateCartItemVariant } = useContext(Context)
    
    const [selectedVariants, setSelectedVariants] = useState(() => {
        return item.selectedVariants || {}
    })

    const hasDiscount = item.discount !== 0 && item.discount !== null;

    const groupedVariants = useMemo(() => {
        const groups = {}
        if (item.variants) {
            item.variants.forEach(v => {
                if (!groups[v.name]) groups[v.name] = []
                groups[v.name].push(v)
            })
        }
        return groups
    }, [item.variants])

    const currentAdjustment = useMemo(() => {
        let adj = 0;
        if (item.selectedVariants) {
            Object.values(item.selectedVariants).forEach(v => {
                adj += Number(v.price_adjustment || 0);
            });
        }
        return adj;
    }, [item.selectedVariants]);

    const originalBasePrice = Number(item.price) - currentAdjustment;

    const modalVariantAdjustment = useMemo(() => {
        let adj = 0;
        Object.values(selectedVariants).forEach(v => {
            adj += Number(v.price_adjustment || 0);
        });
        return adj;
    }, [selectedVariants]);

    const newCalculatedPrice = originalBasePrice + modalVariantAdjustment;
    const displayCurrentPrice = hasDiscount ? newCalculatedPrice - Number(item.discount) : newCalculatedPrice;

    const handleVariantSelect = (groupName, variant) => {
        setSelectedVariants(prev => ({
            ...prev,
            [groupName]: variant
        }));
    }

    const handleSave = () => {
        updateCartItemVariant(item.cartItemId, selectedVariants, newCalculatedPrice)
        onClose()
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 z-10 bg-tertiary-light flex flex-col min-h-screen shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl sm:rounded-none"
        >
            <div className="p-2 border-b border-primary/10 flex items-center justify-between bg-linear-to-r from-primary/10 to-transparent">
                <div>
                    <h3 className="font-semibold text-tertiary-dark text-xl tracking-tight">Edit Variant</h3>
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold mt-1">{item.title}</p>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 text-tertiary-dark/40 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                >
                    <MdClose size={22} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-tertiary-dark/5">
                {Object.entries(groupedVariants).map(([groupName, variants]) => (
                    <div key={groupName} className="space-y-2 bg-tertiary-light p-1 rounded-2xl border border-primary/10 shadow-sm">
                        <div className="flex items-center gap-2">
                            <h4 className="text-[10px] font-semibold text-primary uppercase tracking-widest">{groupName}</h4>
                            <div className="h-px flex-1 bg-primary/10" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {variants.map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => handleVariantSelect(groupName, v)}
                                    className={`px-3 py-2.5 text-xs font-bold rounded-xl border transition-all text-left flex flex-col gap-1 ${
                                        selectedVariants[groupName]?.id === v.id
                                            ? 'border-primary bg-primary text-tertiary-light shadow-md shadow-primary/20'
                                            : 'border-tertiary-dark/10 bg-tertiary-light text-tertiary-dark hover:border-primary/30 hover:bg-primary/5'
                                    }`}
                                >
                                    <span className="truncate">{v.value}</span>
                                    {v.price_adjustment > 0 && (
                                        <span className={`text-[9px] ${
                                            selectedVariants[groupName]?.id === v.id ? 'text-tertiary-light/80' : 'text-primary'
                                        }`}>
                                            +৳{v.price_adjustment}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 border-t border-primary/10 bg-tertiary-light flex flex-col gap-4 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
                <div className="flex items-end justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-tertiary-dark/60">Updated Price</span>
                    <div className="flex items-baseline gap-2">
                        {hasDiscount && (
                            <span className="text-[11px] font-bold text-tertiary-dark/40 line-through">৳{newCalculatedPrice.toFixed(2)}</span>
                        )}
                        <span className="text-2xl font-semibold text-tertiary-dark tracking-tighter">৳{displayCurrentPrice.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3.5 bg-primary/10 text-primary rounded-2xl font-semibold text-xs uppercase tracking-[0.2em] hover:bg-primary/20 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="flex-2 py-3.5 bg-primary text-tertiary-light rounded-2xl font-semibold text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-[0.98]"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

const CartBar = () => {
    const { subTotal, totalPrice, totalDiscount, cartBar, setCartBar, addToCart, removeFromCart, decreaseQuantity, clearCart, cart } = useContext(Context)
    const [editingItem, setEditingItem] = useState(null)

    return (
        <AnimatePresence>
            {cartBar && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            setCartBar(false);
                            setEditingItem(null);
                        }}
                        className="fixed inset-0 bg-tertiary-dark/20 backdrop-blur-sm z-[60]"
                    />

                    {/* Cart Sidebar */}
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-tertiary-light z-[70] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 flex items-center justify-between border-b border-tertiary-dark/10 bg-gradient-to-b from-primary/10 to-transparent">
                            <div>
                                <h2 className="text-2xl font-semibold text-tertiary-dark tracking-tighter">My Cart</h2>
                                <p className="text-[10px] text-primary uppercase font-semibold tracking-[0.2em] mt-1">
                                    {cart?.items?.length || 0} Items Reserved
                                </p>
                            </div>
                            <button 
                                onClick={() => {
                                    setCartBar(false);
                                    setEditingItem(null);
                                }}
                                className="p-3 bg-tertiary-light hover:bg-primary/10 rounded-2xl transition-all cursor-pointer border border-tertiary-dark/10 text-tertiary-dark/40 hover:text-primary shadow-sm"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
                            {cart?.items?.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                                    <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary/60">
                                        <MdDeleteOutline size={48} />
                                    </div>
                                    <div className='space-y-2'>
                                        <p className="text-tertiary-dark font-semibold text-lg">Your cart is empty</p>
                                        <p className="text-tertiary-dark/60 text-sm font-medium">Add some treats to your basket!</p>
                                    </div>
                                    <Link 
                                        href="/menu" 
                                        onClick={() => setCartBar(false)}
                                        className="px-10 py-4 bg-primary text-tertiary-light rounded-2xl font-semibold text-sm uppercase tracking-[0.2em] hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
                                    >
                                        Browse Menu
                                    </Link>
                                </div>
                            ) : (
                                cart.items.map((item) => (
                                    <div key={item.cartItemId} className="flex gap-4 p-2 items-center justify-between bg-tertiary-light rounded-3xl border border-tertiary-dark/10 shadow-sm group hover:border-primary/30 transition-all duration-300">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm shrink-0 bg-tertiary-dark/5 relative">
                                            <Image 
                                                src={item.image} 
                                                alt={item.title} 
                                                width={100} 
                                                height={100} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                            {item.discount > 0 && (
                                                <div className="absolute top-1 left-1 bg-primary text-tertiary-light text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                                                    Sale
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-tertiary-dark text-sm leading-tight tracking-tight">{item.title}</h3>
                                                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                                            {Object.values(item.selectedVariants).map(v => (
                                                                <span key={v.id} className='text-[9px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20'>
                                                                    {v.value}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="font-semibold text-tertiary-dark text-base tracking-tighter">৳{item.salePrice || item.price}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-3 bg-tertiary-dark/5 rounded-xl px-3 py-1.5 border border-tertiary-dark/10">
                                                    <button 
                                                        onClick={() => decreaseQuantity(item.cartItemId)}
                                                        className="text-tertiary-dark/60 hover:text-primary font-semibold text-lg cursor-pointer transition-colors"
                                                    >-</button>
                                                    <span className="text-sm font-semibold w-6 text-center text-tertiary-dark">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => addToCart(item)}
                                                        className="text-tertiary-dark/60 hover:text-primary font-semibold text-lg cursor-pointer transition-colors"
                                                    >+</button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {item.variants && item.variants.length > 0 && (
                                                        <button 
                                                            onClick={() => setEditingItem(item)}
                                                            className="p-2 text-tertiary-dark/60 hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer border border-transparent shadow-sm"
                                                            title="Edit Variant"
                                                        >
                                                            <MdEdit size={18} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => removeFromCart(item.cartItemId)}
                                                        className="p-2 text-tertiary-dark/40 hover:text-primary-dark hover:bg-primary/10 rounded-xl transition-all cursor-pointer border border-transparent"
                                                        title="Remove Item"
                                                    >
                                                        <MdDeleteOutline size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                            <AnimatePresence>
                                {editingItem && (
                                    <VariantEditor 
                                        item={editingItem} 
                                        onClose={() => setEditingItem(null)} 
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {cart?.items?.length > 0 && (
                            <div className="p-4 bg-tertiary-light border-t border-tertiary-dark/10 space-y-4 shadow-[0_-20px_60px_rgba(0,0,0,0.08)] relative z-20">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-tertiary-dark/60">
                                        <span>Subtotal</span>
                                        <span>৳{subTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-secondary">
                                        <span>Discount</span>
                                        <span>-৳{totalDiscount}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-semibold text-tertiary-dark pt-4 border-t border-tertiary-dark/10">
                                        <span>Total</span>
                                        <span className='tracking-tighter text-primary'>৳{totalPrice}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Link 
                                        href="/checkout" 
                                        onClick={() => setCartBar(false)}
                                        className="w-full py-4 bg-primary text-tertiary-light text-center rounded-2xl font-semibold text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/25 hover:bg-primary-dark transition-all active:scale-[0.98]"
                                    >
                                        Checkout Now
                                    </Link>
                                    <button 
                                        onClick={() => clearCart()}
                                        className="text-[10px] font-semibold text-tertiary-dark/40 hover:text-primary-dark uppercase tracking-[0.2em] transition-colors cursor-pointer text-center"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default CartBar
