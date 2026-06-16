'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PricingCards } from '@/components/card/PricingCards';

export default function PricingSection() {
  return (
    <section className="py-24" id="pricing">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col items-center gap-4 mb-16"
        >
          <div className="badge badge-primary">Simple pricing</div>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-slate-900">
            Plans that grow <span className="gradient-text">with your business</span>
          </h2>
          <p className="text-base text-slate-600 max-w-[560px] leading-relaxed">Choose a package that fits your needs.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PricingCards showDescriptions={true} />
          <p className="text-center text-text-3 text-sm mt-8">
            <Link href="/pricing" className="text-primary hover:text-primary-dark transition-colors font-semibold">Compare full features →</Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
