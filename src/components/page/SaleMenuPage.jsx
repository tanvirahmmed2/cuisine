'use client'

import Item from "@/components/card/Item"
import { Context } from "@/components/context/Context"
import axios from "axios"
import Link from "next/link"
import { useEffect, useState, useMemo, useContext } from "react"
import SaleItem from "../card/SaleItem"



const SaleMenuPage = () => {
  const [products, setProducts] = useState([])
  const { categories } = useContext(Context)
  const [categoryId, setCategoryId] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/product?q=${categoryId}`, { withCredentials: true })
        setProducts(response.data.payload)
      } catch (error) {
        setProducts([])
      }
    }
    fetchData()
  }, [categoryId])

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Menu Selection</h2>
          <p className="text-gray-500 text-xs">Choose items for the current order.</p>
        </div>

        <div className="w-full flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryId('')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all border ${
              categoryId === '' ? 'bg-pink-500 text-white border-pink-500' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-pink-500 hover:text-pink-600'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryId(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all border ${
                categoryId === cat.id ? 'bg-pink-500 text-white border-pink-500' : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-pink-500 hover:text-pink-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3  gap-3 w-full">
          {products.length > 0 ? (
            products.map((item) => (
              <SaleItem key={item.id} item={item}/>
            ))
          ) : (
            <div className="col-span-full py-24 text-center border border-dashed border-gray-100 rounded-xl">
              <p className="text-gray-400 text-xs font-medium">No items available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SaleMenuPage