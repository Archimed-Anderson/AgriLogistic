import { Droplets, Thermometer, Gauge, TrendingUp, AlertCircle, Plus, MoreHorizontal, Zap } from 'lucide-react';

// Mock soil data
const soilZones = [
  { id: 1, name: 'Zone Nord', moisture: 72, ph: 6.8, nitrogen: 45, status: 'optimal', lastUpdate: 'il y a 5 min' },
  { id: 2, name: 'Zone Sud', moisture: 45, ph: 7.2, nitrogen: 32, status: 'warning', lastUpdate: 'il y a 10 min' },
  { id: 3, name: 'Zone Est', moisture: 68, ph: 6.5, nitrogen: 52, status: 'optimal', lastUpdate: 'il y a 3 min' },
  { id: 4, name: 'Zone Ouest', moisture: 35, ph: 7.8, nitrogen: 28, status: 'critical', lastUpdate: 'il y a 8 min' },
];

const irrigationSchedule = [
  { zone: 'Zone Nord', time: '06:00', duration: '30 min', status: 'completed' },
  { zone: 'Zone Sud', time: '14:00', duration: '45 min', status: 'scheduled' },
  { zone: 'Zone Ouest', time: '18:00', duration: '60 min', status: 'scheduled' },
];

export function SoilWaterManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sol & Irrigation</h1>
          <p className="text-sm text-gray-500">Surveillance et gestion de l'eau de vos parcelles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0B7A4B] rounded-lg hover:bg-[#096340]">
          <Plus className="w-4 h-4" />
          Ajouter une zone
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">55%</p>
              <p className="text-sm text-gray-500">Humidité moyenne</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">6.9</p>
              <p className="text-sm text-gray-500">pH moyen</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">39%</p>
              <p className="text-sm text-gray-500">Azote moyen</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2 450 L</p>
              <p className="text-sm text-gray-500">Eau utilisée (mois)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Soil Zones */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Zones de culture</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {soilZones.map((zone) => (
              <div key={zone.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      zone.status === 'optimal' ? 'bg-green-500' :
                      zone.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {/* Moisture */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Droplets className="w-4 h-4" /> Humidité
                      </span>
                      <span className={`font-medium ${
                        zone.moisture >= 60 ? 'text-green-600' :
                        zone.moisture >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{zone.moisture}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          zone.moisture >= 60 ? 'bg-green-500' :
                          zone.moisture >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${zone.moisture}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* pH and Nitrogen */}
                  <div className="flex justify-between pt-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">pH</p>
                      <p className="font-semibold text-gray-900">{zone.ph}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Azote</p>
                      <p className="font-semibold text-gray-900">{zone.nitrogen}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Temp</p>
                      <p className="font-semibold text-gray-900">22°C</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mt-3">{zone.lastUpdate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Irrigation Schedule */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Programme d'irrigation</h2>
            <button className="text-sm text-[#0B7A4B] font-medium hover:underline">Modifier</button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {irrigationSchedule.map((schedule, index) => (
              <div key={index} className={`p-4 ${index !== irrigationSchedule.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{schedule.zone}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    schedule.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {schedule.status === 'completed' ? 'Terminé' : 'Programmé'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{schedule.time}</span>
                  <span>•</span>
                  <span>{schedule.duration}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Alert */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Attention requise</p>
                <p className="text-sm text-yellow-700 mt-1">
                  La Zone Ouest nécessite une irrigation urgente. Niveau d'humidité critique détecté.
                </p>
                <button className="mt-2 text-sm font-medium text-yellow-800 hover:underline">
                  Déclencher l'irrigation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
