'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Code,
  Video,
  Users,
  MessageCircle,
  Search,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Edit3,
  Globe,
  HelpCircle,
  PlayCircle,
  LifeBuoy,
  BookMarked,
  Share2,
  Calendar,
  BarChart3,
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
const DOC_ARTICLES = [
  {
    id: 1,
    title: 'Comment publier une offre de maïs ?',
    category: 'Tutoriels App',
    lang: 'FR',
    views: 3420,
    helpful: 92,
    lastUpdated: '2 days ago',
  },
  {
    id: 2,
    title: 'Intégration API de paiement v2',
    category: 'API Ref',
    lang: 'EN',
    views: 850,
    helpful: 98,
    lastUpdated: '1 week ago',
  },
  {
    id: 3,
    title: 'Procédure : Incident Logistique',
    category: 'Interne',
    lang: 'FR',
    views: 120,
    helpful: 100,
    lastUpdated: '3 weeks ago',
  },
];

const FORUM_TOPICS = [
  {
    id: 1,
    title: 'Problème validation KYC',
    author: 'Coopérative Baobab',
    replies: 5,
    solved: true,
    tags: ['Account', 'Urgent'],
  },
  {
    id: 2,
    title: 'Best practices for humidity sensor setup',
    author: 'AgriTech Solutions',
    replies: 12,
    solved: false,
    tags: ['Hardware', 'IoT'],
  },
];

const WEBINARS = [
  {
    id: 1,
    title: 'Maîtriser le Dashboard Financier',
    date: '2024-03-20 14:00',
    author: 'Finance Team',
    registrants: 45,
  },
  {
    id: 2,
    title: 'Q&A: New Export Regulations',
    date: '2024-03-25 10:00',
    author: 'Legal Dept',
    registrants: 120,
  },
];

// --- COMPONENTS ---

