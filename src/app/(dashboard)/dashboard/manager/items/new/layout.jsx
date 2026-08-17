import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Add New Product Item',
    description: `Create new menu item for ${name}. ${tagline}`
}


const NewItemLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden px-1 sm:px-4'>
      {children}
    </div>
  )
}

export default NewItemLayout
