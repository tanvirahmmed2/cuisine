import { isLogin } from "@/lib/auth/middleware"
import { redirect } from "next/navigation"
import { name, tagline } from "@/lib/database/secret"

export const metadata = {
  title: 'Sales POS & Orders',
  description: `${name} Sales & POS System - ${tagline}`
}

export default async function SalesLayout({ children }) {
  const auth = await isLogin()
  
  if (!auth.success || (auth.payload.role !== 'sales' && auth.payload.role !== 'admin')) {
    return redirect('/dashboard')
  }

  return <>{children}</>
}
