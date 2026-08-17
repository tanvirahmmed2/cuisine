import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Manage Categories',
    description: `Category Management for ${name}. ${tagline}`
}


const CategoryLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden px-1 sm:px-4'>
      {children}
    </div>
  )
}

export default CategoryLayout
