'use client'
import Link from 'next/link'
import React from 'react'
import { FaRegUser } from "react-icons/fa";



const Profile = () => {
  return (
    <Link href={'/profile'} className='px-4 bg-white text-black p-1 rounded-2xl cursor-pointer  text-xl'><FaRegUser/></Link>
  )
}

export default Profile
