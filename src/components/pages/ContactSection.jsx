'use client';
import { motion } from 'framer-motion';
import { ContactForm } from '@/components/forms/ContactForm';
import { BASE_URL } from '@/lib/secret';

export default function ContactSection() {
  return (
    <section className="py-24" id="contact">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge badge-primary mb-4">Get in touch</div>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight leading-[1.15] text-left text-text">
              Have questions? <br/><span className="gradient-text">We'd love to help.</span>
            </h2>
            <p className="text-base text-text-2 leading-relaxed text-left mt-4 mb-8">
              Whether you need a custom enterprise plan, have technical questions, or just want to say hi, our team is ready to assist you.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl">📧</div>
                <div>
                  <div className="font-bold text-text">Email us</div>
                  <div className="text-text-2 text-sm">support@disibin.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl">💬</div>
                <div>
                  <div className="font-bold text-text">Live Chat</div>
                  <div className="text-text-2 text-sm">Available 24/7 inside the dashboard</div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
