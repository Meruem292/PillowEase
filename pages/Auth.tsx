import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import Button from '../components/Button';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';

const Auth: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const resetState = (newView: 'login' | 'signup' | 'forgot') => {
    setError(null);
    setSuccess(null);
    setFormData({ name: '', email: '', password: '' });
    setView(newView);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore, if not create them
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || 'User',
          email: user.email,
          createdAt: serverTimestamp(),
          settings: { lastMode: 'KNEADING', intensity: 50 }
        });
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (view === 'forgot') {
        await sendPasswordResetEmail(auth, formData.email);
        setSuccess("Password reset email sent! Check your inbox.");
        setLoading(false);
        return;
      }

      if (view === 'login') {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        // Sign Up Logic
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: formData.name });

        await setDoc(doc(db, "users", user.uid), {
          name: formData.name,
          email: formData.email,
          createdAt: serverTimestamp(),
          settings: { lastMode: 'KNEADING', intensity: 50 }
        });
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("That email is already registered.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else if (err.code === 'auth/user-not-found') {
        setError("No account found with this email.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      if (view !== 'forgot') setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="w-full max-w-md">
        <motion.div 
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-700"
        >
          <div className="p-8 sm:p-12">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {view === 'login' && 'Welcome Back'}
                {view === 'signup' && 'Join PillowEase'}
                {view === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                {view === 'login' && 'Control your comfort from anywhere.'}
                {view === 'signup' && 'Start your journey to better relaxation.'}
                {view === 'forgot' && 'Enter your email to receive instructions.'}
              </p>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="popLayout">
                {view === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  >
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        required={view === 'signup'}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none dark:text-white"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none dark:text-white"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {view !== 'forgot' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                    {view === 'login' && (
                      <button 
                        type="button"
                        onClick={() => resetState('forgot')}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-500"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none dark:text-white"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full justify-center py-4 text-lg shadow-lg shadow-brand-500/20" 
                isLoading={loading}
                icon={view === 'login' ? <ArrowRight size={18} /> : (view === 'forgot' ? <KeyRound size={18} /> : undefined)}
              >
                {view === 'login' && 'Sign In'}
                {view === 'signup' && 'Create Account'}
                {view === 'forgot' && 'Send Reset Link'}
              </Button>
            </form>

            {view !== 'forgot' && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12.0003 20.45c4.6593 0 8.364-3.5537 8.364-8.0935 0-0.6385-0.0818-1.2587-0.2182-1.8548H12.0003V14.16h4.6366c-0.2728 1.9366-2.141 3.2384-4.6366 3.2384-2.8228 0-5.1274-2.1137-5.1274-4.9082s2.3045-4.9082 5.1274-4.9082c1.3228 0 2.5228 0.4773 3.4501 1.2546l2.3592-2.3592C16.3861 5.1673 14.332 4.16 12.0003 4.16 7.6457 4.16 4.0911 7.6073 4.0911 12.0003s3.5546 7.8403 7.9092 7.8403z" fill="currentColor" />
                  </svg>
                  Google
                </Button>
              </>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {view === 'login' && (
                  <>Don't have an account? <button onClick={() => resetState('signup')} className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">Sign up</button></>
                )}
                {view === 'signup' && (
                  <>Already have an account? <button onClick={() => resetState('login')} className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">Log in</button></>
                )}
                {view === 'forgot' && (
                  <button onClick={() => resetState('login')} className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">Back to Sign In</button>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;