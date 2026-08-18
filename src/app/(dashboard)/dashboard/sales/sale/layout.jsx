import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Sales Terminal',
    description: `Point of Sale terminal for ${name}. ${tagline}`
}


const SaleLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden px-1 sm:px-4'>
      {children}
    </div>
  )
}

export default SaleLayout
