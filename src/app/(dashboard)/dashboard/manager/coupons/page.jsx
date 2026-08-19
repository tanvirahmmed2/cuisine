'use client'
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  MdAdd,
  MdDeleteOutline,
  MdEdit,
  MdRefresh,
  MdConfirmationNumber,
  MdClose,
  MdCheck,
  MdCalendarToday,
  MdToggleOn,
  MdToggleOff
} from 'react-icons/md'

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const formRef = useRef(null)

  const initialForm = {
    title: '',
    code: '',
    discount: '',
    is_percentage: true,
    min_bill: 0,
    start_at: '',
    expires_at: '',
    is_active: true
  }

  const [formData, setFormData] = useState(initialForm)

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/coupon', { withCredentials: true })
      if (res.data.success) {
        setCoupons(res.data.payload || [])
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch coupons')
      setCoupons([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ''
    const d = new Date(isoDate)
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - offset * 60000)
    return local.toISOString().slice(0, 16)
  }

  const handleOpenAdd = () => {
    setEditItem(null)
    setFormData(initialForm)
    setShowForm(true)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleOpenEdit = (coupon) => {
    setEditItem(coupon)
    setFormData({
      title: coupon.title || '',
      code: coupon.code || '',
      discount: coupon.discount || '',
      is_percentage: coupon.is_percentage ?? true,
      min_bill: coupon.min_bill || 0,
      start_at: formatDateForInput(coupon.start_at),
      expires_at: formatDateForInput(coupon.expires_at),
      is_active: coupon.is_active ?? true
    })
    setShowForm(true)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditItem(null)
    setFormData(initialForm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.code.trim()) {
      return toast.error('Please enter coupon title and code')
    }

    if (formData.discount === '' || Number(formData.discount) <= 0) {
      return toast.error('Please specify a valid discount value')
    }

    if (formData.is_percentage && Number(formData.discount) > 100) {
      return toast.error('Percentage discount cannot exceed 100%')
    }

    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        code: formData.code.trim().toUpperCase(),
        discount: Number(formData.discount),
        min_bill: Number(formData.min_bill) || 0,
        start_at: formData.start_at ? new Date(formData.start_at).toISOString() : null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null
      }

      if (editItem) {
        const res = await axios.put('/api/coupon', { id: editItem.id, ...payload }, { withCredentials: true })
        toast.success(res.data.message || 'Coupon updated successfully')
      } else {
        const res = await axios.post('/api/coupon', payload, { withCredentials: true })
        toast.success(res.data.message || 'Coupon created successfully')
      }

      handleCancelForm()
      fetchCoupons()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (coupon) => {
    try {
      const res = await axios.put(
        '/api/coupon',
        {
          id: coupon.id,
          title: coupon.title,
          code: coupon.code,
          discount: coupon.discount,
          is_percentage: coupon.is_percentage,
          max_usage_per_account: coupon.max_usage_per_account,
          min_bill: coupon.min_bill,
          start_at: coupon.start_at,
          expires_at: coupon.expires_at,
          is_active: !coupon.is_active
        },
        { withCredentials: true }
      )
      toast.success(coupon.is_active ? 'Coupon deactivated' : 'Coupon activated')
      fetchCoupons()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDelete = async (coupon) => {
    if (!confirm(`Are you sure you want to delete coupon '${coupon.code}'?`)) return
    try {
      const res = await axios.delete('/api/coupon', {
        data: { id: coupon.id },
        withCredentials: true
      })
      toast.success(res.data.message || 'Coupon deleted')
      if (editItem?.id === coupon.id) {
        handleCancelForm()
      }
      fetchCoupons()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete coupon')
    }
  }

  // Summary Metrics
  const now = new Date()
  const totalCoupons = coupons.length
  const activeCoupons = coupons.filter(c => c.is_active && (!c.expires_at || new Date(c.expires_at) > now)).length
  const expiredCoupons = coupons.filter(c => c.expires_at && new Date(c.expires_at) <= now).length
  const inactiveCoupons = coupons.filter(c => !c.is_active).length

  return (
    <div className='w-full max-w-6xl mx-auto flex flex-col gap-8 pb-12'>

      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2'>
            <MdConfirmationNumber className='text-pink-500' size={28} /> Discount Coupons
          </h1>
          <p className='text-gray-500 text-sm'>Create promo codes, manage percentage or fixed discounts, and set usage rules.</p>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={fetchCoupons}
            className='p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-xs cursor-pointer'
            title='Refresh'
          >
            <MdRefresh size={20} />
          </button>

          <button
            onClick={showForm ? handleCancelForm : handleOpenAdd}
            className={`px-5 py-2.5 font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
              showForm ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-pink-500 text-white hover:bg-pink-600'
            }`}
          >
            {showForm ? (
              <>
                <MdClose size={20} /> Cancel Form
              </>
            ) : (
              <>
                <MdAdd size={20} /> Add Coupon
              </>
            )}
          </button>
        </div>
      </div>

      {/* Embedded Inline Form Section (No Popup) */}
      {showForm && (
        <div ref={formRef} className='w-full bg-white border border-pink-100 rounded-2xl p-6 shadow-sm flex flex-col gap-6 transition-all'>
          <div className='flex items-center justify-between border-b border-gray-100 pb-3'>
            <h2 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
              <span className='w-2.5 h-2.5 rounded-full bg-pink-500 inline-block'></span>
              {editItem ? `Edit Coupon: ${editItem.code}` : 'Create New Coupon'}
            </h2>
            <button
              onClick={handleCancelForm}
              className='text-xs font-semibold text-gray-400 hover:text-gray-600 flex items-center gap-1 cursor-pointer'
            >
              <MdClose size={16} /> Close Form
            </button>
          </div>

          <form onSubmit={handleSubmit} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 items-end'>

            {/* Coupon Title */}
            <div className='flex flex-col gap-1.5 sm:col-span-2'>
              <label className='text-xs font-bold text-gray-700'>Coupon Title *</label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder='e.g. Summer Mega Discount, Welcome Promo'
                required
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-pink-500 text-sm font-medium bg-gray-50/50 focus:bg-white transition-all'
              />
            </div>

            {/* Coupon Code */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-gray-700'>Promo Code *</label>
              <input
                type='text'
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder='e.g. SUMMER20'
                required
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-pink-500 text-sm font-mono font-bold uppercase bg-gray-50/50 focus:bg-white transition-all'
              />
            </div>

            {/* Discount Type (Percentage vs Fixed) */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-gray-700'>Discount Type</label>
              <select
                value={formData.is_percentage ? 'percent' : 'fixed'}
                onChange={(e) => setFormData(prev => ({ ...prev, is_percentage: e.target.value === 'percent' }))}
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-pink-500 text-sm font-medium bg-gray-50/50 focus:bg-white transition-all cursor-pointer'
              >
                <option value='percent'>Percentage (%)</option>
                <option value='fixed'>Fixed Amount (৳)</option>
              </select>
            </div>

            {/* Discount Value */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-gray-700'>
                {formData.is_percentage ? 'Discount Rate (%) *' : 'Discount Amount (৳) *'}
              </label>
              <input
                type='number'
                min='0'
                max={formData.is_percentage ? '100' : '100000'}
                step='any'
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                placeholder={formData.is_percentage ? 'e.g. 20 for 20%' : 'e.g. 150 for ৳150'}
                required
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-pink-500 text-sm font-medium bg-gray-50/50 focus:bg-white transition-all'
              />
            </div>

            {/* Minimum Bill */}
            <div className='flex flex-col gap-1.5 sm:col-span-1'>
              <label className='text-xs font-bold text-gray-700'>Minimum Bill (৳)</label>
              <input
                type='number'
                min='0'
                step='any'
                value={formData.min_bill}
                onChange={(e) => setFormData(prev => ({ ...prev, min_bill: e.target.value }))}
                placeholder='0 for no minimum'
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-pink-500 text-sm font-medium bg-gray-50/50 focus:bg-white transition-all'
              />
            </div>

            {/* Active Status */}
            <div className='flex flex-col gap-1.5 sm:col-span-1'>
              <label className='text-xs font-bold text-gray-700'>Coupon Status</label>
              <select
                value={formData.is_active ? 'active' : 'inactive'}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'active' }))}
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-pink-500 text-sm font-medium bg-gray-50/50 focus:bg-white transition-all cursor-pointer'
              >
                <option value='active'>Active / Enabled</option>
                <option value='inactive'>Inactive / Disabled</option>
              </select>
            </div>

            {/* Valid From (Start At) */}
            <div className='flex flex-col gap-1.5 sm:col-span-2'>
              <label className='text-xs font-bold text-gray-700'>Valid From (Start Date)</label>
              <input
                type='datetime-local'
                value={formData.start_at}
                onChange={(e) => setFormData(prev => ({ ...prev, start_at: e.target.value }))}
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-pink-500 text-sm font-medium bg-gray-50/50 focus:bg-white transition-all'
              />
            </div>

            {/* Valid Until (Expires At) */}
            <div className='flex flex-col gap-1.5 sm:col-span-2'>
              <label className='text-xs font-bold text-gray-700'>Valid Until (Expiry Date)</label>
              <input
                type='datetime-local'
                value={formData.expires_at}
                onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                className='w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-pink-500 text-sm font-medium bg-gray-50/50 focus:bg-white transition-all'
              />
            </div>

            {/* Form Actions */}
            <div className='sm:col-span-2 md:col-span-4 flex items-center justify-end gap-3 pt-3 border-t border-gray-100'>
              <button
                type='button'
                onClick={handleCancelForm}
                className='px-5 py-2.5 border border-gray-200 rounded-xl font-semibold text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={submitting}
                className='px-6 py-2.5 bg-pink-500 text-white rounded-xl font-semibold text-xs hover:bg-pink-600 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer'
              >
                <MdCheck size={18} /> {submitting ? 'Saving...' : editItem ? 'Save Changes' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Metrics Row */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        <div className='bg-white border border-gray-100 p-4 rounded-xl shadow-xs flex flex-col gap-1'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-400'>Total Coupons</p>
          <p className='text-2xl font-bold text-gray-900'>{totalCoupons}</p>
        </div>
        <div className='bg-white border border-gray-100 p-4 rounded-xl shadow-xs flex flex-col gap-1'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-400'>Active</p>
          <p className='text-2xl font-bold text-emerald-600'>{activeCoupons}</p>
        </div>
        <div className='bg-white border border-gray-100 p-4 rounded-xl shadow-xs flex flex-col gap-1'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-400'>Expired</p>
          <p className='text-2xl font-bold text-amber-600'>{expiredCoupons}</p>
        </div>
        <div className='bg-white border border-gray-100 p-4 rounded-xl shadow-xs flex flex-col gap-1'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-gray-400'>Disabled</p>
          <p className='text-2xl font-bold text-gray-400'>{inactiveCoupons}</p>
        </div>
      </div>

      {/* Coupons List / Grid */}
      {loading ? (
        <div className='py-20 text-center text-gray-400 text-sm font-medium'>Loading coupons...</div>
      ) : coupons.length === 0 ? (
        <div className='py-24 bg-white rounded-xl border border-dashed border-gray-200 text-center flex flex-col items-center gap-3'>
          <MdConfirmationNumber size={48} className='text-gray-300' />
          <p className='text-gray-500 font-medium text-sm'>No discount coupons created yet.</p>
          <button
            onClick={handleOpenAdd}
            className='px-4 py-2 bg-pink-50 text-pink-600 font-semibold text-xs rounded-lg hover:bg-pink-100 transition-colors cursor-pointer'
          >
            Create your first coupon
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {coupons.map((coupon) => {
            const isExpired = coupon.expires_at && new Date(coupon.expires_at) <= now
            const isUpcoming = coupon.start_at && new Date(coupon.start_at) > now
            const isActive = coupon.is_active && !isExpired

            return (
              <div
                key={coupon.id}
                className={`bg-white border rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 ${
                  editItem?.id === coupon.id
                    ? 'ring-2 ring-pink-500 border-pink-200 bg-pink-50/10'
                    : 'border-gray-100'
                }`}
              >
                {/* Coupon Header Info */}
                <div className='flex flex-col gap-3'>
                  <div className='flex items-start justify-between gap-2'>
                    <div>
                      <span className='px-2.5 py-1 rounded-md bg-pink-50 border border-pink-200 font-mono font-black text-sm text-pink-600 tracking-wider inline-block'>
                        {coupon.code}
                      </span>
                      <h3 className='text-sm font-bold text-gray-900 mt-2 line-clamp-1'>{coupon.title}</h3>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        !coupon.is_active
                          ? 'bg-gray-100 text-gray-500'
                          : isExpired
                          ? 'bg-amber-50 text-amber-700'
                          : isUpcoming
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {!coupon.is_active
                        ? 'Disabled'
                        : isExpired
                        ? 'Expired'
                        : isUpcoming
                        ? 'Upcoming'
                        : 'Active'}
                    </span>
                  </div>

                  {/* Discount Value Highlight */}
                  <div className='bg-gray-50/70 border border-gray-100 rounded-xl p-3 flex items-center justify-between'>
                    <div>
                      <span className='text-[9px] uppercase font-bold text-gray-400 tracking-wider'>Discount</span>
                      <p className='text-lg font-black text-gray-900'>
                        {coupon.is_percentage ? `${Number(coupon.discount)}% OFF` : `৳${Number(coupon.discount).toLocaleString()} OFF`}
                      </p>
                    </div>
                    {Number(coupon.min_bill) > 0 && (
                      <div className='text-right'>
                        <span className='text-[9px] uppercase font-bold text-gray-400 tracking-wider'>Min. Spend</span>
                        <p className='text-xs font-bold text-gray-700'>৳{Number(coupon.min_bill).toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Dates & Rules */}
                  <div className='flex flex-col gap-1.5 text-xs text-gray-500'>
                    <div className='flex items-center gap-1.5 text-[11px]'>
                      <MdCalendarToday size={14} className='text-gray-400 shrink-0' />
                      <span>
                        {coupon.expires_at
                          ? `Expires: ${new Date(coupon.expires_at).toLocaleDateString()} at ${new Date(coupon.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : 'No expiry date (Unlimited)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className='flex items-center justify-between gap-2 border-t border-gray-50 pt-3'>
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleToggleActive(coupon)}
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                      coupon.is_active
                        ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                    }`}
                    title={coupon.is_active ? 'Click to disable' : 'Click to enable'}
                  >
                    {coupon.is_active ? <MdToggleOn size={20} className='text-emerald-600' /> : <MdToggleOff size={20} className='text-gray-400' />}
                    <span>{coupon.is_active ? 'Enabled' : 'Disabled'}</span>
                  </button>

                  <div className='flex items-center gap-1'>
                    <button
                      onClick={() => handleOpenEdit(coupon)}
                      className='p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer'
                      title='Edit Coupon'
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon)}
                      className='p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer'
                      title='Delete Coupon'
                    >
                      <MdDeleteOutline size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CouponsPage
