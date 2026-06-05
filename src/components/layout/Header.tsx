import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Microscope, Info, ShieldAlert, Cpu, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Header = () => {
  return (
    <header className="flex flex-col border-b border-white/[0.05] bg-carbon-bg relative z-[100]">
      {/* Top Decoration Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-carbon-primary/30 to-transparent" />
      
      <div className="px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Brand Logo - More "System" style */}
          <NavLink to="/" className="flex items-center gap-4 group">
            <div className="p-2 border border-carbon-primary/20 bg-carbon-primary/5 rounded-lg group-hover:bg-carbon-primary/10 transition-all">
              <Cpu className="w-6 h-6 text-carbon-primary" />
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-extrabold tracking-[0.1em] text-white">
                CARBON<span className="text-carbon-primary">MIND</span>
              </h1>
              <div className="text-[8px] font-mono font-bold text-white/20 uppercase tracking-[0.4em]">Integrated OS v4.0</div>
            </div>
          </NavLink>

          {/* Nav Links as System Tabs */}
          <nav className="hidden lg:flex items-center gap-2">
            {[
              { to: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
              { to: '/chatbot', label: 'VAYUBOT', icon: MessageSquare },
              { to: '/simulator', label: 'SIMULATOR', icon: Microscope },
              { to: '/map', label: 'MAP', icon: MapPin },
              { to: '/about', label: 'REPORTS', icon: Info },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-6 py-2.5 rounded-md text-[11px] font-mono font-bold tracking-widest transition-all border",
                  isActive 
                    ? "text-carbon-primary bg-carbon-primary/5 border-carbon-primary/20 shadow-[0_0_15px_rgba(0,255,136,0.05)]" 
                    : "text-white/30 border-transparent hover:text-white/60 hover:bg-white/[0.02]"
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 px-5 py-2.5 bg-[#0a1f12] border border-white/[0.05] rounded-md shadow-inner">
            <div className="w-1.5 h-1.5 bg-carbon-primary rounded-full animate-pulse shadow-[0_0_8px_#10ff9d]" />
            <span className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-[0.2em]">TELEMETRY ACTIVE</span>
          </div>
          
          <button className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group">
            <ShieldAlert className="w-4 h-4 text-white/40 group-hover:text-carbon-danger" />
          </button>
        </div>
      </div>
    </header>
  );
};
