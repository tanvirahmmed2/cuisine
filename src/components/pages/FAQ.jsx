'use client';
import { motion } from 'framer-motion';

const FAQS = [
  { q: 'Can I use my own domain?', a: 'Yes. Every plan lets you connect your own domain (e.g. menus.yourcompany.com). We handle SSL and DNS automatically.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. No long-term contracts. You can cancel your subscription at any time from your account settings.' },
  { q: 'Do you support online payments?', a: 'Yes. We integrate with Stripe, bKash, Nagad and SSLCommerz so your customers can pay however they prefer.' },
  { q: 'How many staff can I add?', a: 'Depends on your plan — Starter supports 3, Growth supports 10, Business supports 25 staff members with role-based access.' },
  { q: 'Is my data secure?', a: 'All data is encrypted in transit and at rest. Each restaurant\'s data is fully isolated from other tenants.' },
];

export default function FAQSection() {
  return (
    <section className="py-24 bg-bg-2" id="faq">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col items-center gap-4 mb-16"
        >
          <div className="badge badge-primary">Got questions?</div>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-text">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {FAQS.map((faq, i) => (
            <motion.div 
              key={faq.q} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-7 transition-all duration-300 hover:border-slate-300 shadow-sm shadow-slate-100/50"
            >
              <h4 className="text-base font-bold text-text mb-3 tracking-tight">{faq.q}</h4>
              <p className="text-sm text-text-2 leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}