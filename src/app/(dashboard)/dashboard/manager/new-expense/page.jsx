import NewExpenseForm from '@/components/forms/NewExpenseForm'
import React from 'react'

const NewExpense = () => {
    return (
    <div className='w-full max-w-xl flex flex-col gap-6'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Add New Expense</h1>
          <p className='text-gray-500 text-sm mt-1'>Log a business expenditure for record-keeping.</p>
        </div>
        <NewExpenseForm />
    </div>
    )
}

export default NewExpense
