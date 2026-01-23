/**
 * Smart Calendar Component
 * Displays agricultural tasks with priority and status
 */
'use client';

import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import type { AgriTask } from '@/types/farmer/dashboard';

interface SmartCalendarProps {
  tasks: AgriTask[];
  isLoading?: boolean;
}

export function SmartCalendar({ tasks, isLoading }: SmartCalendarProps) {
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  const getTaskIcon = (status: AgriTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Circle className="w-5 h-5 text-blue-600 fill-blue-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: AgriTask['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const getTypeLabel = (type: AgriTask['type']) => {
    const labels = {
      planting: '🌱 Semis',
      harvesting: '🌾 Récolte',
      treatment: '💊 Traitement',
      irrigation: '💧 Irrigation',
      maintenance: '🔧 Maintenance',
    };
    return labels[type];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Calendrier Intelligent</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-lg ${
              filter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tout
          </button>
          <button
            onClick={() => setFilter('today')}
            className={`px-3 py-1 text-sm rounded-lg ${
              filter === 'today'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-3 py-1 text-sm rounded-lg ${
              filter === 'week'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Cette semaine
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Aucune tâche programmée</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md ${getPriorityColor(
                task.priority
              )}`}
            >
              <div className="flex items-start gap-3">
                {getTaskIcon(task.status)}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-white rounded-full border">
                      {getTypeLabel(task.type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{task.estimatedDuration}h</span>
                    </div>
                    {task.priority === 'urgent' && (
                      <span className="text-red-600 font-medium">⚠️ Urgent</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
        + Ajouter une tâche
      </button>
    </div>
  );
}
