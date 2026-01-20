import { Sprout, Plus, Search, Filter, MoreHorizontal, Leaf, Calendar, Droplets } from 'lucide-react';

const crops = [
  { 
    id: 1, 
    name: 'Maïs Grain', 
    variety: 'Pioneer P0937', 
    area: '45 ha', 
    plantingDate: '15/04/2023',
    harvestDate: '15/10/2023',
    status: 'transplanting', // growing, ready, harvested
    yield: '12.5 t/ha',
    health: 'good',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 2, 
    name: 'Blé Tendre', 
    variety: 'Chevignon', 
    area: '32 ha', 
    plantingDate: '20/10/2023', 
    harvestDate: '15/07/2024',
    status: 'growing',
    yield: '--',
    health: 'excellent',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 3, 
    name: 'Colza', 
    variety: 'DK Expansion', 
    area: '18 ha', 
    plantingDate: '25/08/2023', 
    harvestDate: '01/07/2024',
    status: 'growing',
    yield: '--',
    health: 'average',
    image: 'https://images.unsplash.com/photo-1516246843873-9d12356b6fab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
];

export function CropManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Cultures</h1>
          <p className="text-sm text-gray-500">Suivi parcellaire et itinéraires techniques</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0B7A4B] rounded-lg hover:bg-[#096340]">
          <Plus className="w-4 h-4" />
          Nouvelle Culture
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">95 ha</p>
              <p className="text-sm text-gray-500">Surface cultivée</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">Cultures actives</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">14 j</p>
              <p className="text-sm text-gray-500">Prochaine récolte</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une culture, une parcelle..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A4B]/20"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Filtrer
        </button>
      </div>

      {/* Crops List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Culture</th>
              <th className="px-6 py-3 font-medium">Variété</th>
              <th className="px-6 py-3 font-medium">Surface</th>
              <th className="px-6 py-3 font-medium">Semis</th>
              <th className="px-6 py-3 font-medium">Récolte (prévue)</th>
              <th className="px-6 py-3 font-medium">Santé</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {crops.map((crop) => (
              <tr key={crop.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={crop.image} alt={crop.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-gray-900">{crop.name}</p>
                      <p className="text-xs text-gray-500">Parcelle Nord</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{crop.variety}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{crop.area}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{crop.plantingDate}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{crop.harvestDate}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    crop.health === 'excellent' ? 'bg-green-100 text-green-700' :
                    crop.health === 'good' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      crop.health === 'excellent' ? 'bg-green-500' :
                      crop.health === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></span>
                    {crop.health === 'excellent' ? 'Excellente' :
                     crop.health === 'good' ? 'Bonne' : 'Moyenne'}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      En cours
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
