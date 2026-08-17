'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Item from '../card/Item'
import axios from 'axios'

const Latest = ({ initialProducts = [] }) => {
  const products = initialProducts

  if (!products || products.length === 0) return null
  return (
    <div className='w-full p-4 md:p-20 space-y-16 mb-8'>
      <h1 className='text-3xl text-center '>Top Picks</h1>
      {
        products && <div className='w-full grid grid-cols-2 h-full sm:grid-cols-3 lg:grid-cols-4 gap-4'>
          {
            products.map((item) => (
              <Item item={item} key={item.id} />
            ))
          }
        </div>
      }
    </div>
  )
}

export default Latest
