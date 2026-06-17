'use client'
import Link from 'next/link'
import React from 'react'
import { ImProfile } from 'react-icons/im';
import { PiFinnTheHumanLight } from "react-icons/pi";



const Profile = () => {
  return (
    <Link href={'/profile'} className='px-4 bg-white text-black p-1 rounded-2xl cursor-pointer  text-2xl'><ImProfile/></Link>
  )
}

export default Profile
