'use client'
import React, { useMemo } from 'react'
import { Wallet, PieChart } from 'lucide-react'

const TotalExpense = ({ data }) => {
    const totalAmount = useMemo(() => {
        let total = 0
        data.forEach(item => {
            total += Number(item.amount) || 0
        });
        return total
    }, [data])

    return (
        <div className='w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden h-full flex flex-col justify-between min-h-[220px]'>
            <div className='absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl'></div>
            <div className='absolute -left-6 -bottom-6 w-24 h-24 bg-slate-700/20 rounded-full blur-xl'></div>
            
            <div className='relative z-10'>
                <div className='flex items-center justify-between mb-6'>
                    <div className='p-3 bg-white/10 backdrop-blur-md rounded-2xl'>
                        <Wallet size={24} />
                    </div>
                    <span className='text-xs font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full'>Lifetime</span>
                </div>
                
                <h1 className='text-sm font-bold text-slate-400 uppercase tracking-wider mb-1'>Total Overhead</h1>
                <div className='text-4xl font-black tracking-tight mb-4 text-rose-400'>
                    ৳{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
            </div>

            <div className='relative z-10 grid grid-cols-2 gap-4 pt-4 border-t border-white/5'>
                <div>
                    <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Entries</p>
                    <p className='text-xl font-black'>{data.length}</p>
                </div>
                <div>
                    <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Analytics</p>
                    <div className='flex items-center gap-1 text-rose-400'>
                        <PieChart size={14} />
                        <span className='text-[10px] font-bold uppercase'>Expense</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TotalExpense
