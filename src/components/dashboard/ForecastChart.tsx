import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'motion/react';
import { useStore } from '../../store';

// Zone-specific forecast parameters
const ZONE_FORECAST_CONFIG: Record<string, { noActionRise: number; interventionDrop: number }> = {
  velachery:   { noActionRise: 45, interventionDrop: -60 },
  perungudi:   { noActionRise: 40, interventionDrop: -55 },
  arumbakkam:  { noActionRise: 38, interventionDrop: -50 },
  ramapuram:   { noActionRise: 25, interventionDrop: -38 },
  alandur:     { noActionRise: 22, interventionDrop: -35 },
  tambaram:    { noActionRise: 12, interventionDrop: -15 },
  tnagar:      { noActionRise: 10, interventionDrop: -12 },
};

function addNoise(value: number): number {
  return value + (Math.random() * 8 - 4); // ±4 ppm noise
}

function generateForecastData(basePpm: number, zoneId: string) {
  const config = ZONE_FORECAST_CONFIG[zoneId] || { noActionRise: 20, interventionDrop: -30 };
  const steps = 7; // 0, 5, 10, 15, 20, 25, 30 minutes
  const data = [];

  for (let i = 0; i < steps; i++) {
    const t = i * 5;
    const progress = i / (steps - 1); // 0 to 1
    // Ease-in curve for "no action" (accelerating rise)
    const noActionRaw = basePpm + config.noActionRise * Math.pow(progress, 1.3);
    // Ease-out curve for "intervention" (decelerating drop)  
    const interventionRaw = basePpm + config.interventionDrop * (1 - Math.pow(1 - progress, 1.5));

    data.push({
      time: String(t),
      noAction: Math.round(i === 0 ? basePpm : addNoise(noActionRaw)),
      intervention: Math.round(i === 0 ? basePpm : addNoise(interventionRaw)),
    });
  }
  return data;
}

export const ForecastChart = () => {
  const { selectedZoneId, zones } = useStore();
  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  const forecastData = useMemo(
    () => generateForecastData(selectedZone.ppm, selectedZone.id),
    [selectedZone.ppm, selectedZone.id]
  );

  const noActionDelta = forecastData[forecastData.length - 1].noAction - forecastData[0].noAction;
  const interventionDelta = forecastData[forecastData.length - 1].intervention - forecastData[0].intervention;

  // Determine Y-axis domain dynamically
  const allValues = forecastData.flatMap(d => [d.noAction, d.intervention]);
  const yMin = Math.floor(Math.min(...allValues) / 10) * 10 - 10;
  const yMax = Math.max(Math.ceil(Math.max(...allValues) / 10) * 10 + 10, 210);

  // Check if noAction crosses 200
  const crossesDanger = forecastData.some(d => d.noAction >= 200);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex-grow w-full min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="4 4" 
              stroke="rgba(255,255,255,0.03)" 
              vertical={false} 
            />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: 'Rajdhani, sans-serif' }}
              label={{ value: 'min', position: 'insideBottomRight', offset: -5, fill: 'rgba(255,255,255,0.25)', fontSize: 11 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: 'Rajdhani, sans-serif' }}
              domain={[yMin, yMax]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#050a08', 
                border: '1px solid rgba(0,255,136,0.1)', 
                color: '#fff', 
                borderRadius: '8px',
                fontSize: '10px',
                fontFamily: 'Share Tech Mono'
              }}
            />
            
            {/* Critical Threshold Line at 200 ppm */}
            <ReferenceLine 
              y={200} 
              stroke="#ff3b3b" 
              strokeDasharray="6 4" 
              strokeWidth={1.5}
              strokeOpacity={0.7}
              label={{ 
                value: 'CRITICAL THRESHOLD', 
                position: 'insideTopRight',
                fill: 'rgba(255,59,59,0.6)',
                fontSize: 8,
                fontFamily: 'Share Tech Mono',
              }}
            />

            {/* Without Action Line (Red) */}
            <Line 
              type="monotone" 
              dataKey="noAction" 
              stroke="#ff3b3b" 
              strokeWidth={3}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const isDanger = payload.noAction >= 200;
                return (
                  <circle
                    key={`noaction-${props.index}`}
                    cx={cx}
                    cy={cy}
                    r={isDanger ? 6 : 4}
                    fill={isDanger ? '#ff0000' : '#ff3b3b'}
                    strokeWidth={0}
                    style={isDanger ? { 
                      filter: 'drop-shadow(0 0 6px #ff0000)',
                    } : {}}
                  >
                    {isDanger && (
                      <animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite" />
                    )}
                  </circle>
                );
              }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            
            {/* With Intervention Line (Green) */}
            <Line 
              type="monotone" 
              dataKey="intervention" 
              stroke="#00ff88" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#00ff88', strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            <ReferenceLine y={100} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>

        {/* Legend Overlays */}
        <div className="absolute top-0 right-0 flex flex-col items-end gap-2 pr-4">
           <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold text-red-500/60 uppercase tracking-widest">
                Without Action: {noActionDelta >= 0 ? '+' : ''}{noActionDelta} PPM
              </span>
              <div className="w-2 h-[2px] bg-red-500" />
           </div>
           <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-widest">
                With Action: {interventionDelta >= 0 ? '+' : ''}{interventionDelta} PPM
              </span>
              <div className="w-2 h-[2px] bg-emerald-500" />
           </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-red-500/5 border border-red-500/20 p-5 rounded-xl">
           {/* CHANGE 4: label 12px Orbitron */}
           <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: 'rgba(239,68,68,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>No Action</div>
           {/* CHANGE 4: number 1.4rem */}
           <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#ef4444', lineHeight: 1 }}>
             {noActionDelta >= 0 ? '+' : ''}{noActionDelta} ppm
           </div>
        </div>
        <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-xl">
           {/* CHANGE 4: label 12px Orbitron */}
           <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: 'rgba(16,185,129,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>With Intervention</div>
           {/* CHANGE 4: number 1.4rem */}
           <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#10b981', lineHeight: 1 }}>
             {interventionDelta >= 0 ? '+' : ''}{interventionDelta} ppm
           </div>
        </div>
      </div>
    </div>
  );
};
