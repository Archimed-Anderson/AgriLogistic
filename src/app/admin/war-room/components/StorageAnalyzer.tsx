import React from 'react';
import { 
  Database, 
  FolderTree, 
  ChevronRight, 
  HardDrive,
  Info
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';

interface Partition {
  mount: string;
  device: string;
  total: number;
  used: number;
  percent: number;
  type: string;
}

const PARTITIONS: Partition[] = [
  { mount: '/', device: '/dev/nvme0n1p2', total: 468, used: 124, percent: 27, type: 'ext4' },
  { mount: '/var/log', device: '/dev/nvme0n1p3', total: 64, used: 42, percent: 65, type: 'xfs' },
  { mount: '/data', device: '/dev/sda1', total: 2048, used: 1540, percent: 75, type: 'zfs' },
  { mount: '/mnt/backup', device: '/dev/sdb1', total: 4096, used: 210, percent: 5, type: 'nfs4' },
];

export function StorageAnalyzer() {
  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border rounded-[32px] overflow-hidden flex flex-col h-full shadow-2xl transition-all hover:bg-card/50">
      {/* Header */}
      <div className="p-6 border-b border-border bg-foreground/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
            <Database className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-foreground uppercase tracking-tighter">Analyseur de Stockage</h3>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">4 Systèmes de fichiers</p>
          </div>
        </div>
        <div className="p-1.5 bg-foreground/5 rounded-lg border border-border">
          <FolderTree className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10">
        {PARTITIONS.map((partition, idx) => (
          <div key={partition.mount} className="space-y-3 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-xl border transition-all duration-300",
                  partition.percent > 80 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-foreground/5 border-border text-muted-foreground group-hover:bg-primary/5 group-hover:border-primary/20 group-hover:text-primary'
                )}>
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-foreground">{partition.mount}</span>
                    <span className="text-[8px] bg-foreground/10 px-1.5 py-0.5 rounded text-muted-foreground font-mono uppercase">{partition.type}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground font-mono truncate max-w-[150px]">{partition.device}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={cn(
                  "text-[10px] font-black tracking-tight",
                  partition.percent > 80 ? 'text-rose-500' : 'text-foreground'
                )}>{partition.percent}%</span>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-0.5">Utilisé</p>
              </div>
            </div>

            {/* Progress Bar Stack */}
            <div className="relative h-2 bg-foreground/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${partition.percent}%` }}
                 transition={{ duration: 0.8, delay: idx * 0.1 }}
                 className={cn(
                   "absolute top-0 left-0 h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]",
                   partition.percent > 90 ? 'bg-rose-500' : 
                   partition.percent > 70 ? 'bg-amber-500' : 'bg-primary'
                 )}
               />
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>

            <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider tabular-nums">
              <span>{partition.used} GB / {partition.total} GB</span>
              <span>{(partition.total - partition.used)} GB Libres</span>
            </div>
          </div>
        ))}

        {/* Diagnostic Tooltip Placeholder */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-3 mt-4 animate-in fade-in zoom-in duration-500">
           <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
           <p className="text-[10px] text-foreground/80 leading-relaxed italic">
             <strong>Note:</strong> L'intégrité du système de fichiers est vérifiée quotidiennement à 02:00. Aucun secteur défectueux détecté sur les disques NVMe.
           </p>
        </div>
      </div>

      {/* Footer */}
      <button className="p-4 bg-foreground/5 border-t border-border flex items-center justify-center gap-2 text-[8px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] hover:text-primary hover:bg-foreground/10 transition-all group">
         Générer un Rapport de Stockage Complet
         <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
