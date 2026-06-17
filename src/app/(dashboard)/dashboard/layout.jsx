import DashboardLayoutWrapper from "@/components/layout/DashboardLayoutWrapper"
import { isLogin } from "@/lib/auth/middleware"
import { redirect } from "next/navigation"

export const metadata = {
  title: 'Dashboard | Management',
  description: 'Restaurant Management System'
}

const DashboardLayout = async ({ children }) => {
  const auth = await isLogin()
  
  if (!auth.success) {
    return redirect('/login')
  }

  const user = auth.payload
  const staffRoles = ['admin', 'manager', 'sales']
  
  if (!staffRoles.includes(user.role)) {
    return redirect('/')
  }

  return (
    <DashboardLayoutWrapper>
      {children}
    </DashboardLayoutWrapper>
  )
}

export default DashboardLayout
