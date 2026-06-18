import React from 'react'
import Image from 'next/image'
import { getBaseUrl } from '@/lib/tenant/helper'
import { MdLocalOffer } from 'react-icons/md'

const OffersPage = async () => {
  const baseUrl = await getBaseUrl()
  
  let offers = []
  try {
    const res = await fetch(`${baseUrl}/api/offer?active=true`, { cache: 'no-store' })
    const data = await res.json()
    if (data.success) {
      offers = data.payload
    }
  } catch (error) {
    console.error("Failed to load offers:", error)
  }

  return (
    <div className='w-full min-h-screen bg-gray-50/50 pt-32 pb-20 px-6'>
      <div className='max-w-7xl mx-auto flex flex-col gap-12'>
        
        {/* Header */}
        <div className='text-center space-y-4'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em]'>
            <MdLocalOffer className='text-lg' />
            Special Promotions
          </div>
          <h1 className='text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-none'>
            Exclusive <span className='text-pink-600'>Offers</span>
          </h1>
          <p className='text-gray-500 text-lg max-w-2xl mx-auto'>
            Discover our latest deals, seasonal specials, and limited-time discounts crafted just for you.
          </p>
        </div>

        {/* Offers Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-8'>
          {offers.length === 0 ? (
            <div className='col-span-1 md:col-span-2 text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-pink-900/5'>
              <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6'>
                <MdLocalOffer className='text-4xl text-gray-300' />
              </div>
              <h3 className='text-2xl font-black text-gray-900 mb-2'>No Active Offers</h3>
              <p className='text-gray-500'>Check back later for exciting new promotions and discounts!</p>
            </div>
          ) : (
            offers.map((offer, index) => (
              <div key={offer.id} className='bg-white rounded-[40px] shadow-2xl shadow-pink-900/5 border border-gray-100 overflow-hidden group hover:shadow-pink-900/10 transition-all flex flex-col h-full'>
                <div className='w-full h-72 relative overflow-hidden bg-gray-50'>
                  <Image 
                    src={offer.image} 
                    alt={offer.title} 
                    fill 
                    className='object-cover group-hover:scale-105 transition-transform duration-700' 
                  />
                  {offer.end_date && (
                    <div className='absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/20'>
                      <p className='text-[10px] font-black uppercase text-pink-600 tracking-widest'>Valid Until</p>
                      <p className='text-sm font-bold text-gray-900'>{new Date(offer.end_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                <div className='p-8 md:p-10 flex flex-col flex-1 relative'>
                  <div className='absolute -top-8 right-10 w-16 h-16 bg-pink-500 text-white rounded-2xl shadow-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform'>
                    <MdLocalOffer size={28} />
                  </div>
                  <h2 className='text-3xl font-black text-gray-900 tracking-tight mb-4 pr-16'>
                    {offer.title}
                  </h2>
                  <div 
                    className='prose prose-lg prose-slate prose-pink max-w-none text-gray-600 font-medium'
                    dangerouslySetInnerHTML={{ __html: offer.description }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default OffersPage
