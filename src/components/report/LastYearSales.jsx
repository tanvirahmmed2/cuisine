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
    <div className='w-full bg-tertiary-light rounded-[2rem] p-8 border border-primary/20 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col justify-between min-h-[220px]'>
      <div>
        <div className='flex items-center justify-between mb-6'>
          <div className='p-3 bg-primary/10 text-primary rounded-2xl'>
            <BarChart3 size={24} />
          </div>
          <div className='flex items-center gap-1 text-primary font-bold text-xs bg-primary/10 px-3 py-1 rounded-full'>
            <History size={14} />
            <span>Annual</span>
          </div>
        </div>
        
        <h3 className='text-sm font-bold text-tertiary-dark/60 uppercase tracking-wider mb-1'>Yearly Revenue</h3>
        <div className='text-3xl font-black text-tertiary-dark tracking-tight mb-4'>
          ৳{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 pt-4 border-t border-tertiary-dark/10'>
        <div>
          <p className='text-[10px] font-bold text-tertiary-dark/60 uppercase tracking-widest'>Orders</p>
          <p className='text-xl font-black text-tertiary-dark'>{currentYearData.length}</p>
        </div>
        <div>
          <p className='text-[10px] font-bold text-tertiary-dark/60 uppercase tracking-widest'>Year</p>
          <p className='text-xs font-bold text-primary'>{currYear}</p>
        </div>
      </div>
    </div>
  )
}

export default LastYearSales
