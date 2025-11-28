'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Wind, Thermometer, Battery, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '../components/Button';

export default function Landing() {
  const router = useRouter();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold border border-brand-100">
                <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
                v2.0 Now Available with AI Smart Sense
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Master the Art of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">Doing Nothing.</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-lg leading-relaxed">
                PillowEase isn't just a massager; it's your personal relaxation therapist. Powered by AI to adapt to your stress levels instantly.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => router.push('/auth')} icon={<ArrowRight className="w-5 h-5" />}>
                  Control Your Comfort
                </Button>
                <Button size="lg" variant="secondary">
                  Watch Demo
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-8 flex items-center gap-8 text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold bg-cover`} style={{backgroundImage: `url(https://picsum.photos/32/32?random=${i})`}}></div>
                    ))}
                  </div>
                  <span className="text-sm font-medium">10k+ Happy Sleepers</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:h-[600px] flex items-center justify-center"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                 {/* Abstract Pillow Representation */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-brand-500 to-indigo-500 rounded-[3rem] shadow-2xl shadow-brand-500/40 rotate-3 transform transition-transform hover:rotate-6 duration-500"></div>
                 <div className="absolute inset-0 bg-white rounded-[3rem] shadow-xl flex items-center justify-center overflow-hidden border border-slate-100">
                    <img src="https://picsum.photos/800/800?grayscale&blur=2" alt="Relaxing Texture" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                    <div className="relative z-10 text-center p-8">
                       <Activity className="w-16 h-16 text-brand-500 mx-auto mb-4 animate-pulse-slow" />
                       <h3 className="text-2xl font-bold text-slate-800">Smart Sensing Active</h3>
                       <p className="text-slate-500 mt-2">Adjusting pressure...</p>
                    </div>
                 </div>
                 
                 {/* Floating UI Cards */}
                 <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
                 >
                   <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                     <Thermometer className="w-6 h-6" />
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Heat</p>
                     <p className="font-bold text-slate-800">42°C Optimal</p>
                   </div>
                 </motion.div>

                 <motion.div 
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -left-8 bottom-1/3 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
                 >
                   <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                     <Wind className="w-6 h-6" />
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Mode</p>
                     <p className="font-bold text-slate-800">Deep Shiatsu</p>
                   </div>
                 </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Features designed for dreams.</h2>
            <p className="text-slate-600 text-lg">Every detail of PillowEase is engineered to help you disconnect from the world and reconnect with yourself.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Thermometer />, title: "Dual-Zone Heating", desc: "Independent heat controls for neck and shoulders to melt away tension." },
              { icon: <Activity />, title: "AI Stress Response", desc: "Our algorithm detects muscle rigidity and adjusts intensity automatically." },
              { icon: <Battery />, title: "10-Hour Battery", desc: "Take comfort anywhere. One charge lasts for a week of nightly sessions." },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  {React.cloneElement(feature.icon as React.ReactElement<any>, { size: 24 })}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

       {/* CTA Section */}
       <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-brand-900"></div>
         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
         <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to upgrade your downtime?</h2>
            <Button size="lg" className="bg-white text-brand-900 hover:bg-brand-50" onClick={() => router.push('/auth')}>
              Get PillowEase Today
            </Button>
            <p className="mt-6 text-brand-200 text-sm">30-night sleep trial • Free shipping • 2-year warranty</p>
         </div>
       </section>
    </div>
  );
}