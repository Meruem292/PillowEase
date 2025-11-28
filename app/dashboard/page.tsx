'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Flame, Sparkles, Sliders, Battery, Wifi, Brain, MessageSquare, X } from 'lucide-react';
import { DeviceState, HeatLevel, MassageMode } from '../../types';
import Button from '../../components/Button';
import { getSmartRecommendation } from '../actions';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [deviceState, setDeviceState] = useState<DeviceState>({
    isOn: false,
    isConnected: false,
    mode: MassageMode.KNEADING,
    intensity: 30,
    heat: HeatLevel.OFF,
    timer: 15,
  });

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Simulate Bluetooth Connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeviceState(prev => ({ ...prev, isConnected: true }));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const togglePower = () => {
    setDeviceState(prev => ({ ...prev, isOn: !prev.isOn }));
  };

  const handleSmartRecommendation = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    try {
      const recommendation = await getSmartRecommendation(aiInput);
      setDeviceState(prev => ({
        ...prev,
        isOn: true,
        mode: recommendation.mode,
        intensity: recommendation.intensity,
        heat: recommendation.heat,
        timer: recommendation.duration
      }));
      setAiModalOpen(false);
      alert(`AI Coach: ${recommendation.reasoning}`);
    } catch (e) {
      alert("AI Service unavailable. Please try manual settings.");
    } finally {
      setAiLoading(false);
    }
  };

  const modeColors = {
    [MassageMode.KNEADING]: "from-blue-500 to-cyan-400",
    [MassageMode.SHIATSU]: "from-purple-500 to-indigo-500",
    [MassageMode.PULSE]: "from-emerald-400 to-teal-500",
    [MassageMode.WAVE]: "from-orange-400 to-pink-500",
    [MassageMode.AI_ADAPTIVE]: "from-brand-500 to-purple-600"
  };

  if (authLoading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visualizer & Status */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            layout
            className="relative h-[500px] rounded-3xl bg-slate-900 overflow-hidden shadow-2xl flex items-center justify-center p-8"
          >
             {/* Background Effects */}
             <div className="absolute inset-0 opacity-20">
               <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r ${modeColors[deviceState.mode]} rounded-full blur-[100px] transition-colors duration-1000 ${deviceState.isOn ? 'opacity-100' : 'opacity-0'}`}></div>
             </div>
             
             {/* Pillow Visual Representation */}
             <div className="relative z-10 w-full max-w-sm aspect-square">
               <motion.div
                 animate={deviceState.isOn ? {
                    scale: deviceState.mode === MassageMode.PULSE ? [1, 1.05, 1] : 1,
                    rotate: deviceState.mode === MassageMode.KNEADING ? [0, 2, -2, 0] : 0,
                 } : {}}
                 transition={{ 
                   duration: deviceState.mode === MassageMode.PULSE ? 60 / deviceState.intensity : 2, 
                   repeat: Infinity 
                 }}
                 className={`w-full h-full rounded-[3rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center justify-center text-white transition-opacity duration-500 ${!deviceState.isOn && 'opacity-50 grayscale'}`}
               >
                 <div className="text-center space-y-2">
                    <span className="text-4xl font-bold tracking-tighter">
                      {deviceState.isOn ? deviceState.mode.replace('_', ' ') : 'STANDBY'}
                    </span>
                    {deviceState.isOn && (
                      <p className="text-white/60 font-mono">{deviceState.timer} MIN REMAINING</p>
                    )}
                 </div>

                 {/* Heat Visualizer */}
                 <div className={`mt-8 flex gap-2 transition-opacity ${deviceState.heat === HeatLevel.OFF ? 'opacity-0' : 'opacity-100'}`}>
                    <div className={`w-2 h-12 rounded-full ${deviceState.heat === HeatLevel.HIGH ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-orange-300'}`}></div>
                    <div className={`w-2 h-12 rounded-full ${deviceState.heat === HeatLevel.HIGH ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-orange-300'}`}></div>
                    <div className={`w-2 h-12 rounded-full ${deviceState.heat === HeatLevel.HIGH ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-orange-300'}`}></div>
                 </div>
               </motion.div>
             </div>

             {/* Connection Status Badge */}
             <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
               {deviceState.isConnected ? (
                 <>
                   <Wifi className="w-4 h-4 text-green-400" />
                   <span className="text-xs font-medium text-white">Connected</span>
                   <span className="w-px h-3 bg-white/20 mx-1"></span>
                   <Battery className="w-4 h-4 text-white" />
                   <span className="text-xs font-medium text-white">84%</span>
                 </>
               ) : (
                 <>
                   <Wifi className="w-4 h-4 text-slate-400 animate-pulse" />
                   <span className="text-xs font-medium text-slate-300">Searching...</span>
                 </>
               )}
             </div>
          </motion.div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold dark:text-white">Quick Stats</h3>
                <span className="text-sm text-slate-500">Session History</span>
             </div>
             <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                   <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Total Time</p>
                   <p className="text-2xl font-bold text-slate-900 dark:text-white">12.5h</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                   <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Fav Mode</p>
                   <p className="text-xl font-bold text-slate-900 dark:text-white">Shiatsu</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                   <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Avg Intensity</p>
                   <p className="text-2xl font-bold text-slate-900 dark:text-white">65%</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Power & AI */}
          <div className="grid grid-cols-2 gap-4">
             <button
               onClick={togglePower}
               className={`h-32 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-lg ${deviceState.isOn ? 'bg-slate-900 text-white shadow-slate-900/30' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
             >
               <Power className={`w-8 h-8 ${deviceState.isOn ? 'text-green-400' : ''}`} />
               <span className="font-bold">Power</span>
             </button>

             <button
               onClick={() => setAiModalOpen(true)}
               disabled={!deviceState.isOn}
               className="h-32 rounded-3xl bg-gradient-to-br from-brand-500 to-purple-600 text-white flex flex-col items-center justify-center gap-3 transition-all hover:shadow-lg hover:shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <Sparkles className="w-8 h-8" />
               <span className="font-bold">AI Coach</span>
             </button>
          </div>

          {/* Settings Card */}
          <div className={`bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 transition-opacity duration-300 space-y-8 ${!deviceState.isOn ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}>
             
             {/* Heat Control */}
             <div>
                <div className="flex justify-between items-center mb-4">
                   <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                     <Flame className={`w-5 h-5 ${deviceState.heat !== HeatLevel.OFF ? 'text-orange-500' : 'text-slate-400'}`} />
                     Heat Therapy
                   </label>
                   <span className="text-sm font-medium text-slate-500">{deviceState.heat}</span>
                </div>
                <div className="flex gap-2">
                   {[HeatLevel.OFF, HeatLevel.LOW, HeatLevel.HIGH].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDeviceState(prev => ({...prev, heat: level}))}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${deviceState.heat === level ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}
                      >
                        {level}
                      </button>
                   ))}
                </div>
             </div>

             {/* Intensity Slider */}
             <div>
               <div className="flex justify-between items-center mb-4">
                   <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                     <Sliders className="w-5 h-5 text-brand-500" />
                     Intensity
                   </label>
                   <span className="text-sm font-medium text-slate-500">{deviceState.intensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={deviceState.intensity}
                  onChange={(e) => setDeviceState(prev => ({...prev, intensity: parseInt(e.target.value)}))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
             </div>

             {/* Mode Selection */}
             <div>
               <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200 mb-4">
                 <Brain className="w-5 h-5 text-purple-500" />
                 Massage Mode
               </label>
               <div className="grid grid-cols-2 gap-3">
                 {Object.values(MassageMode).filter(m => m !== 'AI_ADAPTIVE').map((mode) => (
                   <button
                     key={mode}
                     onClick={() => setDeviceState(prev => ({...prev, mode}))}
                     className={`p-3 rounded-xl text-left text-sm font-bold transition-all border ${deviceState.mode === mode ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-transparent border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                   >
                     {mode.charAt(0) + mode.slice(1).toLowerCase()}
                   </button>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      <AnimatePresence>
        {aiModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 bg-gradient-to-r from-brand-600 to-purple-600 text-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    <h2 className="text-xl font-bold">AI Relaxation Coach</h2>
                 </div>
                 <button onClick={() => setAiModalOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="p-8">
                 <p className="text-slate-600 mb-6 text-lg">
                   Tell me how you're feeling right now. <br/>
                   <span className="text-sm text-slate-400">e.g., "I have a stiff neck from coding all day" or "I just finished a workout."</span>
                 </p>
                 
                 <div className="relative mb-6">
                   <MessageSquare className="absolute top-4 left-4 text-slate-400 w-5 h-5" />
                   <textarea
                     value={aiInput}
                     onChange={(e) => setAiInput(e.target.value)}
                     className="w-full h-32 pl-12 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none text-slate-700"
                     placeholder="Describe your symptoms..."
                   />
                 </div>

                 <Button 
                   onClick={handleSmartRecommendation} 
                   isLoading={aiLoading} 
                   disabled={!aiInput.trim()}
                   className="w-full py-4 text-lg"
                 >
                   Generate Custom Session
                 </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}