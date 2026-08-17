'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose, MdLocalOffer, MdTimer } from 'react-icons/md'
import Link from 'next/link'

const OfferPopup = ({ initialOffers = [] }) => {
  const [offers, setOffers] = useState(initialOffers)
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (offers.length > 0) {
      setTimeout(() => {
        setIsOpen(true)
      }, 1500)
    }
  }, [offers])

  // Auto-slider logic
  useEffect(() => {
    if (!isOpen || offers.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isOpen, offers.length])

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!isOpen || offers.length === 0) return null

  const currentOffer = offers[currentIndex]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-tertiary-dark/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-tertiary-light w-full max-w-sm md:max-w-md rounded-none shadow-2xl relative overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 bg-tertiary-light/80 backdrop-blur-md rounded-full text-tertiary-dark/60 hover:text-primary hover:bg-tertiary-light shadow-sm transition-colors"
            >
              <MdClose size={20} />
            </button>

            {/* Slider Container */}
            <div className="relative w-full aspect-video md:h-56 bg-tertiary-dark/5 overflow-hidden shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentOffer.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image 
                    src={currentOffer.image} 
                    alt={currentOffer.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={true}
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tertiary-dark/80 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

           
              {offers.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                  {offers.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-6' : 'bg-tertiary-light/50 hover:bg-tertiary-light'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-2 flex flex-col gap-4 relative bg-tertiary-light flex-1 overflow-y-auto">
              <div className="absolute -top-6 right-8 w-12 h-12 bg-primary text-tertiary-light rounded-2xl shadow-xl flex items-center justify-center rotate-6 shrink-0">
                <MdLocalOffer size={24} />
              </div>

              <div className="space-y-2 pr-8">
                <p className="text-[10px] font-black uppercase text-primary tracking-widest">Special Offer</p>
                <h3 className="text-2xl md:text-3xl font-black text-tertiary-dark leading-tight">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentOffer.id + "-title"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {currentOffer.title}
                    </motion.span>
                  </AnimatePresence>
                </h3>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentOffer.id + "-desc"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="prose prose-sm max-w-none line-clamp-3 text-tertiary-dark/60"
                  dangerouslySetInnerHTML={{ __html: currentOffer.description }}
                />
              </AnimatePresence>

              {currentOffer.end_date && (
                <div className="bg-primary/10 text-primary px-4 py-2 text-xs font-bold self-start flex items-center gap-2">
                  <MdTimer size={16} className="animate-pulse" />
                  Valid until: {new Date(currentOffer.end_date).toLocaleDateString()}
                </div>
              )}

             
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default OfferPopup
