import { isLogin } from '@/lib/auth/middleware'
import { redirect } from 'next/navigation'
import React from 'react'
import ProfileLayoutWrapper from '../../../components/bar/ProfileLayoutWrapper'

export const metadata = {
  title: 'Profile | Restaurant',
  description: 'User dashboard overview'
}

const ProfileLayout = async ({ children }) => {
  const auth = await isLogin()
  if (!auth.success) {
    return redirect('/login')
  }

  return (
    <ProfileLayoutWrapper>
      {children}
    </ProfileLayoutWrapper>
  )
}

export default ProfileLayout
