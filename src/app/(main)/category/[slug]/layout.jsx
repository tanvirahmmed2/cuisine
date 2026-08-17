import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
  title: 'Category Details',
  description: `Explore food items by category at ${name}. ${tagline}`
}

export default function CategorySlugLayout({ children }) {
  return (
    <div className='w-full min-h-screen'>
      {children}
    </div>
  )
}
