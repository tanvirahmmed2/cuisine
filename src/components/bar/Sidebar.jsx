'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import Logout from '../buttons/Logout'
import { Context } from '../context/Context'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose, MdHome, MdRestaurantMenu, MdSupportAgent, MdEvent, MdShoppingCart, MdPerson, MdLogin } from 'react-icons/md'

const Sidebar = () => {
    const { mobileSidebar, setMobileSidebar, cartBar, setCartBar, userData } = useContext(Context)

    const handleGotoCart = () => {
        setCartBar(!cartBar)
        setMobileSidebar(false)
    }

    const navLinks = [
        { name: 'Home', href: '/', icon: <MdHome /> },
        { name: 'Menu', href: '/menu', icon: <MdRestaurantMenu /> },
        { name: 'Support', href: '/support', icon: <MdSupportAgent /> },
        { name: 'Reservation', href: '/reservation', icon: <MdEvent /> },
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
                            <span className="font-bold text-lg text-primary">Menu</span>
                            <button 
                                onClick={() => setMobileSidebar(false)}
                                className="p-2 hover:bg-tertiary-dark/5 rounded-full transition-colors"
                            >
                                <MdClose size={20} className="text-tertiary-dark/60" />
                            </button>
                        </div>

                        <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileSidebar(false)}
                                    className="flex items-center gap-3 px-6 py-3 text-tertiary-dark/70 hover:bg-primary/10 hover:text-primary transition-all font-medium"
                                >
                                    <span className="text-lg opacity-70">{link.icon}</span>
                                    {link.name}
                                </Link>
                            ))}

                            <button
                                onClick={handleGotoCart}
                                className="flex items-center gap-3 px-6 py-3 text-tertiary-dark/70 hover:bg-primary/10 hover:text-primary transition-all font-medium text-left w-full"
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
                                        className="flex items-center gap-3 px-2 py-3 text-tertiary-dark/70 hover:text-primary transition-all font-medium"
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
