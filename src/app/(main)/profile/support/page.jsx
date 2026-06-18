import React from 'react'
import { getBaseUrl } from '@/lib/tenant/helper'
import ClientSupport from './ClientSupport'
import { cookies } from 'next/headers'

const ProfileSupportPage = async () => {
  const baseUrl = await getBaseUrl()
  
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ')

  let initialTickets = []
  try {
    const res = await fetch(`${baseUrl}/api/support/ticket`, { 
      method: 'GET', 
      cache: 'no-store',
      headers: {
        'Cookie': cookieHeader
      }
    })
    const data = await res.json()
    if (data.success) {
      initialTickets = data.payload
    }
  } catch (error) {
    console.error("Failed to load tickets:", error)
  }

  return (
    <div className='w-full pt-6 pb-20 px-6'>
      <div className='max-w-6xl mx-auto mb-10'>
        <h1 className='text-3xl font-black text-gray-900 tracking-tight'>Support Center</h1>
        <p className='text-gray-500 font-medium mt-1'>We're here to help you.</p>
      </div>
      <ClientSupport initialTickets={initialTickets} />
    </div>
  )
}

export default ProfileSupportPage
