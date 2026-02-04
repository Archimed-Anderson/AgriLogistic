import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/app/components/ui/button';

interface PlanningEvent {
  id: string;
  time: string;
  title: string;
  driver: string;
  location: string;
  status: 'confirmed' | 'pending' | 'delayed';
  type: 'pickup' | 'delivery' | 'maintenance';
}

const EVENTS: PlanningEvent[] = [
  {
    id: 'EV-1',
    time: '08:00',
    title: 'Chargement Arachides',
    driver: 'Moussa Diop',
    location: 'Entrepôt Dakar A',
    status: 'confirmed',
    type: 'pickup',
  },
  {
    id: 'EV-2',
    time: '10:30',
    title: 'Livraison Engrais',
    driver: 'Oumar Sy',
    location: 'Ferme Thiès',
    status: 'pending',
    type: 'delivery',
  },
  {
    id: 'EV-3',
    time: '14:00',
    title: 'Entretien FL-004',
    driver: 'Ibrahima Faye',
    location: 'Garage Central',
    status: 'confirmed',
    type: 'maintenance',
  },
  {
    id: 'EV-4',
    time: '16:45',
    title: 'Pickup Produits Frais',
    driver: 'Babacar Ndiaye',
    location: 'Port de Dakar',
    status: 'delayed',
    type: 'pickup',
  },
];

export function DynamicPlanner() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-xl rounded-[40px] overflow-hidden border border-border shadow-2xl transition-all hover:bg-card/50">
      {/* Header */}
      <div className="p-8 border-b border-border bg-foreground/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-tighter">
              Planificateur Dynamique
            </h3>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
              Semaine 04 • Gestion des Créneaux
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-xl bg-foreground/5 border border-border/50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 text-foreground">
            24 Janvier 2026
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-xl bg-foreground/5 border border-border/50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Timeline View */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10 p-6 space-y-6">
        {/* Simple Day Filter */}
        <div className="flex items-center justify-between gap-2 bg-foreground/5 p-1.5 rounded-2xl border border-border">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
            <button
              key={i}
              className={cn(
                'flex-1 py-3 rounded-xl text-[10px] font-black transition-all',
                i === 5
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:bg-foreground/5'
              )}
            >
              {day}
              <span className="block text-[8px] opacity-40 mt-0.5">{19 + i}</span>
            </button>
          ))}
        </div>

        {/* Event Stream */}
        <div className="space-y-4">
          {EVENTS.map((event) => (
            <div
              key={event.id}
              className="group relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-border/30"
            >
              <div
                className={cn(
                  'absolute left-[-4px] top-1 w-2 h-2 rounded-full border-2 border-card z-10',
                  event.status === 'confirmed'
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                    : event.status === 'delayed'
                    ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                    : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                )}
              />

              <div className="p-5 rounded-3xl bg-foreground/5 border border-border transition-all hover:bg-card hover:shadow-xl group-hover:border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-black text-foreground tabular-nums">
                      {event.time}
                    </span>
                  </div>
                  <StatusBadge status={event.status} />
                </div>

                <h4 className="text-[11px] font-black text-foreground uppercase tracking-tight mb-3">
                  {event.title}
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] font-bold text-muted-foreground truncate">
                      {event.driver}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] font-bold text-muted-foreground truncate">
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-primary/5 border-t border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
            Optimisation de l'itinéraire : ACTIVE
          </span>
        </div>
        <Button
          size="sm"
          className="rounded-xl px-4 text-[9px] font-black uppercase tracking-widest h-8"
        >
          Nouveau Shift
        </Button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: PlanningEvent['status'] }) {
  const styles = {
    confirmed: 'text-emerald-500',
    pending: 'text-amber-500',
    delayed: 'text-rose-500',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1 text-[9px] font-black uppercase tracking-widest',
        styles[status]
      )}
    >
      {status === 'confirmed' ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <AlertCircle className="w-3 h-3" />
      )}
      {status}
    </div>
  );
}
