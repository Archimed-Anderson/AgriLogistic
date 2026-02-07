'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ShieldAlert, 
  Target, 
  Globe, 
  Activity, 
  MessageSquare, 
  Edit3, 
  AlertTriangle, 
  ChevronRight, 
  X, 
  Send,
  Video,
  Monitor,
  VideoOff,
  Mic,
  MicOff,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Dynamic import for the 3D globe to avoid SSR issues
const ThreeDGlobe = dynamic(() => import('./ThreeDGlobe').then(m => m.ThreeDGlobe), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-950 flex items-center justify-center font-black text-slate-800 uppercase tracking-[0.5em] animate-pulse">Initializing Neural Map...</div>
});

import { useWarRoomSocket } from '@/hooks/useWarRoomSocket';

const MESSAGES = [
  { id: '1', user: 'SYSTEM', content: 'Sector Alpha secured. Deploying sensor mesh...', time: '12:04' },
  { id: '2', user: 'OPERATOR_42', content: 'Anomalies detected in West-Delta. Requesting scan.', time: '12:05' },
  { id: '3', user: 'AI_SENTINEL', content: '99.4% probability of cold-chain failure at Node 88.', time: '12:06' },
];

export function MissionControl() {
  const [activeTab, setActiveTab] = useState<'tactical' | 'comms' | 'video'>('tactical');
  const [messages, setMessages] = useState(MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { isConnected, stats, lastEvent } = useWarRoomSocket();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle incoming mission events as system messages
  useEffect(() => {
    if (lastEvent) {
      setMessages(prev => [
        ...prev, 
        { 
          id: lastEvent.timestamp, 
          user: 'CRISIS_ALERT', 
          content: `Mission ${lastEvent.missionId.slice(-4)}: ${lastEvent.message} (Status: ${lastEvent.status})`, 
          time: new Date(lastEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    }
  }, [lastEvent]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), user: 'YOU', content: inputValue, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInputValue('');
  };

  return (
    <div className="flex h-[calc(100vh-160px)] gap-6 overflow-hidden">
      {/* --- LEFT PANEL: TACTICAL HUD --- */}
      <aside className="w-96 flex flex-col gap-6">
        <div className="flex-1 bg-slate-950/40 backdrop-blur-3xl border border-red-500/20 rounded-[3rem] p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
            <ShieldAlert className="w-48 h-48 text-red-500" />
          </div>
          
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
             </div>
             <div>
                <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-0.5 italic">Crisis Protocol</h4>
                <p className="text-xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">War Room Alpha</p>
             </div>
          </div>

           <div className="space-y-6">
             <div className="space-y-2">
                <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                   <span>Neural Sync Status</span>
                   <span>{isConnected ? '99.9%' : 'OFFLINE'}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: isConnected ? '100%' : '0%' }} className={cn("h-full", isConnected ? "bg-emerald-500" : "bg-red-500")} />
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Mission Parameters</p>
                <div className="grid grid-cols-1 gap-2">
                   <TacticalRow label="Sensor Mesh" status={stats?.intelMesh || "Offline"} color={stats?.intelMesh === 'ACTIVE' ? "emerald" : "red"} />
                   <TacticalRow label="Active Missions" status={stats?.missions.active?.toString() || "0"} color="emerald" />
                   <TacticalRow label="Pending Queue" status={stats?.missions.pending?.toString() || "0"} color="amber" />
                   <TacticalRow label="Network Node" status={stats?.networkStatus || "SCANNING"} color={stats?.networkStatus === 'STABLE' ? "emerald" : "red"} />
                </div>
             </div>
          </div>

          <div className="mt-auto space-y-3">
             <button className="w-full h-14 bg-red-600 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-600/20 italic">
                Escalate Critical Crisis
             </button>
             <button className="w-full h-14 bg-white/5 border border-white/5 text-slate-400 font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                Download Blackbox Logs
             </button>
          </div>
        </div>

        <div className="h-32 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
               <Activity className="w-4 h-4 text-emerald-500" />
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Heartbeat Processor</span>
            </div>
            <div className="flex items-baseline gap-2">
               <span className="text-2xl font-black text-white italic font-mono">1.12ms</span>
               <span className="text-[8px] font-black text-slate-600 uppercase">Latency</span>
            </div>
        </div>
      </aside>

      {/* --- CENTER SECTION: GLOBAL MONITOR --- */}
      <section className="flex-1 flex flex-col gap-6">
        <div className="flex-1 bg-[#020408] border border-white/5 rounded-[4rem] overflow-hidden relative shadow-2xl group">
          <div className="absolute top-8 left-8 z-40 space-y-3">
             <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl flex flex-col gap-0.5">
                <div className="flex items-center gap-3">
                   <Target className="w-4 h-4 text-emerald-500" />
                   <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Global Sentinel v5.2</span>
                </div>
                <span className="text-[8px] font-mono text-slate-500 uppercase italic">Adaptive Vector Mapping • Deep Seek</span>
             </div>
          </div>

          <div className="absolute top-8 right-8 z-40 flex flex-col gap-3 items-end">
             <div className="flex bg-slate-900/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10">
                <TabBtn active={activeTab === 'tactical'} onClick={() => setActiveTab('tactical')} icon={Globe} label="Tactical" />
                <TabBtn active={activeTab === 'comms'} onClick={() => setActiveTab('comms')} icon={MessageSquare} label="Comms" />
                <TabBtn active={activeTab === 'video'} onClick={() => setActiveTab('video')} icon={Video} label="Video" />
             </div>
          </div>

          <div className="w-full h-full relative z-0">
             <AnimatePresence mode="wait">
               {activeTab === 'tactical' && (
                 <motion.div key="tactical" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                    <ThreeDGlobe />
                 </motion.div>
               )}

               {activeTab === 'comms' && (
                 <motion.div key="comms" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full h-full flex flex-col p-16">
                    <div className="flex-1 bg-slate-900/20 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 flex flex-col">
                       <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <MessageSquare className="w-5 h-5 text-blue-500" />
                             </div>
                             <div>
                                <h4 className="text-sm font-black text-white italic uppercase tracking-widest">Tactical Comms</h4>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Encrypted Alpha-Stream</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[9px] font-black text-emerald-500 uppercase italic">3 Operators Live</span>
                          </div>
                       </div>
                       
                       <div className="flex-1 overflow-y-auto space-y-6 px-4 custom-scrollbar">
                          {messages.map(msg => (
                            <div key={msg.id} className={cn("flex flex-col gap-2 max-w-[80%]", msg.user === 'YOU' ? 'ml-auto items-end' : 'items-start')}>
                               <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{msg.user}</span>
                                  <span className="text-[8px] font-mono text-slate-700">{msg.time}</span>
                               </div>
                               <div className={cn(
                                 "px-6 py-3 rounded-2xl text-[11px] font-bold tracking-tight leading-relaxed",
                                 msg.user === 'YOU' ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/5 text-slate-300'
                               )}>
                                  {msg.content}
                               </div>
                            </div>
                          ))}
                          <div ref={chatEndRef} />
                       </div>

                       <div className="mt-8 pt-6 border-t border-white/5 relative">
                          <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type tactical command..." 
                            className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-6 pr-20 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30 transition-all uppercase tracking-widest"
                          />
                          <button onClick={handleSendMessage} className="absolute right-3 top-[34px] w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                             <Send className="w-4 h-4 text-white" />
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'video' && (
                 <motion.div key="video" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full h-full flex flex-col p-16">
                    <div className="flex-1 grid grid-cols-2 gap-8">
                       <VideoCard user="HQ_COMMANDER" isSelf />
                       <VideoCard user="FIELD_OPS_WEST" />
                       <VideoCard user="REMOTE_ANALYST" />
                       <div className="bg-slate-900/10 border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 border-dashed">
                          <button className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                             <X className="w-8 h-8 text-slate-700" />
                          </button>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Awaiting feed...</p>
                       </div>
                    </div>
                    <div className="mt-12 flex justify-center gap-4">
                       <ControlBtn icon={Mic} />
                       <ControlBtn icon={Video} />
                       <ControlBtn icon={Monitor} label="Share Stream" />
                       <ControlBtn icon={X} color="bg-red-600" />
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- RIGHT PANEL: LIVE STATS --- */}
      <aside className="w-[420px] flex flex-col gap-6">
        <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 space-y-8 flex-1 overflow-y-auto no-scrollbar">
           <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Neural Insights</h3>
              <Users className="w-4 h-4 text-slate-700" />
           </div>

           <div className="space-y-8">
              <InsightBlock title="Active Missions" value={stats?.missions.active?.toString() || "0"} trend="LIVE" />
              <InsightBlock title="Completed Cycle" value={stats?.missions.completed?.toString() || "0"} trend="+14%" />
              <InsightBlock title="Active Incidents" value={stats?.incidents.length.toString() || "0"} trend={stats?.incidents.length && stats.incidents.length > 0 ? "HIGH" : "CLEAN"} />
              <InsightBlock title="System Pulse" value={isConnected ? "NORMAL" : "LOST"} trend={isConnected ? "Stable" : "Critical"} />
           </div>

           <div className="pt-8 border-t border-white/5 space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tactical Tools</p>
              <div className="grid grid-cols-2 gap-3">
                 <QuickTool icon={Edit3} label="Whiteboard" />
                 <QuickTool icon={Target} label="Targeting" />
                 <QuickTool icon={Monitor} label="Monitoring" />
                 <QuickTool icon={Activity} label="Diagnostics" />
              </div>
           </div>
        </div>

        <div className="bg-blue-600 p-8 rounded-[3rem] text-white flex flex-col gap-6 shadow-2xl shadow-blue-600/20">
           <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                 <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase italic tracking-widest">Priority v5.0</span>
           </div>
           <div className="space-y-1">
              <p className="text-2xl font-black italic tracking-tighter uppercase leading-none">Mission Ready</p>
              <p className="text-[11px] font-bold opacity-60 uppercase tracking-wide">All systems synchronized.</p>
           </div>
        </div>
      </aside>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function TacticalRow({ label, status, color }: any) {
  const colors: any = {
    emerald: 'text-emerald-500',
    red: 'text-red-500',
    amber: 'text-amber-500',
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-crosshair group">
       <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-white transition-colors">{label}</span>
       <div className="flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full", status === 'Online' || status === 'Active' ? 'bg-emerald-500' : status === 'Disconnected' ? 'bg-red-500' : 'bg-amber-500')} />
          <span className={cn("text-[10px] font-black uppercase italic", colors[color])}>{status}</span>
       </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }: any) {
  return (
    <button onClick={onClick} className={cn(
      "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
      active ? "bg-white/10 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
    )}>
       <Icon className="w-3.5 h-3.5" />
       {label}
    </button>
  );
}

function VideoCard({ user, isSelf }: { user: string; isSelf?: boolean }) {
  return (
    <div className="aspect-video bg-slate-900 rounded-[2.5rem] relative overflow-hidden group border border-white/5">
       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
       <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] font-black text-white uppercase tracking-widest">{user} {isSelf && '(Self)'}</span>
       </div>
       <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all">
             <Mic className="w-3.5 h-3.5" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all">
             <Video className="w-3.5 h-3.5" />
          </button>
       </div>
       {/* Mock Visualizer */}
       <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Activity className="w-24 h-24 text-emerald-500" />
       </div>
    </div>
  );
}

function ControlBtn({ icon: Icon, color = 'bg-white/10', label }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
       <button className={cn(
         "w-16 h-16 rounded-3xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white",
         color
       )}>
          <Icon className="w-6 h-6" />
       </button>
       {label && <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>}
    </div>
  );
}

function InsightBlock({ title, value, trend }: any) {
  return (
    <div className="flex flex-col gap-1 group">
       <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
          <span className={cn("text-[9px] font-black uppercase", trend.startsWith('+') ? 'text-emerald-500' : trend === 'Stable' ? 'text-blue-500' : 'text-amber-500')}>
             {trend}
          </span>
       </div>
       <div className="text-3xl font-black text-white italic tracking-tighter uppercase group-hover:text-emerald-400 transition-colors">
          {value}
       </div>
    </div>
  );
}

function QuickTool({ icon: Icon, label }: any) {
  return (
    <button className="h-16 flex flex-col items-center justify-center gap-2 bg-white/5 border border-white/5 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all group">
       <Icon className="w-4 h-4 text-slate-400 group-hover:text-black transition-colors" />
       <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
