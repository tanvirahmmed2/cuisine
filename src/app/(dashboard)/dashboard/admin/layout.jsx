import { isLogin } from "@/lib/auth/middleware"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }) {
  const auth = await isLogin()
  
  if (!auth.success || auth.payload.role !== 'admin') {
    return redirect('/dashboard')
  }

  return <>{children}</>
}
