import Link from 'next/link';
import { TrustStats } from '@/components/card/TrustStats';

export const metadata = {
  title: 'Our Mission & Story — Cuisine',
  description: 'Learn about Cuisine, the modern platform designed to simplify operations, automate reservations, and accelerate growth for restaurants globally.',
};

const PILLARS = [
  { icon: '🚀', title: 'Empowering Local Operators', desc: 'We believe premium reservation tech shouldn’t be locked behind enterprise budgets. We give small-to-medium operators the same capabilities as massive dining conglomerates.' },
  { icon: '🔒', title: 'Data Isolation & Trust', desc: 'Your business database is strictly yours. Cuisine leverages isolated multi-tenant architecture to guarantee that customer CRM, payment logs, and reservation metrics are 100% private.' },
  { icon: '🔌', title: 'Modern Integration Architecture', desc: 'No complex coding required. Easily hook up domain names, payment gateways (Stripe, bKash, SSLCommerz), and trigger automatic notifications.' },
  { icon: '❤️', title: 'Built with Operators', desc: 'Every iteration is developed side-by-side with real restaurant managers, waitstaff, and support staff, ensuring we build what you actually need daily.' }
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden pb-20">
      <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />

      {/* Hero / Header */}
      <section className="py-16">
        <div className="container relative z-10">
          <div className="text-center flex flex-col items-center gap-4">
            <div className="badge badge-primary font-semibold">Our Mission</div>
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-text">
              Simplifying tourism operations <span className="gradient-text">for everyone</span>
            </h1>
            <p className="text-base text-text-2 max-w-[560px] leading-relaxed">
              Cuisine was founded to solve a major problem: why is restaurant software so bloated and outdated? We built a lightweight, modern, multi-tenant platform to give operators their time back.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Story Content */}
      <section className="py-8 pb-16">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="font-bold text-3xl mb-6 text-text tracking-tight">
                Why we built Cuisine
              </h2>
              <p className="text-text-2 leading-relaxed mb-6 text-sm md:text-base">
                Most boutique restaurants manage reservations using a chaotic mix of WhatsApp groups, Excel sheets, and handwritten journals. Payments are checked manually, reservations are lost, and clients wait hours for email replies.
              </p>
              <p className="text-text-2 leading-relaxed mb-8 text-sm md:text-base">
                Cuisine changes all of this by acting as your digital operations manager. We automate the reservation engine, verify payments instantly, organize customer CRM logs, and build beautiful public reservation websites automatically.
              </p>
              <div className="flex gap-4 mt-6">
                <Link href="/contact" className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-text-2 font-bold text-sm hover:bg-slate-5 transition-all duration-300">Contact Us</Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {PILLARS.map((p) => (
                <div key={p.title} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm shadow-slate-100/50 hover:border-slate-350 transition-colors">
                  <div className="text-3xl mb-3 filter drop-shadow-[0_4px_8px_rgba(99,102,241,0.08)]">{p.icon}</div>
                  <h4 className="font-bold mb-2 text-text text-sm tracking-tight">{p.title}</h4>
                  <p className="text-xs text-text-2 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Footprint Stats */}
      <section className="py-16 border-y border-slate-200/80 bg-bg-2">
        <div className="container relative z-10">
          <TrustStats />
        </div>
      </section>
    </div>
  );
}
