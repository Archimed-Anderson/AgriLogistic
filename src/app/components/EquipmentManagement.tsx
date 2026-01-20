import { Wrench, Plus, Search, Filter, MoreHorizontal, AlertTriangle, CheckCircle, Clock, Fuel, Calendar } from 'lucide-react';

// Mock equipment data
const equipment = [
  { 
    id: 1, 
    name: 'Tracteur John Deere 6250R', 
    type: 'Tracteur',
    status: 'operational',
    lastMaintenance: '15/01/2024',
    nextMaintenance: '15/04/2024',
    hoursUsed: 1250,
    fuelLevel: 75,
    location: 'Hangar A'
  },
  { 
    id: 2, 
    name: 'Moissonneuse New Holland CR9.90', 
    type: 'Moissonneuse',
    status: 'maintenance',
    lastMaintenance: '01/12/2023',
    nextMaintenance: 'En cours',
    hoursUsed: 890,
    fuelLevel: 30,
    location: 'Atelier'
  },
  { 
    id: 3, 
    name: 'Pulvérisateur Amazone UX 5201', 
    type: 'Pulvérisateur',
    status: 'operational',
    lastMaintenance: '20/02/2024',
    nextMaintenance: '20/05/2024',
    hoursUsed: 450,
    fuelLevel: 90,
    location: 'Zone Nord'
  },
  { 
    id: 4, 
    name: 'Semoir Väderstad Rapid A600S', 
    type: 'Semoir',
    status: 'idle',
    lastMaintenance: '10/11/2023',
    nextMaintenance: '10/02/2024',
    hoursUsed: 680,
    fuelLevel: 45,
    location: 'Hangar B'
  },
];

const maintenanceAlerts = [
  { equipment: 'Semoir Väderstad', message: 'Maintenance préventive en retard', priority: 'high' },
  { equipment: 'Tracteur John Deere', message: 'Vidange à effectuer dans 50h', priority: 'medium' },
];

export function EquipmentManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Équipements</h1>
          <p className="text-sm text-gray-500">Suivi et maintenance de votre parc machines</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0B7A4B] rounded-lg hover:bg-[#096340]">
          <Plus className="w-4 h-4" />
          Ajouter un équipement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-500">Opérationnels</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-sm text-gray-500">En maintenance</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-sm text-gray-500">Inactifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-500">Maintenances prévues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Alerts */}
      {maintenanceAlerts.length > 0 && (
        <div className="space-y-2">
          {maintenanceAlerts.map((alert, index) => (
            <div key={index} className={`flex items-center gap-3 p-4 rounded-xl ${
              alert.priority === 'high' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${
                alert.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
              }`} />
              <div className="flex-1">
                <span className={`font-medium ${
                  alert.priority === 'high' ? 'text-red-800' : 'text-yellow-800'
                }`}>{alert.equipment}: </span>
                <span className={alert.priority === 'high' ? 'text-red-700' : 'text-yellow-700'}>
                  {alert.message}
                </span>
              </div>
              <button className={`text-sm font-medium ${
                alert.priority === 'high' ? 'text-red-700 hover:text-red-800' : 'text-yellow-700 hover:text-yellow-800'
              }`}>
                Planifier
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un équipement..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A4B]/20"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Filtrer
        </button>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {equipment.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  item.status === 'operational' ? 'bg-green-100' :
                  item.status === 'maintenance' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <Wrench className={`w-6 h-6 ${
                    item.status === 'operational' ? 'text-green-600' :
                    item.status === 'maintenance' ? 'text-yellow-600' : 'text-gray-500'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.status === 'operational' ? 'bg-green-100 text-green-700' :
                  item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.status === 'operational' ? 'Opérationnel' :
                   item.status === 'maintenance' ? 'En maintenance' : 'Inactif'}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Heures d'utilisation</p>
                <p className="font-semibold text-gray-900">{item.hoursUsed}h</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Localisation</p>
                <p className="font-semibold text-gray-900">{item.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Prochaine maintenance</p>
                <p className="font-semibold text-gray-900">{item.nextMaintenance}</p>
              </div>
            </div>
            
            {/* Fuel Level */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 flex items-center gap-1">
                  <Fuel className="w-4 h-4" /> Niveau carburant
                </span>
                <span className={`font-medium ${
                  item.fuelLevel >= 50 ? 'text-green-600' :
                  item.fuelLevel >= 25 ? 'text-yellow-600' : 'text-red-600'
                }`}>{item.fuelLevel}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    item.fuelLevel >= 50 ? 'bg-green-500' :
                    item.fuelLevel >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${item.fuelLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
