/**
 * ============================================
 * MY EQUIPMENT MANAGEMENT
 * ============================================
 * Equipment inventory management for owners
 * - Equipment listing with availability status
 * - Maintenance schedules and alerts
 * - Earnings tracking per equipment
 * - Performance metrics and analytics
 * - CRUD operations for equipment
 */

import { useState, useMemo } from "react";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Wrench,
  MapPin,
  Star,
  BarChart3,
  Filter,
  Download,
  Settings,
  Power,
  Fuel,
  Gauge,
  CircleDot,
} from "lucide-react";

export interface OwnedEquipment {
  id: string;
  name: string;
  model: string;
  brand: string;
  category: string;
  image: string;
  status: "available" | "rented" | "maintenance" | "offline";
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  pricePerDay: number;
  
  // Availability & Usage
  availabilityStatus: "high" | "medium" | "low";
  occupancyRate: number; // percentage
  totalRentals: number;
  totalDaysRented: number;
  
  // Financial
  totalEarnings: number;
  monthlyEarnings: number;
  roi: number; // percentage
  breakEvenDate?: Date;
  
  // Maintenance
  lastMaintenance: Date;
  nextMaintenance: Date;
  maintenanceCost: number;
  healthScore: number; // 0-100
  
  // Performance
  averageRating: number;
  totalReviews: number;
  
  // Current rental (if rented)
  currentRental?: {
    renterName: string;
    startDate: Date;
    endDate: Date;
    location: string;
  };
}

export interface MaintenanceAlert {
  equipmentId: string;
  equipmentName: string;
  type: "urgent" | "warning" | "info";
  message: string;
  dueDate: Date;
  estimatedCost: number;
}

interface Props {
  ownerId: string;
  ownerName: string;
}

