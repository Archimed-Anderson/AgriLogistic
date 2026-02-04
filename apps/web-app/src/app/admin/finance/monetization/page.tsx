'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  PieChart as PieIcon,
  BarChart3,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  Plus,
  Calendar,
  ChevronRight,
  MoreHorizontal,
  Star,
  Layers,
  FileText,
  Settings,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// --- MOCK DATA ---
const REVENUE_BREAKDOWN = [
  { name: 'Commissions Vente', value: 45200, color: '#3B82F6' },
  { name: 'Abonnements Pro', value: 22100, color: '#10B981' },
  { name: 'Commissions Transport', value: 12500, color: '#F59E0B' },
  { name: 'Data Monetization', value: 5400, color: '#8B5CF6' },
  { name: 'Services VA (KYC/Assurance)', value: 3200, color: '#EC4899' },
];

const CHURN_STATS = [
  { month: 'Oct', churn: 2.1, new: 15 },
  { month: 'Nov', churn: 1.8, new: 22 },
  { month: 'Dec', churn: 2.5, new: 18 },
  { month: 'Jan', churn: 2.4, new: 25 },
];

const PLANS = [
  { id: 'free', name: 'Free', price: '0', users: 745, color: 'gray' },
  { id: 'pro', name: 'Pro', price: '49', users: 450, color: 'blue' },
  { id: 'enterprise', name: 'Enterprise', price: '299', users: 45, color: 'emerald' },
];

const INVOICES = [
  {
    id: 'INV-8821',
    user: 'Coopérative Boribana',
    amount: '299.00',
    status: 'PAID',
    date: '01/02/2026',
  },
  {
    id: 'INV-8820',
    user: 'TransportExpress SN',
    amount: '49.00',
    status: 'PAID',
    date: '30/01/2026',
  },
  {
    id: 'INV-8819',
    user: 'AgroPlus Global',
    amount: '1,250.00',
    status: 'PENDING',
    date: '28/01/2026',
  },
];

// --- COMPONENTS ---

