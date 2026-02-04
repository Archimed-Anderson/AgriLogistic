'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  Package,
  MapPin,
  Calendar,
  Thermometer,
  Truck,
  Factory,
  ShoppingBag,
  Search,
  Filter,
  Clock,
  ArrowRight,
  ChevronRight,
  Database,
  Link as LinkIcon,
  ExternalLink,
  ShieldCheck,
  Zap,
  Leaf,
  Container,
  Activity,
  User,
  Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- TYPES ---
interface LotStep {
  id: string;
  type: 'ORIGIN' | 'HARVEST' | 'TRANSPORT' | 'PROCESSING' | 'SALE';
  title: string;
  date: string;
  location: string;
  operator: string;
  details: string[];
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  blockchainHash: string;
}

interface ProductLot {
  id: string;
  productName: string;
  quantity: string;
  unit: string;
  currentStage: string;
  steps: LotStep[];
}

const MOCK_LOTS: ProductLot[] = [
  {
    id: 'LOT-AO-2025-042',
    productName: 'Tomates Cerises - Bio',
    quantity: '450',
    unit: 'Kg',
    currentStage: 'TRANSPORT',
    steps: [
      {
        id: 'S1',
        type: 'ORIGIN',
        title: 'Parcelle P-12 (Zone Nord)',
        date: '2025-01-01',
        location: 'Ferme du Soleil, France',
        operator: 'Jean Dupont',
        details: ['PH du sol: 6.8', 'Humidité moyenne: 45%', 'Sans pesticides'],
        status: 'COMPLETED',
        blockchainHash: '0x123...abc',
      },
      {
        id: 'S2',
        type: 'HARVEST',
        title: 'Récolte Manuelle',
        date: '2025-01-28',
        location: 'Ferme du Soleil',
        operator: 'Equipe Récolte A',
        details: ['Poids: 462kg', 'Maturité: 95%', 'Temp récolte: 18°C'],
        status: 'COMPLETED',
        blockchainHash: '0x456...def',
      },
      {
        id: 'S3',
        type: 'TRANSPORT',
        title: 'Transit Frigo #TR-99',
        date: '2025-01-29',
        location: 'En transit (A7)',
        operator: 'AgroLogistics SARL',
        details: ['Temp stable: 4.2°C', 'Humidité: 85%', 'KM prévus: 340km'],
        status: 'IN_PROGRESS',
        blockchainHash: '0x789...ghi',
      },
    ],
  },
  {
    id: 'LOT-CO-2025-015',
    productName: 'Café Arabica - Fairtrade',
    quantity: '1200',
    unit: 'Kg',
    currentStage: 'COMPLETED',
    steps: [
      {
        id: 'S1',
        type: 'ORIGIN',
        title: 'Plateau des 18 Montagnes',
        date: '2024-11-15',
        location: "Man, Côte d'Ivoire",
        operator: 'Coopérative Ivoirienne',
        details: ['Altitude: 1200m', 'Certifié Rainforest'],
        status: 'COMPLETED',
        blockchainHash: '0xabc...111',
      },
      {
        id: 'S2',
        type: 'SALE',
        title: 'Vente Finale - Carrefour Group',
        date: '2025-01-20',
        location: 'Plateforme Logistique Lyon',
        operator: 'Acheteur Central',
        details: ['Contrat n°9921', 'Prix: 4.2€/kg'],
        status: 'COMPLETED',
        blockchainHash: '0xefg...222',
      },
    ],
  },
];

