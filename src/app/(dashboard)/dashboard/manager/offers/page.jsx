'use client'
import AddOffer from '@/components/forms/AddOffer'
import UpdateOffer from '@/components/forms/UpdateOffer'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MdDelete, MdAdd, MdEdit } from 'react-icons/md'

const OffersPage = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editOffer, setEditOffer] = useState(null)

  const fetchOffers = async () => {
    try {
      const res = await axios.get('/api/offer')
      if (res.data.success) {
        setOffers(res.data.payload)
      }
    } catch (error) {
      toast.error('Failed to fetch offers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this offer?')) return
    try {
      const res = await axios.delete('/api/offer', { data: { id }, withCredentials: true })
      toast.success(res.data.message)
      fetchOffers()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete offer')
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Offers & Promotions</h1>
          <p className="text-gray-500 text-sm">Manage special offers, discounts, and promotional banners.</p>
        </div>
        <button 
          onClick={() => {
            setEditOffer(null)
            setShowAdd(!showAdd)
          }}
          className="flex items-center gap-2 bg-pink-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-pink-600 transition-all active:scale-[0.98]"
        >
          {showAdd || editOffer ? 'Close Form' : <><MdAdd size={18} /> Add Offer</>}
        </button>
      </div>

      {showAdd && !editOffer && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 max-w-2xl">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Create New Offer</h2>
          <AddOffer fetchOffers={fetchOffers} />
        </div>
      )}

      {editOffer && (
        <div className="bg-white p-6 rounded-2xl border border-pink-100 max-w-2xl">
          <h2 className="text-base font-semibold text-pink-600 mb-5">Edit Offer: {editOffer.title}</h2>
          <UpdateOffer 
            initialData={editOffer} 
            fetchOffers={fetchOffers} 
            onClose={() => setEditOffer(null)} 
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        ) : offers.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm font-medium">No offers yet. Create one above.</p>
          </div>
        ) : (
          offers.map(offer => (
            <div key={offer.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col relative group hover:border-pink-200 transition-all">
              <div className="relative w-full h-44 bg-gray-100">
                <Image src={offer.image} alt={offer.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setShowAdd(false)
                      setEditOffer(offer)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="p-1.5 bg-white text-gray-700 hover:text-pink-600 rounded-lg shadow-md transition-colors"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(offer.id)}
                    className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-md transition-colors"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${offer.is_active ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}`}>
                    {offer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-sm text-gray-800 line-clamp-1">{offer.title}</h3>
                <div 
                  className="mt-2 text-xs text-gray-500 line-clamp-3 prose prose-sm prose-slate"
                  dangerouslySetInnerHTML={{ __html: offer.description }}
                />
                <div className="mt-4 pt-3 border-t border-gray-50 text-[10px] text-gray-400 flex flex-col gap-0.5">
                  {offer.start_date && <p>Starts: {new Date(offer.start_date).toLocaleString()}</p>}
                  {offer.end_date && <p>Ends: {new Date(offer.end_date).toLocaleString()}</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default OffersPage
