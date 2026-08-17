import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Add New Category',
    description: `Create new menu category for ${name}. ${tagline}`
}


const NewCategoryLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden px-1 sm:px-4'>
      {children}
    </div>
  )
}

export default NewCategoryLayout
