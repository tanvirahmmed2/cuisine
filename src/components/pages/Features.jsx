'use client';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon: '🗺️', title: 'Restaurant Management', desc: 'Create, publish and manage menus with rich menus, images, pricing tiers and availability windows.' },
  { icon: '📋', title: 'Reservation System', desc: 'Accept reservations online with real-time seat availability, automatic confirmations and cancellation handling.' },
  { icon: '👥', title: 'Customer CRM', desc: 'Track customers, their reservation history, lifetime value and preferences in one place.' },
  { icon: '💳', title: 'Online Payments', desc: 'Accept Stripe, bKash, Nagad and SSLCommerz. Full payment lifecycle from invoice to receipt.' },
  { icon: '📊', title: 'Analytics', desc: 'Revenue charts, reservation trends, top menus, customer sources — everything you need to make better decisions.' },
  { icon: '🌐', title: 'Custom Domains', desc: 'Give each restaurant their own branded website at their own domain with zero extra config.' },
];

export default function FeaturesSection() {
  return (
    <section className="py-24" id="features">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col items-center gap-4 mb-16"
        >
          <div className="badge badge-primary">Everything you need</div>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-slate-900">
            All the tools your restaurant needs, <span className="gradient-text">in one place</span>
          </h2>
          <p className="text-base text-slate-600 max-w-[560px] leading-relaxed mt-2">
            Stop juggling spreadsheets, WhatsApp groups and cash ledgers. Cuisine replaces them all.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {FEATURES.map((f, index) => (
            <motion.div 
              key={f.title} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative border border-slate-200 rounded-2xl p-8 flex flex-col gap-4 bg-white shadow-sm hover:shadow-md hover:border-pink-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-50 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-4xl filter drop-shadow-sm">{f.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-2">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-[1.7]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}