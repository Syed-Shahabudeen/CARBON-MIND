import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { useStore } from '../store';
import { ZoneCard } from '../components/dashboard/ZoneCard';
import { Gauge } from '../components/dashboard/Gauge';
import { CauseChart } from '../components/dashboard/CauseChart';
import { ForecastChart } from '../components/dashboard/ForecastChart';
import { TrendingUp, ShieldCheck, Download } from 'lucide-react';

// CHANGE 1: Status color helper for the ticker
function getStatusColor(status: string): string {
  switch (status) {
    case 'DANGEROUS': return '#ff3b3b';
    case 'MODERATE':  return '#ff9500';
    case 'FAIR':      return '#ffd60a';
    case 'GOOD':
    default:          return '#34c759';
  }
}

// ── PDF REPORT GENERATOR ────────────────────────────────────────────────────
// Professional multi-page PDF using jsPDF only — no html2canvas, no screenshots.
// Helvetica throughout. White bg, teal/green/amber/red accents.
function handleExport(zonesData: { id: string; name: string; ppm: number; status: string; aqi: number; causes: { name: string; value: number }[] }[]) {
  import('jspdf').then(({ jsPDF }) => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210;
    const H = 297;
    const M = 15; // margin
    const CW = W - M * 2; // content width

    // ── Palette ─────────────────────────────────────────────────────────────
    const NAVY   = '#0a2540';
    const TEXT   = '#1a1a2e';
    const GREY   = '#666666';
    const LTGREY = '#f5f5f5';
    const GREEN  = '#34c759';
    const AMBER  = '#ff9500';
    const RED    = '#ff3b3b';
    const WHITE  = '#ffffff';

    function rgb(hex: string): [number, number, number] {
      return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
    }
    function fill(c: string)  { pdf.setFillColor(...rgb(c)); }
    function draw(c: string)  { pdf.setDrawColor(...rgb(c)); }
    function txt(c: string)   { pdf.setTextColor(...rgb(c)); }

    function statusCol(s: string): string {
      if (s === 'DANGEROUS') return RED;
      if (s === 'MODERATE')  return AMBER;
      if (s === 'FAIR')      return AMBER;
      return GREEN;
    }

    // ── Date formatting ─────────────────────────────────────────────────────
    const now = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} at ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} ${now.getHours() >= 12 ? 'pm' : 'am'}`;

    // ── Sorted zones ────────────────────────────────────────────────────────
    const sorted = [...zonesData].sort((a, b) => b.ppm - a.ppm);
    const avgPPM = Math.round(zonesData.reduce((s, z) => s + z.ppm, 0) / zonesData.length);
    const worst = sorted[0];
    const best = sorted[sorted.length - 1];
    const totalPages = 2;

    // ── Reusable Header ─────────────────────────────────────────────────────
    function drawHeader() {
      // Top Left
      txt(NAVY);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.text('CARBONMIND', M, 18);
      
      txt(GREY);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text('Urban CO2 Intelligence Report', M, 24);

      // Top Right
      pdf.setFontSize(8);
      pdf.text(`Generated: ${dateStr}`, W - M, 16, { align: 'right' });
      pdf.text(`Live Sensor: ${avgPPM} PPM`, W - M, 21, { align: 'right' });

      // Horizontal Rule
      draw(NAVY);
      pdf.setLineWidth(0.8);
      pdf.line(M, 28, W - M, 28);
    }

    // ── Reusable Footer ─────────────────────────────────────────────────────
    function drawFooter(pageNum: number) {
      txt('#999999');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.text(
        `CarbonMind - Urban CO2 Intelligence Report  |  Page ${pageNum} of ${totalPages}`,
        W / 2, H - 8, { align: 'center' }
      );
    }

    // ── Section heading ─────────────────────────────────────────────────────
    function sectionHead(title: string, yPos: number): number {
      txt(NAVY);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.text(title, M, yPos);
      return yPos + 8;
    }

    // ════════════════════════════════════════════════════════════════════════
    // PAGE 1: ZONE OVERVIEW + ANALYSIS + CAUSES
    // ════════════════════════════════════════════════════════════════════════
    drawHeader();
    let y = 40;
    y = sectionHead('SECTION 1: Zone Overview', y);

    // Table column headers
    const colX = [M, M + 14, M + 50, M + 80, M + 112, M + 140];
    const colLabels = ['Rank', 'Zone', 'PPM', 'Status', 'AQI', 'Trend'];
    fill(NAVY);
    pdf.rect(M, y - 3, CW, 10, 'F');
    txt(WHITE);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    colLabels.forEach((label, i) => pdf.text(label, colX[i] + 2, y + 4));
    y += 12;

    // Table rows
    sorted.forEach((zone, idx) => {
      fill(idx % 2 === 0 ? WHITE : LTGREY);
      pdf.rect(M, y - 3, CW, 10, 'F');

      txt(TEXT);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`#${idx + 1}`, colX[0] + 2, y + 4);

      pdf.setFont('helvetica', 'bold');
      pdf.text(zone.name, colX[1] + 2, y + 4);

      pdf.setFont('helvetica', 'normal');
      pdf.text(String(Math.round(zone.ppm)), colX[2] + 2, y + 4);

      const sc = statusCol(zone.status);
      txt(sc);
      pdf.setFont('helvetica', 'bold');
      pdf.text(zone.status, colX[3] + 2, y + 4);

      txt(TEXT);
      pdf.setFont('helvetica', 'normal');
      pdf.text(String(zone.aqi), colX[4] + 2, y + 4);

      const trendArr = (zone as any).trend;
      let delta = 0;
      if (trendArr && trendArr.length >= 2) {
        delta = Math.round(trendArr[trendArr.length - 1] - trendArr[0]);
      }
      const trendStr = delta >= 0 ? `+${delta}` : `${delta}`;
      const arrow = delta >= 0 ? ' \u2191' : ' \u2193';
      txt(delta >= 0 ? RED : GREEN);
      pdf.text(trendStr + arrow, colX[5] + 2, y + 4);

      y += 10;
    });
    y += 5;

    // ── SECTION 2: Analysis Summary ──────────────────────────────────────
    y = sectionHead('SECTION 2: Analysis Summary', y);
    txt(TEXT);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const aboveThreshold = zonesData.filter(z => z.ppm > 120).length;
    const overallTrend = avgPPM > 100 ? 'Rising - Action Required' : 'Stable';
    const bullets = [
      `Most Polluted Zone: ${worst.name} (${Math.round(worst.ppm)} PPM)`,
      `Cleanest Zone: ${best.name} (${Math.round(best.ppm)} PPM)`,
      `Live Room Sensor: ${avgPPM} PPM (Stable)`,
      `Average City PPM: ${avgPPM} PPM`,
      `Zones Above 120 PPM: ${aboveThreshold} of 7`,
      `Overall Trend: ${overallTrend}`,
    ];
    bullets.forEach(b => {
      pdf.text('   ' + b, M, y);
      y += 6;
    });
    y += 8;

    // ── SECTION 3: Primary Pollution Causes ──────────────────────────────
    y = sectionHead('SECTION 3: Primary Pollution Causes', y);
    const causes = [
      { t: 'Industrial Emissions', d: 'Factories along Porur-Ramapuram and Perungudi belts release continuous CO2 through manufacturing processes and power generation.' },
      { t: 'Traffic Congestion', d: 'OMR, GST Road, and Mount Poonamallee Road carry 50,000+ vehicles daily, creating persistent exhaust emissions during peak hours.' },
      { t: 'Construction Dust', d: 'Metro Phase 2 and 14+ active construction sites in Perungudi-Alandur corridor generate significant particulate matter.' },
      { t: 'Landfill Decomposition', d: 'Perungudi landfill active methane and CO2 release from organic waste decomposition.' },
      { t: 'Poor Air Circulation', d: 'Unfavorable wind patterns trap pollutants in interior zones, preventing natural dispersal.' }
    ];
    causes.forEach(c => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('   ' + c.t, M, y);
      y += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const lines = pdf.splitTextToSize(c.d, CW - 10);
      pdf.text(lines, M + 8, y);
      y += lines.length * 4.5 + 4;
    });

    drawFooter(1);

    // ════════════════════════════════════════════════════════════════════════
    // PAGE 2: SOLUTIONS + COST + PRIORITY
    // ════════════════════════════════════════════════════════════════════════
    pdf.addPage();
    drawHeader();
    y = 40;
    y = sectionHead('SECTION 4: Recommended Solutions', y);
    const solutions = [
      { t: 'Smart Traffic Control Systems', d: 'AI-optimized signals at 12 key junctions with estimated 15-25% emission reduction in targeted corridors.' },
      { t: 'Urban Green Belt Expansion', d: 'Plant 2,000 trees/km along OMR and GST Road medians within a 6-month implementation timeline.' },
      { t: 'Industrial Emission Regulation', d: 'Mandate scrubbers for all factories exceeding 500 sq.m. in Ramapuram-Porur industrial belt.' },
      { t: 'IoT + AI Monitoring Network', d: 'Deploy 500 MQ-135 sensor nodes across Chennai for real-time predictive analytics and early warning.' },
      { t: 'EV Fleet Conversion', d: 'Convert CMBT diesel fleet and auto-rickshaws to CNG/electric vehicles for an estimated 28% CO2 reduction.' }
    ];
    solutions.forEach(s => {
      pdf.setFont('helvetica', 'bold');
      pdf.text('   ' + s.t, M, y);
      y += 5;
      pdf.setFont('helvetica', 'normal');
      const lines = pdf.splitTextToSize(s.d, CW - 10);
      pdf.text(lines, M + 8, y);
      y += lines.length * 4.5 + 4;
    });
    y += 6;

    // ── SECTION 5: Cost Estimate ──────────────────────────────────────
    y = sectionHead('SECTION 5: Cost Estimate', y);
    const costCols = [M, M + 62, M + 118];
    const costHeaders = ['Item', 'Cost Range', 'Notes'];
    fill(NAVY);
    pdf.rect(M, y - 3, CW, 10, 'F');
    txt(WHITE);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    costHeaders.forEach((h, i) => pdf.text(h, costCols[i] + 2, y + 4));
    y += 12;

    const costRows = [
      ['IoT Sensor Unit (MQ-135 + ESP32)', 'Rs.5,000 - Rs.15,000', 'Per sensor node'],
      ['Installation & Wiring', 'Rs.2,000 - Rs.5,000', 'Per site'],
      ['Monthly Maintenance', 'Rs.1,000/month', 'Per unit'],
      ['Cloud Infrastructure', 'Rs.8,000/month', 'For 500 nodes'],
      ['Dashboard + AI Platform', 'Rs.2,50,000 one-time', 'Development cost'],
    ];
    costRows.forEach((row, idx) => {
      fill(idx % 2 === 0 ? WHITE : LTGREY);
      pdf.rect(M, y - 3, CW, 10, 'F');
      txt(TEXT);
      pdf.setFont('helvetica', 'normal');
      pdf.text(row[0], costCols[0] + 2, y + 4);
      pdf.setFont('helvetica', 'bold');
      pdf.text(row[1], costCols[1] + 2, y + 4);
      pdf.setFont('helvetica', 'normal');
      txt(GREY);
      pdf.text(row[2], costCols[2] + 2, y + 4);
      y += 10;
    });
    y += 10;

    // ── SECTION 6: Priority Recommendations ──────────────────────────────
    y = sectionHead('SECTION 6: Priority Recommendations', y);
    const priorities = [
      { t: 'IMMEDIATE (0-2 weeks)', items: ['Deploy construction dust barriers at all Metro Phase 2 sites', 'Activate smart traffic signals at OMR-Velachery junction', 'Install green mesh around Perungudi landfill perimeter'] },
      { t: 'SHORT-TERM (1-6 months)', items: ['Convert CMBT bus depot fleet to CNG (Rs.1.8 Cr)', 'Deploy 100 IoT sensor nodes across priority zones', 'Launch EV auto-rickshaw program in Anna Nagar corridor'] },
      { t: 'LONG-TERM (6-18 months)', items: ['Complete industrial scrubber mandate for Ramapuram belt', 'Plant 2,000-tree green belt along OMR and GST Road', 'Scale IoT network to 500 nodes citywide'] }
    ];
    priorities.forEach(p => {
      txt(TEXT);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('   ' + p.t, M, y);
      y += 6;
      pdf.setFont('helvetica', 'normal');
      p.items.forEach(item => {
        pdf.text('      ' + item, M, y);
        y += 5;
      });
      y += 4;
    });

    drawFooter(2);

    // ── SAVE ────────────────────────────────────────────────────────────────
    const dateSlug = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    pdf.save(`carbonmind-report-${dateSlug}.pdf`);
  });
}

