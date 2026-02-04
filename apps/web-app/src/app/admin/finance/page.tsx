'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ShieldAlert,
  Wallet,
  Download,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Lock,
  Globe,
  Zap,
  Landmark,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

// --- MOCK DATA ---
const CASHFLOW_DATA = [
  { name: '01/01', in: 45000, out: 32000 },
  { name: '05/01', in: 52000, out: 38000 },
  { name: '10/01', in: 48000, out: 41000 },
  { name: '15/01', in: 61000, out: 45000 },
  { name: '20/01', in: 55000, out: 42000 },
  { name: '25/01', in: 72000, out: 48000 },
  { name: '30/01', in: 68000, out: 51000 },
];

const REVENUE_BY_CATEGORY = [
  { name: 'Commissions', value: 35000, color: '#3B82F6' },
  { name: 'Frais Transport', value: 25000, color: '#10B981' },
  { name: 'Abonnements', value: 12000, color: '#F59E0B' },
  { name: 'Services IA', value: 8000, color: '#8B5CF6' },
];

const LIVE_TRANSACTIONS = [
  {
    id: '1',
    user: 'Agriculteur Diallo',
    amount: 450,
    type: 'credit',
    status: 'completed',
    category: 'Vente',
    location: 'CI',
    time: "À l'instant",
  },
  {
    id: '2',
    user: 'Transport Logis',
    amount: 1200,
    type: 'debit',
    status: 'processing',
    category: 'Transport',
    location: 'SN',
    time: 'Il y a 2 min',
  },
  {
    id: '3',
    user: 'Acheteur Global',
    amount: 5000,
    type: 'credit',
    status: 'pending',
    category: 'Achat',
    location: 'FR',
    time: 'Il y a 5 min',
  },
  {
    id: '4',
    user: 'Frais Infra AWS',
    amount: 850,
    type: 'debit',
    status: 'completed',
    category: 'Infra',
    location: 'EU',
    time: 'Il y a 12 min',
  },
  {
    id: '5',
    user: 'Commissions Day',
    amount: 2300,
    type: 'credit',
    status: 'completed',
    category: 'Platform',
    location: 'ALL',
    time: 'Il y a 20 min',
  },
];

const ANOMALIES = [
  {
    id: 'A1',
    type: 'HIGH_VOLUME',
    message: 'Volume de retrait inhabituel sur Wallet SN-04',
    severity: 'critical',
    time: '10:15',
  },
  {
    id: 'A2',
    type: 'FAILED_RETRY',
    message: 'Échec répété Mobile Money (3x) - User ID: 948',
    severity: 'warning',
    time: '09:45',
  },
];

// --- COMPONENTS ---

const FinancialCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-[#0D1117] border border-white/5 rounded-2xl p-6 relative overflow-hidden group"
  >
    <div
      className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-${color}-500/10 transition-colors`}
    />

    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
      <div
        className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'} bg-white/5 px-2 py-1 rounded-full border border-white/5`}
      >
        {trend === 'up' ? (
          <ArrowUpRight className="w-3 h-3" />
        ) : (
          <ArrowDownRight className="w-3 h-3" />
        )}
        {change}
      </div>
    </div>

    <div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
    </div>
  </motion.div>
);

