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
    <div className='w-full flex flex-col gap-10'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Business Analytics</h1>
          <p className='text-gray-500 text-sm'>In-depth performance and financial analysis.</p>
        </div>
        <div className='flex items-center gap-3'>
          <button 
            onClick={downloadFullExcel}
            className='flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all active:scale-95'
          >
            <Download size={16} />
            Download Full Report
          </button>
          <div className='flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-600 rounded-xl text-xs font-bold'>
            <Activity size={14} className='animate-pulse' />
            Live
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-12'>
        {/* Sales Overview */}
        <section className='flex flex-col gap-6'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 bg-pink-500 rounded-xl flex items-center justify-center text-white'>
                <TrendingUp size={18} />
              </div>
              <div>
                <h2 className='text-base font-semibold text-gray-900 tracking-tight'>Sales Performance</h2>
                <p className='text-gray-400 text-xs'>Revenue growth and order trends.</p>
              </div>
            </div>
            <button 
              onClick={downloadSalesExcel}
              className='flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-xs font-bold hover:bg-pink-100 transition-all'
            >
              <Download size={14} />
              Export
            </button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <LastMonthSales data={data} />
            <LastYearSales data={data} />
            <TotalSales data={data} />
          </div>
        </section>

        {/* Expenses Overview */}
        <section className='flex flex-col gap-6'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white'>
                <Wallet size={18} />
              </div>
              <div>
                <h2 className='text-base font-semibold text-gray-900 tracking-tight'>Expense Analysis</h2>
                <p className='text-gray-400 text-xs'>Track your spending and overheads.</p>
              </div>
            </div>
            <button 
              onClick={downloadExpensesExcel}
              className='flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all'
            >
              <Download size={14} />
              Export
            </button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <LastMonthExpense data={expenses}/>
            <LastYearExpense data={expenses}/>
            <TotalExpense data={expenses}/>
          </div>
        </section>
      </div>

      {data.length === 0 && expenses.length === 0 && (
        <div className='text-center py-24 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center gap-3'>
          <AlertCircle size={32} className='text-gray-300' />
          <div className='flex flex-col gap-1'>
            <p className='text-gray-700 font-semibold text-sm'>No Data Available Yet</p>
            <p className='text-gray-400 text-xs max-w-xs mx-auto'>Start processing orders and recording expenses to see analytics here.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics
