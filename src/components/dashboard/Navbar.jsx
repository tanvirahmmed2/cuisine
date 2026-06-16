'use client';

import { usePathname } from 'next/navigation';

export default function Navbar({ title = "Dashboard", onOpenSidebar }) {
  const pathname = usePathname();
  
  const pathParts = pathname.split('/').filter(Boolean);
  const formattedTitle = pathParts.length > 0 
    ? pathParts.map(part => part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' ')).join(' / ')
    : title;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-8 shrink-0 relative z-10">
      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 -ml-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{formattedTitle}</span>
      </div>
    </header>
  );
}
