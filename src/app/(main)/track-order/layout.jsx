import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
  title: 'Track Order',
  description: `Real-time order tracking for ${name}. ${tagline}`
}

export default function TrackOrderLayout({ children }) {
  return (
    <div className='w-full min-h-screen'>
      {children}
    </div>
  )
}
