'use client'
import UpdateUserForm from '@/components/forms/UpdateUserForm'
import React from 'react'

const UpdateProfilePage = () => {
  return (
    <div className='space-y-6 max-w-xl'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>Edit Details</h1>
        <p className='text-gray-500 text-sm mt-1'>Update your account details and password.</p>
      </div>
      <div className='bg-gray-50 p-6 rounded-2xl border border-gray-100/50'>
        <UpdateUserForm />
      </div>
    </div>
  )
}

export default UpdateProfilePage
