import Link from 'next/link';
import LogoutButton from './LogoutButton';

const PANELS = {
  admin: {
    badgeText: 'Admin',
    panelName: 'Admin Panel',
    navLinks: [
      {
        section: 'Overview',
        links: [
          { href: '/control/admin', label: 'Dashboard', icon: '🏠' },
          { href: '/control/admin/analytics', label: 'Analytics', icon: '📊' },
        ],
      },
      {
        section: 'SaaS Management',
        links: [
          { href: '/control/admin/tenants', label: 'Tenants', icon: '🏢' },
          { href: '/control/admin/users', label: 'Users', icon: '👥' },
          { href: '/control/admin/packages', label: 'Packages', icon: '📦' },
          { href: '/control/admin/subscriptions', label: 'Subscriptions', icon: '🔄' },
          { href: '/control/admin/payments', label: 'Payments', icon: '💰' },
        ],
      },
      {
        section: 'Support',
        links: [
          { href: '/control/admin/support', label: 'Support Tickets', icon: '🎫' },
        ],
      },
    ]
  },
  manager: {
    badgeText: 'Manager',
    panelName: 'Manager Panel',
    navLinks: [
      {
        section: 'Overview',
        links: [
          { href: '/control/manager', label: 'Dashboard', icon: '🏠' },
          { href: '/control/manager/analytics', label: 'Analytics', icon: '📊' },
        ],
      },
      {
        section: 'SaaS Management',
        links: [
          { href: '/control/manager/tenants', label: 'Tenants', icon: '🏢' },
          { href: '/control/manager/packages', label: 'Packages', icon: '📦' },
          { href: '/control/manager/purchases', label: 'Purchases', icon: '🛒' },
        ],
      },
      {
        section: 'Support',
        links: [
          { href: '/control/manager/support', label: 'Support Tickets', icon: '🎫' },
          { href: '/control/manager/contact', label: 'Contact Messages', icon: '📨' },
          { href: '/control/manager/reviews', label: 'Reviews', icon: '⭐' },
        ],
      },
    ]
  },
  support: {
    badgeText: 'Support',
    panelName: 'Support Panel',
    navLinks: [
      {
        section: 'Dashboard',
        links: [
          { href: '/control/support', label: 'Support Tickets', icon: '🎫' },
          { href: '/control/support/contact', label: 'Contact Messages', icon: '📨' },
        ],
      },
    ]
  },
  customer: {
    badgeText: 'SaaS Account',
    panelName: 'Customer Panel',
    navLinks: [
      {
        section: 'Overview',
        links: [
          { href: '/dashboard', label: 'Workspaces', icon: '🏢' },
          { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: '🔄' },
          { href: '/dashboard/billing', label: 'Billing & Invoices', icon: '💳' },
        ],
      },
      {
        section: 'Account',
        links: [
          { href: '/dashboard/profile', label: 'Profile Settings', icon: '⚙️' },
          { href: '/dashboard/support', label: 'Support Tickets', icon: '🎫' },
          { href: '/dashboard/reviews', label: 'Platform Review', icon: '⭐' },
        ],
      }
    ]
  }
};

export default function Sidebar({ session, panelType, onClose }) {
  const panel = PANELS[panelType] || PANELS.customer;

  return (
    <aside className="w-[260px] bg-white border-r border-slate-200/80 flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-200/80 bg-gradient-to-br from-pink-50 to-transparent flex justify-between items-start">
        <div>
          <Link href="/" className="flex items-center gap-2 no-underline group mb-1">
            <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
              Cuisine
            </span>
          </Link>
          <div className="text-[10px] text-slate-500 font-semibold mt-1">{panel.panelName}</div>
        </div>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-1 -mr-2 -mt-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="py-5 px-3 flex flex-col gap-2 flex-1 overflow-y-auto">
        {panel.navLinks.map((groupOrLink, i) => {
          // If it has a 'section' property, it's a group of links
          if (groupOrLink.section) {
            return (
              <div key={groupOrLink.section} className="flex flex-col gap-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-3 mb-1.5 ml-2.5">
                  {groupOrLink.section}
                </div>
                {groupOrLink.links.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-[13px] font-semibold text-slate-600 transition-all duration-200 no-underline hover:bg-pink-50 hover:text-pink-700"
                  >
                    <span className="text-base w-5 text-center shrink-0 filter drop-shadow-sm">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            );
          }
          // Otherwise it's a direct link
          return (
            <Link 
              key={groupOrLink.href} 
              href={groupOrLink.href} 
              className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-[13px] font-semibold text-slate-600 transition-all duration-200 no-underline hover:bg-pink-50 hover:text-pink-700"
            >
              <span className="text-base w-5 text-center shrink-0 filter drop-shadow-sm">{groupOrLink.icon}</span>
              <span>{groupOrLink.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200/80 bg-gradient-to-t from-pink-50/30 to-transparent">
        <div className="flex items-center gap-3 mb-4 pl-1">
          <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm">
            {session?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 leading-none truncate max-w-[150px]">{session?.name || 'User'}</div>
            <div className="text-[9px] text-pink-600 font-bold tracking-wider uppercase mt-1">{panel.badgeText || 'Account'}</div>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
