"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  Leaf, 
  Users, 
  Gavel, 
  Search, 
  Filter,
  MoreHorizontal
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const SUPPLIERS = [
    {
        id: "SUP-2938",
        name: "Coopérative de la Vallée",
        location: "Saint-Louis, SN",
        esgScore: 92,
        risk: "LOW",
        categories: ["Céréales", "Légumineuses"],
        lastAudit: "12 Oct 2023",
        certifications: ["Bio", "FairTrade"]
    },
    {
        id: "SUP-1029",
        name: "Ferme Bio Niayes",
        location: "Thiès, SN",
        esgScore: 88,
        risk: "LOW",
        categories: ["Maraîchage", "Fruits"],
        lastAudit: "05 Jan 2024",
        certifications: ["Bio", "HACCP"]
    },
    {
        id: "SUP-9921",
        name: "Agro-Export Sud",
        location: "Ziguinchor, SN",
        esgScore: 74,
        risk: "MEDIUM",
        categories: ["Mangues", "Anacarde"],
        lastAudit: "22 Nov 2023",
        certifications: ["GlobalGAP"]
    },
    {
        id: "SUP-4022",
        name: "Delta Riz SA",
        location: "Richard-Toll, SN",
        esgScore: 65,
        risk: "HIGH",
        categories: ["Riz"],
        lastAudit: "Pending",
        certifications: []
    }
]

export default function SuppliersPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Audit & Fournisseurs</h1>
              <p className="text-slate-400 text-sm">Gestion des risques, scoring ESG et audits de conformité.</p>
           </div>
           <Button className="bg-blue-600 hover:bg-blue-500 text-white gap-2">
               <ShieldCheck size={16} /> Nouvel Audit
           </Button>
        </div>

        {/* Risk Heatmap & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase">Risque Global</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-white">Low</span>
                        <span className="text-xs text-emerald-500 font-bold mb-1">Stable</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[85%]" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase">Conformité ESG</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                     <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-white">82<span className="text-sm text-slate-500">/100</span></span>
                        <span className="text-xs text-blue-500 font-bold mb-1">+4pts</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3 px-4">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase">Audits en Cours</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-white">3</span>
                        <span className="text-xs text-amber-500 font-bold mb-1">Actions requises</span>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Suppliers Table */}
        <Card className="flex-1 bg-slate-900/50 border-slate-800 flex flex-col min-h-0">
             <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                 <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                     <Users size={16} className="text-blue-500" />
                     Base Fournisseurs
                 </h3>
                 <div className="flex gap-2">
                     <div className="relative">
                         <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500" />
                         <Input placeholder="Rechercher..." className="h-8 w-48 pl-8 bg-slate-950 border-slate-700 text-xs" />
                     </div>
                     <Button variant="outline" size="sm" className="h-8 border-slate-700 bg-slate-900 text-slate-400">
                         <Filter size={12} className="mr-2" /> Filtres
                     </Button>
                 </div>
             </div>
             
             <div className="flex-1 overflow-auto">
                 <Table>
                     <TableHeader className="bg-slate-950 sticky top-0">
                         <TableRow className="border-slate-800 hover:bg-transparent">
                             <TableHead className="text-slate-500 text-xs uppercase font-bold w-[250px]">Fournisseur</TableHead>
                             <TableHead className="text-slate-500 text-xs uppercase font-bold">Catégories</TableHead>
                             <TableHead className="text-slate-500 text-xs uppercase font-bold">Score ESG</TableHead>
                             <TableHead className="text-slate-500 text-xs uppercase font-bold">Risque</TableHead>
                             <TableHead className="text-slate-500 text-xs uppercase font-bold">Dernier Audit</TableHead>
                             <TableHead className="text-slate-500 text-xs uppercase font-bold">Certifications</TableHead>
                             <TableHead className="w-[50px]"></TableHead>
                         </TableRow>
                     </TableHeader>
                     <TableBody>
                         {SUPPLIERS.map((supplier) => (
                             <TableRow key={supplier.id} className="border-slate-800 hover:bg-slate-800/50 group">
                                 <TableCell className="font-bold text-slate-200">
                                     <div className="flex flex-col">
                                         <span className="text-white">{supplier.name}</span>
                                         <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                             <MapPin size={10} /> {supplier.location}
                                         </span>
                                     </div>
                                 </TableCell>
                                 <TableCell className="text-xs text-slate-400">
                                     {supplier.categories.join(", ")}
                                 </TableCell>
                                 <TableCell>
                                     <Badge variant="outline" className={`border-none ${
                                         supplier.esgScore > 85 ? 'bg-emerald-500/10 text-emerald-500' : 
                                         supplier.esgScore > 70 ? 'bg-blue-500/10 text-blue-500' :
                                         'bg-red-500/10 text-red-500'
                                     }`}>
                                         {supplier.esgScore}/100
                                     </Badge>
                                 </TableCell>
                                 <TableCell>
                                     {supplier.risk === 'LOW' && <Badge className="bg-emerald-500/10 text-emerald-500 border-none hover:bg-emerald-500/20">LOW</Badge>}
                                     {supplier.risk === 'MEDIUM' && <Badge className="bg-amber-500/10 text-amber-500 border-none hover:bg-amber-500/20">MEDIUM</Badge>}
                                     {supplier.risk === 'HIGH' && <Badge className="bg-red-500/10 text-red-500 border-none hover:bg-red-500/20">HIGH</Badge>}
                                 </TableCell>
                                 <TableCell className="text-xs font-mono text-slate-400">
                                     {supplier.lastAudit}
                                 </TableCell>
                                 <TableCell>
                                     <div className="flex gap-1">
                                         {supplier.certifications.map(c => (
                                             <div key={c} className="h-5 px-1.5 rounded flex items-center bg-slate-800 border border-slate-700 text-[9px] font-bold text-slate-300">
                                                 {c}
                                             </div>
                                         ))}
                                     </div>
                                 </TableCell>
                                 <TableCell>
                                     <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white">
                                         <MoreHorizontal size={14} />
                                     </Button>
                                 </TableCell>
                             </TableRow>
                         ))}
                     </TableBody>
                 </Table>
             </div>
        </Card>
    </div>
  )
}
