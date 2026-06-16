import Link from 'next/link';

const LINKS = {
  Product: [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'Solutions' },
    { href: '/blog', label: 'Blog' },
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Updates' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50 pt-24 pb-12 relative overflow-hidden w-full px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(14,165,233,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6 max-w-sm">
            <Link href="/" className="flex items-center gap-2.5 no-underline group">
              <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">T</div>
                Cuisine
              </span>
            </Link>
            <p className="text-sm text-text-2 leading-relaxed">
              The all-in-one platform for modern restaurants. Manage reservations, staff, and payments from one powerful dashboard.
            </p>
            <div className="flex gap-4">
              <Link href="https://disibin.com" target="_blank" rel="noreferrer" aria-label="Website" className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-pink-50 shadow-sm transition-all duration-300">W</Link>
              <Link href="https://facebook.com/disibin" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-pink-50 shadow-sm transition-all duration-300">fb</Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-10">
            {Object.entries(LINKS).map(([group, links]) => (
              <div key={group} className="flex flex-col gap-5 min-w-[140px]">
                <h4 className="text-xs font-bold text-text-3 uppercase tracking-wider">{group}</h4>
                <ul className="flex flex-col gap-3.5 list-none p-0 m-0">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="group relative text-sm font-medium text-slate-500 hover:text-slate-900 inline-block transition-all duration-300">
                        {l.label}
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full rounded-t-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-200/80">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Cuisine. All rights reserved.
          </p>
          <Link href={'https://disibin.com'}  className="text-slate-500 text-sm">
            A product of Disibin
          </Link>
        </div>
      </div>
    </footer>
  );
}
