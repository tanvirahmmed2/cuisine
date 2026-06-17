'use client'
import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { MdExplore } from 'react-icons/md'
import { Context } from '@/components/context/Context'

const Categories = () => {
    const { categories } = useContext(Context)

    return (
        <div className='w-full min-h-screen bg-gray-50/50 pt-28 pb-20 px-6'>
            <div className='max-w-7xl mx-auto flex flex-col gap-16'>
                
                {/* Header */}
                <div className='text-center space-y-4'>
                    <div className='inline-flex items-center gap-2 text-pink-600 font-black uppercase tracking-[0.3em] text-[10px]'>
                        <MdExplore className='text-lg' />
                        Discover Flavors
                    </div>
                    <h1 className='text-5xl font-black text-gray-900 tracking-tight'>Browse Categories</h1>
                    <p className='text-gray-500 max-w-lg mx-auto'>Explore our diverse range of culinary categories, from spicy appetizers to divine desserts.</p>
                </div>

                {/* Grid */}
                <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8'>
                    {categories && categories.length > 0 ? (
                        categories.map((cat, index) => (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} 
                                whileInView={{ opacity: 1, scale: 1 }} 
                                transition={{ duration: 0.5, delay: index * 0.05 }} 
                                key={cat.id} 
                                className='group'
                            >
                                <Link href={`/category/${cat.slug}`} className='flex flex-col items-center gap-4 text-center'>
                                    <div className='relative w-full aspect-square rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl group-hover:border-pink-100 transition-all duration-500'>
                                        <Image 
                                            src={cat?.image} 
                                            alt={cat.name} 
                                            width={400} 
                                            height={400} 
                                            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                                        />
                                        <div className='absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/20 transition-colors' />
                                    </div>
                                    <div className='space-y-1'>
                                        <h3 className='text-lg font-black text-gray-900 tracking-tight group-hover:text-pink-600 transition-colors'>{cat?.name}</h3>
                                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]'>Explore Items</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <div className='col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200'>
                            <p className='text-gray-400 font-bold uppercase tracking-widest text-sm'>No categories found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Categories
