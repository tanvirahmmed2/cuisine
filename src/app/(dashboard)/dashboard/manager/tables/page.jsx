'use client'
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { MdAdd, MdDeleteOutline, MdEdit, MdRefresh, MdTableRestaurant, MdPeople, MdPlace, MdClose, MdCheck } from 'react-icons/md'

const ManagerTables = () => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    table_no: '',
    capacity: 4,
    location: 'Main Dining',
    status: 'available'
  })
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef(null)

  const fetchTables = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/table', { withCredentials: true })
      if (res.data.success) {
        setTables(res.data.payload)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch tables")
      setTables([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const handleOpenAdd = () => {
    setEditItem(null)
    setFormData({
      table_no: '',
      capacity: 4,
      location: 'Main Dining',
      status: 'available'
    })
    setShowForm(true)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleOpenEdit = (table) => {
    setEditItem(table)
    setFormData({
      table_no: table.table_no,
      capacity: table.capacity,
      location: table.location || 'Main Dining',
      status: table.status || 'available'
    })
    setShowForm(true)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditItem(null)
    setFormData({
      table_no: '',
      capacity: 4,
      location: 'Main Dining',
      status: 'available'
    })
  }

  const handleStatusQuickChange = async (table, newStatus) => {
    try {
      const res = await axios.put('/api/table', {
        id: table.id,
        status: newStatus
      }, { withCredentials: true })

      if (res.data.success) {
        toast.success(`Table ${table.table_no} status set to ${newStatus}`)
        fetchTables()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update table status")
    }
  }

  const handleDelete = async (table) => {
    if (!confirm(`Are you sure you want to delete Table ${table.table_no}?`)) return
    try {
      const res = await axios.delete('/api/table', {
        data: { id: table.id },
        withCredentials: true
      })
      if (res.data.success) {
        toast.success(res.data.message)
        if (editItem?.id === table.id) {
          handleCancelForm()
        }
        fetchTables()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete table")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.table_no.trim()) {
      return toast.error("Please enter a table number")
    }

    setSubmitting(true)
    try {
      if (editItem) {
        const res = await axios.put('/api/table', {
          id: editItem.id,
          ...formData
        }, { withCredentials: true })
        toast.success(res.data.message)
      } else {
        const res = await axios.post('/api/table', formData, { withCredentials: true })
        toast.success(res.data.message)
      }
      handleCancelForm()
      fetchTables()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200'
      case 'occupied':
        return 'bg-rose-50 text-rose-600 border-rose-200'
      case 'reserved':
        return 'bg-amber-50 text-amber-600 border-amber-200'
      case 'maintenance':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const availableCount = tables.filter(t => t.status === 'available').length
  const occupiedCount = tables.filter(t => t.status === 'occupied').length
  const reservedCount = tables.filter(t => t.status === 'reserved').length
  const maintenanceCount = tables.filter(t => t.status === 'maintenance').length

  return (
    <div className='w-full max-w-6xl mx-auto flex flex-col gap-8 pb-12'>
      
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2'>
            <MdTableRestaurant className='text-pink-500' size={28} /> Dining Tables
          </h1>
          <p className='text-gray-500 text-sm'>Manage dining floor tables, capacities, and availability statuses.</p>
        </div>

        <div className='flex items-center gap-3'>
          <button 
            onClick={fetchTables} 
            className='p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-xs'
            title='Refresh'
          >
            <MdRefresh size={20} />
          </button>

          <button 
            onClick={showForm ? handleCancelForm : handleOpenAdd}
            className={`px-5 py-2.5 font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center gap-2 ${
              showForm ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-pink-500 text-white hover:bg-pink-600'
            }`}
          >
            {showForm ? (
              <>
                <MdClose size={20} /> Cancel Form
              </>
            ) : (
              <>
                <MdAdd size={20} /> Add Table
              </>
            )}
          </button>
        </div>
      </div>

      {/* Embedded Inline Form Section (No Popup) */}
      {showForm && (
        <div ref={formRef} className='w-full bg-white border border-pink-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5 transition-all'>
          <div className='flex items-center justify-between border-b border-gray-100 pb-3'>
            <h2 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
              <span className='w-2.5 h-2.5 rounded-full bg-pink-500 inline-block'></span>
              {editItem ? `Edit Table ${editItem.table_no}` : 'Create New Table'}
            </h2>
            <button 
              onClick={handleCancelForm}
              className='text-xs font-semibold text-gray-400 hover:text-gray-600 flex items-center gap-1'
            >
              <MdClose size={16} /> Close Form
            </button>
          </div>

          <form onSubmit={handleSubmit} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end'>
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-gray-700'>Table Number *</label>
              <input 
                type="text" 
                value={formData.table_no}
                onChange={(e) => setFormData(prev => ({ ...prev, table_no: e.target.value }))}
                placeholder='e.g. 1, T-02, VIP-1'
                required
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-pink-500 text-sm font-medium bg-gray-50/50 focus:bg-white transition-all'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-gray-700'>Capacity (Seats)</label>
              <input 
                type="number" 
                min="1"
                max="50"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                required
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-pink-500 text-sm font-medium bg-gray-50/50 focus:bg-white transition-all'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-gray-700'>Floor Section</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder='e.g. Main Dining, Terrace'
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-pink-500 text-sm font-medium bg-gray-50/50 focus:bg-white transition-all'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-gray-700'>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-pink-500 text-sm font-medium bg-gray-50/50 focus:bg-white transition-all cursor-pointer'
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className='sm:col-span-2 md:col-span-4 flex items-center justify-end gap-3 pt-2'>
              <button
                type='button'
                onClick={handleCancelForm}
                className='px-5 py-2.5 border border-gray-200 rounded-xl font-semibold text-xs text-gray-600 hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={submitting}
                className='px-6 py-2.5 bg-pink-500 text-white rounded-xl font-semibold text-xs hover:bg-pink-600 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5'
              >
                <MdCheck size={18} /> {submitting ? 'Saving...' : editItem ? 'Save Changes' : 'Create Table'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        <div className='bg-white border border-gray-100 p-4 rounded-xl shadow-xs flex flex-col gap-1'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-400'>Available</p>
          <p className='text-2xl font-bold text-emerald-600'>{availableCount}</p>
        </div>
        <div className='bg-white border border-gray-100 p-4 rounded-xl shadow-xs flex flex-col gap-1'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-400'>Occupied</p>
          <p className='text-2xl font-bold text-rose-600'>{occupiedCount}</p>
        </div>
        <div className='bg-white border border-gray-100 p-4 rounded-xl shadow-xs flex flex-col gap-1'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-400'>Reserved</p>
          <p className='text-2xl font-bold text-amber-600'>{reservedCount}</p>
        </div>
        <div className='bg-white border border-gray-100 p-4 rounded-xl shadow-xs flex flex-col gap-1'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-400'>Maintenance</p>
          <p className='text-2xl font-bold text-gray-600'>{maintenanceCount}</p>
        </div>
      </div>

      {/* Tables Grid */}
      {loading ? (
        <div className='py-20 text-center text-gray-400 text-sm font-medium'>Loading dining tables...</div>
      ) : tables.length === 0 ? (
        <div className='py-24 bg-white rounded-xl border border-dashed border-gray-200 text-center flex flex-col items-center gap-3'>
          <MdTableRestaurant size={48} className='text-gray-300' />
          <p className='text-gray-500 font-medium text-sm'>No tables created yet.</p>
          <button 
            onClick={handleOpenAdd}
            className='px-4 py-2 bg-pink-50 text-pink-600 font-semibold text-xs rounded-lg hover:bg-pink-100 transition-colors'
          >
            Create your first table
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {tables.map((table) => (
            <div 
              key={table.id} 
              className={`bg-white border rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 ${
                editItem?.id === table.id ? 'ring-2 ring-pink-500 border-pink-200 bg-pink-50/10' : 'border-gray-100'
              }`}
            >
              <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-bold text-gray-800'>Table {table.table_no}</h3>
                  <select
                    value={table.status || 'available'}
                    onChange={(e) => handleStatusQuickChange(table, e.target.value)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${getStatusBadgeClass(table.status)}`}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className='flex flex-col gap-1 mt-1 text-xs text-gray-500'>
                  <div className='flex items-center gap-1.5'>
                    <MdPeople className='text-gray-400' size={16} />
                    <span>Capacity: <strong className='text-gray-700'>{table.capacity} Seats</strong></span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <MdPlace className='text-gray-400' size={16} />
                    <span>Section: <strong className='text-gray-700'>{table.location || 'Main Dining'}</strong></span>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-end gap-2 border-t border-gray-50 pt-3'>
                <button
                  onClick={() => handleOpenEdit(table)}
                  className='p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors'
                  title='Edit Table'
                >
                  <MdEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(table)}
                  className='p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors'
                  title='Delete Table'
                >
                  <MdDeleteOutline size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default ManagerTables
