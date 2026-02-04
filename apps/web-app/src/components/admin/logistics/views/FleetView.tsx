'use client';

import React from 'react';
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
import { Truck, MapPin, Wrench, PlayCircle, StopCircle, AlertOctagon } from 'lucide-react';

export function FleetView() {
  const { trucks, updateTruckStatus } = useLogisticsStore();

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'Available':
        return (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-sm font-medium text-green-700">Disponible</span>
          </div>
        );
      case 'In Transit':
      case 'Assigned':
        return (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 dropdown-shadow"></div>
            <span className="text-sm font-medium text-blue-700">En Mission</span>
          </div>
        );
      case 'Maintenance':
        return (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm font-medium text-red-700">Maintenance</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
            <span className="text-sm font-medium text-gray-600">Offline</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-card p-4 rounded-xl border shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Truck className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Gestion de la Flotte</h3>
            <p className="text-sm text-muted-foreground">{trucks.length} Véhicules enregistrés</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
            Dispo: {trucks.filter((t) => t.status === 'Available').length}
          </span>
          <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
            En Route:{' '}
            {trucks.filter((t) => t.status === 'In Transit' || t.status === 'Assigned').length}
          </span>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Identifiant</TableHead>
              <TableHead>Chauffeur</TableHead>
              <TableHead className="text-center">Capacité</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Maintenance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trucks.map((truck) => (
              <TableRow key={truck.id}>
                <TableCell>
                  <div className="font-mono font-bold text-xs">{truck.id}</div>
                  <div className="text-[10px] text-muted-foreground">{truck.licensePlate}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{truck.driverName}</div>
                  <div className="text-xs flex items-center gap-1 text-yellow-600">
                    ★ {truck.driverRating}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="bg-slate-100 dark:bg-slate-800 font-bold px-2 py-1 rounded text-xs">
                    {truck.capacity}T
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    {truck.currentLocationCity}
                  </div>
                </TableCell>
                <TableCell>{getStatusIndicator(truck.status)}</TableCell>
                <TableCell className="text-right">
                  {truck.status === 'Maintenance' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                      onClick={() => updateTruckStatus(truck.id, 'Available')}
                    >
                      <PlayCircle className="w-3 h-3 mr-1" /> Fin Maint.
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => updateTruckStatus(truck.id, 'Maintenance')}
                    >
                      <Wrench className="w-3 h-3 mr-1" /> Forcer Maint.
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
