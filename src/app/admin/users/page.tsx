import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  History, 
  ShieldCheck, 
  Zap,
  LayoutGrid,
  ArrowRight
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/app/components/ui/tabs';
import { UserTable } from './components/UserTable';
import { AuditTable } from './components/AuditTable';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/shared/lib/utils';

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-transparent p-8 xl:p-12 space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-primary/20 text-primary rounded-xl text-[10px] font-black tracking-widest border border-primary/30 uppercase">
                Gouvernance
             </div>
             <div className="w-1.5 h-1.5 rounded-full bg-foreground/10" />
             <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">Module RBAC v1.4</p>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-foreground uppercase">
             Gestion des <span className="text-primary italic">Utilisateurs</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed font-medium">
             Console de supervision et de contrôle d'accès. Gérez l'impersonation, les permissions granulaires et consultez l'historique immutable des actions administratives.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <KPIMini label="Utilisateurs Actifs" value="12,450" color="text-primary" />
           <KPIMini label="Alertes Sécurité" value="0.04%" color="text-rose-500" />
        </div>
      </div>

      <Tabs defaultValue="directory" className="w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <TabsList className="bg-card/40 border border-border p-1.5 h-auto rounded-3xl backdrop-blur-xl shadow-xl">
            <TabsTrigger 
              value="directory" 
              className="px-8 py-3.5 rounded-[20px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-3 text-muted-foreground"
            >
              <Users className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-widest">Répertoire Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="audit" 
              className="px-8 py-3.5 rounded-[20px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-3 text-muted-foreground"
            >
              <History className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-widest">Journal d'Audit</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-2xl border-border bg-card/40 h-12 px-6 gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg">
                <LayoutGrid className="w-4 h-4" />
                Gérer les Catégories
             </Button>
             <Button className="rounded-2xl h-12 px-8 gap-2 shadow-lg shadow-primary/20 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Audit de Sécurité
                <ArrowRight className="w-4 h-4 ml-1" />
             </Button>
          </div>
        </div>

        <TabsContent value="directory" className="outline-none">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="h-[750px]"
          >
            <UserTable />
          </motion.div>
        </TabsContent>

        <TabsContent value="audit" className="outline-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="h-[750px]"
          >
            <AuditTable />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Infrastructure Note */}
      <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-2xl text-primary">
               <Zap className="w-5 h-5" />
            </div>
            <div>
               <h4 className="text-sm font-black text-foreground uppercase tracking-tight">Mise à jour des Politiques RBAC</h4>
               <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                  Les modifications de privilèges sont appliquées de manière atomique à travers le cluster AgriLogistic.
               </p>
            </div>
         </div>
         <Button className="rounded-xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-black uppercase tracking-widest px-8">
            En savoir plus
         </Button>
      </div>
    </div>
  );
}

function KPIMini({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-card/40 backdrop-blur-md border border-border p-5 rounded-3xl min-w-[180px] shadow-lg">
       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
       <h3 className={cn("text-2xl font-black tracking-tighter tabular-nums", color)}>{value}</h3>
    </div>
  );
}


