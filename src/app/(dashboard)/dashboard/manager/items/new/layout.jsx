import React from 'react'

export const metadata={
    title:'New Item',
    description:"New Item Page"
}


const NewItemLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden px-1 sm:px-4'>
      {children}
    </div>
  )
}

export default NewItemLayout
