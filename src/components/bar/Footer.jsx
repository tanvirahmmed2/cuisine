'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../context/Context'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  const { siteData } = useContext(Context)
  
  const currentYear = new Date().getFullYear()

  return (
    <footer className='w-full bg-white text-gray-900 pt-32 pb-16 px-6 border-t border-gray-100'>
      <div className='max-w-7xl mx-auto'>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 pb-24'>
          
          {/* Brand Identity */}
          <div className='lg:col-span-5 space-y-10'>
            <div className='space-y-4'>
              <h1 className='text-3xl font-serif tracking-tight text-gray-900'>
                {siteData?.name || "GRAND KITCHEN"}
              </h1>
              <p className='text-gray-500 text-base leading-relaxed max-w-sm font-light'>
                {siteData?.meta_description || "Crafting exceptional culinary experiences with passion and precision since 2010."}
              </p>
            </div>
            
            <div className='space-y-6'>
              <div className='space-y-2'>
                <p className='text-[10px] font-bold uppercase tracking-[0.3em] text-pink-600'>Our Sanctuary</p>
                <div className='text-sm text-gray-600 space-y-1 font-medium'>
                  <p>{siteData?.address || "123 Culinary Ave, Gourmet City"}</p>
                  <p>{siteData?.city || "GK City"}, {siteData?.country || "Earth"}</p>
                </div>
              </div>

              <div className='flex gap-4 pt-4'>
                {siteData?.facebook && (
                  <a href={siteData.facebook} target="_blank" rel="noopener noreferrer" className='w-11 h-11 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300'>
                    <FaFacebook size={18} />
                  </a>
                )}
                {siteData?.instagram && (
                  <a href={siteData.instagram} target="_blank" rel="noopener noreferrer" className='w-11 h-11 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300'>
                    <FaInstagram size={18} />
                  </a>
                )}
                {siteData?.linkedin && (
                  <a href={siteData.linkedin} target="_blank" rel="noopener noreferrer" className='w-11 h-11 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300'>
                    <FaLinkedin size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className='lg:col-span-2 space-y-8'>
            <h4 className='text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400'>The Menu</h4>
            <div className='flex flex-col gap-4 text-sm'>
              <Link className='text-gray-600 hover:text-pink-600 transition-colors w-fit' href='/menu'>Explore Flavors</Link>
              <Link className='text-gray-600 hover:text-pink-600 transition-colors w-fit' href='/flashsale'>Flash Offers</Link>
              <Link className='text-gray-600 hover:text-pink-600 transition-colors w-fit' href='/reservation'>Book a Table</Link>
              <Link className='text-gray-600 hover:text-pink-600 transition-colors w-fit' href='/support'>Help & Support</Link>
            </div>
          </div>

          {/* Legal */}
          <div className='lg:col-span-2 space-y-8'>
            <h4 className='text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400'>Concierge</h4>
            <div className='flex flex-col gap-4 text-sm'>
              <Link className='text-gray-600 hover:text-pink-600 transition-colors w-fit' href='/'>Privacy Policy</Link>
              <Link className='text-gray-600 hover:text-pink-600 transition-colors w-fit' href='/'>Terms of Service</Link>
              <Link className='text-gray-600 hover:text-pink-600 transition-colors w-fit' href='/'>Refund Policy</Link>
            </div>
          </div>

          {/* Contact */}
          <div className='lg:col-span-3 space-y-8'>
            <h4 className='text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400'>Reach Out</h4>
            <div className='space-y-6'>
              <div className='space-y-1'>
                <p className='text-lg font-serif text-gray-900'>{siteData?.phone}</p>
                <p className='text-sm text-gray-500 font-light'>{siteData?.email}</p>
              </div>
              <div className='p-6 bg-[#fafafa] rounded-2xl border border-gray-50'>
                <p className='text-[9px] font-bold uppercase tracking-[0.2em] text-pink-600 mb-2'>Open Hours</p>
                <p className='text-xs text-gray-600 font-medium'>Mon - Sun: 11:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className='pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8'>
          <p className='text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]'>
            &copy; {currentYear} {siteData?.name}. All Rights Reserved.
          </p>
          <p className='text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]'>
            Curated by <Link href='https://disibin.com' className='text-gray-900 hover:text-pink-600 transition-colors'>Disibin</Link>
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
