'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  BarChart3,
  Code,
  Play,
  Save,
  Filter,
  LayoutDashboard,
  Table as TableIcon,
  PieChart,
  LineChart,
  MoreVertical,
  Download,
  RefreshCw,
  Zap,
  Search,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Columns,
  Share2,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie,
  LineChart as ReLineChart,
  Line,
  Legend,
} from 'recharts';

// --- MOCK DATA ---
const TABLES_SCHEMA = [
  {
    name: 'fact_orders',
    type: 'table',
    columns: ['order_id', 'customer_id', 'amount', 'created_at'],
  },
  {
    name: 'dim_farmers',
    type: 'table',
    columns: ['farmer_id', 'region', 'crop_type', 'joined_date'],
  },
  {
    name: 'iot_telemetry',
    type: 'stream',
    columns: ['device_id', 'temperature', 'humidity', 'timestamp'],
  },
  {
    name: 'market_prices',
    type: 'view',
    columns: ['commodity', 'market_id', 'price_per_kg', 'date'],
  },
];

const QUERY_HISTORY = [
  { id: 1, name: 'Monthly Revenue by Region', time: '2h ago', rows: 450, duration: '1.2s' },
  { id: 2, name: 'IoT Anomalies Last 24h', time: '5h ago', rows: 12, duration: '0.8s' },
  { id: 3, name: 'Farmer Retention Cohort', time: 'Yesterday', rows: 24, duration: '3.5s' },
];

const MOCK_RESULTS_DATA = [
  { date: '2023-01', revenue: 45000, orders: 1200 },
  { date: '2023-02', revenue: 52000, orders: 1350 },
  { date: '2023-03', revenue: 48000, orders: 1100 },
  { date: '2023-04', revenue: 61000, orders: 1600 },
  { date: '2023-05', revenue: 55000, orders: 1400 },
  { date: '2023-06', revenue: 67000, orders: 1750 },
];

// --- COMPONENTS ---

