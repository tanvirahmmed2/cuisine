'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { MdArrowBack, MdSave } from 'react-icons/md'
import Link from 'next/link'

const ManageUser = () => {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [staff, setStaff] = useState(null)
  const [role, setRole] = useState('')

  useEffect(() => {
    // We fetch all staffs and find the one with this ID
    // A better approach would be to fetch a specific staff, but for simplicity we reuse the existing endpoint
    const fetchStaff = async () => {
      try {
        const res = await axios.get('/api/user/all', { withCredentials: true })
        const found = res.data.payload.find(s => s.id == id)
        if (found) {
          setStaff(found)
          setRole(found.role)
        } else {
          toast.error("User not found")
          router.push('/dashboard/admin/people')
        }
      } catch (error) {
        toast.error("Failed to fetch user data")
      }
    }
    fetchStaff()
  }, [id, router])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.put('/api/user/management', { id: staff.id, role }, { withCredentials: true })
      toast.success(res.data.message)
      router.push('/dashboard/admin/people')
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update role")
    } finally {
      setLoading(false)
    }
  }

  if (!staff) return <div className="p-8 text-center">Loading user data...</div>

  return (
    <div className='w-full max-w-2xl mx-auto p-4 flex flex-col gap-6 mt-8'>
      
      <div className="flex items-center gap-4 border-b pb-4">
        <Link href="/dashboard/admin/people" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MdArrowBack size={24} />
        </Link>
        <h1 className='text-2xl font-black text-gray-900'>Manage User Role</h1>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
        
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">User Details</p>
          <h2 className="text-xl font-bold text-gray-900">{staff.name}</h2>
          <p className="text-gray-500">{staff.email}</p>
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col gap-6 border-t border-gray-100 pt-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="text-sm font-bold text-gray-700">Assign Role</label>
            <select 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 transition-colors cursor-pointer appearance-none"
            >
              <option value="user">User (Customer)</option>
              <option value="sales">Sales (POS & Orders)</option>
              <option value="manager">Manager (Inventory & Operations)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Select the appropriate access level for this user.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading || role === staff.role}
            className="flex items-center justify-center gap-2 w-full py-4 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdSave size={20} />
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default ManageUser
