'use client'
import React, { useContext } from 'react'
import ManageNavbar from '@/components/bar/ManageNavbar'
import ManageSidebar from '@/components/bar/ManageSidebar'
import { Context } from '@/components/context/Context'

const DashboardLayoutWrapper = ({ children }) => {
  const { manageSidebar } = useContext(Context)

  return (
    <div className="min-h-screen bg-gray-50/50 relative">
      <ManageNavbar />
      <ManageSidebar />

      <main className={`transition-all duration-300 pt-14 ${
        manageSidebar ? 'lg:pl-72' : 'pl-0'
      }`}>
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayoutWrapper
