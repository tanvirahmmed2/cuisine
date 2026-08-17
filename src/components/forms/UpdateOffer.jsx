'use client'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import TiptapEditor from './TiptapEditor'
import Image from 'next/image'

const UpdateOffer = ({ initialData, fetchOffers, onClose }) => {
  const [loading, setLoading] = useState(false)
  
  // Format dates for datetime-local input
  const formatForInput = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    // Adjust for timezone offset to keep local time
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return date.toISOString().slice(0, 16)
  }

  const [data, setData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    is_active: initialData.is_active ?? true,
    start_date: formatForInput(initialData.start_date),
    end_date: formatForInput(initialData.end_date)
  })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(initialData.image || null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append("id", initialData.id)
    formData.append("title", data.title)
    formData.append("description", data.description)
    formData.append("is_active", data.is_active)
    if (data.start_date) formData.append("start_date", data.start_date)
    if (data.end_date) formData.append("end_date", data.end_date)
    if (image) formData.append("image", image)

    try {
      const res = await axios.put("/api/offer", formData, { withCredentials: true })
      toast.success(res.data.message)
      if (fetchOffers) fetchOffers()
      if (onClose) onClose()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update offer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-tertiary-dark/60 uppercase">Offer Title</label>
        <input type="text" name="title" value={data.title} onChange={handleChange} required className="input-style" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-tertiary-dark/60 uppercase">Description</label>
        <TiptapEditor content={data.description} onChange={(val) => setData({ ...data, description: val })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-tertiary-dark/60 uppercase">Start Date</label>
          <input type="datetime-local" name="start_date" value={data.start_date} onChange={handleChange} className="input-style" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-tertiary-dark/60 uppercase">End Date</label>
          <input type="datetime-local" name="end_date" value={data.end_date} onChange={handleChange} className="input-style" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_active" id="update_is_active" checked={data.is_active} onChange={handleChange} className="w-4 h-4 accent-primary" />
        <label htmlFor="update_is_active" className="text-sm font-semibold text-tertiary-dark cursor-pointer">Active Offer</label>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-tertiary-dark/60 uppercase">Update Image (Optional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="input-style file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tertiary-dark/10 file:text-tertiary-dark hover:file:bg-tertiary-dark/20" />
        {preview && (
          <div className="mt-2 w-full h-40 relative rounded-xl overflow-hidden border border-tertiary-dark/10">
            <Image src={preview} alt="Preview" fill className="object-cover" />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} disabled={loading} className="w-1/3 bg-tertiary-dark/10 text-tertiary-dark font-bold py-3 rounded-xl hover:bg-tertiary-dark/20 disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="w-2/3 bg-primary text-tertiary-light font-bold py-3 rounded-xl hover:bg-primary-dark disabled:opacity-50 shadow-lg shadow-primary/20">
          {loading ? "Updating..." : "Update Offer"}
        </button>
      </div>
    </form>
  )
}

export default UpdateOffer
