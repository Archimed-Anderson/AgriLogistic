'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Banknote,
  Calculator,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  DollarSign,
  PieChart as PieIcon,
  Calendar,
  History,
  Activity,
  Plus,
  ArrowUpRight,
  Download,
  Filter,
  Search,
  Wallet,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const LOAN_HISTORY = [
  { month: 'SEP', amount: 12000 },
  { month: 'OCT', amount: 15400 },
  { month: 'NOV', amount: 14200 },
  { month: 'DEC', amount: 19800 },
  { month: 'JAN', amount: 24500 },
];

const LOAN_TYPES = [
  { name: 'Seed Capital', value: 45, color: '#6366f1' },
  { name: 'Equipment', value: 30, color: '#10b981' },
  { name: 'Micro-Credit', value: 25, color: '#f59e0b' },
];

interface Loan {
  id: string;
  farmerName: string;
  amount: number;
  rate: number;
  term: number;
  status: 'ACTIVE' | 'PENDING' | 'REPAID' | 'DELAYED';
  progress: number;
  nextPayment: string;
}

const MOCK_LOANS: Loan[] = [
  {
    id: 'L-001',
    farmerName: 'Jean Dupont',
    amount: 1200,
    rate: 4.5,
    term: 12,
    status: 'ACTIVE',
    progress: 35,
    nextPayment: '2025-02-15',
  },
  {
    id: 'L-002',
    farmerName: 'Alice Martin',
    amount: 3500,
    rate: 3.2,
    term: 24,
    status: 'ACTIVE',
    progress: 12,
    nextPayment: '2025-02-20',
  },
  {
    id: 'L-003',
    farmerName: 'Koffi Kouamé',
    amount: 500,
    rate: 5.0,
    term: 6,
    status: 'DELAYED',
    progress: 85,
    nextPayment: '2025-01-10',
  },
  {
    id: 'L-004',
    farmerName: 'Pierre Durand',
    amount: 2000,
    rate: 4.0,
    term: 18,
    status: 'REPAID',
    progress: 100,
    nextPayment: '-',
  },
];

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'simulator'>('portfolio');

  // Simulator State
  const [loanAmount, setLoanAmount] = useState(1000);
  const [loanTerm, setLoanTerm] = useState(12);
  const [loanRate, setLoanRate] = useState(4.5);

  const monthlyPayment = (loanAmount * (1 + loanRate / 100)) / loanTerm;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* 💸 LOANS HEADER */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Banknote className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Credit Management: Loan Portfolio
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Smart Contracts Lending • Automated Recouvrement • Yield vs Risk Analysis
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={cn(
                'px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                activeTab === 'portfolio'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-500 hover:text-white'
              )}
            >
              Portfolio View
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={cn(
                'px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                activeTab === 'simulator'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-500 hover:text-white'
              )}
            >
              Simulator Hub
            </button>
          </div>

          <button className="h-10 px-4 bg-white/5 border border-white/10 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <Plus className="w-4 h-4" />
            New Credit Line
          </button>
        </div>
      </header>

      {/* 📊 MAIN CONTENT */}
      {activeTab === 'portfolio' ? (
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="grid grid-cols-4 gap-6 shrink-0">
            <LoanStat progress={75} label="Portfolio Health" value="94.2%" color="emerald" />
            <LoanStat progress={42} label="Capital Deployed" value="€845k" color="blue" />
            <LoanStat progress={15} label="Late Repayments" value="€12.4k" color="amber" />
            <LoanStat progress={88} label="Monthly Collection" value="€45.2k" color="indigo" />
          </div>

          <div className="flex-1 flex gap-6 overflow-hidden">
            {/* LOANS GRID */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  Active Credit Streams
                </h3>
                <div className="flex items-center gap-4">
                  <Search className="w-3 h-3 text-slate-700 pointer-events-none" />
                  <Download className="w-3 h-3 text-slate-700 cursor-pointer hover:text-white" />
                </div>
              </div>

              <ScrollArea className="flex-1 bg-slate-900/10 rounded-[40px] border border-white/5 p-4">
                <div className="grid grid-cols-2 gap-4">
                  {MOCK_LOANS.map((loan) => (
                    <LoanCard key={loan.id} loan={loan} />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* ANALYTICS PANEL */}
            <aside className="w-[400px] flex flex-col gap-6 overflow-hidden">
              <Card className="flex-1 bg-slate-950/40 border-white/5 rounded-[40px] p-8 flex flex-col gap-8 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

                <div>
                  <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">
                    Market Trends
                  </h3>
                  <p className="text-[9px] font-mono text-slate-600 font-bold uppercase mt-1">
                    Loan issuance volume (6M)
                  </p>
                </div>

                <div className="flex-1 max-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={LOAN_HISTORY}>
                      <defs>
                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="month" hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#020617',
                          border: 'none',
                          borderRadius: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorAmt)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Capital Mix
                    </h4>
                    <PieIcon className="w-4 h-4 text-emerald-500 opacity-50" />
                  </div>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={LOAN_TYPES}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {LOAN_TYPES.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {LOAN_TYPES.map((type) => (
                      <div key={type.name} className="flex flex-col items-center">
                        <span className="text-[8px] font-black text-slate-500 uppercase">
                          {type.name}
                        </span>
                        <span className="text-xs font-black text-white">{type.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      ) : (
        /* SIMULATOR HUB */
        <div className="flex-1 flex gap-8 items-center justify-center max-w-6xl mx-auto w-full">
          <Card className="w-[500px] bg-slate-950/40 border-white/5 rounded-[48px] p-10 flex flex-col gap-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                  Loan Architect
                </h2>
                <span className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-widest">
                  Dynamic Risk Pricing
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <SimulatorSlider
                label="Requested Amount"
                value={loanAmount}
                unit="€"
                min={100}
                max={10000}
                step={100}
                onChange={setLoanAmount}
                color="bg-emerald-500"
              />
              <SimulatorSlider
                label="Term Duration"
                value={loanTerm}
                unit="Mo"
                min={3}
                max={36}
                step={1}
                onChange={setLoanTerm}
                color="bg-blue-500"
              />
              <SimulatorSlider
                label="Interest Rate"
                value={loanRate}
                unit="%"
                min={1}
                max={15}
                step={0.1}
                onChange={setLoanRate}
                color="bg-indigo-500"
              />
            </div>

            <div className="mt-4 pt-8 border-t border-white/5 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                    Monthly Repayment
                  </p>
                  <span className="text-4xl font-black text-white italic tracking-tighter transition-all">
                    €{monthlyPayment.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                    Total Cost
                  </p>
                  <span className="text-xl font-black text-emerald-500 italic">
                    €{(monthlyPayment * loanTerm).toFixed(2)}
                  </span>
                </div>
              </div>
              <button className="h-16 w-full bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-3">
                Generate Offer Pack
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[9px] text-center text-slate-600 font-bold uppercase leading-relaxed">
                Offers are dynamically calculated based on target farmer's Agri-Score index and
                regional market parameters.
              </p>
            </div>
          </Card>

          <div className="flex-1 flex flex-col gap-8">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
              Simulate The <br />
              <span className="text-emerald-500">Future of Farming</span>
            </h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest max-w-md">
              Our algorithm integrates climate data and history to ensure sustainable growth for
              every credit line issued.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <FeatureItem
                icon={ShieldCheck}
                title="Micro-Lending"
                desc="Instant payouts for seasonal seeds and equipment."
              />
              <FeatureItem
                icon={Zap}
                title="Instant Approval"
                desc="Powered by real-time blockchain telemetry."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoanStat({ progress, label, value, color }: any) {
  const textColor = {
    emerald: 'text-emerald-500',
    blue: 'text-blue-500',
    amber: 'text-amber-500',
    indigo: 'text-indigo-500',
  }[color] as string;

  return (
    <Card className="bg-[#05070a] border-white/5 p-6 rounded-3xl flex flex-col gap-4 group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {label}
        </span>
        <span className={cn('text-[9px] font-mono font-black', textColor)}>{progress}% TARGET</span>
      </div>
      <span className="text-3xl font-black text-white italic tracking-tighter uppercase">
        {value}
      </span>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={cn(
            'h-full',
            color === 'emerald'
              ? 'bg-emerald-500'
              : color === 'blue'
                ? 'bg-blue-500'
                : color === 'amber'
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
          )}
        />
      </div>
    </Card>
  );
}

function LoanCard({ loan }: { loan: Loan }) {
  return (
    <div className="p-6 bg-black/20 border border-white/5 rounded-[32px] hover:border-white/10 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-mono font-bold text-slate-500">
          {loan.id}
        </div>
        <div
          className={cn(
            'px-2 py-0.5 rounded text-[8px] font-black tracking-widest',
            loan.status === 'ACTIVE'
              ? 'bg-emerald-500/10 text-emerald-500'
              : loan.status === 'DELAYED'
                ? 'bg-red-500/10 text-red-500'
                : 'bg-white/10 text-slate-400'
          )}
        >
          {loan.status}
        </div>
      </div>
      <h4 className="text-base font-black uppercase text-white tracking-tight mb-2 italic">
        {loan.farmerName}
      </h4>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-600 uppercase font-black">Principal</span>
          <span className="text-sm font-black text-white italic">
            €{loan.amount.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-600 uppercase font-black">Interest</span>
          <span className="text-sm font-black text-emerald-500 italic">{loan.rate}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-600 uppercase font-black">Term</span>
          <span className="text-sm font-black text-blue-400 font-mono">{loan.term}M</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-black uppercase">
          <span className="text-slate-500">Repayment Progress</span>
          <span className="text-white">{loan.progress}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${loan.progress}%` }} />
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-black text-slate-600 uppercase">
        <span>Next: {loan.nextPayment}</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all group-hover:text-white" />
      </div>
    </div>
  );
}

function SimulatorSlider({ label, value, unit, min, max, step, onChange, color }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-lg font-black text-white italic">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn('w-full h-1.5 rounded-full appearance-none cursor-pointer', color)}
        style={{ background: 'rgba(255,255,255,0.05)' }}
      />
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-5 bg-white/2 border border-white/5 rounded-2xl flex flex-col gap-3">
      <Icon className="w-5 h-5 text-emerald-500" />
      <div>
        <h5 className="text-[10px] font-black text-white uppercase tracking-widest">{title}</h5>
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight leading-tight mt-1">
          {desc}
        </p>
      </div>
    </div>
  );
}