const TransactionItem = ({ tx }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/[0.08] transition-all group"
  >
    <div className="flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} border border-white/5`}
      >
        {tx.type === 'credit' ? (
          <ArrowDownRight className="rotate-180 w-5 h-5" />
        ) : (
          <ArrowUpRight className="w-5 h-5" />
        )}
      </div>
      <div>
        <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
          {tx.user}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="bg-white/5 px-1.5 rounded uppercase">{tx.category}</span>
          <span>• {tx.time}</span>
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" /> {tx.location}
          </span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <p className={`font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
        {tx.type === 'credit' ? '+' : '-'}
        {tx.amount}€
      </p>
      <div className="flex items-center justify-end gap-1">
        {tx.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
        {tx.status === 'processing' && <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />}
        {tx.status === 'pending' && <Clock className="w-3 h-3 text-amber-500" />}
        <span className="text-[10px] uppercase text-gray-500">{tx.status}</span>
      </div>
    </div>
  </motion.div>
);

export default function FinanceSupervisionPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 NEURAL FINANCE BACKGROUND */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        <div className="absolute w-[500px] h-[500px] -top-64 -right-64 bg-blue-600/20 blur-[150px] rounded-full" />
        <div className="absolute w-[500px] h-[500px] -bottom-64 -left-64 bg-emerald-600/20 blur-[150px] rounded-full" />
      </div>

      {/* 🛰️ HEADER HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/20 p-3 rounded-2xl border border-blue-500/30">
            <Landmark className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Finance Supervision
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                H-END
              </span>
            </h1>
            <p className="text-gray-400 text-sm">
              Monitoring cashflow plateforme & scoring IA en temps réel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs text-gray-400">
            <Activity className="w-3 h-3 text-emerald-400" />
            Network Status: <span className="text-emerald-400">Stable</span>
          </div>
          <button
            onClick={refreshData}
            className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-400 group-hover:text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
            <Download className="w-4 h-4" />
            Exporter P&L
          </button>
        </div>
      </header>

      {/* 📊 KPI HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0 relative z-10">
        <FinancialCard
          title="Volume Transigé (30j)"
          value="2.48M €"
          change="+12.5%"
          trend="up"
          icon={Activity}
          color="blue"
        />
        <FinancialCard
          title="Trésorerie Plateforme"
          value="842.5k €"
          change="+5.2%"
          trend="up"
          icon={Wallet}
          color="emerald"
        />
        <FinancialCard
          title="Paiements en Attente"
          value="156.4k €"
          change="-2.1%"
          trend="down"
          icon={Clock}
          color="amber"
        />
        <FinancialCard
          title="Retraits Frauduleux (Tent.)"
          value="0 €"
          change="Stable"
          trend="up"
          icon={ShieldAlert}
          color="rose"
        />
      </div>

      {/* 🏁 MAIN INFRASTRUCTURE */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* 📉 ANALYTICS CORE */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* CASHFLOW CHART UNIT */}
          <div className="flex-1 bg-[#0D1117] border border-white/5 rounded-2xl p-6 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Cashflow Global
                  <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 animate-pulse">
                    LIVE FEED
                  </span>
                </h3>
                <p className="text-sm text-gray-500">Comparaison Entrées vs Sorties Plateforme</p>
              </div>
              <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
                {['1D', '1W', '1M', '1Y'].map((t) => (
                  <button
                    key={t}
                    className={`px-3 py-1 text-xs rounded-md transition-all ${t === '1M' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CASHFLOW_DATA}>
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#ffffff30"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#ffffff30"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="in"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorIn)"
                    animationDuration={2000}
                  />
                  <Area
                    type="monotone"
                    dataKey="out"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#colorOut)"
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* REVENUE BREAKDOWN & FORECASTING */}
          <div className="h-[200px] flex gap-6 shrink-0">
            <div className="flex-1 bg-[#0D1117] border border-white/5 rounded-2xl p-5 flex items-center gap-6">
              <div className="w-1/3 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={REVENUE_BY_CATEGORY}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {REVENUE_BY_CATEGORY.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-3">
                <h4 className="text-sm font-bold text-white mb-1">Source des Revenus</h4>
                {REVENUE_BY_CATEGORY.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between text-xs text-gray-400"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                    </div>
                    <span className="font-bold text-white">{(cat.value / 1000).toFixed(1)}k €</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-4 opacity-20 transform rotate-12">
                <Zap className="w-24 h-24 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Projection 30 Jours
                </h4>
                <p className="text-xs text-blue-400 font-medium">BASÉ SUR L'IA PREDICTIVE</p>
              </div>
              <div>
                <div className="text-3xl font-black text-white">+142,500 €</div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Seuil de sécurité maintenu</span>
                </div>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 🛰️ REAL-TIME TRANSACTION FEED */}
        <aside className="w-[400px] flex flex-col gap-6 shrink-0 overflow-hidden">
          {/* SUSPICIOUS ACTIVITY UNIT */}
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 shrink-0">
            <h4 className="text-rose-400 font-bold text-sm flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4" />
              Alertes de Sécurité
              <span className="ml-auto bg-rose-500 text-white text-[10px] px-1.5 rounded-full">
                2
              </span>
            </h4>
            <div className="flex flex-col gap-3">
              {ANOMALIES.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="bg-[#0D1117] border border-rose-500/30 p-3 rounded-xl flex gap-3"
                >
                  <AlertTriangle
                    className={`w-5 h-5 shrink-0 ${anomaly.severity === 'critical' ? 'text-rose-500' : 'text-amber-500'}`}
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{anomaly.message}</p>
                    <p className="text-[10px] text-gray-500 mt-1 flex justify-between">
                      <span>Type: {anomaly.type}</span>
                      <span>{anomaly.time}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LIVE FEED UNIT */}
          <div className="flex-1 bg-[#0D1117] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                Transactions Live
              </h4>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {LIVE_TRANSACTIONS.map((tx) => (
                  <TransactionItem key={tx.id} tx={tx} />
                ))}
              </AnimatePresence>
            </div>
            <button className="p-4 bg-white/5 text-gray-400 text-xs font-medium hover:text-white transition-colors border-t border-white/5 text-center">
              VOIR TOUTES LES TRANSACTIONS
            </button>
          </div>

          {/* SECURITY COMPLIANCE HUD */}
          <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Sécurité & Conformité</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Protocoles Actifs
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-center">
                <p className="text-[10px] text-gray-500 mb-1 leading-none uppercase">Multisig</p>
                <span className="text-emerald-400 font-bold text-xs uppercase">Actif 2/3</span>
              </div>
              <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-center">
                <p className="text-[10px] text-gray-500 mb-1 leading-none uppercase">Seuil 2FA</p>
                <span className="text-blue-400 font-bold text-xs uppercase">&gt; 10k €</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ⌨️ FOOTER HUD - SYSTEM DATA */}
      <footer className="h-10 shrink-0 flex items-center justify-between px-2 text-[10px] text-gray-500 border-t border-white/5">
        <div className="flex items-center gap-6 lowercase">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 bg-emerald-500 rounded-full" />
            node-edge-fra-01: online
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 bg-blue-500 rounded-full" />
            redis-cache: 4ms
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 bg-purple-500 rounded-full" />
            clickhouse-sync: active
          </span>
        </div>
        <div className="uppercase tracking-widest">AgroDeep Financial Engine v2.4.0-STABLE</div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
