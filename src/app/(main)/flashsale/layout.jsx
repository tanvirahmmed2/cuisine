import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
  title: 'Flash Sale & Offers',
  description: `Exclusive flash sale discounts and special chef offers at ${name}. ${tagline}`
}

export default function FlashSaleLayout({ children }) {
  return (
    <div className='w-full min-h-screen'>
      {children}
    </div>
  )
}
