'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, 
  Calendar, 
  Image as ImageIcon, 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit3, 
  BarChart3, 
  Trash2, 
  ChevronRight, 
  Globe, 
  Clock, 
  User, 
  Tag, 
  MapPin, 
  Users, 
  AlertCircle,
  CheckCircle2,
  Video,
  FileText,
  LayoutDashboard,
  SearchCheck,
  Zap,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBlogEventsStore, Article, AgroEvent, ContentStatus, ContentCategory } from '@/store/blogEventsStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function BlogEventsCMS() {
  const { activeTab, setActiveTab } = useBlogEventsStore();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#0B1120] text-slate-400 overflow-hidden">
      {/* 🚀 CMS HEADER */}
      <header className="p-8 pb-4 shrink-0 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-xl">
                <Newspaper className="w-8 h-8 text-black" />
              </div>
              AgroContent CMS
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2">
              <Zap className="w-3 h-3 text-emerald-500" />
              Gestion des Contenus & Événements Communautaires • v2.0
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCreating(true)}
              className="h-12 px-6 bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              {activeTab === 'blog' ? 'Nouvel Article' : 'Nouvel Événement'}
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-white/5">
          {[
            { id: 'blog', label: 'Blog & Articles', icon: Newspaper },
            { id: 'events', label: 'Calendrier Événements', icon: Calendar },
            { id: 'media', label: 'Médiathèque', icon: ImageIcon },
            { id: 'moderation', label: 'Modération', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "pb-4 px-2 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 relative",
                activeTab === tab.id ? "text-emerald-500" : "text-slate-500 hover:text-slate-200"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabContent"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* 📊 DYNAMIC CONTENT AREA */}
      <main className="flex-1 overflow-hidden p-8 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'blog' && <ArticleListView key="blog" />}
          {activeTab === 'events' && <EventsView key="events" />}
          {activeTab === 'media' && <MediaLibrary key="media" />}
          {activeTab === 'moderation' && <ModerationView key="moderation" />}
        </AnimatePresence>
      </main>

      {/* Full-screen Editor Modal Placeholder */}
      <AnimatePresence>
        {isCreating && (
          <ContentEditorModal 
            type={activeTab === 'blog' ? 'article' : 'event'} 
            onClose={() => setIsCreating(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-VIEWS ---

function ArticleListView() {
  const { articles } = useBlogEventsStore();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            placeholder="Rechercher un article..."
            className="w-full h-11 bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-4 text-xs text-white"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all">
            <Filter className="w-4 h-4" /> Filtres
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all">
            <Globe className="w-4 h-4" /> Langue: FR
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900/20 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/20 text-left">
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Article / Titre</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Auteur & Infos</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Catégorie</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Stats / Performance</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {articles.map((article) => (
                <ArticleRow key={article.id} article={article} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function ArticleRow({ article }: { article: Article }) {
  const statusConfig = {
    published: { label: 'Publié', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    draft: { label: 'Brouillon', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
    scheduled: { label: 'Programmé', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    archived: { label: 'Archivé', color: 'text-red-500 bg-red-500/10 border-red-500/20' },
  };

  const currentStatus = statusConfig[article.status];

  return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
      <td className="px-8 py-6 min-w-[300px]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-12 rounded-xl bg-slate-800 border border-white/5 overflow-hidden shrink-0">
            <img src={article.featuredImage} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h5 className="text-[12px] font-black text-white tracking-tight leading-tight uppercase italic">{article.title}</h5>
            <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">{article.excerpt}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-300">
            <User className="w-3 h-3 text-emerald-500" />
            {article.author}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
            <Clock className="w-3 h-3" />
            {format(new Date(article.publishDate), 'dd MMM yyyy', { locale: fr })}
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase text-white shadow-sm">{article.category}</span>
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] font-bold text-slate-400 border border-white/5">#{tag}</span>
            ))}
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-white">
              <Eye className="w-3 h-3 text-emerald-500" />
              {(article.views / 1000).toFixed(1)}K
            </div>
            <span className="text-[9px] font-black text-slate-600 uppercase">Vues</span>
          </div>
          <div className="flex flex-col border-l border-white/5 pl-4">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-500">
              <SearchCheck className="w-3 h-3" />
              {article.seoScore}%
            </div>
            <span className="text-[9px] font-black text-slate-600 uppercase">SEO Score</span>
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className={cn("px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2", currentStatus.color)}>
          {article.status === 'scheduled' && <Clock className="w-3 h-3" />}
          {currentStatus.label}
        </div>
      </td>
      <td className="px-8 py-6 text-right">
        <div className="flex items-center gap-2">
          <button className="p-2.5 bg-white/5 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-all group/btn">
            <Edit3 className="w-4 h-4" />
          </button>
          <button className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
            <BarChart3 className="w-4 h-4" />
          </button>
          <button className="p-2.5 bg-white/5 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function EventsView() {
  const { events } = useBlogEventsStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-12 gap-8 h-full overflow-y-auto custom-scrollbar"
    >
      {/* Calendar Header / Filters */}
      <div className="col-span-12 flex items-center justify-between mb-4">
        <div className="flex items-center gap-8">
           <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
              <button className="px-6 py-2 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">Liste</button>
              <button className="px-6 py-2 text-slate-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Calendrier</button>
           </div>
           <div className="flex items-center gap-4">
              <button className="p-2 bg-slate-900/50 border border-white/5 rounded-xl hover:bg-white/10 transition-all"><ChevronLeft className="w-5 h-5" /></button>
              <span className="text-sm font-black text-white uppercase italic tracking-widest">Avril 2024</span>
              <button className="p-2 bg-slate-900/50 border border-white/5 rounded-xl hover:bg-white/10 transition-all"><ChevronRight className="w-5 h-5" /></button>
           </div>
        </div>
        <div className="flex items-center gap-3">
          {['Formations', 'Salons', 'Webinaires'].map(cat => (
            <button key={cat} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-white/10 transition-all">{cat}</button>
          ))}
        </div>
      </div>

      {/* Main Events Grid */}
      <div className="col-span-8 grid grid-cols-2 gap-6">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Events Sidebar Stat */}
      <div className="col-span-4 space-y-6">
        <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 space-y-8">
          <h3 className="text-sm font-black text-white italic uppercase tracking-widest border-b border-white/5 pb-4">Résumé Engagement</h3>
          <div className="space-y-6">
            <StatSmall label="Inscriptions Totales" value="2,840" trend="+12%" />
            <StatSmall label="Taux de présence" value="84%" trend="+3%" />
            <StatSmall label="Note Satisfaction" value="4.8/5" trend="+0.1" />
          </div>
          <button className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4" /> Rapport Mensuel
          </button>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-emerald-500" />
            <h4 className="text-xs font-black text-emerald-500 uppercase italic">Prochain Gros Event</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed italic">Le salon de l'Agriculture d'Abidjan débute dans 12 jours. 450 agriculteurs du réseau AgroDeep sont déjà inscrits.</p>
        </div>
      </div>
    </motion.div>
  );
}

function EventCard({ event }: { event: AgroEvent }) {
  return (
    <div className="bg-slate-950/40 border border-white/5 rounded-[2.5rem] p-6 hover:border-emerald-500/30 transition-all group">
      <div className="w-full h-40 rounded-[1.5rem] overflow-hidden mb-6 relative">
        <img src={event.image} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20">
          {event.type}
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-black text-white italic uppercase leading-tight">{event.title}</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(event.date), 'dd MMMM yyyy', { locale: fr })}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            {event.time}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 italic">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-black text-white">{event.participants} {event.maxParticipants && `/ ${event.maxParticipants}`}</span>
          </div>
          <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-all">
            Détails
          </button>
        </div>
      </div>
    </div>
  );
}

function MediaLibrary() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Bibliothèque de Médias</h3>
        <div className="flex items-center gap-4">
           <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
             <input placeholder="Rechercher un média..." className="w-full h-10 bg-slate-900/50 border border-white/5 rounded-xl pl-10 text-[10px] text-white" />
           </div>
           <button className="h-10 px-6 bg-emerald-500 text-black font-black uppercase tracking-widest text-[9px] rounded-xl flex items-center gap-2">
             <Plus className="w-3.5 h-3.5" /> Téléverser
           </button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-6">
        {[
          { type: 'img', src: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=200', name: 'irrigation.jpg' },
          { type: 'img', src: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?auto=format&fit=crop&q=80&w=200', name: 'cacao.jpg' },
          { type: 'pdf', name: 'guide-pratiques.pdf' },
          { type: 'vid', name: 'recolte-demo.mp4' },
          { type: 'img', src: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=200', name: 'engrais.png' },
          { type: 'pdf', name: 'contrat-modele.pdf' },
        ].map((item, i) => (
          <div key={i} className="aspect-square bg-slate-950/40 border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-white/20 transition-all text-center">
            {item.type === 'img' ? (
              <img src={item.src} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : item.type === 'pdf' ? (
              <FileText className="w-12 h-12 text-blue-500 opacity-50" />
            ) : (
              <Video className="w-12 h-12 text-purple-500 opacity-50" />
            )}
            <span className="text-[8px] font-bold text-slate-500 truncate w-full">{item.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ModerationView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/20 rounded-[2.5rem] border border-white/5 p-12 flex flex-col items-center justify-center gap-6"
    >
      <div className="w-20 h-20 rounded-full bg-slate-950 flex items-center justify-center border border-white/5">
        <MessageSquare className="w-10 h-10 text-slate-800" />
      </div>
      <div className="text-center">
        <h4 className="text-sm font-black text-white italic uppercase tracking-widest mb-2">Pas de nouveaux commentaires</h4>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tout est modéré ! Vous avez rattrapé tous vos messages en attente.</p>
      </div>
    </motion.div>
  );
}

function StatSmall({ label, value, trend }: { label: string, value: string, trend: string }) {
  const isUp = trend.startsWith('+');
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-black text-slate-600 uppercase italic tracking-widest">{label}</span>
        <span className="text-xl font-black text-white italic tracking-tighter">{value}</span>
      </div>
      <span className={cn(
        "text-[9px] font-black px-2 py-0.5 rounded-lg",
        isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
      )}>{trend}</span>
    </div>
  );
}

function ContentEditorModal({ type, onClose }: { type: 'article' | 'event', onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#0B1120] flex flex-col"
    >
      <header className="h-20 border-b border-white/10 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-white uppercase italic truncate max-w-[400px]">Nouveau {type === 'article' ? 'Article de Blog' : 'Événement Communautaire'}</h2>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Éditeur AgroDeep v2.0 • Temps réel actif</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="h-11 px-6 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-300 hover:text-white transition-all">Enregistrer Brouillon</button>
          <button className="h-11 px-8 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">Publier Maintenant</button>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-12 max-w-4xl mx-auto w-full space-y-12">
          {/* Editor Header Area */}
          <div className="space-y-4">
             <input 
               placeholder="Entrez le titre ici..."
               className="w-full bg-transparent border-none text-5xl font-black text-white italic placeholder:text-white/10 focus:outline-none tracking-tighter"
             />
             <div className="flex items-center gap-6 border-y border-white/5 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">Admin_AgroDeep</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Tag className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">Ajouter Catégorie</span>
                </div>
             </div>
          </div>

          {/* Canvas Placeholder */}
          <div className="bg-slate-900/20 rounded-[3rem] p-12 border border-white/5 min-h-[400px] flex flex-col items-center justify-center group cursor-text space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
               <Plus className="w-8 h-8 text-white" />
            </div>
            <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Commencer à rédiger par bloc (Texte, Image, IA Widget...)</p>
          </div>
        </div>

        {/* Sidebar Settings Area */}
        <div className="w-[350px] border-l border-white/10 bg-slate-950/20 p-8 space-y-10 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/10 pb-4">Configuration SEO</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase italic">Focus Keyword</label>
                <input className="w-full h-11 bg-black/40 border border-white/5 rounded-xl px-4 text-xs text-white" placeholder="ex: Agriculture Bio" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase italic">SEO Descriptor</label>
                <textarea className="w-full h-24 bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-white" placeholder="Méta description pour Google..." />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/10 pb-4">Featured Media</h4>
            <div className="aspect-video bg-black/40 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-emerald-500/20 transition-all">
              <ImageIcon className="w-8 h-8 text-slate-800 group-hover:text-emerald-500 transition-colors" />
              <span className="text-[9px] font-black text-slate-700 uppercase">Ajouter Image</span>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