const DocArticleRow = ({ article }: any) => (
  <div className="flex items-center justify-between p-3 bg-[#161B22] border border-white/5 hover:border-cyan-500/30 rounded-xl transition-all group">
    <div className="flex items-center gap-4">
      <div
        className={`p-2 rounded-lg ${
          article.category === 'API Ref'
            ? 'bg-purple-500/10 text-purple-400'
            : article.category === 'Interne'
              ? 'bg-amber-500/10 text-amber-400'
              : 'bg-cyan-500/10 text-cyan-400'
        }`}
      >
        {article.category === 'API Ref' ? (
          <Code className="w-4 h-4" />
        ) : article.category === 'Interne' ? (
          <BookMarked className="w-4 h-4" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
          {article.title}
        </h4>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" /> {article.lang}
          </span>
          <span>•</span>
          <span>Updated {article.lastUpdated}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
        <span className="flex items-center gap-1.5" title="Views">
          <Eye className="w-3 h-3" /> {article.views}
        </span>
        <span
          className={`flex items-center gap-1.5 ${article.helpful > 90 ? 'text-emerald-400' : 'text-gray-400'}`}
          title="Satisfaction"
        >
          <ThumbsUp className="w-3 h-3" /> {article.helpful}%
        </span>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
          <Edit3 className="w-4 h-4" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const ForumTopicCard = ({ topic }: any) => (
  <div className="p-4 bg-[#161B22] border border-white/5 hover:border-cyan-500/30 rounded-xl transition-all cursor-pointer group">
    <div className="flex justify-between items-start mb-2">
      <div className="flex gap-2">
        {topic.tags.map((tag: string) => (
          <span
            key={tag}
            className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-gray-400 border border-white/5"
          >
            {tag}
          </span>
        ))}
      </div>
      {topic.solved && (
        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> SOLVED
        </span>
      )}
    </div>
    <h4 className="text-sm font-bold text-gray-200 group-hover:text-cyan-400 mb-1 line-clamp-1">
      {topic.title}
    </h4>
    <div className="flex justify-between items-end text-[10px] text-gray-500">
      <span>
        by <span className="text-gray-400">{topic.author}</span>
      </span>
      <span className="flex items-center gap-1">
        <MessageCircle className="w-3 h-3" /> {topic.replies} replies
      </span>
    </div>
  </div>
);

export default function HelpCenterPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('DOCS'); // DOCS, COMMUNITY, ACADEMY

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden gap-6 p-6 bg-[#020408] relative">
      {/* 🌌 KNOWLEDGE GRID BG */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      ></div>

      {/* 📟 TOP HUD */}
      <header className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-3 rounded-2xl border border-white/10 shadow-xl shadow-cyan-500/10">
            <LifeBuoy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Knowledge <span className="text-cyan-400">BASE</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium italic">
              Documentation, Support & Academy.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            {[
              { id: 'DOCS', icon: BookOpen, label: 'Documentation' },
              { id: 'COMMUNITY', icon: Users, label: 'Community' },
              { id: 'ACADEMY', icon: Video, label: 'Academy' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <tab.icon className="w-3 h-3" /> {tab.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10">
            <Plus className="w-3 h-3" /> Create Article
          </button>
        </div>
      </header>

      {/* 🕹️ MAIN CONTENT */}
      <div className="flex-1 overflow-hidden relative z-10 flex gap-6">
        {/* LEFT: CONTENT AREA */}
        <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
          {activeTab === 'DOCS' && (
            <div className="h-full flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Library Content
                </h3>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search KB..."
                    className="bg-black/40 border border-white/10 rounded-lg pl-8 p-1.5 text-[10px] text-white w-64 focus:border-cyan-500/50 transition-colors outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 pb-2">
                {DOC_ARTICLES.map((doc) => (
                  <DocArticleRow key={doc.id} article={doc} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'COMMUNITY' && (
            <div className="h-full flex flex-col gap-4">
              <div className="flex justify-between items-center bg-cyan-900/10 border border-cyan-500/20 p-4 rounded-2xl">
                <div>
                  <h3 className="text-sm font-bold text-cyan-200">Community Forum</h3>
                  <p className="text-[10px] text-cyan-400/60">Connect with 12,500+ users</p>
                </div>
                <button className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold rounded-lg transition-colors border border-cyan-500/30">
                  Moderate Topics
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pr-2">
                {FORUM_TOPICS.map((topic) => (
                  <ForumTopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ACADEMY' && (
            <div className="h-full overflow-y-auto custom-scrollbar pr-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                Upcoming Webinars
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {WEBINARS.map((webinar) => (
                  <div
                    key={webinar.id}
                    className="relative group overflow-hidden rounded-2xl border border-white/5 bg-[#161B22]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />
                    <div className="h-32 bg-gray-800 flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-mono mb-1">
                        <Calendar className="w-3 h-3" /> {webinar.date}
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2">{webinar.title}</h3>
                      <div className="flex justify-between items-center border-t border-white/10 pt-2">
                        <span className="text-[10px] text-gray-400">By {webinar.author}</span>
                        <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-0.5 rounded-full">
                          {webinar.registrants} Registered
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: ANALYTICS & WIDGETS */}
        <div className="flex-1 flex flex-col gap-6">
          {/* HELP WIDGET PREVIEW */}
          <div className="bg-[#161B22]/80 backdrop-blur-xl border border-white/5 rounded-[30px] p-6">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <HelpCircle className="w-3 h-3 text-cyan-400" /> Contextual Help
            </h3>
            <div className="relative h-40 bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center group">
              <div className="absolute top-4 right-4 animate-bounce">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 cursor-pointer">
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-gray-500 block mb-2">Widget Preview</span>
                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white border border-white/5 transition-colors">
                  Launch Product Tour
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT ANALYTICS */}
          <div className="flex-1 bg-gradient-to-b from-[#161B22] to-black border border-white/5 rounded-[30px] p-6 flex flex-col">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 className="w-3 h-3 text-purple-400" /> Content Insights
            </h3>
            <div className="flex-1 flex flex-col gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase font-bold">
                  Search (No Results)
                </span>
                <div className="mt-2 text-sm text-gray-300 font-mono">
                  "export bceao xml" <span className="text-rose-400 text-[10px]">(142x)</span>
                </div>
                <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                  <div className="w-[75%] bg-rose-500 h-full" />
                </div>
                <p className="text-[9px] text-gray-500 mt-1 italic">High demand for this topic.</p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase font-bold">
                  Bot Resolution Rate
                </span>
                <div className="flex justify-between items-end mt-1">
                  <span className="text-2xl font-black text-white">68%</span>
                  <span className="text-[10px] text-emerald-400">↑ 4% vs last week</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📟 SYSTEM CONSOLE FOOTER */}
      <footer className="h-8 shrink-0 flex items-center justify-between px-2 text-[9px] font-mono border-t border-white/5 text-gray-600 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-cyan-500/70">
            <BookOpen className="w-3 h-3" />
            Articles Indexed: 1,402
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 italic">
            <Globe className="w-3 h-3" />
            Langs: FR, EN, ES, PT
          </span>
        </div>
        <div className="flex items-center gap-6 text-white/20 font-black tracking-[0.3em] font-sans pb-1">
          KNOWLEDGE_OS_v3.0
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

function CheckCircle2({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
