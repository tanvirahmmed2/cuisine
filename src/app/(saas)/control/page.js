import { redirect } from 'next/navigation';
import { getSession } from '@/lib/middleware';

export default async function ControlIndexPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.tenant_id) {
    redirect('/');
  }

  if (session.role === 'admin') {
    redirect('/control/admin');
  } else if (session.role === 'manager') {
    redirect('/control/manager');
  } else if (session.role === 'support') {
    redirect('/control/support');
  } else {
    redirect('/dashboard');
  }
}
