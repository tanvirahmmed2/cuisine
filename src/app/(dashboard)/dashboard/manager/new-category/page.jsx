import AddCategoryForm from '@/components/forms/AddCategoryForm'
import React from 'react'

const NewCategory = () => {
  return (
    <div className='w-full max-w-3xl mx-auto flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>New Category</h1>
        <p className='text-gray-500 text-sm mt-1'>Create a new category to organise your menu.</p>
      </div>
      <AddCategoryForm/>
    </div>
  )
}

export default NewCategory
