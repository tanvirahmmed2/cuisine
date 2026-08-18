'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaPlus } from 'react-icons/fa'
import { MdMoreVert, MdEdit, MdDeleteOutline } from 'react-icons/md'

const Items = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMenuId, setActiveMenuId] = useState(null)

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/product', { withCredentials: true })
      setItems(res.data.payload || [])
    } catch (error) {
      console.error("Failed to fetch items:", error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleDeleteItem = async (id) => {
    setActiveMenuId(null)
    const confirmAction = window.confirm("Are you sure you want to delete this item?")
    if (!confirmAction) return
    try {
      const res = await axios.delete('/api/product', { data: { id }, withCredentials: true })
      toast.success(res.data.message || "Item deleted successfully")
      fetchItems()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete item")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-6xl mx-auto flex flex-col gap-8'>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Menu Items</h1>
          <p className='text-gray-500 text-sm'>Management of your restaurant menu.</p>
        </div>
        <Link 
          href="/dashboard/manager/items/new" 
          className='flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white rounded-xl font-semibold text-sm hover:bg-pink-600 transition-all active:scale-[0.98]'
        >
          <FaPlus size={12}/>
          <span>Add Item</span>
        </Link>
      </div>
      
      <div className='w-full flex flex-col gap-4'>
        <div className='w-full grid grid-cols-12 bg-gray-50/50 p-3 sm:p-4 rounded-xl font-semibold text-[10px] uppercase text-gray-400 tracking-widest border border-gray-100 items-center gap-2'>
          <div className='col-span-6 sm:col-span-5 md:col-span-6'>Item Detail</div>
          <div className='col-span-3 sm:col-span-2 md:col-span-2'>Price</div>
          <div className='hidden sm:block sm:col-span-3 md:col-span-2'>Status</div>
          <div className='col-span-3 sm:col-span-2 md:col-span-2 text-right sm:text-center'>Action</div>
        </div>
        
        <div className='flex flex-col gap-1.5'>
          {
            items.map((item) => {
              const isMenuOpen = activeMenuId === item.id;

              return (
                <div key={item.id} className='w-full grid grid-cols-12 p-3 items-center bg-white border border-gray-100 rounded-xl hover:border-pink-500 transition-all gap-2 relative group'>
                  <div className='col-span-6 sm:col-span-5 md:col-span-6 flex items-center gap-2 sm:gap-3 min-w-0'>
                    {item.image && (
                      <img src={item.image} alt={item.title} className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover border border-gray-50 flex-shrink-0' />
                    )}
                    <div className='flex flex-col min-w-0'>
                      <Link href={`/menu/${item.slug}`} className='font-semibold text-gray-800 text-xs sm:text-sm hover:underline truncate'>{item.title}</Link>
                      <p className='text-[10px] text-gray-400 uppercase font-semibold tracking-wider truncate'>{item.category_name}</p>
                    </div>
                  </div>

                  <div className='col-span-3 sm:col-span-2 md:col-span-2 font-semibold text-gray-900 text-xs sm:text-sm truncate'>
                    ৳{Number(item.price || 0).toLocaleString()}
                  </div>

                  <div className='hidden sm:block sm:col-span-3 md:col-span-2'>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                      item.is_available ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {item.is_available ? 'Active' : "Hidden"}
                    </span>
                  </div>

                  {/* Three Dot Action Button & Dropdown Menu */}
                  <div className='col-span-3 sm:col-span-2 md:col-span-2 flex flex-row items-center justify-end sm:justify-center relative'>
                    <button
                      type='button'
                      onClick={() => setActiveMenuId(isMenuOpen ? null : item.id)}
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

                        <div className='absolute right-0 top-10 z-50 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 flex flex-col gap-0.5 text-left text-xs font-semibold animate-in fade-in zoom-in-95 duration-100'>
                          <Link
                            href={`/dashboard/manager/items/${item.slug}`}
                            onClick={() => setActiveMenuId(null)}
                            className='w-full px-3 py-2 text-indigo-700 hover:bg-indigo-50 transition-colors flex items-center gap-2 cursor-pointer'
                          >
                            <MdEdit size={16} />
                            <span>Edit Item</span>
                          </Link>

                          <div className='border-t border-gray-100 my-0.5' />

                          <button
                            type='button'
                            onClick={() => handleDeleteItem(item.id)}
                            className='w-full px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer'
                          >
                            <MdDeleteOutline size={16} />
                            <span>Delete Item</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          }
          {items.length === 0 && (
            <div className='text-center py-24 bg-gray-50/50 rounded-xl border border-dashed border-gray-200'>
              <p className='text-gray-400 text-sm font-medium'>No items available in the menu.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Items
