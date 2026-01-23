/**
 * Maintenance Scheduler Component
 * Displays upcoming maintenance tasks
 */
import React from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import type { MaintenanceSchedule } from '@/types/transporter';

interface MaintenanceSchedulerProps {
  tasks: (MaintenanceSchedule & { vehicleName: string })[];
}

export function MaintenanceScheduler({ tasks }: MaintenanceSchedulerProps) {
  const getStatusIcon = (status: MaintenanceSchedule['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Maintenance à venir</h2>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
          Voir tout
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {sortedTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune maintenance prévue</p>
          </div>
        ) : (
          sortedTasks.slice(0, 5).map((task) => (
            <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                {getStatusIcon(task.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{task.description}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    task.status === 'overdue' ? 'bg-red-100 text-red-700' :
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {task.status === 'overdue' ? 'En retard' :
                     task.status === 'completed' ? 'Terminé' :
                     'Prévu'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{task.vehicleName}</span>
                  <span>{new Date(task.scheduledDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
