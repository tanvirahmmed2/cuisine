'use client'
import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const ToggleAvailability = ({ id, currentStatus }) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)
    try {
      const res = await axios.post('/api/product/status', { id }, { withCredentials: true })
      toast.success(res.data.message)
      router.refresh()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all focus:outline-none disabled:opacity-50 ${
        currentStatus ? 'bg-white text-gray-800 shadow-lg shadow-pink-900/10' : 'bg-gray-100'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-all duration-300 shadow-sm ${
          currentStatus ? 'translate-x-[1.25rem]' : 'translate-x-[0.25rem]'
        }`}
      />
    </button>
  )
}

export default ToggleAvailability
