import Link from 'next/link';
import { PricingCards } from '@/components/card/PricingCards';

export const metadata = {
  title: 'Pricing Plans — Cuisine',
  description: 'Plans that grow with your business. Start free for 14 days, no credit card required.',
};

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden pb-24">
      <div className="absolute top-[10%] left-[15%] w-150 h-150 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />

      {/* Header */}
      <section className="py-16 pb-8">
        <div className="container relative z-10">
          <div className="text-center flex flex-col items-center gap-4">
            <div className="badge badge-primary">Website Plans</div>
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-175 text-text">
              Simple, transparent <span className="gradient-text">pricing</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-8 pb-16">
        <div className="container relative z-10">
          <PricingCards showDescriptions={true} />
        </div>
      </section>

      {/* Custom Solution CTA */}
      <section className="py-16 border-t border-slate-200/60 bg-gradient-to-b from-white to-slate-50">
        <div className="container relative z-10 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-2xl mb-6 shadow-sm border border-pink-200/50">
            💬
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Need a custom solution?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
            Looking for a custom-built package or a fully tailored website? Talk to our support team to get a quote that fits your exact requirements.
          </p>
          <Link href="/contact" className="btn-custom-primary text-base px-8 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Talk with Support
          </Link>
        </div>
      </section>
    </div>
  );
}
