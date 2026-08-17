import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
  title: 'Customer Reviews',
  description: `Read authentic customer reviews and ratings for ${name}. ${tagline}`
}

export default function ReviewsLayout({ children }) {
  return (
    <div className='w-full min-h-screen'>
      {children}
    </div>
  )
}
