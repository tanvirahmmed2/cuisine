import { isLogin } from '@/lib/middleware';
import { redirect } from 'next/navigation';
import ClientDashboardLayout from '@/components/dashboard/ClientDashboardLayout';

export default async function CustomerDashboardLayout({ children }) {
  const auth = await isLogin();
  if (!auth.success) redirect('/login');
  const session = auth.data;


  return (
    <ClientDashboardLayout session={session} panelType="customer">
      {children}
    </ClientDashboardLayout>
  );
}
