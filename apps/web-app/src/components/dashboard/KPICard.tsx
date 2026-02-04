'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  Sprout,
  Droplet,
  AlertTriangle,
  BarChart3,
  LucideIcon,
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { KPI } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface KPICardProps {
  kpi: KPI;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Sprout,
  Droplet,
  AlertTriangle,
  BarChart3,
};

export function KPICard({ kpi, className }: KPICardProps) {
  const Icon = iconMap[kpi.icon] || BarChart3;
  const TrendIcon = kpi.trend?.isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
          {kpi.unit && (
            <span className="ml-1 text-sm font-normal text-muted-foreground">{kpi.unit}</span>
          )}
        </div>
        {kpi.trend && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <TrendIcon
              className={cn('h-3 w-3', kpi.trend.isPositive ? 'text-green-600' : 'text-red-600')}
            />
            <span className={cn(kpi.trend.isPositive ? 'text-green-600' : 'text-red-600')}>
              {kpi.trend.value > 0 ? '+' : ''}
              {kpi.trend.value}%
            </span>
            <span className="ml-1">{kpi.trend.label}</span>
          </div>
        )}
        {kpi.chartData && kpi.chartData.length > 0 && (
          <div className="mt-4 h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpi.chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'calc(var(--radius) - 2px)',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
