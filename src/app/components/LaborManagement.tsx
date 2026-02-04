import { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Brain,
  Wifi,
  Sun,
  CloudRain,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Zap,
  Activity,
  Target,
  Award,
  BarChart3,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

// Types
interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'break' | 'offline';
  location: string;
  currentTask: string;
  performance: number;
  hoursToday: number;
  avatar: string;
  phone: string;
  iotDevice?: string;
}

interface Team {
  id: string;
  name: string;
  members: number;
  activeNow: number;
  productivity: number;
  currentZone: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'critical';
  message: string;
  time: string;
}

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  assignedCount: number;
  zone: string;
}

// Mock Data
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Marie Dupont',
    role: "Chef d'équipe",
    status: 'active',
    location: 'Parcelle A3',
    currentTask: 'Récolte tomates',
    performance: 94,
    hoursToday: 6.5,
    avatar: '👩‍🌾',
    phone: '+33 6 12 34 56 78',
    iotDevice: 'IOT-001',
  },
  {
    id: '2',
    name: 'Jean-Pierre Martin',
    role: 'Ouvrier agricole',
    status: 'active',
    location: 'Parcelle B1',
    currentTask: 'Irrigation',
    performance: 88,
    hoursToday: 7.2,
    avatar: '👨‍🌾',
    phone: '+33 6 23 45 67 89',
    iotDevice: 'IOT-002',
  },
  {
    id: '3',
    name: 'Sophie Bernard',
    role: 'Technicienne',
    status: 'break',
    location: 'Entrepôt',
    currentTask: 'Pause déjeuner',
    performance: 92,
    hoursToday: 4.0,
    avatar: '👩',
    phone: '+33 6 34 56 78 90',
  },
  {
    id: '4',
    name: 'Thomas Petit',
    role: 'Conducteur',
    status: 'active',
    location: 'Route D47',
    currentTask: 'Transport récolte',
    performance: 96,
    hoursToday: 5.8,
    avatar: '👨',
    phone: '+33 6 45 67 89 01',
    iotDevice: 'IOT-003',
  },
  {
    id: '5',
    name: 'Emma Leroy',
    role: 'Ouvrier agricole',
    status: 'offline',
    location: 'N/A',
    currentTask: 'Hors service',
    performance: 85,
    hoursToday: 0,
    avatar: '👩',
    phone: '+33 6 56 78 90 12',
  },
];

const TEAMS: Team[] = [
  {
    id: '1',
    name: 'Équipe Récolte',
    members: 8,
    activeNow: 6,
    productivity: 92,
    currentZone: 'Parcelles A-C',
  },
  {
    id: '2',
    name: 'Équipe Logistique',
    members: 5,
    activeNow: 4,
    productivity: 88,
    currentZone: 'Entrepôt + Routes',
  },
  {
    id: '3',
    name: 'Équipe Maintenance',
    members: 3,
    activeNow: 2,
    productivity: 95,
    currentZone: 'Atelier',
  },
];

const ALERTS: Alert[] = [
  {
    id: '1',
    type: 'warning',
    message: 'Prévision de pénurie: 2 ouvriers manquants demain matin',
    time: 'Il y a 15 min',
  },
  {
    id: '2',
    type: 'info',
    message: "Nouvelle rotation recommandée par l'IA pour optimiser la récolte",
    time: 'Il y a 1h',
  },
  {
    id: '3',
    type: 'critical',
    message: 'Alerte météo: pluie prévue à 14h - adapter les plannings',
    time: 'Il y a 30 min',
  },
];

const SHIFTS: Shift[] = [
  {
    id: '1',
    name: 'Matin',
    startTime: '06:00',
    endTime: '14:00',
    assignedCount: 12,
    zone: 'Toutes parcelles',
  },
  {
    id: '2',
    name: 'Après-midi',
    startTime: '14:00',
    endTime: '22:00',
    assignedCount: 8,
    zone: 'Parcelles A-D',
  },
  {
    id: '3',
    name: 'Nuit',
    startTime: '22:00',
    endTime: '06:00',
    assignedCount: 2,
    zone: 'Surveillance',
  },
];

const AI_PREDICTIONS = [
  { label: 'Besoin estimé demain', value: '18 personnes', trend: '+2', icon: Users },
  { label: 'Productivité prévue', value: '94%', trend: '+3%', icon: TrendingUp },
  { label: 'Risque de surcharge', value: 'Faible', trend: null, icon: AlertTriangle },
  { label: 'Efficacité IoT', value: '98%', trend: '+1%', icon: Wifi },
];

