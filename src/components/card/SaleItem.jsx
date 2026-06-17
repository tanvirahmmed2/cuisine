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
                className='w-full flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-pink-500 transition-all cursor-pointer group relative'
            >
                <div className='relative w-full aspect-[4/3] overflow-hidden bg-gray-50'>
                    <Image
                        src={item.image}
                        alt={item.title}
                        width={200}
                        height={150}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                    {item.discount > 0 && (
                        <div className='absolute top-2 left-2 bg-pink-500 text-white text-[8px] font-semibold uppercase px-2 py-0.5 rounded'>
                            -৳{item.discount}
                        </div>
                    )}
                </div>
                <div className='p-2.5 flex flex-col gap-0.5'>
                    <p className='text-[8px] font-semibold text-gray-400 uppercase tracking-widest'>{item.category_name}</p>
                    <h4 className='text-[11px] font-semibold text-gray-800 line-clamp-1 group-hover:text-pink-600 transition-colors'>{item.title}</h4>
                    <div className='flex items-center justify-between mt-1'>
                        <div className='flex items-baseline gap-1.5'>
                            <p className='text-xs font-semibold text-gray-900'>৳{displayCurrentPrice.toFixed(2)}</p>
                            {item.discount > 0 && (
                                <p className='line-through text-[9px] text-gray-300 font-medium'>৳{baseWithDefaultVariant.toFixed(2)}</p>
                            )}
                        </div>
                        {item.variants && item.variants.length > 0 && (
                            <div className='w-1.5 h-1.5 rounded-full bg-emerald-400' title="Has Variants" />
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
                            className="absolute inset-0 bg-pink-500/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div>
                                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mt-0.5">Customize Item</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <MdClose size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {Object.entries(groupedVariants).map(([groupName, variants]) => (
                                    <div key={groupName} className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{groupName}</h4>
                                            <div className="h-px flex-1 bg-gray-100" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {variants.map(v => (
                                                <button
                                                    key={v.id}
                                                    onClick={(e) => handleVariantSelect(groupName, v, e)}
                                                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all text-left flex flex-col gap-0.5 ${selectedVariants[groupName]?.id === v.id
                                                            ? 'border-pink-500 bg-pink-500 text-white shadow-md'
                                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span className="truncate">{v.value}</span>
                                                    {v.price_adjustment > 0 && (
                                                        <span className={`text-[9px] ${selectedVariants[groupName]?.id === v.id ? 'text-white/70' : 'text-pink-500'
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

                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-xl font-bold text-gray-900">৳{modalCurrentPrice.toFixed(2)}</span>
                                        {hasDiscount && (
                                            <span className="text-[10px] font-medium text-gray-400 line-through">৳{baseWithModalVariant.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleModalAddToCart}
                                    className="px-6 py-2.5 bg-pink-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-pink-600 transition-colors shadow-lg shadow-pink-900/10 active:scale-95"
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
