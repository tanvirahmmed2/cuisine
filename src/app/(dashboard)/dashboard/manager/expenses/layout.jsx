import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Expenses Management',
    description: `Track business expenses for ${name}. ${tagline}`
}


const ExpenseLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden px-1 sm:px-4'>
      {children}
    </div>
  )
}

export default ExpenseLayout