const KPIPlate = ({ title, value, change, icon: Icon, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-[#0D1117] border border-white/5 rounded-3xl p-6 relative overflow-hidden group"
  >
    <div
      className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 blur-2xl rounded-full group-hover:bg-${color}-500/10 transition-all`}
    />
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-3 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-400`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div
        className={`flex items-center gap-1 text-xs font-black ${change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}
      >
        {change.startsWith('+') ? (
          <ArrowUpRight className="w-3 h-3" />
        ) : (
          <ArrowDownRight className="w-3 h-3" />
        )}
        {change}
      </div>
    </div>
    <p className="text-gray-500 text-[10px] uppercase tracking-widest font-black mb-1">{title}</p>
    <h3 className="text-3xl font-black text-white">{value}</h3>
  </motion.div>
);

export default function MonetizationDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activePlanTab, setActivePlanTab] = useState('pro');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 BACKGROUND EFFECTS */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-emerald-600/20 blur-[130px] rounded-full" />
      </div>

      {/* 💰 HEADER HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <Zap className="w-8 h-8 text-blue-400 fill-blue-400/20" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Monetization & SaaS Matrix <span className="text-blue-500">v4.0</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Tracking recurring revenue, transaction commissions & smart incentives.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end border-r border-white/10 pr-6 mr-3">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black mb-1">
              Live MRR Index
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                21,500 <span className="text-xs text-blue-500">€</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">+12%</span>
            </div>
          </div>
          <button className="bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 group uppercase tracking-widest italic">
            <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            Export FEC / Accounting
          </button>
        </div>
      </header>

      {/* 📊 KPI GRID */}
      <div className="grid grid-cols-4 gap-6 shrink-0 relative z-10">
        <KPIPlate
          title="ARR (Annualized)"
          value="258,000 €"
          change="+14.2%"
          icon={DollarSign}
          color="blue"
        />
        <KPIPlate title="Churn Rate" value="2.4%" change="-0.5%" icon={Users} color="rose" />
        <KPIPlate
          title="LTV Avg (Buyer)"
          value="4,500 €"
          change="+5.1%"
          icon={Star}
          color="amber"
        />
        <KPIPlate title="CAC Avg" value="28 €" change="-12%" icon={TrendingUp} color="emerald" />
      </div>

      {/* 🕹️ MAIN CONTROL CENTER */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* 📋 REVENUE STREAMS (LEFT) */}
        <div className="w-[450px] flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col">
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-400" />
              Breakdown des Revenus
            </h3>
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={REVENUE_BREAKDOWN}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {REVENUE_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-white">88.4k</span>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                  Total EUR
                </span>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              {REVENUE_BREAKDOWN.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-[11px] text-gray-400 font-medium">{entry.name}</span>
                  </div>
                  <span className="text-xs text-white font-black">
                    {entry.value.toLocaleString()} €
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 📈 ANALYTICS & PLANS (RIGHT) */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* TOP HALF: CHURN & PLANS */}
          <div className="grid grid-cols-2 gap-6 h-[50%] overflow-hidden">
            {/* CHURN ANALYSIS */}
            <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col">
              <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-rose-400" />
                  Churn vs New Logos
                </div>
                <span className="text-[10px] text-emerald-400 underline cursor-pointer">
                  View Analysis
                </span>
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHURN_STATS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#4b5563"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D1117',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="new" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="churn" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SUBSCRIPTION PLANS */}
            <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full" />
              <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Plans Actuels (Subscribers)
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center text-center group hover:border-blue-500/50 transition-all cursor-pointer"
                  >
                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">
                      {plan.name}
                    </p>
                    <p className="text-2xl font-black text-white mb-2">
                      {plan.price}
                      <span className="text-xs text-gray-500 ml-0.5">€</span>
                    </p>
                    <div className="h-px w-8 bg-white/10 mb-3" />
                    <div className="bg-blue-600/10 border border-blue-500/20 px-2 py-1 rounded-lg">
                      <p className="text-[11px] text-blue-400 font-bold whitespace-nowrap">
                        {plan.users} Actifs
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold">Automatic Upgrade Threshold</p>
                  <p className="text-xs text-white font-black">75% Usage Reached (Avg)</p>
                </div>
                <Plus className="w-5 h-5 text-blue-400 hover:scale-110 transition-transform cursor-pointer" />
              </div>
            </div>
          </div>

          {/* BOTTOM HALF: INVOICES & BILLING */}
          <div className="flex-1 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Journal de Facturation & Recouvrement
              </h3>
              <div className="flex gap-2">
                <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2">
                  <Search className="w-3 h-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="bg-transparent border-none text-[10px] text-white focus:outline-none w-32"
                  />
                </div>
                <button className="bg-white/5 p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black border-b border-white/5">
                    <th className="pb-3 text-center">ID</th>
                    <th className="pb-3">Client / Org</th>
                    <th className="pb-3 text-center">Date</th>
                    <th className="pb-3 text-center">Montant</th>
                    <th className="pb-3 text-center">Statut</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {INVOICES.map((inv, i) => (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group hover:bg-white/2 transition-colors"
                    >
                      <td className="py-4 text-center">
                        <span className="text-[10px] text-gray-500 font-mono italic">{inv.id}</span>
                      </td>
                      <td className="py-4">
                        <p className="text-xs text-white font-bold">{inv.user}</p>
                      </td>
                      <td className="py-4 text-center">
                        <p className="text-[11px] text-gray-500">{inv.date}</p>
                      </td>
                      <td className="py-4 text-center">
                        <p className="text-xs text-white font-black">{inv.amount} €</p>
                      </td>
                      <td className="py-4 text-center">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg border border-blue-500/20">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg border border-white/10">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM MONITOR FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-blue-500/70">
            <ShieldCheck className="w-3 h-3" />
            Stripe & Paydunya Sync: ACTIVE [100% OK]
          </span>
          <span className="flex items-center gap-1.5 text-emerald-500/70 italic">
            <CreditCard className="w-3 h-3" />
            Split Payments: AUTOMATED (1,245 pending splits processed)
          </span>
          <span className="flex items-center gap-1.5 text-amber-500/70">
            <Calendar className="w-3 h-3" />
            Next Billing Cycle: Feb 15th
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-blue-400 transition-colors cursor-pointer uppercase tracking-tighter italic">
            FIN_METRIC_ENGINE_V4
          </span>
          <span className="text-white/20 font-black tracking-[0.3em] font-sans">
            AGRODEEP MONETIZATION UNIT
          </span>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
