'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../context/Context'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

import { name, tagline } from '@/lib/database/secret'

const Footer = () => {
  const { siteData } = useContext(Context)
  
  const currentYear = new Date().getFullYear()

  return (
    <footer className='w-full bg-secondary-dark text-tertiary-light pt-32 pb-16 px-6 '>
      <div className=''>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 pb-24'>
          
          <div className='lg:col-span-5 space-y-10'>
            <div className='space-y-4'>
              <h1 className='text-3xl font-serif tracking-tight text-tertiary-light'>
                {name}
              </h1>
              <p className='text-tertiary-light text-base leading-relaxed max-w-sm font-light'>
                {tagline}
              </p>
            </div>
            
            <div className='space-y-6'>
              <div className='space-y-2'>
                <p className='text-[10px] font-bold uppercase tracking-[0.3em] text-primary'>Our Sanctuary</p>
                <div className='text-sm text-tertiary-light/70 space-y-1 font-medium'>
                  <p>{siteData?.address || "123 Culinary Ave, Gourmet City, GK City, Earth"}</p>
                </div>
              </div>

              {siteData?.sociallink && (
                <div className='flex gap-4 pt-4'>
                  <a href={siteData.sociallink} target="_blank" rel="noopener noreferrer" className='w-11 h-11 border border-tertiary-dark/10 rounded-full flex items-center justify-center text-tertiary-light hover:bg-tertiary-dark hover:text-tertiary-light hover:border-tertiary-dark transition-all duration-300'>
                    {siteData.sociallink.includes('facebook') ? <FaFacebook size={18} /> :
                     siteData.sociallink.includes('instagram') ? <FaInstagram size={18} /> :
                     siteData.sociallink.includes('linkedin') ? <FaLinkedin size={18} /> :
                     <FaTwitter size={18} />}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className='lg:col-span-2 space-y-8'>
            <h4 className='text-[10px] font-bold uppercase tracking-[0.3em] text-tertiary-light/60'>The Menu</h4>
            <div className='flex flex-col gap-4 text-sm'>
              <Link className='text-tertiary-light/70 hover:text-primary transition-colors w-fit' href='/flashsale'>Flash Offers</Link>
              <Link className='text-tertiary-light/70 hover:text-primary transition-colors w-fit' href='/reservation'>Book a Table</Link>
              <Link className='text-tertiary-light/70 hover:text-primary transition-colors w-fit' href='/track-order'>Track Order</Link>
              <Link className='text-tertiary-light/70 hover:text-primary transition-colors w-fit' href='/support'>Help & Support</Link>
            </div>
          </div>

          {/* Legal */}
          <div className='lg:col-span-2 space-y-8'>
            <h4 className='text-[10px] font-bold uppercase tracking-[0.3em] text-tertiary-light/60'>Concierge</h4>
            <div className='flex flex-col gap-4 text-sm'>
               <Link className='text-tertiary-light/70 hover:text-primary transition-colors w-fit' href='/menu'>Explore Flavors</Link>
              <Link className='text-tertiary-light/70 hover:text-primary transition-colors w-fit' href='/'>Privacy Policy</Link>
              <Link className='text-tertiary-light/70 hover:text-primary transition-colors w-fit' href='/'>Terms of Service</Link>
              <Link className='text-tertiary-light/70 hover:text-primary transition-colors w-fit' href='/'>Refund Policy</Link>
            </div>
          </div>

          {/* Contact */}
          <div className='lg:col-span-3 space-y-8'>
            <h4 className='text-[10px] font-bold uppercase tracking-[0.3em] text-tertiary-light/60'>Reach Out</h4>
            <div className='space-y-6'>
              <div className='space-y-1'>
                <p className='text-lg font-serif text-tertiary-light'>{siteData?.phone}</p>
                <p className='text-sm text-tertiary-light font-light'>{siteData?.email}</p>
              </div>
              <div className='p-6 bg-tertiary-dark/5 rounded-2xl border border-tertiary-dark/10'>
                <p className='text-[9px] font-bold uppercase tracking-[0.2em] text-primary mb-2'>Open Hours</p>
                <p className='text-xs text-tertiary-light/70 font-medium'>Mon - Sun: 11:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>

        </div>

        <div className='pt-12 border-t border-tertiary-dark/10 flex flex-col md:flex-row items-center justify-between gap-8'>
          <p className='text-tertiary-light text-[10px] font-bold uppercase tracking-[0.3em]'>
            &copy; {currentYear} {name}. All Rights Reserved.
          </p>
          <p className='text-tertiary-light text-[10px] font-bold uppercase tracking-[0.3em]'>
            Curated by <Link href='https://disibin.com' className='text-tertiary-light hover:text-primary transition-colors'>Disibin</Link>
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
