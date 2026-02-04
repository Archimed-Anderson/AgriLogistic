/**
 * Buyer Traceability Page
 * Full product traceability with journey visualization
 */
'use client';

import React, { useState } from 'react';
import { useTraceability } from '@/hooks/buyer/useTraceability';
import {
  FileSearch,
  MapPin,
  Clock,
  CheckCircle,
  Leaf,
  Truck,
  Package,
  Factory,
  Scissors,
  Droplets,
  Sun,
  Shield,
  ExternalLink,
  QrCode,
  Download,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import type { TraceabilityStepType } from '@/types/buyer';

const stepIcons: Record<TraceabilityStepType, React.ElementType> = {
  planting: Leaf,
  growing: Sun,
  treatment: Droplets,
  harvest: Scissors,
  processing: Factory,
  packaging: Package,
  storage: Package,
  transport: Truck,
  delivery: MapPin,
};

const stepColors: Record<TraceabilityStepType, string> = {
  planting: 'bg-green-100 text-green-600 border-green-200',
  growing: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  treatment: 'bg-blue-100 text-blue-600 border-blue-200',
  harvest: 'bg-amber-100 text-amber-600 border-amber-200',
  processing: 'bg-purple-100 text-purple-600 border-purple-200',
  packaging: 'bg-indigo-100 text-indigo-600 border-indigo-200',
  storage: 'bg-slate-100 text-slate-600 border-slate-200',
  transport: 'bg-cyan-100 text-cyan-600 border-cyan-200',
  delivery: 'bg-orange-100 text-orange-600 border-orange-200',
};

const stepLabels: Record<TraceabilityStepType, string> = {
  planting: 'Semis',
  growing: 'Croissance',
  treatment: 'Traitement',
  harvest: 'Récolte',
  processing: 'Transformation',
  packaging: 'Conditionnement',
  storage: 'Stockage',
  transport: 'Transport',
  delivery: 'Livraison',
};

export default function BuyerTraceabilityPage() {
  const { traceability, journey, certificates, qualityTests, isLoading } = useTraceability();
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Traçabilité Complète</h1>
          <p className="text-slate-600">De la graine à l'assiette</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            Scanner QR
          </button>
          <button className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Blockchain Hash */}
      {traceability?.blockchainHash && (
        <div className="bg-slate-900 text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Identifiant Blockchain</p>
              <p className="font-mono text-sm break-all">{traceability.blockchainHash}</p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Vérifié</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-amber-500" />
            Parcours du produit
          </h2>

          <div className="space-y-4">
            {journey.map((step, index) => {
              const Icon = stepIcons[step.type];
              const colorClass = stepColors[step.type];
              const isExpanded = expandedStep === step.id;
              const isLast = index === journey.length - 1;

              return (
                <div key={step.id} className="relative">
                  {/* Connector Line */}
                  {!isLast && <div className="absolute left-7 top-14 w-0.5 h-full bg-slate-200" />}

                  <div
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    className="flex gap-4 cursor-pointer group"
                  >
                    {/* Icon */}
                    <div
                      className={`relative z-10 w-14 h-14 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${colorClass}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="bg-slate-50 rounded-xl p-4 group-hover:bg-slate-100 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">
                                {stepLabels[step.type]}
                              </span>
                              {step.verified && (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(step.timestamp)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {step.location}
                          </span>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase">Acteur</p>
                              <p className="text-slate-900">{step.actor}</p>
                            </div>
                            {step.documents && step.documents.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase mb-2">
                                  Documents
                                </p>
                                <div className="flex gap-2">
                                  {step.documents.map((doc, i) => (
                                    <a
                                      key={i}
                                      href="#"
                                      className="flex items-center gap-1 text-sm text-amber-600 hover:underline"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      {doc}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase">
                                Coordonnées GPS
                              </p>
                              <p className="text-sm text-slate-600 font-mono">
                                {step.coordinates[0].toFixed(4)}, {step.coordinates[1].toFixed(4)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Certificates */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              Certifications
            </h2>
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-slate-900">{cert.name}</p>
                      <p className="text-xs text-slate-500">{cert.issuer}</p>
                    </div>
                  </div>
                  {cert.verified && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                </div>
              ))}
            </div>
          </div>

          {/* Quality Tests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Tests Qualité</h2>
            <div className="space-y-3">
              {qualityTests.map((test) => (
                <div key={test.id} className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{test.type}</span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-lg ${
                        test.result === 'pass'
                          ? 'bg-emerald-100 text-emerald-700'
                          : test.result === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {test.result === 'pass'
                        ? 'Conforme'
                        : test.result === 'warning'
                        ? 'Attention'
                        : 'Non-conforme'}
                    </span>
                  </div>
                  {test.value !== undefined && (
                    <p className="text-sm text-slate-600">
                      Valeur:{' '}
                      <span className="font-mono">
                        {test.value} {test.unit}
                      </span>
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {test.testedBy} - {formatDate(test.testedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
