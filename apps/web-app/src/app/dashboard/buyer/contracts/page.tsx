"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  MoreHorizontal
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BUYER_INTEL_DATA } from "@/data/buyer-intel-data"
import { SmartContractBuilder } from "@/components/dashboard/buyer/SmartContractBuilder"
import { AnimatePresence } from "framer-motion"

export default function ContractsPage() {
   const [showBuilder, setShowBuilder] = React.useState(false)

   return (
       <div className="h-full flex flex-col space-y-6">
           <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Smart Contracts</h1>
                  <p className="text-slate-400 text-sm">Gestion des contrats Blockchain et Escrow Agreements.</p>
               </div>
               <Button onClick={() => setShowBuilder(true)} className="bg-blue-600 hover:bg-blue-500 text-white gap-2">
                   <FileText size={16} /> Nouveau Contrat
               </Button>
           </div>

           {showBuilder ? (
               <div className="flex-1 min-h-0 relative">
                    <Button variant="ghost" size="sm" onClick={() => setShowBuilder(false)} className="absolute -top-10 right-40 text-slate-400">
                        Retour Liste
                    </Button>
                    <SmartContractBuilder onClose={() => setShowBuilder(false)} />
               </div>
           ) : (
               <div className="flex-1 min-h-0 space-y-6">
                   {/* Filters */}
                   <div className="flex items-center gap-4">
                       <div className="relative flex-1 max-w-sm">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                           <Input placeholder="Rechercher par hash, ID, ou contrepartie..." className="pl-9 bg-slate-900 border-slate-800 text-slate-300" />
                       </div>
                       <Button variant="outline" className="border-slate-800 bg-slate-900 text-slate-400 gap-2">
                           <Filter size={14} /> Filtres
                       </Button>
                   </div>

                   {/* Contract List */}
                   <div className="grid gap-4">
                       {BUYER_INTEL_DATA.smartContracts.map((contract, i) => (
                           <motion.div 
                              key={contract.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                           >
                               <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                                   <CardContent className="p-4 flex items-center gap-6">
                                       <div className="h-10 w-10 bg-slate-800 rounded flex items-center justify-center shrink-0">
                                           <FileText className="text-blue-500" size={20} />
                                       </div>
                                       
                                       <div className="flex-1 grid grid-cols-4 gap-4">
                                           <div>
                                               <span className="text-[10px] text-slate-500 uppercase font-bold block">Contract ID</span>
                                               <span className="text-white font-bold font-mono">{contract.id}</span>
                                           </div>
                                           <div>
                                               <span className="text-[10px] text-slate-500 uppercase font-bold block">Contrepartie</span>
                                               <span className="text-white text-sm">{contract.parties[1]}</span>
                                           </div>
                                           <div>
                                               <span className="text-[10px] text-slate-500 uppercase font-bold block">Valeur Escrow</span>
                                               <span className="text-emerald-400 font-mono font-bold">{contract.value}</span>
                                           </div>
                                           <div>
                                               <span className="text-[10px] text-slate-500 uppercase font-bold block">Status Blockchain</span>
                                               <Badge variant="outline" className={`mt-0.5 border-none ${
                                                   contract.status === 'ACTIVE' 
                                                   ? 'bg-emerald-500/10 text-emerald-500' 
                                                   : 'bg-amber-500/10 text-amber-500'
                                               }`}>
                                                   {contract.status === 'ACTIVE' ? <ShieldCheck size={12} className="mr-1" /> : <AlertTriangle size={12} className="mr-1" />}
                                                   {contract.status}
                                               </Badge>
                                           </div>
                                       </div>

                                       <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                                           <ArrowRight size={16} />
                                       </Button>
                                   </CardContent>
                               </Card>
                           </motion.div>
                       ))}
                   </div>
               </div>
           )}
       </div>
   )
}
