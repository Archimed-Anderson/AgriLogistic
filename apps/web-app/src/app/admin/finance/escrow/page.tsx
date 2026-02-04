'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  ShieldCheck,
  FileCode,
  History,
  Gavel,
  AlertOctagon,
  ExternalLink,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Terminal,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Ban,
  Globe,
  FileText,
  Database,
  Zap,
  Cpu,
} from 'lucide-react';

// --- MOCK DATA ---
const ESCROW_CONTRACTS = [
  {
    id: 'SC-84920',
    title: "Céréales - Port d'Abidjan",
    amount: '145,000 €',
    buyer: 'Global Foods Ltd',
    seller: 'Coopérative ivoirienne',
    status: 'IN_TRANSIT',
    progress: 65,
    creationDate: '2026-01-28',
    conditions: ['Température < 14°C', 'POD Signé'],
    docHash: 'QmV6...XyZ1',
  },
  {
    id: 'SC-84921',
    title: 'Bananes Bio CI-SN',
    amount: '52,000 €',
    buyer: 'Sénégal Distribution',
    seller: 'Ferme des Palmes',
    status: 'PENDING_PICKUP',
    progress: 20,
    creationDate: '2026-01-30',
    conditions: ['Contrôle qualité A+', 'Température < 12°C'],
    docHash: 'QmR8...AbC2',
  },
  {
    id: 'SC-84918',
    title: 'Cacao Export Accra',
    amount: '890,000 €',
    buyer: 'Swiss Choco',
    seller: 'Ghana Cacao Board',
    status: 'DELIVERED_UNCONFIRMED',
    progress: 95,
    creationDate: '2026-01-15',
    conditions: ['POD Certifié', 'Paiement Droits Douane'],
    docHash: 'QmN4...FdE3',
  },
];

const BLOCKCHAIN_EVENTS = [
  {
    id: 'ev1',
    hash: '0x8f2a...3c4d',
    action: 'CONTRACT_CREATED',
    user: 'System IA',
    time: '10 min ago',
  },
  {
    id: 'ev2',
    hash: '0x1b4e...9f8a',
    action: 'FUNDS_LOCKED',
    user: 'Swiss Choco',
    time: '1 hour ago',
  },
  {
    id: 'ev3',
    hash: '0x7c2d...5e1b',
    action: 'GPS_MILESTONE_REACHED',
    user: 'Camion TR-89',
    time: '3 hours ago',
  },
];

const TEMPLATES = [
  { name: 'Standard Céréales', icon: FileText, category: 'Grain', audit: 'PASS' },
  { name: 'Périssables (IoT Linked)', icon: Cpu, category: 'Cold-Chain', audit: 'PASS' },
  { name: 'Export International', icon: Globe, category: 'Cross-border', audit: 'PASS' },
];

// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
  const configs: any = {
    IN_TRANSIT: { color: 'blue', label: 'En Transit', icon: RefreshCw },
    PENDING_PICKUP: { color: 'amber', label: 'Attente Pickup', icon: Clock },
    DELIVERED_UNCONFIRMED: { color: 'emerald', label: 'Livré (Non Confirmé)', icon: CheckCircle2 },
    DISPUTE: { color: 'rose', label: 'Litige', icon: AlertOctagon },
  };
  const config = configs[status] || configs['PENDING_PICKUP'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${config.color}-500/10 text-${config.color}-400 border border-${config.color}-500/20`}
    >
      <config.icon className={`w-3 h-3 ${status === 'IN_TRANSIT' ? 'animate-spin' : ''}`} />
      {config.label}
    </span>
  );
};

const ContractCard = ({ contract }: any) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors uppercase tracking-tight">
            {contract.title}
          </h4>
          <span className="text-[10px] text-gray-500 font-mono">#{contract.id}</span>
        </div>
        <StatusBadge status={contract.status} />
      </div>
      <div className="text-right">
        <p className="text-lg font-black text-white">{contract.amount}</p>
        <p className="text-[10px] text-gray-500 flex items-center justify-end gap-1">
          <Lock className="w-3 h-3" /> ESCROW SECURED
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
      <div className="bg-white/5 p-2 rounded-lg border border-white/5">
        <p className="text-gray-500 mb-1 flex items-center gap-1">
          <ArrowRight className="w-3 h-3 text-blue-400" /> Acheteur
        </p>
        <p className="text-white font-medium">{contract.buyer}</p>
      </div>
      <div className="bg-white/5 p-2 rounded-lg border border-white/5">
        <p className="text-gray-500 mb-1 flex items-center gap-1">
          <ArrowRight className="w-3 h-3 text-emerald-400" /> Vendeur
        </p>
        <p className="text-white font-medium">{contract.seller}</p>
      </div>
    </div>

    <div className="mb-4">
      <div className="flex justify-between text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest font-bold">
        <span>Progression Livraison</span>
        <span>{contract.progress}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${contract.progress}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500"
        />
      </div>
    </div>

    <div className="flex flex-wrap gap-2 mb-6">
      {contract.conditions.map((c: string) => (
        <span
          key={c}
          className="text-[9px] bg-white/5 text-gray-400 px-2 py-0.5 rounded border border-white/5"
        >
          {c}
        </span>
      ))}
    </div>

    <div className="flex gap-2">
      <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        Détails On-Chain
      </button>
      <button className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20 flex items-center justify-center group-hover:scale-105">
        <Ban className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

export default function EscrowGovernancePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 BLOCKCHAIN GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* 🛰️ HEADER HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Escrow & Smart Contracts
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                BLOCKCHAIN ACTIVE
              </span>
            </h1>
            <p className="text-gray-400 text-sm italic">
              Gouvernance décentralisée et sécurisation des fonds on-chain.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black leading-none mb-1">
              Total Locked Value (TLV)
            </p>
            <p className="text-2xl font-black text-white leading-none">2,415,800.00 €</p>
          </div>
          <button className="bg-white/5 p-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20 italic">
            <Plus className="w-5 h-5" />
            Déployer Smart Contract
          </button>
        </div>
      </header>

      {/* 🏁 MAIN COMMAND INTERFACE */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {/* 📋 DEPLOYMENT & ANALYTICS AREA */}
        <div className="w-[380px] flex flex-col gap-6 shrink-0 overflow-hidden">
          {/* SMART CONTRACT TEMPLATES */}
          <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 shrink-0">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
              <FileCode className="w-4 h-4 text-blue-400" />
              Modèles de Contrats (Chaincode)
            </h3>
            <div className="flex flex-col gap-3">
              {TEMPLATES.map((t) => (
                <div
                  key={t.name}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <t.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white uppercase">{t.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{t.category}</p>
                    </div>
                    <div className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      AUDIT: {t.audit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REPARTITION DES FONDS */}
          <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 flex-1 flex flex-col overflow-hidden">
            <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-6">
              <Database className="w-4 h-4 text-emerald-400" />
              Répartition des Fonds
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Attente Livraison', value: 1250000, color: 'blue', percent: 52 },
                { label: 'Audit en cours', value: 450000, color: 'amber', percent: 18 },
                { label: 'Conformité Douane', value: 315000, color: 'purple', percent: 14 },
                { label: 'Litiges actifs', value: 390000, color: 'rose', percent: 16 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[11px] mb-2 font-bold uppercase tracking-wider">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white">{item.value.toLocaleString()} €</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full bg-${item.color}-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SÉCURITÉ HUD */}
          <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-5 shrink-0 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Multisig Gouvernance</p>
              <p className="text-xs text-blue-400/80 font-mono">Status: 2/3 Validateurs actifs</p>
            </div>
          </div>
        </div>

        {/* 📑 ACTIVE CONTRACTS AREA */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* SEARCH & FILTERS HUD */}
          <div className="flex items-center gap-4 bg-[#0D1117] border border-white/5 p-3 rounded-2xl shrink-0">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher par ID, Titre ou Hash Blockchain..."
                className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white transition-all uppercase font-bold">
              <Filter className="w-4 h-4" />
              Filtres
            </button>
          </div>

          {/* CONTRACTS GRID */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-6 pb-6">
              {ESCROW_CONTRACTS.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          </div>
        </div>

        {/* 📜 BLOCKCHAIN LEDGER AREA */}
        <aside className="w-[350px] flex flex-col gap-6 shrink-0 overflow-hidden">
          <div className="flex-1 bg-[#0D1117] border border-white/5 rounded-3xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                Ledger Blockchain (LIVE)
              </h4>
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              {BLOCKCHAIN_EVENTS.map((ev) => (
                <div
                  key={ev.id}
                  className="relative pl-6 pb-4 border-l border-white/5 last:border-0"
                >
                  <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/[0.08] transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        {ev.action}
                      </p>
                      <p className="text-[9px] text-gray-500">{ev.time}</p>
                    </div>
                    <p className="text-[11px] text-white font-mono truncate mb-2">{ev.hash}</p>
                    <div className="flex items-center justify-between text-[9px] text-gray-500">
                      <span className="flex items-center gap-1 uppercase tracking-widest leading-none">
                        <User className="w-3 h-3" /> {ev.user}
                      </span>
                      <ExternalLink className="w-3 h-3 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-blue-600/10 border-t border-white/5 text-center">
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">
                Network Capacity
              </p>
              <div className="flex items-center justify-center gap-2 text-white font-black text-sm uppercase italic tracking-tighter">
                <Cpu className="w-4 h-4 text-blue-400" />
                1450 TPS | 0.0001 GAS
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ⌨️ FOOTER HUD - SYSTEM DATA */}
      <footer className="h-10 shrink-0 flex items-center justify-between px-2 text-[10px] text-gray-500 border-t border-white/5">
        <div className="flex items-center gap-6 lowercase font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 bg-emerald-500 rounded-full" />
            fabric-org1-peer0: running
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 bg-blue-500 rounded-full" />
            ipfs-cluster: connected (4 nodes)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 bg-purple-500 rounded-full" />
            block-height: 1,482,902
          </span>
        </div>
        <div className="uppercase tracking-widest font-bold">AgroDeep Trust Protocol v3.0.1</div>
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
