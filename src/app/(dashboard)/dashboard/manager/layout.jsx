import { isLogin } from "@/lib/auth/middleware"
import { redirect } from "next/navigation"

export default async function ManagerLayout({ children }) {
  const auth = await isLogin()

  if (!auth.success || auth.payload.role !== 'manager') {
    return redirect('/dashboard')
  }

  return <>{children}</>
}
