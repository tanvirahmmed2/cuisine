'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { MdTableRestaurant, MdRefresh, MdPeople, MdPlace, MdEventAvailable, MdLockClock, MdBuild } from 'react-icons/md'

const SalesTablesBoard = ({ onSelectTable }) => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTables = async () => {
    try {
      const res = await axios.get('/api/table', { withCredentials: true })
      if (res.data.success) {
        setTables(res.data.payload || [])
      }
    } catch (error) {
      console.error("Failed to fetch tables board:", error)
      setTables([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const handleStatusChange = async (table, newStatus) => {
    try {
      const res = await axios.put('/api/table', {
        id: table.id,
        status: newStatus
      }, { withCredentials: true })

      if (res.data.success) {
        toast.success(`Table ${table.table_no} status changed to ${newStatus}`)
        fetchTables()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update table status")
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'occupied':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'reserved':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'maintenance':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const totalCount = tables.length
  const availableCount = tables.filter(t => t.status === 'available').length
  const occupiedCount = tables.filter(t => t.status === 'occupied').length
  const reservedCount = tables.filter(t => t.status === 'reserved').length
  const maintenanceCount = tables.filter(t => t.status === 'maintenance').length

  return (
    <div className='w-full bg-white border border-tertiary-dark/10 rounded-2xl p-6 shadow-xs flex flex-col gap-6 mt-6'>
      
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-tertiary-dark/5 pb-4'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-xl font-bold text-tertiary-dark tracking-tight flex items-center gap-2'>
            <MdTableRestaurant className='text-primary' size={24} /> Live Dining Floor Tables
          </h2>
          <p className='text-xs text-tertiary-dark/60 font-medium'>
            All floor tables overview. Sales role can quickly update statuses or pick a table for orders.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2 text-xs font-semibold text-tertiary-dark/60 bg-tertiary-dark/5 px-3 py-1.5 rounded-lg'>
            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
            Live Status
          </div>
          <button 
            onClick={fetchTables}
            className='p-2 bg-tertiary-dark/5 hover:bg-tertiary-dark/10 rounded-lg text-tertiary-dark transition-colors'
            title='Refresh Tables'
          >
            <MdRefresh size={18} />
          </button>
        </div>
      </div>

      {/* Summary Status Pills */}
      <div className='grid grid-cols-2 sm:grid-cols-5 gap-3'>
        <div className='bg-tertiary-dark/5 p-3 rounded-xl flex flex-col gap-0.5 border border-tertiary-dark/5'>
          <p className='text-[9px] font-bold uppercase tracking-widest text-tertiary-dark/50'>Total Tables</p>
          <p className='text-xl font-black text-tertiary-dark'>{totalCount}</p>
        </div>
        <div className='bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl flex flex-col gap-0.5'>
          <p className='text-[9px] font-bold uppercase tracking-widest text-emerald-700/70'>Available</p>
          <p className='text-xl font-black text-emerald-600'>{availableCount}</p>
        </div>
        <div className='bg-rose-50/60 border border-rose-100 p-3 rounded-xl flex flex-col gap-0.5'>
          <p className='text-[9px] font-bold uppercase tracking-widest text-rose-700/70'>Occupied</p>
          <p className='text-xl font-black text-rose-600'>{occupiedCount}</p>
        </div>
        <div className='bg-amber-50/60 border border-amber-100 p-3 rounded-xl flex flex-col gap-0.5'>
          <p className='text-[9px] font-bold uppercase tracking-widest text-amber-700/70'>Reserved</p>
          <p className='text-xl font-black text-amber-600'>{reservedCount}</p>
        </div>
        <div className='bg-gray-100/60 border border-gray-200 p-3 rounded-xl flex flex-col gap-0.5 col-span-2 sm:col-span-1'>
          <p className='text-[9px] font-bold uppercase tracking-widest text-gray-500'>Maintenance</p>
          <p className='text-xl font-black text-gray-600'>{maintenanceCount}</p>
        </div>
      </div>

      {/* Tables Grid */}
      {loading ? (
        <div className='py-12 text-center text-xs text-tertiary-dark/40 font-medium'>Loading floor tables...</div>
      ) : tables.length === 0 ? (
        <div className='py-12 text-center text-xs text-tertiary-dark/40 font-medium'>No tables configured in system.</div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {tables.map((table) => (
            <div 
              key={table.id}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                table.status === 'available' ? 'bg-white border-emerald-100 shadow-2xs hover:border-emerald-300' :
                table.status === 'occupied' ? 'bg-rose-50/20 border-rose-100 hover:border-rose-300' :
                table.status === 'reserved' ? 'bg-amber-50/20 border-amber-100 hover:border-amber-300' :
                'bg-gray-50/50 border-gray-100'
              }`}
            >
              <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <h4 className='text-base font-bold text-tertiary-dark'>Table {table.table_no}</h4>
                  
                  {/* Status Dropdown */}
                  <select
                    value={table.status || 'available'}
                    onChange={(e) => handleStatusChange(table, e.target.value)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${getStatusBadgeClass(table.status)}`}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className='flex flex-col gap-1 text-xs text-tertiary-dark/60 mt-1'>
                  <div className='flex items-center gap-1.5'>
                    <MdPeople size={14} className='text-tertiary-dark/40' />
                    <span>Capacity: <strong className='text-tertiary-dark'>{table.capacity} Seats</strong></span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <MdPlace size={14} className='text-tertiary-dark/40' />
                    <span>Section: <strong className='text-tertiary-dark'>{table.location || 'Main Dining'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className='pt-2 border-t border-tertiary-dark/5 flex items-center justify-between gap-2'>
                <p className='text-[10px] font-bold text-tertiary-dark/40 uppercase tracking-widest'>Quick Status</p>
                <div className='flex items-center gap-1'>
                  {table.status !== 'available' && (
                    <button
                      onClick={() => handleStatusChange(table, 'available')}
                      className='px-2 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded text-[9px] font-bold uppercase transition-colors'
                      title='Mark Available'
                    >
                      Free
                    </button>
                  )}
                  {table.status !== 'occupied' && (
                    <button
                      onClick={() => handleStatusChange(table, 'occupied')}
                      className='px-2 py-1 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded text-[9px] font-bold uppercase transition-colors'
                      title='Mark Occupied'
                    >
                      Occupy
                    </button>
                  )}
                  {table.status !== 'reserved' && (
                    <button
                      onClick={() => handleStatusChange(table, 'reserved')}
                      className='px-2 py-1 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded text-[9px] font-bold uppercase transition-colors'
                      title='Mark Reserved'
                    >
                      Reserve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default SalesTablesBoard
