import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Cpu, Database, Network, Bot, LayoutDashboard, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="p-12 h-[calc(100vh-80px)] overflow-y-auto bg-carbon-bg custom-scrollbar relative">
      <div className="max-w-[1200px] mx-auto py-20 pb-40 flex flex-col gap-32 relative z-10">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-5 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10"
          >
            <div className="w-2 h-2 bg-carbon-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/60">Our Core Philosophy</span>
          </motion.div>

          <h1 className="text-7xl md:text-9xl font-orbitron font-light leading-none tracking-tighter text-white">
            Breathing is <br />
            <span className="italic font-normal text-carbon-primary">Intelligence.</span>
          </h1>

          <p className="max-w-2xl text-xl font-light text-white/40 leading-relaxed mx-auto">
            CarbonMind is the cognitive layer for urban governance. We transform cities from passive observers into proactive stewards of their own atmosphere.
          </p>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { label: 'Cities Monitored', value: '07+', text: 'Chennai zones under active high-frequency AI surveillance.' },
            { label: 'Pilot Cost Savings', value: '₹4.2 Cr', text: 'Reducing simulation overhead by eliminating expensive field trials.' },
            { label: 'Economic Impact', value: '₹8.82 Cr', text: 'Estimated quarterly risk prevented via intelligent air intervention.' },
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="organic-card border-none bg-[#0a1f12]/40 p-12 space-y-6 group"
            >
              <span className="text-5xl font-mono font-bold text-white tracking-widest group-hover:text-carbon-primary transition-colors">{item.value}</span>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">{item.label}</span>
                <p className="text-sm font-light text-white/40 leading-relaxed italic">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The Pipeline */}
        <section className="space-y-20">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-4xl font-orbitron font-medium text-white">The Neural Pipeline</h2>
            <div className="h-1 w-20 bg-carbon-primary rounded-full" />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
             {[
               { step: '01', label: 'Atmospheric Capture', desc: 'Direct sensor fusion of molecular densities.', icon: Zap },
               { step: '02', label: 'Neural Relay', desc: 'Edge processing via ESP32 telemetry systems.', icon: Cpu },
               { step: '03', label: 'Decision Rendering', desc: 'High-fidelity reactive dashboard interface.', icon: LayoutDashboard },
               { step: '04', label: 'Policy Synthesis', desc: 'AI-driven intervention and economic modeling.', icon: Bot },
             ].map((item, idx) => (
               <div key={item.step} className="p-10 organic-card border-none bg-white/[0.03] space-y-6">
                 <div className="flex items-center justify-between">
                    <item.icon className="w-8 h-8 text-carbon-primary" />
                    <span className="text-4xl font-mono font-bold text-white/10">{item.step}</span>
                 </div>
                 <div>
                    <h4 className="text-xl font-orbitron font-medium text-white mb-2">{item.label}</h4>
                    <p className="text-sm font-light text-white/40 uppercase tracking-widest">{item.desc}</p>
                 </div>
               </div>
             ))}
          </div>
        </section>

        {/* Hardware Section */}
        <section className="organic-card border-none bg-[#0a1f12]/60 p-16 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-12">
              <div className="space-y-4">
                <h3 className="text-3xl font-orbitron font-medium text-white">Hardware Core</h3>
                <p className="text-sm font-light text-white/40 leading-relaxed">
                  Our custom edge units use redundant ESP32 modules to ensure zero-latency atmosphere capture.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Controller", val: "ESP32 S3" },
                  { label: "Interface", val: "I2C 16x2" },
                  { label: "Matrix", val: "Triple LED" },
                  { label: "Sensing", val: "MQ-135 Core" }
                ].map(item => (
                  <div key={item.label} className="p-6 bg-white/[0.04] border border-white/5 rounded-[24px]">
                    <p className="text-[10px] font-bold text-white/20 uppercase mb-2">{item.label}</p>
                    <p className="text-sm font-bold text-white font-mono">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full bg-black/40 rounded-[40px] border border-white/5 p-12 aspect-square flex items-center justify-center relative">
               <div className="w-full h-full border border-dashed border-white/10 rounded-full flex items-center justify-center relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-t-carbon-primary/40 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                  />
                  <svg viewBox="0 0 400 400" className="w-[70%] h-[70%] drop-shadow-[0_0_50px_rgba(0,255,136,0.1)]">
                    <rect x="150" y="125" width="100" height="150" fill="rgba(0,0,0,0.4)" stroke="#00ff88" strokeWidth="1.5" rx="12" />
                    <circle cx="200" cy="80" r="40" fill="rgba(0,0,0,0.2)" stroke="#10ff9d" strokeWidth="1" strokeDasharray="4 4" />
                    <motion.circle 
                      cx="200" cy="80" r="8" 
                      fill="#00ff88" 
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <text x="200" y="210" textAnchor="middle" fill="white" fontSize="14" fontStyle="italic" fontWeight="300" fontFamily="Inter">Neural Unit</text>
                  </svg>
               </div>
               <div className="absolute bottom-8 right-8 text-[9px] font-mono text-white/10 uppercase tracking-widest">Protocol Architecture v1.4</div>
            </div>
          </div>
        </section>

        <footer className="text-center py-20 border-t border-white/5">
           <p className="text-xl font-light text-white/20 italic">
             "Atmospheric intelligence is the fundamental requirement of a living city."
           </p>
        </footer>
      </div>
    </div>
  );
}
