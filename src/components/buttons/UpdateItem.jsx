'use client'
import Link from 'next/link';
import React from 'react'

import { FaEdit } from "react-icons/fa";

const UpdateItem = ({slug}) => {
    
  return (
    <Link href={`/dashboard/manager/items/${slug}`} className='text-pink-500 hover:text-pink-700 transition-colors'><FaEdit/></Link>
  )
}

export default UpdateItem
