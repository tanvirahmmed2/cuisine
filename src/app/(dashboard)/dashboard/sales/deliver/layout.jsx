import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Order Deliveries',
    description: `Fulfill order deliveries for ${name}. ${tagline}`
}

const DeliveryLayout = ({children}) => {
  return (
    <div className='w-full overflow-hidden px-1 sm:px-4'>
      {children}
    </div>
  )
}

export default DeliveryLayout
