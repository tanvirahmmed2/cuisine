'use client'
import Link from 'next/link';
import React from 'react'

import { FaEdit } from "react-icons/fa";

const UpdateItem = ({slug}) => {
    
  return (
    <Link href={`/dashboard/manager/items/${slug}`} className='text-primary hover:text-primary-dark transition-colors'><FaEdit/></Link>
  )
}

export default UpdateItem
