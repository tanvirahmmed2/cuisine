'use client'
import React, { useContext } from 'react'
import Profile from '../buttons/Profile'
import { Context } from '../context/Context'
import { MdMenu, MdNotificationsNone, MdAccountCircle } from 'react-icons/md'
import { CgMenuMotion } from 'react-icons/cg'

const ManageNavbar = () => {
  const { manageSidebar, setManageSidebar, userData } = useContext(Context)
  
  return (
    <nav className='fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-[60] flex items-center justify-between px-6'>
        
        {/* Left Side */}
        <div className='flex items-center gap-6'>
          <button 
            className='p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer text-gray-500 hover:text-pink-600' 
            onClick={() => setManageSidebar(!manageSidebar)}
          >
            {manageSidebar ? <CgMenuMotion size={24} /> : <MdMenu size={24} />}
          </button>

          <div className='flex items-center gap-3'>
            
            <h1 className='text-sm font-black text-gray-900 tracking-tight uppercase'>
              {userData?.role || 'Management'} <span className='text-gray-300 font-medium ml-1'>Portal</span>
            </h1>
          </div>
        </div>

        {/* Right Side */}
        <div className='flex items-center gap-6'>
          {/* Notifications Placeholder */}
          <button className='p-2 text-gray-400 hover:text-pink-600 transition-colors relative cursor-pointer'>
            <MdNotificationsNone size={22} />
            <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white' />
          </button>

          <div className='h-6 w-px bg-gray-100 mx-2' />

          <div className='flex items-center gap-3'>
            <div className='text-right hidden sm:block'>
              <p className='text-xs font-black text-gray-900 leading-none'>{userData?.name}</p>
              <p className='text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1'>{userData?.email}</p>
            </div>
            <div className='w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100'>
              <MdAccountCircle size={24} />
            </div>
          </div>
        </div>

    </nav>
  )
}

export default ManageNavbar
