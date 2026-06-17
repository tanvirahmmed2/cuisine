import DeleteItem from '@/components/buttons/DeleteItem'
import UpdateItem from '@/components/buttons/UpdateItem'
import { getBaseUrl } from '@/lib/tenant/helper'
import Link from 'next/link'
import React from 'react'
import { FaPlus } from 'react-icons/fa'

const Items = async () => {
  let items = [];
  try {
    const baseUrl = await getBaseUrl()
    const res = await fetch(`${baseUrl}/api/product`, {
      method: 'GET',
      cache: 'no-store'
    })
    const data = await res.json()
    items = data.payload || []
  } catch (error) {
    console.error("Failed to fetch items:", error);
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
        <div className='w-full grid grid-cols-12 bg-gray-50/50 p-4 rounded-xl font-semibold text-[10px] uppercase text-gray-400 tracking-widest border border-gray-100'>
          <p className='col-span-6'>Item Detail</p>
          <p className='col-span-2'>Price</p>
          <p className='col-span-2'>Status</p>
          <p className='col-span-2 text-right'>Action</p>
        </div>
        
        <div className='flex flex-col gap-1.5'>
          {
            items.map((item) => (
              <div key={item.id} className='w-full grid grid-cols-12 p-3 items-center bg-white border border-gray-100 rounded-xl hover:border-pink-500 transition-all group'>
                <div className='col-span-6 flex items-center gap-3'>
                  {item.image && (
                    <img src={item.image} alt={item.title} className='w-10 h-10 rounded-lg object-cover border border-gray-50' />
                  )}
                  <div className='flex flex-col'>
                    <Link href={`/menu/${item.slug}`} className='font-semibold text-gray-800 text-sm hover:underline'>{item.title}</Link>
                    <p className='text-[10px] text-gray-400 uppercase font-semibold tracking-wider'>{item.category_name}</p>
                  </div>
                </div>
                <p className='col-span-2 font-semibold text-gray-900 text-sm'>৳{Number(item.price).toLocaleString()}</p>
                <div className='col-span-2'>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                    item.is_available ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {item.is_available ? 'Active' : "Hidden"}
                  </span>
                </div>
                <div className='col-span-2 flex flex-row items-center justify-end gap-2'>
                  <UpdateItem slug={item.slug} />
                  <DeleteItem id={item.id} />
                </div>
              </div>
            ))
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
