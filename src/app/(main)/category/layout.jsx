import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Categories',
    description: `Explore food categories at ${name}. ${tagline}`
}

const CategoryLayout = ({children}) => {
  return (
    <div className='w-full p-1 sm:p-4 overflow-x-hidden'>
      {children}
    </div>
  )
}

export default CategoryLayout
