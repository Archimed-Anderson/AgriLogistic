'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Smartphone,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Ban,
  DollarSign,
  Zap,
  MapPin,
  Users,
  ChevronRight,
  Wifi,
  WifiOff,
  Coins,
  History,
  Terminal,
} from 'lucide-react';

// --- MOCK DATA ---
const OPERATORS = [
  { name: 'Wave Sénégal', status: 'ONLINE', latency: '45ms', balance: '12M FCFA', icon: Wifi },
  { name: 'Orange Money CI', status: 'ONLINE', latency: '62ms', balance: '8.5M FCFA', icon: Wifi },
  {
    name: 'MTN Mobile Money',
    status: 'DEGRADED',
    latency: '450ms',
    balance: '3.2M FCFA',
    icon: Activity,
  },
  {
    name: 'Stripe (Mastercard/Visa)',
    status: 'ONLINE',
    latency: '120ms',
    balance: '45.2k €',
    icon: CreditCard,
  },
  {
    name: 'Binance Pay (USDC)',
    status: 'ONLINE',
    latency: '15ms',
    balance: '125k $',
    icon: Smartphone,
  },
];

const WITHDRAWALS_QUEUE = [
  {
    id: 'W-001',
    user: 'Modou Diop',
    amount: '250,000 FCFA',
    method: 'Wave',
    status: 'PENDING_VALIDATION',
    riskIndex: 12,
  },
  {
    id: 'W-002',
    user: 'Aminata Touré',
    amount: '1,200,000 FCFA',
    method: 'Orange Money',
    status: 'PENDING_VALIDATION',
    riskIndex: 65,
  },
  {
    id: 'W-003',
    user: 'Koffi Kouadio',
    amount: '45,000 FCFA',
    method: 'MTN',
    status: 'PROCESSING',
    riskIndex: 5,
  },
];

const FRAUD_ALERTS = [
  {
    id: 'F-1',
    type: 'VELOCITY_ATTACK',
    message: 'User #849 rechargé 12x en 1h via Wave',
    severity: 'CRITICAL',
    time: '5m',
  },
  {
    id: 'F-2',
    type: 'GEO_ANOMALY',
    message: 'Retrait IP Nigeria sur compte Sénégalais',
    severity: 'WARNING',
    time: '12m',
  },
];

// --- COMPONENTS ---

