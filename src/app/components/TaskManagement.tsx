import { ClipboardList, Plus, Search, Filter, MoreHorizontal, User, UserCheck, Calendar, CheckSquare, Clock } from 'lucide-react';

const tasks = [
  { 
    id: 1, 
    title: 'Fertilisation Maïs (Parcelle Nord)', 
    assignee: 'Jean Dupont', 
    dueDate: '20 Jan 2024', 
    priority: 'high',
    status: 'pending',
    type: 'fieldwork',
    description: 'Application engrais NPK 15-15-15 sur la totalité de la parcelle.'
  },
  { 
    id: 2, 
    title: 'Révision Tracteur JD-6250R', 
    assignee: 'Pierre Martin', 
    dueDate: '22 Jan 2024', 
    priority: 'medium',
    status: 'in-progress',
    type: 'maintenance',
    description: 'Maintenance 500h : vidange moteur et remplacement filtres.'
  },
  { 
    id: 3, 
    title: 'Inspection Irrigation (Zone Sud)', 
    assignee: 'Sophie Dubois', 
    dueDate: '19 Jan 2024', 
    priority: 'high',
    status: 'completed',
    type: 'monitoring',
    description: 'Vérification des fuites et de la pression sur le secteur Sud.'
  },
  { 
    id: 4, 
    title: 'Inventaire Semences', 
    assignee: 'Lucas Bernard', 
    dueDate: '25 Jan 2024', 
    priority: 'low',
    status: 'pending',
    type: 'inventory',
    description: 'Comptage stocks blé et orge avant commande saisonnière.'
  },
];

const teamMembers = [
  { id: 1, name: 'Jean Dupont', role: 'Chef de culture', avatar: 'JD', status: 'active' },
  { id: 2, name: 'Pierre Martin', role: 'Mécanicien', avatar: 'PM', status: 'busy' },
  { id: 3, name: 'Sophie Dubois', role: 'Responsable Irrigation', avatar: 'SD', status: 'active' },
];

export function TaskManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Tâches</h1>
          <p className="text-sm text-gray-500">Planifiez et suivez les activités de votre équipe</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0B7A4B] rounded-lg hover:bg-[#096340]">
          <Plus className="w-4 h-4" />
          Nouvelle Tâche
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Task List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une tâche..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A4B]/20"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              <Filter className="w-4 h-4" />
              Toutes les tâches
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              <User className="w-4 h-4" />
              Mes tâches
            </button>
          </div>

          {/* Kanban Board / List */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <button className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'
                    }`}>
                      {task.status === 'completed' && <CheckSquare className="w-3 h-3 text-white" />}
                    </button>
                    <div>
                      <h3 className={`font-medium text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {task.dueDate}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <UserCheck className="w-3.5 h-3.5" />
                          {task.assignee}
                        </div>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Moyenne' : 'Faible'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets - Team & Summary */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Équipe (3)</h3>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm">
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        member.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-[#0B7A4B] font-medium bg-green-50 rounded-lg hover:bg-green-100">
              Gérer l'équipe
            </button>
          </div>

          {/* Productivity Stats */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Productivité</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Tâches complétées</span>
                  <span className="font-medium text-gray-900">75%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-500">En cours</p>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">28</p>
                  <p className="text-xs text-gray-500">Terminées</p>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">4</p>
                  <p className="text-xs text-gray-500">Retard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
