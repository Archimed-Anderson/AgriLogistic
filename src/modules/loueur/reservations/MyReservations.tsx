/**
 * =======================================================
 * MY RESERVATIONS - Complete Booking Management
 * =======================================================
 * Features:
 * - Current and past bookings overview
 * - Status tracking and filtering
 * - Payment status monitoring
 * - Equipment details and tracking
 * - Reservation actions (modify, cancel, extend)
 */

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  MessageSquare,
  Star,
  Truck,
} from "lucide-react";

export type ReservationStatus = "upcoming" | "active" | "completed" | "cancelled" | "pending";
export type PaymentStatus = "paid" | "partial" | "pending" | "overdue" | "refunded";

export interface Reservation {
  id: string;
  bookingNumber: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  ownerName: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  pricePerDay: number;
  totalAmount: number;
  amountPaid: number;
  deposit: number;
  deliveryAddress: string;
  deliveryStatus?: "pending" | "in-transit" | "delivered" | "returned";
  extras: string[];
  notes?: string;
  createdAt: Date;
  rating?: number;
  review?: string;
}

const mockReservations: Reservation[] = [
  {
    id: "RES-001",
    bookingNumber: "BK-2026-0145",
    equipmentId: "TRC-001",
    equipmentName: "Tracteur John Deere 6250R",
    equipmentImage: "https://images.unsplash.com/photo-1564923347945-6200f40a7de6?w=200",
    ownerName: "Ferme Dupont SARL",
    status: "active",
    paymentStatus: "paid",
    startDate: new Date("2026-01-10"),
    endDate: new Date("2026-01-17"),
    totalDays: 7,
    pricePerDay: 450,
    totalAmount: 3600,
    amountPaid: 3600,
    deposit: 900,
    deliveryAddress: "123 Route des Vignes, 21000 Dijon",
    deliveryStatus: "delivered",
    extras: ["Assurance Premium", "Livraison Express", "Opérateur"],
    notes: "Utilisation pour labour de printemps",
    createdAt: new Date("2026-01-05"),
  },
  {
    id: "RES-002",
    bookingNumber: "BK-2026-0098",
    equipmentId: "MOIS-001",
    equipmentName: "Moissonneuse Claas Lexion 7700",
    equipmentImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200",
    ownerName: "Coopérative AgriTech",
    status: "upcoming",
    paymentStatus: "partial",
    startDate: new Date("2026-01-20"),
    endDate: new Date("2026-01-25"),
    totalDays: 5,
    pricePerDay: 850,
    totalAmount: 4950,
    amountPaid: 1700,
    deposit: 1700,
    deliveryAddress: "456 Chemin des Blés, 45000 Orléans",
    deliveryStatus: "pending",
    extras: ["Assurance Premium", "Maintenance Préventive"],
    createdAt: new Date("2026-01-12"),
  },
  {
    id: "RES-003",
    bookingNumber: "BK-2025-1287",
    equipmentId: "PUL-001",
    equipmentName: "Pulvérisateur Kuhn Deltis 1302",
    equipmentImage: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200",
    ownerName: "Jean-Marc Agricole",
    status: "completed",
    paymentStatus: "paid",
    startDate: new Date("2025-12-15"),
    endDate: new Date("2025-12-20"),
    totalDays: 5,
    pricePerDay: 280,
    totalAmount: 1680,
    amountPaid: 1680,
    deposit: 560,
    deliveryAddress: "789 Avenue de la Ferme, 33000 Bordeaux",
    deliveryStatus: "returned",
    extras: ["Assurance Basique", "Livraison Standard"],
    notes: "Traitement phytosanitaire vignoble",
    createdAt: new Date("2025-12-10"),
    rating: 5,
    review: "Excellent équipement, très satisfait du service",
  },
  {
    id: "RES-004",
    bookingNumber: "BK-2025-1156",
    equipmentId: "SEM-001",
    equipmentName: "Semoir Horsch Pronto 6DC",
    equipmentImage: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=200",
    ownerName: "AgriServices Pro",
    status: "completed",
    paymentStatus: "paid",
    startDate: new Date("2025-11-05"),
    endDate: new Date("2025-11-12"),
    totalDays: 7,
    pricePerDay: 320,
    totalAmount: 2560,
    amountPaid: 2560,
    deposit: 640,
    deliveryAddress: "321 Rue des Cultures, 59000 Lille",
    deliveryStatus: "returned",
    extras: ["Livraison Express", "Formation"],
    createdAt: new Date("2025-10-28"),
    rating: 4,
    review: "Bon matériel, quelques réglages à améliorer",
  },
  {
    id: "RES-005",
    bookingNumber: "BK-2026-0032",
    equipmentId: "EPA-001",
    equipmentName: "Épandeur Amazone ZA-M 3000",
    equipmentImage: "https://images.unsplash.com/photo-1589395937658-0e7f8c8e0b85?w=200",
    ownerName: "Matériel Agricole Moderne",
    status: "cancelled",
    paymentStatus: "refunded",
    startDate: new Date("2026-01-15"),
    endDate: new Date("2026-01-18"),
    totalDays: 3,
    pricePerDay: 180,
    totalAmount: 720,
    amountPaid: 360,
    deposit: 360,
    deliveryAddress: "654 Boulevard Rural, 69000 Lyon",
    extras: ["Assurance Basique"],
    notes: "Annulé: conditions météo défavorables",
    createdAt: new Date("2026-01-08"),
  },
];

