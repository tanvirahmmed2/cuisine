import { isLogin } from "@/lib/auth/middleware"
import { redirect } from "next/navigation"
import { name, tagline } from "@/lib/database/secret"

export const metadata = {
  title: 'Admin Control Panel',
  description: `${name} Admin Control Panel - ${tagline}`
}

export default async function AdminLayout({ children }) {
  const auth = await isLogin()
  
  if (!auth.success || auth.payload.role !== 'admin') {
    return redirect('/dashboard')
  }

  return <>{children}</>
}
