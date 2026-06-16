import { isSupport } from '@/lib/middleware';
import { redirect } from 'next/navigation';
import ClientDashboardLayout from '@/components/dashboard/ClientDashboardLayout';

export default async function SupportLayout({ children }) {
  const auth = await isSupport();
  if (!auth.success) redirect('/login');
  const session = auth.data;

  return (
    <ClientDashboardLayout session={session} panelType="support" title="Support Agent Panel">
      {children}
    </ClientDashboardLayout>
  );
}
