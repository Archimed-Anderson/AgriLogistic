/**
 * Buyer Quality Control Page
 * Quality inspections and non-conformity management
 */
'use client';

import React, { useState } from 'react';
import {
  useQualityControl,
  QualityInspection,
  NonConformity,
} from '@/hooks/buyer/useQualityControl';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Camera,
  FileText,
  ChevronRight,
  X,
  Filter,
  TrendingUp,
  TrendingDown,
  Package,
} from 'lucide-react';

const statusConfig = {
  passed: {
    label: 'Conforme',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
  },
  failed: { label: 'Non-conforme', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  warning: {
    label: 'Accepté avec réserves',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: AlertTriangle,
  },
  pending: {
    label: 'En attente',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
  },
};

const severityConfig = {
  minor: { label: 'Mineur', color: 'bg-blue-100 text-blue-700' },
  major: { label: 'Majeur', color: 'bg-amber-100 text-amber-700' },
  critical: { label: 'Critique', color: 'bg-red-100 text-red-700' },
};

const ncStatusConfig = {
  open: { label: 'Ouvert', color: 'bg-red-100 text-red-700' },
  in_progress: { label: 'En cours', color: 'bg-amber-100 text-amber-700' },
  resolved: { label: 'Résolu', color: 'bg-emerald-100 text-emerald-700' },
  closed: { label: 'Clôturé', color: 'bg-slate-100 text-slate-700' },
};

export default function BuyerQualityPage() {
  const {
    inspections,
    nonConformities,
    passedInspections,
    failedInspections,
    openNonConformities,
    isLoading,
  } = useQualityControl();
  const [selectedInspection, setSelectedInspection] = useState<QualityInspection | null>(null);
  const [activeTab, setActiveTab] = useState<'inspections' | 'nonConformities'>('inspections');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const avgScore =
    inspections.length > 0
      ? Math.round(inspections.reduce((acc, i) => acc + i.overallScore, 0) / inspections.length)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contrôle Qualité</h1>
          <p className="text-slate-600">Inspections et non-conformités</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Score moyen</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{avgScore}%</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Conformes</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{passedInspections.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Non-conformes</span>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{failedInspections.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">NC en cours</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{openNonConformities.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('inspections')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'inspections'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Inspections
        </button>
        <button
          onClick={() => setActiveTab('nonConformities')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'nonConformities'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Non-conformités
          {openNonConformities.length > 0 && (
            <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {openNonConformities.length}
            </span>
          )}
        </button>
      </div>

      {/* Inspections Tab */}
      {activeTab === 'inspections' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {inspections.map((inspection) => {
              const config = statusConfig[inspection.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={inspection.id}
                  onClick={() => setSelectedInspection(inspection)}
                  className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}
                      >
                        <StatusIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{inspection.productName}</h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-lg border ${config.color}`}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">
                          {inspection.orderNumber} • {inspection.supplierName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className={`text-xl font-bold ${
                            inspection.overallScore >= 80
                              ? 'text-emerald-600'
                              : inspection.overallScore >= 60
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          {inspection.overallScore}%
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(inspection.inspectionDate)}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Non-Conformities Tab */}
      {activeTab === 'nonConformities' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {nonConformities.map((nc) => {
              const sevConfig = severityConfig[nc.severity];
              const statConfig = ncStatusConfig[nc.status];

              return (
                <div key={nc.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-lg ${sevConfig.color}`}
                        >
                          {sevConfig.label}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-lg ${statConfig.color}`}
                        >
                          {statConfig.label}
                        </span>
                      </div>
                      <p className="font-medium text-slate-900">{nc.description}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Signalé le {formatDate(nc.reportedAt)}
                      </p>
                      {nc.resolution && (
                        <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                          <p className="text-sm text-emerald-700">{nc.resolution}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inspection Detail Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedInspection.productName}
                  </h2>
                  <p className="text-slate-500">{selectedInspection.orderNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedInspection(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Score Global */}
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
                    selectedInspection.overallScore >= 80
                      ? 'bg-emerald-100'
                      : selectedInspection.overallScore >= 60
                      ? 'bg-amber-100'
                      : 'bg-red-100'
                  }`}
                >
                  <span
                    className={`text-3xl font-bold ${
                      selectedInspection.overallScore >= 80
                        ? 'text-emerald-600'
                        : selectedInspection.overallScore >= 60
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}
                  >
                    {selectedInspection.overallScore}%
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2">Score global</p>
              </div>

              {/* Criteria */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Critères d'évaluation</h3>
                <div className="space-y-3">
                  {selectedInspection.criteria.map((criteria, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{criteria.name}</p>
                        {criteria.comment && (
                          <p className="text-sm text-slate-500">{criteria.comment}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              criteria.score / criteria.maxScore >= 0.8
                                ? 'bg-emerald-500'
                                : criteria.score / criteria.maxScore >= 0.6
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${(criteria.score / criteria.maxScore) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700 w-12 text-right">
                          {criteria.score}/{criteria.maxScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Commentaires</h3>
                <p className="text-slate-600 bg-slate-50 p-4 rounded-xl">
                  {selectedInspection.comments}
                </p>
              </div>

              {/* Action Required */}
              {selectedInspection.actionRequired && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-800">Action requise</p>
                      <p className="text-sm text-amber-700">{selectedInspection.actionRequired}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-slate-500">Inspecteur</p>
                  <p className="font-medium text-slate-900">{selectedInspection.inspector}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-slate-500">Date</p>
                  <p className="font-medium text-slate-900">
                    {formatDate(selectedInspection.inspectionDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
