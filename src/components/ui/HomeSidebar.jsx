import Link from 'next/link';

const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: 'https://cuisine-demo.disibin.com/', label: 'Demo' },
];

export default function HomeSidebar({ session, onClose }) {
  const handleLogout = async () => {
    try {
      const axios = (await import('axios')).default;
      await axios.post('/api/auth/logout');
      window.location.href = '/login';
    } catch (err) {
      window.location.href = '/login';
    }
  };

  return (
    <aside className="w-[280px] h-full bg-white flex flex-col shrink-0 shadow-2xl">
      <div className="p-6 border-b border-slate-200/80 bg-gradient-to-br from-pink-50 to-transparent flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 no-underline" onClick={onClose}>
          <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
            Cuisine
          </span>
        </Link>
        <button 
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        <nav className="p-4 flex flex-col gap-1">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 ml-2">Navigation</div>
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={onClose}
              className="flex items-center gap-3 py-3 px-3 rounded-xl text-[14px] font-semibold text-slate-600 transition-all duration-200 hover:bg-pink-50 hover:text-pink-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-slate-200/80 bg-slate-50/50">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 ml-2">Account</div>
          <div className="flex flex-col gap-2">
            {session ? (
              <>
                <Link 
                  href={session.tenant_id ? '/' : '/dashboard'} 
                  onClick={onClose}
                  className="btn-custom-primary text-center w-full shadow-sm"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/profile" 
                  onClick={onClose}
                  className="btn-custom-secondary text-center w-full"
                >
                  Profile Settings
                </Link>
                {['admin', 'manager', 'support'].includes(session.role) && !session.tenant_id && (
                  <Link 
                    href={`/control/${session.role}`} 
                    onClick={onClose}
                    className="btn-custom-secondary text-center w-full"
                  >
                    Control Panel
                  </Link>
                )}
                <button 
                  onClick={() => { handleLogout(); onClose(); }} 
                  className="w-full mt-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all text-center border border-red-100"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  onClick={onClose}
                  className="btn-custom-secondary text-center w-full"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  onClick={onClose}
                  className="btn-custom-primary text-center w-full shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
