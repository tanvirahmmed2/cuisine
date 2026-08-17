'use client'
import React, { useContext } from 'react'
import Profile from '../buttons/Profile'
import { Context } from '../context/Context'
import { MdMenu, MdNotificationsNone, MdAccountCircle } from 'react-icons/md'
import { CgMenuMotion } from 'react-icons/cg'

const ManageNavbar = () => {
  const { manageSidebar, setManageSidebar, userData } = useContext(Context)
  
  return (
    <nav className='fixed top-0 left-0 right-0 h-14 bg-tertiary-light/80 backdrop-blur-xl border-b border-tertiary-dark/10 z-[60] flex items-center justify-between px-6'>
        
        {/* Left Side */}
        <div className='flex items-center gap-6'>
          <button 
            className='p-2 hover:bg-tertiary-dark/5 rounded-xl transition-colors cursor-pointer text-tertiary-dark/60 hover:text-primary' 
            onClick={() => setManageSidebar(!manageSidebar)}
          >
            {manageSidebar ? <CgMenuMotion size={24} /> : <MdMenu size={24} />}
          </button>

          <div className='flex items-center gap-3'>
            
            <h1 className='text-sm font-black text-tertiary-dark tracking-tight uppercase'>
              {userData?.role || 'Management'} <span className='text-tertiary-dark/40 font-medium ml-1'>Portal</span>
            </h1>
          </div>
        </div>

        {/* Right Side */}
        <div className='flex items-center gap-6'>
          {/* Notifications Placeholder */}
          <button className='p-2 text-tertiary-dark/40 hover:text-primary transition-colors relative cursor-pointer'>
            <MdNotificationsNone size={22} />
            <span className='absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-tertiary-light' />
          </button>

          <div className='h-6 w-px bg-tertiary-dark/10 mx-2' />

          <div className='flex items-center gap-3'>
            <div className='text-right hidden sm:block'>
              <p className='text-xs font-black text-tertiary-dark leading-none'>{userData?.name}</p>
              <p className='text-[10px] font-bold text-tertiary-dark/60 uppercase tracking-tighter mt-1'>{userData?.email}</p>
            </div>
            <div className='w-10 h-10 bg-tertiary-dark/5 rounded-xl flex items-center justify-center text-tertiary-dark/60 border border-tertiary-dark/10'>
              <MdAccountCircle size={24} />
            </div>
          </div>
        </div>

    </nav>
  )
}

export default ManageNavbar
