import Link from 'next/link';
import { isManager } from '@/lib/middleware';
import { redirect } from 'next/navigation';
import ClientDashboardLayout from '@/components/dashboard/ClientDashboardLayout';

export default async function ManagerLayout({ children }) {
  const auth = await isManager();
  if (!auth.success) redirect('/login');
  const session = auth.data;

  return (
    <ClientDashboardLayout session={session} panelType="manager" title="Manager Dashboard">
      {children}
    </ClientDashboardLayout>
  );
}
