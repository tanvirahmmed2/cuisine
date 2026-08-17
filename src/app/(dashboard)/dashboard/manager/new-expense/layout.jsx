import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Record New Expense',
    description: `Log business expenditure for ${name}. ${tagline}`
}


const NewExpenseLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden px-1 sm:px-4'>
      {children}
    </div>
  )
}

export default NewExpenseLayout
