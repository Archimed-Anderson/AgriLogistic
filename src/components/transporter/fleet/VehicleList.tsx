/**
 * Vehicle List Component
 * Displays grid or list of vehicles with key indicators
 */
import React from 'react';
import { Truck, AlertTriangle, CheckCircle, Wrench, Fuel, BarChart3, MapPin } from 'lucide-react';
import type { Vehicle } from '@/types/transporter';

interface VehicleListProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicle: Vehicle) => void;
}

export function VehicleList({ vehicles, onVehicleClick }: VehicleListProps) {
  const getStatusBadge = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" /> Disponible
          </span>
        );
      case 'in_use':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            <MapPin className="w-3 h-3" /> En mission
          </span>
        );
      case 'maintenance':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
            <Wrench className="w-3 h-3" /> Maintenance
          </span>
        );
      case 'out_of_service':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <AlertTriangle className="w-3 h-3" /> Hors service
          </span>
        );
    }
  };

  const getVehicleIcon = (type: Vehicle['type']) => {
    // Determine icon based on type (could use different icons)
    return <Truck className="w-6 h-6 text-gray-600" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          onClick={() => onVehicleClick(vehicle)}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                {getVehicleIcon(vehicle.type)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                <p className="text-sm text-gray-500">{vehicle.licensePlate}</p>
              </div>
            </div>
            {getStatusBadge(vehicle.status)}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Fuel className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Niveau Carburant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      (vehicle.iotDevice?.data.fuelLevel || 0) < 20
                        ? 'bg-red-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${vehicle.iotDevice?.data.fuelLevel || 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {vehicle.iotDevice?.data.fuelLevel || 0}%
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Kilométrage</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {vehicle.mileage.toLocaleString()} km
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span>PTAC:</span>
              <span className="font-medium">
                {(vehicle.specifications.maxWeight / 1000).toFixed(1)}t
              </span>
            </div>
            {vehicle.nextMaintenance && (
              <div
                className={`flex items-center gap-1 ${
                  new Date(vehicle.nextMaintenance) < new Date()
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                <Wrench className="w-3 h-3" />
                <span>
                  {new Date(vehicle.nextMaintenance).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add New Vehicle Card */}
      <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all min-h-[250px]">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <Truck className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-900">Ajouter un véhicule</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-[200px]">
          Enregistrez un nouveau véhicule dans votre flotte
        </p>
      </div>
    </div>
  );
}
