'use client'
import React from 'react'
import { RiMapPinUserLine, RiDoubleQuotesL, RiStarFill } from 'react-icons/ri'

const ReviewCard = ({ review }) => {
  return (
    <div className='bg-tertiary-dark/5 rounded-[2rem] p-8 flex flex-col gap-6 relative group hover:bg-tertiary-light hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-tertiary-dark/10'>
      <RiDoubleQuotesL className='text-6xl text-tertiary-dark/20 absolute top-6 right-6 z-0 transition-colors group-hover:text-primary/20' />
      
      <div className='flex items-center gap-4 relative z-10'>
        <div className='w-14 h-14 bg-tertiary-light rounded-full flex items-center justify-center text-2xl text-tertiary-dark/40 shadow-sm'>
          <RiMapPinUserLine />
        </div>
        <div className='space-y-1'>
          <h3 className='font-bold text-tertiary-dark leading-none'>{review.name}</h3>
          <div className='flex gap-0.5'>
            {[...Array(5)].map((_, i) => (
              <RiStarFill 
                key={i} 
                className={`text-[10px] ${i < review.rating ? 'text-secondary' : 'text-tertiary-dark/20'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      <div 
        className='prose prose-sm text-tertiary-dark/70 leading-relaxed line-clamp-4 relative z-10'
        dangerouslySetInnerHTML={{ __html: review.comment }}
      />
      
      <p className='text-[9px] text-tertiary-dark/60 font-bold uppercase tracking-[0.2em] mt-auto relative z-10'>Verified Guest</p>
    </div>
  )
}

export default ReviewCard
