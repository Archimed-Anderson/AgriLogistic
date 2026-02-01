'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Shield, 
  ToggleRight, 
  Key, 
  Bell, 
  Database, 
  Coins, 
  Save, 
  RotateCcw, 
  Globe, 
  Lock, 
  Cpu, 
  Activity, 
  AlertCircle,
  Download,
  Upload,
  Zap,
  CheckCircle2,
  Trash2,
  RefreshCcw,
  Palette,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';

type SettingsCategory = 'general' | 'security' | 'features' | 'api' | 'notifs' | 'backup' | 'monetization';

export default function GlobalSettings() {
  const [activeTab, setActiveTab] = useState<SettingsCategory>('general');
  const { settings, updateSettings, isDirty, saveSettings } = useSettingsStore();
  const [showApiKeys, setShowApiKeys] = useState(false);

  const categories = [
    { id: 'general', label: 'Général & Identité', icon: Settings, desc: 'Identité, langue, localisation' },
    { id: 'security', label: 'Sécurité & Accès', icon: Shield, desc: 'Authentification, 2FA, Rate Limit' },
    { id: 'features', label: 'Feature Flags', icon: ToggleRight, desc: 'Activation de modules IA & Ops' },
    { id: 'api', label: 'Intégrations API', icon: Key, desc: 'Clés externes (Stripe, Twilio...)' },
    { id: 'notifs', label: 'Notifications Système', icon: Bell, desc: 'Flux mail, SMS et webhooks' },
    { id: 'backup', label: 'Sauvegarde & Perf', icon: Database, desc: 'Backups S3, Cache Redis' },
    { id: 'monetization', label: 'Modèle Économique', icon: Coins, desc: 'Commissions, Plans & reversement' },
  ];

  return (
    <div className="flex h-screen bg-[#0B1120] text-slate-400 overflow-hidden">
      {/* 🛠️ SETTINGS SIDEBAR */}
      <aside className="w-80 border-r border-white/5 bg-slate-950/20 p-8 space-y-8 flex flex-col shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-500 animate-spin-slow" />
            Configuration
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Platform Controls</p>
        </div>

        <nav className="flex-1 space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as any)}
              className={cn(
                "w-full p-4 rounded-2xl flex items-start gap-4 transition-all text-left group",
                activeTab === cat.id 
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-xl shadow-emerald-500/5" 
                  : "hover:bg-white/5 text-slate-500 border border-transparent"
              )}
            >
              <cat.icon className={cn("w-5 h-5 mt-0.5", activeTab === cat.id ? "text-emerald-500" : "text-slate-600 transition-colors group-hover:text-slate-300")} />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-widest">{cat.label}</span>
                <span className="text-[9px] text-slate-600 font-medium line-clamp-1">{cat.desc}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-4">
           <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/20 border border-white/5">
              <Activity className="w-4 h-4 text-emerald-500" />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-slate-500 uppercase">Version Config</span>
                 <span className="text-[10px] font-mono text-white">v3.1.2-STABLE</span>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="flex-1 h-10 bg-white/5 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase hover:bg-white/10 transition-all">
                <Download className="w-3 h-3" /> Export
              </button>
              <button className="flex-1 h-10 bg-white/5 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase hover:bg-white/10 transition-all">
                <Upload className="w-3 h-3" /> Import
              </button>
           </div>
        </div>
      </aside>

      {/* 🚀 SETTINGS PANEL */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 border-b border-white/5 px-12 flex items-center justify-between shrink-0 bg-slate-900/10">
           <div className="flex flex-col">
              <h2 className="text-xl font-black text-white uppercase italic tracking-widest">
                {categories.find(c => c.id === activeTab)?.label}
              </h2>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase mt-1">
                 <Zap className="w-3 h-3 text-emerald-500" />
                 Dernière modification : Il y a 2 heures par Admin_Root
              </div>
           </div>

           <div className="flex items-center gap-4">
              <AnimatePresence>
                {isDirty && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-4 animate-in fade-in"
                  >
                    <button 
                      onClick={() => useSettingsStore.getState().resetSettings()}
                      className="h-12 px-6 bg-slate-800/50 border border-white/5 rounded-xl flex items-center gap-2 hover:bg-slate-700 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400"
                    >
                      <RotateCcw className="w-4 h-4" /> Annuler
                    </button>
                    <button 
                      onClick={saveSettings}
                      className="h-12 px-8 bg-emerald-500 text-black font-black rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20 text-[10px] font-black uppercase tracking-widest"
                    >
                      <Save className="w-4 h-4" /> Appliquer les Changements
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-12 space-y-12">
           <AnimatePresence mode="wait">
              {activeTab === 'general' && <GeneralSettingsSection key="general" settings={settings.general} onUpdate={(u) => updateSettings('general', u)} />}
              {activeTab === 'security' && <SecuritySettingsSection key="security" settings={settings.security} onUpdate={(u) => updateSettings('security', u)} />}
              {activeTab === 'features' && <FeaturesSettingsSection key="features" settings={settings.features} onUpdate={(u) => updateSettings('features', u)} />}
              {activeTab === 'api' && (
                <ApiSettingsSection 
                  key="api" 
                  settings={settings.apiKeys} 
                  onUpdate={(u) => updateSettings('apiKeys', u)} 
                  showKeys={showApiKeys}
                  onToggleShow={() => setShowApiKeys(!showApiKeys)}
                />
              )}
              {activeTab === 'notifs' && <NotificationSettingsSection key="notifs" settings={settings.notifications} onUpdate={(u) => updateSettings('notifications', u)} />}
              {activeTab === 'backup' && <BackupSettingsSection key="backup" />}
              {activeTab === 'monetization' && <MonetizationSettingsSection key="monetization" settings={settings.monetization} onUpdate={(u) => updateSettings('monetization', u)} />}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- SECTIONS ---

function GeneralSettingsSection({ settings, onUpdate }: { settings: any, onUpdate: (u: any) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-12 pb-24">
       <SettingsGroup label="Identité de la Plateforme">
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Nom de la Platforme</label>
                <input 
                  value={settings.platformName}
                  onChange={(e) => onUpdate({ platformName: e.target.value })}
                  className="w-full h-14 bg-slate-900/50 border border-white/10 rounded-2xl px-6 text-sm text-white font-bold focus:ring-2 ring-emerald-500/20"
                />
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Couleur Primaire</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => onUpdate({ primaryColor: e.target.value })}
                    className="h-14 w-20 bg-slate-900/50 border border-white/10 rounded-2xl p-1 cursor-pointer"
                  />
                  <input 
                    value={settings.primaryColor}
                    onChange={(e) => onUpdate({ primaryColor: e.target.value })}
                    className="flex-1 h-14 bg-slate-900/50 border border-white/10 rounded-2xl px-6 text-sm text-white font-mono"
                  />
                </div>
             </div>
          </div>
          <div className="pt-6">
             <div className="flex items-center justify-between p-6 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-amber-500" />
                   </div>
                   <div className="flex flex-col">
                      <h4 className="text-sm font-black text-white italic uppercase">Mode Maintenance</h4>
                      <p className="text-[10px] text-slate-500 font-bold">Activer pour bloquer l'accès public lors de mises à jour critiques.</p>
                   </div>
                </div>
                <button 
                  onClick={() => onUpdate({ maintenanceMode: !settings.maintenanceMode })}
                  className={cn(
                    "w-16 h-8 rounded-full relative transition-all",
                    settings.maintenanceMode ? "bg-amber-500 shadow-lg shadow-amber-500/20" : "bg-white/10"
                  )}
                >
                  <div className={cn("absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md", settings.maintenanceMode ? "left-9" : "left-1")} />
                </button>
             </div>
          </div>
       </SettingsGroup>

       <SettingsGroup label="Localisation & Région">
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Pays d'Opération</label>
                <div className="flex flex-wrap gap-2">
                  {['Côte d\'Ivoire', 'Sénégal', 'Ghana', 'Bénin'].map(p => (
                    <button key={p} className="h-10 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-500 uppercase">
                      {p} ×
                    </button>
                  ))}
                  <button className="h-10 px-4 bg-white/5 border border-dashed border-white/20 rounded-xl text-[10px] font-black text-slate-500 uppercase hover:text-white transition-all">
                    + Ajouter
                  </button>
                </div>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Langue & Timezone</label>
                <div className="grid grid-cols-2 gap-4">
                  <select className="h-14 bg-slate-900/50 border border-white/10 rounded-2xl px-4 text-xs font-bold text-white">
                    <option>Français (FR)</option>
                    <option>English (UK)</option>
                    <option>Portuguese (PT)</option>
                  </select>
                  <select className="h-14 bg-slate-900/50 border border-white/10 rounded-2xl px-4 text-xs font-bold text-white">
                    <option>UTC+0 (Abidjan)</option>
                    <option>UTC+1 (Paris)</option>
                    <option>UTC-5 (EST)</option>
                  </select>
                </div>
             </div>
          </div>
       </SettingsGroup>
    </motion.div>
  );
}

function SecuritySettingsSection({ settings, onUpdate }: { settings: any, onUpdate: (u: any) => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl space-y-12 pb-24">
       <SettingsGroup label="Authentification & Sessions">
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Durée Session JWT (Minutes)</label>
                <input 
                  type="number"
                  value={settings.jwtExpiration}
                  onChange={(e) => onUpdate({ jwtExpiration: parseInt(e.target.value) })}
                  className="w-full h-14 bg-slate-900/50 border border-white/10 rounded-2xl px-6 text-sm text-white font-mono"
                />
             </div>
             <div className="space-y-3 flex flex-col justify-end">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl h-14">
                   <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-500" />
                      <span className="text-[11px] font-black text-white uppercase italic">Forcer 2FA Admin</span>
                   </div>
                   <button 
                    onClick={() => onUpdate({ require2FA: !settings.require2FA })}
                    className={cn(
                      "w-12 h-6 rounded-full relative transition-all",
                      settings.require2FA ? "bg-blue-500 shadow-lg shadow-blue-500/20" : "bg-white/10"
                    )}
                  >
                    <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md font-bold text-[8px] flex items-center justify-center text-blue-500", settings.require2FA ? "left-6.5" : "left-0.5")}>
                       {settings.require2FA ? "ON" : "OFF"}
                    </div>
                  </button>
                </div>
             </div>
          </div>
       </SettingsGroup>

       <SettingsGroup label="Protection & Firewall">
          <div className="space-y-6">
             <div className="p-6 rounded-3xl bg-slate-950/50 border border-white/5 space-y-4">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">CORS Whitelist</h4>
                <div className="space-y-2">
                   {settings.allowedCorsOrigins.map((origin: string) => (
                     <div key={origin} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[11px] font-mono text-slate-300">{origin}</span>
                        <Trash2 className="w-4 h-4 text-slate-600 hover:text-red-500 cursor-pointer transition-colors" />
                     </div>
                   ))}
                   <button className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-2 mt-4 hover:underline">
                      + Ajouter un domaine autorisé
                   </button>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Rate Limit (req/min)</label>
                   <input 
                     type="number"
                     value={settings.rateLimitRequests}
                     onChange={(e) => onUpdate({ rateLimitRequests: parseInt(e.target.value) })}
                     className="w-full h-14 bg-slate-900/50 border border-white/10 rounded-2xl px-6 text-sm text-white font-mono"
                   />
                </div>
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-4">
                   <Shield className="w-6 h-6 text-blue-500 opacity-50" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-blue-500 uppercase">Protection Bot</span>
                      <p className="text-[10px] text-slate-400 leading-tight">Moteur anti-DDOS actif au niveau Gateway (Kong).</p>
                   </div>
                </div>
             </div>
          </div>
       </SettingsGroup>
    </motion.div>
  );
}

function FeaturesSettingsSection({ settings, onUpdate }: { settings: any, onUpdate: (u: any) => void }) {
  const flags = [
    { key: 'enableMarketplace', label: 'Espace Marketplace', desc: 'Active la navigation et les achats publics.', icon: Coins },
    { key: 'enableMobileMoney', label: 'Paiements Mobile Money', desc: 'Autorise Orange, MTN, Wave comme moyens de paiement.', icon: Zap },
    { key: 'enableAIInsights', label: 'IA Insights Center (BETA)', desc: 'Donne accès aux prédictions et analyses IA aux utilisateurs Pro.', icon: Cpu },
    { key: 'strictKYC', label: 'KYC Strict Enforcement', desc: 'Bloque toute transaction si le document n\'est pas validé à 100%.', icon: Shield },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl space-y-12">
       <div className="grid grid-cols-1 gap-4">
          {flags.map(flag => (
            <div key={flag.key} className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] flex items-center justify-between hover:border-white/10 transition-all group">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
                     <flag.icon className="w-7 h-7 text-slate-500 group-hover:text-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                     <h4 className="text-sm font-black text-white italic uppercase">{flag.label}</h4>
                     <p className="text-[11px] text-slate-500 font-bold max-w-sm">{flag.desc}</p>
                  </div>
               </div>
               <button 
                  onClick={() => onUpdate({ [flag.key]: !settings[flag.key] })}
                  className={cn(
                    "w-20 h-10 rounded-2xl relative transition-all flex items-center px-2",
                    settings[flag.key] ? "bg-emerald-500 shadow-xl shadow-emerald-500/20" : "bg-white/10"
                  )}
                >
                  <span className={cn("text-[8px] font-black uppercase text-black italic absolute right-3 pointer-events-none", !settings[flag.key] && "opacity-0")}>ACTIVE</span>
                  <span className={cn("text-[8px] font-black uppercase text-slate-500 italic absolute left-3 pointer-events-none", settings[flag.key] && "opacity-0")}>OFF</span>
                  <motion.div 
                    animate={{ x: settings[flag.key] ? 0 : 0 }} // Simple x toggle
                    className={cn("w-6 h-6 rounded-lg bg-white shadow-xl flex items-center justify-center transition-all", settings[flag.key] ? "translate-x-10" : "translate-x-0")} 
                  />
               </button>
            </div>
          ))}
       </div>
    </motion.div>
  );
}

function ApiSettingsSection({ settings, onUpdate, showKeys, onToggleShow }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-12 pb-24">
       <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <AlertCircle className="w-6 h-6 text-red-500" />
             <p className="text-[11px] text-slate-400 font-bold max-w-lg italic uppercase">Attention : Les clés API sont critiques. Ne les partagez jamais. Toute modification est journalisée dans l'audit-log.</p>
          </div>
          <button 
            onClick={onToggleShow}
            className="h-11 px-6 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase text-white hover:bg-white/10 transition-all"
          >
            {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showKeys ? 'Masquer les clés' : 'Afficher les clés'}
          </button>
       </div>

       <div className="grid grid-cols-1 gap-6">
          {Object.entries(settings).map(([key, val]: any) => (
            <div key={key} className="p-6 bg-slate-900/30 border border-white/5 rounded-3xl space-y-4">
               <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <button className="text-[9px] font-black text-emerald-500 uppercase hover:underline">Tester la connexion</button>
               </div>
               <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    type={showKeys ? "text" : "password"}
                    value={val}
                    onChange={(e) => onUpdate({ [key]: e.target.value })}
                    className="w-full h-14 bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-6 text-sm text-white font-mono"
                  />
               </div>
            </div>
          ))}
       </div>
    </motion.div>
  );
}

function NotificationSettingsSection({ settings, onUpdate }: any) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl space-y-12 pb-24">
       <SettingsGroup label="Sortie Email (Transactionnel)">
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Email Expéditeur</label>
                <input 
                  value={settings.senderEmail}
                  onChange={(e) => onUpdate({ senderEmail: e.target.value })}
                  className="w-full h-14 bg-slate-900/50 border border-white/10 rounded-2xl px-6 text-sm text-white font-bold"
                />
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Serveur SMTP</label>
                <input 
                   value={settings.smtpHost}
                   onChange={(e) => onUpdate({ smtpHost: e.target.value })}
                   className="w-full h-14 bg-slate-900/50 border border-white/10 rounded-2xl px-6 text-sm text-white font-mono"
                />
             </div>
          </div>
       </SettingsGroup>

       <SettingsGroup label="Passerelle SMS">
          <div className="flex gap-4 p-1.5 bg-slate-950 rounded-2xl border border-white/5 max-w-sm">
             <button 
               onClick={() => onUpdate({ smsProvider: 'twilio' })}
               className={cn("flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", settings.smsProvider === 'twilio' ? "bg-emerald-500 text-black" : "text-slate-500")}
             >
               Twilio
             </button>
             <button 
               onClick={() => onUpdate({ smsProvider: 'africasTalking' })}
               className={cn("flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", settings.smsProvider === 'africasTalking' ? "bg-emerald-500 text-black" : "text-slate-500")}
             >
               Africa's Talking
             </button>
          </div>
       </SettingsGroup>
    </motion.div>
  );
}

function BackupSettingsSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-12 pb-24">
       <div className="grid grid-cols-2 gap-8">
          <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                   <Database className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                   <h4 className="text-sm font-black text-white italic uppercase">Base de Données</h4>
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Dernière sauvegarde : Aujourd'hui 04h00</span>
                </div>
             </div>
             <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[75%]" />
             </div>
             <button className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">Lancer Backup Manuel</button>
          </div>

          <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                   <RefreshCcw className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                   <h4 className="text-sm font-black text-white italic uppercase">Cache Performance</h4>
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Redis Hits : 98.4% • 1,248 clés actives</span>
                </div>
             </div>
             <button className="w-full h-12 bg-red-500/10 border border-red-500/20 rounded-xl text-[9px] font-black uppercase text-red-500 hover:bg-red-500/20 transition-all">Purger le Cache Global</button>
          </div>
       </div>
    </motion.div>
  );
}

function MonetizationSettingsSection({ settings, onUpdate }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-12 pb-24">
       <SettingsGroup label="Structure de Commissions">
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Commission Plateforme (%)</label>
                <div className="relative">
                   <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                   <input 
                     type="number"
                     step="0.1"
                     value={settings.platformCommission}
                     onChange={(e) => onUpdate({ platformCommission: parseFloat(e.target.value) })}
                     className="w-full h-14 bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-6 text-sm text-white font-bold"
                   />
                </div>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Durée Séquestre Escrow (Jours)</label>
                <input 
                   type="number"
                   value={settings.escrowDuration}
                   onChange={(e) => onUpdate({ escrowDuration: parseInt(e.target.value) })}
                   className="w-full h-14 bg-slate-900/50 border border-white/10 rounded-2xl px-6 text-sm text-white font-bold"
                />
             </div>
          </div>
       </SettingsGroup>

       <SettingsGroup label="Plans d'Abonnement">
          <div className="grid grid-cols-1 gap-4">
             {settings.plans.map((plan: any, idx: number) => (
               <div key={idx} className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-all">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Palette className="w-6 h-6 text-slate-500 group-hover:text-emerald-500" />
                     </div>
                     <div>
                        <h5 className="text-[12px] font-black text-white uppercase italic">{plan.name}</h5>
                        <p className="text-[10px] text-slate-500 font-bold">{plan.features.join(' • ')}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right">
                        <span className="text-lg font-black text-white italic tracking-tighter">{plan.price.toLocaleString()} CFA</span>
                        <span className="text-[8px] font-black text-slate-600 block uppercase">Par Mois</span>
                     </div>
                     <button className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
                        <Edit3 className="w-4 h-4 text-white" />
                     </button>
                  </div>
               </div>
             ))}
          </div>
       </SettingsGroup>
    </motion.div>
  );
}

// --- HELPERS ---

function SettingsGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-black text-white italic uppercase tracking-widest border-b border-white/5 pb-4 flex items-center gap-3">
        {label}
        <div className="h-px bg-white/5 flex-1" />
      </h3>
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
}

function Edit3(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    >
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}