const OperatorCard = ({ operator }: any) => (
  <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-4 hover:border-blue-500/30 transition-all group">
    <div className="flex justify-between items-start mb-3">
      <div
        className={`p-2 rounded-xl border ${operator.status === 'ONLINE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}
      >
        <operator.icon className="w-5 h-5" />
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full ${operator.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}
        />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {operator.status}
        </span>
      </div>
    </div>
    <h4 className="text-white font-bold text-sm mb-1">{operator.name}</h4>
    <div className="flex justify-between items-end">
      <p className="text-xs text-gray-500 font-mono">{operator.latency}</p>
      <p className="text-sm font-black text-white">{operator.balance}</p>
    </div>
  </div>
);

export default function PaymentOperationsPage() {
  const [activeTab, setActiveTab] = useState('wallets');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🛸 BACKGROUND EFFECTS */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full" />
      </div>

      {/* 🏦 HEADER HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600/20 p-3 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <DollarSign className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Payment Hub & Africa Wallets
            </h1>
            <p className="text-gray-400 text-sm italic">
              Multi-channel gateway: Mobile Money, Cards, Stablecoins & Cash.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">
              Total Platform Liquidity
            </p>
            <p className="text-2xl font-black text-white">
              1.84M € <span className="text-xs text-emerald-400 font-normal ml-1">+2.4% Today</span>
            </p>
          </div>
          <button className="bg-white/5 p-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 italic">
            <Plus className="w-5 h-5" />
            Nouvelle Transaction
          </button>
        </div>
      </header>

      {/* 📡 OPERATORS GRID */}
      <div className="grid grid-cols-5 gap-4 relative z-10">
        {OPERATORS.map((op) => (
          <OperatorCard key={op.name} operator={op} />
        ))}
      </div>

      {/* 🧤 MAIN OPERATIONS CENTER */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* 📋 WALLETS & COMMANDS (LEFT) */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* NAVIGATION TABS */}
          <div className="flex items-center gap-2 bg-[#0D1117]/80 backdrop-blur-md border border-white/5 p-1 rounded-2xl w-fit">
            {['wallets', 'history', 'reconciliation', 'agents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* SEARCH & FILTER AREA */}
          <div className="flex items-center gap-4 bg-[#0D1117] border border-white/5 p-3 rounded-2xl shrink-0">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher un Wallet ID, N° Téléphone, ID Transaction..."
                className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white transition-all">
              <Filter className="w-4 h-4" />
              Filtres Avancés
            </button>
          </div>

          {/* DYNAMIC CONTENT AREA */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] text-gray-500 uppercase tracking-widest font-black bg-white/5 rounded-xl">
                  <th className="px-6 py-3 rounded-l-xl">Utilisateur / Wallet</th>
                  <th className="px-6 py-3 text-center">Moyen Préféré</th>
                  <th className="px-6 py-3 text-center">Solde Actuel</th>
                  <th className="px-6 py-3 text-center">Dernière Op.</th>
                  <th className="px-6 py-3 rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[#0D1117] hover:bg-[#161B22] transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4 rounded-l-2xl border-y border-l border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center text-blue-400 font-bold border border-white/10">
                          U{i}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">Utilisateur #{8420 + i}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-mono tracking-tighter">
                            ID: W-AFR-0{i}29
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-y border-white/5 text-center">
                      <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {i % 2 === 0 ? 'Wave' : 'Orange Money'}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-y border-white/5 text-center">
                      <p className="text-white font-black text-sm">
                        {mounted ? (142000 + i * 15600).toLocaleString() : '---'}
                        <span className="text-[10px] text-gray-500 ml-1">FCFA</span>
                      </p>
                    </td>
                    <td className="px-6 py-4 border-y border-white/5 text-center">
                      <div className="flex flex-col items-center">
                        <p className="text-emerald-400 font-bold text-xs">+12,500</p>
                        <p className="text-[9px] text-gray-500">Aujourd'hui, 14:20</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-y border-r border-white/5 rounded-r-2xl">
                      <div className="flex items-center justify-end gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl transition-all border border-blue-500/20">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl border border-white/10 group-hover:scale-110 shadow-lg">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 📋 RIGHT SIDEBAR: WITHDRAWALS & FRAUD */}
        <aside className="w-[400px] flex flex-col gap-6 shrink-0 overflow-hidden">
          {/* WITHDRAWAL QUEUE */}
          <div className="bg-[#0D1117] border border-white/5 rounded-3xl flex flex-col overflow-hidden max-h-[50%]">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                File d'attente Retraits
              </h4>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30 font-black">
                {WITHDRAWALS_QUEUE.length} À VALIDER
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
              {WITHDRAWALS_QUEUE.map((w) => (
                <div
                  key={w.id}
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[11px] text-white font-bold">{w.user}</p>
                      <p className="text-[9px] text-gray-500 font-mono tracking-tighter uppercase">
                        {w.method} • {w.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-white">{w.amount}</p>
                      <p
                        className={`text-[9px] font-bold ${w.riskIndex > 50 ? 'text-rose-400' : 'text-emerald-400'}`}
                      >
                        RISK IDX: {w.riskIndex}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-[10px] font-black py-2 rounded-xl transition-all border border-emerald-500/30 uppercase tracking-widest italic">
                      Valider
                    </button>
                    <button className="px-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white text-[10px] font-black py-2 rounded-xl transition-all border border-rose-500/20 uppercase tracking-widest">
                      Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FRAUD & ALERT HUD */}
          <div className="bg-[#0D1117] border border-white/5 rounded-3xl flex flex-col overflow-hidden max-h-[50%] shadow-2xl">
            <div className="p-4 flex items-center gap-2 bg-rose-500/10 border-b border-rose-500/20">
              <ShieldCheck className="w-4 h-4 text-rose-400 animate-pulse" />
              <h4 className="text-rose-400 font-black text-xs uppercase tracking-widest">
                Fraud Detection Unit
              </h4>
            </div>
            <div className="p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
              {FRAUD_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 blur-[20px] rounded-full group-hover:bg-rose-500/20 transition-all" />
                  <p className="text-[10px] font-black text-rose-400 mb-1 tracking-widest leading-none">
                    {alert.type}
                  </p>
                  <p className="text-[11px] text-white leading-relaxed mb-2 pr-6">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-gray-500 font-bold italic">
                    <span>Il y a {alert.time}</span>
                    <button className="text-rose-400 hover:underline">Investiger</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white/[0.02] mt-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                  Network Resilience
                </span>
                <span className="text-[9px] text-emerald-400 font-bold">OPTIMIZED</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 w-[70%]" />
                <div className="h-full bg-blue-500 w-[20%]" />
                <div className="h-full bg-rose-500 w-[10%]" />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* 🖥️ SYSTEM TERMINAL FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-blue-400">
            <Terminal className="w-3 h-3" />
            PS \ AGRODEEP-PAY-HQ {'>'} READY _
          </span>
          <span className="flex items-center gap-1.5 text-emerald-500">
            <Wifi className="w-3 h-3" />
            ACTIVE-GATEWAY: MULTI-OPERATOR (WAVE/ORANGE/MTN)
          </span>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <span className="hover:text-gray-400 cursor-pointer">PRIVACY: AES-256</span>
          <span className="hover:text-gray-400 cursor-pointer">NONCE: 0x8F2A...9C1D</span>
          <span className="text-white font-bold opacity-30 tracking-[0.2em]">AGRODEEP HUB 2.0</span>
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
