import React, { useState } from 'react';
import { 
  Zap, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Search,
  Globe,
  Database,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface DiagnosticTest {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'idle' | 'running' | 'success' | 'error';
  lastRun?: string;
  result?: string;
}

export function DiagnosticSuite() {
  const [tests, setTests] = useState<DiagnosticTest[]>([
    { id: 'ping', name: 'Latence Passerelle', description: 'Vérifie la latence vers le gateway API principal.', icon: Globe, status: 'idle' },
    { id: 'db', name: 'Intégrité Base de Données', description: 'Analyse l\'état des réplicas PostgreSQL.', icon: Database, status: 'idle' },
    { id: 'disk', name: 'Scan S.M.A.R.T', description: 'Vérifie l\'état de santé physique des disques.', icon: Zap, status: 'idle' },
    { id: 'auth', name: 'Sync Auth Service', description: 'Valide la synchronisation des jetons JWT.', icon: ShieldCheck, status: 'idle' },
  ]);

  const runTest = (id: string) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, status: 'running' } : t));
    
    // Simulate test execution
    setTimeout(() => {
      setTests(prev => prev.map(t => {
        if (t.id === id) {
          const success = Math.random() > 0.15;
          return {
            ...t,
            status: success ? 'success' : 'error',
            lastRun: new Date().toLocaleTimeString(),
            result: success ? 'TEST NOMINAL (2ms)' : 'TIMEOUT_EXCEEDED (err_conn_refused)'
          };
        }
        return t;
      }));
    }, 2000);
  };

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border rounded-[32px] overflow-hidden flex flex-col h-full shadow-2xl transition-all hover:bg-card/50">
      {/* Header */}
      <div className="p-6 border-b border-border bg-foreground/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-foreground uppercase tracking-tighter">Suite Diagnostic</h3>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Tests en un clic</p>
          </div>
        </div>
        <RefreshCw className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
      </div>

      {/* Test List */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10">
        {tests.map((test) => (
          <div key={test.id} className="p-4 rounded-3xl bg-foreground/5 border border-border group transition-all hover:border-primary/30">
            <div className="flex items-start justify-between mb-3">
               <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2.5 rounded-2xl border transition-all duration-300",
                    test.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    test.status === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-background border-border text-muted-foreground group-hover:text-primary group-hover:border-primary/20'
                  )}>
                    <test.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-foreground uppercase tracking-tight">{test.name}</h4>
                    <p className="text-[9px] text-muted-foreground font-medium leading-[1.2] mt-0.5">{test.description}</p>
                  </div>
               </div>
               
               <AnimatePresence mode="wait">
                 {test.status === 'running' ? (
                   <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center"
                   >
                     <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                   </motion.div>
                 ) : (
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 rounded-xl bg-primary/5 hover:bg-primary/20 transition-all"
                    onClick={() => runTest(test.id)}
                    disabled={test.status === 'running'}
                   >
                     <Search className="w-4 h-4 text-primary" />
                   </Button>
                 )}
               </AnimatePresence>
            </div>

            {/* Test Result Bar */}
            <AnimatePresence>
              {(test.status === 'success' || test.status === 'error') && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-2 pt-2 border-t border-border/5 space-y-1"
                >
                   <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest tabular-nums">
                      <div className="flex items-center gap-1.5">
                        {test.status === 'success' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-rose-500" />}
                        <span className={test.status === 'success' ? 'text-emerald-500' : 'text-rose-500'}>{test.result}</span>
                      </div>
                      <span className="text-muted-foreground italic">{test.lastRun}</span>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-foreground/5 border-t border-border text-center">
         <p className="text-[8px] font-black text-muted-foreground opacity-40 uppercase tracking-[0.3em]">Module de Diagnostic v4.2</p>
      </div>
    </div>
  );
}
