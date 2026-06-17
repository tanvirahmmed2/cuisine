'use client'
import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { Context } from '../context/Context'

const About = () => {
  const { siteData } = useContext(Context)

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
    <section className="w-full bg-white py-32 overflow-hidden">
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
                <div className='h-px w-8 bg-pink-500' />
                <span className='text-[10px] font-bold text-pink-600 uppercase tracking-[0.4em]'>
                  Our Heritage
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-serif text-gray-900 leading-[0.9] tracking-tight">
                Crafting the <br />
                <span className="italic font-normal text-gray-400">Perfect Moment</span>
              </h1>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-8 max-w-2xl">
              <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed">
                {siteData?.name || "Grand Kitchen"} was born out of a passion for authentic flavors and a commitment to exceptional hospitality. Every great meal begins with a story. Ours started with a simple dream — to create a place where food feels like home.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                <p className="text-gray-500 text-sm leading-relaxed">
                  We believe that great taste comes from honesty. That’s why we carefully select fresh ingredients, balance tradition with creativity, and cook every dish with attention and care.
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Our restaurant is more than just a place to eat — it’s a place to gather, celebrate, and slow down. We’re honored to be part of your everyday memories.
                </p>
              </div>
            </motion.div>

            {/* Philosophy Badge */}
            <motion.div 
              variants={itemVariants}
              className="pt-10 border-t border-gray-100 flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full border border-pink-100 flex items-center justify-center text-pink-500 font-serif italic text-2xl">
                S
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Our Philosophy</p>
                <p className="text-lg font-serif italic text-gray-900">"Simplicity is the ultimate sophistication."</p>
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
                  className="group p-8 bg-[#fafafa] rounded-2xl border border-gray-50 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50"
                >
                  <div className="flex items-start gap-6">
                    <span className="text-3xl font-serif italic text-pink-100 group-hover:text-pink-500 transition-colors duration-500">
                      {feature.icon}
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{feature.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed font-light">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Decorative background element */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-50 rounded-full blur-3xl -z-10 opacity-60" />
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default About