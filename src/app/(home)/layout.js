import ClientHomeLayout from '@/components/ui/ClientHomeLayout';
import { getSession } from '@/lib/middleware';

export default async function MarketingLayout({ children }) {
  const session = await getSession();

  return (
    <ClientHomeLayout session={session}>
      {children}
    </ClientHomeLayout>
  );
}
