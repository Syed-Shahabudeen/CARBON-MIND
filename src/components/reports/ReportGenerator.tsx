import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Download, Loader2 } from 'lucide-react';
import { useStore } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export const ReportGenerator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { zones } = useStore();

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const date = new Date().toISOString().split('T')[0];

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('CARBONMIND - URBAN INTELLIGENCE REPORT', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${date}`, 105, 28, { align: 'center' });
      doc.line(20, 35, 190, 35);

      // Zone Overview Table
      doc.setFont('helvetica', 'bold');
      doc.text('1. ZONE OVERVIEW', 20, 45);
      
      let y = 55;
      doc.setFontSize(9);
      doc.setFillColor(230, 230, 230);
      doc.rect(20, y, 170, 7, 'F');
      doc.text('ZONE NAME', 25, y + 5);
      doc.text('STATUS', 80, y + 5);
      doc.text('PPM', 120, y + 5);
      doc.text('AQI', 150, y + 5);
      
      y += 7;
      zones.forEach((zone, index) => {
        if (index % 2 === 1) {
          doc.setFillColor(245, 245, 245);
          doc.rect(20, y, 170, 7, 'F');
        }
        doc.setFont('helvetica', 'normal');
        doc.text(zone.name, 25, y + 5);
        doc.text(zone.status, 80, y + 5);
        doc.text(zone.ppm.toString(), 120, y + 5);
        doc.text(zone.aqi.toString(), 150, y + 5);
        y += 7;
      });

      // Analysis Summary
      y += 15;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('2. ANALYSIS SUMMARY', 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const summaryPoints = [
        '- Highest pollution node detected in Velachery (148 PPM).',
        '- Primary city-wide cause identified as Vehicle Emissions (42% average).',
        '- Economic burden of inaction estimated at Rs. 8.8 Cr for the current quarter.',
        '- Positive trend detected in Tambaram due to successful green belt projects.'
      ];
      summaryPoints.forEach(point => {
        doc.text(point, 25, y);
        y += 6;
      });

      // Recommended Solutions
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('3. RECOMMENDED SOLUTIONS & COSTS', 20, y);
      y += 8;
      
      const solutions = [
        { item: 'Green Belt Expansion', cost: 'Rs. 1.2 Cr', time: '8 Mo' },
        { item: 'Traffic Restriction II', cost: 'Rs. 0.9 Cr', time: '2 Mo' },
        { item: 'Industrial Scrubber Upgrade', cost: 'Rs. 1.8 Cr', time: '5 Mo' }
      ];

      doc.setFillColor(200, 200, 200);
      doc.rect(20, y, 170, 7, 'F');
      doc.text('INTERVENTION', 25, y + 5);
      doc.text('EST. COST', 100, y + 5);
      doc.text('TIMELINE', 150, y + 5);
      
      y += 7;
      solutions.forEach(sol => {
        doc.setFont('helvetica', 'normal');
        doc.text(sol.item, 25, y + 5);
        doc.text(sol.cost, 100, y + 5);
        doc.text(sol.time, 150, y + 5);
        y += 7;
      });

      // Footer
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        doc.text('CarbonMind Decision Support System | Strictly Confidential', 20, 285);
      }

      doc.save(`carbonmind-report-${date}.pdf`);
      toast.success('Report exported successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-carbon-primary text-black px-4 py-1.5 font-bold rounded-sm text-[11px] uppercase tracking-wider hover:opacity-90 transition-opacity"
      >
        Export Report (PDF)
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-carbon-bg border border-white/10 p-8 rounded-2xl w-full max-w-md relative z-10"
            >
              <h3 className="font-orbitron font-bold text-xl mb-2 text-glow-primary">REPORT PARAMETERS</h3>
              <p className="text-white/40 text-sm mb-6 font-mono uppercase tracking-tighter">SELECT EXPORT FORMAT AND SCOPE</p>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-carbon-card border border-carbon-primary/20 rounded-xl flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-carbon-primary" />
                    <div>
                      <p className="font-orbitron text-xs tracking-widest">PDF DOCUMENT</p>
                      <p className="text-[10px] text-white/40 font-mono">STANDARDIZED ANALYTICS REPORT</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 border-2 border-carbon-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-carbon-primary rounded-full" />
                  </div>
                </div>

                <div className="p-4 bg-carbon-card/50 border border-white/5 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center text-white/40 font-mono font-bold">CSV</div>
                    <div>
                      <p className="font-orbitron text-xs tracking-widest">RAW DATA EXPORT</p>
                      <p className="text-[10px] text-white/40 font-mono">LOCK BY ADMIN</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl text-xs font-orbitron tracking-widest hover:bg-white/10 transition-all"
                >
                  CANCEL
                </button>
                <button 
                  onClick={generatePDF}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-3 bg-carbon-primary text-black rounded-xl text-xs font-orbitron font-bold tracking-widest hover:glow-primary transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isGenerating ? 'GENERATING...' : 'CONFIRM EXPORT'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
