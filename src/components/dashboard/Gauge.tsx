import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface GaugeProps {
  value: number;
  max?: number;
  label: string;
}

function getPpmColor(ppm: number): string {
  if (ppm <= 80) return '#00ff88';
  if (ppm <= 120) return '#ffd60a';
  return '#ff3b3b';
}

function getPpmGlow(ppm: number): string {
  if (ppm <= 80) return 'drop-shadow(0 0 8px rgba(0,255,136,0.6))';
  if (ppm <= 120) return 'drop-shadow(0 0 8px rgba(255,214,10,0.6))';
  return 'drop-shadow(0 0 8px rgba(255,59,59,0.6))';
}

export const Gauge = ({ value, max = 200, label }: GaugeProps) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  // 60 segments with 2px gap
  const segments = 60;
  const gap = 2;
  const segmentLength = (circumference / segments) - gap;

  // How many segments to light up: value/200 * 60
  const fillPercent = Math.min(value / max, 1);
  const activeSegments = Math.round(fillPercent * segments);

  const color = getPpmColor(value);
  const glowFilter = getPpmGlow(value);

  // Build a NON-REPEATING dasharray that draws exactly
  // activeSegments lit ticks, then a huge gap to stop.
  // A repeating dasharray (the old code) just wraps and
  // fills the whole circle regardless of strokeDashoffset.
  const activeDashArray = useMemo(() => {
    if (activeSegments <= 0) return `0 ${circumference}`;
    const parts: number[] = [];
    for (let i = 0; i < activeSegments; i++) {
      parts.push(segmentLength);
      // After the last segment put a huge gap to stop drawing
      parts.push(i < activeSegments - 1 ? gap : circumference);
    }
    return parts.join(' ');
  }, [activeSegments, segmentLength, gap, circumference]);

  return (
    <div className="flex flex-col items-center justify-center p-4 relative group">
      {/* Background glow - tinted by current color */}
      <div 
        className="absolute inset-0 blur-[100px] rounded-full pointer-events-none"
        style={{ backgroundColor: `${color}08` }}
      />

      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Outer Ring - Dark empty track (always full circle, segmented) */}
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${segmentLength} ${gap}`}
          />
          
          {/* Active segments — non-repeating dasharray fills exactly N segments */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeDasharray={activeDashArray}
            style={{
              filter: glowFilter,
              transition: 'stroke 0.6s ease, stroke-dasharray 0.6s ease',
            }}
          />
        </svg>

        {/* Inner Ring - Thin guide */}
        <svg className="absolute w-[85%] h-[85%] transform -rotate-90 opacity-20" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius - 12}
            stroke="white"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 4"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              color,
              textShadow: `0 0 20px ${color}66, 0 0 40px ${color}22`,
              fontSize: '3.2rem',
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {value}
          </motion.div>
          <div className="text-[10px] text-white/30 font-bold tracking-[0.4em] mt-2 uppercase">PPM</div>
        </div>
      </div>
    </div>
  );
};
