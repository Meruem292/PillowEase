import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Battery, Wifi, User as UserIcon, LogOut } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { User } from './types';
import { auth } from './services/firebase';

// Auth Hook using Firebase
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ 
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '' 
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return { user, loading, logout };
};

const Navbar = ({ user, logout }: { user: User | null, logout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isDashboard ? 'bg-white/80 dark:bg-night-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
                P
              </div>
              <span className={`font-bold text-xl tracking-tight ${isDashboard ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
                PillowEase
              </span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <a href="#features" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Features</a>
                <a href="#reviews" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Reviews</a>
                <a href="#/auth" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">Sign In</a>
                <a href="#/auth" className="bg-brand-600 text-white px-5 py-2 rounded-full font-medium hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40">
                  Get Started
                </a>
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
                   <a href="#features" className="block px-3 py-2 text-slate-600 font-medium">Features</a>
                   <a href="#/auth" className="block px-3 py-2 text-brand-600 font-bold">Sign In</a>
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

const App: React.FC = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-night-900">
        <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen font-sans bg-slate-50 dark:bg-night-900 text-slate-900 dark:text-slate-100 selection:bg-brand-200 selection:text-brand-900">
        <Navbar user={user} logout={logout} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;