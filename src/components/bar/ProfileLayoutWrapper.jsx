'use client'
import React, { useState } from 'react'
import ProfileSidebar from './ProfileSidebar'
import { MdMenu, MdClose } from 'react-icons/md'

const ProfileLayoutWrapper = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className='w-full min-h-screen bg-gray-50/30 flex flex-col relative'>
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-16 z-20">
        <span className="font-bold text-sm text-gray-900">Profile Dashboard</span>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-50 border border-gray-100 rounded-lg text-gray-600 transition-colors flex items-center justify-center cursor-pointer"
        >
          {isSidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>
      </div>

      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 lg:hidden top-16"
        />
      )}

      {/* Sidebar Navigation */}
      <ProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:pl-72">
        <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-[calc(100vh-8rem)]">
          {children}
        </div>
      </main>
    </div>
  )
}

export default ProfileLayoutWrapper