export function MyEquipment({ ownerId, ownerName }: Props) {
  const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - in real app, fetch from API
  const myEquipment: OwnedEquipment[] = useMemo(
    () => [
      {
        id: "OWN-001",
        name: "Tracteur John Deere 6250R",
        model: "6250R",
        brand: "John Deere",
        category: "Tracteurs",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
        status: "rented",
        purchaseDate: new Date("2022-03-15"),
        purchasePrice: 185000,
        currentValue: 142000,
        pricePerDay: 360,
        availabilityStatus: "medium",
        occupancyRate: 68,
        totalRentals: 87,
        totalDaysRented: 245,
        totalEarnings: 88200,
        monthlyEarnings: 8640,
        roi: 47.7,
        breakEvenDate: new Date("2026-08-20"),
        lastMaintenance: new Date("2025-12-05"),
        nextMaintenance: new Date("2026-03-05"),
        maintenanceCost: 8950,
        healthScore: 92,
        averageRating: 4.8,
        totalReviews: 42,
        currentRental: {
          renterName: "Pierre Martin",
          startDate: new Date("2026-01-12"),
          endDate: new Date("2026-01-22"),
          location: "Beauvais, Oise",
        },
      },
      {
        id: "OWN-002",
        name: "Moissonneuse Claas Lexion 8900",
        model: "Lexion 8900",
        brand: "Claas",
        category: "Moissonneuses",
        image: "https://images.unsplash.com/photo-1574922236089-e8b50fc6c90e?w=400",
        status: "available",
        purchaseDate: new Date("2021-06-10"),
        purchasePrice: 425000,
        currentValue: 298000,
        pricePerDay: 900,
        availabilityStatus: "high",
        occupancyRate: 45,
        totalRentals: 34,
        totalDaysRented: 98,
        totalEarnings: 88200,
        monthlyEarnings: 4500,
        roi: 20.8,
        lastMaintenance: new Date("2025-11-20"),
        nextMaintenance: new Date("2026-02-20"),
        maintenanceCost: 18500,
        healthScore: 88,
        averageRating: 4.9,
        totalReviews: 28,
      },
      {
        id: "OWN-003",
        name: "Pulvérisateur Kuhn Metris 4102",
        model: "Metris 4102",
        brand: "Kuhn",
        category: "Pulvérisateurs",
        image: "https://images.unsplash.com/photo-1589923188900-ccca25a5a62f?w=400",
        status: "maintenance",
        purchaseDate: new Date("2023-04-20"),
        purchasePrice: 68000,
        currentValue: 52000,
        pricePerDay: 210,
        availabilityStatus: "low",
        occupancyRate: 72,
        totalRentals: 56,
        totalDaysRented: 168,
        totalEarnings: 35280,
        monthlyEarnings: 3780,
        roi: 51.9,
        breakEvenDate: new Date("2025-10-15"),
        lastMaintenance: new Date("2026-01-08"),
        nextMaintenance: new Date("2026-04-08"),
        maintenanceCost: 4200,
        healthScore: 78,
        averageRating: 4.6,
        totalReviews: 35,
      },
      {
        id: "OWN-004",
        name: "Semoir Horsch Maestro 12.75 SW",
        model: "Maestro 12.75 SW",
        brand: "Horsch",
        category: "Semoirs",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
        status: "available",
        purchaseDate: new Date("2022-09-05"),
        purchasePrice: 95000,
        currentValue: 71000,
        pricePerDay: 320,
        availabilityStatus: "high",
        occupancyRate: 58,
        totalRentals: 48,
        totalDaysRented: 142,
        totalEarnings: 45440,
        monthlyEarnings: 5120,
        roi: 47.8,
        breakEvenDate: new Date("2026-05-10"),
        lastMaintenance: new Date("2025-12-15"),
        nextMaintenance: new Date("2026-03-15"),
        maintenanceCost: 5800,
        healthScore: 94,
        averageRating: 4.7,
        totalReviews: 31,
      },
      {
        id: "OWN-005",
        name: "Charrue Kverneland LD 100",
        model: "LD 100",
        brand: "Kverneland",
        category: "Charrues",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
        status: "offline",
        purchaseDate: new Date("2020-02-10"),
        purchasePrice: 18500,
        currentValue: 9200,
        pricePerDay: 85,
        availabilityStatus: "low",
        occupancyRate: 32,
        totalRentals: 22,
        totalDaysRented: 58,
        totalEarnings: 4930,
        monthlyEarnings: 272,
        roi: 26.6,
        lastMaintenance: new Date("2025-10-05"),
        nextMaintenance: new Date("2026-01-05"),
        maintenanceCost: 1250,
        healthScore: 65,
        averageRating: 4.3,
        totalReviews: 18,
      },
    ],
    []
  );

  const maintenanceAlerts: MaintenanceAlert[] = useMemo(
    () => [
      {
        equipmentId: "OWN-003",
        equipmentName: "Pulvérisateur Kuhn Metris 4102",
        type: "urgent",
        message: "Maintenance en cours - Réparation système hydraulique",
        dueDate: new Date("2026-01-16"),
        estimatedCost: 1200,
      },
      {
        equipmentId: "OWN-005",
        equipmentName: "Charrue Kverneland LD 100",
        type: "warning",
        message: "Maintenance préventive en retard - Inspection requise",
        dueDate: new Date("2026-01-05"),
        estimatedCost: 350,
      },
      {
        equipmentId: "OWN-001",
        equipmentName: "Tracteur John Deere 6250R",
        type: "info",
        message: "Prochaine révision programmée dans 48 jours",
        dueDate: new Date("2026-03-05"),
        estimatedCost: 850,
      },
    ],
    []
  );

  // Filter equipment
  const filteredEquipment = useMemo(() => {
    let result = myEquipment;

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter((eq) => eq.status === filterStatus);
    }

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (eq) =>
          eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          eq.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          eq.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [myEquipment, filterStatus, searchQuery]);

  // Calculate totals
  const totals = useMemo(() => {
    return {
      totalEquipment: myEquipment.length,
      totalValue: myEquipment.reduce((sum, eq) => sum + eq.currentValue, 0),
      totalEarnings: myEquipment.reduce((sum, eq) => sum + eq.totalEarnings, 0),
      monthlyEarnings: myEquipment.reduce((sum, eq) => sum + eq.monthlyEarnings, 0),
      averageOccupancy: myEquipment.reduce((sum, eq) => sum + eq.occupancyRate, 0) / myEquipment.length,
      averageROI: myEquipment.reduce((sum, eq) => sum + eq.roi, 0) / myEquipment.length,
    };
  }, [myEquipment]);

  const getStatusColor = (status: OwnedEquipment["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
      case "rented":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
      case "maintenance":
        return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
      case "offline":
        return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: OwnedEquipment["status"]) => {
    switch (status) {
      case "available":
        return CheckCircle;
      case "rented":
        return Activity;
      case "maintenance":
        return Wrench;
      case "offline":
        return Power;
    }
  };

  const getAlertColor = (type: MaintenanceAlert["type"]) => {
    switch (type) {
      case "urgent":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20";
      case "warning":
        return "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20";
      case "info":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mes Équipements</h2>
          <p className="text-muted-foreground mt-1">Gérez votre inventaire et suivez les performances</p>
        </div>
        <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter Équipement
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              +2
            </div>
          </div>
          <h3 className="text-2xl font-bold">{totals.totalEquipment}</h3>
          <p className="text-sm text-muted-foreground mt-1">Total Équipements</p>
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-muted-foreground">
              Valeur: €{totals.totalValue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              +12%
            </div>
          </div>
          <h3 className="text-2xl font-bold">€{totals.totalEarnings.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground mt-1">Revenus Totaux</p>
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-muted-foreground">
              Mensuel: €{totals.monthlyEarnings.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">{totals.averageOccupancy.toFixed(0)}%</h3>
          <p className="text-sm text-muted-foreground mt-1">Taux d'Occupation</p>
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-muted-foreground">
              Moyenne sur tous équipements
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              +8%
            </div>
          </div>
          <h3 className="text-2xl font-bold">{totals.averageROI.toFixed(1)}%</h3>
          <p className="text-sm text-muted-foreground mt-1">ROI Moyen</p>
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-muted-foreground">
              Retour sur investissement
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Alerts */}
      {maintenanceAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Alertes Maintenance ({maintenanceAlerts.length})
          </h3>
          {maintenanceAlerts.map((alert) => (
            <div
              key={alert.equipmentId}
              className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-semibold text-sm">{alert.equipmentName}</span>
                  </div>
                  <p className="text-sm mb-2">{alert.message}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Échéance: {alert.dueDate.toLocaleDateString("fr-FR")}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Coût estimé: €{alert.estimatedCost}
                    </span>
                  </div>
                </div>
                <button className="px-3 py-1 border rounded-lg text-xs hover:bg-white dark:hover:bg-gray-800 transition-colors">
                  Gérer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher un équipement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
            >
              <option value="all">Tous statuts</option>
              <option value="available">Disponible</option>
              <option value="rented">En location</option>
              <option value="maintenance">En maintenance</option>
              <option value="offline">Hors ligne</option>
            </select>
            <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEquipment.map((equipment) => {
          const StatusIcon = getStatusIcon(equipment.status);
          
          return (
            <div key={equipment.id} className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image & Status */}
              <div className="relative h-48 bg-muted">
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(equipment.status)}`}>
                    <StatusIcon className="h-3 w-3" />
                    {equipment.status === "available" && "Disponible"}
                    {equipment.status === "rented" && "En location"}
                    {equipment.status === "maintenance" && "Maintenance"}
                    {equipment.status === "offline" && "Hors ligne"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-1">{equipment.name}</h3>
                  <p className="text-sm text-muted-foreground">{equipment.brand} • {equipment.category}</p>
                </div>

                {/* Current Rental Info (if rented) */}
                {equipment.currentRental && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="text-sm font-medium mb-2">Location en cours</div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {equipment.currentRental.renterName} • {equipment.currentRental.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {equipment.currentRental.startDate.toLocaleDateString("fr-FR")} → {equipment.currentRental.endDate.toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Occupation</div>
                    <div className="text-lg font-bold">{equipment.occupancyRate}%</div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${equipment.occupancyRate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Santé</div>
                    <div className="text-lg font-bold flex items-center gap-1">
                      {equipment.healthScore}
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full transition-all duration-500 ${
                          equipment.healthScore >= 90
                            ? "bg-green-500"
                            : equipment.healthScore >= 75
                              ? "bg-blue-500"
                              : "bg-orange-500"
                        }`}
                        style={{ width: `${equipment.healthScore}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">ROI</div>
                    <div className="text-lg font-bold flex items-center gap-1">
                      {equipment.roi}%
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>

                {/* Financial Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Revenus totaux</div>
                    <div className="text-sm font-semibold">€{equipment.totalEarnings.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Revenus mensuels</div>
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">€{equipment.monthlyEarnings.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Tarif/jour</div>
                    <div className="text-sm font-semibold">€{equipment.pricePerDay}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Total locations</div>
                    <div className="text-sm font-semibold">{equipment.totalRentals}</div>
                  </div>
                </div>

                {/* Maintenance Info */}
                <div className="mb-4 pb-4 border-b">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Wrench className="h-3 w-3" />
                      Prochaine maintenance
                    </div>
                    <span className="font-medium">
                      {equipment.nextMaintenance.toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(equipment.averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{equipment.averageRating}</span>
                    <span className="text-xs text-muted-foreground">({equipment.totalReviews})</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 border rounded-lg hover:bg-muted transition-colors text-sm flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4" />
                    Voir
                  </button>
                  <button className="flex-1 px-3 py-2 border rounded-lg hover:bg-muted transition-colors text-sm flex items-center justify-center gap-2">
                    <Edit className="h-4 w-4" />
                    Modifier
                  </button>
                  <button className="px-3 py-2 border rounded-lg hover:bg-muted transition-colors text-sm">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredEquipment.length === 0 && (
        <div className="bg-card border rounded-lg p-12 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-semibold text-lg mb-2">Aucun équipement trouvé</h3>
          <p className="text-muted-foreground mb-4">
            Ajustez vos filtres ou ajoutez un nouvel équipement
          </p>
          <button
            onClick={() => {
              setFilterStatus("all");
              setSearchQuery("");
            }}
            className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      )}
    </div>
  );
}
