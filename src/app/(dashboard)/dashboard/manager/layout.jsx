import { isLogin } from "@/lib/auth/middleware"
import { redirect } from "next/navigation"
import { name, tagline } from "@/lib/database/secret"

export const metadata = {
  title: 'Manager Portal',
  description: `${name} Manager Portal - ${tagline}`
}

export default async function ManagerLayout({ children }) {
  const auth = await isLogin()

  if (!auth.success || auth.payload.role !== 'manager') {
    return redirect('/dashboard')
  }

  return <>{children}</>
}
