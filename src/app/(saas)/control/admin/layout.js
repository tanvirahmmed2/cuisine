import Link from 'next/link';
import { isAdmin } from '@/lib/middleware';
import { redirect } from 'next/navigation';
import ClientDashboardLayout from '@/components/dashboard/ClientDashboardLayout';

export default async function OwnerLayout({ children }) {
  const auth = await isAdmin();
  if (!auth.success) redirect('/login');
  const session = auth.data;

  return (
    <ClientDashboardLayout session={session} panelType="admin" title="SaaS Control Panel">
      {children}
    </ClientDashboardLayout>
  );
}
