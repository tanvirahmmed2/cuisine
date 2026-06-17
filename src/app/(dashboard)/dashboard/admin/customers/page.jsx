'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { MdDownload, MdPerson, MdShoppingCart, MdPayments } from 'react-icons/md'

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/admin/customers', { withCredentials: true })
      setCustomers(res.data.payload)
    } catch (error) {
      toast.error('Failed to fetch customers')
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleExport = async () => {
    setExporting(true)
    try {
      toast.loading('Preparing Excel report...')
      window.location.href = '/api/admin/customers/export'
      toast.dismiss()
    } catch (error) {
      toast.error('Failed to export customers')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className='w-full max-w-6xl mx-auto flex flex-col gap-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 tracking-tight'>Customer Insights</h1>
          <p className='text-gray-500 text-sm mt-1'>Detailed overview of customer activity and spending.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || customers.length === 0}
          className='flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 disabled:opacity-50'
        >
          <MdDownload size={20} />
          {exporting ? 'Exporting...' : 'Download Report'}
        </button>
      </div>

      <div className='w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead>
              <tr className='bg-gray-50/50 border-b border-gray-100'>
                <th className='px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest'>Customer</th>
                <th className='px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest'>Phone</th>
                <th className='px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest text-center'>Total Orders</th>
                <th className='px-6 py-4 text-[10px] font-bold uppercase text-gray-400 tracking-widest text-right'>Total Spent</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {loading ? (
                <tr>
                  <td colSpan="4" className='px-6 py-12 text-center'>
                    <div className='flex flex-col items-center gap-2'>
                      <div className='w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin'></div>
                      <p className='text-gray-400 text-sm font-medium'>Calculating insights...</p>
                    </div>
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.id} className='hover:bg-gray-50/30 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100'>
                          <MdPerson size={20} />
                        </div>
                        <div className='flex flex-col'>
                          <span className='font-bold text-gray-800'>{customer.name || 'Guest'}</span>
                          <span className='text-[10px] font-mono text-gray-400 uppercase'>ID: #{customer.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm text-gray-600 font-medium'>{customer.phone || 'N/A'}</span>
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <div className='inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-bold border border-gray-100'>
                        <MdShoppingCart size={14} className='opacity-50' />
                        {customer.total_orders}
                      </div>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex flex-col items-end'>
                        <span className='text-sm font-bold text-gray-900'>
                          ৳{(parseFloat(customer.total_spent) || 0).toLocaleString()}
                        </span>
                        <span className='text-[10px] text-gray-400 font-medium uppercase'>Total Revenue</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className='px-6 py-12 text-center text-gray-400 font-medium'>
                    No customer data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CustomersPage
