'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone,
  Mail,
  MessageSquare,
  Bell,
  Send,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Copy,
  Edit3,
  Trash2,
  Clock,
  Zap,
  Globe,
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
} from 'recharts';

// --- MOCK DATA ---
const CAMPAIGNS = [
  {
    id: 1,
    name: 'Saison Cacao - Rappel Récolte',
    channel: 'SMS',
    status: 'Scheduled',
    audience: 'Prod. Cacao (Nord)',
    scheduledFor: '2024-03-15 08:00',
    reach: 12500,
    cost: '~$450',
  },
  {
    id: 2,
    name: 'Promo Intrants Bio - Newsletter',
    channel: 'Email',
    status: 'Sent',
    audience: 'All Cooperatives',
    scheduledFor: '2024-02-01 10:00',
    reach: 340,
    stats: { open: '42%', click: '12%' },
  },
  {
    id: 3,
    name: 'Alerte Météo Orage',
    channel: 'Push',
    status: 'Sent',
    audience: 'Active Users (Geo)',
    scheduledFor: '2024-01-28 14:30',
    reach: 45000,
    stats: { delivery: '98%' },
  },
];

const CHANNELS = [
  {
    id: 'sms',
    name: 'SMS Gateway',
    provider: 'Twilio',
    status: 'Healthy',
    limit: '10k/day',
    usage: '84%',
    icon: MessageSquare,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 'email',
    name: 'Email Engine',
    provider: 'SendGrid',
    status: 'Healthy',
    limit: '50k/day',
    usage: '12%',
    icon: Mail,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    id: 'push',
    name: 'Push Notif',
    provider: 'Firebase FCM',
    status: 'Healthy',
    limit: 'Unlimited',
    usage: '-',
    icon: Bell,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Biz',
    provider: 'Meta API',
    status: 'Degraded',
    limit: '1k/day',
    usage: '92%',
    icon: Smartphone,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
];

const TEMPLATES = [
  { id: 1, name: 'Payment Confirmation', type: 'Transactional', channel: 'Email/SMS' },
  { id: 2, name: 'Delivery Arriving', type: 'Transactional', channel: 'Push/SMS' },
  { id: 3, name: 'Welcome Onboarding', type: 'Marketing', channel: 'Email' },
];

// --- COMPONENTS ---

const CampaignCard = ({ campaign }: any) => (
  <div className="bg-[#161B22] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 flex flex-col gap-3 group transition-all relative overflow-hidden">
    <div className="flex justify-between items-start z-10">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            campaign.channel === 'SMS'
              ? 'bg-emerald-500/10 text-emerald-400'
              : campaign.channel === 'Email'
                ? 'bg-blue-500/10 text-blue-400'
                : 'bg-amber-500/10 text-amber-400'
          }`}
        >
          {campaign.channel === 'SMS' ? (
            <MessageSquare className="w-4 h-4" />
          ) : campaign.channel === 'Email' ? (
            <Mail className="w-4 h-4" />
          ) : (
            <Bell className="w-4 h-4" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-200 group-hover:text-white leading-tight">
            {campaign.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                campaign.status === 'Sent'
                  ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  : campaign.status === 'Scheduled'
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {campaign.status}
            </span>
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <Users className="w-3 h-3" /> {campaign.audience}
            </span>
          </div>
        </div>
      </div>
      <button className="text-gray-500 hover:text-white">
        <Edit3 className="w-4 h-4" />
      </button>
    </div>

    {campaign.status === 'Sent' ? (
      <div className="mt-2 pt-2 border-t border-white/5 grid grid-cols-2 gap-2 z-10">
        {Object.entries(campaign.stats).map(([key, val]: any) => (
          <div key={key} className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase">{key}</span>
            <span className="text-xs font-bold text-white">{val}</span>
          </div>
        ))}
      </div>
    ) : (
      <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2 text-[10px] text-gray-400 z-10">
        <Calendar className="w-3 h-3" /> Scheduled: {campaign.scheduledFor}
      </div>
    )}

    {/* Deco */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
  </div>
);

const ChannelStatus = ({ channel }: any) => (
  <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${channel.bg} ${channel.color}`}>
        <channel.icon className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-white">{channel.name}</h4>
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <span className="font-mono">{channel.provider}</span>
          <span
            className={`flex items-center gap-1 ${channel.status === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'}`}
          >
            • {channel.status}
          </span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <span className="text-[9px] text-gray-400 block mb-0.5">Daily Quota</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-white">{channel.limit}</span>
        {channel.usage !== '-' && (
          <span
            className={`text-[9px] px-1 rounded ${parseInt(channel.usage) > 90 ? 'bg-rose-500/20 text-rose-400' : 'bg-gray-700 text-gray-300'}`}
          >
            {channel.usage}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default function NotificationCenterPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('CAMPAIGNS'); // CAMPAIGNS, TEMPLATES, CHANNELS

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 PULSE BG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #ec4899 0%, transparent 50%)',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-pink-600 to-rose-600 p-3 rounded-2xl border border-white/10 shadow-xl shadow-pink-500/10">
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Communication <span className="text-pink-500">CENTER</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Omnichannel Marketing & Transactional Msgs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            {['CAMPAIGNS', 'TEMPLATES', 'CHANNELS'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${
                  activeTab === tab
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg border border-white/10">
            <Plus className="w-3 h-3" /> New Campaign
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10 flex gap-6">
        {/* LEFT: MAIN LISTS */}
        <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
          {activeTab === 'CAMPAIGNS' && (
            <div className="h-full flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Active Campaigns
                </h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="bg-black/40 border border-white/10 rounded-lg pl-8 p-1.5 text-[10px] text-white w-48"
                    />
                  </div>
                  <button className="p-1.5 bg-white/5 rounded-lg text-gray-400">
                    <Filter className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 pb-2">
                {CAMPAIGNS.map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'TEMPLATES' && (
            <div className="grid grid-cols-2 gap-4">
              {TEMPLATES.map((t) => (
                <div
                  key={t.id}
                  className="p-4 bg-[#161B22] border border-white/5 rounded-2xl hover:border-pink-500/20 transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                      <LayoutTemplate className="w-4 h-4" />
                    </div>
                    <div className="flex gap-1">
                      {t.channel.split('/').map((c) => (
                        <span
                          key={c}
                          className="text-[9px] bg-black/40 px-1.5 py-0.5 rounded text-gray-500"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-gray-200 group-hover:text-white mb-1">
                    {t.name}
                  </h3>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                    {t.type}
                  </span>
                </div>
              ))}
              <div className="border border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.02] cursor-pointer transition-colors group">
                <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Plus className="w-6 h-6 text-gray-600 group-hover:text-gray-400" />
                </div>
                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300">
                  Create Template
                </span>
              </div>
            </div>
          )}

          {activeTab === 'CHANNELS' && (
            <div className="flex flex-col gap-3">
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center gap-3 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <p className="text-xs text-amber-200">
                  <strong>Warning:</strong> WhatsApp Business API rate limit approaching (92%).
                  Consider switching priority to SMS/Push.
                </p>
              </div>
              {CHANNELS.map((c) => (
                <ChannelStatus key={c.id} channel={c} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: STATS & TOOLS */}
        <div className="flex-1 flex flex-col gap-6">
          {/* QUICK STATS */}
          <div className="bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">
              Engagement (7 Days)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1">
                  <Smartphone className="w-3 h-3" /> SMS Open
                </span>
                <div className="text-xl font-black text-white mt-1">98.2%</div>
                <div className="text-[9px] text-emerald-400 mt-1">Direct reach</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Open
                </span>
                <div className="text-xl font-black text-white mt-1">24.5%</div>
                <div className="text-[9px] text-amber-400 mt-1">-5% vs avg</div>
              </div>
            </div>
          </div>

          {/* RULES & SAFETY */}
          <div className="flex-1 bg-gradient-to-b from-[#161B22] to-black border border-white/5 rounded-[30px] p-6 flex flex-col relative overflow-hidden">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="w-3 h-3 text-pink-400" /> Compliance & Safety
            </h3>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-300">Quiet Hours</h4>
                    <p className="text-[9px] text-gray-500">20:00 - 07:00 (Local Time)</p>
                  </div>
                </div>
                <div className="w-8 h-4 bg-emerald-500/20 rounded-full relative flex items-center p-0.5">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full ml-auto shadow" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-300">Auto Translate</h4>
                    <p className="text-[9px] text-gray-500">Detect User Lang Pref.</p>
                  </div>
                </div>
                <div className="w-8 h-4 bg-emerald-500/20 rounded-full relative flex items-center p-0.5">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full ml-auto shadow" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-300">Frequency Cap</h4>
                    <p className="text-[9px] text-gray-500">Max 1 promo/day</p>
                  </div>
                </div>
                <div className="w-8 h-4 bg-emerald-500/20 rounded-full relative flex items-center p-0.5">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full ml-auto shadow" />
                </div>
              </div>
            </div>
            {/* Deco */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-pink-500/70">
            <Megaphone className="w-3 h-3" />
            Next Blast: 15min (Transactional)
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 italic">
            <Users className="w-3 h-3" />
            Audience Reach: 142k
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          COMMS_HUB_V1
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

function LayoutTemplate({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="7" x="3" y="3" rx="1" />
      <rect width="9" height="7" x="3" y="14" rx="1" />
      <rect width="5" height="7" x="16" y="14" rx="1" />
    </svg>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}
