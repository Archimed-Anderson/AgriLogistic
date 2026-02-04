'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BaggageClaim,
  TrendingUp,
  TrendingDown,
  Users,
  ShieldCheck,
  AlertTriangle,
  Search,
  Filter,
  ChevronRight,
  ArrowUpRight,
  Target,
  Info,
  Banknote,
  History,
  Activity,
  User,
  MapPin,
  Trophy,
  Zap,
  CheckCircle2,
  Clock,
  Coins,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

// --- TYPES ---
interface AgriScore {
  farmerId: string;
  farmerName: string;
  region: string;
  score: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  creditLimit: number;
  lastUpdated: string;
  breakdown: {
    production: number;
    behavior: number;
    external: number;
    social: number;
    compliance: number;
  };
}

const MOCK_SCORES: AgriScore[] = [
  {
    farmerId: 'AG-771',
    farmerName: 'Jean Dupont',
    region: 'Bretagne',
    score: 842,
    trend: 'UP',
    creditLimit: 2500,
    lastUpdated: '2025-01-28',
    breakdown: {
      production: 90,
      behavior: 85,
      external: 70,
      social: 80,
      compliance: 95,
    },
  },
  {
    farmerId: 'AG-882',
    farmerName: 'Alice Martin',
    region: 'Occitanie',
    score: 615,
    trend: 'STABLE',
    creditLimit: 1200,
    lastUpdated: '2025-01-25',
    breakdown: {
      production: 60,
      behavior: 70,
      external: 50,
      social: 65,
      compliance: 75,
    },
  },
  {
    farmerId: 'AG-910',
    farmerName: 'Koffi Kouamé',
    region: 'Bouaké',
    score: 410,
    trend: 'DOWN',
    creditLimit: 350,
    lastUpdated: '2025-01-30',
    breakdown: {
      production: 30,
      behavior: 45,
      external: 40,
      social: 50,
      compliance: 40,
    },
  },
];

