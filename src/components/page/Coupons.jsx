'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { MdConfirmationNumber, MdContentCopy, MdCheck, MdAccessTime, MdShoppingBag } from 'react-icons/md'

const Coupons = ({ initialCoupons = [] }) => {
  const [coupons, setCoupons] = useState(initialCoupons)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copiedCode, setCopiedCode] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  const dragStartX = useRef(0)
  const dragDistance = useRef(0)
  const autoSlideTimer = useRef(null)

  useEffect(() => {
    if (!initialCoupons || initialCoupons.length === 0) {
      const fetchActiveCoupons = async () => {
        try {
          const res = await axios.get('/api/coupon?active=true')
          if (res.data.success && Array.isArray(res.data.payload)) {
            setCoupons(res.data.payload)
          }
        } catch (err) {
          // Fail silently on public banner
        }
      }
      fetchActiveCoupons()
    }
  }, [initialCoupons])

  const nextSlide = useCallback(() => {
    if (coupons.length <= 1) return
    setCurrentIndex((prev) => (prev + 1) % coupons.length)
  }, [coupons.length])

  const prevSlide = useCallback(() => {
    if (coupons.length <= 1) return
    setCurrentIndex((prev) => (prev - 1 + coupons.length) % coupons.length)
  }, [coupons.length])

  // Auto-slide effect every 4.5s
  useEffect(() => {
    if (coupons.length <= 1 || isDragging) return

    autoSlideTimer.current = setInterval(() => {
      nextSlide()
    }, 4500)

    return () => {
      if (autoSlideTimer.current) clearInterval(autoSlideTimer.current)
    }
  }, [coupons.length, nextSlide, isDragging, currentIndex])

  // Touch Handlers
  const handleTouchStart = (e) => {
    if (coupons.length <= 1) return
    dragStartX.current = e.touches[0].clientX
    dragDistance.current = 0
    setIsDragging(true)
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current)
  }

  const handleTouchMove = (e) => {
    if (!isDragging || coupons.length <= 1) return
    const currentX = e.touches[0].clientX
    const diff = currentX - dragStartX.current
    dragDistance.current = diff
    setDragOffset(diff)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    setDragOffset(0)

    const threshold = 40
    if (dragDistance.current < -threshold) {
      nextSlide()
    } else if (dragDistance.current > threshold) {
      prevSlide()
    }
  }

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    if (coupons.length <= 1) return
    dragStartX.current = e.clientX
    dragDistance.current = 0
    setIsDragging(true)
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || coupons.length <= 1) return
    const diff = e.clientX - dragStartX.current
    dragDistance.current = diff
    setDragOffset(diff)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    setDragOffset(0)

    const threshold = 40
    if (dragDistance.current < -threshold) {
      nextSlide()
    } else if (dragDistance.current > threshold) {
      prevSlide()
    }
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      setDragOffset(0)
    }
  }

  const handleCopyCode = (e, code) => {
    e.stopPropagation()
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Coupon code '${code}' copied!`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (!coupons || coupons.length === 0) {
    return null
  }

  const currentCoupon = coupons[currentIndex] || coupons[0]

  return (
    <section className="w-full select-none">
      <div
        className="w-full bg-secondary border border-tertiary-light/10 p-4 sm:p-6 relative overflow-hidden cursor-grab active:cursor-grabbing transition-all"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >

        <p className=' w-auto text-center uppercase font-semibold border-b my-2 text-tertiary-light text-3xl'>
            Coupons
        </p>
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 transition-transform duration-200 ease-out"
          style={{
            transform: isDragging ? `translateX(${dragOffset}px)` : 'translateX(0px)',
          }}
        >
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
            <div className="flex items-center gap-2">
              
              <h3 className="text-base sm:text-lg uppercase font-bold text-tertiary-light">
                {currentCoupon.title || 'Special Discount'}
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-tertiary-light/60 font-medium">
              <span className="flex items-center gap-1">
                <MdShoppingBag size={13} className="text-tertiary-light/40" />
                {Number(currentCoupon.min_bill) > 0
                  ? `Min bill ৳${Number(currentCoupon.min_bill).toLocaleString()}`
                  : 'No min bill'}
              </span>

              {currentCoupon.expires_at && (
                <span className="flex items-center gap-1">
                  <MdAccessTime size={13} className="text-tertiary-light/40" />
                  Expires {new Date(currentCoupon.expires_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center sm:text-right">
              <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                {currentCoupon.is_percentage
                  ? `${Number(currentCoupon.discount)}% OFF`
                  : `৳${Number(currentCoupon.discount).toLocaleString()} OFF`}
              </span>
            </div>

            {/* Click to Copy */}
            <button
              type="button"
              onClick={(e) => handleCopyCode(e, currentCoupon.code)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xs bg-tertiary-light/5 hover:bg-primary hover:text-tertiary-light text-tertiary-light transition-all border border-tertiary-light/10 cursor-pointer text-xs font-bold"
              title="Click to copy code"
            >
              <span className="font-mono tracking-wider">{currentCoupon.code}</span>
              {copiedCode === currentCoupon.code ? (
                <MdCheck size={16} className="text-emerald-600" />
              ) : (
                <MdContentCopy size={14} className="opacity-60" />
              )}
            </button>
          </div>
        </div>

        {coupons.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-tertiary-light/5">
            {coupons.map((_, idx) => (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-4 bg-primary' : 'w-1.5 bg-tertiary-light/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Coupons