export default function LotsPage() {
  const [selectedLot, setSelectedLot] = useState<ProductLot | null>(MOCK_LOTS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLots = MOCK_LOTS.filter(
    (l) =>
      l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* 🧬 HEADER */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Traceability: Real-Time Batch Stream
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Hyperledger Fabric Ledger • QR Code Genesis • IoT Telemetry Chain
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Scan QR or Search Lot ID..."
              className="h-10 w-64 pl-10 pr-4 bg-slate-900/50 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-emerald-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="h-10 px-4 bg-emerald-600 border border-emerald-500/20 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">
            <Container className="w-4 h-4" />
            Initiate New Lot
          </button>
        </div>
      </header>

      {/* 🏢 MAIN LAYOUT */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LEFT: LOTS MATRIX */}
        <div className="w-[380px] flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic flex items-center gap-2">
              <Database className="w-3 h-3" />
              Ledger Snapshot
            </h3>
            <span className="text-[10px] font-mono font-black text-slate-700">
              {filteredLots.length} ACTIVE BATCHES
            </span>
          </div>

          <ScrollArea className="flex-1 bg-slate-900/10 rounded-[32px] border border-white/5 p-3">
            <div className="space-y-3">
              {filteredLots.map((lot) => (
                <LotSmallCard
                  key={lot.id}
                  lot={lot}
                  isSelected={selectedLot?.id === lot.id}
                  onClick={() => setSelectedLot(lot)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* CENTER/RIGHT: LOT JOURNEY MAP */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedLot ? (
              <motion.div
                key={selectedLot.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 flex flex-col gap-6"
              >
                {/* LOT IDENTITY HUD */}
                <div className="grid grid-cols-4 gap-4 shrink-0">
                  <Card className="bg-[#05070a] border-white/5 p-5 rounded-3xl flex flex-col gap-2">
                    <span className="text-[8px] text-slate-600 uppercase font-black tracking-[0.2em]">
                      Batch ID
                    </span>
                    <span className="text-sm font-black text-white italic truncate tracking-tight">
                      {selectedLot.id}
                    </span>
                  </Card>
                  <Card className="bg-[#05070a] border-white/5 p-5 rounded-3xl flex flex-col gap-2">
                    <span className="text-[8px] text-slate-600 uppercase font-black tracking-[0.2em]">
                      Product
                    </span>
                    <span className="text-sm font-black text-emerald-500 truncate tracking-tight">
                      {selectedLot.productName}
                    </span>
                  </Card>
                  <Card className="bg-[#05070a] border-white/5 p-5 rounded-3xl flex flex-col gap-2">
                    <span className="text-[8px] text-slate-600 uppercase font-black tracking-[0.2em]">
                      Quantity
                    </span>
                    <span className="text-sm font-black text-white italic tracking-tight">
                      {selectedLot.quantity} {selectedLot.unit}
                    </span>
                  </Card>
                  <Card className="bg-[#05070a] border-white/5 p-5 rounded-3xl flex flex-col gap-2 group relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-2 opacity-50">
                      <QrCode className="w-12 h-12 text-white/5" />
                    </div>
                    <span className="text-[8px] text-slate-600 uppercase font-black tracking-[0.2em]">
                      QR Control
                    </span>
                    <button className="text-[9px] font-black text-emerald-500 underline flex items-center gap-1">
                      Generate Tag PDF <ExternalLink className="w-3 h-3" />
                    </button>
                  </Card>
                </div>

                {/* TIMELINE VIEW */}
                <Card className="flex-1 bg-slate-950/40 border-white/5 rounded-[40px] p-8 flex flex-col gap-8 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />

                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">
                          End-to-End Journey
                        </h2>
                        <span className="text-[9px] font-mono text-slate-600 uppercase font-black">
                          Immutable Chain Records
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                        CURRENT: {selectedLot.currentStage}
                      </span>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 z-10 px-4">
                    <div className="relative pt-4 pb-12">
                      {/* VERTICAL LINE */}
                      <div className="absolute left-[23px] top-4 bottom-12 w-[2px] bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent" />

                      <div className="space-y-12">
                        {selectedLot.steps.map((step, idx) => (
                          <TimelineItem
                            key={step.id}
                            step={step}
                            isLast={idx === selectedLot.steps.length - 1}
                          />
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </Card>
              </motion.div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-900/10 rounded-[40px] border border-dashed border-white/5">
                <p className="text-slate-600 uppercase font-black text-[10px] tracking-[0.4em]">
                  Initialize Ledger Sync
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function LotSmallCard({ lot, isSelected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-5 rounded-2xl border text-left transition-all relative overflow-hidden group',
        isSelected
          ? 'bg-white/10 border-white/20 shadow-xl'
          : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-mono text-slate-500 font-bold">{lot.id}</span>
        <LinkIcon
          className={cn(
            'w-3 h-3 opacity-30',
            isSelected ? 'text-emerald-500 opacity-100' : 'text-white'
          )}
        />
      </div>
      <h4
        className={cn(
          'text-[11px] font-black uppercase tracking-tight mb-1',
          isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'
        )}
      >
        {lot.productName}
      </h4>
      <div className="flex items-center gap-2 mt-4">
        <div className="px-2 py-0.5 bg-black/40 border border-white/5 rounded text-[8px] font-black text-emerald-500 uppercase">
          {lot.currentStage}
        </div>
        <span className="text-[9px] text-slate-700 font-black uppercase italic">
          {lot.quantity} {lot.unit}
        </span>
      </div>
      {isSelected && (
        <motion.div
          layoutId="lot-selection"
          className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"
        />
      )}
    </button>
  );
}

function TimelineItem({ step, isLast }: { step: LotStep; isLast: boolean }) {
  const Icon = {
    ORIGIN: MapPin,
    HARVEST: Leaf,
    TRANSPORT: Truck,
    PROCESSING: Factory,
    SALE: ShoppingBag,
  }[step.type];

  return (
    <div className="relative pl-16 group">
      {/* NODE ICON */}
      <div
        className={cn(
          'absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center z-20 transition-all',
          step.status === 'COMPLETED'
            ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20 text-black'
            : 'bg-slate-900 border border-white/10 text-slate-600'
        )}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {step.date}
              </span>
              {step.status === 'COMPLETED' && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
            </div>
            <h3 className="text-base font-black uppercase text-white tracking-tight italic">
              {step.title}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
              <User className="w-3 h-3 text-slate-600" />
              {step.operator} • {step.location}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
              <Hash className="w-3 h-3 text-slate-600" />
              <span className="text-[8px] font-mono text-slate-500">{step.blockchainHash}</span>
            </div>
            <button className="text-[8px] font-black text-emerald-500 uppercase hover:underline">
              View Block
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {step.details.map((detail, dIdx) => (
            <div
              key={dIdx}
              className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2"
            >
              <Zap className="w-3 h-3 text-amber-500 opacity-50" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                {detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
