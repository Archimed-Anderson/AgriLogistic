import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSystemStream } from '@/shared/hooks/useSystemStream';

interface FluxChartProps {
  metrics: any[];
  dataKey: string;
  color: string;
  title: string;
  unit: string;
}

export function FluxChart({ metrics, dataKey, color, title, unit }: FluxChartProps) {
  // We'll use the last 20 points from the parent's accumulated state if provided,
  // but for simplicity here, we'll assume metrics is the array of historical data.

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border rounded-[32px] p-6 flex flex-col h-full shadow-2xl transition-all hover:bg-card/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[10px] font-black text-foreground uppercase tracking-tighter">
            {title}
          </h3>
          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
            Flux en Temps Réel
          </p>
        </div>
        <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase tracking-widest">
          Live Stream
        </div>
      </div>

      <div className="flex-1 min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metrics}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="timestamp" hide />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 10, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
              itemStyle={{ color: color }}
              labelStyle={{ color: '#fff', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fillOpacity={1}
              fill={`url(#gradient-${dataKey})`}
              strokeWidth={3}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/5 pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] font-black text-foreground uppercase tracking-tight">
              {title}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-black text-muted-foreground tabular-nums">
          {metrics[metrics.length - 1]?.[dataKey] ?? 0} {unit}
        </span>
      </div>
    </div>
  );
}
