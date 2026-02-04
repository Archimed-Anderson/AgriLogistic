'use client';

import { AlertTriangle, X, MapPin, Clock, AlertCircle } from 'lucide-react';
import {
  criticalAlerts,
  getAlertsBySeverity,
  type CriticalAlert,
} from '@/data/crop-intelligence-data';
import { useState } from 'react';

export function CriticalAlertsPanel() {
  const [closedAlerts, setClosedAlerts] = useState<Set<string>>(new Set());
  const [showResolved, setShowResolved] = useState(false);

  const activeAlerts = criticalAlerts.filter((alert) => !closedAlerts.has(alert.id));
  const resolvedAlerts = closedAlerts.size;
  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;
  const warningCount = activeAlerts.filter((a) => a.severity === 'warning').length;

  const handleClose = (alertId: string) => {
    setClosedAlerts((prev) => new Set([...prev, alertId]));
  };

  const getAlertIcon = (type: CriticalAlert['type']) => {
    switch (type) {
      case 'disease':
        return '🦠';
      case 'water':
        return '💧';
      case 'pest':
        return '🐛';
      case 'weather':
        return '🌤️';
      case 'nutrient':
        return '🌱';
    }
  };

  const getAlertColor = (severity: CriticalAlert['severity']) => {
    return severity === 'critical'
      ? 'bg-red-50/80 border-red-300 hover:border-red-400'
      : 'bg-orange-50/80 border-orange-300 hover:border-orange-400';
  };

  const getAlertIconBg = (severity: CriticalAlert['severity']) => {
    return severity === 'critical'
      ? 'bg-linear-to-br from-red-500 to-rose-600'
      : 'bg-linear-to-br from-orange-500 to-amber-600';
  };

  if (activeAlerts.length === 0 && !showResolved) {
    return (
      <div className="bg-emerald-50/30 rounded-3xl p-8 border border-emerald-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-[#0A2619]">Alertes IA</h3>
          </div>
          {resolvedAlerts > 0 && (
            <button
              onClick={() => setShowResolved(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 transition-colors"
            >
              📚 Historique ({resolvedAlerts})
            </button>
          )}
        </div>
        <p className="text-emerald-700 font-medium">
          ✨ Aucune alerte active. Toutes les zones sont surveillées et fonctionnent normalement.
        </p>
      </div>
    );
  }

  // Determine alerts to display
  const displayedAlerts = showResolved
    ? criticalAlerts.filter((alert) => closedAlerts.has(alert.id))
    : activeAlerts;

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl shadow-lg relative ${
              showResolved
                ? 'bg-linear-to-br from-slate-500 to-slate-600'
                : 'bg-linear-to-br from-red-500 to-rose-600'
            }`}
          >
            <AlertTriangle className="h-6 w-6 text-white" />
            {!showResolved && criticalCount > 0 && (
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 border-2 border-white flex items-center justify-center">
                <span className="text-xs font-black text-white">{criticalCount}</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#0A2619]">
              {showResolved ? '📚 Historique des Alertes' : 'Alertes IA'}
            </h3>
            <p className="text-sm text-slate-600 font-medium">
              {showResolved
                ? `${resolvedAlerts} alerte${resolvedAlerts > 1 ? 's' : ''} résolue${resolvedAlerts > 1 ? 's' : ''}`
                : `${criticalCount} critique${criticalCount > 1 ? 's' : ''} • ${warningCount} avertissement${warningCount > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowResolved(!showResolved)}
          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 transition-colors"
        >
          {showResolved ? '← Actives' : `📚 Historique (${resolvedAlerts})`}
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {displayedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`relative rounded-2xl border-2 p-5 transition-all duration-300 ${getAlertColor(alert.severity)}`}
          >
            {/* Close Button */}
            <button
              onClick={() => handleClose(alert.id)}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
              title="Marquer comme résolu"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`shrink-0 p-3 rounded-xl ${getAlertIconBg(alert.severity)} shadow-lg`}
              >
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Zone & Type */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                  <span className="text-sm font-bold text-slate-700">{alert.zoneName}</span>
                  <MapPin className="h-3 w-3 text-slate-400" />
                </div>

                {/* Message */}
                <h4
                  className={`text-lg font-black mb-2 ${
                    alert.severity === 'critical' ? 'text-red-900' : 'text-orange-900'
                  }`}
                >
                  {alert.message}
                </h4>

                {/* Action Required */}
                <div className="mb-3 p-3 rounded-xl bg-white/60 border border-white/40">
                  <p className="text-sm font-bold text-slate-700">
                    <span className="text-slate-500">Action: </span>
                    {alert.actionRequired}
                  </p>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">
                    Détecté:{' '}
                    {new Date(alert.detectedAt).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
