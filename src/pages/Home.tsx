/** @jsxImportSource react */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Zap, Target, Cpu, Activity } from 'lucide-react';
import { useStore } from '../store';
import { cn } from '../lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const { zones, updateZonePpm } = useStore();

  useEffect(() => {
    const timer = setInterval(() => {
      zones.forEach(zone => {
        const offset = Math.floor(Math.random() * 9) - 4; 
        updateZonePpm(zone.id, zone.ppm + offset);
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [zones, updateZonePpm]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col relative overflow-hidden bg-carbon-bg">
      {/* Visual background details */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-carbon-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* Left Side: System Briefing */}
        <div className="flex flex-col items-start gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 px-6 py-2.5 bg-[#0a1f12] border border-white/[0.05] rounded-md"
          >
            <Cpu className="w-4 h-4 text-carbon-primary" />
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-white/50">Integrated OS v4.0 // System Alpha</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-[84px] font-orbitron font-black leading-[0.9] tracking-tighter text-white uppercase">
              Atmospheric <br />
              <span className="text-carbon-primary text-glow-primary">Intelligence.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-md text-white/40 text-[16px] leading-loose font-medium uppercase tracking-wider font-rajdhani"
          >
            Deploying neural atmospheric analysis across the Chennai Municipal network. 
            Real-time cause attribution and 30-minute predictive modeling active.
          </motion.p>

          <div className="flex items-center gap-6 mt-4">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,255,136,1)', color: '#000' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="px-12 py-5 bg-carbon-primary/5 border border-carbon-primary/30 rounded-md font-mono font-black tracking-[0.2em] text-[11px] uppercase transition-all flex items-center gap-4 text-carbon-primary shadow-[0_0_20px_rgba(0,255,136,0.05)]"
            >
              Initialize Dashboard
              <ShieldCheck className="w-4 h-4" />
            </motion.button>
            
            <button className="flex items-center gap-3 text-[10px] font-mono font-bold tracking-widest uppercase text-white/20 hover:text-white transition-all group">
              <div className="w-10 h-10 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-center group-hover:bg-white/5">
                <ArrowRight className="w-4 h-4" />
              </div>
              View Telemetry
            </button>
          </div>
        </div>

        {/* Right Side: Data Visualization */}
        <div className="relative h-[600px] flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-[450px] h-[550px] organic-card p-0 relative group overflow-hidden border-white/[0.03]"
          >
            <div className="absolute inset-0 bg-carbon-bg">
               <img 
                 src="https://picsum.photos/seed/cyber/800/1000" 
                 className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000"
                 alt="System Visual"
                 referrerPolicy="no-referrer"
               />
            </div>
            {/* Visual Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            
            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-carbon-bg to-transparent">
              <div className="panel-title mb-4">NODE SEVEN // ACTIVE</div>
              <h2 className="text-4xl font-orbitron font-black mb-6 text-white leading-tight uppercase">MUNICIPAL <br/>ANALYTICS</h2>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-10 py-4 bg-white text-black font-mono font-black text-[10px] uppercase rounded-none tracking-widest hover:bg-carbon-primary transition-colors flex items-center gap-3"
              >
                ACCESS SYSTEM <Zap className="w-3 h-3" />
              </button>
            </div>
          </motion.div>

          {/* Floating Data Unit 1 */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 -right-4 w-[240px] organic-card p-6 border-carbon-primary/20 bg-carbon-primary/[0.02]"
          >
            <div className="flex items-center gap-4 mb-4">
               <Activity className="w-5 h-5 text-carbon-primary" />
               <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50">Processing</span>
            </div>
            <div className="text-3xl font-mono font-bold text-white tracking-tighter">98.4<span className="text-carbon-primary text-sm ml-1">%</span></div>
          </motion.div>

          {/* Floating Data Unit 2 */}
          <motion.div
             animate={{ y: [0, 15, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-10 -left-6 w-[260px] organic-card p-8 border-white/[0.05]"
          >
            <div className="mb-4 text-[9px] text-white/30 font-mono font-bold tracking-widest uppercase">Live Telemetry</div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-mono font-black text-carbon-primary leading-none tracking-tighter">{zones[0].ppm}</span>
              <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em] font-mono mb-1">CO2 / PPM</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* SYSTEM TICKER */}
      <div className="h-16 bg-[#0a1f12]/40 backdrop-blur-xl border-t border-white/[0.05] flex items-center overflow-hidden">
        <div className="scrolling-ticker flex gap-24 items-center h-full">
          {zones.concat(zones).map((z, idx) => (
            <div key={`${z.id}-${idx}`} className="flex items-center gap-6">
              <span className="text-white/30 font-orbitron font-bold text-[10px] tracking-[0.3em] uppercase">{z.name}</span>
              <div className="w-[1px] h-3 bg-white/10" />
              <span className="text-white font-mono font-bold text-sm tracking-tighter">{z.ppm} <span className="text-[9px] text-white/30 font-medium tracking-widest">PPM</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
