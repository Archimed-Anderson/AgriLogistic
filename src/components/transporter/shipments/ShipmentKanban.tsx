/**
 * Shipment Kanban Component
 * Kanban board for managing shipments across different statuses
 */
import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Package, MapPin, Clock, User, Phone, FileText, Camera, Star } from 'lucide-react';
import type { Shipment, ShipmentStatus } from '@/types/transporter';

const ItemType = 'SHIPMENT';

interface DraggableShipmentCardProps {
  shipment: Shipment;
  onCardClick: (shipment: Shipment) => void;
}

function DraggableShipmentCard({ shipment, onCardClick }: DraggableShipmentCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: shipment.id, status: shipment.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getStatusColor = () => {
    switch (shipment.status) {
      case 'pending':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50';
      case 'in_transit':
        return 'border-l-4 border-l-blue-500 bg-blue-50';
      case 'delivered':
        return 'border-l-4 border-l-green-500 bg-green-50';
      case 'problem':
        return 'border-l-4 border-l-red-500 bg-red-50';
      default:
        return 'border-l-4 border-l-gray-500';
    }
  };

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onCardClick(shipment)}
      className={`bg-white rounded-lg border border-gray-200 p-4 ${getStatusColor()} hover:shadow-md transition-all cursor-move`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">#{shipment.orderId}</span>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded ${
          shipment.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
          shipment.paymentStatus === 'overdue' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {shipment.paymentStatus === 'paid' ? '✓ Payé' :
           shipment.paymentStatus === 'overdue' ? '⚠ Impayé' :
           '⏳ En attente'}
        </span>
      </div>

      {/* Cargo */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-900 mb-1">{shipment.cargo.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span>{shipment.cargo.weight} kg</span>
          <span>•</span>
          <span>{shipment.cargo.quantity} {shipment.cargo.unit}</span>
          {shipment.cargo.requiresRefrigeration && (
            <>
              <span>•</span>
              <span className="text-blue-600">❄️ Réfrigéré</span>
            </>
          )}
        </div>
      </div>

      {/* Route */}
      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
            P
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600">Pickup</p>
            <p className="text-sm text-gray-900 truncate">{shipment.pickupAddress}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
            D
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600">Delivery</p>
            <p className="text-sm text-gray-900 truncate">{shipment.deliveryAddress}</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
        <User className="w-3 h-3" />
        <span>{shipment.deliveryContact.name}</span>
        <Phone className="w-3 h-3 ml-2" />
        <span>{shipment.deliveryContact.phone}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-sm font-semibold text-gray-900">
          {shipment.price.toLocaleString()} {shipment.currency}
        </span>
        <div className="flex items-center gap-2">
          {shipment.documents.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <FileText className="w-3 h-3" />
              <span>{shipment.documents.length}</span>
            </div>
          )}
          {shipment.proofOfDelivery && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Camera className="w-3 h-3" />
              <span>✓</span>
            </div>
          )}
          {shipment.rating && (
            <div className="flex items-center gap-1 text-xs text-yellow-600">
              <Star className="w-3 h-3 fill-current" />
              <span>{shipment.rating.transporterRating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  status: ShipmentStatus;
  shipments: Shipment[];
  count: number;
  color: string;
  onDrop: (shipmentId: string, newStatus: ShipmentStatus) => void;
  onCardClick: (shipment: Shipment) => void;
}

function KanbanColumn({ title, status, shipments, count, color, onDrop, onCardClick }: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item: { id: string; status: ShipmentStatus }) => {
      if (item.status !== status) {
        onDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className="flex-1 min-w-[300px]">
      <div className={`bg-white rounded-xl border-2 ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} transition-all`}>
        {/* Column Header */}
        <div className={`p-4 border-b-4 ${color}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
              {count}
            </span>
          </div>
        </div>

        {/* Cards */}
        <div ref={drop} className="p-4 space-y-3 min-h-[600px] max-h-[calc(100vh-300px)] overflow-y-auto">
          {shipments.map((shipment) => (
            <DraggableShipmentCard
              key={shipment.id}
              shipment={shipment}
              onCardClick={onCardClick}
            />
          ))}
          {shipments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Package className="w-12 h-12 mb-2" />
              <p className="text-sm">Aucune livraison</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ShipmentKanbanProps {
  shipments: Shipment[];
  onStatusChange: (shipmentId: string, newStatus: ShipmentStatus) => void;
  onShipmentClick: (shipment: Shipment) => void;
}

export function ShipmentKanban({ shipments, onStatusChange, onShipmentClick }: ShipmentKanbanProps) {
  const columns = [
    {
      title: 'À prendre',
      status: 'pending' as ShipmentStatus,
      color: 'border-yellow-500',
      shipments: shipments.filter((s) => s.status === 'pending'),
    },
    {
      title: 'En route',
      status: 'in_transit' as ShipmentStatus,
      color: 'border-blue-500',
      shipments: shipments.filter((s) => s.status === 'in_transit'),
    },
    {
      title: 'Livré',
      status: 'delivered' as ShipmentStatus,
      color: 'border-green-500',
      shipments: shipments.filter((s) => s.status === 'delivered'),
    },
    {
      title: 'Problème',
      status: 'problem' as ShipmentStatus,
      color: 'border-red-500',
      shipments: shipments.filter((s) => s.status === 'problem'),
    },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            shipments={column.shipments}
            count={column.shipments.length}
            color={column.color}
            onDrop={onStatusChange}
            onCardClick={onShipmentClick}
          />
        ))}
      </div>
    </DndProvider>
  );
}
