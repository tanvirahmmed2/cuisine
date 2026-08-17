import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Explore Menu',
    description: `Discover gourmet dishes and culinary specials at ${name}. ${tagline}`
}


const Menuayout = async({children}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default Menuayout
