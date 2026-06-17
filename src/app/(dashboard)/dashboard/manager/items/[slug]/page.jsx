import UpdateItemForm from '@/components/forms/UpdateItemForm'
import { getBaseUrl } from '@/lib/tenant/helper'
import React from 'react'

const UpdateItem = async ({ params }) => {
  const { slug } = await params
  const baseUrl = await getBaseUrl()
  const res = await fetch(`${baseUrl}/api/product/${slug}`, {
    method: 'GET',
    cache: 'no-store'
  })
  const data = await res.json()
  const product= data.payload
  if(!product) {
    return <p>No data found</p>
  }

  return (
    <div className='w-full flex flex-col items-center p-4 gap-6'>
      <h1 className='text-xl text-center border-b-2 border-pink-500/10 w-full py-2'>Update Item Information</h1>
      <UpdateItemForm product={product}/>
    </div>
  )
}

export default UpdateItem
