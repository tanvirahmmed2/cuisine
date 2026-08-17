import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
  title: 'Checkout',
  description: `Complete your order checkout at ${name}. ${tagline}`
}

export default function CheckoutLayout({ children }) {
  return (
    <div className='w-full min-h-screen'>
      {children}
    </div>
  )
}
