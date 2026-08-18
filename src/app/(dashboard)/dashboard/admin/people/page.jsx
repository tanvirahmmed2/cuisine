'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MdMoreVert, MdBlock, MdDeleteOutline } from 'react-icons/md'

const People = () => {
  const [staffs, setStaffs] = useState([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('manager')
  const [loading, setLoading] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState(null)

  const fetchStaffs = async () => {
    try {
      const res = await axios.get('/api/user/all?role=management', { withCredentials: true })
      setStaffs(res.data.payload)
    } catch (error) {
      setStaffs([])
    }
  }

  useEffect(() => {
    fetchStaffs()
  }, [])

  const handleBanUser = async (id) => {
    setActiveMenuId(null)
    try {
      const response = await axios.post('/api/user/banuser', { id }, { withCredentials: true })
      toast.success(response.data.message)
      fetchStaffs()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Status can't be changed")
    }
  }

  const handleDeleteUser = async (id) => {
    setActiveMenuId(null)
    const confirmAction = window.confirm("Are you sure you want to remove this user?")
    if (!confirmAction) return
    try {
      const response = await axios.delete('/api/user', { data: { id }, withCredentials: true })
      toast.success(response.data.message)
      fetchStaffs()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove user")
    }
  }

  const handlePromote = async (e) => {
    e.preventDefault()
    if (!email) return toast.error("Please enter an email")
    setLoading(true)
    try {
      const res = await axios.put('/api/user/management', { email, role }, { withCredentials: true })
      toast.success(res.data.message)
      setEmail('')
      fetchStaffs()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to promote user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full max-w-5xl mx-auto flex flex-col gap-8'>
      <div className='w-full'>
        <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>People & Access</h1>
        <p className='text-gray-500 text-sm'>Manage staff accounts and promote users.</p>
      </div>

      <div className='w-full bg-white p-6 rounded-xl border border-gray-100 flex flex-col gap-4'>
        <h2 className='text-lg font-semibold text-gray-800'>Promote User</h2>
        <form onSubmit={handlePromote} className='flex flex-col md:flex-row gap-3'>
          <input 
            type="email" 
            placeholder="Enter user email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='input-style flex-1 min-w-100'
          />
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className='input-style w-auto bg-white'
          >
            <option value="manager">Manager</option>
            <option value="sales">Sales</option>
            <option value="admin">Admin</option>
            <option value="user">User (Demote)</option>
          </select>
          <button 
            type="submit" 
            disabled={loading}
            className='px-6 py-2.5 bg-pink-500 text-white rounded-xl font-semibold text-sm hover:bg-pink-600 transition-colors disabled:opacity-50'
          >
            {loading ? 'Processing...' : 'Promote'}
          </button>
        </form>
      </div>

      <div className='w-full flex flex-col gap-4'>
        <h2 className='text-lg font-semibold text-gray-800'>Management Team</h2>
        <div className='w-full flex flex-col border border-gray-100 rounded-xl overflow-hidden'>
          <div className='w-full grid grid-cols-12 bg-gray-50/50 p-3 sm:p-4 font-semibold text-[10px] uppercase text-gray-400 tracking-widest border-b border-gray-100 items-center gap-2'>
            <div className='col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-3'>Member</div>
            <div className='hidden sm:block sm:col-span-4 md:col-span-4 lg:col-span-4'>Email</div>
            <div className='col-span-3 sm:col-span-2 md:col-span-2 lg:col-span-2'>Access Level</div>
            <div className='col-span-3 sm:col-span-2 md:col-span-3 lg:col-span-3 text-right sm:text-center'>Management</div>
          </div>
          {
            staffs && staffs.map((staff) => {
              const isMenuOpen = activeMenuId === staff.id;

              return (
                <div key={staff.id} className='w-full grid grid-cols-12 p-3 sm:p-4 items-center bg-white hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 gap-2 relative'>
                  <div className='col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-3 min-w-0'>
                    <p className='font-semibold text-gray-800 text-xs sm:text-sm truncate'>{staff.name}</p>
                    <p className='sm:hidden text-[10px] text-gray-400 truncate'>{staff.email}</p>
                  </div>

                  <div className='hidden sm:block sm:col-span-4 md:col-span-4 lg:col-span-4 text-gray-500 text-xs truncate'>
                    {staff.email}
                  </div>

                  <div className='col-span-3 sm:col-span-2 md:col-span-2 lg:col-span-2'>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                      staff.role === 'admin' ? 'bg-pink-50 text-pink-600' :
                      staff.role === 'manager' ? 'bg-amber-50 text-amber-600' :
                      staff.role === 'sales' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {staff.role}
                    </span>
                  </div>

                  {/* Three Dot Action Button & Dropdown Menu */}
                  <div className='col-span-3 sm:col-span-2 md:col-span-3 lg:col-span-3 flex flex-row items-center justify-end sm:justify-center relative'>
                    <button
                      type='button'
                      onClick={() => setActiveMenuId(isMenuOpen ? null : staff.id)}
                      className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer'
                      title='Actions'
                    >
                      <MdMoreVert size={20} />
                    </button>

                    {isMenuOpen && (
                      <>
                        <div 
                          className='fixed inset-0 z-40' 
                          onClick={() => setActiveMenuId(null)}
                        />

                        <div className='absolute right-0 top-10 z-50 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 flex flex-col gap-0.5 text-left text-xs font-semibold animate-in fade-in zoom-in-95 duration-100'>
                          <button
                            type='button'
                            onClick={() => handleBanUser(staff.id)}
                            className='w-full px-3 py-2 text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-2 cursor-pointer'
                          >
                            <MdBlock size={16} />
                            <span>{staff.is_banned ? 'Unban User' : 'Ban User'}</span>
                          </button>

                          <div className='border-t border-gray-100 my-0.5' />

                          <button
                            type='button'
                            onClick={() => handleDeleteUser(staff.id)}
                            className='w-full px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer'
                          >
                            <MdDeleteOutline size={16} />
                            <span>Remove User</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          }
          {staffs.length === 0 && (
            <div className='p-12 text-center text-gray-400 text-sm font-medium'>No team members found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default People
