import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { 
  Activity, 
  Info, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface LogEntry {
  timestamp: string;
  source: string;
  message: string;
  level: 'info' | 'warn' | 'error' | 'success';
}

const SOURCES = ['GATEWAY', 'AUTH_SVC', 'ORDER_API', 'LOGISTICS_ENG', 'PAYMENT_CORE', 'SYSTEM_WATCH'];
const MESSAGES = [
  'Request processed successfully',
  'Latency spike detected - US-EAST',
  'User session verified: token_exp=3600',
  'Order synchronization complete',
  'Payment pipeline healthy',
  'Route matrix recalculated for fleet_02',
  'Heartbeat check OK - all pods running',
  'High throughput on /v2/marketplace',
  'In-memory cache synchronized',
  'Cold storage backup initiated'
];

export function LiveLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(() => {
      const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
      const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      const levels: LogEntry['level'][] = ['info', 'info', 'info', 'success', 'warn', 'error'];
      const level = levels[Math.floor(Math.random() * levels.length)];
      
      const newLog: LogEntry = {
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour12: false }),
        source,
        message,
        level
      };

      setLogs(prev => [newLog, ...prev.slice(0, 49)]);

      if (level === 'warn' || level === 'error') {
        toast[level](`System Alert: ${source}`, {
          description: message,
          duration: 4000,
        });
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const getLevelStyles = (level: LogEntry['level']) => {
    switch (level) {
      case 'info': return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', Icon: Info };
      case 'warn': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', Icon: AlertTriangle };
      case 'error': return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', Icon: XCircle };
      case 'success': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', Icon: CheckCircle2 };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]/40 dark:bg-black/40 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl overflow-hidden font-mono">
      {/* Log Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
            <Activity className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-tighter">Real-time Event Stream</h3>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Active nodes: 14</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg">
          <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[8px] font-black text-rose-500 uppercase">Live Stream</span>
        </div>
      </div>

      {/* Log Stream Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scroll-smooth"
      >
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3">
            <Cpu className="w-8 h-8 animate-pulse text-zinc-600" />
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">Initializing stream...</p>
          </div>
        )}
        {logs.map((log, i) => {
          const styles = getLevelStyles(log.level);
          return (
            <div key={i} className="flex gap-4 group transition-all duration-300 transform animate-in slide-in-from-left-2 fade-in">
              <span className="text-[10px] text-zinc-600 font-bold tabular-nums pt-1 group-hover:text-zinc-400 transition-colors">
                {log.timestamp}
              </span>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] font-black border uppercase tracking-wider",
                    styles.bg, styles.color, styles.border
                  )}>
                    {log.level}
                  </span>
                  <span className="text-[9px] text-primary/80 font-black uppercase tracking-tight">{log.source}</span>
                </div>
                <div className="flex items-start gap-2">
                  <styles.Icon className={cn("w-3 h-3 mt-0.5 shrink-0", styles.color)} />
                  <p className="text-[11px] text-zinc-300 leading-tight group-hover:text-white transition-colors">
                    {log.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Footer */}
      <div className="px-6 py-3 border-t border-white/5 bg-white/5 flex items-center justify-between text-[8px] text-zinc-500 font-bold">
        <span>BUFF_SIZE: {logs.length}/50</span>
        <div className="flex items-center gap-4">
          <span className="text-emerald-500/70">ALL SYSTEMS GO</span>
          <span>GATE_VER: 4.2.1</span>
        </div>
      </div>
    </div>
  );
}