export default function Dashboard() {
  const { zones, selectedZoneId, selectZone, updateZonePpm } = useStore();
  const selectedZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  // MQTT gauge always mirrors Ramapuram — pinned independently of selectedZone
  const ramapuramZone = zones.find(z => z.id === 'ramapuram') || zones[0];
  const mqttPpm = ramapuramZone.ppm;
  const mqttStatus =
    mqttPpm > 200 ? 'CRITICAL' :
    mqttPpm > 130 ? 'MODERATE' :
    mqttPpm > 80  ? 'FAIR' :
                    'GOOD';

  useEffect(() => {
    const timer = setInterval(() => {
      zones.forEach(zone => {
        const offset = Math.floor(Math.random() * 5) - 2; 
        updateZonePpm(zone.id, zone.ppm + offset);
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [zones, updateZonePpm]);

  // Sort zones by PPM descending (most polluted first)
  const sortedZones = useMemo(
    () => [...zones].sort((a, b) => b.ppm - a.ppm),
    [zones]
  );

  // CHANGE 1: Build ticker items once (duplicated for seamless loop)
  const tickerItems = useMemo(() => {
    const items = zones.map(zone => ({
      name: zone.name,
      status: zone.status,
      ppm: zone.ppm,
      color: getStatusColor(zone.status),
    }));
    // Duplicate for seamless marquee scroll
    return [...items, ...items];
  }, [zones]);

  return (
    <div className="flex flex-col gap-6 mx-auto min-h-[calc(100vh-80px)] bg-carbon-bg overflow-x-hidden">
      
      {/* ── CHANGE 1: Scrolling Ticker Marquee ────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#0a1a0f',
          borderBottom: '1px solid #00ff88',
          height: '32px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          flexShrink: 0,
        }}
      >
        <div
          className="animate-marquee"
          style={{
            display: 'flex',
            width: 'max-content',
            whiteSpace: 'nowrap',
            alignItems: 'center',
          }}
        >
          {tickerItems.map((item, idx) => (
            <span
              key={idx}
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: item.color,
                paddingLeft: idx === 0 || idx === zones.length ? '0' : '0',
              }}
            >
              <span style={{ color: item.color }}>●&nbsp;</span>
              <span style={{ color: item.color }}>{item.name}</span>
              <span style={{ color: item.color }}>&nbsp;&nbsp;{item.status}&nbsp;&nbsp;{item.ppm} ppm</span>
              <span style={{ color: '#00ff88', opacity: 0.4 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;◆&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </span>
          ))}
        </div>
      </div>

      {/* Content area with padding */}
      <div className="flex flex-col gap-6 p-6">

        {/* TOP ROW: Zone Grid - auto-sorted by PPM descending */}
        <LayoutGroup>
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {sortedZones.map((zone) => (
              <ZoneCard 
                key={zone.id}
                zone={zone} 
                isSelected={selectedZoneId === zone.id}
                onClick={() => selectZone(zone.id)}
              />
            ))}
          </div>
        </LayoutGroup>

        {/* MAIN INTELLIGENCE GRID: 3 Equal Panels */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-grow">
          
          {/* PANEL 1: LIVE SENSOR — pinned to Ramapuram */}
          <div className="panel-card flex flex-col items-center justify-between border-carbon-primary/10">
             <div className="w-full">
                <div className="panel-title" style={{ fontSize: '13px', letterSpacing: '0.12em', color: '#00ff88' }}>LIVE MQTT SENSOR</div>
             </div>

             <div className="flex-grow flex items-center justify-center py-10 w-full">
                <Gauge value={mqttPpm} label="Real-time" />
             </div>

             <div className="w-full space-y-8">
                <div className="flex flex-col items-center gap-4">
                   {/* Status badge — derived from Ramapuram PPM thresholds */}
                   <div style={{
                     padding: '8px 20px',
                     border: `1.5px solid ${
                       mqttStatus === 'CRITICAL' ? '#ff3b3b' :
                       mqttStatus === 'MODERATE' ? '#ff9500' :
                       mqttStatus === 'FAIR'     ? '#ffd60a' :
                                                   '#00ff88'
                     }`,
                     borderRadius: '8px',
                     backgroundColor: `${
                       mqttStatus === 'CRITICAL' ? 'rgba(255,59,59,0.05)' :
                       mqttStatus === 'MODERATE' ? 'rgba(255,149,0,0.05)' :
                       mqttStatus === 'FAIR'     ? 'rgba(255,214,10,0.05)' :
                                                   'rgba(0,255,136,0.05)'
                     }`,
                   }}>
                     <span style={{
                       fontSize: '13px',
                       fontFamily: 'Orbitron, sans-serif',
                       fontWeight: 700,
                       letterSpacing: '0.2em',
                       color:
                         mqttStatus === 'CRITICAL' ? '#ff3b3b' :
                         mqttStatus === 'MODERATE' ? '#ff9500' :
                         mqttStatus === 'FAIR'     ? '#ffd60a' :
                                                     '#00ff88',
                     }}>
                       {mqttStatus === 'GOOD' ? 'SYSTEM STABLE' : mqttStatus}
                     </span>
                   </div>
                   <p className="text-[10px] text-white/30 text-center uppercase tracking-widest leading-relaxed max-w-[300px]">
                     Ramapuram IoT node — real-time carbon density feed.
                   </p>
                </div>
             </div>
          </div>

          {/* PANEL 2: CAUSE BREAKDOWN */}
          <div className="panel-card flex flex-col border-white/5">
             {/* CHANGE 4: Section heading scale-up */}
             <div className="panel-title" style={{ fontSize: '13px', letterSpacing: '0.12em', color: '#00ff88' }}>
               CAUSE BREAKDOWN — {selectedZone.name}
             </div>
             <div className="flex-grow pt-4">
                <CauseChart />
             </div>
          </div>

          {/* PANEL 3: FORECAST ANALYSIS */}
          <div className="panel-card flex flex-col border-white/5">
             {/* CHANGE 4: Section heading scale-up */}
             <div className="panel-title" style={{ fontSize: '13px', letterSpacing: '0.12em', color: '#00ff88' }}>30-MIN FORECAST ANALYSIS</div>
             <div className="flex-grow pt-4">
                <ForecastChart />
             </div>
          </div>

        </div>

        {/* ── CHANGE 2 + 4: City Economic Loss Forecast bar with prominent Export Button ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2.5rem',
            padding: '1rem 2rem',
            backgroundColor: 'rgba(10,31,18,0.40)',
            borderRadius: '1rem',
            border: '1px solid rgba(255,255,255,0.03)',
          }}
        >
          <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* CHANGE 4: Inaction cost typography */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'Rajdhani, sans-serif', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Inaction Risk</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem', fontFamily: 'Orbitron, sans-serif', fontWeight: 700, color: '#ff3b3b', lineHeight: 1 }}>₹8.82 CR</span>
                <TrendingUp style={{ width: '16px', height: '16px', color: '#ff3b3b' }} className="animate-pulse" />
              </div>
            </div>

            {/* CHANGE 4: Active Intelligence typography */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'Rajdhani, sans-serif', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Intelligence</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.6rem', fontFamily: 'Orbitron, sans-serif', fontWeight: 700, color: '#ff9500', lineHeight: 1 }}>VayuBot v4.0</span>
                <ShieldCheck style={{ width: '16px', height: '16px', color: '#00ff88' }} />
              </div>
            </div>

            {/* CHANGE 4: Safe Buffer typography */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'Rajdhani, sans-serif', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Telemetry</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', backgroundColor: '#00ff88', borderRadius: '50%' }} className="animate-pulse" />
                <span style={{ fontSize: '1.6rem', fontFamily: 'Orbitron, sans-serif', fontWeight: 700, color: '#34c759', lineHeight: 1, letterSpacing: '-0.02em' }}>SRM-HUB</span>
              </div>
            </div>
          </div>

          {/* CHANGE 2: Prominent Export Report Button */}
          <button
            onClick={() => handleExport(zones)}
            style={{
              minWidth: '180px',
              height: '48px',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '14px',
              letterSpacing: '0.1em',
              fontWeight: 600,
              padding: '12px 24px',
              background: 'transparent',
              border: '2px solid #00ff88',
              color: '#00ff88',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget;
              btn.style.background = '#00ff88';
              btn.style.color = '#060b12';
              btn.style.boxShadow = '0 0 12px rgba(0,255,136,0.3)';
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget;
              btn.style.background = 'transparent';
              btn.style.color = '#00ff88';
              btn.style.boxShadow = 'none';
            }}
          >
            <Download style={{ width: '16px', height: '16px' }} />
            ⬇ EXPORT REPORT
          </button>
        </div>

      </div>
    </div>
  );
}
