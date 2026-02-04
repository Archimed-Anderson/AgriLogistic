'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Clock, Users, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SourcingHub } from '@/components/dashboard/buyer/SourcingHub';
import { BUYER_INTEL_DATA } from '@/data/buyer-intel-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function RFQPage() {
  const [showNewRFQ, setShowNewRFQ] = React.useState(true);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Mes Appels d'Offres (RFQ)
          </h1>
          <p className="text-slate-400 text-sm">
            Gérez vos demandes d'approvisionnement et analysez les offres.
          </p>
        </div>
        <Button
          onClick={() => setShowNewRFQ(!showNewRFQ)}
          variant={showNewRFQ ? 'secondary' : 'default'}
          className="gap-2"
        >
          {showNewRFQ ? (
            'Masquer Formulaire'
          ) : (
            <>
              <Plus size={16} /> Nouvelle Demande
            </>
          )}
        </Button>
      </div>

      {/* Create New RFQ Section */}
      {showNewRFQ && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2 border-b border-slate-800">
              <CardTitle className="text-sm font-bold text-slate-300 uppercase">
                Sourcing Engine
              </CardTitle>
            </CardHeader>
            <div className="p-6">
              <SourcingHub />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Active RFQs List */}
      <div className="flex-1 min-h-0 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            Historique & Actifs
          </h3>
          <div className="flex gap-2">
            <Input placeholder="Rechercher..." className="h-8 w-48 bg-slate-900 border-slate-800" />
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-slate-800 bg-slate-900 text-slate-400"
            >
              <Filter size={14} />
            </Button>
          </div>
        </div>

        <Card className="bg-slate-900/50 border-slate-800">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-500 text-xs uppercase font-bold">RFQ ID</TableHead>
                <TableHead className="text-slate-500 text-xs uppercase font-bold">
                  Produit
                </TableHead>
                <TableHead className="text-slate-500 text-xs uppercase font-bold">
                  Quantité
                </TableHead>
                <TableHead className="text-slate-500 text-xs uppercase font-bold">
                  Réponses
                </TableHead>
                <TableHead className="text-slate-500 text-xs uppercase font-bold">Statut</TableHead>
                <TableHead className="text-slate-500 text-xs uppercase font-bold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BUYER_INTEL_DATA.rfqHistory.map((rfq) => (
                <TableRow key={rfq.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="font-mono text-xs text-slate-300 font-bold">
                    {rfq.id}
                  </TableCell>
                  <TableCell className="text-white font-bold">{rfq.product}</TableCell>
                  <TableCell className="text-slate-400 text-xs">{rfq.quantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users size={12} className="text-blue-500" />
                      <span className="text-white font-bold">{rfq.responses}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-none ${
                        rfq.status === 'OPEN'
                          ? 'bg-blue-500/10 text-blue-500'
                          : rfq.status === 'NEGOTIATION'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-slate-700/20 text-slate-500'
                      }`}
                    >
                      {rfq.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-500 hover:text-white"
                    >
                      <MoreHorizontal size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
