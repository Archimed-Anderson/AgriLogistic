'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  ExternalLink,
  Copy,
  Eye,
  ChevronRight,
  Activity,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useBlockchainStore,
  BlockchainTransaction,
  TransactionType,
} from '@/store/blockchainStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const TX_TYPE_COLORS: Record<TransactionType, string> = {
  Payment: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  KYC_Validation: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Contract_Update: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  Offer_Modified: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  Asset_Transfer: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
};

const DATE_PRESETS = [
  { label: "Aujourd'hui", value: 'today' },
  { label: 'Mois en cours', value: 'month' },
  { label: 'Campagne 2024', value: 'campaign' },
  { label: 'Personnalisé', value: 'custom' },
];

export default function BlockchainExplorerPage() {
  const {
    transactions,
    blocks,
    searchQuery,
    setSearchQuery,
    selectedTx,
    selectTx,
    networkStatus,
  } = useBlockchainStore();

  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [datePreset, setDatePreset] = useState('month');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (searchQuery) {
      filtered = filtered.filter(
        (tx) =>
          tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.to.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((tx) => tx.type === filterType);
    }

    return filtered;
  }, [transactions, searchQuery, filterType]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers');
  };

  const handleExportPDF = () => {
    toast.info('Génération du rapport PDF en cours...');
    // TODO: Implement PDF export
  };

  const handleExportCSV = () => {
    toast.info('Export CSV en cours...');
    // TODO: Implement CSV export
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* HEADER */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Landmark className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Blockchain Explorer
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Hyperledger Fabric • Traçabilité Immuable
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 px-6 py-3 bg-slate-900/30 rounded-2xl border border-white/5">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                Block Height
              </span>
              <span className="text-lg font-black text-white font-mono">
                {networkStatus.height.toLocaleString()}
              </span>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                TPS
              </span>
              <span className="text-lg font-black text-emerald-500 font-mono">
                {networkStatus.tps}
              </span>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                Nodes
              </span>
              <span className="text-lg font-black text-blue-500 font-mono">
                {networkStatus.nodesActive}
              </span>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">
                Latency
              </span>
              <span className="text-lg font-black text-purple-500 font-mono">
                {networkStatus.avgLatency}
              </span>
            </div>
          </div>

          <button
            onClick={handleExportPDF}
            className="h-10 px-4 bg-white/5 border border-white/10 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="h-10 px-4 bg-indigo-500 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-indigo-500/10"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>

      {/* SEARCH & FILTERS */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
          <input
            type="text"
            placeholder="Rechercher par hash, adresse wallet, ou ID utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 bg-slate-900/20 border border-white/5 rounded-2xl pl-12 pr-4 text-sm text-white placeholder:text-slate-700 outline-none focus:border-indigo-500/30 transition-all"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'h-14 px-6 rounded-2xl border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all',
            showFilters
              ? 'bg-indigo-500 border-indigo-400 text-white'
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
          )}
        >
          <Filter className="w-4 h-4" />
          Filtres
        </button>
      </div>

      {/* FILTERS PANEL */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900/20 border border-white/5 rounded-2xl overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Type de transaction
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={cn(
                      'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border',
                      filterType === 'all'
                        ? 'bg-indigo-500 border-indigo-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                    )}
                  >
                    Tous
                  </button>
                  {(['Payment', 'KYC_Validation', 'Contract_Update', 'Offer_Modified'] as const).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={cn(
                          'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border',
                          filterType === type
                            ? TX_TYPE_COLORS[type]
                            : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                        )}
                      >
                        {type.replace('_', ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Période
                </span>
                <div className="flex gap-2">
                  {DATE_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setDatePreset(preset.value)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border',
                        datePreset === preset.value
                          ? 'bg-purple-500 border-purple-400 text-white'
                          : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* TRANSACTIONS LIST */}
        <div className="flex-1 flex flex-col gap-4 bg-[#05070a] rounded-[40px] border border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/20">
            <div>
              <h4 className="text-xl font-black italic uppercase tracking-tighter">
                Transactions récentes
              </h4>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 italic">
                {filteredTransactions.length} résultat(s)
              </p>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-8 space-y-3">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.hash}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectTx(tx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectTx(tx);
                    }
                  }}
                  className={cn(
                    'w-full p-6 rounded-2xl border text-left transition-all group hover:bg-white/5 cursor-pointer',
                    selectedTx?.hash === tx.hash
                      ? 'bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/20'
                      : 'bg-white/[0.02] border-white/5'
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest',
                          TX_TYPE_COLORS[tx.type]
                        )}
                      >
                        {tx.type.replace('_', ' ')}
                      </div>
                      {tx.integrityVerified ? (
                        <div className="flex items-center gap-1.5 text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Vérifié
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-500">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Anomalie
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono font-black">
                      Block #{tx.blockNumber.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-white font-black">{tx.hash}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(tx.hash);
                      }}
                      className="p-1 hover:bg-white/10 rounded transition-all"
                    >
                      <Copy className="w-3 h-3 text-slate-500" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-mono font-black">{tx.from}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="font-mono font-black">{tx.to}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(tx.timestamp).toLocaleString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <Zap className="w-3 h-3" />
                      Gas: {tx.gasUsed}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* TRANSACTION DETAILS */}
        <aside className="w-[480px] flex flex-col gap-4 bg-[#05070a] rounded-[40px] border border-white/5 overflow-hidden">
          {selectedTx ? (
            <>
              <div className="p-8 border-b border-white/5 bg-slate-950/20">
                <h4 className="text-xl font-black italic uppercase tracking-tighter">
                  Détails Transaction
                </h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 italic">
                  Informations complètes
                </p>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-8 space-y-6">
                  {/* Status */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Status
                    </span>
                    <div
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest',
                        selectedTx.status === 'confirmed'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                          : 'bg-red-500/10 border-red-500/20 text-red-500'
                      )}
                    >
                      {selectedTx.status === 'confirmed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      {selectedTx.status}
                    </div>
                  </div>

                  {/* Hash */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                      Transaction Hash
                    </span>
                    <div className="flex items-center gap-2 p-4 rounded-2xl bg-white/5">
                      <span className="text-xs font-mono text-white font-black flex-1 break-all">
                        {selectedTx.hash}
                      </span>
                      <button
                        onClick={() => handleCopy(selectedTx.hash)}
                        className="p-2 hover:bg-white/10 rounded transition-all"
                      >
                        <Copy className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  {/* Block */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                      Block Number
                    </span>
                    <div className="p-4 rounded-2xl bg-white/5">
                      <span className="text-lg font-mono text-white font-black">
                        #{selectedTx.blockNumber.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                      Timestamp
                    </span>
                    <div className="p-4 rounded-2xl bg-white/5">
                      <span className="text-sm text-white font-black">
                        {new Date(selectedTx.timestamp).toLocaleString('fr-FR', {
                          dateStyle: 'full',
                          timeStyle: 'long',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* From/To */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                        From
                      </span>
                      <div className="p-4 rounded-2xl bg-white/5">
                        <span className="text-xs font-mono text-white font-black break-all">
                          {selectedTx.from}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                        To
                      </span>
                      <div className="p-4 rounded-2xl bg-white/5">
                        <span className="text-xs font-mono text-white font-black break-all">
                          {selectedTx.to}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Gas */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                      Gas Used
                    </span>
                    <div className="p-4 rounded-2xl bg-white/5">
                      <span className="text-lg font-mono text-purple-500 font-black">
                        {selectedTx.gasUsed}
                      </span>
                    </div>
                  </div>

                  {/* Data */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                      Transaction Data (JSON)
                    </span>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <pre className="text-[11px] text-emerald-400 font-mono overflow-x-auto">
                        {JSON.stringify(selectedTx.data, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Integrity */}
                  <div className="p-6 rounded-2xl border bg-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-indigo-500" />
                      <span className="text-sm font-black uppercase tracking-tighter text-white">
                        Vérification d'intégrité
                      </span>
                    </div>
                    {selectedTx.integrityVerified ? (
                      <div className="flex items-center gap-2 text-emerald-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Hash correspond au bloc précédent • Chaîne intègre
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Anomalie détectée • Chaîne rompue
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <div className="w-24 h-24 rounded-[32px] bg-slate-900/50 border border-dashed border-white/10 flex items-center justify-center">
                <Database className="w-12 h-12 text-slate-700" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 italic">
                  Sélectionner transaction
                </h3>
                <p className="text-[11px] text-slate-700 uppercase font-black tracking-widest mt-2 max-w-[280px] leading-relaxed">
                  Cliquez sur une transaction pour voir les détails complets
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
