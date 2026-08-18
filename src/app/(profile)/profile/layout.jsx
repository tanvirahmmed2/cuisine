'use client'
import React, { useState } from 'react'
import ProfileSidebar from '@/components/bar/ProfileSidebar'
import { MdMenu, MdClose } from 'react-icons/md'
import { name } from '@/lib/database/secret'

export default function ProfileLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className='w-full min-h-screen bg-gray-50/50 flex flex-col relative'>

      {/* Mobile Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-20 lg:hidden">
        <span className="font-bold text-sm text-gray-900">{name} — Profile</span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-600 transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Toggle profile menu"
        >
          {isSidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 lg:hidden"
        />
      )}

      <ProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 w-full lg:pl-72">
        <div className="p-6 md:p-8 max-w-5xl mx-auto min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  )
}
