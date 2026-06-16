import Link from 'next/link';

export const metadata = {
  title: 'Platform Features — Cuisine',
  description: 'Explore the powerful tools built specifically for restaurant owners. From restaurant management to payments and custom domains.',
};

const FEATURE_BLOCKS = [
  {
    icon: '🗺️',
    title: 'Menu & Catalog Builder',
    badge: 'Operations',
    desc: 'Design beautiful, media-rich menus for your menus. Set custom locations, base prices, duration in days, and manage daily activity schedules.',
    bullets: [
      'Multi-day itinerary planner',
      'Location tagging & directions',
      'Rich text descriptions & photo gallery',
      'Draft and active publication state controls'
    ]
  },
  {
    icon: '📅',
    title: 'Schedule & Seat Inventory',
    badge: 'Reservations',
    desc: 'Manage restaurant dates with real-time table tracking. Set maximum capacities, early bird registration cutoffs, and watch availability adjust automatically.',
    bullets: [
      'Recurring date scheduler',
      'Automated seat count adjustments',
      'Registration deadlines',
      'Oversold protection constraints'
    ]
  },
  {
    icon: '💳',
    title: 'Multi-Gateway Payment Engine',
    badge: 'Payments',
    desc: 'Accept payments globally and locally. Fully integrated with international card systems like Stripe, and regional favorites like bKash, Nagad, and SSLCommerz.',
    bullets: [
      'Instant payment verification hooks',
      'Automatic billing receipt dispatch',
      'Refund and cancellation tracking',
      'SaaS platform invoice tracking'
    ]
  },
  {
    icon: '👥',
    title: 'Customer Relationship CRM',
    badge: 'Customers',
    desc: 'Understand who is reservation your menus. Maintain full customer history, profile directories, lifetime value statistics, and reservation references in a single database.',
    bullets: [
      'Comprehensive customer directory',
      'Reservation history logs',
      'Lifetime value metrics',
      'Customer contact profiles'
    ]
  },
  {
    icon: '📈',
    title: 'Advanced Analytics Dashboard',
    badge: 'Finances',
    desc: 'Monitor reservation velocity, revenue curves, and performance. Generate graphs and breakdowns to optimize pricing, capacity, and marketing budgets.',
    bullets: [
      'Daily reservation rate charts',
      'Monthly recurring revenue (MRR)',
      'Most popular menus analytics',
      'SaaS-wide and tenant-specific reports'
    ]
  },
  {
    icon: '🌐',
    title: 'Custom Domains & Branding',
    badge: 'White-Label',
    desc: 'Serve clients from your own domain name (e.g. menus.yourcompany.com) instead of a shared URL. Your brand remains front and center.',
    bullets: [
      'Automatic SSL generation and renewal',
      'Dynamic tenant branding layouts',
      'Custom logo and favicon support',
      'Zero-configuration setup'
    ]
  }
];

export default function FeaturesPage() {
  return (
    <div className="relative overflow-hidden pb-20">
      <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />

      {/* Header */}
      <section className="py-16">
        <div className="container relative z-10">
          <div className="text-center flex flex-col items-center gap-4">
            <div className="badge badge-primary">Deep Dive</div>
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-text">
              Every tool you need to run <span className="gradient-text">your restaurant business</span>
            </h1>
            <p className="text-base text-text-2 max-w-[560px] leading-relaxed">
              Built by hospitality industry veterans, Cuisine consolidates all your tools into one cohesive, cloud-based platform.
            </p>
          </div>
        </div>
      </section>

      {/* Features Detail Blocks */}
      <section className="pb-20">
        <div className="container relative z-10">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            {FEATURE_BLOCKS.map((f) => (
              <div key={f.title} className="bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col gap-6 shadow-sm shadow-slate-100/50 hover:border-slate-350 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-4xl filter drop-shadow-[0_4px_8px_rgba(99,102,241,0.08)]">{f.icon}</span>
                  <span className="badge badge-primary">{f.badge}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3 text-text tracking-tight">{f.title}</h3>
                  <p className="text-text-2 text-xs leading-relaxed mb-6">{f.desc}</p>
                </div>
                <div className="w-full h-px bg-slate-100" />
                <ul className="list-none flex flex-col gap-2.5 m-0 p-0">
                  {f.bullets.map((b) => (
                    <li key={b} className="text-text-2 text-xs flex items-start gap-2">
                      <span className="text-primary font-bold">✦</span> 
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive CTA */}
      <section className="relative py-28 overflow-hidden border-t border-slate-200/80">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="container relative z-10">
          <div className="text-center flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-tight leading-[1.1] text-text">Experience the power of Cuisine</h2>
            <p className="text-base text-text-2 leading-relaxed max-w-[500px] mt-2">See why restaurant owners are moving away from manual operations. Try it free.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
              <Link href="/pricing" className="px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-text-2 hover:text-text font-bold text-sm hover:bg-slate-5 transition-all duration-300 shadow-sm shadow-slate-100">View Plans & Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
