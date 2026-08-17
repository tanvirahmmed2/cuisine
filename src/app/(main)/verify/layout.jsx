import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
  title: 'Verify Account',
  description: `Account verification for ${name}. ${tagline}`
}

export default function VerifyLayout({ children }) {
  return (
    <div className='w-full min-h-screen'>
      {children}
    </div>
  )
}
