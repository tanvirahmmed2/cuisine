'use client';
import { motion } from 'framer-motion';
import { TrustStats } from '@/components/card/TrustStats';

export default function TrustSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="border-y border-slate-200/80 bg-bg-2 py-16"
    >
      <div className="container">
        <TrustStats />
      </div>
    </motion.section>
  );
}
