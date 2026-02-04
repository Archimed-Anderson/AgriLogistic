'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  FileCheck2,
  Award,
  Clock,
  AlertCircle,
  CheckCircle2,
  Search,
  Plus,
  Upload,
  Filter,
  MoreVertical,
  Cpu,
  Fingerprint,
  FileText,
  Calendar,
  Zap,
  Leaf,
  Globe,
  ExternalLink,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- TYPES ---
interface Certification {
  id: string;
  type: 'BIO' | 'FAIRTRADE' | 'RAINFOREST' | 'LABEL_ROUGE';
  farmerName: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'VALID' | 'EXPIRED' | 'EXPIRING_SOON' | 'PENDING';
  nftId?: string;
  ipfsHash?: string;
  confidenceScore: number; // AI check score
}

const CERT_CATALOG = [
  {
    id: 'BIO',
    name: 'Agriculture Biologique',
    icon: Leaf,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: 'FAIRTRADE',
    name: 'Commerce Équitable',
    icon: Globe,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'RAINFOREST',
    name: 'Rainforest Alliance',
    icon: Zap,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 'LABEL_ROUGE',
    name: 'Label Rouge / Local',
    icon: Award,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
];

const MOCK_CERTS: Certification[] = [
  {
    id: 'CERT-001',
    type: 'BIO',
    farmerName: 'Jean Dupont - Ferme du Soleil',
    issuer: 'Ecocert France',
    issueDate: '2025-01-15',
    expiryDate: '2026-01-15',
    status: 'VALID',
    nftId: '0x8823...f2a',
    ipfsHash: 'QmXoyp...78s',
    confidenceScore: 98,
  },
  {
    id: 'CERT-002',
    type: 'FAIRTRADE',
    farmerName: 'Coopérative de Yamoussoukro',
    issuer: 'Fairtrade Intl',
    issueDate: '2024-06-10',
    expiryDate: '2025-06-10',
    status: 'EXPIRING_SOON',
    nftId: '0x1c34...b9d',
    ipfsHash: 'QmZpqr...12t',
    confidenceScore: 95,
  },
  {
    id: 'CERT-003',
    type: 'BIO',
    farmerName: 'Alice Martin - BioPlaine',
    issuer: 'Ecocert France',
    issueDate: '2025-02-01',
    expiryDate: '2026-02-01',
    status: 'PENDING',
    confidenceScore: 0,
  },
];

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCerts = MOCK_CERTS.filter(
    (c) =>
      c.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMintNFT = (certId: string) => {
    setIsMinting(true);
    // Simulate Blockchain Minting
    setTimeout(() => {
      setIsMinting(false);
      // Update state in real app
    }, 3000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      {/* 🛡️ HEADER SECTION */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Compliance: Certifications & Blockchain
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Hyperledger Fabric Integrated • IPFS Storage • NFT Minting Vault
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search Certificate / Farmer..."
              className="h-10 w-64 pl-10 pr-4 bg-slate-900/50 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-blue-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="h-10 px-4 bg-blue-600 border border-blue-500/20 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Add Certification
          </button>
        </div>
      </header>

      {/* 📊 STATS CARDS */}
      <div className="grid grid-cols-4 gap-6 shrink-0">
        <StatCard label="Total Active" value="124" icon={CheckCircle2} color="text-emerald-500" />
        <StatCard label="Pending Validation" value="08" icon={Clock} color="text-amber-500" />
        <StatCard
          label="Expiring < 90 Days"
          value="15"
          icon={AlertCircle}
          color="text-red-500"
          badge="URGENT"
        />
        <StatCard label="Minted NFTs" value="116" icon={Cpu} color="text-blue-500" />
      </div>

      {/* 🏢 MAIN LAYOUT */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LEFT: CERTIFICATIONS GRID/LIST */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Registry Matrix
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-[10px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                <Filter className="w-3 h-3" />
                Sort by Expiry
              </button>
            </div>
          </div>

          <ScrollArea className="flex-1 bg-slate-900/10 rounded-[40px] border border-white/5 p-4">
            <div className="grid grid-cols-2 gap-4">
              {filteredCerts.map((cert) => (
                <CertCard
                  key={cert.id}
                  cert={cert}
                  isSelected={selectedCert?.id === cert.id}
                  onClick={() => setSelectedCert(cert)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* RIGHT: INSPECTION & WORKFLOW */}
        <aside className="w-[480px] flex flex-col gap-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedCert ? (
              <motion.div
                key={selectedCert.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="flex-1 flex flex-col gap-6"
              >
                <Card className="flex-1 p-8 bg-slate-950/40 backdrop-blur-2xl border-white/5 rounded-[40px] flex flex-col gap-8 shadow-2xl overflow-y-auto no-scrollbar relative">
                  {/* BG GLOW */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Fingerprint className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
                          Certificate Hash
                        </span>
                        <p className="text-[9px] font-mono text-slate-500 uppercase font-black italic">
                          {selectedCert.id}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCert(null)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6 z-10">
                    <div>
                      <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
                        {selectedCert.type}
                      </h2>
                      <div className="flex items-center gap-2 mt-2">
                        <Leaf className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          {selectedCert.farmerName}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 border border-white/5 rounded-3xl">
                        <span className="text-[8px] text-slate-600 uppercase font-black block mb-1">
                          Issue Date
                        </span>
                        <span className="text-xs font-black text-white">
                          {selectedCert.issueDate}
                        </span>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-3xl">
                        <span className="text-[8px] text-slate-600 uppercase font-black block mb-1">
                          Expiry Date
                        </span>
                        <span
                          className={cn(
                            'text-xs font-black',
                            selectedCert.status === 'EXPIRING_SOON' ? 'text-red-500' : 'text-white'
                          )}
                        >
                          {selectedCert.expiryDate}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 bg-black/40 border border-white/5 rounded-[32px] space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          AI Document Integrity
                        </h4>
                        <span className="text-[10px] font-black text-emerald-500">
                          {selectedCert.confidenceScore}% MATCH
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedCert.confidenceScore}%` }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                      <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">
                        OCR Analysis confirmed: Stamp match, Issuer signature valid, Date
                        consistency verified.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 z-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      Blockchain Status
                    </h3>
                    {selectedCert.nftId ? (
                      <div className="p-5 rounded-[24px] border border-blue-500/20 bg-blue-500/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                          <Award className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">
                            NFT MINTED
                          </p>
                          <p className="text-[9px] font-mono text-blue-400 mt-1">
                            {selectedCert.nftId}
                          </p>
                        </div>
                        <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-all">
                          <ExternalLink className="w-4 h-4 text-blue-400" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-5 rounded-[24px] border border-dashed border-slate-700 bg-slate-900/20 flex flex-col items-center gap-4 text-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase max-w-[200px]">
                          Certification verified by AI but not yet anchored on the Blockchain.
                        </p>
                        <button
                          onClick={() => handleMintNFT(selectedCert.id)}
                          disabled={isMinting}
                          className="w-full h-12 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-blue-400 transition-all flex items-center justify-center gap-2"
                        >
                          {isMinting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                              >
                                <Cpu className="w-4 h-4" />
                              </motion.div>
                              Minting Vault...
                            </>
                          ) : (
                            <>
                              <Cpu className="w-4 h-4" />
                              Mint Certification NFT
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-6 flex flex-col gap-3 z-10">
                    <button className="h-14 bg-slate-900 border border-white/5 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group">
                      <FileCheck2 className="w-5 h-5 text-blue-500" />
                      View Digital Original (IPFS)
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                    {selectedCert.status === 'EXPIRING_SOON' && (
                      <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <div className="flex-1">
                          <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">
                            Renewal Required
                          </p>
                          <p className="text-[8px] font-bold text-slate-500 uppercase">
                            Automated alert sent to farmer 3 months prior.
                          </p>
                        </div>
                        <button className="h-8 px-4 bg-red-500 text-white text-[9px] font-black uppercase rounded-lg">
                          RENEW NOW
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-900/10 rounded-[40px] border border-dashed border-white/5 space-y-6"
              >
                <div className="w-24 h-24 rounded-[40px] bg-slate-900/50 border border-white/10 flex items-center justify-center overflow-hidden relative">
                  <ShieldCheck className="w-12 h-12 text-slate-800" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-[0.4em] text-slate-600 italic">
                    Select Integrity node
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-3 max-w-[240px] font-bold uppercase tracking-tight leading-relaxed">
                    Auditing the global agricultural consensus. Select a certificate to view its
                    immutable footprint.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, badge }: any) {
  return (
    <Card className="bg-[#05070a] border-white/5 p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group">
      <div
        className={cn(
          'absolute -right-4 -top-4 w-24 h-24 blur-[60px] opacity-20',
          color.replace('text', 'bg')
        )}
      />
      <div className="flex items-center justify-between">
        <div
          className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-white/5', color)}
        >
          <Icon className="w-5 h-5" />
        </div>
        {badge && (
          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[8px] font-black tracking-widest uppercase">
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

function CertCard({
  cert,
  isSelected,
  onClick,
}: {
  cert: Certification;
  isSelected: boolean;
  onClick: () => void;
}) {
  const catalogItem = CERT_CATALOG.find((c) => c.id === cert.type);
  const Icon = catalogItem?.icon || FileText;

  return (
    <button
      onClick={onClick}
      className={cn(
        'p-6 rounded-[32px] border text-left transition-all relative overflow-hidden group',
        isSelected
          ? 'bg-white/10 border-white/20 shadow-xl'
          : 'bg-black/20 border-white/5 hover:border-white/10 hover:bg-white/5'
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={cn('p-3 rounded-2xl', catalogItem?.bgColor)}>
          <Icon className={cn('w-6 h-6', catalogItem?.color)} />
        </div>
        {cert.nftId && (
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">
              NFT MINTED
            </span>
          </div>
        )}
      </div>

      <h4 className="text-sm font-black uppercase text-white tracking-tight mb-2 italic">
        {cert.type}
      </h4>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6 min-h-[30px] line-clamp-2">
        {cert.farmerName}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-600 uppercase font-black">VALID UNTIL</span>
          <span
            className={cn(
              'text-[10px] font-mono font-black',
              cert.status === 'EXPIRING_SOON' ? 'text-red-500' : 'text-slate-400'
            )}
          >
            {cert.expiryDate}
          </span>
        </div>
        <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-slate-600 group-hover:text-blue-500 group-hover:border-blue-500/50 transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {isSelected && (
        <motion.div
          layoutId="cert-selection"
          className="absolute inset-0 border-2 border-blue-500/30 rounded-[32px] pointer-events-none"
        />
      )}
    </button>
  );
}
