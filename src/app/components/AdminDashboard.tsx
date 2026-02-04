import { useState, useEffect } from 'react';
import {
  Search,
  Sun,
  CloudRain,
  Wind,
  Droplet,
  TrendingUp,
  TrendingDown,
  Leaf,
  DollarSign,
  Target,
  Activity,
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  MapPin,
  Calendar,
  Users,
  Truck,
  Settings,
  Edit3,
  Grid,
  Maximize2,
  Plus,
  X,
  GripVertical,
  ChevronRight,
  Zap,
  ThermometerSun,
  Sprout,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Share2,
  Sparkles,
  Battery,
  Signal,
  Tractor,
  Shield,
  Award,
  Clock,
  ArrowRight,
  ChevronDown,
  Play,
  Mic,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const [editMode, setEditMode] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState('morning');
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  const [selectedParcels, setSelectedParcels] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveDataCount, setLiveDataCount] = useState(0);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDataCount((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Main KPIs data
  const globalHealth = {
    score: 92,
    factors: [
      { name: 'Santé cultures', value: 94, weight: 40 },
      { name: 'Finances', value: 88, weight: 30 },
      { name: 'Équipement', value: 95, weight: 20 },
      { name: 'Météo', value: 90, weight: 10 },
    ],
    trend: 2.3,
  };

  const totalYield = {
    current: 1842,
    target: 2000,
    sparkline: [1650, 1720, 1780, 1800, 1820, 1835, 1842],
  };

  const dailyMargin = {
    amount: 2845,
    breakdown: { revenue: 4230, costs: 1385 },
    monthly: 85350,
    trend: 5.2,
  };

  const currentConditions = {
    temp: 24,
    icon: Sun,
    wind: 12,
    humidity: 65,
    et: 4.2,
  };

  // Parcels data
  const parcels = [
    { id: 'P1', name: 'Parcelle Nord', crop: 'Blé', area: 45, ndvi: 0.82, status: 'healthy' },
    { id: 'P2', name: 'Parcelle Sud', crop: 'Maïs', area: 35, ndvi: 0.75, status: 'warning' },
    {
      id: 'P3',
      name: 'Parcelle Est',
      crop: 'Tournesol',
      area: 20,
      ndvi: 0.68,
      status: 'attention',
    },
  ];

  // Alerts data
  const alerts = [
    {
      id: '1',
      type: 'critical',
      title: 'Irrigation urgente requise',
      message: 'Parcelle Est - Stress hydrique détecté',
      time: 'Il y a 15 min',
      action: 'Programmer irrigation',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Maintenance tracteur A',
      message: '85h restantes avant révision',
      time: 'Il y a 2h',
      action: 'Planifier',
    },
    {
      id: '3',
      type: 'info',
      title: 'Fenêtre traitement optimale',
      message: 'Conditions idéales demain 6h-10h',
      time: 'Il y a 3h',
      action: 'Ajouter au calendrier',
    },
  ];

  // AI Recommendations
  const aiRecommendations = [
    {
      id: '1',
      title: 'Optimiser fertilisation Parcelle Nord',
      impact: 'Économie estimée: 340€',
      confidence: 87,
      icon: Sprout,
    },
    {
      id: '2',
      title: 'Anticiper traitement fongicide',
      impact: 'Prévenir perte de 8% rendement',
      confidence: 92,
      icon: Shield,
    },
    {
      id: '3',
      title: 'Ajuster calendrier irrigation',
      impact: 'Réduction consommation eau de 15%',
      confidence: 78,
      icon: Droplet,
    },
  ];

  // Equipment status
  const equipment = [
    {
      id: '1',
      name: 'Tracteur A',
      type: 'tractor',
      status: 'active',
      battery: 85,
      lastUpdate: '2 min',
    },
    {
      id: '2',
      name: 'Tracteur B',
      type: 'tractor',
      status: 'idle',
      battery: 92,
      lastUpdate: '5 min',
    },
    {
      id: '3',
      name: 'Drone C',
      type: 'drone',
      status: 'charging',
      battery: 45,
      lastUpdate: '10 min',
    },
  ];

  // IoT Sensors
  const iotStatus = {
    active: 12,
    lowBattery: 3,
    offline: 2,
    total: 17,
  };

  // Tasks
  const todayTasks = [
    {
      id: '1',
      title: 'Inspection Parcelle Nord',
      priority: 'high',
      completed: false,
      duration: '2h',
    },
    {
      id: '2',
      title: 'Irrigation Parcelle Est',
      priority: 'high',
      completed: true,
      duration: '1h',
    },
    { id: '3', title: 'Maintenance Drone', priority: 'medium', completed: false, duration: '3h' },
    { id: '4', title: 'Analyse sols', priority: 'low', completed: false, duration: '1.5h' },
  ];

  // Phenology stages
  const phenologyStages = [
    { stage: 'Semis', date: '15 Mars', status: 'completed' },
    { stage: 'Levée', date: '28 Mars', status: 'completed' },
    { stage: 'Tallage', date: '12 Avril', status: 'completed' },
    { stage: 'Floraison', date: '25 Mai', status: 'current' },
    { stage: 'Maturation', date: '15 Juillet', status: 'upcoming' },
    { stage: 'Récolte', date: '12 Août', status: 'upcoming' },
  ];

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    toast.info(editMode ? 'Mode édition désactivé' : 'Mode édition activé');
  };

  const handleTogglePresentationMode = () => {
    setPresentationMode(!presentationMode);
  };

  const handleVoiceCommand = () => {
    toast.success("Commande vocale activée - Essayez: 'Montre-moi le rendement'");
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 70) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  if (presentationMode) {
    return (
      <div className="fixed inset-0 bg-background z-50 p-8">
        <button
          onClick={handleTogglePresentationMode}
          className="absolute top-4 right-4 p-2 bg-card border rounded-lg hover:bg-muted transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="h-full grid grid-cols-2 gap-6">
          {/* Will rotate through widgets */}
          <div className="bg-card border rounded-xl p-8 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-4">Mode Présentation</h1>
              <p className="text-2xl text-muted-foreground">Les widgets défilent automatiquement</p>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">🌾</div>
              <p className="text-3xl font-bold">Ferme des Vallons</p>
              <p className="text-xl text-muted-foreground mt-2">142 hectares</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] rounded-lg">
              <Grid className="h-7 w-7 text-white" />
            </div>
            Tableau de Bord
          </h1>
          <p className="text-muted-foreground mt-2">
            Ferme des Vallons •{' '}
            {currentTime.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}{' '}
            • {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleVoiceCommand}
            className="p-2 border rounded-lg hover:bg-muted transition-colors"
            title="Commande vocale"
          >
            <Mic className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {['morning', 'financial', 'production'].map((layout) => (
              <button
                key={layout}
                onClick={() => setSelectedLayout(layout)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedLayout === layout
                    ? 'bg-[#1ABC9C] text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {layout === 'morning' && 'Vue Matin'}
                {layout === 'financial' && 'Vue Financière'}
                {layout === 'production' && 'Vue Production'}
              </button>
            ))}
          </div>
          <button
            onClick={handleToggleEditMode}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              editMode ? 'bg-[#1ABC9C] text-white' : 'border hover:bg-muted'
            }`}
          >
            <Edit3 className="h-4 w-4" />
            {editMode ? 'Terminer' : 'Personnaliser'}
          </button>
          <button
            onClick={handleTogglePresentationMode}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Maximize2 className="h-4 w-4" />
            Présentation
          </button>
        </div>
      </div>

      {editMode && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Mode Édition Activé
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Glissez-déposez les widgets pour les réorganiser. Cliquez sur{' '}
                <Plus className="h-3 w-3 inline" /> pour ajouter de nouveaux widgets.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Global Health Score */}
        <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden">
          {editMode && (
            <div className="absolute top-2 right-2 p-1 bg-muted rounded cursor-move">
              <GripVertical className="h-4 w-4" />
            </div>
          )}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Santé Globale de l'Exploitation</p>
              <div className="flex items-end gap-3">
                <div className={`text-5xl font-bold ${getHealthColor(globalHealth.score)}`}>
                  {globalHealth.score}
                </div>
                <div className="text-2xl text-muted-foreground mb-1">/100</div>
              </div>
            </div>
            <div className={`relative w-20 h-20`}>
              <svg className="transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-muted"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${globalHealth.score}, 100`}
                  className={getHealthColor(globalHealth.score)}
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {globalHealth.trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={globalHealth.trend > 0 ? 'text-green-600' : 'text-red-600'}>
              {Math.abs(globalHealth.trend)}% vs semaine dernière
            </span>
          </div>
          <button
            onClick={() => setExpandedWidget('health')}
            className="mt-3 text-xs text-[#1ABC9C] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            Voir détails
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Total Yield */}
        <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden">
          {editMode && (
            <div className="absolute top-2 right-2 p-1 bg-muted rounded cursor-move">
              <GripVertical className="h-4 w-4" />
            </div>
          )}
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Rendement Estimé Total</p>
          <div className="flex items-end gap-2 mb-3">
            <div className="text-4xl font-bold">{totalYield.current}</div>
            <div className="text-lg text-muted-foreground mb-1">tonnes</div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Objectif: {totalYield.target}t</span>
              <span className="font-medium">
                {Math.round((totalYield.current / totalYield.target) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-600"
                style={{ width: `${(totalYield.current / totalYield.target) * 100}%` }}
              />
            </div>
          </div>
          {/* Sparkline */}
          <svg className="w-full h-8" viewBox="0 0 100 30">
            <polyline
              points={totalYield.sparkline
                .map((v, i) => `${i * 16.67},${30 - (v / 2000) * 30}`)
                .join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[#1ABC9C]"
            />
          </svg>
        </div>

        {/* Daily Margin */}
        <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden">
          {editMode && (
            <div className="absolute top-2 right-2 p-1 bg-muted rounded cursor-move">
              <GripVertical className="h-4 w-4" />
            </div>
          )}
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              {dailyMargin.trend}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Marge Journalière</p>
          <div className="flex items-end gap-2 mb-3">
            <div className="text-4xl font-bold">{dailyMargin.amount.toLocaleString()}€</div>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Revenus:</span>
              <span className="text-green-600 font-medium">+{dailyMargin.breakdown.revenue}€</span>
            </div>
            <div className="flex justify-between">
              <span>Coûts:</span>
              <span className="text-red-600 font-medium">-{dailyMargin.breakdown.costs}€</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projection mensuelle:</span>
              <span className="font-bold">{dailyMargin.monthly.toLocaleString()}€</span>
            </div>
          </div>
        </div>

        {/* Current Conditions */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden">
          {editMode && (
            <div className="absolute top-2 right-2 p-1 bg-white/20 rounded cursor-move">
              <GripVertical className="h-4 w-4" />
            </div>
          )}
          <p className="text-sm opacity-90 mb-3">Conditions Actuelles</p>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-5xl font-bold">{currentConditions.temp}°C</div>
              <div className="text-sm opacity-75 mt-1">Ensoleillé</div>
            </div>
            <Sun className="h-16 w-16 opacity-90 animate-pulse" />
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4" />
              <span>{currentConditions.wind} km/h</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplet className="h-4 w-4" />
              <span>{currentConditions.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>ET: {currentConditions.et}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Widgets */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Map */}
          <div className="bg-card border rounded-xl p-6 relative">
            {editMode && (
              <div className="absolute top-2 right-2 p-1 bg-muted rounded cursor-move z-10">
                <GripVertical className="h-4 w-4" />
              </div>
            )}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#1ABC9C]" />
                Carte Interactive - Vue NDVI
              </h2>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded flex items-center gap-1">
                  <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></span>
                  Live
                </span>
                <select className="px-3 py-1.5 text-sm border rounded-lg bg-background">
                  <option>Vue NDVI</option>
                  <option>Vue Satellite</option>
                  <option>Vue Humidité</option>
                </select>
              </div>
            </div>

            <div className="relative h-96 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 rounded-lg overflow-hidden border-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-2xl p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {parcels.map((parcel) => {
                      const ndviColor =
                        parcel.ndvi > 0.75
                          ? 'from-green-500 to-emerald-600'
                          : parcel.ndvi > 0.65
                          ? 'from-yellow-500 to-orange-600'
                          : 'from-red-500 to-rose-600';

                      return (
                        <button
                          key={parcel.id}
                          onClick={() => {
                            if (selectedParcels.includes(parcel.id)) {
                              setSelectedParcels(selectedParcels.filter((p) => p !== parcel.id));
                            } else {
                              setSelectedParcels([...selectedParcels, parcel.id]);
                            }
                          }}
                          className={`p-6 rounded-xl bg-gradient-to-br ${ndviColor} text-white hover:scale-105 transition-all ${
                            selectedParcels.includes(parcel.id)
                              ? 'ring-4 ring-white shadow-2xl'
                              : ''
                          }`}
                        >
                          <div className="text-left">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm opacity-90">{parcel.id}</span>
                              {selectedParcels.includes(parcel.id) && (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </div>
                            <div className="font-bold text-lg mb-1">{parcel.name}</div>
                            <div className="text-sm opacity-90">{parcel.crop}</div>
                            <div className="text-xs opacity-75 mt-2">{parcel.area} ha</div>
                            <div className="mt-3 pt-3 border-t border-white/30">
                              <div className="text-xs opacity-75">NDVI</div>
                              <div className="text-2xl font-bold">{parcel.ndvi}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* IoT Sensors overlay */}
              <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
                <div className="text-xs font-semibold mb-2">Capteurs IoT</div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                    <span>{iotStatus.active} Actifs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-yellow-600 rounded-full"></div>
                    <span>{iotStatus.lowBattery} Batterie</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                    <span>{iotStatus.offline} Hors ligne</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
                <div className="text-xs font-semibold mb-2">Légende NDVI</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
                    <span>Excellent (0.75-1.0)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded"></div>
                    <span>Moyen (0.65-0.75)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-3 bg-gradient-to-r from-red-500 to-rose-600 rounded"></div>
                    <span>Faible (&lt;0.65)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Predictions & Phenology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Predictions */}
            <div className="bg-card border rounded-xl p-6 relative">
              {editMode && (
                <div className="absolute top-2 right-2 p-1 bg-muted rounded cursor-move z-10">
                  <GripVertical className="h-4 w-4" />
                </div>
              )}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Prévisions IA
                </h2>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs rounded">
                  Confiance: 89%
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">Rendement prévu: +12%</div>
                      <div className="text-sm text-muted-foreground">
                        Basé sur météo favorable et santé cultures optimale
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm space-y-2">
                  <div className="font-medium mb-2">Facteurs influents:</div>
                  {[
                    { name: 'Météo', value: 60, color: 'blue' },
                    { name: 'Irrigation', value: 25, color: 'cyan' },
                    { name: 'Fertilisation', value: 15, color: 'green' },
                  ].map((factor) => (
                    <div key={factor.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{factor.name}</span>
                        <span className="font-medium">{factor.value}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${factor.color}-600`}
                          style={{ width: `${factor.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Simuler un scénario
                </button>
              </div>
            </div>

            {/* Phenology Timeline */}
            <div className="bg-card border rounded-xl p-6 relative">
              {editMode && (
                <div className="absolute top-2 right-2 p-1 bg-muted rounded cursor-move z-10">
                  <GripVertical className="h-4 w-4" />
                </div>
              )}
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-[#1ABC9C]" />
                Calendrier Phénologique
              </h2>

              <div className="relative space-y-4">
                {phenologyStages.map((stage, index) => {
                  const isLast = index === phenologyStages.length - 1;
                  return (
                    <div key={stage.stage} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            stage.status === 'completed'
                              ? 'bg-green-600 text-white'
                              : stage.status === 'current'
                              ? 'bg-blue-600 text-white animate-pulse'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {stage.status === 'completed' && <CheckCircle className="h-4 w-4" />}
                          {stage.status === 'current' && <Activity className="h-4 w-4" />}
                          {stage.status === 'upcoming' && <Clock className="h-4 w-4" />}
                        </div>
                        {!isLast && (
                          <div
                            className={`h-full w-0.5 mt-1 ${
                              stage.status === 'completed' ? 'bg-green-600' : 'bg-muted'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="font-medium">{stage.stage}</div>
                        <div className="text-sm text-muted-foreground">{stage.date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Info className="h-4 w-4" />
                  <span>Prochain: Irrigation dans 2 jours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-card border rounded-xl p-6 relative">
            {editMode && (
              <div className="absolute top-2 right-2 p-1 bg-muted rounded cursor-move z-10">
                <GripVertical className="h-4 w-4" />
              </div>
            )}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#1ABC9C]" />
                Tâches du Jour
              </h2>
              <button className="px-3 py-1.5 text-sm bg-[#1ABC9C] text-white rounded-lg hover:bg-[#16A085] transition-colors">
                + Ajouter
              </button>
            </div>

            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="h-5 w-5 rounded border-gray-300 text-[#1ABC9C] focus:ring-[#1ABC9C]"
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            : task.priority === 'medium'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}
                      >
                        {task.priority === 'high'
                          ? 'Haute'
                          : task.priority === 'medium'
                          ? 'Moyenne'
                          : 'Basse'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium">
                  {todayTasks.filter((t) => t.completed).length}/{todayTasks.length} complétées
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#1ABC9C]"
                  style={{
                    width: `${
                      (todayTasks.filter((t) => t.completed).length / todayTasks.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Active Alerts */}
          <div className="bg-card border rounded-xl p-6 relative">
            {editMode && (
              <div className="absolute top-2 right-2 p-1 bg-muted rounded cursor-move z-10">
                <GripVertical className="h-4 w-4" />
              </div>
            )}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-600" />
                Alertes Actives
              </h2>
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded">
                {alerts.filter((a) => a.type === 'critical').length} critiques
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 border rounded-lg ${
                    alert.type === 'critical'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      : alert.type === 'warning'
                      ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1">{alert.title}</div>
                      <div className="text-xs text-muted-foreground mb-2">{alert.message}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                        <button className="text-xs text-blue-600 hover:underline">
                          {alert.action}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm">
              Voir toutes les alertes
            </button>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white relative">
            {editMode && (
              <div className="absolute top-2 right-2 p-1 bg-white/20 rounded cursor-move z-10">
                <GripVertical className="h-4 w-4" />
              </div>
            )}
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5" />
              Recommandations IA
            </h2>

            <div className="space-y-4">
              {aiRecommendations.map((rec) => {
                const Icon = rec.icon;
                return (
                  <div key={rec.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white/20 rounded">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1">{rec.title}</div>
                        <div className="text-sm opacity-90 mb-2">{rec.impact}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white"
                              style={{ width: `${rec.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs">{rec.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Equipment Status */}
          <div className="bg-card border rounded-xl p-6 relative">
            {editMode && (
              <div className="absolute top-2 right-2 p-1 bg-muted rounded cursor-move z-10">
                <GripVertical className="h-4 w-4" />
              </div>
            )}
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Tractor className="h-5 w-5 text-[#1ABC9C]" />
              État Équipements
            </h2>

            <div className="space-y-3">
              {equipment.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div
                    className={`p-2 rounded ${
                      item.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900/20'
                        : item.status === 'idle'
                        ? 'bg-gray-100 dark:bg-gray-900/20'
                        : 'bg-blue-100 dark:bg-blue-900/20'
                    }`}
                  >
                    <Tractor className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span
                        className={`px-1.5 py-0.5 rounded ${
                          item.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : item.status === 'idle'
                            ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {item.status === 'active'
                          ? 'Actif'
                          : item.status === 'idle'
                          ? 'Repos'
                          : 'Charge'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Battery className="h-3 w-3" />
                        {item.battery}%
                      </span>
                      <span className="flex items-center gap-1">
                        <Signal className="h-3 w-3" />
                        {item.lastUpdate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-[#1ABC9C]" />
                <span className="text-xs text-muted-foreground">Équipe</span>
              </div>
              <div className="text-2xl font-bold">5</div>
              <div className="text-xs text-muted-foreground">membres actifs</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-muted-foreground">Efficacité</span>
              </div>
              <div className="text-2xl font-bold">92%</div>
              <div className="text-xs text-green-600">+3% vs hier</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
