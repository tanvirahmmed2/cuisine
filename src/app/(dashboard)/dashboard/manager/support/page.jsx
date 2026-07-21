import React from 'react'
import { getBaseUrl } from '@/lib/helper';
import ChatInterface from './ChatInterface'
import { cookies } from 'next/headers'

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
    <div className='w-full max-w-7xl mx-auto p-4 flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold text-slate-800'>Support Chat</h1>
        <p className='text-slate-500 text-sm'>Manage customer support sessions in real-time.</p>
      </div>
      
      <ChatInterface initialTickets={initialTickets} />
    </div>
  )
}

export default SupportDashboard
