import Link from 'next/link';
import { redirectIfAuthenticated } from '@/lib/middleware';

export default async function AuthLayout({ children }) {
  await redirectIfAuthenticated();
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-[radial-gradient(circle,rgba(14,165,233,0.12)_0%,transparent_60%)] pointer-events-none z-0" />
      <div className="relative z-10 w-full max-w-110 bg-white border border-slate-200 rounded-2xl p-10 sm:p-12 shadow-xl shadow-slate-200/50">
        <div className="text-center mb-10 flex justify-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900 no-underline tracking-tight">
            Cuisine
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
