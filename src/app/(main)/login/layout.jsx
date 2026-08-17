import { isLogin } from '@/lib/auth/middleware'
import { redirect } from 'next/navigation'
import React from 'react'
import { name, tagline } from '@/lib/database/secret'

export const metadata = {
    title: 'Login',
    description: `Login to your account at ${name}. ${tagline}`
}

const LoginLayout = async({children}) => {
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

export default LoginLayout
