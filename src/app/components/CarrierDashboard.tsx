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
      customer: "AgroDeep SAS",
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

  const [selectedTab, setSelectedTab] = useState<"missions" | "route" | "documents" | "stats">("missions");

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
