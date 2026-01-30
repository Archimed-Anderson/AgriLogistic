"use client"

import React from 'react';
import { useLogisticsStore } from "@/store/useLogisticsStore";
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  Thermometer, 
  Settings, 
  Truck, 
  MapPin, 
  Bell,
  Activity
} from 'lucide-react';
import { IoTAlert } from '@/data/logistics-operations';

export function AlertsView() {
  const { alerts, resolveAlert } = useLogisticsStore();
  
  // Sorting: Critical first, then Warning, then Info (by time usually, but severity first here for visibility)
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityScore = { critical: 3, warning: 2, info: 1 };
    if (a.status === 'Resolved' && b.status !== 'Resolved') return 1;
    if (a.status !== 'Resolved' && b.status === 'Resolved') return -1;
    return severityScore[b.severity] - severityScore[a.severity];
  });

  const getAlertIcon = (type: IoTAlert['type']) => {
    switch(type) {
      case 'Temperature': return <Thermometer className="w-5 h-5" />;
      case 'Engine': return <Settings className="w-5 h-5" />;
      case 'Tire': return <Activity className="w-5 h-5" />;
      case 'Geofence': return <MapPin className="w-5 h-5" />;
      case 'Fuel': return <Truck className="w-5 h-5" />;
      case 'Match': return <CheckCircle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  }

  const AlertCard = ({ alert }: { alert: IoTAlert }) => {
    const isResolved = alert.status === 'Resolved';
    
    // Styling based on severity
    let borderClass = 'border-l-4 border-l-blue-500';
    let bgClass = 'bg-card';
    let iconColorClass = 'text-blue-500 bg-blue-500/10';
    let buttonVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined = 'outline';

    if (alert.severity === 'critical') {
      borderClass = 'border-l-4 border-l-red-500';
      bgClass = 'bg-red-500/5';
      iconColorClass = 'text-red-500 bg-red-500/10 animate-pulse';
      buttonVariant = 'destructive';
    } else if (alert.severity === 'warning') {
      borderClass = 'border-l-4 border-l-orange-500';
      bgClass = 'bg-orange-500/5';
      iconColorClass = 'text-orange-500 bg-orange-500/10';
      buttonVariant = 'secondary';
    }

    if (isResolved) {
      borderClass = 'border-l-4 border-l-gray-300 dark:border-l-gray-600';
      bgClass = 'bg-gray-100/50 dark:bg-gray-900/50 opacity-60';
      iconColorClass = 'text-gray-400 bg-gray-200/50';
    }

    return (
      <div className={`relative flex gap-4 p-4 rounded-r-xl border shadow-sm transition-all ${borderClass} ${bgClass}`}>
        {/* Timeline Connector (Visual Trick) */}
        {!isResolved && (
          <div className="absolute -left-[29px] top-6 w-5 h-[2px] bg-slate-200 dark:bg-slate-700"></div>
        )}
        
        {/* Icon */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${iconColorClass}`}>
          {getAlertIcon(alert.type)}
        </div>

        {/* Content */}
        <div className="flex-1">
           <div className="flex justify-between items-start">
             <div>
                <h4 className={`font-bold text-base ${isResolved ? 'line-through text-muted-foreground' : ''}`}>
                   {alert.type} Alert <span className="text-xs font-normal text-muted-foreground ml-2">#{alert.id}</span>
                </h4>
                <p className="text-xs text-muted-foreground mb-1">
                   {new Date(alert.timestamp).toLocaleString()}
                </p>
             </div>
             <div className="text-right">
                {isResolved ? (
                    <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" /> Résolu
                    </span>
                ) : (
                    <span className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        alert.severity === 'critical' ? 'text-red-600 bg-red-100' :
                        alert.severity === 'warning' ? 'text-orange-600 bg-orange-100' :
                        'text-blue-600 bg-blue-100'
                    }`}>
                        {alert.severity}
                    </span>
                )}
             </div>
           </div>
           
           <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">
             {alert.message} - Camion <span className="font-mono font-bold">{alert.truckPlate}</span>
           </p>

           {/* Actions */}
           {!isResolved && (
             <div className="mt-4 flex gap-2">
                <Button 
                   size="sm" 
                   variant={buttonVariant} 
                   className="h-8 text-xs"
                   onClick={() => resolveAlert(alert.id)}
                >
                   <CheckCircle className="w-3 h-3 mr-2" />
                   Marquer comme Résolu
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-xs">
                   Voir Détails
                </Button>
             </div>
           )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-card p-4 rounded-xl border shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="p-2 bg-orange-500/10 rounded-lg">
             <AlertTriangle className="w-6 h-6 text-orange-500" />
           </div>
           <div>
             <h3 className="font-bold text-lg">Centre de Contrôle & Alertes</h3>
             <p className="text-sm text-muted-foreground">
                {alerts.filter(a => a.status === 'Open').length} problèmes nécessitant une attention
             </p>
           </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm">Exporter Rapport</Button>
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 dark:border-slate-800 ml-4 pb-10">
         {sortedAlerts.map((alert) => (
            <div key={alert.id} className="relative">
                {/* Timeline Dot */}
                <div className={`absolute -left-[31px] top-6 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                    alert.status === 'Resolved' ? 'bg-slate-300' :
                    alert.severity === 'critical' ? 'bg-red-500 animate-pulse' :
                    alert.severity === 'warning' ? 'bg-orange-500' :
                    'bg-blue-500'
                }`}></div>
                
                <AlertCard alert={alert} />
            </div>
         ))}
      </div>
    
    </div>
  );
}
