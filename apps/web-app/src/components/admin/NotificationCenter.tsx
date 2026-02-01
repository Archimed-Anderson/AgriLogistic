'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Megaphone,
  BarChart3,
  Layers,
  Send,
  Plus,
  Mail,
  MessageSquare,
  Smartphone,
  Facebook,
  Pin,
  Eye,
  Trash2,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationStore, Notification, Campaign, NotificationType, NotificationPriority } from '@/store/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NotificationCenter() {
  const [activeModule, setActiveModule] = useState<'inbox' | 'campaigns' | 'analytics' | 'queue'>('inbox');
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    activeTab, 
    setActiveTab 
  } = useNotificationStore();

  return (
    <div className="flex flex-col h-screen bg-[#0B1120] text-slate-400 overflow-hidden">
      {/* 🚀 MODULE HEADER */}
      <header className="p-8 pb-4 shrink-0 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <Bell className="w-8 h-8 text-emerald-500 animate-pulse" />
              Centre de Commande NOTIFICATIONS
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              Communication Temps Réel • {unreadCount} Messages Non Lus
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveModule('campaigns')}
              className="h-12 px-6 bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Megaphone className="w-4 h-4" />
              Nouvelle Campagne
            </button>
            <button 
              onClick={markAllAsRead}
              className="h-12 px-6 bg-slate-800/50 border border-white/5 rounded-xl flex items-center gap-2 hover:bg-slate-700 transition-all text-[10px] font-black uppercase tracking-widest text-white"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Tout marquer comme lu
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-white/5">
          {[
            { id: 'inbox', label: 'Inbox / Flux Live', icon: Bell, count: unreadCount },
            { id: 'campaigns', label: 'Campagnes & Marketing', icon: Megaphone },
            { id: 'analytics', label: 'Performance & Stats', icon: BarChart3 },
            { id: 'queue', label: 'File d\'attente / Engine', icon: Layers },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id as any)}
              className={cn(
                "pb-4 px-2 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 relative",
                activeModule === tab.id ? "text-emerald-500" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-emerald-500 text-black px-1.5 py-0.5 rounded text-[9px] min-w-[15px] text-center">
                  {tab.count}
                </span>
              )}
              {activeModule === tab.id && (
                <motion.div 
                  layoutId="activeTab"
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
          {activeModule === 'inbox' && <InboxView key="inbox" />}
          {activeModule === 'campaigns' && <CampaignsView key="campaigns" />}
          {activeModule === 'analytics' && <AnalyticsView key="analytics" />}
          {activeModule === 'queue' && <QueueView key="queue" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- SUB-VIEWS ---

function InboxView() {
  const { notifications, activeTab, setActiveTab, markAsRead, togglePin, deleteNotification } = useNotificationStore();
  
  const filtered = useMemo(() => {
    if (activeTab === 'Toutes') return notifications;
    if (activeTab === 'Non lues') return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.type === activeTab.toLowerCase());
  }, [notifications, activeTab]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-8 h-full"
    >
      {/* Sidebar Filter */}
      <div className="w-64 shrink-0 space-y-6">
        <div className="space-y-2">
          {[
            { id: 'Toutes', count: notifications.length },
            { id: 'Non lues', count: notifications.filter(n => !n.isRead).length, highlight: true },
            { id: 'Système', count: notifications.filter(n => n.type === 'alert').length },
            { id: 'Utilisateurs', count: notifications.filter(n => n.type === 'user').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                activeTab === tab.id 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                  : "bg-slate-900/50 border-white/5 text-slate-500 hover:text-white hover:border-white/10"
              )}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.id}</span>
              <span className={cn(
                "text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg",
                tab.highlight ? "bg-emerald-500 text-black" : "bg-white/5"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-6 rounded-3xl bg-slate-950/50 border border-white/5 space-y-4">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aide Rapide</h4>
          <p className="text-[10px] text-slate-600 leading-relaxed italic">
            Les notifications prioritaires (Critique) déclenchent automatiquement une alerte dans la War Room.
          </p>
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 bg-slate-900/20 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              placeholder="Filtrer les messages..."
              className="w-full h-11 bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-4 text-xs text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 hover:bg-white/5 rounded-xl transition-all"><Filter className="w-4 h-4" /></button>
            <button className="p-3 hover:bg-white/5 rounded-xl transition-all"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
          <AnimatePresence initial={false}>
            {filtered.map(notif => (
              <NotificationItem 
                key={notif.id} 
                notification={notif} 
                onRead={() => markAsRead(notif.id)}
                onPin={() => togglePin(notif.id)}
                onDelete={() => deleteNotification(notif.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function NotificationItem({ notification, onRead, onPin, onDelete }: { 
  notification: Notification, 
  onRead: () => void,
  onPin: () => void,
  onDelete: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const icons = {
    alert: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    user: { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    transaction: { icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    system: { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  };

  const config = icons[notification.type] || icons.system;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "p-5 rounded-3xl border transition-all group flex flex-col gap-4 relative overflow-hidden",
        notification.isRead ? "bg-slate-900/30 border-white/5" : "bg-white/[0.03] border-emerald-500/20 shadow-xl shadow-emerald-500/5",
        notification.isPinned && "ring-1 ring-amber-500/30 border-amber-500/20"
      )}
    >
      <div className="flex items-start gap-5">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", config.bg)}>
          <config.icon className={cn("w-6 h-6", config.color)} />
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <h4 className={cn(
              "text-[13px] font-black uppercase italic tracking-tight",
              notification.isRead ? "text-slate-200" : "text-white"
            )}>
              {notification.title}
            </h4>
            <span className={cn(
              "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest",
              notification.priority === 'critical' ? "bg-red-500 text-white animate-pulse" :
              notification.priority === 'high' ? "bg-amber-500 text-black" : "bg-white/5 text-slate-500"
            )}>
              {notification.priority}
            </span>
            {notification.isPinned && <Pin className="w-3 h-3 text-amber-500 fill-amber-500/20" />}
          </div>
          
          <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed">
            {notification.excerpt}
          </p>
          
          <div className="flex items-center gap-4 pt-2">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true, locale: fr })}
            </span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-l border-white/5 pl-4">
              {notification.sender}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
          >
            <Eye className="w-4 h-4" />
          </button>
          {!notification.isRead && (
            <button 
              onClick={onRead}
              className="p-2.5 hover:bg-emerald-500/10 rounded-xl transition-all text-slate-400 hover:text-emerald-500"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onPin}
            className={cn(
              "p-2.5 rounded-xl transition-all",
              notification.isPinned ? "text-amber-500 bg-amber-500/10" : "text-slate-400 hover:bg-amber-500/10 hover:text-amber-500"
            )}
          >
            <Pin className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className="p-2.5 hover:bg-red-500/10 rounded-xl transition-all text-slate-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-white/5 text-[11px] text-slate-300 leading-relaxed bg-black/20 p-4 rounded-2xl">
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CampaignsView() {
  const { campaigns, createCampaign } = useNotificationStore();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-12 gap-8 h-full overflow-y-auto custom-scrollbar"
    >
      {/* List of Campaigns */}
      <div className="col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Campagnes Actives / Récentes</h3>
          <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
            <button className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-[9px] font-black italic uppercase">Toutes</button>
            <button className="px-4 py-1.5 text-slate-600 hover:text-slate-300 rounded-lg text-[9px] font-black italic uppercase">Brouillons</button>
            <button className="px-4 py-1.5 text-slate-600 hover:text-slate-300 rounded-lg text-[9px] font-black italic uppercase">Programmées</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pb-12">
          {campaigns.map(camp => (
            <div key={camp.id} className="p-6 bg-slate-900/40 border border-white/5 rounded-[2rem] group hover:border-emerald-500/30 transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    {camp.type === 'push' && <Smartphone className="w-6 h-6 text-emerald-500" />}
                    {camp.type === 'email' && <Mail className="w-6 h-6 text-blue-500" />}
                    {camp.type === 'sms' && <MessageSquare className="w-6 h-6 text-amber-500" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white italic uppercase">{camp.name}</h5>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{camp.id}</span>
                      <span className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                        camp.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" :
                        camp.status === 'sending' ? "bg-blue-500/10 text-blue-500 animate-pulse" : "bg-white/5 text-slate-500"
                      )}>
                        {camp.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-[9px] font-black text-slate-600 uppercase block mb-2">Ciblage</span>
                  <span className="text-[10px] text-white font-bold">{camp.target}</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-[9px] font-black text-slate-600 uppercase block mb-2">Délivrés</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{camp.delivered.toLocaleString()}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-[9px] font-black text-slate-600 uppercase block mb-2">Ouverture</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-blue-500">{camp.delivered > 0 ? Math.round((camp.opened/camp.delivered)*100) : 0}%</span>
                    <div className="w-10 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${camp.delivered > 0 ? (camp.opened/camp.delivered)*100 : 0}%` }} />
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <span className="text-[9px] font-black text-slate-600 uppercase block mb-2">Conversion</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-amber-500">{camp.converted}</span>
                    <ArrowUpRight className="w-3 h-3 text-amber-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Sidebar - Quick Creator */}
      <div className="col-span-4 space-y-6 sticky top-0">
        <div className="p-8 rounded-[2.5rem] bg-emerald-500 text-black space-y-8 relative overflow-hidden shadow-2xl shadow-emerald-500/20">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-black/5 rounded-full blur-3xl" />
          <div className="relative">
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Nouveau Message</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Diffusion Multi-canal</p>
          </div>

          <div className="space-y-4 relative">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest pl-1">Type de canal</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="h-12 bg-black/10 border border-black/10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-black/20 transition-all">
                  <Smartphone className="w-4 h-4" /> Push
                </button>
                <button className="h-12 bg-black/10 border border-black/10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-black/20 transition-all">
                  <Mail className="w-4 h-4" /> Email
                </button>
                <button className="h-12 bg-black/10 border border-black/10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-black/20 transition-all">
                  <MessageSquare className="w-4 h-4" /> SMS
                </button>
                <button className="h-12 bg-black/10 border border-black/10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-black/20 transition-all">
                  <Zap className="w-4 h-4" /> WhatsApp
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest pl-1">Audience Cible</label>
              <select className="w-full h-12 bg-black/10 border border-black/10 rounded-xl px-4 text-[11px] font-bold focus:outline-none focus:ring-2 ring-black/20">
                <option>Tous les Agriculteurs</option>
                <option>Acheteurs Certifiés</option>
                <option>Transporteurs Zone Sud</option>
                <option>Utilisateurs Inactifs 30j</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest pl-1">Contenu Message</label>
              <textarea 
                className="w-full h-32 bg-black/10 border border-black/10 rounded-xl p-4 text-[11px] font-bold focus:outline-none focus:ring-2 ring-black/20 placeholder:text-black/30"
                placeholder="Écrivez votre message ici... Utilisez {{name}} pour personnaliser."
              />
            </div>

            <button className="w-full h-14 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] mt-4 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
              <Send className="w-4 h-4" /> 
              Envoyer maintenant
            </button>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Templates Récupérables</h4>
            <Plus className="w-4 h-4 text-emerald-500 cursor-pointer" />
          </div>
          <div className="space-y-3">
            {['Rappel Récolte', 'Alerte Prix', 'Validation KYC', 'Maintenance Système'].map(tmp => (
              <div key={tmp} className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 flex items-center justify-between hover:bg-slate-900 cursor-pointer transition-all">
                <span className="text-[10px] font-bold text-slate-300">{tmp}</span>
                <ChevronRight className="w-3 h-3 text-slate-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnalyticsView() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 h-full overflow-y-auto custom-scrollbar pb-12"
    >
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Taux Délivérance', value: '99.8%', trend: '+0.2%', icon: Send, color: 'text-emerald-500' },
          { label: 'Taux Ouverture', value: '64.5%', trend: '+5.4%', icon: Eye, color: 'text-blue-500' },
          { label: 'Conversions', value: '12.2%', trend: '-1.1%', icon: Target, color: 'text-amber-500' },
          { label: 'Volume 24h', value: '124K', trend: '+12%', icon: Activity, color: 'text-purple-500' },
        ].map(stat => (
          <div key={stat.label} className="p-6 rounded-[2rem] bg-slate-900/40 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[9px] font-black flex items-center gap-1",
                stat.trend.startsWith('+') ? "text-emerald-500" : "text-red-500"
              )}>
                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{stat.label}</span>
              <span className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 p-8 rounded-[2.5rem] bg-slate-900/20 border border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Activité Temporelle (24h)</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">Push</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">Email</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-2 pb-2">
            {[45, 60, 80, 55, 40, 95, 120, 110, 85, 70, 60, 50, 45, 65, 85, 130, 150, 110, 90, 80, 70, 65, 55, 40].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full space-y-0.5">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: h * 1.5 }}
                    className="w-full bg-emerald-500/20 rounded-t-sm group-hover:bg-emerald-500/40 transition-colors"
                  />
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: h * 0.5 }}
                    className="w-full bg-blue-500/20 rounded-t-sm group-hover:bg-blue-500/40 transition-colors"
                  />
                </div>
                <span className="text-[7px] font-bold text-slate-700">{i}h</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-slate-950 border border-white/5 space-y-6">
            <h4 className="text-sm font-black text-white italic uppercase tracking-widest border-b border-white/5 pb-4">Santé du Système</h4>
            <div className="space-y-6">
              <HealthItem label="SMTP SendGrid" status="active" latency="45ms" />
              <HealthItem label="Twilio SMS API" status="active" latency="120ms" />
              <HealthItem label="WhatsApp/Meta" status="warning" latency="850ms" />
              <HealthItem label="FCM (Push)" status="active" latency="12ms" />
              <HealthItem label="Socket.io Gateway" status="active" latency="5ms" />
            </div>
          </div>
          
          <div className="p-6 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Webhook Warning</h5>
              <p className="text-[9px] text-slate-500 font-medium">12 échecs de callback Africa's Talking</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HealthItem({ label, status, latency }: { label: string, status: 'active' | 'warning' | 'error', latency: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-2 h-2 rounded-full",
          status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" :
          status === 'warning' ? "bg-amber-500" : "bg-red-500"
        )} />
        <span className="text-[10px] font-bold text-slate-300">{label}</span>
      </div>
      <span className="text-[9px] font-mono text-slate-600 font-black italic">{latency}</span>
    </div>
  );
}

function QueueView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-3 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Messages en attente</h4>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <span className="text-4xl font-black text-white italic tracking-tighter">1,245</span>
          <div className="flex items-center gap-2 pt-2">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] font-black text-emerald-500 uppercase">Stable</span>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Débit Moyen</h4>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <span className="text-4xl font-black text-white italic tracking-tighter">850<span className="text-sm opacity-50 ml-2 italic">msg/s</span></span>
          <div className="flex items-center gap-2 pt-2">
            <ArrowUpRight className="w-3 h-3 text-blue-500" />
            <span className="text-[9px] font-black text-blue-500 uppercase">+15% vs moyenne</span>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Taux d'Échec</h4>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <span className="text-4xl font-black text-white italic tracking-tighter">0.05%</span>
          <div className="flex items-center gap-2 pt-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] font-black text-emerald-500 uppercase">Performance Nominale</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/20 rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-slate-950/20">
          <h4 className="text-xs font-black text-white italic uppercase tracking-[0.2em]">Flux de la file d'attente (Real-time Flow)</h4>
        </div>
        <div className="p-8 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          {[
            { id: 'JOB-9921', type: 'SMS', target: '+225 07...', status: 'Processing', priority: 'High' },
            { id: 'JOB-9920', type: 'Push', target: 'Agri-001', status: 'Success', priority: 'Critical' },
            { id: 'JOB-9919', type: 'Email', target: 'kofi@...', status: 'Success', priority: 'Normal' },
            { id: 'JOB-9918', type: 'SMS', target: '+225 08...', status: 'Retrying (1/3)', priority: 'High' },
            { id: 'JOB-9917', type: 'WA', target: '+225 01...', status: 'Queued', priority: 'High' },
            { id: 'JOB-9916', type: 'Push', target: 'Agri-241', status: 'Processing', priority: 'Normal' },
          ].map(job => (
            <div key={job.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-mono text-slate-600 font-black">{job.id}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                  job.type === 'SMS' ? "bg-amber-500/10 text-amber-500" :
                  job.type === 'Push' ? "bg-emerald-500/10 text-emerald-500" :
                  job.type === 'Email' ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                )}>
                  {job.type}
                </span>
                <span className="text-[10px] font-bold text-white italic tracking-tight">{job.target}</span>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] text-slate-600 uppercase font-black">Priorité</span>
                  <span className={cn(
                    "text-[9px] font-black italic uppercase",
                    job.priority === 'Critical' ? "text-red-500" : "text-slate-400"
                  )}>{job.priority}</span>
                </div>
                <div className="w-32 flex items-center gap-2">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    job.status === 'Success' ? "bg-emerald-500" :
                    job.status === 'Processing' ? "bg-blue-500 animate-pulse" : "bg-amber-500"
                  )} />
                  <span className="text-[9px] font-bold text-slate-300 italic">{job.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
