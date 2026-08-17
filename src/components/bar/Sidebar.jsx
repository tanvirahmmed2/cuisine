'use client'
import Link from 'next/link'
import React, { useContext, useEffect } from 'react'
import Logout from '../buttons/Logout'
import { Context } from '../context/Context'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { MdClose, MdHome, MdRestaurantMenu, MdSupportAgent, MdEvent, MdShoppingCart, MdPerson, MdLogin, MdLocalOffer } from 'react-icons/md'

import { name, tagline } from '@/lib/database/secret'

const Sidebar = () => {
    const { mobileSidebar, setMobileSidebar, cartBar, setCartBar, userData } = useContext(Context)
    const pathname = usePathname()

    useEffect(() => {
        if (mobileSidebar) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [mobileSidebar])

    const handleGotoCart = () => {
        setCartBar(!cartBar)
        setMobileSidebar(false)
    }

    const navLinks = [
        { name: 'Home', href: '/', icon: <MdHome /> },
        { name: 'Menu', href: '/menu', icon: <MdRestaurantMenu /> },
        { name: 'Flash Sale', href: '/flashsale', icon: <MdLocalOffer /> },
        { name: 'Reservation', href: '/reservation', icon: <MdEvent /> },
        { name: 'Support', href: '/support', icon: <MdSupportAgent /> },
    ]

    return (
        <AnimatePresence>
            {mobileSidebar && (
                <>
                    {/* Simple Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileSidebar(false)}
                        className="fixed inset-0 bg-tertiary-dark/20 backdrop-blur-[2px] z-[60] md:hidden"
                    />

                    {/* Simple Slide-out Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 left-0 h-full w-64 bg-tertiary-light z-[70] shadow-xl flex flex-col md:hidden"
                    >
                        <div className="p-5 flex items-center justify-between border-b border-tertiary-dark/10">
                            <div>
                                <span className="font-bold text-lg text-primary font-serif">{name}</span>
                                <p className="text-[10px] text-tertiary-dark/60 font-light line-clamp-1 leading-tight">{tagline}</p>
                            </div>
                            <button 
                                onClick={() => setMobileSidebar(false)}
                                className="p-2 hover:bg-tertiary-dark/5 rounded-full transition-colors shrink-0"
                                aria-label="Close sidebar"
                            >
                                <MdClose size={20} className="text-tertiary-dark/60" />
                            </button>
                        </div>

                        <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileSidebar(false)}
                                        className={`flex items-center gap-3 px-6 py-3 transition-all font-medium ${
                                            isActive
                                                ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary'
                                                : 'text-tertiary-dark/70 hover:bg-primary/10 hover:text-primary'
                                        }`}
                                    >
                                        <span className="text-lg opacity-70">{link.icon}</span>
                                        {link.name}
                                    </Link>
                                )
                            })}

                            <button
                                onClick={handleGotoCart}
                                className="flex items-center gap-3 px-6 py-3 text-tertiary-dark/70 hover:bg-primary/10 hover:text-primary transition-all font-medium text-left w-full cursor-pointer"
                            >
                                <span className="text-lg opacity-70"><MdShoppingCart /></span>
                                Cart
                            </button>
                        </div>

                        <div className="p-4 border-t border-tertiary-dark/10">
                            {userData ? (
                                <div className="space-y-1">
                                    <Link
                                        href="/profile"
                                        onClick={() => setMobileSidebar(false)}
                                        className={`flex items-center gap-3 px-2 py-3 transition-all font-medium ${
                                            pathname.startsWith('/profile')
                                                ? 'text-primary font-bold'
                                                : 'text-tertiary-dark/70 hover:text-primary'
                                        }`}
                                    >
                                        <span className="text-lg opacity-70"><MdPerson /></span>
                                        Profile
                                    </Link>
                                    <div className="px-2 pt-2" onClick={() => setMobileSidebar(false)}>
                                        <Logout />
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setMobileSidebar(false)}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-tertiary-light rounded-xl font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
                                >
                                    <MdLogin /> Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Sidebar
