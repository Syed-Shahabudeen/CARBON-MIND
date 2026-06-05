import React from 'react';
import { motion } from 'motion/react';
import { Zone } from '../../types';
import { cn } from '../../lib/utils';
import { ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';

interface ZoneCardProps {
  zone: Zone;
  isSelected: boolean;
  onClick: () => void;
}

function getPpmColor(ppm: number): string {
  if (ppm <= 80) return '#00ff88';
  if (ppm <= 120) return '#ffd60a';
  if (ppm <= 200) return '#ff3b3b';
  return '#ff0000';
}

function getDangerBarColor(ppm: number): string {
  if (ppm <= 80) return '#00ff88';
  if (ppm <= 120) return '#ffd60a';
  if (ppm <= 200) return '#ff8800';
  return '#ff0000';
}

export const ZoneCard = ({ zone, isSelected, onClick }: ZoneCardProps) => {
  const isIncreasing = zone.trend[zone.trend.length - 1] > zone.trend[0];
  const delta = Math.abs(zone.trend[zone.trend.length - 1] - zone.trend[zone.trend.length - 2]);
  const ppmColor = getPpmColor(zone.ppm);
  const barColor = getDangerBarColor(zone.ppm);
  const dangerPercent = Math.min((zone.ppm / 200) * 100, 100);
  const isOverDanger = zone.ppm > 200;
  const isWarning = zone.ppm > 150;

  return (
    <motion.button
      layout
      layoutId={zone.id}
      transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "bg-[#0a1f12]/40 backdrop-blur-xl p-5 rounded-xl border border-white/[0.05] transition-colors flex flex-col gap-4 relative overflow-hidden text-left w-full",
        isSelected && "bg-carbon-primary/[0.03]"
      )}
      style={{
        borderLeftWidth: isSelected ? '4px' : '3px',
        borderLeftColor: ppmColor,
        boxShadow: isSelected 
          ? `inset 0 0 30px ${ppmColor}10, 0 0 20px ${ppmColor}12`
          : zone.ppm > 120 
            ? `inset 0 0 30px ${ppmColor}08, 0 0 15px ${ppmColor}06` 
            : 'none',
      }}
    >
      {/* Zone name — CHANGE 4: 14px Orbitron, letter-spacing 0.1em */}
      <div className="flex justify-between items-start">
        <h3
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '14px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {isWarning && <AlertTriangle className="w-3 h-3 text-[#ff8800] flex-shrink-0" />}
          {zone.name}
        </h3>
        <div className="flex items-center gap-1">
          {isIncreasing ? <ChevronUp className="w-3 h-3 text-carbon-danger" /> : <ChevronDown className="w-3 h-3 text-carbon-safe" />}
          <span className={cn("text-[9px] font-mono font-bold", isIncreasing ? "text-carbon-danger" : "text-carbon-safe")}>
            {delta}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          {/* PPM number — CHANGE 4: 2.8rem Orbitron weight 700 */}
          <div
            style={{
              fontSize: '2.8rem',
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: ppmColor,
            }}
          >
            {zone.ppm}
          </div>

          {/* Status badge — CHANGE 4: 12px, padding 3px 10px, border-radius 4px */}
          <div
            style={{
              marginTop: '10px',
              padding: '3px 10px',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '4px',
              display: 'inline-block',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              ...(zone.status === 'GOOD'
                ? { background: 'rgba(52,199,89,0.1)', color: '#34c759', border: '1px solid rgba(52,199,89,0.2)' }
                : zone.status === 'FAIR'
                ? { background: 'rgba(255,214,10,0.1)', color: '#ffd60a', border: '1px solid rgba(255,214,10,0.2)' }
                : zone.status === 'MODERATE'
                ? { background: 'rgba(255,149,0,0.1)', color: '#ff9500', border: '1px solid rgba(255,149,0,0.2)' }
                : { background: 'rgba(255,59,59,0.1)', color: '#ff3b3b', border: '1px solid rgba(255,59,59,0.2)' }),
            }}
          >
            {zone.status}
          </div>
        </div>

        {/* AQI label — CHANGE 4: 13px Rajdhani */}
        <div className="text-right">
          <div
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '4px',
            }}
          >
            AQI SCORE
          </div>
          <div className="text-sm font-mono font-bold text-white/60">{zone.aqi}</div>
        </div>
      </div>

      {/* Danger Threshold Bar */}
      <div className="mt-auto pt-2">
        <div className="text-[7px] font-mono text-white/15 uppercase tracking-widest mb-1">
          SAFE LIMIT: 200 ppm
        </div>
        <div className="w-full h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ 
              backgroundColor: barColor,
              boxShadow: isOverDanger ? `0 0 6px ${barColor}` : 'none',
            }}
            initial={{ width: 0 }}
            animate={{ 
              width: `${dangerPercent}%`,
              opacity: isOverDanger ? [1, 0.5, 1] : 1,
            }}
            transition={isOverDanger 
              ? { width: { duration: 0.8 }, opacity: { duration: 0.8, repeat: Infinity } } 
              : { duration: 0.8 }
            }
          />
        </div>
      </div>
    </motion.button>
  );
};
