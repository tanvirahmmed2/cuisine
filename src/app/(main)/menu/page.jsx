'use client'

import Item from "@/components/card/Item"
import { Context } from "@/components/context/Context"
import axios from "axios"
import React, { useEffect, useState, useContext } from "react"
import { motion, AnimatePresence } from 'framer-motion'

const Menu = () => {
  const [products, setProducts] = useState([])
  const { categories } = useContext(Context)
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/api/product?q=${categoryId}`, { withCredentials: true })
        setProducts(response.data.payload || [])
      } catch (error) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [categoryId])

  return (
    <div className="w-full min-h-screen bg-gray-50/50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">Our Menu</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Explore our curated selection of gourmet dishes, prepared with the finest ingredients.</p>
        </div>

        {/* Category Filter */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3">
          <button 
            onClick={() => setCategoryId('')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
              categoryId === '' 
              ? 'bg-pink-500 text-white shadow-xl shadow-pink-900/20 scale-105' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryId(cat.id)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                categoryId === cat.id 
                ? 'bg-pink-500 text-white shadow-xl shadow-pink-900/20 scale-105' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="w-full min-h-[400px]">
          {loading ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                key={categoryId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              >
                {products.length > 0 ? (
                  products.map((item) => (
                    <Item item={item} key={item.id} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No delicacies found in this category.</p>
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

export default Menu