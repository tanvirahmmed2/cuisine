import React from 'react'
import { getBaseUrl } from '@/lib/helper';
import ChatInterface from './ChatInterface'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const SupportDashboard = async () => {
  const baseUrl = await getBaseUrl()
  
  // We need to pass the cookie because fetch in server component doesn't forward cookies natively
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
    <div className='w-full max-w-7xl mx-auto flex flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Support Center</h1>
        <p className='text-gray-500 text-sm'>Manage customer support sessions in real-time.</p>
      </div>
      
      <ChatInterface initialTickets={initialTickets} />
    </div>
  )
}

export default SupportDashboard
