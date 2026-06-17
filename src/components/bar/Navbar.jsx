'use client'
import Link from 'next/link'
import React, { useContext, useState, useEffect } from 'react'
import Profile from '../buttons/Profile'

import { FaBars, FaShoppingCart } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Logout from '../buttons/Logout'
import { Context } from '../context/Context'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const { siteData, cartBar, setCartBar, userData, cart, mobileSidebar, setMobileSidebar } = useContext(Context)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Flash Sale', href: '/flashsale' },
    { name: 'Reservation', href: '/reservation' },
  ]

  const getDashboardLink = () => {
    if (!userData || userData.role === 'user') return null
    return '/dashboard'
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-3 bg-white/80 backdrop-blur-xl shadow-lg shadow-pink-900/5' : 'py-5 bg-transparent'
    }`}>
      <div className='max-w-7xl mx-auto px-6 flex flex-row items-center justify-between'>
        
        <Link 
          href={'/'} 
          onClick={() => setCartBar(false)} 
          className='text-xl font-bold tracking-tight text-gray-900 flex items-center gap-3'
        >
         
          {siteData?.name }
        </Link>

        <div className='hidden md:flex flex-row items-center gap-8'>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setCartBar(false)}
              className='text-xs font-semibold text-gray-500 hover:text-pink-600 transition-colors uppercase tracking-widest'
            >
              {link.name}
            </Link>
          ))}

          {(userData && userData.role !== 'user') && (
            <Link 
              href={getDashboardLink()} 
              className='text-xs font-semibold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-pink-500 hover:text-white transition-all uppercase tracking-widest'
            >
              Dashboard
            </Link>
          )}

          <div className="flex items-center gap-6 border-l border-gray-100 pl-6">
            {/* Cart Trigger */}
            <button 
              onClick={() => setCartBar(!cartBar)} 
              className='relative p-2 text-gray-400 hover:text-pink-600 transition-colors cursor-pointer'
            >
              <FaShoppingCart size={18} />
              {cart?.items?.length > 0 && (
                <span className='absolute top-0 right-0 w-4 h-4 bg-pink-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white'>
                  {cart.items.length}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {userData ? (
              <div className='flex items-center gap-3'>
                <Profile />
                <Logout />
              </div>
            ) : (
              <Link 
                href={'/login'} 
                onClick={() => setCartBar(false)} 
                className='px-5 py-2 bg-pink-500 text-white text-[10px] font-semibold rounded-xl hover:bg-pink-600 transition-all active:scale-95 uppercase tracking-widest'
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileSidebar(!mobileSidebar)} 
          className='p-2 text-gray-900 block md:hidden cursor-pointer'
        >
          {mobileSidebar ? <RxCross2 size={24} /> : <FaBars size={24} />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
