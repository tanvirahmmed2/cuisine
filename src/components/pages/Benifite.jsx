'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const BENEFITS = [
  { icon: '⏱️', title: 'Save 10+ hours/week', desc: 'Automate reservation confirmations, reminders, and payment receipts. No more manual follow-ups.' },
  { icon: '📈', title: 'Increase Revenue', desc: 'Online reservations convert 3× better than phone/email. Accept payments 24/7, even while you sleep.' },
  { icon: '🔒', title: 'Reduce Errors', desc: 'No more double reservations, lost deposits or missed payments. Everything is tracked automatically.' },
  { icon: '🎯', title: 'Centralized Control', desc: 'One dashboard for all your menus, staff, customers, and finances. The complete picture, always.' },
];

export default function BenefitsSection() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge badge-primary mb-4">Why Cuisine</div>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] text-left text-text">
              Built for restaurant owners who want to <span className="gradient-text">grow faster</span>
            </h2>
            <p className="text-base text-text-2 leading-relaxed text-left mt-4 mb-8">
              Every feature exists because real restaurants asked for it. No bloat, no fluff.
            </p>
            <Link href="/pricing" className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all duration-300 hover:shadow-[0_4px_15px_rgba(79,70,229,0.25)] active:scale-[0.98] inline-block">
              View Packages →
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm shadow-slate-100/50"
          >
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-4 items-start">
                <div className="text-2xl w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0">{b.icon}</div>
                <div>
                  <h4 className="text-base font-bold text-text mb-1 tracking-tight">{b.title}</h4>
                  <p className="text-sm text-text-2 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}