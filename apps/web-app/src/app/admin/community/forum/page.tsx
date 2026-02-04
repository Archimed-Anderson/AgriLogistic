'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Heart,
  Award,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  MessageCircle,
  ThumbsUp,
  AlertTriangle,
  CheckCircle2,
  Video,
  Image as ImageIcon,
  Calendar,
  Star,
  Shield,
  Flag,
  TrendingUp,
} from 'lucide-react';

// --- MOCK DATA ---
const TOPICS = [
  {
    id: 1,
    title: 'Comment optimiser l’irrigation du maïs en période sèche ?',
    category: 'Technique Agricole',
    author: { name: 'Moussa Diop', avatar: 'MD', badge: 'Expert Maïs', reputation: 450 },
    replies: 24,
    likes: 156,
    views: 1205,
    lastActivity: '2h ago',
    isHot: true,
  },
  {
    id: 2,
    title: 'Prix du cacao : Quelles prévisions pour Q3 ?',
    category: 'Marchés & Prix',
    author: {
      name: 'Coop. Yamoussoukro',
      avatar: 'CY',
      badge: 'Super Contributeur',
      reputation: 890,
    },
    replies: 18,
    likes: 89,
    views: 890,
    lastActivity: '5h ago',
    isHot: false,
  },
  {
    id: 3,
    title: 'Diagnostic : Taches brunes sur feuilles de manioc',
    category: 'Maladies & Ravageurs',
    author: { name: 'Jean K.', avatar: 'JK', badge: 'Nouveau', reputation: 45 },
    replies: 8,
    likes: 12,
    views: 340,
    lastActivity: '1d ago',
    hasMedia: true,
  },
];

const MEMBERS = [
  { id: 1, name: 'Amadou Koné', role: 'Ambassadeur', points: 1250, badge: 'Top Mentor' },
  { id: 2, name: 'Sarah N.', role: 'Expert', points: 890, badge: 'Agronome' },
  { id: 3, name: 'Coop. Espoir', role: 'Membre', points: 450, badge: 'Certifié Bio' },
];

const MODERATION_QUEUE = [
  {
    id: 1,
    user: 'User123',
    content: 'Offre de prêt miracle 0%...',
    reason: 'Spam / Scam',
    score: 0.98,
  },
  {
    id: 2,
    user: 'AngryFarmer',
    content: 'C’est de l’arnaque vos semences !',
    reason: 'Hate Speech',
    score: 0.75,
  },
];

// --- COMPONENTS ---

const TopicCard = ({ topic }: any) => (
  <div className="bg-[#161B22] border border-white/5 hover:border-amber-500/30 rounded-2xl p-4 flex gap-4 group transition-all cursor-pointer relative overflow-hidden">
    {/* Vote Column */}
    <div className="flex flex-col items-center gap-1 min-w-[40px]">
      <button className="text-gray-500 hover:text-amber-500 transition-colors">
        <ThumbsUp className="w-4 h-4" />
      </button>
      <span className="text-xs font-bold text-gray-300">{topic.likes}</span>
    </div>

    {/* Content */}
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
            topic.category === 'Technique Agricole'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : topic.category === 'Marchés & Prix'
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}
        >
          {topic.category}
        </span>
        {topic.isHot && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
            <TrendingUp className="w-3 h-3" /> Trending
          </span>
        )}
      </div>
      <h3 className="text-sm font-bold text-gray-200 group-hover:text-amber-400 transition-colors mb-2">
        {topic.title}
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[9px] font-bold text-white border border-white/10">
            {topic.author.avatar}
          </div>
          <span className="text-xs text-gray-400 hover:text-white transition-colors">
            {topic.author.name}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-amber-400/80 border border-amber-500/10 flex items-center gap-1">
            <Award className="w-3 h-3" /> {topic.author.badge}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {topic.hasMedia && (
            <div className="flex items-center gap-1 text-blue-400" title="Contains Media">
              <ImageIcon className="w-3 h-3" />
            </div>
          )}
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" /> {topic.replies}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {topic.views}
          </span>
          <span>{topic.lastActivity}</span>
        </div>
      </div>
    </div>
  </div>
);

