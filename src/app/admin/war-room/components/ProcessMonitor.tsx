import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, MoreVertical, Power, Activity, Cpu, History } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

interface Process {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  memory: number;
  status: 'running' | 'sleeping' | 'stopped';
}

const INITIAL_PROCESSES: Process[] = [
  { pid: 1, name: 'systemd', user: 'root', cpu: 0.1, memory: 45, status: 'running' },
  { pid: 1420, name: 'AgriLogistic-api', user: 'admin', cpu: 12.5, memory: 850, status: 'running' },
  { pid: 1421, name: 'postgre-prod', user: 'postgres', cpu: 4.2, memory: 1200, status: 'running' },
  { pid: 1422, name: 'redis-cache', user: 'redis', cpu: 0.8, memory: 256, status: 'running' },
  { pid: 2105, name: 'worker-node-1', user: 'admin', cpu: 45.0, memory: 4100, status: 'running' },
  { pid: 2106, name: 'worker-node-2', user: 'admin', cpu: 0.0, memory: 512, status: 'sleeping' },
  { pid: 3001, name: 'nginx-ingress', user: 'www-data', cpu: 2.1, memory: 128, status: 'running' },
];

export function ProcessMonitor() {
  const [processes, setProcesses] = useState<Process[]>(INITIAL_PROCESSES);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Process>('cpu');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Simulate dynamic resource shifts
  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses((prev) =>
        prev.map((p) => ({
          ...p,
          cpu:
            p.status === 'running'
              ? Math.max(0.1, Number((p.cpu + (Math.random() * 2 - 1)).toFixed(1)))
              : 0,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sortedProcesses = [...processes]
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });

  const toggleSort = (field: keyof Process) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleKill = (pid: number, name: string) => {
    setProcesses((prev) =>
      prev.map((p) => (p.pid === pid ? { ...p, status: 'stopped', cpu: 0 } : p))
    );
    toast.error(`Processus arrêté : ${name} (PID: ${pid})`, {
      description: 'Le signal SIGTERM a été envoyé avec succès.',
      icon: <Power className="w-4 h-4" />,
    });
  };

  const handleRestart = (pid: number, name: string) => {
    setProcesses((prev) =>
      prev.map((p) => (p.pid === pid ? { ...p, status: 'running', cpu: 0.1 } : p))
    );
    toast.success(`Redémarrage : ${name}`, {
      description: 'Initialisation du processus en cours...',
      icon: <History className="w-4 h-4" />,
    });
  };

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border rounded-[32px] overflow-hidden flex flex-col h-full shadow-2xl transition-all hover:bg-card/50">
      {/* Header */}
      <div className="p-6 border-b border-border space-y-4 bg-foreground/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-foreground uppercase tracking-tighter">
                Moniteur de Processus
              </h3>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                {processes.length} Actifs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
              Temps Réel
            </span>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Rechercher un processus..."
            className="w-full bg-background/50 border border-border rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Process List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10 p-2 space-y-1">
        <div className="flex items-center px-4 py-2 text-[8px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/5 mb-2">
          <button
            onClick={() => toggleSort('name')}
            className="flex-1 flex items-center gap-1 hover:text-foreground transition-colors uppercase"
          >
            Nom <ArrowUpDown className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => toggleSort('cpu')}
            className="w-16 flex items-center gap-1 hover:text-foreground transition-colors justify-center uppercase"
          >
            CPU <ArrowUpDown className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => toggleSort('memory')}
            className="w-20 flex items-center gap-1 hover:text-foreground transition-colors justify-center uppercase"
          >
            RAM <ArrowUpDown className="w-2.5 h-2.5" />
          </button>
          <div className="w-12" />
        </div>

        {sortedProcesses.map((proc) => (
          <div
            key={proc.pid}
            className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-foreground/5 transition-all animate-in fade-in slide-in-from-left-2 duration-300"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-foreground truncate">{proc.name}</span>
                <span className="text-[8px] text-muted-foreground font-mono">PID: {proc.pid}</span>
              </div>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">
                Utilisateur: {proc.user}
              </p>
            </div>

            <div className="w-16 text-center">
              <span
                className={cn(
                  'text-[10px] font-black tabular-nums',
                  proc.cpu > 40
                    ? 'text-rose-500'
                    : proc.cpu > 10
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                )}
              >
                {proc.cpu}%
              </span>
            </div>

            <div className="w-20 text-center">
              <span className="text-[10px] text-muted-foreground font-bold tabular-nums">
                {proc.memory >= 1000
                  ? `${(proc.memory / 1000).toFixed(1)} GB`
                  : `${proc.memory} MB`}
              </span>
            </div>

            <div className="w-12 flex justify-end">
              {proc.status === 'stopped' ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 rounded-lg text-emerald-500 hover:bg-emerald-500/10"
                  onClick={() => handleRestart(proc.pid, proc.name)}
                >
                  <History className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-500/10 group-hover:opacity-100 opacity-40 transition-opacity"
                  onClick={() => handleKill(proc.pid, proc.name)}
                >
                  <Power className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {sortedProcesses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 opacity-20">
            <Activity className="w-8 h-8 mb-2" />
            <p className="text-[10px] uppercase font-black tracking-widest">Aucun résultat</p>
          </div>
        )}
      </div>

      {/* Footer / Summary */}
      <div className="p-4 bg-foreground/5 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_var(--success-glow)]" />
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
            System Load: Stable
          </span>
        </div>
        <span className="text-[8px] font-mono text-muted-foreground">
          KERNEL_VER: 5.15.0-generic
        </span>
      </div>
    </div>
  );
}
