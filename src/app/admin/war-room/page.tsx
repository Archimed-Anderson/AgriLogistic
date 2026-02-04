import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { LayoutDashboard, Truck, Activity, Terminal as TerminalIcon, Zap } from 'lucide-react';

import { LiveLogs } from './components/LiveLogs';
import { AdminConsole } from './components/AdminConsole';
import { MonitoringDashboard } from './components/MonitoringDashboard';
import { LogisticsDashboard } from './components/LogisticsDashboard';
import { OverviewDashboard } from './components/OverviewDashboard';

export default function WarRoomPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Secion */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 bg-primary/20 text-primary rounded text-[10px] font-bold tracking-widest border border-primary/30">
              WAR ROOM
            </div>
            <div className="w-1 h-1 rounded-full bg-foreground/20" />
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
              v2.1.0-STABLE
            </p>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-foreground">
            Console de Commandement
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed font-medium">
            Surveillance en temps réel de l'écosystème AgriLogistic. Flux logistiques, santé
            périmétrale et automatisation des transactions.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card/40 backdrop-blur-md p-2 rounded-2xl border border-border shadow-xl">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground"
              >
                AD
              </div>
            ))}
          </div>
          <div className="h-8 w-px bg-border mx-1" />
          <div className="text-right pr-2">
            <p className="text-[10px] font-bold text-foreground uppercase tracking-tight">
              SESS_ACTIVE
            </p>
            <p className="text-[9px] font-mono text-emerald-500 font-bold">4 Admins en ligne</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="relative mb-8">
          <TabsList className="bg-card/40 border border-border p-1.5 h-auto rounded-2xl backdrop-blur-xl">
            <TabsTrigger
              value="overview"
              className="px-6 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 text-muted-foreground"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-xs font-semibold">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger
              value="logistics"
              className="px-6 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2"
            >
              <Truck className="w-4 h-4" />
              <span className="text-xs font-semibold">Logistique</span>
            </TabsTrigger>
            <TabsTrigger
              value="health"
              className="px-6 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2"
            >
              <Activity className="w-4 h-4" />
              <span className="text-xs font-semibold">Santé Système</span>
            </TabsTrigger>
            <TabsTrigger
              value="terminal"
              className="px-6 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2"
            >
              <TerminalIcon className="w-4 h-4" />
              <span className="text-xs font-semibold">Terminal</span>
            </TabsTrigger>
          </TabsList>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-4 text-[10px] font-mono text-muted-foreground mr-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              SÉCURISÉ (TLS 1.3)
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-amber-400" />
              LOW LATENCY
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <OverviewDashboard />
            </motion.div>
          </TabsContent>

          <TabsContent value="logistics">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LogisticsDashboard />
            </motion.div>
          </TabsContent>

          <TabsContent value="health">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <MonitoringDashboard />
            </motion.div>
          </TabsContent>

          <TabsContent value="terminal">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2">
                <LiveLogs />
              </div>
              <div>
                <AdminConsole />
              </div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
