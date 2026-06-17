'use client'
import LastMonthExpense from '@/components/report/LastMonthExpense'
import LastMonthSales from '@/components/report/LastMonthSales'
import LastYearExpense from '@/components/report/LastYearExpense'
import LastYearSales from '@/components/report/LastYearSales'
import TotalExpense from '@/components/report/TotalExpense'
import TotalSales from '@/components/report/TotalSales'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { TrendingUp, Wallet, BarChart3, PieChart, Activity, AlertCircle, Download } from 'lucide-react'
import * as XLSX from 'xlsx'

const Analytics = () => {
  const [data, setData] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, expensesRes] = await Promise.all([
          axios.get('/api/order/delivery', { withCredentials: true }),
          axios.get('/api/expense', { withCredentials: true })
        ]);
        setData(ordersRes.data.payload || []);
        setExpenses(expensesRes.data.payload || []);
      } catch (error) {
        console.error("Analytics fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [])

  const downloadSalesExcel = () => {
    const salesData = data.map(order => ({
      'Date': new Date(order.created_at).toLocaleDateString(),
      'Order ID': order.id,
      'Customer': order.name,
      'Phone': order.phone,
      'Total Price': Number(order.total_price),
      'Payment Status': order.payment_status,
      'Order Status': order.status
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(salesData);
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
    XLSX.writeFile(wb, `Sales_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  const downloadExpensesExcel = () => {
    const expensesData = expenses.map(expense => ({
      'Date': new Date(expense.created_at || expense.date).toLocaleDateString(),
      'Title': expense.title,
      'Category': expense.category,
      'Amount': Number(expense.amount),
      'Status': expense.status
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(expensesData);
    XLSX.utils.book_append_sheet(wb, ws, "Expenses Report");
    XLSX.writeFile(wb, `Expenses_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  const downloadFullExcel = () => {
    // Prepare Sales Data
    const salesData = data.map(order => ({
      'Date': new Date(order.created_at).toLocaleDateString(),
      'Order ID': order.id,
      'Customer': order.name,
      'Phone': order.phone,
      'Total Price': Number(order.total_price),
      'Payment Status': order.payment_status,
      'Order Status': order.status
    }));

    // Prepare Expenses Data
    const expensesData = expenses.map(expense => ({
      'Date': new Date(expense.created_at || expense.date).toLocaleDateString(),
      'Title': expense.title,
      'Category': expense.category,
      'Amount': Number(expense.amount),
      'Status': expense.status
    }));

    // Create workbook and worksheets
    const wb = XLSX.utils.book_new();
    const wsSales = XLSX.utils.json_to_sheet(salesData);
    const wsExpenses = XLSX.utils.json_to_sheet(expensesData);

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(wb, wsSales, "Sales Report");
    XLSX.utils.book_append_sheet(wb, wsExpenses, "Expenses Report");

    // Export the file
    XLSX.writeFile(wb, `Full_Business_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col gap-12 animate-in fade-in duration-700'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-4xl font-black text-slate-900 tracking-tight'>Business Analytics</h1>
          <p className='text-slate-500 font-medium'>In-depth performance and financial analysis for your restaurant.</p>
        </div>
        <div className='flex items-center gap-3'>
          <button 
            onClick={downloadFullExcel}
            className='flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 group'
          >
            <Download size={18} className='group-hover:-translate-y-0.5 transition-transform' />
            Download Full Report
          </button>
          <div className='flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm font-bold'>
            <Activity size={16} className='animate-pulse' />
            Live Reports
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-16'>
        {/* Sales Overview */}
        <section className='flex flex-col gap-8'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-pink-500 rounded-2xl shadow-lg shadow-pink-200 text-white'>
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-slate-900 tracking-tight'>Sales Performance</h2>
                <p className='text-slate-400 text-sm font-medium'>Monitor your revenue growth and order trends.</p>
              </div>
            </div>
            <button 
              onClick={downloadSalesExcel}
              className='flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-xs font-bold hover:bg-pink-100 transition-all active:scale-95'
            >
              <Download size={14} />
              Export Sales
            </button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='group'>
              <LastMonthSales data={data} />
            </div>
            <div className='group'>
              <LastYearSales data={data} />
            </div>
            <div className='group'>
              <TotalSales data={data} />
            </div>
          </div>
        </section>

        {/* Expenses Overview */}
        <section className='flex flex-col gap-8'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200 text-white'>
                <Wallet size={24} />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-slate-900 tracking-tight'>Expense Analysis</h2>
                <p className='text-slate-400 text-sm font-medium'>Keep track of your spending and overheads.</p>
              </div>
            </div>
            <button 
              onClick={downloadExpensesExcel}
              className='flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all active:scale-95'
            >
              <Download size={14} />
              Export Expenses
            </button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='group'>
              <LastMonthExpense data={expenses}/>
            </div>
            <div className='group'>
              <LastYearExpense data={expenses}/>
            </div>
            <div className='group'>
              <TotalExpense data={expenses}/>
            </div>
          </div>
        </section>
      </div>

      {data.length === 0 && expenses.length === 0 && (
        <div className='text-center py-24 bg-pink-50/30 rounded-[2.5rem] border-2 border-dashed border-pink-100 flex flex-col items-center gap-4 transition-all hover:bg-pink-50/50'>
          <div className='p-4 bg-white rounded-full shadow-sm'>
            <AlertCircle size={32} className='text-pink-300' />
          </div>
          <div className='flex flex-col gap-1'>
            <p className='text-slate-900 font-bold text-lg tracking-tight uppercase'>No Data Available Yet</p>
            <p className='text-slate-400 text-sm max-w-xs mx-auto'>Start processing orders and recording expenses to see your business analytics here.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics
