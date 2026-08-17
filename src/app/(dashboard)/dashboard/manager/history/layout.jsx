import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Order History Logs',
    description: `Fulfillment and transaction history logs for ${name}. ${tagline}`
}

const HistoryLayout = ({children}) => {
  return (
    <div className='w-full overflow-hidden px-1 sm:px-4'>
      {children}
    </div>
  )
}

export default HistoryLayout
