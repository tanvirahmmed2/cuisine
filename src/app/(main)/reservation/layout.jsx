import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Table Reservation',
    description: `Book your table online at ${name}. ${tagline}`
}

const Reservation = ({children}) => {
  return (
    <div className='w-full bg-gray-100'>
      {children}
    </div>
  )
}

export default Reservation
