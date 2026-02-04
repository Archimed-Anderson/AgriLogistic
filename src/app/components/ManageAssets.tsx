import { useState } from 'react';
import {
  Edit,
  EyeOff,
  Eye,
  BarChart3,
  Calendar as CalendarIcon,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  Package,
  MessageCircle,
  FileText,
  FolderTree,
} from 'lucide-react';
import { toast } from 'sonner';

interface ManageAssetsProps {
  onAddAsset: () => void;
  reservations: any[];
  onAcceptReservation: (id: string) => void;
  onRejectReservation: (id: string) => void;
}

export function ManageAssets({
  onAddAsset,
  reservations,
  onAcceptReservation,
  onRejectReservation,
}: ManageAssetsProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    'equipment' | 'calendar' | 'reservations' | 'revenue'
  >('equipment');

  // Mock data - Ferme de la Vallée equipment
  const myEquipments = [
    {
      id: 'MY-001',
      name: 'Tracteur John Deere 5090R',
      category: 'Tracteur',
      icon: '🚜',
      pricePerDay: 420,
      status: 'reserved' as const,
      revenue30d: 3360,
      totalRentals: 8,
      rating: 4.9,
      nextBooking: '15-18 Jan',
    },
    {
      id: 'MY-002',
      name: 'Couveuse 300 Œufs',
      category: 'Couveuse',
      icon: '🥚',
      pricePerDay: 28,
      status: 'available' as const,
      revenue30d: 420,
      totalRentals: 15,
      rating: 5.0,
      nextBooking: null,
    },
    {
      id: 'MY-003',
      name: 'Tronçonneuse Husqvarna',
      category: 'Scie',
      icon: '🪚',
      pricePerDay: 38,
      status: 'maintenance' as const,
      revenue30d: 152,
      totalRentals: 4,
      rating: 4.8,
      nextBooking: null,
    },
  ];

  // Calendar data
  const calendarEvents = [
    {
      id: 1,
      equipmentId: 'MY-001',
      equipmentName: 'Tracteur John Deere',
      startDate: '15 Jan',
      endDate: '18 Jan',
      renter: 'Marc Dubois',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      equipmentId: 'MY-002',
      equipmentName: 'Couveuse 300 Œufs',
      startDate: '22 Jan',
      endDate: '29 Jan',
      renter: 'Sophie Martin',
      color: 'bg-purple-500',
    },
  ];

  const getStatusBadge = (status: 'available' | 'reserved' | 'maintenance') => {
    switch (status) {
      case 'available':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            Disponible
          </span>
        );
      case 'reserved':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-medium rounded-full">
            <Clock className="h-3 w-3" />
            En location
          </span>
        );
      case 'maintenance':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">
            <AlertCircle className="h-3 w-3" />
            Maintenance
          </span>
        );
    }
  };

  const getReservationStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium rounded-full">
            En attente
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">
            Confirmée
          </span>
        );
      case 'active':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium rounded-full">
            En cours
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 text-xs font-medium rounded-full">
            Terminée
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">
            Annulée
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="border-b">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveSubTab('equipment')}
            className={`px-4 py-3 border-b-2 transition-colors text-sm font-medium ${
              activeSubTab === 'equipment'
                ? 'border-[#2563eb] text-[#2563eb]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Mes Équipements
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`px-4 py-3 border-b-2 transition-colors text-sm font-medium ${
              activeSubTab === 'calendar'
                ? 'border-[#2563eb] text-[#2563eb]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendrier
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('reservations')}
            className={`px-4 py-3 border-b-2 transition-colors text-sm font-medium ${
              activeSubTab === 'reservations'
                ? 'border-[#2563eb] text-[#2563eb]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Réservations
              {reservations.filter((r) => r.status === 'pending').length > 0 && (
                <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs rounded-full">
                  {reservations.filter((r) => r.status === 'pending').length}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('revenue')}
            className={`px-4 py-3 border-b-2 transition-colors text-sm font-medium ${
              activeSubTab === 'revenue'
                ? 'border-[#2563eb] text-[#2563eb]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Revenus
            </span>
          </button>
        </nav>
      </div>

      {/* Equipment Tab */}
      {activeSubTab === 'equipment' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Mes Équipements</h2>
              <p className="text-sm text-muted-foreground">Ferme de la Vallée</p>
            </div>
            <button
              onClick={onAddAsset}
              className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium"
            >
              + Ajouter un actif
            </button>
          </div>

          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Équipement</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Taux de location</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Statut</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Revenus (30j)</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Locations</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myEquipments.map((equipment) => (
                  <tr key={equipment.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{equipment.icon}</div>
                        <div>
                          <div className="font-medium">{equipment.name}</div>
                          <div className="text-sm text-muted-foreground">{equipment.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#2563eb]">{equipment.pricePerDay}€</div>
                      <div className="text-xs text-muted-foreground">par jour</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(equipment.status)}
                      {equipment.nextBooking && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {equipment.nextBooking}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{equipment.revenue30d}€</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{equipment.totalRentals}</span>
                        <span className="text-muted-foreground text-sm">•</span>
                        <span className="text-yellow-500 text-sm">⭐ {equipment.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Éditer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title="Masquer"
                        >
                          <EyeOff className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Calendrier de Réservations</h2>
            <p className="text-sm text-muted-foreground">Vue mensuelle - Janvier 2026</p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div key={day} className="text-center font-semibold text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Offset for January 2026 (starts Wednesday) */}
              {[null, null].map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Days */}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const hasEvent = calendarEvents.some((event) => {
                  const start = parseInt(event.startDate.split(' ')[0]);
                  const end = parseInt(event.endDate.split(' ')[0]);
                  return day >= start && day <= end;
                });

                const event = calendarEvents.find((e) => {
                  const start = parseInt(e.startDate.split(' ')[0]);
                  const end = parseInt(e.endDate.split(' ')[0]);
                  return day >= start && day <= end;
                });

                return (
                  <div
                    key={day}
                    className={`aspect-square border rounded-lg p-2 ${
                      hasEvent ? event?.color : 'hover:bg-muted'
                    } transition-colors cursor-pointer relative`}
                  >
                    <div className={`text-sm font-medium ${hasEvent ? 'text-white' : ''}`}>
                      {day}
                    </div>
                    {hasEvent && (
                      <div className="text-xs text-white/90 mt-1 truncate">
                        {event?.equipmentName.split(' ')[0]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Légende</h4>
              <div className="grid grid-cols-2 gap-3">
                {myEquipments.map((eq) => (
                  <div key={eq.id} className="flex items-center gap-2">
                    <div className="text-2xl">{eq.icon}</div>
                    <div>
                      <div className="text-sm font-medium">{eq.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {calendarEvents.filter((e) => e.equipmentId === eq.id).length}{' '}
                        réservation(s)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservations Tab */}
      {activeSubTab === 'reservations' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Gestion des Réservations</h2>
            <p className="text-sm text-muted-foreground">
              {reservations.length} réservation(s) au total
            </p>
          </div>

          <div className="bg-card border rounded-lg divide-y">
            {reservations.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg mb-2">Aucune réservation</h3>
                <p className="text-muted-foreground">
                  Les nouvelles demandes de réservation apparaîtront ici
                </p>
              </div>
            ) : (
              reservations.map((reservation) => (
                <div key={reservation.id} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{reservation.equipmentName}</h3>
                        {getReservationStatusBadge(reservation.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Locataire :</span>{' '}
                          <span className="font-medium">{reservation.renterName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Dates :</span>{' '}
                          <span className="font-medium">
                            {new Date(reservation.startDate).toLocaleDateString('fr-FR')} -{' '}
                            {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Durée :</span>{' '}
                          <span className="font-medium">{reservation.days} jours</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Montant :</span>{' '}
                          <span className="font-semibold text-[#2563eb]">
                            {reservation.totalPrice}€
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Demande envoyée le{' '}
                        {new Date(reservation.requestDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              onAcceptReservation(reservation.id);
                              toast.success('Réservation acceptée !');
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Accepter
                          </button>
                          <button
                            onClick={() => {
                              onRejectReservation(reservation.id);
                              toast.error('Réservation refusée');
                            }}
                            className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Refuser
                          </button>
                        </>
                      )}
                      <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm font-medium flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Contacter
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeSubTab === 'revenue' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Tableau de Bord Financier</h2>
            <p className="text-sm text-muted-foreground">Aperçu de vos revenus</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Revenus ce mois</h3>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold">3,932€</div>
              <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +18% vs mois dernier
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Prochain paiement</h3>
                <CalendarIcon className="h-5 w-5 text-[#2563eb]" />
              </div>
              <div className="text-3xl font-bold">1,260€</div>
              <div className="text-sm text-muted-foreground mt-1">31 janvier 2026</div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total des gains</h3>
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold">24,580€</div>
              <div className="text-sm text-muted-foreground mt-1">Depuis le début</div>
            </div>
          </div>

          {/* Revenue Chart (Mock) */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Revenus des 6 derniers mois</h3>
            <div className="h-64 flex items-end justify-around gap-4">
              {[2100, 2800, 2400, 3200, 3500, 3932].map((value, index) => {
                const months = ['Août', 'Sept', 'Oct', 'Nov', 'Déc', 'Jan'];
                const height = (value / 4000) * 100;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-[#2563eb] to-blue-400 rounded-t transition-all hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-sm font-medium">{value}€</div>
                    <div className="text-xs text-muted-foreground">{months[index]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Prochains paiements</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Location Tracteur - Marc Dubois</div>
                  <div className="text-sm text-muted-foreground">18-22 janvier</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#2563eb]">1,260€</div>
                  <div className="text-xs text-muted-foreground">Dans 8 jours</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Location Couveuse - Sophie Martin</div>
                  <div className="text-sm text-muted-foreground">22-29 janvier</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#2563eb]">196€</div>
                  <div className="text-xs text-muted-foreground">Dans 19 jours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
