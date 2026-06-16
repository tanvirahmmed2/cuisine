'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BASE_URL } from '@/lib/secret';

export default function Hero() {
  return (
    <section className="relative pt-10 pb-[120px] overflow-hidden min-h-[100vh] flex items-center  md:pb-[100px]">
     
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-[840px] mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="badge badge-primary mb-8"
          >
            ✦ Trusted by 100+ restaurants
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[clamp(2.75rem,6.5vw,5rem)] font-extrabold leading-[1.05] tracking-tight mb-8 text-slate-900"
          >
            Restaurant Management Software<br />
            for <span className="gradient-text">Modern Restaurants and Cafe</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 leading-relaxed mb-12 max-w-[620px]"
          >
            Manage Menu Items, Reservations, Customers, and Payments from one powerful dashboard.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Link href="/pricing" className="btn-custom-primary !px-8 !py-4 text-base">
              View Packages
              <span className="absolute inset-0 bg-white/20 w-full h-full -skew-x-12 -translate-x-full group-hover:animate-shimmer transition-all" />
            </Link>
            <Link href="/features" className="btn-custom-secondary !px-8 !py-4 text-base">
              See all Features →
            </Link>
          </motion.div>
        </div>

       
      </div>
    </section>
  );
}