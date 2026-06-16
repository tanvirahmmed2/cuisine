'use client';
import { motion } from 'framer-motion';

const STEPS = [
  { num: '01', title: 'Create Account', desc: 'Sign up in 2 minutes. No credit card needed to start your 14-day free trial.' },
  { num: '02', title: 'Set Up Your Company', desc: 'Add your company name, logo, colors and connect your domain to get your branded website.' },
  { num: '03', title: 'Publish Your Menu Items', desc: 'Create restaurant listings with photos, menus, pricing and schedules. Go live instantly.' },
  { num: '04', title: 'Receive Reservations', desc: 'Customers book and pay directly. You get notified and can manage everything from your dashboard.' },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-bg-2" id="how-it-works">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col items-center gap-4 mb-20"
        >
          <div className="badge badge-primary">Simple setup</div>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] max-w-[700px] text-text">
            Get started in <span className="gradient-text">under 10 minutes</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 max-w-6xl mx-auto relative">
          {STEPS.map((step, i) => (
            <motion.div 
              key={step.num} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center relative px-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-base font-extrabold text-white mb-6 shrink-0 shadow-[0_4px_12px_rgba(99,102,241,0.3)] relative z-10">
                {step.num}
              </div>
              {i < STEPS.length - 1 && (
                <div className="absolute top-[28px] left-[calc(50%+28px)] right-[calc(-50%+28px)] h-[2px] bg-[linear-gradient(90deg,rgba(99,102,241,0.25),rgba(99,102,241,0.02))] hidden lg:block" />
              )}
              <div>
                <h3 className="text-base font-bold mb-2 text-text tracking-tight">{step.title}</h3>
                <p className="text-sm text-text-2 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}