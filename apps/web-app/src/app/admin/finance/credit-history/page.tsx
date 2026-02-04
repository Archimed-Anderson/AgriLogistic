'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  History,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  Banknote,
  FileText,
  User,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const HISTORY_DATA = [
  {
    id: 'TX-9921',
    farmer: 'Jean Dupont',
    type: 'REPAYMENT',
    amount: '€250.00',
    date: '2025-01-30',
    status: 'COMPLETED',
  },
  {
    id: 'TX-9920',
    farmer: 'Alice Martin',
    type: 'LOAN_DISBURSEMENT',
    amount: '€3,500.00',
    date: '2025-01-28',
    status: 'COMPLETED',
  },
  {
    id: 'TX-9919',
    farmer: 'Koffi Kouamé',
    type: 'INTEREST_ACCRUAL',
    amount: '€12.50',
    date: '2025-01-25',
    status: 'COMPLETED',
  },
  {
    id: 'TX-9918',
    farmer: 'Pierre Durand',
    type: 'LOAN_SETTLEMENT',
    amount: '€2,000.00',
    date: '2025-01-20',
    status: 'COMPLETED',
  },
  {
    id: 'TX-9917',
    farmer: 'Jean Dupont',
    type: 'REPAYMENT',
    amount: '€250.00',
    date: '2024-12-30',
    status: 'COMPLETED',
  },
];

export default function CreditHistoryPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 p-6 bg-[#020408]">
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
              <History className="w-6 h-6 text-slate-500" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
              Audit: Transaction Ledger
            </h1>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
            Immutable Credit Event History • Financial Regulatory Logs
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors" />
            <input
              type="text"
              placeholder="Search Transaction ID..."
              className="h-10 w-64 pl-10 pr-4 bg-slate-900/50 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-slate-500/50 transition-all"
            />
          </div>
          <button className="h-10 px-4 bg-white/5 border border-white/10 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" />
            Export Ledger
          </button>
        </div>
      </header>

      <div className="flex-1 bg-slate-950/40 border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
        <div className="grid grid-cols-6 p-6 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
          <span>Transaction ID</span>
          <span className="col-span-1">Farmer</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Date</span>
          <span className="text-right">Status</span>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-white/5">
            {HISTORY_DATA.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-6 p-6 items-center hover:bg-white/[0.02] transition-colors group"
              >
                <span className="text-[10px] font-mono font-bold text-slate-400">{tx.id}</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                    <User className="w-3 h-3 text-slate-600" />
                  </div>
                  <span className="text-[11px] font-black text-white uppercase italic">
                    {tx.farmer}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">
                    {tx.type.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-[11px] font-black text-white">{tx.amount}</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-slate-700" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{tx.date}</span>
                </div>
                <div className="flex justify-end">
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
