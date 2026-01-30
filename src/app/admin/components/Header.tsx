import React from 'react';
import { Triangle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="fixed left-20 right-0 top-0 z-30 flex h-[70px] items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-md transition-colors duration-500">
      <div className="flex items-center gap-3 text-lg font-bold tracking-tight">
        <Triangle size={24} className="text-primary fill-primary/20 rotate-180" />
        <span className="text-foreground">AgroLogistic <span className="text-primary font-black">WAR ROOM</span></span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1.5 font-mono text-[10px] text-success shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-success shadow-[0_0_8px_var(--success-glow)]" />
          SYSTEMS OPERATIONAL
        </div>
        
        <div className="h-8 w-px bg-border mx-2" />

        <ThemeToggle />

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/5 text-[10px] font-black border border-border text-foreground/70 ring-offset-background">
          AD
        </div>
      </div>
    </header>
  );
}
