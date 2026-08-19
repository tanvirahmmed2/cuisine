'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose } from 'react-icons/md'
import Link from 'next/link'

const OfferPopup = ({ initialOffers = [] }) => {
  const [offers, setOffers] = useState(initialOffers)
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (offers.length > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [offers])

  // Auto-slider for multiple offers
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
            className="absolute inset-0 bg-black/60"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-sm sm:max-w-md bg-white border border-gray-200 shadow-2xl flex flex-col z-10 rounded-xs overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            
            {currentOffer.image && (
              <div className="relative w-full h-48 sm:h-52 bg-gray-100 shrink-0">
                <Image
                  src={currentOffer.image}
                  alt={currentOffer.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority={true}
                  className="object-cover"
                />

                {offers.length > 1 && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                    {offers.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1 transition-all ${
                          idx === currentIndex ? 'w-5 bg-white' : 'w-2 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Offer Details */}
            <div className="p-5 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-pink-600">
                Special Offer
              </span>

              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {currentOffer.title}
              </h3>

              {currentOffer.description && (
                <div
                  className="text-xs text-gray-600 leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: currentOffer.description }}
                />
              )}

              {currentOffer.end_date && (
                <p className="text-[11px] text-gray-500 font-medium pt-1">
                  Valid until: {new Date(currentOffer.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 mt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                >
                  Close
                </button>
                <Link
                  href="/menu"
                  onClick={handleClose}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                >
                  View Menu
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default OfferPopup
