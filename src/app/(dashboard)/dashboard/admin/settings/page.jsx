'use client'
import React from 'react'
import WebsiteDetails from '@/components/forms/WebsiteDetails'

const AdminSettings = () => {
    return (
        <div className='w-full max-w-4xl mx-auto flex flex-col gap-6'>
            <div className='flex flex-col gap-1'>
                <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Restaurant Settings</h1>
                <p className='text-gray-500 text-sm'>Manage your restaurant info, hours, and online presence.</p>
            </div>
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                <WebsiteDetails />
            </div>
        </div>
    )
}

export default AdminSettings