const SchemaTableItem = ({ table }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg text-xs text-gray-300 transition-colors group"
      >
        <ChevronRight
          className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
        <Database className="w-3 h-3 text-violet-400" />
        <span className="font-mono group-hover:text-white">{table.name}</span>
        <span className="ml-auto text-[9px] text-gray-600 uppercase">{table.type}</span>
      </button>
      {isOpen && (
        <div className="pl-6 flex flex-col gap-0.5 mt-1 mb-2 border-l border-white/5 ml-3">
          {table.columns.map((col: string) => (
            <div
              key={col}
              className="flex items-center gap-2 py-1 px-2 hover:bg-white/5 rounded text-[10px] text-gray-500 font-mono cursor-grab active:cursor-grabbing"
            >
              <Columns className="w-2.5 h-2.5" />
              {col}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const VisualQueryBuilder = () => (
  <div className="flex-1 bg-[#0F1116] rounded-2xl border border-white/5 p-4 flex flex-col gap-4 relative overflow-hidden">
    {/* Drop Zones */}
    <div className="flex gap-4 h-32">
      <div className="flex-1 border-2 border-dashed border-white/10 rounded-xl bg-white/[0.02] flex flex-col items-center justify-center gap-2 hover:border-violet-500/30 transition-colors">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
          Dimensions (Group By)
        </span>
        <div className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded border border-violet-500/30 text-xs font-mono flex items-center gap-2">
          dim_farmers.region <X className="w-3 h-3 cursor-pointer hover:text-white" />
        </div>
      </div>
      <div className="flex-1 border-2 border-dashed border-white/10 rounded-xl bg-white/[0.02] flex flex-col items-center justify-center gap-2 hover:border-violet-500/30 transition-colors">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
          Metrics (Aggregations)
        </span>
        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 text-xs font-mono flex items-center gap-2">
          SUM(fact_orders.amount) <X className="w-3 h-3 cursor-pointer hover:text-white" />
        </div>
      </div>
    </div>

    {/* Filters */}
    <div className="border-t border-white/5 pt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2">
          <Filter className="w-3 h-3" /> Filters
        </span>
        <button className="text-[10px] text-violet-400 hover:text-violet-300 flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add Filter
        </button>
      </div>
      <div className="flex gap-2">
        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 flex items-center gap-2">
          <span className="text-gray-500 font-mono">joined_date</span>
          <span className="text-violet-400 font-bold">{'>'}</span>
          <span className="font-mono">2023-01-01</span>
          <X className="w-3 h-3 ml-2 cursor-pointer hover:text-white" />
        </div>
      </div>
    </div>
  </div>
);

const SqlEditor = () => (
  <div className="flex-1 bg-[#0F1116] rounded-2xl border border-white/5 p-4 font-mono text-sm relative group overflow-hidden">
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="p-1 hover:bg-white/10 rounded text-gray-400">
        <RefreshCw className="w-3 h-3" />
      </button>
    </div>
    <div className="text-violet-400">SELECT</div>
    <div className="pl-4 text-white">region,</div>
    <div className="pl-4 text-emerald-400">sum(amount) as total_revenue</div>
    <div className="text-violet-400">FROM</div>
    <div className="pl-4 text-white">fact_orders</div>
    <div className="text-violet-400">JOIN</div>
    <div className="pl-4 text-white">dim_farmers ON fact_orders.farmer_id = dim_farmers.id</div>
    <div className="text-violet-400">WHERE</div>
    <div className="pl-4 text-white">
      joined_date {'>'} <span className="text-amber-400">'2023-01-01'</span>
    </div>
    <div className="text-violet-400">GROUP BY</div>
    <div className="pl-4 text-white">region</div>

    <div className="mt-8 text-[10px] text-gray-600 flex items-center gap-2">
      <Zap className="w-3 h-3" />
      Estimated cost: 5.2 MB processed • Cache hit likely
    </div>
  </div>
);

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState('VISUAL'); // VISUAL, SQL
  const [activeTab, setActiveTab] = useState('EXPLORE'); // EXPLORE, DASHBOARD

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 GRID BG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-violet-600/20 p-3 rounded-2xl border border-violet-500/30 shadow-lg shadow-violet-500/10">
            <BarChart3 className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Deep <span className="text-violet-500">INSIGHTS</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Ad-hoc Analytics & OLAP Engine.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('EXPLORE')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                activeTab === 'EXPLORE'
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <Search className="w-3 h-3" /> Explorer
            </button>
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                activeTab === 'DASHBOARD'
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3 h-3" /> Dashboards
            </button>
          </div>
          <button className="bg-black/40 border border-white/10 hover:bg-white/5 text-gray-300 p-2.5 rounded-xl transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN WORKSPACE */}
      <div className="flex-1 flex gap-6 overflow-hidden relative z-10">
        {activeTab === 'EXPLORE' ? (
          <>
            {/* LEFT: SCHEMA BROWSER */}
            <div className="w-[280px] bg-[#0B0E14]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                  Data Catalog
                </h3>
                <button className="p-1 hover:bg-white/10 rounded text-gray-400">
                  <Search className="w-3 h-3" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Filter tables..."
                className="bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white w-full focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                {TABLES_SCHEMA.map((table) => (
                  <SchemaTableItem key={table.name} table={table} />
                ))}
              </div>
              {/* Saved Queries Helper */}
              <div className="pt-4 border-t border-white/5">
                <h4 className="text-[10px] text-gray-500 font-black uppercase mb-3">
                  Saved Queries
                </h4>
                <div className="flex flex-col gap-2">
                  {QUERY_HISTORY.map((q) => (
                    <div
                      key={q.id}
                      className="group flex items-center justify-between py-1 px-2 hover:bg-white/5 rounded cursor-pointer"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Save className="w-3 h-3 text-gray-600 group-hover:text-violet-400" />
                        <span className="text-[10px] text-gray-400 truncate group-hover:text-white transition-colors">
                          {q.name}
                        </span>
                      </div>
                      <span className="text-[8px] text-gray-700 font-mono">{q.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CENTER: QUERY BUILDER & RESULTS */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {/* EDITOR PANE */}
              <div className="h-[280px] flex flex-col bg-[#0B0E14]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-4 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                    <button
                      onClick={() => setMode('VISUAL')}
                      className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${mode === 'VISUAL' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                    >
                      Visual Builder
                    </button>
                    <button
                      onClick={() => setMode('SQL')}
                      className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${mode === 'SQL' ? 'bg-white/10 text-white' : 'text-gray-500'}`}
                    >
                      SQL Editor
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-violet-600/20">
                      <Play className="w-3 h-3 fill-current" /> Run Query
                    </button>
                  </div>
                </div>

                {mode === 'VISUAL' ? <VisualQueryBuilder /> : <SqlEditor />}
              </div>

              {/* RESULTS PANE */}
              <div className="flex-1 bg-[#0B0E14]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6 flex flex-col overflow-hidden relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    Result Set{' '}
                    <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[9px]">
                      450 Rows
                    </span>
                    <span className="text-[9px] text-gray-600 font-mono ml-2">142ms</span>
                  </h3>
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-white/10 rounded text-gray-400">
                      <TableIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-white/10 rounded text-white">
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-white/10 rounded text-gray-400">
                      <PieChart className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button className="p-1.5 hover:bg-white/10 rounded text-gray-400">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_RESULTS_DATA}>
                      <XAxis
                        dataKey="date"
                        stroke="#4b5563"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                      <ReTooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{
                          backgroundColor: '#000',
                          border: '1px solid #333',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                        name="Revenue ($)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* DASHBOARD MODE PLACEHOLDER */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-4 bg-[#0B0E14]/80 border border-white/5 rounded-[30px]">
            <LayoutDashboard className="w-16 h-16 opacity-20" />
            <h2 className="text-xl font-black uppercase text-gray-700">Dashboard Canvas</h2>
            <p className="text-xs text-gray-500">
              Drag widgets here to create custom monitoring views.
            </p>
            <button className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-xs font-bold transition-all">
              + Create New Widget
            </button>
          </div>
        )}
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-violet-500/70">
            <Database className="w-3 h-3" />
            Engine: ClickHouse (v23.8)
          </span>
          <span className="flex items-center gap-1.5 text-blue-500/70 italic">
            <Clock className="w-3 h-3" />
            Avg Query Time: 0.42s
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          ANALYTICS_EXPLORER_V1
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