export default function AgriScoreDashboard() {
  const [selectedFarmer, setSelectedFarmer] = useState<AgriScore | null>(MOCK_SCORES[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFarmers = MOCK_SCORES.filter(
    (f) =>
      f.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.farmerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 700) return 'text-emerald-500';
    if (score >= 500) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 700) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 500) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const radarData = selectedFarmer
    ? [
        { subject: 'Production', A: selectedFarmer.breakdown.production, fullMark: 100 },
        { subject: 'Behavior', A: selectedFarmer.breakdown.behavior, fullMark: 100 },
        { subject: 'External', A: selectedFarmer.breakdown.external, fullMark: 100 },
        { subject: 'Social', A: selectedFarmer.breakdown.social, fullMark: 100 },
        { subject: 'KYC', A: selectedFarmer.breakdown.compliance, fullMark: 100 },
      ]
    : [];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* 💳 AGRI-SCORE HEADER */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <BaggageClaim className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Finance intelligence: Agri-Score
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            XGBoost Credit Scoring • AI Risk Predictive Engine • Financial Inclusion Hub
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search Farmer ID..."
              className="h-10 w-64 pl-10 pr-4 bg-slate-900/50 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="h-10 px-4 bg-white/5 border border-white/10 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <Banknote className="w-4 h-4" />
            Credit Line Config
          </button>
        </div>
      </header>

      {/* 📊 PORTFOLIO HUD */}
      <div className="grid grid-cols-4 gap-6 shrink-0">
        <ScoreStatCard
          label="Avg. Agri-Score"
          value="658"
          icon={Target}
          color="indigo"
          delta="+12"
          trend="up"
        />
        <ScoreStatCard label="Total Credit Exposure" value="€1.2M" icon={Coins} color="blue" />
        <ScoreStatCard
          label="Default Risk Index"
          value="2.4%"
          icon={AlertTriangle}
          color="amber"
          delta="-0.5%"
          trend="down"
        />
        <ScoreStatCard label="AI Scans/Mo" value="4.2k" icon={Zap} color="emerald" />
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LEFT: MASTER LIST */}
        <div className="w-[400px] flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
              <Users className="w-3 h-3" />
              Farmer Registry
            </h3>
            <Filter className="w-3 h-3 text-slate-700 cursor-pointer hover:text-white" />
          </div>

          <ScrollArea className="flex-1 bg-slate-900/10 rounded-[32px] border border-white/5 p-3">
            <div className="space-y-3">
              {filteredFarmers.map((f) => (
                <FarmerListItem
                  key={f.farmerId}
                  farmer={f}
                  isSelected={selectedFarmer?.farmerId === f.farmerId}
                  onClick={() => setSelectedFarmer(f)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT: DEEP INSIGHTS */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedFarmer ? (
              <motion.div
                key={selectedFarmer.farmerId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 flex flex-col gap-6"
              >
                <div className="grid grid-cols-3 gap-6">
                  {/* SCORE GAUGE CARD */}
                  <Card className="col-span-1 bg-slate-950/40 border-white/5 rounded-[40px] p-8 flex flex-col items-center justify-center gap-6 relative overflow-hidden group">
                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/5">
                      <div
                        className={cn(
                          'h-full transition-all duration-1000',
                          selectedFarmer.score >= 700
                            ? 'bg-emerald-500'
                            : selectedFarmer.score >= 500
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        )}
                        style={{ width: `${(selectedFarmer.score / 1000) * 100}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">
                      Global Score
                    </span>

                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          className="text-white/5"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray={553}
                          strokeDashoffset={553 - (553 * selectedFarmer.score) / 1000}
                          className={cn(
                            'transition-all duration-1000',
                            getScoreColor(selectedFarmer.score)
                          )}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span
                          className={cn(
                            'text-6xl font-black italic tracking-tighter',
                            getScoreColor(selectedFarmer.score)
                          )}
                        >
                          {selectedFarmer.score}
                        </span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                          Points
                        </span>
                      </div>
                    </div>

                    <div
                      className={cn(
                        'px-4 py-2 rounded-2xl flex items-center gap-2',
                        getScoreBg(selectedFarmer.score)
                      )}
                    >
                      {selectedFarmer.score >= 700 ? (
                        <Trophy className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                      <span
                        className={cn(
                          'text-[10px] font-black uppercase tracking-widest',
                          getScoreColor(selectedFarmer.score)
                        )}
                      >
                        {selectedFarmer.score >= 700
                          ? 'EXCELLENT PROFILE'
                          : selectedFarmer.score >= 500
                            ? 'FAIR POTENTIAL'
                            : 'HIGH RISK WARNING'}
                      </span>
                    </div>
                  </Card>

                  {/* RADAR DECOMPOSITION */}
                  <Card className="col-span-2 bg-slate-950/40 border-white/5 rounded-[40px] p-8 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">
                          Algorithm Breakdown
                        </h3>
                        <p className="text-[9px] font-mono text-slate-600 font-bold uppercase mt-1">
                          Weight distribution per category
                        </p>
                      </div>
                      <ShieldCheck className="w-6 h-6 text-indigo-500 opacity-50" />
                    </div>

                    <div className="flex-1 min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#ffffff10" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                          />
                          <Radar
                            name="Farmer"
                            dataKey="A"
                            stroke="#6366f1"
                            fill="#6366f1"
                            fillOpacity={0.5}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#020617',
                              border: 'none',
                              borderRadius: '12px',
                              fontSize: '10px',
                              color: '#fff',
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                {/* BOTTOM ACTIONS / RECOMMENDATIONS */}
                <div className="grid grid-cols-2 gap-6 pb-6">
                  {/* RECOMMENDATIONS */}
                  <Card className="bg-indigo-500/5 border border-indigo-500/10 rounded-[32px] p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-indigo-500" />
                      </div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic">
                        Score Optimization AI Advisor
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <OptimizationItem
                        text="Augmentez le score de 50 pts en complétant le profil météo."
                        gain="+50"
                      />
                      <OptimizationItem
                        text="Maintenez la régularité des livraisons sur 3 mois."
                        gain="+35"
                      />
                      <OptimizationItem
                        text="Intégrez les recommandations de pairs validés."
                        gain="+20"
                      />
                    </div>
                  </Card>

                  {/* CREDIT ELIGIBILITY */}
                  <Card className="bg-emerald-500/5 border border-emerald-500/10 rounded-[32px] p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                          <Banknote className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic">
                          Credit Threshold
                        </h4>
                      </div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        Automatic Calc
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-2">
                      <span className="text-4xl font-black text-white italic tracking-tighter">
                        €{selectedFarmer.creditLimit.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                        Maximum authorized loan based on current Agri-Score.
                      </p>
                    </div>
                    <button className="h-12 w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">
                      Simulate Loan Proposal
                    </button>
                  </Card>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-900/10 rounded-[40px] border border-dashed border-white/5 space-y-4">
                <Users className="w-16 h-16 text-slate-800" />
                <h4 className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                  Select a node to analyze credit cluster
                </h4>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ScoreStatCard({ label, value, icon: Icon, color, delta, trend }: any) {
  const colorClass =
    {
      indigo: 'text-indigo-500 bg-indigo-500/10',
      blue: 'text-blue-500 bg-blue-500/10',
      amber: 'text-amber-500 bg-amber-500/10',
      emerald: 'text-emerald-500 bg-emerald-500/10',
    }[color] || 'text-white bg-white/10';

  return (
    <Card className="bg-[#05070a] border-white/5 p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        {delta && (
          <div
            className={cn(
              'flex items-center gap-1 text-[10px] font-black tracking-tighter',
              trend === 'up' ? 'text-emerald-500' : 'text-red-500'
            )}
          >
            {trend === 'up' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {delta}
          </div>
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

function FarmerListItem({
  farmer,
  isSelected,
  onClick,
}: {
  farmer: AgriScore;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-2xl border text-left transition-all relative group',
        isSelected
          ? 'bg-white/10 border-white/20 shadow-xl'
          : 'bg-transparent border-transparent hover:bg-white/5'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-mono text-slate-600 font-black">{farmer.farmerId}</span>
        <div
          className={cn(
            'px-2 py-0.5 rounded text-[8px] font-black',
            farmer.score >= 700
              ? 'bg-emerald-500/10 text-emerald-500'
              : farmer.score >= 500
                ? 'bg-amber-500/10 text-amber-500'
                : 'bg-red-500/10 text-red-500'
          )}
        >
          {farmer.score} PTS
        </div>
      </div>
      <h4
        className={cn(
          'text-sm font-black uppercase italic tracking-tight mb-1',
          isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'
        )}
      >
        {farmer.farmerName}
      </h4>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1 text-slate-600">
          <MapPin className="w-2.5 h-2.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">{farmer.region}</span>
        </div>
        <div className="flex items-center gap-1">
          {farmer.trend === 'UP' ? (
            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500" />
          )}
        </div>
      </div>
      {isSelected && (
        <motion.div
          layoutId="farmer-selection"
          className="absolute inset-y-0 left-0 w-1 bg-indigo-500"
        />
      )}
    </button>
  );
}

function OptimizationItem({ text, gain }: { text: string; gain: string }) {
  return (
    <div className="p-3 bg-white/2 rounded-xl flex items-center justify-between border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
      <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">
        {text}
      </span>
      <span className="text-[11px] font-black text-indigo-400 italic tracking-tighter">{gain}</span>
    </div>
  );
}
