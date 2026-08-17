import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
  title: 'Item Details',
  description: `View gourmet dish details and customization options at ${name}. ${tagline}`
}

export default function MenuSlugLayout({ children }) {
  return (
    <div className='w-full min-h-screen'>
      {children}
    </div>
  )
}
