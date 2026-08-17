'use client'
import React, { useContext, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Context } from '../context/Context'
import { MdClose } from 'react-icons/md'

const SaleItem = ({ item }) => {
    const { addToCart } = useContext(Context)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [selectedVariants, setSelectedVariants] = useState(() => {
        const defaults = {}
        if (item.variants) {
            item.variants.forEach(v => {
                if (!defaults[v.name] || v.is_default) {
                    defaults[v.name] = v
                }
            })
        }
        return defaults
    })

    const hasDiscount = item.discount !== 0 && item.discount !== null;

    const defaultVariantAdjustment = useMemo(() => {
        let adj = 0;
        const defaults = {};
        if (item.variants) {
            item.variants.forEach(v => {
                if (!defaults[v.name] || v.is_default) {
                    defaults[v.name] = v;
                }
            });
            Object.values(defaults).forEach(v => {
                adj += Number(v.price_adjustment || 0);
            });
        }
        return adj;
    }, [item.variants]);

    const baseWithDefaultVariant = Number(item.price) + defaultVariantAdjustment;
    const displayCurrentPrice = hasDiscount ? baseWithDefaultVariant - Number(item.discount) : baseWithDefaultVariant;

    const modalVariantAdjustment = useMemo(() => {
        let adj = 0;
        Object.values(selectedVariants).forEach(v => {
            adj += Number(v.price_adjustment || 0);
        });
        return adj;
    }, [selectedVariants]);

    const baseWithModalVariant = Number(item.price) + modalVariantAdjustment;
    const modalCurrentPrice = hasDiscount ? baseWithModalVariant - Number(item.discount) : baseWithModalVariant;

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

    const handleCardClick = () => {
        if (item.variants && item.variants.length > 0) {
            setIsModalOpen(true);
        } else {
            addToCart({ ...item, price: baseWithDefaultVariant, selectedVariants: {} });
        }
    }

    const handleModalAddToCart = (e) => {
        e.stopPropagation();
        addToCart({ ...item, price: baseWithModalVariant, selectedVariants });
        setIsModalOpen(false);
    }

    const handleVariantSelect = (groupName, variant, e) => {
        e.stopPropagation();
        setSelectedVariants(prev => ({
            ...prev,
            [groupName]: variant
        }));
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleCardClick}
                className='w-full flex flex-col bg-tertiary-light rounded-xl overflow-hidden border border-tertiary-dark/10 hover:border-primary transition-all cursor-pointer group relative'
            >
                <div className='relative w-full aspect-[4/3] overflow-hidden bg-tertiary-dark/5'>
                    <Image
                        src={item.image}
                        alt={item.title}
                        width={200}
                        height={150}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                    {item.discount > 0 && (
                        <div className='absolute top-2 left-2 bg-primary text-tertiary-light text-[8px] font-semibold uppercase px-2 py-0.5 rounded'>
                            -৳{item.discount}
                        </div>
                    )}
                </div>
                <div className='p-2.5 flex flex-col gap-0.5'>
                    <p className='text-[8px] font-semibold text-tertiary-dark/60 uppercase tracking-widest'>{item.category_name}</p>
                    <h4 className='text-[11px] font-semibold text-tertiary-dark line-clamp-1 group-hover:text-primary transition-colors'>{item.title}</h4>
                    <div className='flex items-center justify-between mt-1'>
                        <div className='flex items-baseline gap-1.5'>
                            <p className='text-xs font-semibold text-tertiary-dark'>৳{displayCurrentPrice.toFixed(2)}</p>
                            {item.discount > 0 && (
                                <p className='line-through text-[9px] text-tertiary-dark/40 font-medium'>৳{baseWithDefaultVariant.toFixed(2)}</p>
                            )}
                        </div>
                        {item.variants && item.variants.length > 0 && (
                            <div className='w-1.5 h-1.5 rounded-full bg-secondary' title="Has Variants" />
                        )}
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                            className="absolute inset-0 bg-tertiary-dark/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-sm bg-tertiary-light rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-tertiary-dark/10">
                                <div>
                                    <h3 className="font-bold text-tertiary-dark">{item.title}</h3>
                                    <p className="text-[10px] uppercase tracking-wider text-tertiary-dark/60 font-semibold mt-0.5">Customize Item</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                                    className="p-2 text-tertiary-dark/60 hover:text-tertiary-dark hover:bg-tertiary-dark/5 rounded-lg transition-colors"
                                >
                                    <MdClose size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {Object.entries(groupedVariants).map(([groupName, variants]) => (
                                    <div key={groupName} className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-[10px] font-bold text-tertiary-dark/60 uppercase tracking-widest">{groupName}</h4>
                                            <div className="h-px flex-1 bg-tertiary-dark/10" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {variants.map(v => (
                                                <button
                                                    key={v.id}
                                                    onClick={(e) => handleVariantSelect(groupName, v, e)}
                                                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-left flex flex-col gap-0.5 ${selectedVariants[groupName]?.id === v.id
                                                            ? 'border-primary bg-primary text-tertiary-light shadow-md'
                                                            : 'border-tertiary-dark/10 bg-tertiary-light text-tertiary-dark hover:border-tertiary-dark/20 hover:bg-tertiary-dark/5'
                                                        }`}
                                                >
                                                    <span className="truncate">{v.value}</span>
                                                    {v.price_adjustment > 0 && (
                                                        <span className={`text-[9px] ${selectedVariants[groupName]?.id === v.id ? 'text-tertiary-light/80' : 'text-primary'
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

                            <div className="p-4 border-t border-tertiary-dark/10 bg-tertiary-dark/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary-dark/60">Total</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-xl font-bold text-tertiary-dark">৳{modalCurrentPrice.toFixed(2)}</span>
                                        {hasDiscount && (
                                            <span className="text-[10px] font-medium text-tertiary-dark/40 line-through">৳{baseWithModalVariant.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleModalAddToCart}
                                    className="px-6 py-2.5 bg-primary text-tertiary-light text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/10 active:scale-95"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

export default SaleItem
