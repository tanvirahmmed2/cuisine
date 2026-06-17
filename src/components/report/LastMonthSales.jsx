'use client'
import React, { useMemo } from 'react'
import { Calendar, ArrowUpRight } from 'lucide-react'

const LastMonthSales = ({ data }) => {
  const date = new Date()
  const currYear = date.getFullYear()
  const currMonth = date.getMonth()

  const currentMonthData = useMemo(() => {
    if (!data) return [];
    return data.filter(item => {
      const itemDate = new Date(item.created_at); 
      return itemDate.getMonth() === currMonth && itemDate.getFullYear() === currYear;
    });
  }, [data, currMonth, currYear]);

  const totalPrice = useMemo(() => {
    let total = 0;
    currentMonthData.forEach(item => {
      total += Number(item.total_price) || 0;
    });
    return total;
  }, [currentMonthData]);

  const monthName = new Date(currYear, currMonth).toLocaleString('default', { month: 'long' });

  return (
    <div className='w-full bg-white rounded-[2rem] p-8 border border-pink-50 shadow-xl shadow-pink-900/5 hover:shadow-2xl hover:shadow-pink-900/10 transition-all duration-500 h-full flex flex-col justify-between min-h-[220px]'>
      <div>
        <div className='flex items-center justify-between mb-6'>
          <div className='p-3 bg-pink-50 text-pink-600 rounded-2xl'>
            <Calendar size={24} />
          </div>
          <div className='flex items-center gap-1 text-emerald-500 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full'>
            <ArrowUpRight size={14} />
            <span>Active</span>
          </div>
        </div>
        
        <h3 className='text-sm font-bold text-slate-400 uppercase tracking-wider mb-1'>{monthName} Sales</h3>
        <div className='text-3xl font-black text-slate-900 tracking-tight mb-4'>
          ৳{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 pt-4 border-t border-slate-50'>
        <div>
          <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Orders</p>
          <p className='text-xl font-black text-slate-900'>{currentMonthData.length}</p>
        </div>
        <div>
          <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Period</p>
          <p className='text-xs font-bold text-pink-600'>{currMonth + 1}/{currYear}</p>
        </div>
      </div>
    </div>
  )
}

export default LastMonthSales