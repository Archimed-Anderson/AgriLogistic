/**
 * STRATEGIC KPIs COMPONENT
 * Indicateurs clés de performance pour le dashboard admin
 */

import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const data = [
  { name: '00:00', value: 400 },
  { name: '04:00', value: 300 },
  { name: '08:00', value: 600 },
  { name: '12:00', value: 800 },
  { name: '16:00', value: 500 },
  { name: '20:00', value: 900 },
  { name: '23:59', value: 700 },
];

interface KPIProps {
  label: string;
  value: string | number;
  trend: string;
  color: string;
}

const KPICard: React.FC<KPIProps> = ({ label, value, trend, color }) => (
  <div className="kpi-card-premium bg-black/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</span>
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          color === 'cyan'
            ? 'bg-cyan-500/10 text-cyan-400'
            : color === 'green'
            ? 'bg-green-500/10 text-green-400'
            : color === 'magenta'
            ? 'bg-pink-500/10 text-pink-400'
            : 'bg-gray-500/10 text-gray-400'
        }`}
      >
        {trend}
      </span>
    </div>

    <div className="flex items-end justify-between gap-4 mt-2">
      <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
      <div className="h-12 w-24">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={
                    color === 'cyan' ? '#00f2ff' : color === 'green' ? '#00ff41' : '#ff00d9'
                  }
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={
                    color === 'cyan' ? '#00f2ff' : color === 'green' ? '#00ff41' : '#ff00d9'
                  }
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color === 'cyan' ? '#00f2ff' : color === 'green' ? '#00ff41' : '#ff00d9'}
              fillOpacity={1}
              fill={`url(#grad-${color})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const StrategicKPIs: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard label="Volume en Transit" value="1,450 t" trend="+12.5%" color="cyan" />
      <KPICard label="Gains Plateforme" value="8.2M FCFA" trend="+8.2%" color="green" />
      <KPICard label="Camions Actifs" value="42" trend="stable" color="gray-400" />
      <KPICard label="Taux de Remplissage" value="89%" trend="+2.1%" color="magenta" />
    </div>
  );
};

export default StrategicKPIs;
