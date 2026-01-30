import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/app/components/ui/card';

interface KPICardProps {
  title: string;
  value: string;
  delta?: string;
  deltaType?: 'up' | 'down' | 'neutral';
  label: string;
  icon?: React.ElementType;
}

export function KPICard({ title, value, delta, deltaType = 'neutral', label, icon: Icon }: KPICardProps) {
  return (
    <Card className="relative group overflow-hidden bg-card/40 border border-border p-6 rounded-[32px] transition-all duration-500 hover:bg-card/60 hover:border-primary/30 hover:-translate-y-1 shadow-lg backdrop-blur-md">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {Icon && <Icon className="w-12 h-12 text-foreground" />}
      </div>
      
      <CardContent className="relative z-10 flex flex-col gap-1 p-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{title}</p>
          {Icon && (
            <div className="p-1.5 bg-primary/5 rounded-lg border border-primary/10">
              <Icon className="w-3.5 h-3.5 text-primary" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black tracking-tighter text-foreground">{value}</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{label.split(' ')[0]}</span>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          {delta && (
            <div className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1",
              deltaType === 'up' && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
              deltaType === 'down' && "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
              deltaType === 'neutral' && "bg-muted text-muted-foreground border border-border"
            )}>
              {deltaType === 'up' && '▲'}
              {deltaType === 'down' && '▼'}
              {delta}
            </div>
          )}
          <span className="text-[10px] text-muted-foreground font-bold leading-none italic uppercase">
            {label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
