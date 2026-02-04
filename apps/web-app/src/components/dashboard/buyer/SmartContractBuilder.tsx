'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Shield,
  Truck,
  DollarSign,
  X,
  Check,
  Fingerprint,
  Lock,
  Boxes,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Visual Nodes for "Contract DNA"
const NODES = [
  { id: 'root', label: 'Smart Agreement', icon: FileText, x: 50, y: 50, color: 'text-white' },
  {
    id: 'payment',
    label: 'Escrow Payment',
    icon: DollarSign,
    x: 20,
    y: 80,
    color: 'text-emerald-400',
  },
  { id: 'delivery', label: 'GPS Trigger', icon: Truck, x: 80, y: 80, color: 'text-blue-400' },
  {
    id: 'quality',
    label: 'IoT Quality Check',
    icon: Shield,
    x: 50,
    y: 110,
    color: 'text-purple-400',
  },
];

export function SmartContractBuilder({ onClose }: { onClose: () => void }) {
  const [clauses, setClauses] = React.useState<string[]>([]);
  const [isSigned, setIsSigned] = React.useState(false);

  const toggleClause = (id: string) => {
    if (clauses.includes(id)) {
      setClauses(clauses.filter((c) => c !== id));
    } else {
      setClauses([...clauses, id]);
    }
  };

  const handleSign = () => {
    if (clauses.length < 3) {
      toast.error('Contrat incomplet', {
        description: 'Veuillez sélectionner au moins 3 conditions.',
      });
      return;
    }
    setIsSigned(true);
    toast.success('Smart Contract Déployé', {
      description: 'Hash: 0x71C...92F | Fonds bloqués en Escrow.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="h-full flex flex-col bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
            <Boxes className="text-white h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Builder de Contrat
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">Hyperledger Fabric v2.4</p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-slate-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left: Clause Library */}
        <div className="col-span-4 border-r border-slate-700/50 p-4 space-y-4 bg-slate-900/30 overflow-y-auto custom-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2">
            Conditions Disponibles
          </span>

          <div className="space-y-2">
            {[
              { id: 'c1', label: 'Paiement - Escrow 48h', icon: DollarSign },
              { id: 'c2', label: 'Livraison - GPS Tracked', icon: Truck },
              { id: 'c3', label: 'Qualité - IoT Verified', icon: Shield },
              { id: 'c4', label: 'Pénalité Retard (5%)', icon: Fragment },
              { id: 'c5', label: 'Assurance Transport', icon: Lock },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => toggleClause(item.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  clauses.includes(item.id)
                    ? 'bg-blue-600/10 border-blue-500/50 text-blue-200'
                    : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div
                  className={`p-1.5 rounded ${clauses.includes(item.id) ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                >
                  <item.icon size={12} />
                </div>
                <span className="text-xs font-bold">{item.label}</span>
                {clauses.includes(item.id) && <Check size={12} className="ml-auto text-blue-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visualizer */}
        <div className="col-span-8 bg-[url('/grid-pattern.svg')] relative flex flex-col items-center justify-center p-8">
          {isSigned ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="h-24 w-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 relative">
                <Check className="h-10 w-10 text-emerald-500" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-emerald-400"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest">
                  Contrat Signé
                </h2>
                <p className="text-xs text-emerald-400 font-mono mt-1">
                  Transaction enregistrée sur la Blockchain
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="relative w-64 h-64">
                {/* Central Hub */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="bg-slate-900 border-2 border-slate-600 p-4 rounded-xl flex flex-col items-center">
                    <FileText className="text-white h-6 w-6 mb-1" />
                    <span className="text-[10px] font-bold text-slate-300">Contract #829</span>
                  </div>
                </motion.div>

                {/* Floating Nodes based on clauses */}
                <AnimatePresence>
                  {clauses.map((c, i) => {
                    // Simple positioning calculation around a circle
                    const angle = i * (360 / clauses.length) * (Math.PI / 180);
                    const radius = 80;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <motion.div
                        key={c}
                        initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                        animate={{ scale: 1, opacity: 1, x, y }}
                        exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                        className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 rounded-full bg-slate-800 border border-blue-500 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] flex items-center justify-center z-10"
                      >
                        <Shield className="h-4 w-4 text-blue-400" />
                        {/* Connecting Line (Pseudo) */}
                        <div
                          className="absolute top-1/2 left-1/2 w-[80px] h-[1px] bg-blue-500/30 origin-left -z-10"
                          style={{
                            transform: `rotate(${Math.atan2(-y, -x) * (180 / Math.PI)}deg)`,
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="absolute bottom-8 w-full px-12">
                <Button
                  onClick={handleSign}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 group"
                >
                  <Fingerprint className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Signer & Bloquer Fonds
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Fragment({ size, ...props }: any) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 2 20 20" />
      <path d="M21 21v-7" />
      <path d="M3 3v7" />
      {/* Simplified Icon */}
    </svg>
  );
}
