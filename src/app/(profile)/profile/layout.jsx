'use client'
import React, { useState } from 'react'
import ProfileSidebar from '@/components/bar/ProfileSidebar'
import { MdMenu, MdClose } from 'react-icons/md'

export default function ProfileLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className='w-full min-h-screen bg-tertiary-dark/5 flex flex-col relative'>

      {/* Mobile Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-tertiary-light border-b border-tertiary-dark/10 sticky top-0 z-20 lg:hidden">
        <span className="font-bold text-sm text-tertiary-dark">Profile Dashboard</span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-tertiary-dark/5 border border-tertiary-dark/10 rounded-lg text-tertiary-dark/70 transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Toggle profile menu"
        >
          {isSidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-tertiary-dark/30 backdrop-blur-[2px] z-30 lg:hidden top-0"
        />
      )}

      <ProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 w-full lg:pl-72">
        <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  )
}

