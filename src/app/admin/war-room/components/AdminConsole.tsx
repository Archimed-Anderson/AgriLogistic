import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Cpu, HardDrive, ShieldCheck, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface ConsoleLine {
  text: string;
  type?: 'info' | 'warn' | 'error' | 'success' | 'prompt';
}

export function AdminConsole() {
  const [history, setHistory] = useState<ConsoleLine[]>([
    { text: 'AgroLogistic OS v2.1.0-STABLE initialized.', type: 'success' },
    { text: 'Session context: admin_root@production-gateway', type: 'info' },
    { text: 'Type "help" for a list of available commands.', type: 'info' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory: ConsoleLine[] = [
      ...history,
      { text: `root@agrologistic:~# ${cmd}`, type: 'prompt' },
    ];

    switch (cmd) {
      case 'help':
        newHistory.push({
          text: 'AVAILABLE COMMANDS: [ help, status, clear, restart <svc>, whoami, health ]',
          type: 'info',
        });
        break;
      case 'status':
        newHistory.push({ text: 'SYSTEM STATUS: [ NOMINAL ]', type: 'success' });
        newHistory.push({
          text: 'LATENCY: [ 12ms ] | CPU: [ 14% ] | MEM: [ 2.4GB ]',
          type: 'info',
        });
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'whoami':
        newHistory.push({
          text: 'CURRENT USER: [ admin_root ] | ROLE: [ superadmin ]',
          type: 'info',
        });
        break;
      case 'health':
        newHistory.push({ text: 'CHECKING MICROSERVICES...', type: 'info' });
        setTimeout(() => {
          setHistory((prev) => [
            ...prev,
            { text: 'ALL SERVICES HEALTHY (200 OK)', type: 'success' },
          ]);
        }, 800);
        break;
      default:
        if (cmd.startsWith('restart ')) {
          const svc = cmd.split(' ')[1];
          newHistory.push({ text: `INITIATING RESTART: [ ${svc} ]...`, type: 'warn' });
          setTimeout(() => {
            setHistory((prev) => [
              ...prev,
              { text: `RESTART COMPLETE: [ ${svc} ] successfully reloaded.`, type: 'success' },
            ]);
          }, 1500);
        } else {
          newHistory.push({ text: `COMMAND NOT RECOGNIZED: "${cmd}"`, type: 'error' });
        }
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-card/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-border shadow-2xl font-mono transition-colors duration-500">
      {/* Terminal Header */}
      <div className="bg-foreground/5 border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 text-foreground">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-px bg-border mx-1" />
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
            <Terminal size={12} className="text-primary" />
            Root Console
          </div>
        </div>
        <div className="flex items-center gap-4 text-[9px] text-muted-foreground font-bold italic">
          <div className="flex items-center gap-1">
            <Cpu size={10} className="text-primary/70" /> 14%
          </div>
          <div className="flex items-center gap-1">
            <HardDrive size={10} className="text-primary/70" /> 2.4GB
          </div>
          <ShieldCheck size={12} className="text-emerald-500" />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-hidden relative">
        {/* Command Output */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-foreground/10 scroll-smooth mb-4"
        >
          {history.map((line, i) => (
            <div
              key={i}
              className={cn(
                'text-[11px] font-medium leading-relaxed break-all',
                line.type === 'prompt'
                  ? 'text-foreground font-bold'
                  : line.type === 'info'
                  ? 'text-blue-500 dark:text-blue-400/90'
                  : line.type === 'warn'
                  ? 'text-amber-600 dark:text-amber-400/90'
                  : line.type === 'error'
                  ? 'text-rose-600 dark:text-rose-400/90'
                  : line.type === 'success'
                  ? 'text-emerald-600 dark:text-emerald-400/90'
                  : 'text-muted-foreground'
              )}
            >
              {line.type === 'prompt' ? (
                <div className="flex gap-2">
                  <span className="text-primary tracking-tighter shrink-0 font-black">~</span>
                  <span>{line.text.split('#')[1]}</span>
                </div>
              ) : (
                line.text
              )}
            </div>
          ))}
        </div>

        {/* Command Input Area */}
        <form onSubmit={handleCommand} className="relative group">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="flex items-center gap-3 bg-foreground/5 border border-border p-3 rounded-xl transition-all group-within:border-primary/30 group-within:bg-foreground/[0.08]">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-primary">root</span>
              <span className="text-muted-foreground">@</span>
              <span className="text-[10px] font-bold text-muted-foreground">agrologistic</span>
              <span className="text-primary font-bold tracking-tighter ml-1">#</span>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-foreground text-[11px] placeholder:text-muted-foreground/50 font-medium"
              autoFocus
              placeholder="Ex: status, health..."
              spellCheck={false}
              aria-label="Admin command input"
            />
            <ChevronRight
              size={14}
              className="text-muted-foreground group-within:text-primary transition-colors"
            />
          </div>
        </form>
      </div>

      {/* Footer Info */}
      <div className="bg-foreground/5 border-t border-border px-4 py-1.5 flex items-center justify-between text-[8px] text-muted-foreground uppercase tracking-widest font-black">
        <div className="flex items-center gap-3">
          <span>TLS 1.3 ENABLED</span>
          <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_var(--success-glow)]" />
          <span>CONNECTED: PROD-GATE-01</span>
        </div>
        <div>FR-PAR-REGION</div>
      </div>
    </div>
  );
}
