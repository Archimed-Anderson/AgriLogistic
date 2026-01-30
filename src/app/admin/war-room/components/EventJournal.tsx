import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Terminal, 
  Download,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'security';
  source: string;
  message: string;
}

const SOURCES = ['AUTH_SVC', 'API_GW', 'DB_POSTGRES', 'LOGISTIC_CORE', 'MARKETPLACE'];
const LEVELS: LogEntry['level'][] = ['info', 'warn', 'error', 'security'];

const INITIAL_LOGS: LogEntry[] = [
  { id: '1', timestamp: '19:42:01', level: 'info', source: 'AUTH_SVC', message: 'Token JWT généré pour USER_842.' },
  { id: '2', timestamp: '19:42:05', level: 'error', source: 'DB_POSTGRES', message: 'Connexion refusée par le réplica de lecture.' },
  { id: '3', timestamp: '19:42:08', level: 'security', source: 'API_GW', message: 'Tentative d\'intrusion brute-force détectée (IP_124.5.x.x).' },
  { id: '4', timestamp: '19:42:12', level: 'warn', source: 'LOGISTIC_CORE', message: 'Temps de réponse élevé sur le trajet DAK-THS.' },
];

export function EventJournal() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [filter, setFilter] = useState<LogEntry['level'] | 'all'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour12: false }),
        level: LEVELS[Math.floor(Math.random() * LEVELS.length)],
        source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
        message: `Événement système automatisé détecté sur ${SOURCES[Math.floor(Math.random() * SOURCES.length)]}.`,
      };
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.level === filter);

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border rounded-[32px] overflow-hidden flex flex-col h-full shadow-2xl transition-all hover:bg-card/50">
      {/* Header */}
      <div className="p-6 border-b border-border bg-foreground/5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-foreground uppercase tracking-tighter">Journal d'Événements</h3>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Syslog Integration</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-xl bg-foreground/5 hover:bg-foreground/10">
            <Download className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['all', ...LEVELS].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl as any)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                filter === lvl 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
                  : 'bg-background/50 border-border text-muted-foreground hover:border-primary/30'
              )}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10 p-4 space-y-3"
      >
        <AnimatePresence initial={false}>
          {filteredLogs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4 group"
            >
              <div className="flex flex-col items-center pt-1">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  log.level === 'error' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' :
                  log.level === 'warn' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' :
                  log.level === 'security' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'bg-emerald-500'
                )} />
                <div className="w-px flex-1 bg-border/20 my-1 group-last:hidden" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono text-muted-foreground font-bold">{log.timestamp}</span>
                  <span className={cn(
                    "text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-[0.1em]",
                    log.level === 'error' ? 'bg-rose-500/10 text-rose-500' :
                    log.level === 'warn' ? 'bg-amber-500/10 text-amber-500' :
                    log.level === 'security' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                  )}>{log.level}</span>
                  <span className="text-[9px] font-black text-primary/80 uppercase tracking-tight italic">@ {log.source}</span>
                </div>
                <p className="text-[11px] text-foreground/80 leading-relaxed font-medium group-hover:text-foreground transition-colors">
                  {log.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-foreground/5 border-t border-border flex items-center justify-between">
         <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground uppercase tracking-widest">
            <Terminal size={12} className="text-primary" />
            Live Buffer: {logs.length}/50
         </div>
         <div className="flex items-center gap-1 text-[8px] font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer group uppercase tracking-widest">
           Analyse Granulaire <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
         </div>
      </div>
    </div>
  );
}
