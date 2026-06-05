import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useStore } from '../../store';

// Colors by severity order (worst → best)
const BAR_COLORS = ['#ff3b3b', '#ff9500', '#ffd60a', '#34c759'];

export const CauseChart = () => {
  const { zones, selectedZoneId } = useStore();
  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  // causes are already sorted worst → best in the store
  const data = selectedZone.causes.map((c, idx) => ({
    name: c.name,
    value: c.value,
    color: BAR_COLORS[idx % BAR_COLORS.length],
  }));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%',
        backgroundColor: '#0d1f17',
        borderRadius: '12px',
        padding: '16px 12px 8px',
      }}
    >
      {/* Chart title — CHANGE 4: Orbitron 12px #00ff88 letter-spacing 0.12em */}
      <div
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '12px',
          color: '#00ff88',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        CAUSE BREAKDOWN — {selectedZone.name}
      </div>

      {/* Bar chart — min height 220px */}
      <div style={{ flex: 1, minHeight: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 52, left: 0, bottom: 4 }}
          >
            {/* Tooltip */}
            <Tooltip
              cursor={{ fill: 'rgba(0,255,136,0.04)' }}
              contentStyle={{
                backgroundColor: '#050a08',
                border: '1px solid rgba(0,255,136,0.15)',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Rajdhani, sans-serif',
                color: '#fff',
              }}
              formatter={(val: number) => [`${val}%`, 'Share']}
            />

            {/* Y-axis (cause names) — CHANGE 3: Rajdhani 13px #aaaaaa width 120 */}
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={120}
              tick={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: 13,
                fill: '#aaaaaa',
              }}
            />

            {/* X-axis hidden */}
            <XAxis type="number" hide domain={[0, 100]} />

            {/* Bars — CHANGE 3: barSize 28, radius right-side, Cell colors, LabelList */}
            <Bar
              dataKey="value"
              barSize={28}
              radius={[0, 4, 4, 0]}
              minPointSize={4}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
              {/* Label at right end — CHANGE 3 */}
              <LabelList
                dataKey="value"
                position="right"
                style={{
                  fill: '#ffffff',
                  fontSize: 13,
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 600,
                }}
                formatter={(val: number) => `${val}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Root Cause text — CHANGE 3: Share Tech Mono 12px #888888 */}
      <div
        style={{
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '10px',
            color: '#00ff88',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          Root Cause:
        </div>
        <p
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '12px',
            color: '#888888',
            lineHeight: 1.5,
          }}
        >
          {selectedZone.name} is currently impacted by significant{' '}
          {selectedZone.causes[0].name.toLowerCase()} emissions.
          Atmospheric drift suggests localized impact from Industrial Node-4.
        </p>
      </div>
    </div>
  );
};
