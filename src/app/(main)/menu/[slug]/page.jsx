import ItemDetails from '@/components/page/ItemDetails'
import SameCategoryProducts from '@/components/page/SameCategoryProducts'
import { getBaseUrl } from '@/lib/helper';
import React from 'react'

const SingleProduct = async ({ params }) => {
  const { slug } = await params

  const baseUrl = await getBaseUrl()
  const res = await fetch(`${baseUrl}/api/product/${slug}`, { method: "GET", cache: 'no-store' })
  const data = await res.json()
  const product = data.payload

  if (!product) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-xl font-medium text-slate-700">No data found</p>
    </div>
  )

  return (
    <div className='w-full min-h-screen bg-slate-50 pb-20'>
      <div className='w-full bg-slate-700 h-64 relative' />

      <div className='max-w-7xl mx-auto px-4 -mt-32 relative z-10'>
        <ItemDetails product={product} />

        <SameCategoryProducts id={product.category_id} />
      </div>
    </div>
  )
}

export default SingleProduct