'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  BrainCircuit,
  TrendingUp,
  MapPin,
  Users,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  BarChart3,
  Activity,
  Zap,
  Target,
  FileSearch,
  Cpu,
  Fingerprint,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const REGIONAL_RISK = [
  { region: 'Bretagne', risk: 1.2, color: '#10b981' },
  { region: 'Occitanie', risk: 3.5, color: '#f59e0b' },
  { region: 'Normandie', risk: 0.8, color: '#10b981' },
  { region: 'Nlle Aquitaine', risk: 4.8, color: '#ef4444' },
  { region: 'Hts de France', risk: 2.1, color: '#10b981' },
];

const ML_FEATURES = [
  { name: 'Production Consistency', importance: 92, status: 'STABLE' },
  { name: 'Historical Weather Bias', importance: 85, status: 'IMPROVING' },
  { name: 'Social Guarantee Cluster', importance: 78, status: 'NEW' },
  { name: 'Market Price Volatility', importance: 65, status: 'STABLE' },
];

export default function RiskAnalysisPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* ⚠️ RISK HEADER */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Agri-Risk: Predictive Analytics
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Machine Learning Default Classification • Multi-Factor Stress Testing • Regional
            Exposure Monitoring
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="h-10 px-4 bg-white/5 border border-white/10 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <FileSearch className="w-4 h-4" />
            Audit Logs
          </button>
          <button className="h-10 px-4 bg-red-600 border border-red-500/20 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all">
            <Zap className="w-4 h-4" />
            Retrain XGBoost
          </button>
        </div>
      </header>

      {/* 📊 RISK HUDS */}
      <div className="grid grid-cols-4 gap-6 shrink-0">
        <RiskStat
          label="Probability of Default"
          value="3.1%"
          delta="+0.2%"
          trend="up"
          icon={AlertTriangle}
          color="red"
        />
        <RiskStat
          label="Concentration Risk"
          value="High"
          icon={Layers}
          color="amber"
          badge="BRETAGNE"
        />
        <RiskStat
          label="Model Accuracy"
          value="96.4%"
          delta="+1.2%"
          trend="up"
          icon={Target}
          color="emerald"
        />
        <RiskStat label="Stress Test Status" value="PASS" icon={ShieldCheck} color="blue" />
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LEFT: REGIONAL HEATMAP (AS CHART) */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <Card className="flex-1 bg-slate-950/40 border-white/5 rounded-[40px] p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">
                  Regional Default Rate
                </h3>
                <p className="text-[9px] font-mono text-slate-600 font-bold uppercase mt-1">
                  Expected vs Actual Defaults per region
                </p>
              </div>
            </div>

            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REGIONAL_RISK}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis
                    dataKey="region"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{
                      backgroundColor: '#020617',
                      border: 'none',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="risk" radius={[8, 8, 8, 8]}>
                    {REGIONAL_RISK.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        fillOpacity={0.4}
                        stroke={entry.color}
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="h-[30%] flex gap-6">
            <Card className="flex-1 bg-white/2 border border-white/5 rounded-[32px] p-6 flex flex-col justify-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Max Recovery Strategy
              </span>
              <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4">
                Manual Intervention Cluster
              </h4>
              <p className="text-[11px] text-slate-600 font-bold uppercase tracking-tight">
                System recommends accompaniment for 12 farmers in the Orange zone.
              </p>
            </Card>
            <Card className="flex-1 bg-blue-500/5 border border-blue-500/10 rounded-[32px] p-6 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                  Inclusion Impact
                </span>
                <span className="text-3xl font-black text-white italic">+420 Farmers</span>
                <p className="text-[9px] text-slate-500 font-bold uppercase italic font-black mt-2">
                  Financed without bank history
                </p>
              </div>
              <Cpu className="w-12 h-12 text-blue-500 opacity-20" />
            </Card>
          </div>
        </div>

        {/* RIGHT: ML ENGINE INSIGHTS */}
        <aside className="w-[400px] flex flex-col gap-6 overflow-hidden">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-2 px-2 italic">
            <BrainCircuit className="w-4 h-4 text-indigo-500" />
            AI Model Features
          </h3>

          <ScrollArea className="flex-1 bg-slate-900/10 rounded-[40px] border border-white/5 p-4">
            <div className="space-y-4">
              {ML_FEATURES.map((feature) => (
                <FeatureCard key={feature.name} feature={feature} />
              ))}
            </div>

            <div className="mt-8 p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-slate-600" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                  Blockchain Proof-of-Risk
                </h4>
              </div>
              <p className="text-[9px] text-slate-600 font-bold uppercase leading-relaxed">
                Risk scores are anchored every 30 days as encrypted hashes on the ledger to ensure
                audit-trail for financial regulators.
              </p>
              <button className="text-[9px] font-black text-indigo-500 uppercase flex items-center gap-2 hover:gap-4 transition-all">
                View Immutable Audit Log <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}

function RiskStat({ label, value, delta, trend, icon: Icon, color, badge }: any) {
  const colorClasses =
    {
      red: 'text-red-500 bg-red-500/10',
      amber: 'text-amber-500 bg-amber-500/10',
      emerald: 'text-emerald-500 bg-emerald-500/10',
      blue: 'text-blue-500 bg-blue-500/10',
    }[color] || 'text-white bg-white/10';

  return (
    <Card className="bg-[#05070a] border-white/5 p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorClasses)}>
          <Icon className="w-5 h-5" />
        </div>
        {delta && (
          <div
            className={cn(
              'flex items-center gap-1 text-[10px] font-black tracking-tighter',
              trend === 'up' ? 'text-red-500' : 'text-emerald-500'
            )}
          >
            <ArrowUpRight className={cn('w-3 h-3', trend === 'down' && 'rotate-180')} />
            {delta}
          </div>
        )}
        {badge && (
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-black text-slate-500 tracking-widest">
            {badge}
          </span>
        )}
      </div>
      <div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
          {label}
        </span>
        <span className="text-3xl font-black text-white italic tracking-tighter uppercase">
          {value}
        </span>
      </div>
    </Card>
  );
}

function FeatureCard({ feature }: { feature: any }) {
  return (
    <div className="p-5 bg-black/20 border border-white/5 rounded-3xl space-y-4 group hover:border-indigo-500/30 transition-all">
      <div className="flex justify-between items-center">
        <h4 className="text-[11px] font-black text-white uppercase tracking-tight italic">
          {feature.name}
        </h4>
        <div className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-black text-slate-500">
          {feature.status}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-black uppercase">
          <span className="text-slate-600">Model Importance</span>
          <span className="text-indigo-400">{feature.importance}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${feature.importance}%` }}
            className="h-full bg-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
