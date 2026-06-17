'use client'
import React, { useMemo } from 'react'
import { BarChart3, History } from 'lucide-react'

const LastYearSales = ({ data }) => {
  const date = new Date()
  const currYear = date.getFullYear()

  const currentYearData = useMemo(() => {
    if (!data) return [];
    return data.filter(item => {
      const itemDate = new Date(item.created_at); 
      return itemDate.getFullYear() === currYear;
    });
  }, [data, currYear]);

  const totalPrice = useMemo(() => {
    let total = 0;
    currentYearData.forEach(item => {
      total += Number(item.total_price) || 0;
    });
    return total;
  }, [currentYearData]);

  return (
    <div className='w-full bg-white rounded-[2rem] p-8 border border-pink-50 shadow-xl shadow-pink-900/5 hover:shadow-2xl hover:shadow-pink-900/10 transition-all duration-500 h-full flex flex-col justify-between min-h-[220px]'>
      <div>
        <div className='flex items-center justify-between mb-6'>
          <div className='p-3 bg-pink-50 text-pink-600 rounded-2xl'>
            <BarChart3 size={24} />
          </div>
          <div className='flex items-center gap-1 text-pink-500 font-bold text-xs bg-pink-50 px-3 py-1 rounded-full'>
            <History size={14} />
            <span>Annual</span>
          </div>
        </div>
        
        <h3 className='text-sm font-bold text-slate-400 uppercase tracking-wider mb-1'>Yearly Revenue</h3>
        <div className='text-3xl font-black text-slate-900 tracking-tight mb-4'>
          ৳{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 pt-4 border-t border-slate-50'>
        <div>
          <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Orders</p>
          <p className='text-xl font-black text-slate-900'>{currentYearData.length}</p>
        </div>
        <div>
          <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Year</p>
          <p className='text-xs font-bold text-pink-600'>{currYear}</p>
        </div>
      </div>
    </div>
  )
}

export default LastYearSales
