'use client';
import { motion } from 'framer-motion';
import { TestimonialCards } from '@/components/card/TestimonialCards';

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-bg-2" id="testimonials">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col items-center gap-4 mb-16"
        >
          <div className="badge badge-primary">Customer stories</div>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-slate-900">
            Guests <span className="gradient-text">love our menus</span>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TestimonialCards />
        </motion.div>
      </div>
    </section>
  );
}