import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Pending Orders',
    description: `Active pending order management for ${name}. ${tagline}`
}

const PendingLayout = ({children}) => {
  return (
    <div className='w-full overflow-hidden px-1 sm:px-4'>
      {children}
    </div>
  )
}

export default PendingLayout
