'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  MapPin,
  Filter,
  Download,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SourcingHub } from '@/components/dashboard/buyer/SourcingHub';

const COMMODITIES = [
  { symbol: 'CORN', name: 'Maïs Jaune (Senegal)', price: 245.5, change: +2.4, vol: '12K Tons' },
  { symbol: 'RICE', name: 'Riz Brisé (Valley)', price: 410.0, change: -0.8, vol: '5.4K Tons' },
  { symbol: 'MANGO', name: 'Mangues Kent (Sud)', price: 850.25, change: +5.1, vol: '800 Tons' },
  {
    symbol: 'GBEAN',
    name: 'Haricots Verts (Niayes)',
    price: 1205.0,
    change: +1.2,
    vol: '1.2K Tons',
  },
  { symbol: 'WHEAT', name: 'Blé Tendre (Import)', price: 315.75, change: -1.5, vol: '45K Tons' },
];

import { useRouter } from 'next/navigation';

export default function BuyerDashboard() {
  const router = useRouter();
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Volume Total (YTD)', 'Global Spend', 'Active Contracts', 'Saving vs Market'].map(
          (label, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardContent className="p-4 flex flex-col justify-between h-24">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                  {label}
                </span>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-mono text-white font-bold">
                    {i === 0 ? '45.2K T' : i === 1 ? '$ 12.5M' : i === 2 ? '14' : '+8.4%'}
                  </span>
                  <span
                    className={`text-xs font-bold ${i % 2 === 0 ? 'text-emerald-500' : 'text-blue-500'}`}
                  >
                    {i % 2 === 0 ? '▲ 12%' : '▼ 2%'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Main Trading Area */}
      <div className="grid grid-cols-12 gap-6 h-[600px]">
        {/* Live Market Feed (Left) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Market Discovery / Sourcing Hub */}
          <Card className="flex-1 bg-slate-900/50 border-slate-800 backdrop-blur flex flex-col hidden lg:flex overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-slate-800 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  AI Market Discovery
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[10px] border-slate-700 bg-slate-800 text-slate-400 hover:text-white uppercase"
                >
                  <Filter className="mr-1 h-3 w-3" /> Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[10px] border-slate-700 bg-slate-800 text-slate-400 hover:text-white uppercase"
                >
                  <Download className="mr-1 h-3 w-3" /> Export
                </Button>
              </div>
            </CardHeader>
            <div className="flex-1 p-6 relative">
              <SourcingHub />
            </div>
          </Card>
        </div>

        {/* Order Book / Watchlist (Right) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <Card className="h-full bg-slate-900/50 border-slate-800 backdrop-blur flex flex-col">
            <CardHeader className="py-4 px-4 border-b border-slate-800">
              <CardTitle className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live
                Commodity Prices
              </CardTitle>
            </CardHeader>
            <div className="flex-1 overflow-auto custom-scrollbar">
              <Table>
                <TableHeader className="bg-slate-900 sticky top-0">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase text-slate-500 font-bold h-8">
                      Symbol
                    </TableHead>
                    <TableHead className="text-[10px] uppercase text-slate-500 font-bold h-8 text-right">
                      Price
                    </TableHead>
                    <TableHead className="text-[10px] uppercase text-slate-500 font-bold h-8 text-right">
                      Chg%
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMMODITIES.map((c) => (
                    <TableRow
                      key={c.symbol}
                      className="border-slate-800 hover:bg-slate-800/50 group cursor-pointer transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-bold text-slate-300 py-3">
                        <div className="flex flex-col">
                          <span className="text-white group-hover:text-blue-400">{c.symbol}</span>
                          <span className="text-[9px] text-slate-500 truncate max-w-[100px]">
                            {c.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-right text-slate-300 font-bold">
                        ${c.price.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={`font-mono text-xs text-right font-bold ${c.change > 0 ? 'text-emerald-500' : 'text-red-500'}`}
                      >
                        {c.change > 0 ? '+' : ''}
                        {c.change}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-2 border-t border-slate-800">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-xs h-8"
                onClick={() => router.push('/dashboard/buyer/rfq')}
              >
                Create New RFQ
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
