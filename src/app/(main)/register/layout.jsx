import { isLogin } from '@/lib/auth/middleware'
import { redirect } from 'next/navigation'
import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Create Account',
    description: `Register for an account at ${name}. ${tagline}`
}

const RegisterLayout = async({children}) => {
    const auth= await isLogin()

    if(auth.success){
        return redirect('/profile')
    }

  return (
    <div>
      {children}
    </div>
  )
}

export default RegisterLayout
