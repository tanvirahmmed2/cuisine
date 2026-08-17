'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { name, tagline } from '@/lib/database/secret'

const Intro = () => {
  return (
    <section className='relative w-full min-h-screen flex items-center justify-center py-28 px-6 overflow-hidden bg-tertiary-dark'>
      
      {/* Background Image Container */}
      <div className='absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none'>
        <Image
          src='/cuisine.jpg'
          alt={name || 'Cuisine restaurant hero background'}
          fill
          priority
          sizes='100vw'
          className='object-cover object-center scale-105 transition-transform duration-1000'
        />
       <div className='absolute inset-0 bg-tertiary-dark/30 backdrop-blur-[1px] z-10' />
      </div>

      <div className='relative z-20 max-w-4xl mx-auto w-full flex flex-col items-center text-center gap-8'>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='space-y-6 flex flex-col items-center'
        >
          <h1 className='text-5xl md:text-7xl lg:text-8xl font-serif text-tertiary-light leading-[1.05] tracking-tight max-w-3xl drop-shadow-lg'>
            Taste the <span className='font-normal text-primary'>Extraordinary</span>
          </h1>

          <p className='text-tertiary-light/80 text-base md:text-xl font-light max-w-2xl leading-relaxed drop-shadow'>
            {tagline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className='flex flex-wrap items-center justify-center gap-5 pt-2'
        >
          <Link
            href='/menu'
            className='px-10 py-4 bg-primary text-tertiary-light rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 active:scale-95'
          >
            Explore Menu
          </Link>
          <Link
            href='/reservation'
            className='px-10 py-4 border border-tertiary-light/30 text-tertiary-light bg-tertiary-light/10 backdrop-blur-md rounded-full font-bold text-xs uppercase tracking-widest hover:bg-tertiary-light/20 transition-all active:scale-95'
          >
            Reserve Table
          </Link>
        </motion.div>

      </div>

    </section>
  )
}

export default Intro