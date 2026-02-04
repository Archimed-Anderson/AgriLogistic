/**
 * Stops Manager Component
 * Drag & drop list for managing and reordering waypoints (using react-dnd)
 */
import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GripVertical, MapPin, Package, Clock, Trash2, Edit2 } from 'lucide-react';
import type { Waypoint } from '@/types/transporter';

const ItemType = 'WAYPOINT';

interface DraggableWaypointProps {
  waypoint: Waypoint;
  index: number;
  moveWaypoint: (dragIndex: number, hoverIndex: number) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function DraggableWaypoint({
  waypoint,
  index,
  moveWaypoint,
  onEdit,
  onDelete,
}: DraggableWaypointProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveWaypoint(item.index, index);
        item.index = index;
      }
    },
  });

  const getTypeIcon = () => {
    switch (waypoint.type) {
      case 'pickup':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'delivery':
        return <MapPin className="w-5 h-5 text-blue-600" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (waypoint.type) {
      case 'pickup':
        return 'Pickup';
      case 'delivery':
        return 'Delivery';
      default:
        return 'Waypoint';
    }
  };

  const getPriorityColor = () => {
    switch (waypoint.priority) {
      case 'urgent':
        return 'border-l-4 border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-4 border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-4 border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-4 border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  return (
    <div
      ref={(node) => preview(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`bg-white rounded-lg border border-gray-200 p-4 ${getPriorityColor()} hover:shadow-md transition-shadow cursor-move`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          ref={drag}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Order Number */}
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
          {index + 1}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              {getTypeIcon()}
              <span className="font-semibold text-gray-900">{getTypeLabel()}</span>
              {waypoint.priority === 'urgent' && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                  🔥 Urgent
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-2">{waypoint.address}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
            {waypoint.timeWindow && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(waypoint.timeWindow.start).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(waypoint.timeWindow.end).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{waypoint.duration} min</span>
            </div>
            {waypoint.contactName && (
              <div className="flex items-center gap-1">
                <span>👤 {waypoint.contactName}</span>
              </div>
            )}
          </div>

          {waypoint.notes && <p className="text-xs text-gray-500 mt-2 italic">{waypoint.notes}</p>}
        </div>
      </div>
    </div>
  );
}

interface StopsManagerProps {
  waypoints: Waypoint[];
  onWaypointsChange: (waypoints: Waypoint[]) => void;
  onEditWaypoint?: (waypoint: Waypoint) => void;
  onDeleteWaypoint?: (waypointId: string) => void;
}

export function StopsManager({
  waypoints,
  onWaypointsChange,
  onEditWaypoint,
  onDeleteWaypoint,
}: StopsManagerProps) {
  const moveWaypoint = (dragIndex: number, hoverIndex: number) => {
    const draggedWaypoint = waypoints[dragIndex];
    const newWaypoints = [...waypoints];
    newWaypoints.splice(dragIndex, 1);
    newWaypoints.splice(hoverIndex, 0, draggedWaypoint);
    onWaypointsChange(newWaypoints);
  };

  if (waypoints.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun point d'arrêt</h3>
        <p className="text-gray-600">
          Ajoutez des points de pickup et delivery pour créer votre route
        </p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Points d'arrêt</h2>
            <p className="text-sm text-gray-600 mt-1">
              {waypoints.length} point{waypoints.length > 1 ? 's' : ''} • Glissez pour réorganiser
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {waypoints.map((waypoint, index) => (
            <DraggableWaypoint
              key={waypoint.id}
              waypoint={waypoint}
              index={index}
              moveWaypoint={moveWaypoint}
              onEdit={onEditWaypoint ? () => onEditWaypoint(waypoint) : undefined}
              onDelete={onDeleteWaypoint ? () => onDeleteWaypoint(waypoint.id) : undefined}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
