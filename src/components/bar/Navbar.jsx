'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import Profile from '../buttons/Profile'
import { usePathname } from 'next/navigation'
import { FaBars, FaShoppingCart } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Logout from '../buttons/Logout'
import { Context } from '../context/Context'
import { name } from '@/lib/database/secret';

const Navbar = () => {
  const { cartBar, setCartBar, userData, cart, mobileSidebar, setMobileSidebar } = useContext(Context)
  const pathname = usePathname()

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
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 bg-tertiary-light backdrop-blur-md border-b border-tertiary-dark/10">
      <div className='max-w-7xl mx-auto px-6 flex flex-row items-center justify-between'>
        
        <Link 
          href={'/'} 
          onClick={() => setCartBar(false)} 
          className='text-xl font-bold tracking-tight text-tertiary-dark flex items-center gap-3'
        >
          <span className='font-serif'>{name}</span>
        </Link>

        <div className='hidden md:flex flex-row items-center gap-8'>
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setCartBar(false)}
                className={`text-xs uppercase tracking-widest transition-colors ${
                  isActive 
                    ? 'text-primary font-bold' 
                    : 'text-tertiary-dark/70 hover:text-primary font-semibold'
                }`}
              >
                {link.name}
              </Link>
            )
          })}

          {(userData && userData.role !== 'user') && (
            <Link 
              href={getDashboardLink()} 
              className='text-xs font-semibold px-3.5 py-1.5 rounded-lg text-tertiary-dark bg-tertiary-dark/5 hover:bg-primary hover:text-tertiary-light transition-all uppercase tracking-widest'
            >
              Dashboard
            </Link>
          )}

          <div className='flex items-center gap-6 border-l border-tertiary-dark/10 pl-6'>
            {/* Cart Trigger */}
            <button 
              onClick={() => setCartBar(!cartBar)} 
              className='relative p-2 text-tertiary-dark/70 hover:text-primary transition-colors cursor-pointer'
              aria-label="View Cart"
            >
              <FaShoppingCart size={18} />
              {cart?.items?.length > 0 && (
                <span className='absolute top-0 right-0 w-4 h-4 bg-primary text-tertiary-light text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-tertiary-light shadow-sm'>
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
                className='px-5 py-2 bg-primary text-tertiary-light text-[10px] font-semibold rounded-xl hover:bg-primary-dark transition-all active:scale-95 uppercase tracking-widest shadow-md shadow-primary/20'
              >
                Login
              </Link>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => setMobileSidebar(!mobileSidebar)} 
          className='p-2 text-tertiary-dark block md:hidden cursor-pointer transition-colors'
          aria-label="Toggle Mobile Navigation"
        >
          {mobileSidebar ? <RxCross2 size={24} /> : <FaBars size={24} />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
