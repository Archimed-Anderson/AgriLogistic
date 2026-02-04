'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Ban, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MapPin,
  Phone,
  MessageSquare,
  Download,
  ShieldCheck,
  UserPlus,
  ArrowUpRight,
  TrendingUp,
  X,
  FileText,
  Fingerprint,
  Wallet,
  ShieldAlert,
  ChevronRight,
  User,
  LayoutDashboard,
  Truck,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserDirectoryStore, User as UserType, KYCStatus, UserRole } from '@/store/userDirectoryStore';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function UsersPage() {
  const { 
    users, 
    searchQuery, 
    setSearchQuery, 
    activeTab, 
    setActiveTab,
    selectedUserId,
    setSelectedUserId,
    filters,
    setFilters
  } = useUserDirectoryStore();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Logic: Tabs, Search & Filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchTab = activeTab === 'Tous' || 
                      (activeTab === 'En attente KYC' && user.kycStatus === 'pending') ||
                      (activeTab === 'Agriculteurs' && user.role === 'farmer') ||
                      (activeTab === 'Transporteurs' && user.role === 'transporter') ||
                      (activeTab === 'Acheteurs' && user.role === 'buyer');
      
      return matchSearch && matchTab;
    });
  }, [users, searchQuery, activeTab]);

  const stats = {
    all: users.length,
    pending: users.filter(u => u.kycStatus === 'pending').length,
    farmers: users.filter(u => u.role === 'farmer').length,
    transporters: users.filter(u => u.role === 'transporter').length,
    buyers: users.filter(u => u.role === 'buyer').length,
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <div className="flex flex-col h-screen bg-[#0B1120] text-slate-400 overflow-hidden">
      {/* 🚀 HEADER & NAVIGATION */}
      <header className="p-8 pb-4 shrink-0 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <Users className="w-8 h-8 text-emerald-500" />
              Répertoire Écosystème
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              Gouvernance & Gouvernance • 1,247 Acteurs Certifiés
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="h-12 px-6 bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
              <UserPlus className="w-4 h-4" />
              Nouvel Utilisateur
            </button>
            <button className="w-12 h-12 bg-slate-800/50 border border-white/5 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-all">
              <Download className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tabs, Search & View Toggle Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 w-fit">
            {[
              { id: 'Tous', count: stats.all },
              { id: 'En attente KYC', count: stats.pending, highlight: true },
              { id: 'Agriculteurs', count: stats.farmers },
              { id: 'Transporteurs', count: stats.transporters },
              { id: 'Acheteurs', count: stats.buyers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2',
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                {tab.id}
                <span className={cn(
                  'px-1.5 py-0.5 rounded-md text-[9px]',
                  activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/5 text-slate-600',
                  tab.id === 'En attente KYC' && activeTab !== tab.id && stats.pending > 0 ? 'text-amber-500 bg-amber-500/10' : ''
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Switcher */}
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 mr-4">
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'list' ? "bg-slate-800 text-white shadow-xl" : "text-slate-600 hover:text-slate-400"
                )}
              >
                <MoreVertical className="w-4 h-4 rotate-90" />
              </button>
              <button 
                onClick={() => setViewMode('kanban')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'kanban' ? "bg-slate-800 text-white shadow-xl" : "text-slate-600 hover:text-slate-400"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full h-11 bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="h-11 px-4 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center gap-2 text-slate-400 hover:text-white transition-all">
              <Filter className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Filtres</span>
            </button>
          </div>
        </div>

        {/* 🚨 MERGE SUGGESTIONS ALERT */}
        <AnimatePresence>
          {stats.all > 0 && searchQuery === '' && activeTab === 'Tous' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
            >
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-widest">Algorithme de détection de doublons</h4>
                    <p className="text-[10px] text-slate-500 font-medium">3 comptes suggérés pour une fusion (numéros de téléphone identiques détectés).</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-amber-500/20 transition-all">
                  Revoir Suggestions
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 📊 DATA GRID / KANBAN */}
      <main className="flex-1 overflow-hidden px-8 pb-8 flex flex-col">
        <div className="flex-1 bg-slate-900/20 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col relative group">
          <div className="overflow-auto custom-scrollbar flex-1 p-8">
            {viewMode === 'list' ? (
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Utilisateur</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rôle & Localisation</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Contact</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Agri-Score</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Statut KYC</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Inscription</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      className="group/row hover:bg-slate-800/30 transition-all cursor-pointer"
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="w-12 h-12 rounded-2xl border border-white/10 group-hover/row:border-emerald-500/50 transition-colors"
                            />
                            {user.isOnline && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0B1120] animate-pulse" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-white uppercase italic tracking-tight">{user.name}</span>
                              {user.kycStatus === 'verified' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />}
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">{user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1.5">
                          <RoleBadge role={user.role} />
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <span className="text-sm">{user.location.flag}</span>
                            <span className="text-[10px] font-bold uppercase tracking-tight italic">{user.location.region}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors group/phone">
                            <Phone className="w-3 h-3 text-slate-600 group-hover/phone:text-emerald-500" />
                            <span className="text-[11px] font-mono font-bold">{user.phone}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1">
                            <span className={cn(
                              "text-base font-black italic tracking-tighter",
                              user.agriScore > 800 ? "text-emerald-500" : user.agriScore > 500 ? "text-blue-500" : "text-amber-500"
                            )}>
                              {user.agriScore}
                            </span>
                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full transition-all duration-1000",
                                  user.agriScore > 800 ? "bg-emerald-500" : user.agriScore > 500 ? "bg-blue-500" : "bg-amber-500"
                                )}
                                style={{ width: `${(user.agriScore / 1000) * 100}%` }}
                              />
                            </div>
                          </div>
                          <TrendingUp className="w-3 h-3 text-slate-700" />
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                          <KYCBadge status={user.kycStatus} />
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-0.5 bg-white/5 rounded-full">
                              <div 
                                className="h-full bg-cyan-500" 
                                style={{ width: `${user.kycProgress}%` }}
                              />
                            </div>
                            <span className="text-[9px] font-mono text-slate-600 font-bold">{user.kycProgress}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1 italic">
                          <span className="text-[11px] text-slate-300 font-bold uppercase tracking-tight">
                            {formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true, locale: fr })}
                          </span>
                          <div className="flex items-center gap-1.5 opacity-40">
                            <Clock className="w-2.5 h-2.5" />
                            <span className="text-[9px] font-black">LOGIN ID: SEC-99</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-lg transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all">
                            <Ban className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white/10 text-slate-600 hover:text-white rounded-lg transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map((user) => (
                  <motion.div 
                    layoutId={`user-${user.id}`}
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className="p-6 bg-slate-900/40 border border-white/5 rounded-3xl hover:border-emerald-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <KYCBadge status={user.kycStatus} />
                      <button className="text-slate-600 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative">
                        <img 
                          src={user.avatar} 
                          alt=""
                          className="w-20 h-20 rounded-[2rem] border border-white/10 group-hover:scale-105 transition-transform" 
                        />
                        {user.isOnline && <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0B1120]" />}
                      </div>
                      
                      <div>
                        <h4 className="text-base font-black text-white uppercase italic tracking-tighter">{user.name}</h4>
                        <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{user.id}</span>
                      </div>

                      <RoleBadge role={user.role} />
                      
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-sm">{user.location.flag}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest italic">{user.location.region}</span>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-slate-600 font-black uppercase">Agri-Score</span>
                        <span className="text-sm font-black text-emerald-500 italic">{user.agriScore}</span>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-[9px] text-slate-600 font-black uppercase">KYC Proof</span>
                        <span className="text-sm font-black text-blue-500 italic">{user.kycProgress}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 📂 USER DETAIL SLIDE-OVER */}
      <AnimatePresence>
        {selectedUserId && selectedUser && (
          <UserSlideOver 
            user={selectedUser} 
            onClose={() => setSelectedUserId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const configs = {
    farmer: { label: 'Agriculteur', icon: Users, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    transporter: { label: 'Transporteur', icon: Truck, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    buyer: { label: 'Acheteur', icon: ShoppingBag, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
    admin: { label: 'Admin', icon: User, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  };
  const config = configs[role];
  return (
    <div className={cn("px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5", config.color)}>
      <config.icon className="w-3 h-3" />
      {config.label}
    </div>
  );
}

function KYCBadge({ status }: { status: KYCStatus }) {
  const configs = {
    verified: { label: 'Vérifié', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    pending: { label: 'En attente', icon: Clock, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    rejected: { label: 'Rejeté', icon: ShieldAlert, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
    none: { label: 'Aucun', icon: AlertCircle, color: 'text-slate-500 bg-white/5 border-white/10' },
  };
  const config = configs[status];
  return (
    <div className={cn("px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5", config.color)}>
      <config.icon className="w-3 h-3" />
      {config.label}
    </div>
  );
}

function UserSlideOver({ user, onClose }: { user: UserType, onClose: () => void }) {
  const { updateUserKYC } = useUserDirectoryStore();

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-2xl h-full bg-[#0D1525] border-l border-white/5 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header Slide-over */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-slate-900/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl border border-white/10 overflow-hidden">
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">{user.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{user.id}</span>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
          {/* Identity & AgriScore Section */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-[2rem] bg-slate-900/30 border border-white/5 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Agri-Score v3.1</h4>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-4xl font-black italic text-white tracking-tighter mb-2">{user.agriScore}</p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(user.agriScore / 1000) * 100}%` }} />
              </div>
              <p className="text-[9px] text-slate-500 mt-4 leading-relaxed line-clamp-2">
                Basé sur l'historique des transactions, la régularité et la qualité des produits livrés.
              </p>
            </div>

            <div className="p-6 rounded-[2rem] bg-slate-900/30 border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Localisation</h4>
                <MapPin className="w-4 h-4 text-blue-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{user.location.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-black italic uppercase">{user.location.country}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{user.location.region}</span>
                  </div>
                </div>
                <button className="w-full h-10 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2 mt-2">
                  <ArrowUpRight className="w-3 h-3" />
                  Voir sur la carte
                </button>
              </div>
            </div>
          </div>

          {/* KYC Center */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Centre de Validation KYC
              </h3>
              <KYCBadge status={user.kycStatus} />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <DocItem 
                title="Pièce d'Identité (Face)" 
                status="verified" 
                ocr="98%" 
                date="28 Mars 2024"
              />
              <DocItem 
                title="Justificatif de Domicile" 
                status="verified" 
                ocr="85%" 
                date="29 Mars 2024"
              />
              {user.role === 'farmer' && (
                <DocItem 
                  title="Certificat de Propriété Parcelle" 
                  status={user.kycStatus === 'verified' ? 'verified' : 'pending'} 
                  ocr="--" 
                  date="-- -- --"
                />
              )}
            </div>

            {/* Biometric Match */}
            <div className="p-6 bg-slate-950 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                  <Fingerprint className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white italic uppercase tracking-tight">Vérification Biométrique</h4>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">IA FaceMatch Reconnaissance</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl border-2 border-emerald-500/30 overflow-hidden">
                    <img src={user.avatar} alt="" className="w-full h-full object-cover grayscale opacity-50" />
                    <div className="absolute inset-0 border border-emerald-500/50 animate-pulse" />
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[8px] font-black px-1.5 rounded uppercase">Live</span>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-800" />
                <div className="w-20 h-20 rounded-2xl border-2 border-slate-800 flex items-center justify-center bg-slate-900 overflow-hidden">
                  <FileText className="w-8 h-8 text-slate-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-emerald-500 italic uppercase">FaceMatch Score</span>
                    <span className="text-lg font-black text-emerald-500 italic font-mono">94.2%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '94.2%' }} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Activity Mini Timeline */}
          <section className="space-y-6 pb-12">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-3">
                <Wallet className="w-4 h-4 text-emerald-500" />
                Volume d'Activité
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase italic">30 derniers jours</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Transactions</span>
                <span className="text-xl font-black text-white italic tracking-tighter">124</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Volumes</span>
                <span className="text-xl font-black text-emerald-500 italic tracking-tighter">4.2M</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Litiges</span>
                <span className="text-xl font-black text-red-500 italic tracking-tighter">0</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions Fixed */}
        <div className="p-8 bg-[#0B1120] border-t border-white/10 shrink-0 space-y-4">
          <div className="flex gap-4">
            <button 
              onClick={() => {
                updateUserKYC(user.id, 'rejected');
                onClose();
              }}
              className="flex-1 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Ban className="w-4 h-4" />
              Rejeter Dossier
            </button>
            <button 
              onClick={() => {
                updateUserKYC(user.id, 'verified');
                onClose();
              }}
              className="flex-1 h-14 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] shadow-xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approuver Utilisateur
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="h-12 bg-slate-900 border border-white/5 text-slate-500 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all flex items-center justify-center gap-2 rounded-xl">
              <MessageSquare className="w-3 h-3" />
              WhatsApp Support
            </button>
            <button className="h-12 bg-slate-900 border border-white/5 text-slate-500 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all flex items-center justify-center gap-2 rounded-xl">
              <ShieldAlert className="w-3 h-3" />
              Impersonate User
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DocItem({ title, status, ocr, date }: { title: string, status: KYCStatus | 'success' | 'verified', ocr: string, date: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer group/doc">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center">
          <FileText className="w-5 h-5 text-slate-500 group-hover/doc:text-white transition-colors" />
        </div>
        <div>
          <h5 className="text-[11px] font-black text-white italic uppercase tracking-tight">{title}</h5>
          <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest italic">{date}</span>
        </div>
      </div>
      <div className="flex items-center gap-12">
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-slate-600 uppercase font-black mb-1">OCR Scan</span>
          <span className="text-[10px] font-mono text-emerald-500 font-bold">{ocr}</span>
        </div>
        {status === 'verified' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <Clock className="w-5 h-5 text-amber-500" />
        )}
      </div>
    </div>
  );
}
