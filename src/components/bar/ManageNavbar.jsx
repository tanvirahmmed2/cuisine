'use client'
import React, { useContext } from 'react'
import Profile from '../buttons/Profile'
import { Context } from '../context/Context'
import { MdMenu, MdNotificationsNone, MdAccountCircle } from 'react-icons/md'
import { CgMenuMotion } from 'react-icons/cg'

import Link from 'next/link'
import { name } from '@/lib/database/secret'

const ManageNavbar = () => {
  const { manageSidebar, setManageSidebar, userData } = useContext(Context)
  
  return (
    <nav className='fixed top-0 left-0 right-0 h-14 bg-tertiary-light/80 backdrop-blur-xl border-b border-tertiary-dark/10 z-60 flex items-center justify-between px-6'>
        
        <div className='flex items-center gap-4 md:gap-6'>
          <button 
            className='p-2 hover:bg-tertiary-dark/5 rounded-xl transition-colors cursor-pointer text-tertiary-dark/60 hover:text-primary' 
            onClick={() => setManageSidebar(!manageSidebar)}
          >
            {manageSidebar ? <CgMenuMotion size={24} /> : <MdMenu size={24} />}
          </button>

          <div className='flex items-center gap-3'>
            <Link href="/" className='font-serif font-semibold text-lg text-primary hover:opacity-80 transition-opacity'>
              {name}
            </Link>
            <div className='h-4 w-px bg-tertiary-dark/20' />
            <h1 className='text-xs md:text-sm font-semibold text-tertiary-dark tracking-tight uppercase'>
              {userData?.role || 'Management'} <span className='text-tertiary-dark/40 font-medium ml-1 hidden sm:inline'>Portal</span>
            </h1>
          </div>
        </div>

        <div className='flex items-center gap-6'>
          {/* Notifications Placeholder */}
          <button className='p-2 text-tertiary-dark/40 hover:text-primary transition-colors relative cursor-pointer'>
            <MdNotificationsNone size={22} />
            <span className='absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-tertiary-light' />
          </button>

          
        </div>

    </nav>
  )
}

export default ManageNavbar
