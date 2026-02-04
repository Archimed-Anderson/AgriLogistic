'use client';

import React, { useState } from 'react';
import { useLogisticsStore } from '@/store/useLogisticsStore';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Package,
  MoreHorizontal,
  Edit,
  Trash,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  Truck,
} from 'lucide-react';
import { Load } from '@/data/logistics-operations';

export function CargosView() {
  const { loads, deleteLoad, addLoad } = useLogisticsStore();
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Matched' | 'Delivered'>(
    'All'
  );

  const filteredLoads = loads.filter((load) =>
    statusFilter === 'All' ? true : load.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <Clock className="w-3 h-3 mr-1" /> En attente
          </span>
        );
      case 'Matched':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Truck className="w-3 h-3 mr-1" /> Attribué
          </span>
        );
      case 'In Transit':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Truck className="w-3 h-3 mr-1" /> En Transit
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Livré
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const handleCreateLoad = () => {
    // Mock simulation of creating a load
    const newLoad: Load = {
      id: `LOAD-${Date.now()}`,
      productType: 'Cacao',
      quantity: 25,
      unit: 'tonnes',
      origin: [5.36, -4.0083],
      destination: [6.827, -5.2893],
      originCity: 'Abidjan',
      destinationCity: 'Yamoussoukro',
      priceOffer: 450000,
      currency: 'FCFA',
      status: 'Pending',
      producerId: 'PROD-MOCK',
      producerName: 'Nouveau Producteur',
      producerPhone: '+225 00000000',
      insurance: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiMatchScore: 0,
      pickupDate: new Date().toISOString(),
      deliveryDate: new Date().toISOString(),
    };
    addLoad(newLoad);
    alert('Nouveau chargement simulé ajouté !');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Gestion des Cargos</h3>
            <p className="text-sm text-muted-foreground">
              {filteredLoads.length} chargements listés
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center bg-background border rounded-lg p-1">
            {(['All', 'Pending', 'Matched'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === filter
                    ? 'bg-muted text-foreground font-bold shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                {filter === 'All' ? 'Tous' : filter}
              </button>
            ))}
          </div>

          <Button onClick={handleCreateLoad} className="gap-2">
            <Plus className="w-4 h-4" /> Nouveau
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">Référence</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Expéditeur</TableHead>
              <TableHead>Origine &rarr; Destination</TableHead>
              <TableHead className="text-right">Offre (FCFA)</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoads.map((load) => (
              <TableRow key={load.id}>
                <TableCell className="font-mono text-xs font-medium">{load.id}</TableCell>
                <TableCell>
                  <div className="font-bold">{load.productType}</div>
                  <div className="text-xs text-muted-foreground">
                    {load.quantity} {load.unit}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{load.producerName}</div>
                  <div className="text-xs text-muted-foreground">{load.producerPhone}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>{' '}
                      {load.originCity}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>{' '}
                      {load.destinationCity}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {load.priceOffer.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(load.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 font-medium"
                        onClick={() => deleteLoad(load.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
