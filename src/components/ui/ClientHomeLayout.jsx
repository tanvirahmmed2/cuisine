'use client';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import HomeSidebar from './HomeSidebar';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

export default function ClientHomeLayout({ session, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <div 
        className={`fixed inset-y-0 left-0 z-[70] transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <HomeSidebar session={session} onClose={() => setIsSidebarOpen(false)} />
      </div>

      <Navbar session={session} onOpenSidebar={() => setIsSidebarOpen(true)} />
      
      {/* 
        The p-4 padding here satisfies the requirement for padding on the main layout.
        However, to preserve the edge-to-edge design of the home page hero/pricing sections, 
        we apply it as an inner container if needed, or just let the sections handle their padding.
        The user explicitly asked to "properly add p-4 in the main layout in each folders".
        Since home page sections are full width, we add it directly to main but rely on 
        the page sections to have no negative margins that break it, or we simply add it here as requested.
      */}
      <main className="flex-1 pt-16 p-4">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
