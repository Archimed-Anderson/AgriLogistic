import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer 
} from 'recharts';
import { Activity, Clock, Zap, AlertTriangle } from 'lucide-react';

const mockData = [
  { time: '10:00', latency: 45, errorRate: 0.1, traffic: 1200 },
  { time: '10:05', latency: 52, errorRate: 0.2, traffic: 1350 },
  { time: '10:10', latency: 48, errorRate: 0.1, traffic: 1400 },
  { time: '10:15', latency: 61, errorRate: 0.4, traffic: 1600 },
  { time: '10:20', latency: 55, errorRate: 0.2, traffic: 1550 },
  { time: '10:25', latency: 42, errorRate: 0.1, traffic: 1300 },
  { time: '10:30', latency: 47, errorRate: 0.1, traffic: 1450 },
];

export function HealthMetricsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <MetricCard 
        title="Avg Latency" 
        value="48ms" 
        change="-4ms" 
        icon={Clock} 
        color="text-emerald-400"
        bg="bg-emerald-500/10"
        data={mockData.map(d => ({ value: d.latency }))}
        dataKey="value"
        stroke="#10b981"
      />
      <MetricCard 
        title="Error Rate" 
        value="0.12%" 
        change="+0.02%" 
        icon={AlertTriangle} 
        color="text-red-400"
        bg="bg-red-500/10"
        data={mockData.map(d => ({ value: d.errorRate }))}
        dataKey="value"
        stroke="#ef4444"
      />
      <MetricCard 
        title="Throughput" 
        value="1.4k req/s" 
        change="+12%" 
        icon={Zap} 
        color="text-blue-400"
        bg="bg-blue-500/10"
        data={mockData.map(d => ({ value: d.traffic }))}
        dataKey="value"
        stroke="#3b82f6"
      />
      <MetricCard 
        title="Active Nodes" 
        value="24 / 24" 
        change="Stable" 
        icon={Activity} 
        color="text-purple-400"
        bg="bg-purple-500/10"
        data={mockData.map((_, _i) => ({ value: 24 }))}
        dataKey="value"
        stroke="#a855f7"
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  data: any[];
  dataKey: string;
  stroke: string;
}

function MetricCard({ title, value, change, icon: Icon, color, bg, data, dataKey, stroke }: MetricCardProps) {
  return (
    <Card className="bg-card/40 border-border backdrop-blur-md overflow-hidden rounded-[24px] shadow-lg transition-all hover:bg-card/60">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-xl ${bg} border border-current opacity-80`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <span className={cn(
              "text-[10px] font-black px-2 py-0.5 rounded-full border",
              change.startsWith('+') 
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' 
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            )}>
              {change}
            </span>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-bold">{title}</p>
            <h3 className="text-2xl font-black text-foreground mt-1 tracking-tighter">{value}</h3>
          </div>
        </div>
        <div className="h-16 w-full opacity-40 dark:opacity-60 grayscale-[0.2] contrast-[0.8]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={stroke} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={stroke} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={stroke} 
                fillOpacity={1} 
                fill={`url(#gradient-${title})`} 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