export function MyReservations() {
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const filteredReservations = mockReservations.filter((res) => {
    const matchesStatus = statusFilter === "all" || res.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      res.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: ReservationStatus) => {
    const colors = {
      upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      completed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      pending: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return colors[status];
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    const colors = {
      paid: "text-green-600",
      partial: "text-orange-600",
      pending: "text-gray-600",
      overdue: "text-red-600",
      refunded: "text-purple-600",
    };
    return colors[status];
  };

  const stats = {
    total: mockReservations.length,
    active: mockReservations.filter((r) => r.status === "active").length,
    upcoming: mockReservations.filter((r) => r.status === "upcoming").length,
    completed: mockReservations.filter((r) => r.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="h-8 w-8 text-[#2563eb]" />
            Mes Réservations
          </h2>
          <p className="text-muted-foreground mt-1">
            Gérez vos locations en cours et passées
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: Package, color: "blue" },
          { label: "En cours", value: stats.active, icon: TrendingUp, color: "green" },
          { label: "À venir", value: stats.upcoming, icon: Clock, color: "orange" },
          { label: "Terminées", value: stats.completed, icon: CheckCircle, color: "gray" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-4 bg-white dark:bg-gray-900 border rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par équipement ou numéro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2563eb] outline-none"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-900"
          >
            <option value="all">Tous les statuts</option>
            <option value="upcoming">À venir</option>
            <option value="active">En cours</option>
            <option value="completed">Terminées</option>
            <option value="cancelled">Annulées</option>
            <option value="pending">En attente</option>
          </select>

          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </button>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.map((reservation) => (
          <div
            key={reservation.id}
            className="p-6 bg-white dark:bg-gray-900 border rounded-xl hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Equipment Image */}
              <div className="flex-shrink-0">
                <img
                  src={reservation.equipmentImage}
                  alt={reservation.equipmentName}
                  className="w-full lg:w-32 h-32 object-cover rounded-lg"
                />
              </div>

              {/* Details */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{reservation.equipmentName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {reservation.ownerName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        reservation.status
                      )}`}
                    >
                      {reservation.status === "active" && "En cours"}
                      {reservation.status === "upcoming" && "À venir"}
                      {reservation.status === "completed" && "Terminée"}
                      {reservation.status === "cancelled" && "Annulée"}
                      {reservation.status === "pending" && "En attente"}
                    </span>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {reservation.startDate.toLocaleDateString()} -{" "}
                      {reservation.endDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{reservation.totalDays} jours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{reservation.deliveryAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total: </span>
                    <span className="font-bold text-lg">
                      €{reservation.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Payé: </span>
                    <span className={`font-semibold ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                      €{reservation.amountPaid.toLocaleString()}
                    </span>
                  </div>
                  {reservation.deliveryStatus && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Livraison: </span>
                      <span className="font-semibold capitalize">
                        {reservation.deliveryStatus === "delivered" && "Livrée"}
                        {reservation.deliveryStatus === "in-transit" && "En transit"}
                        {reservation.deliveryStatus === "pending" && "En attente"}
                        {reservation.deliveryStatus === "returned" && "Retournée"}
                      </span>
                    </div>
                  )}
                </div>

                {reservation.extras.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {reservation.extras.map((extra, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs"
                      >
                        {extra}
                      </span>
                    ))}
                  </div>
                )}

                {reservation.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < reservation.rating!
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {reservation.review && (
                      <span className="text-sm text-muted-foreground italic">
                        "{reservation.review}"
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2">
                <button className="flex-1 lg:flex-initial px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Détails</span>
                </button>
                {(reservation.status === "upcoming" || reservation.status === "active") && (
                  <>
                    <button className="flex-1 lg:flex-initial px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2">
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline">Modifier</span>
                    </button>
                    <button className="flex-1 lg:flex-initial px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                      <XCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Annuler</span>
                    </button>
                  </>
                )}
                {reservation.status === "completed" && !reservation.rating && (
                  <button className="flex-1 lg:flex-initial px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Star className="h-4 w-4" />
                    <span className="hidden sm:inline">Noter</span>
                  </button>
                )}
                <button className="flex-1 lg:flex-initial px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Facture</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-gray-900 border rounded-xl">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-semibold text-lg mb-2">Aucune réservation trouvée</h3>
          <p className="text-muted-foreground">
            Essayez d'ajuster vos filtres ou effectuez une nouvelle recherche
          </p>
        </div>
      )}
    </div>
  );
}
