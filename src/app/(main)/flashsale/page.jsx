'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Item from '@/components/card/Item'
import { motion, AnimatePresence } from 'framer-motion'
import { MdFlashOn } from 'react-icons/md'

const FlashSale = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await axios.get('/api/product/discount', { withCredentials: true })
        setProducts(res.data.payload || [])
      } catch (error) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [])

  return (
    <div className='w-full min-h-screen bg-gray-50/50 pt-28 pb-20 px-6'>
      <div className='max-w-7xl mx-auto flex flex-col gap-12'>
        
        {/* Header Section */}
        <div className='text-center space-y-4'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em]'>
            <MdFlashOn className='animate-pulse' />
            Limited Time Offers
          </div>
          <h1 className='text-5xl font-black text-gray-900 tracking-tight'>Flash Sale</h1>
          <p className='text-gray-500 max-w-lg mx-auto'>Grab your favorite delicacies at an unbeatable price. Act fast, these deals won&apos;t last forever!</p>
        </div>

        {/* Content Section */}
        <div className='w-full min-h-[400px]'>
          {loading ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8'
              >
                {products.length > 0 ? (
                  products.map((item) => (
                    <Item item={item} key={item.id} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                    <div className='text-4xl mb-4'>🎟️</div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No active offers at the moment</p>
                    <p className='text-xs text-gray-300 mt-1'>Check back soon for new discounts!</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

      </div>
    </div>
  )
}

export default FlashSale
