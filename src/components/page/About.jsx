'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { name, tagline } from '@/lib/database/secret'

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
    <section className="w-full bg-tertiary-light py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center"
        >
          {/* Header & Story Section */}
          <div className="lg:col-span-7 space-y-12">
            <motion.div variants={itemVariants} className='space-y-6'>
              <div className='flex items-center gap-4'>
                <div className='h-px w-8 bg-primary' />
                <span className='text-[10px] font-bold text-primary uppercase tracking-[0.4em]'>
                  Our Heritage
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-serif text-tertiary-dark leading-[0.9] tracking-tight">
                Crafting the <br />
                <span className="font-normal text-tertiary-dark/40">Perfect Moment</span>
              </h1>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-8 max-w-2xl">
              <p className="text-tertiary-dark/70 text-lg md:text-xl font-light leading-relaxed">
                {name} was born out of a passion for authentic flavors and a commitment to exceptional hospitality. Every great meal begins with a story. Ours started with a simple dream — to create a place where food feels like home.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                <p className="text-tertiary-dark/60 text-sm leading-relaxed">
                  We believe that great taste comes from honesty. That’s why we carefully select fresh ingredients, balance tradition with creativity, and cook every dish with attention and care.
                </p>
                <p className="text-tertiary-dark/60 text-sm leading-relaxed">
                  Our restaurant is more than just a place to eat — it’s a place to gather, celebrate, and slow down. We’re honored to be part of your everyday memories.
                </p>
              </div>
            </motion.div>

            {/* Philosophy Badge */}
            <motion.div 
              variants={itemVariants}
              className="pt-10 border-t border-tertiary-dark/10 flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center text-primary font-serif text-2xl uppercase">
                {name?.[0] || "G"}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary-dark/60 mb-1">Our Philosophy</p>
                <p className="text-lg font-serif text-tertiary-dark">
                  &ldquo;{tagline}&rdquo;
                </p>
              </div>
            </motion.div>
          </div>

          {/* Features Column */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-1 gap-8">
              {[
                { 
                  title: "Fresh Ingredients", 
                  desc: "Sourced daily from local organic farms to ensure the highest quality in every bite.",
                  icon: "01"
                },
                { 
                  title: "Expert Chefs", 
                  desc: "A culinary team bringing years of Michelin-standard passion to your table.",
                  icon: "02"
                },
                { 
                  title: "Minimalist Vibe", 
                  desc: "A warm, focused, and welcoming space designed for intimate celebrations.",
                  icon: "03"
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="group p-8 bg-tertiary-dark/5 rounded-2xl border border-tertiary-dark/10 transition-all duration-300 hover:bg-tertiary-light hover:shadow-2xl hover:shadow-tertiary-dark/10"
                >
                  <div className="flex items-start gap-6">
                    <span className="text-3xl font-serif text-primary/30 group-hover:text-primary transition-colors duration-500">
                      {feature.icon}
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-tertiary-dark uppercase tracking-widest">{feature.title}</h3>
                      <p className="text-tertiary-dark/60 text-xs leading-relaxed font-light">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Decorative background element */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 opacity-60" />
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default About