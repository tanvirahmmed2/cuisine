
import SaleMenuPage from '@/components/page/SaleMenuPage'
import SalesCart from '@/components/page/SalesCart'
import React from 'react'

const page = () => {
  return (
    <div className='w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4'>
        <SalesCart/>
        <SaleMenuPage/>
      
    </div>
  )
}

export default page
