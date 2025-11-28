'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Wifi, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './AuthProvider';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isDashboard ? 'bg-white/80 dark:bg-night-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
                P
              </div>
              <span className={`font-bold text-xl tracking-tight ${isDashboard ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
                PillowEase
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <Link href="/#features" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Features</Link>
                <Link href="/#reviews" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Reviews</Link>
                <Link href="/auth" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">Sign In</Link>
                <Link href="/auth" className="bg-brand-600 text-white px-5 py-2 rounded-full font-medium hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-500" /> Connected
                </span>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 dark:text-slate-200 font-medium">{user.name}</span>
                  <button onClick={logout} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-red-500" title="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-700 p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
               {!user ? (
                 <>
                   <Link href="/#features" className="block px-3 py-2 text-slate-600 font-medium" onClick={() => setIsOpen(false)}>Features</Link>
                   <Link href="/auth" className="block px-3 py-2 text-brand-600 font-bold" onClick={() => setIsOpen(false)}>Sign In</Link>
                 </>
               ) : (
                 <button onClick={logout} className="block w-full text-left px-3 py-2 text-red-500 font-medium">Log Out</button>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;