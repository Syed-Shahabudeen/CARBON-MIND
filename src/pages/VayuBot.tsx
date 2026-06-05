import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, Mic, Volume2, Loader2, RotateCcw, Square } from 'lucide-react';
// Removed GoogleGenAI import in favor of backend proxy
import { useStore } from '../store';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export default function VayuBot() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { messages, addMessage, zones } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // AI is now handled via secure backend proxy on /api/chat

  const greetingRunning = useRef(false);

  useEffect(() => {
    if (messages.length === 0 && !greetingRunning.current) {
      greetingRunning.current = true;
      const greeting = "I am VayuBot, your Urban Intelligence Officer. I am currently monitoring 7 atmospheric zones in Chennai. Perungudi and Velachery are currently exceeding safe CO2 thresholds—how can I assist you with a municipal intervention strategy?";
      addMessage({ id: Date.now().toString(), role: 'assistant', content: greeting });
      speakText(greeting);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleSend = async (customInput?: any) => {
    const textToSend = (typeof customInput === 'string' ? customInput : input) || '';
    if (!textToSend.trim() || isTyping) return;

    const userMessage = { id: Date.now().toString(), role: 'user' as const, content: textToSend };
    addMessage(userMessage);
    if (!customInput) setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage),
          zones: zones
        }),
      });

      // Safely parse JSON
      let data;
      const responseText = await response.text();
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Invalid JSON response:', responseText);
        throw new Error('Intelligence relay returned an invalid response. Please ensure back-end server is running.');
      }

      if (!response.ok || data.error) {
        throw new Error(data.error || `Link failure (Status: ${response.status})`);
      }

      const aiResponse = data.content || "Communication relay failure. Re-establishing link...";
      addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponse });
      speakText(aiResponse);
    } catch (error: any) {
      console.error(error);
      const isNetworkError = error.message.includes('fetch') || error.message.includes('invalid response');
      toast.error(isNetworkError ? 'Backend Link Offline (Check server console)' : error.message);
      
      // Fallback message to prevent stuck UI
      addMessage({ 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "⚠️ SYSTEM OFFLINE: VayuBot backend is unreachable. Direct municipal link interrupted. Please verify the CarbonMind server status." 
      });
    } finally {
      setIsTyping(false);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <div className="h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center overflow-hidden bg-carbon-bg relative p-6">
      {/* Background atmospheric effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-carbon-primary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Header - Top Left */}
      <div className="absolute top-10 left-10 z-50 flex items-center gap-6 organic-card border-none bg-[#0a1f12]/60 p-6 shadow-2xl backdrop-blur-xl">
        <div className="w-12 h-12 rounded-[18px] bg-carbon-primary/10 border border-carbon-primary/20 flex items-center justify-center">
          <Bot className="w-7 h-7 text-carbon-primary" />
        </div>
        <div>
          <h1 className="font-orbitron font-medium text-xl tracking-tight text-white mb-1 uppercase">VayuBot Intelligence</h1>
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">Decision Intelligence Relay v4.0</p>
        </div>
      </div>

      {/* Floating Controls - Top Right */}
      <div className="absolute top-10 right-10 z-50 flex items-center gap-4 organic-card border-none bg-[#0a1f12]/60 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex -space-x-3 mr-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-carbon-bg bg-carbon-card flex items-center justify-center overflow-hidden">
                <img src={`https://picsum.photos/seed/env${i}/32/32`} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-60" />
              </div>
            ))}
        </div>
        <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
          <div className={cn("w-1.5 h-1.5 rounded-full bg-carbon-primary shadow-[0_0_8px_#00ff88]", isSpeaking && "animate-pulse scale-125")} />
          <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Active Relay</span>
        </div>
        <button onClick={() => {
          useStore.getState().messages = [];
          greetingRunning.current = false;
          window.location.reload(); 
        }} className="p-2 text-white/30 hover:text-white transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Full-size Chat Interface */}
      <div className="w-full h-full flex flex-col justify-end max-w-4xl pt-40 pb-52 relative px-4">
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-12 custom-scrollbar p-6">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 260, damping: 20 }}
                className={cn("flex flex-col gap-2 max-w-[85%]", msg.role === 'user' ? "ml-auto items-end text-right" : "mr-auto")}
              >
                <div className={cn(
                  "p-5 px-7 text-[15px] leading-relaxed shadow-lg backdrop-blur-md", 
                  msg.role === 'user' 
                    ? "bg-carbon-primary/8 border border-carbon-primary/20 rounded-[28px] rounded-tr-[4px] text-carbon-primary" 
                    : "bg-white/[0.04] border border-white/10 rounded-[28px] rounded-tl-[4px] text-white/90"
                )}>
                  {msg.content}
                  {msg.role === 'assistant' && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4">
                      <button
                        onClick={() => speakText(msg.content)}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-carbon-primary transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Play Audio
                      </button>
                      {isSpeaking && (
                        <button
                          onClick={stopSpeaking}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: '#00ff88',
                            border: '1px solid #00ff88',
                            borderRadius: '4px',
                            padding: '3px 9px',
                            background: 'rgba(0,255,136,0.06)',
                            cursor: 'pointer',
                            fontFamily: 'Orbitron, sans-serif',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,255,136,0.14)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,255,136,0.06)')}
                        >
                          <Square style={{ width: '10px', height: '10px', fill: '#00ff88' }} />
                          STOP
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="bg-white/5 border border-white/10 p-5 rounded-[24px] inline-flex gap-2 mr-auto ml-0 shadow-xl">
                <div className="w-1.5 h-1.5 bg-carbon-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-carbon-primary rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                <div className="w-1.5 h-1.5 bg-carbon-primary rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Stats - Bottom Right */}
      <div className="absolute bottom-32 right-10 z-50 organic-card border-none bg-[#0a1f12]/60 p-8 shadow-2xl backdrop-blur-xl w-72">
        <div className="panel-title mb-6">Live Assets</div>

        {/* MQTT Sensor — mirrors Ramapuram PPM exactly */}
        {(() => {
          const ramapuram = zones.find(z => z.id === 'ramapuram');
          const ppm = ramapuram?.ppm ?? 0;
          const mqttColor =
            ppm > 130 ? '#ff3b3b' :
            ppm > 80  ? '#ffd60a' :
                        '#00ff88';
          const mqttLabel =
            ppm > 130 ? 'CRITICAL' :
            ppm > 80  ? 'MODERATE' :
                        'SAFE';
          return (
            <div
              style={{
                marginBottom: '18px',
                padding: '10px 12px',
                background: 'rgba(0,0,0,0.25)',
                border: `1px solid ${mqttColor}44`,
                borderRadius: '6px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'Share Tech Mono, monospace' }}>
                  ⬡ MQTT SENSOR — RAMAPURAM
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'Orbitron, monospace', fontWeight: 900, color: mqttColor }}>
                  {Math.round(ppm)} ppm
                </span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((ppm / 200) * 100, 100)}%` }}
                  transition={{ duration: 1 }}
                  style={{ height: '100%', background: mqttColor, borderRadius: '2px' }}
                />
              </div>
              <div style={{ marginTop: '5px', fontSize: '8px', fontFamily: 'Share Tech Mono, monospace', color: mqttColor, letterSpacing: '0.15em', opacity: 0.9 }}>
                {mqttLabel}
              </div>
            </div>
          );
        })()}

        <div className="space-y-5">
          {zones.slice(0, 4).map(z => {
            const zoneColor =
              z.ppm > 130 ? '#ff3b3b' :
              z.ppm > 80  ? '#ffd60a' :
                            '#00ff88';
            return (
              <div key={z.id} className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{z.name}</span>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, color: zoneColor }}>
                    {z.ppm}
                  </span>
                </div>
                <div className="h-[1.5px] w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((z.ppm / 200) * 100, 100)}%` }}
                    style={{ height: '100%', background: zoneColor, borderRadius: '9999px', transition: 'all 1s' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Insight - Bottom Left */}
      <div className="absolute bottom-32 left-10 z-50 organic-card border-none bg-carbon-primary/5 p-8 shadow-2xl backdrop-blur-xl w-64">
        <div className="w-10 h-10 rounded-[14px] bg-carbon-primary/10 flex items-center justify-center border border-carbon-primary/20 mb-4">
          <Sparkles className="w-5 h-5 text-carbon-primary" />
        </div>
        <p className="text-[11px] font-light leading-relaxed text-white/40 italic font-orbitron">
          "Satellite telemetry active. Monitoring particulate movement in Chennai South."
        </p>
      </div>

      {/* Floating Input Area - Bottom Center */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-6">
        <div className="organic-card border-none bg-[#0a1f12]/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {["Why is Perungudi critical?", "Reduction cost?", "Health impact?"].map(q => (
              <button 
                key={q} 
                onClick={() => handleSend(q)} 
                className="px-5 py-2.5 bg-white/5 border border-white/10 text-white/30 text-[9px] font-bold rounded-full uppercase tracking-widest hover:text-white hover:border-carbon-primary/40 transition-all font-mono"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="relative">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              placeholder="Query atmospheric intelligence..." 
              className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-5 pr-44 font-light text-sm tracking-wide text-white focus:border-carbon-primary/50 outline-none placeholder:text-white/20" 
            />
            <div className="absolute right-2 top-2 bottom-2 flex gap-2">
              <button onClick={startVoice} className="p-4 text-white/40 hover:text-carbon-primary transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleSend()} 
                disabled={!input.trim() || isTyping} 
                className="px-10 bg-white text-black rounded-full font-bold text-[9px] tracking-[0.2em] hover:bg-carbon-primary transition-all disabled:opacity-20 uppercase"
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
