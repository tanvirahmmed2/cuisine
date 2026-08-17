'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { name, tagline } from '@/lib/database/secret'

const Intro = () => {
  const [items, setItems] = useState(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/product/discount/latest', { withCredentials: true })
        setItems(response.data.payload)
      } catch (error) {
        setItems(null)
      }
    }
    fetchItems()
  }, [])

  const item = useMemo(() => {
    if (!items || items.length === 0) return null
    return items[Math.floor(Math.random() * items.length)]
  }, [items])

  if (!item) return null

  return (
    <section className='relative w-full min-h-screen flex items-center justify-center py-28 px-6 overflow-hidden bg-tertiary-dark'>
      
      <div className='absolute inset-0 w-full h-full -z-10'>
        <Image
          src={item.image}
          alt={item.title || 'Featured item'}
          width={1000} height={1000}
          className='object-cover object-center'
        />
      </div>

      <div className='relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center gap-8'>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='space-y-6 flex flex-col items-center'
        >
          

          <h1 className='text-5xl md:text-7xl lg:text-8xl font-serif text-tertiary-light leading-[1.05] tracking-tight max-w-3xl'>
            Taste the <span className='font-normal text-primary'>Extraordinary</span>
          </h1>

          <p className='text-tertiary-light/80 text-base md:text-xl font-light max-w-2xl leading-relaxed'>
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