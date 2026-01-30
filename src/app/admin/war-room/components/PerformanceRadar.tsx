import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Target, Info } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const DATA = [
  { subject: 'Dakar', A: 120, B: 110, fullMark: 150 },
  { subject: 'Thiès', A: 98, B: 130, fullMark: 150 },
  { subject: 'Mbour', A: 86, B: 130, fullMark: 150 },
  { subject: 'Fouta', A: 99, B: 100, fullMark: 150 },
  { subject: 'Sine', A: 85, B: 90, fullMark: 150 },
  { subject: 'Ziguin', A: 65, B: 85, fullMark: 150 },
];

export function PerformanceRadar() {
  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-xl border border-border rounded-[40px] overflow-hidden shadow-2xl transition-all hover:bg-card/50">
      <div className="p-8 border-b border-border bg-foreground/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-tighter">Équilibre Régional</h3>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Efficience • Par Zone</p>
          </div>
        </div>
        <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
      </div>

      <div className="flex-1 min-h-[300px] w-full p-4 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={DATA}>
            <PolarGrid stroke="rgba(255,255,255,0.05)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'black' }} 
            />
            <PolarRadiusAxis hide />
            <Radar
              name="Actuel"
              dataKey="A"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.5}
            />
            <Radar
              name="Cible"
              dataKey="B"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 bg-foreground/5 border-t border-border grid grid-cols-2 gap-4">
        <LegendItem color="bg-primary" label="Volume Transactions" value="+14%" />
        <LegendItem color="bg-emerald-500" label="Taux de Complétion" value="92%" />
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string, label: string, value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <div className={cn("w-1.5 h-1.5 rounded-full", color)} />
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-xs font-black text-foreground ml-3 tabular-nums">{value}</p>
    </div>
  );
}
