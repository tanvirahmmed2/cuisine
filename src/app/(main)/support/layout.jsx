import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
  title: 'Help & Support',
  description: `Customer support and help center for ${name}. ${tagline}`
}

export default function SupportLayout({ children }) {
  return (
    <div className='w-full min-h-screen'>
      {children}
    </div>
  )
}
