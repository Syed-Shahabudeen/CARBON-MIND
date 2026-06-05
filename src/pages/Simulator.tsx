import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { ShieldAlert, TrendingDown, IndianRupee, Clock, Zap, Target } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Simulator() {
  const { zones, selectedZoneId, selectZone, simulation, updateSimulation } = useStore();
  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];
  const [deployed, setDeployed] = useState(false);

  const calculateProjectedPpm = () => {
    const basePpm = selectedZone.ppm;
    const reduction = (simulation.greenBelt * 0.4) + (simulation.traffic * 0.6) + (simulation.industrial * 0.8);
    return Math.max(Math.round(basePpm - reduction), 40);
  };

  const calculateCost = () => {
    return (simulation.greenBelt * 0.06) + (simulation.traffic * 0.045) + (simulation.industrial * 0.09);
  };

  const handleDeploy = () => {
    toast.loading('Deploying resources...', { duration: 2000 });
    setTimeout(() => {
      setDeployed(true);
      toast.success('INTERVENTION PLAN ACTIVE');
    }, 2000);
  };

  const autoOptimize = () => {
    updateSimulation({ greenBelt: 80, traffic: 40, industrial: 90 });
    toast.success('AI OPTIMAL PARAMETERS APPLIED');
  };

  const projectedPpm = calculateProjectedPpm();
  const cost = calculateCost();

  return (
    <div className="p-12 max-w-[1400px] mx-auto flex flex-col gap-12 bg-carbon-bg min-h-[calc(100vh-80px)]">
      <div className="flex flex-col gap-2">
        <h1 className="font-orbitron font-medium text-4xl tracking-tight text-white uppercase">Intervention Command</h1>
        <p className="text-white/30 text-[11px] font-bold tracking-[0.4em] uppercase">Simulation Engine v4.2 — Urban Decision Intelligence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Zone Selection */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="panel-title mb-2 px-2">Select Active Zone</div>
          <div className="grid grid-cols-1 gap-4">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => { selectZone(zone.id); setDeployed(false); }}
                className={cn(
                  "p-8 bg-[#0a1f12]/40 rounded-[32px] border flex flex-col gap-2 transition-all group",
                  selectedZoneId === zone.id 
                    ? "border-carbon-primary/40 bg-carbon-primary/5 shadow-[0_0_40px_rgba(0,255,136,0.05)]" 
                    : "border-white/5 hover:border-white/10"
                )}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{zone.id}</span>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    zone.status === 'GOOD' ? 'bg-carbon-safe' : 'bg-carbon-danger'
                  )} />
                </div>
                <h3 className="text-lg font-orbitron font-medium text-white/90 uppercase tracking-tight text-left">{zone.name}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-mono font-bold text-white">{zone.ppm}</span>
                  <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest font-mono">PPM</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Controls & Projections */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {/* Controls Card */}
          <div className="organic-card border-none bg-[#0a1f12]/60 p-12 flex flex-col gap-12">
            <div className="flex justify-between items-center">
              <div className="panel-title">Intervention Parameters</div>
              <button onClick={autoOptimize} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-carbon-primary flex items-center gap-2 hover:bg-white/10 transition-all uppercase tracking-widest">
                <Zap className="w-3 h-3" /> AI Optimize
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <Slider 
                label="Green Belt" 
                value={simulation.greenBelt} 
                onChange={(v) => updateSimulation({ greenBelt: v })} 
                accent="bg-emerald-400"
              />
              <Slider 
                label="Traffic Restriction" 
                value={simulation.traffic} 
                onChange={(v) => updateSimulation({ traffic: v })} 
                accent="bg-carbon-warning"
              />
              <Slider 
                label="Industrial Scrub" 
                value={simulation.industrial} 
                onChange={(v) => updateSimulation({ industrial: v })} 
                accent="bg-carbon-cyan"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#ffffff', color: '#000000' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDeploy}
              className="mt-4 w-full py-6 bg-white/5 border border-white/10 text-white font-bold tracking-[0.3em] rounded-full flex items-center justify-center gap-4 group transition-all uppercase text-[11px]"
            >
              <ShieldAlert className="w-5 h-5 group-hover:text-carbon-danger transition-colors" />
              Deploy Intervention Plan
            </motion.button>
          </div>

          {/* Projection Card */}
          <div className="organic-card border-none bg-[#0a1f12]/40 p-12 flex flex-col gap-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-20">
              <TrendingDown className="w-20 h-20 text-carbon-primary" />
            </div>

            <div className="panel-title">Projection Architecture</div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex flex-col items-center gap-4">
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Atmospheric State</span>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-mono font-bold text-white/40">{selectedZone.ppm}</span>
                  <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Current</span>
                </div>
              </div>

              <div className="h-px w-24 bg-white/10 hidden md:block" />

              <div className="flex flex-col items-center gap-4">
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Projected Outcome</span>
                <div className="flex flex-col items-center">
                  <motion.span 
                    key={projectedPpm}
                    initial={{ scale: 1.2, color: '#10ff9d' }}
                    animate={{ scale: 1, color: '#10ff9d' }}
                    className="text-6xl font-mono font-bold text-carbon-primary"
                  >
                    {projectedPpm}
                  </motion.span>
                  <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest underline decoration-carbon-primary decoration-2 underline-offset-8">Simulation Success</span>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {deployed && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
                >
                  <div className="p-8 bg-white/[0.04] border border-white/5 rounded-[32px] flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-carbon-primary/10 flex items-center justify-center">
                      <IndianRupee className="w-6 h-6 text-carbon-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Total Fiscal Budget</p>
                      <p className="text-2xl font-mono font-bold text-white">₹{cost.toFixed(2)} Cr</p>
                    </div>
                  </div>
                  <div className="p-8 bg-white/[0.04] border border-white/5 rounded-[32px] flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-carbon-cyan/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-carbon-cyan" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Deployment Timeline</p>
                      <p className="text-2xl font-mono font-bold text-white">~{Math.round(cost * 3)} Local Cycles</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-8 bg-carbon-primary/5 border border-carbon-primary/10 rounded-[32px]">
              <p className="text-[13px] font-light text-white/60 leading-relaxed italic">
                <span className="text-carbon-primary font-bold uppercase pr-2">Strategy:</span>
                Increase Green Belt coverage by 15% in central wards to achieve a stable safe threshold. This intervention is predicted to save ₹1.2 Cr in reactive healthcare costs over the next fiscal year.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange, accent }: { label: string, value: number, onChange: (v: number) => void, accent: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-bold text-white/40 tracking-widest uppercase">{label}</label>
        <span className={cn("text-sm font-mono font-bold border-b border-white/10 pb-1 text-white")}>{value}%</span>
      </div>
      <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden group">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className={cn("h-full transition-all duration-300 group-hover:brightness-125", accent)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
