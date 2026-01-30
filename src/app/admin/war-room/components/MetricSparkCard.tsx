import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/shared/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricSparkCardProps {
  title: string;
  value: string;
  delta: string;
  deltaType: 'up' | 'down' | 'neutral';
  label: string;
  icon: React.ElementType;
  trend: number[];
  color?: string;
}

export function MetricSparkCard({ 
  title, 
  value, 
  delta, 
  deltaType, 
  label, 
  icon: Icon, 
  trend,
  color = "text-primary" 
}: MetricSparkCardProps) {
  const isUp = deltaType === 'up';
  const chartData = trend.map((val, i) => ({ val, i }));

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-card/40 backdrop-blur-xl border border-border p-6 rounded-[32px] flex flex-col justify-between group transition-all hover:bg-card/60 shadow-lg relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className={cn(
        "absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20",
        isUp ? "bg-emerald-500" : "bg-primary"
      )} />

      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-foreground/5 rounded-2xl border border-border/50 group-hover:scale-110 transition-transform">
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border",
          isUp ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-primary/10 text-primary border-primary/20"
        )}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-foreground tracking-tighter tabular-nums">{value}</h3>
          <span className="text-[10px] font-bold text-muted-foreground uppercase">{label}</span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-12 w-full mt-6 opacity-60 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="val" 
              stroke={isUp ? "#10b981" : "#3b82f6"} 
              strokeWidth={3} 
              dot={false}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
