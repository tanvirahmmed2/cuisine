'use client'
import React, { useMemo } from 'react'
import { DollarSign, Package } from 'lucide-react'

const TotalSales = ({data}) => {
    const totalPrice = useMemo(() => {
        let total = 0
        data.forEach(item => {
            total += Number(item.total_price) || 0
        });
        return total
    }, [data])

    const totalItems = useMemo(() => {
        let items = 0
        data.forEach(item => {
            items += (item.items && item.items.length) || 0
        })
        return items
    }, [data])

    return (
        <div className='w-full bg-gradient-to-br from-pink-500 to-rose-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-pink-200 relative overflow-hidden h-full flex flex-col justify-between min-h-[220px]'>
            <div className='absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl'></div>
            <div className='absolute -left-6 -bottom-6 w-24 h-24 bg-rose-400/20 rounded-full blur-xl'></div>
            
            <div className='relative z-10'>
                <div className='flex items-center justify-between mb-6'>
                    <div className='p-3 bg-white/20 backdrop-blur-md rounded-2xl'>
                        <DollarSign size={24} />
                    </div>
                    <span className='text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full'>Lifetime</span>
                </div>
                
                <h1 className='text-sm font-bold text-pink-100 uppercase tracking-wider mb-1'>Total Revenue</h1>
                <div className='text-4xl font-black tracking-tight mb-4'>
                    ৳{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
            </div>

            <div className='relative z-10 grid grid-cols-2 gap-4 pt-4 border-t border-white/10'>
                <div>
                    <p className='text-[10px] font-bold text-pink-100 uppercase tracking-widest'>Orders</p>
                    <p className='text-xl font-black'>{data.length}</p>
                </div>
                <div>
                    <p className='text-[10px] font-bold text-pink-100 uppercase tracking-widest'>Items Sold</p>
                    <p className='text-xl font-black'>{totalItems}</p>
                </div>
            </div>
        </div>
    )
}

export default TotalSales
