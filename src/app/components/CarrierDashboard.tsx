import { useState } from "react";
import {
  Truck,
  Package,
  MapPin,
  Navigation,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Route,
  Fuel,
  Settings,
  BarChart3,
  Star,
  Phone,
  MessageCircle,
  Download,
  Upload,
  Activity,
  Gauge,
  Wrench,
  AlertTriangle,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface Mission {
  id: string;
  type: "pickup" | "delivery" | "both";
  origin: string;
  destination: string;
  customer: string;
  product: string;
  weight: number;
  distance: number;
  fee: number;
  status: "pending" | "accepted" | "in-progress" | "completed";
  deadline: string;
  priority: "low" | "medium" | "high";
}

export function CarrierDashboard() {
  const [activeMissions, setActiveMissions] = useState<Mission[]>([
    {
      id: "M001",
      type: "both",
      origin: "Toulouse, France",
      destination: "Lyon, France",
      customer: "AgroLogistic SAS",
      product: "Semences de maïs",
      weight: 500,
      distance: 360,
      fee: 450,
      status: "in-progress",
      deadline: "15 Jan, 18:00",
      priority: "high",
    },
    {
      id: "M002",
      type: "delivery",
      origin: "Paris, France",
      destination: "Marseille, France",
      customer: "Ferme Bio du Sud",
      product: "Équipements agricoles",
      weight: 1200,
      distance: 775,
      fee: 980,
      status: "pending",
      deadline: "16 Jan, 14:00",
      priority: "medium",
    },
    {
      id: "M003",
      type: "pickup",
      origin: "Bordeaux, France",
      destination: "Nantes, France",
      customer: "CoopAgri Loire",
      product: "Récolte de légumes",
      weight: 800,
      distance: 325,
      fee: 410,
      status: "pending",
      deadline: "17 Jan, 10:00",
      priority: "low",
    },
  ]);

  const [selectedTab, setSelectedTab] = useState<"missions" | "route" | "documents" | "stats" | "fleet">("missions");

  const stats = {
    totalMissions: 45,
    activeMissions: 3,
    completedToday: 2,
    totalEarnings: 12500,
    monthlyEarnings: 8400,
    rating: 4.8,
    totalDistance: 15420,
    fuelEfficiency: 8.5,
  };

  // Fleet management data
  const [vehicles] = useState([
    {
      id: "V001",
      plate: "AA-123-BB",
      model: "Mercedes Actros",
      driver: "Pierre Moreau",
      status: "active" as const,
      currentMission: "M001",
      fuelLevel: 78,
      mileage: 245680,
      lastMaintenance: "2025-12-15",
      nextMaintenance: "2026-02-15",
      efficiency: 8.2,
      emissions: 215,
    },
    {
      id: "V002",
      plate: "CC-456-DD",
      model: "Volvo FH16",
      driver: "Sophie Laurent",
      status: "active" as const,
      currentMission: "M002",
      fuelLevel: 45,
      mileage: 189340,
      lastMaintenance: "2026-01-05",
      nextMaintenance: "2026-03-05",
      efficiency: 8.7,
      emissions: 228,
    },
    {
      id: "V003",
      plate: "EE-789-FF",
      model: "Scania R450",
      driver: "Jean Dupont",
      status: "maintenance" as const,
      currentMission: null,
      fuelLevel: 92,
      mileage: 312450,
      lastMaintenance: "2026-01-14",
      nextMaintenance: "2026-01-20",
      efficiency: 9.1,
      emissions: 240,
    },
    {
      id: "V004",
      plate: "GG-321-HH",
      model: "Renault T High",
      driver: "Luc Bernard",
      status: "idle" as const,
      currentMission: null,
      fuelLevel: 65,
      mileage: 156720,
      lastMaintenance: "2025-12-28",
      nextMaintenance: "2026-02-28",
      efficiency: 8.4,
      emissions: 220,
    },
  ]);

  const fleetStats = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter((v) => v.status === "active").length,
    maintenanceNeeded: vehicles.filter((v) => v.status === "maintenance" || new Date(v.nextMaintenance) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length,
    avgFuelLevel: Math.round(vehicles.reduce((acc, v) => acc + v.fuelLevel, 0) / vehicles.length),
    avgEfficiency: (vehicles.reduce((acc, v) => acc + v.efficiency, 0) / vehicles.length).toFixed(1),
    totalMileage: vehicles.reduce((acc, v) => acc + v.mileage, 0),
  };

  const handleAcceptMission = (missionId: string) => {
    setActiveMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: "accepted" } : m))
    );
    toast.success("Mission acceptée !");
  };

  const handleStartMission = (missionId: string) => {
    setActiveMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: "in-progress" } : m))
    );
    toast.success("Mission démarrée !");
  };

  const handleCompleteMission = (missionId: string) => {
    const mission = activeMissions.find((m) => m.id === missionId);
    setActiveMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: "completed" } : m))
    );
    toast.success(`Mission ${missionId} terminée ! Vous avez gagné ${mission?.fee}€`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "accepted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in-progress":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Transporteur</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">AgriGator Express</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Note: {stats.rating}/5 • {stats.totalMissions} missions
                </p>
              </div>
              <button className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">+3</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.activeMissions}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Missions actives</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">+12%</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.monthlyEarnings}€</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gains ce mois</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Navigation className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalDistance}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Kilomètres parcourus</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Fuel className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">Excellent</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.fuelEfficiency}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">L/100km moyenne</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6">
            <div className="flex gap-4">
              {[
                { id: "missions", label: "Missions", icon: Package, count: stats.activeMissions },
                { id: "fleet", label: "Gestion Flotte", icon: Truck, count: fleetStats.maintenanceNeeded },
                { id: "route", label: "Optimisation Itinéraire", icon: Route },
                { id: "documents", label: "Documents", icon: FileText },
                { id: "stats", label: "Performances", icon: BarChart3 },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                      selectedTab === tab.id
                        ? "border-blue-600 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold">{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Missions Tab */}
          {selectedTab === "missions" && (
            <div className="p-6">
              <div className="space-y-4">
                {activeMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Mission {mission.id}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(mission.priority)}`}>
                              {mission.priority === "high" ? "Urgent" : mission.priority === "medium" ? "Normal" : "Basse priorité"}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(mission.status)}`}>
                              {mission.status === "pending" ? "En attente" :
                               mission.status === "accepted" ? "Acceptée" :
                               mission.status === "in-progress" ? "En cours" : "Terminée"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Client: {mission.customer} • Produit: {mission.product}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{mission.distance} km</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              <span>{mission.weight} kg</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{mission.deadline}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{mission.fee}€</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Rémunération</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-gray-900 dark:text-white">Départ:</span>
                          <span className="text-gray-600 dark:text-gray-400">{mission.origin}</span>
                        </div>
                      </div>
                      <Navigation className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-gray-900 dark:text-white">Arrivée:</span>
                          <span className="text-gray-600 dark:text-gray-400">{mission.destination}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {mission.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAcceptMission(mission.id)}
                            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Accepter la mission
                          </button>
                          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold">
                            Refuser
                          </button>
                        </>
                      )}
                      {mission.status === "accepted" && (
                        <button
                          onClick={() => handleStartMission(mission.id)}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                        >
                          <Truck className="h-4 w-4" />
                          Démarrer la mission
                        </button>
                      )}
                      {mission.status === "in-progress" && (
                        <>
                          <button
                            onClick={() => handleCompleteMission(mission.id)}
                            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Marquer comme terminée
                          </button>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Contacter
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fleet Management Tab */}
          {selectedTab === "fleet" && (
            <div className="p-6">
              {/* Fleet Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Vehicules</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{fleetStats.totalVehicles}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Actifs</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{fleetStats.activeVehicles}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Fuel className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Carburant Moy.</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{fleetStats.avgFuelLevel}%</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Efficacite Moy.</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{fleetStats.avgEfficiency} L</p>
                </div>
              </div>

              {/* Vehicles List */}
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            vehicle.status === "active"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : vehicle.status === "maintenance"
                              ? "bg-orange-100 dark:bg-orange-900/30"
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          <Truck
                            className={`h-6 w-6 ${
                              vehicle.status === "active"
                                ? "text-green-600"
                                : vehicle.status === "maintenance"
                                ? "text-orange-600"
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{vehicle.plate}</h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                vehicle.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : vehicle.status === "maintenance"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {vehicle.status === "active"
                                ? "Actif"
                                : vehicle.status === "maintenance"
                                ? "Maintenance"
                                : "Disponible"}
                            </span>
                            {vehicle.currentMission && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                Mission: {vehicle.currentMission}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {vehicle.model} • Conducteur: {vehicle.driver}
                          </p>

                          {/* Metrics Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center gap-2 mb-1">
                                <Fuel className="h-4 w-4 text-orange-600" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">Carburant</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      vehicle.fuelLevel > 60
                                        ? "bg-green-500"
                                        : vehicle.fuelLevel > 30
                                        ? "bg-orange-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{ width: `${vehicle.fuelLevel}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{vehicle.fuelLevel}%</span>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center gap-2 mb-1">
                                <Gauge className="h-4 w-4 text-purple-600" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">Kilometrage</span>
                              </div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {vehicle.mileage.toLocaleString()} km
                              </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">Efficacite</span>
                              </div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{vehicle.efficiency} L/100km</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center gap-2 mb-1">
                                <Wrench className="h-4 w-4 text-blue-600" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">Prochaine Maint.</span>
                              </div>
                              <p className="text-xs font-bold text-gray-900 dark:text-white">
                                {new Date(vehicle.nextMaintenance).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        {vehicle.status === "maintenance" && (
                          <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-sm flex items-center gap-2">
                            <Wrench className="h-4 w-4" />
                            Details Maint.
                          </button>
                        )}
                        {vehicle.status === "idle" && (
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Assigner Mission
                          </button>
                        )}
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold text-sm flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Contacter
                        </button>
                      </div>
                    </div>

                    {/* Alert if maintenance needed soon */}
                    {new Date(vehicle.nextMaintenance) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && vehicle.status !== "maintenance" && (
                      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                        <p className="text-sm text-orange-700 dark:text-orange-400">
                          Maintenance programmee dans{" "}
                          {Math.ceil((new Date(vehicle.nextMaintenance).getTime() - Date.now()) / (24 * 60 * 60 * 1000))} jours
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Route Tab */}
          {selectedTab === "route" && (
            <div className="p-6">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-12 text-center">
                <Route className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Optimisation d'Itinéraire</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  L'algorithme d'optimisation calcule le meilleur itinéraire pour vos missions
                </p>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                  Optimiser mes missions
                </button>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {selectedTab === "documents" && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Bon de livraison - M001", date: "14 Jan 2026", icon: FileText },
                  { name: "Facture - Janvier 2026", date: "01 Jan 2026", icon: FileText },
                  { name: "Contrat de transport", date: "15 Déc 2025", icon: FileText },
                  { name: "Attestation d'assurance", date: "01 Jan 2026", icon: FileText },
                ].map((doc, idx) => {
                  const Icon = doc.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{doc.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{doc.date}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                        <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6">
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Upload className="h-5 w-5" />
                  Télécharger un document
                </button>
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {selectedTab === "stats" && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Revenus mensuels</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Ce mois</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.monthlyEarnings}€</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalEarnings}€</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Performances</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Note moyenne</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.rating}/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Missions totales</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalMissions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