export function LaborManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'schedule' | 'analytics'>(
    'overview'
  );
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return TEAM_MEMBERS;
    return TEAM_MEMBERS.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const activeCount = TEAM_MEMBERS.filter((m) => m.status === 'active').length;
  const totalHours = TEAM_MEMBERS.reduce((sum, m) => sum + m.hoursToday, 0);
  const avgPerformance = Math.round(
    TEAM_MEMBERS.reduce((sum, m) => sum + m.performance, 0) / TEAM_MEMBERS.length
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500';
      case 'break':
        return 'bg-amber-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'break':
        return 'Pause';
      case 'offline':
        return 'Hors ligne';
      default:
        return status;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Brain className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion Main-d'œuvre</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Suivi en temps réel • Plannings • Analytics IA
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
          <Button className="bg-gradient-to-r from-[#0B7A4B] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white gap-2">
            <UserPlus className="h-4 w-4" />
            Ajouter employé
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        {[
          { id: 'overview', label: "Vue d'ensemble", icon: Activity },
          { id: 'teams', label: 'Équipes', icon: Users },
          { id: 'schedule', label: 'Plannings', icon: Calendar },
          { id: 'analytics', label: 'Analytics IA', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-[#0B7A4B] shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="rounded-2xl p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 dark:bg-emerald-800">
              <Users className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Employés actifs</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeCount}
                <span className="text-sm font-normal text-gray-500">/{TEAM_MEMBERS.length}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-4 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border-sky-100 dark:border-sky-800">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-sky-100 dark:bg-sky-800">
              <Clock className="h-6 w-6 text-sky-700 dark:text-sky-300" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Heures aujourd'hui</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalHours.toFixed(1)}h
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 dark:bg-amber-800">
              <Target className="h-6 w-6 text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Performance moy.</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgPerformance}%
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-100 dark:bg-purple-800">
              <Wifi className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Appareils IoT</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {TEAM_MEMBERS.filter((m) => m.iotDevice).length}
                <span className="text-sm font-normal text-gray-500"> connectés</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - Team Members */}
        <div className="lg:col-span-2 space-y-4">
          {/* Real-time Tracking */}
          <Card className="rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#0B7A4B]" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Suivi temps réel</h2>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7A4B]/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B7A4B] to-[#059669] flex items-center justify-center text-2xl">
                      {member.avatar}
                    </div>
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                        member.status
                      )} rounded-full border-2 border-white dark:border-gray-900`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {member.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {member.role}
                      </span>
                      {member.iotDevice && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded">
                          <Wifi className="h-3 w-3" />
                          {member.iotDevice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {member.location}
                      </span>
                      <span>•</span>
                      <span>{member.currentTask}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.performance}%
                      </div>
                      <div className="text-xs text-gray-500">Performance</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.hoursToday}h
                      </div>
                      <div className="text-xs text-gray-500">Aujourd'hui</div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-lg ${
                        member.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : member.status === 'break'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {getStatusLabel(member.status)}
                    </span>
                  </div>

                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Shifts Schedule */}
          <Card className="rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#0B7A4B]" />
                <h2 className="font-semibold text-gray-900 dark:text-white">Rotations du jour</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-[#0B7A4B]">
                Voir tout
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SHIFTS.map((shift) => (
                <div
                  key={shift.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#0B7A4B]/50 dark:hover:border-[#0B7A4B]/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{shift.name}</span>
                    <span className="text-sm text-gray-500">
                      {shift.startTime} - {shift.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{shift.assignedCount} assignés</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{shift.zone}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar - Alerts & AI */}
        <div className="space-y-4">
          {/* Weather Integration */}
          <Card className="rounded-2xl p-4 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20">
            <div className="flex items-center gap-3 mb-3">
              <Sun className="h-8 w-8 text-amber-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">24°C</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ensoleillé</div>
              </div>
              <div className="ml-auto text-right">
                <div className="flex items-center gap-1 text-amber-600">
                  <CloudRain className="h-4 w-4" />
                  <span className="text-sm">14h00</span>
                </div>
                <div className="text-xs text-gray-500">Pluie prévue</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 Conseil IA: Prioriser les récoltes avant 14h00
            </p>
          </Card>

          {/* AI Predictions */}
          <Card className="rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-purple-600" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Prédictions IA</h2>
              <span className="ml-auto px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
                <Zap className="h-3 w-3 inline mr-1" />
                Smart
              </span>
            </div>

            <div className="space-y-3">
              {AI_PREDICTIONS.map((pred, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <pred.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{pred.label}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{pred.value}</div>
                  </div>
                  {pred.trend && (
                    <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                      <TrendingUp className="h-4 w-4" />
                      {pred.trend}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Smart Alerts */}
          <Card className="rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Alertes intelligentes</h2>
              <span className="ml-auto px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                {ALERTS.length}
              </span>
            </div>

            <div className="space-y-3">
              {ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border ${
                    alert.type === 'critical'
                      ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800'
                      : alert.type === 'warning'
                      ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800'
                      : 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{alert.message}</p>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Teams Overview */}
          <Card className="rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-[#0B7A4B]" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Équipes</h2>
            </div>

            <div className="space-y-3">
              {TEAMS.map((team) => (
                <div
                  key={team.id}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => setSelectedTeam(team.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{team.name}</span>
                    <span className="text-emerald-600 font-medium">{team.productivity}%</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {team.activeNow}/{team.members} actifs
                    </span>
                    <span>•</span>
                    <span>{team.currentZone}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0B7A4B] to-[#059669] rounded-full transition-all"
                      style={{ width: `${team.productivity}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
