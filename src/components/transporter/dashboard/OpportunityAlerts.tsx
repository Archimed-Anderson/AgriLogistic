/**
 * Opportunity Alerts Component
 * Displays AI-powered alerts for nearby loads and optimization opportunities
 */
import React from 'react';
import { AlertCircle, MapPin, TrendingUp, DollarSign, Clock, X } from 'lucide-react';
import type { OpportunityAlert } from '@/types/transporter';
import { Link } from 'react-router-dom';

interface OpportunityAlertsProps {
  alerts: OpportunityAlert[];
  onDismiss?: (alertId: string) => void;
}

export function OpportunityAlerts({ alerts, onDismiss }: OpportunityAlertsProps) {
  const getAlertIcon = (type: OpportunityAlert['type']) => {
    switch (type) {
      case 'nearby_load':
        return MapPin;
      case 'optimal_route':
        return TrendingUp;
      case 'price_surge':
        return DollarSign;
      case 'urgent_delivery':
        return Clock;
      default:
        return AlertCircle;
    }
  };

  const getPriorityColor = (priority: OpportunityAlert['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'medium':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'low':
        return 'bg-gray-50 border-gray-200 text-gray-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getPriorityBadge = (priority: OpportunityAlert['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-blue-100 text-blue-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Opportunités</h2>
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Aucune opportunité pour le moment</p>
          <p className="text-sm text-gray-500 mt-1">
            Nous vous alerterons dès qu'une opportunité se présente
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Opportunités</h2>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
          {alerts.filter((a) => !a.read).length} nouvelle
          {alerts.filter((a) => !a.read).length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          const colorClass = getPriorityColor(alert.priority);
          const badgeClass = getPriorityBadge(alert.priority);

          return (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 ${colorClass} ${
                !alert.read ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{alert.title}</h3>
                    {onDismiss && (
                      <button
                        onClick={() => onDismiss(alert.id)}
                        className="flex-shrink-0 p-1 hover:bg-white/50 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm opacity-90 mb-3">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${badgeClass}`}>
                      {alert.priority === 'urgent' && '🔥 Urgent'}
                      {alert.priority === 'high' && '⚡ Prioritaire'}
                      {alert.priority === 'medium' && 'Moyen'}
                      {alert.priority === 'low' && 'Faible'}
                    </span>
                    {alert.actionUrl && (
                      <Link to={alert.actionUrl} className="text-sm font-medium hover:underline">
                        {alert.actionLabel || 'Voir plus'} →
                      </Link>
                    )}
                  </div>
                  {alert.expiresAt && (
                    <div className="mt-2 flex items-center gap-1 text-xs opacity-75">
                      <Clock className="w-3 h-3" />
                      <span>
                        Expire dans {Math.round((alert.expiresAt.getTime() - Date.now()) / 60000)}{' '}
                        min
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
