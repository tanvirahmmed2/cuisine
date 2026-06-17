'use client'
import React, { useMemo } from 'react'
import { Landmark, ArrowDownRight } from 'lucide-react'

const LastYearExpense = ({ data }) => {
    const date = new Date()
    const currYear = date.getFullYear()

    const currentYearData = useMemo(() => {
        if (!data) return [];
        return data.filter(item => {
            const itemDate = new Date(item.created_at || item.date);
            return itemDate.getFullYear() === currYear;
        });
    }, [data, currYear]);

    const totalAmount = useMemo(() => {
        let total = 0;
        currentYearData.forEach(item => {
            total += Number(item.amount) || 0;
        });
        return total;
    }, [currentYearData]);

    return (
        <div className='w-full bg-white rounded-[2rem] p-8 border border-slate-50 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 h-full flex flex-col justify-between min-h-[220px]'>
            <div>
                <div className='flex items-center justify-between mb-6'>
                    <div className='p-3 bg-slate-50 text-slate-600 rounded-2xl'>
                        <Landmark size={24} />
                    </div>
                    <div className='flex items-center gap-1 text-rose-500 font-bold text-xs bg-rose-50 px-3 py-1 rounded-full'>
                        <ArrowDownRight size={14} />
                        <span>Yearly</span>
                    </div>
                </div>
                
                <h3 className='text-sm font-bold text-slate-400 uppercase tracking-wider mb-1'>Annual Spending</h3>
                <div className='text-3xl font-black text-slate-900 tracking-tight mb-4'>
                    ৳{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
            </div>

            <div className='grid grid-cols-2 gap-4 pt-4 border-t border-slate-50'>
                <div>
                    <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Entries</p>
                    <p className='text-xl font-black text-slate-900'>{currentYearData.length}</p>
                </div>
                <div>
                    <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Year</p>
                    <p className='text-xs font-bold text-slate-600'>{currYear}</p>
                </div>
            </div>
        </div>
    )
}

export default LastYearExpense