const LeaderboardRow = ({ member, rank }: any) => (
  <div className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
    <div className="flex items-center gap-3">
      <span
        className={`text-xs font-black w-4 text-center ${rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-orange-700' : 'text-gray-600'}`}
      >
        {rank}
      </span>
      <div>
        <h4 className="text-xs font-bold text-white">{member.name}</h4>
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <Award className="w-3 h-3 text-amber-500/70" /> {member.badge}
        </div>
      </div>
    </div>
    <div className="text-right">
      <span className="text-xs font-bold text-amber-400">{member.points} pts</span>
    </div>
  </div>
);

export default function FarmersForumPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('DISCUSSIONS'); // DISCUSSIONS, MEMBERS, MODERATION

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 SOIL PATTERN BG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-amber-600 to-orange-700 p-3 rounded-2xl border border-white/10 shadow-xl shadow-amber-500/10">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Community <span className="text-amber-500">HUB</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Farmers Forum & Social Network.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            {['DISCUSSIONS', 'MEMBERS', 'MODERATION'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab === 'DISCUSSIONS' && <MessageSquare className="w-3 h-3" />}
                {tab === 'MEMBERS' && <Users className="w-3 h-3" />}
                {tab === 'MODERATION' && <Shield className="w-3 h-3" />}
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg border border-white/10">
            <Plus className="w-3 h-3" /> New Discussion
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10 flex gap-6">
        {/* LEFT: MAIN CONTENT */}
        <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
          {activeTab === 'DISCUSSIONS' && (
            <div className="h-full flex flex-col gap-4">
              {/* SEARCH & FILTERS */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search topics, tags, or members..."
                    className="w-full bg-[#161B22]/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <button className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white">
                  <Filter className="w-4 h-4" />
                </button>
              </div>

              {/* CATEGORIES PILLS */}
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {[
                  'All Topics',
                  'Technique Agricole',
                  'Marchés & Prix',
                  'Matériel',
                  'Météo',
                  'Annonces',
                ].map((cat, i) => (
                  <button
                    key={cat}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap transition-colors ${i === 0 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* TOPIC LIST */}
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2">
                {TOPICS.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'MODERATION' && (
            <div className="h-full overflow-y-auto custom-scrollbar pr-2">
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <div>
                    <h3 className="text-sm font-bold text-rose-200">Flagged Content Queue</h3>
                    <p className="text-[10px] text-rose-400/70">
                      2 items require immediate attention.
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-lg shadow-lg hover:bg-rose-600 transition-colors">
                  Process Batch
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {MODERATION_QUEUE.map((item) => (
                  <div key={item.id} className="bg-[#161B22] border border-white/5 p-4 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.user}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded border border-rose-500/20">
                          {item.reason}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Confidence: {item.score * 100}%
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded hover:bg-emerald-500/20 border border-emerald-500/20">
                          Allow
                        </button>
                        <button className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded hover:bg-red-500/20 border border-red-500/20">
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 italic">"{item.content}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: SIDEBAR */}
        <div className="flex-1 flex flex-col gap-6">
          {/* TOP CONTRIBUTORS */}
          <div className="bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Award className="w-3 h-3 text-amber-400" /> Top Contributors
            </h3>
            <div className="flex flex-col gap-2">
              {MEMBERS.map((m, i) => (
                <LeaderboardRow key={m.id} member={m} rank={i + 1} />
              ))}
            </div>
          </div>

          {/* EVENTS WIDGET */}
          <div className="flex-1 bg-gradient-to-b from-[#161B22] to-black border border-white/5 rounded-[30px] p-6 flex flex-col relative overflow-hidden">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calendar className="w-3 h-3 text-orange-400" /> Upcoming Events
            </h3>
            <div className="space-y-3 relative z-10">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl group hover:border-amber-500/30 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-bold text-amber-500 uppercase">Webinar</span>
                  <span className="text-[9px] text-gray-500">Tomorrow, 2PM</span>
                </div>
                <h4 className="text-xs font-bold text-gray-200 group-hover:text-white">
                  Sustainable Farming Tech
                </h4>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl group hover:border-amber-500/30 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-bold text-emerald-500 uppercase">Meetup</span>
                  <span className="text-[9px] text-gray-500">Oct 24, Lomé</span>
                </div>
                <h4 className="text-xs font-bold text-gray-200 group-hover:text-white">
                  Coopérative Local Fair
                </h4>
              </div>
            </div>
            {/* Deco */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-amber-500/70">
            <MessageSquare className="w-3 h-3" />
            Active Users: 1,240 (Today)
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 italic">
            <Flag className="w-3 h-3" />
            Moderation Queue: 2
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          COMMUNITY_FORUM_v4
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
