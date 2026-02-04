'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  Filter,
  Search,
  Lock,
  Eye,
  Landmark,
  FileSpreadsheet,
  FileJson,
  Send,
  History,
  FileCheck,
  ScrollText,
  AlertCircle,
} from 'lucide-react';

// --- MOCK DATA ---
const COMPLIANCE_TEMPLATES = [
  {
    id: 1,
    name: 'Rapport Mensuel Transactions (BCEAO)',
    category: 'Finance',
    format: ['PDF', 'XML'],
    schedule: 'Monthly',
  },
  {
    id: 2,
    name: 'Certificat Origine - EU Deforestation',
    category: 'Traceability',
    format: ['PDF'],
    schedule: 'On-Demand',
  },
  {
    id: 3,
    name: 'Audit KYC / AML Annuel',
    category: 'Compliance',
    format: ['Excel', 'PDF'],
    schedule: 'Yearly',
  },
  {
    id: 4,
    name: 'Déclaration TVA Trimestrielle',
    category: 'Tax',
    format: ['XML'],
    schedule: 'Quarterly',
  },
];

const GENERATED_REPORTS = [
  {
    id: 101,
    name: 'Transactions_BCEAO_Jan24.xml',
    type: 'XML',
    date: '2024-02-01',
    user: 'System',
    status: 'SENT',
    recipient: 'BCEAO API',
  },
  {
    id: 102,
    name: 'EUDR_Cert_Lot_#9928.pdf',
    type: 'PDF',
    date: '2024-02-03',
    user: 'J. Doe',
    status: 'APPROVED',
    recipient: 'Carrefour SA',
  },
  {
    id: 103,
    name: 'KYC_Audit_2023.xlsx',
    type: 'Excel',
    date: '2024-01-15',
    user: 'Admin',
    status: 'PENDING',
    recipient: 'Internal Audit',
  },
];

// --- COMPONENTS ---

const ReportCard = ({ template }: any) => (
  <div className="bg-[#161B22]/60 hover:bg-[#161B22] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 flex flex-col gap-3 transition-all group cursor-pointer relative overflow-hidden">
    <div className="flex justify-between items-start z-10">
      <div
        className={`p-2 rounded-lg ${
          template.category === 'Finance'
            ? 'bg-indigo-500/10 text-indigo-400'
            : template.category === 'Compliance'
              ? 'bg-rose-500/10 text-rose-400'
              : 'bg-emerald-500/10 text-emerald-400'
        }`}
      >
        {template.category === 'Finance' ? (
          <Landmark className="w-4 h-4" />
        ) : template.category === 'Compliance' ? (
          <ShieldCheck className="w-4 h-4" />
        ) : (
          <ScrollText className="w-4 h-4" />
        )}
      </div>
      <div className="flex gap-1">
        {template.format.map((fmt: string) => (
          <span
            key={fmt}
            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5"
          >
            {fmt}
          </span>
        ))}
      </div>
    </div>
    <div className="z-10">
      <h3 className="text-sm font-bold text-gray-200 group-hover:text-white mb-1 line-clamp-1">
        {template.name}
      </h3>
      <div className="flex items-center gap-2 text-[10px] text-gray-500">
        <Clock className="w-3 h-3" />
        {template.schedule === 'On-Demand' ? 'Manually Generated' : `Auto: ${template.schedule}`}
      </div>
    </div>
    <div className="h-1 w-12 bg-gray-800 rounded-full mt-auto z-10 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-purple-500" />
  </div>
);

const RecentExportRow = ({ report }: any) => (
  <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-colors group">
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-lg ${
          report.type === 'PDF'
            ? 'bg-rose-500/10 text-rose-400'
            : report.type === 'XML'
              ? 'bg-orange-500/10 text-orange-400'
              : 'bg-emerald-500/10 text-emerald-400'
        }`}
      >
        {report.type === 'PDF' ? (
          <FileText className="w-4 h-4" />
        ) : report.type === 'XML' ? (
          <FileJson className="w-4 h-4" />
        ) : (
          <FileSpreadsheet className="w-4 h-4" />
        )}
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
          {report.name}
        </h4>
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <Calendar className="w-3 h-3" /> {report.date} • {report.recipient}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span
        className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
          report.status === 'SENT'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : report.status === 'APPROVED'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}
      >
        {report.status}
      </span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white">
          <Eye className="w-3 h-3" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white">
          <Download className="w-3 h-3" />
        </button>
      </div>
    </div>
  </div>
);

export default function ComplianceReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('TEMPLATES'); // TEMPLATES, HISTORY, SCHEDULE

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 DOC PATTERN BG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(45deg, #6366f1 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600/20 p-3 rounded-2xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <FileCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Compliance <span className="text-indigo-500">EXPORTS</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Regulatory Reporting & Financial Audits.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('TEMPLATES')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                activeTab === 'TEMPLATES'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" /> Templates
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                activeTab === 'HISTORY'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <History className="w-3 h-3" /> Audit Log
            </button>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg border border-white/10">
            <Send className="w-3 h-3" /> Submit to Regulator
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10 flex gap-6">
        {/* LEFT: REPORT LIBRARY */}
        <div className="flex-[2] flex flex-col gap-6">
          {/* FILTERS */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search templates (e.g. 'TVA', 'BCEAO')..."
                className="w-full bg-[#161B22]/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* TEMPLATES GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pr-2 pb-2">
            {COMPLIANCE_TEMPLATES.map((template) => (
              <ReportCard key={template.id} template={template} />
            ))}
            {/* Add New Placeholder */}
            <div className="border border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.02] cursor-pointer transition-colors group">
              <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                <FileText className="w-6 h-6 text-gray-600 group-hover:text-gray-400" />
              </div>
              <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300">
                Create Template
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: RECENT ACTIVITY & APPROVALS */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <History className="w-3 h-3 text-indigo-400" /> Recent Exports
              </h3>
              <button className="text-[10px] text-gray-500 hover:text-white">View All</button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-2">
              {GENERATED_REPORTS.map((report) => (
                <RecentExportRow key={report.id} report={report} />
              ))}
            </div>
          </div>

          <div className="bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Security Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Lock className="w-4 h-4 text-emerald-400" />
                <div>
                  <h4 className="text-[10px] font-bold text-emerald-100">
                    Archive Encryption Active
                  </h4>
                  <p className="text-[9px] text-emerald-500/70">AES-256 (Retention: 10 Years)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <div>
                  <h4 className="text-[10px] font-bold text-amber-100">Pending Approvals</h4>
                  <p className="text-[9px] text-amber-500/70">2 reports need Legal Sign-off</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-indigo-500/70">
            <ShieldCheck className="w-3 h-3" />
            Compliance Mode: STRICT (UEMOA/GDPR)
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          REGULATORY_EXPORTS_V2
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
