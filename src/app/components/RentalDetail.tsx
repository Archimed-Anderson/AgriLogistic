import { useState } from 'react';
import {
  X,
  ChevronLeft,
  Star,
  MapPin,
  Shield,
  Calendar,
  Clock,
  CheckCircle2,
  MessageCircle,
  Heart,
  Share2,
  AlertCircle,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

interface RentalDetailProps {
  equipmentId: string;
  onBack: () => void;
  onReservationRequest: (
    equipmentId: string,
    startDate: Date,
    endDate: Date,
    totalPrice: number
  ) => void;
}

export function RentalDetail({ equipmentId, onBack, onReservationRequest }: RentalDetailProps) {
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // Janvier 2026
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Mock equipment data
  const equipment = {
    id: 'EQ-001',
    name: 'Tracteur John Deere 6250R',
    model: '6250R - 250 CV',
    category: 'Tracteur',
    pricePerDay: 450,
    pricePerWeek: 2800,
    deposit: 2000,
    location: 'Ferme du Soleil Levant, Lyon',
    distance: 12.5,
    rating: 4.8,
    totalRentals: 23,
    owner: {
      name: 'Pierre Moreau',
      memberSince: '2023',
      responseRate: 98,
      rating: 4.9,
      totalListings: 5,
    },
    description:
      'Tracteur récent équipé GPS, idéal pour grandes surfaces. Moteur puissant de 250 CV avec transmission PowerShift. Cabine climatisée et sièges pneumatiques pour un confort optimal. Maintenance régulière assurée, disponible avec ou sans outils selon vos besoins.',
    features: [
      'GPS intégré',
      'Transmission PowerShift',
      'Cabine climatisée',
      'Chargeur frontal disponible',
      'Attelage 3 points',
      'Prise de force 540/1000 tr/min',
    ],
    rules: [
      'Permis de conduire valide requis',
      'Carburant à la charge du locataire',
      'Retour propre exigé',
      'Assurance responsabilité civile requise',
    ],
    reviews: [
      {
        id: 1,
        author: 'Marc Dubois',
        rating: 5,
        date: 'Il y a 2 semaines',
        comment:
          'Excellent tracteur, très bien entretenu. Pierre est arrangeant et professionnel. Je recommande vivement !',
      },
      {
        id: 2,
        author: 'Sophie Martin',
        rating: 4,
        date: 'Il y a 1 mois',
        comment: 'Bon matériel, conforme à la description. Petit souci de GPS réglé rapidement.',
      },
    ],
  };

  // Jours indisponibles (1, 2, 3 janvier)
  const unavailableDates = [1, 2, 3];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const toggleDate = (day: number) => {
    if (unavailableDates.includes(day)) return;

    setSelectedDates((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day].sort((a, b) => a - b);
      }
    });
  };

  const calculateTotalPrice = () => {
    const days = selectedDates.length;
    if (days === 0) return 0;

    // Si 7 jours ou plus, utiliser le tarif semaine
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;

    return weeks * equipment.pricePerWeek + remainingDays * equipment.pricePerDay;
  };

  const totalPrice = calculateTotalPrice();

  const handleReservationRequest = () => {
    if (selectedDates.length === 0) {
      toast.error('Veuillez sélectionner au moins une date');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmReservation = () => {
    const startDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      selectedDates[0]
    );
    const endDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      selectedDates[selectedDates.length - 1]
    );

    onReservationRequest(equipment.id, startDate, endDate, totalPrice);
    setShowConfirmModal(false);
    toast.success('Demande de réservation envoyée !');
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        Retour à la liste
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 flex items-center justify-center">
              <div className="text-9xl">🚜</div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Equipment Info */}
          <div className="bg-card border rounded-lg p-6 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold">{equipment.name}</h1>
                  <p className="text-muted-foreground text-lg">{equipment.model}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#2563eb]">{equipment.pricePerDay}€</div>
                  <div className="text-sm text-muted-foreground">par jour</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {equipment.pricePerWeek}€/semaine
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{equipment.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(equipment.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{equipment.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({equipment.totalRentals} avis)
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="font-semibold text-lg mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{equipment.description}</p>
            </div>

            <div className="border-t pt-6">
              <h2 className="font-semibold text-lg mb-3">Caractéristiques</h2>
              <div className="grid grid-cols-2 gap-3">
                {equipment.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="font-semibold text-lg mb-3">Conditions de location</h2>
              <div className="space-y-2">
                {equipment.rules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{rule}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-[#2563eb]" />
                  <span className="font-medium">Dépôt de garantie</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Un dépôt de{' '}
                  <span className="font-semibold text-foreground">{equipment.deposit}€</span> sera
                  demandé et remboursé après inspection du matériel.
                </p>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-4">À propos du loueur</h2>
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-[#2563eb] to-blue-400 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{equipment.owner.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Membre depuis {equipment.owner.memberSince}
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium">{equipment.owner.rating} ⭐</div>
                    <div className="text-muted-foreground">Note</div>
                  </div>
                  <div>
                    <div className="font-medium">{equipment.owner.responseRate}%</div>
                    <div className="text-muted-foreground">Taux de réponse</div>
                  </div>
                  <div>
                    <div className="font-medium">{equipment.owner.totalListings}</div>
                    <div className="text-muted-foreground">Équipements</div>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Contacter
              </button>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-4">Avis des locataires</h2>
            <div className="space-y-4">
              {equipment.reviews.map((review) => (
                <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{review.author}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reservation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6 sticky top-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Calendrier de disponibilité</h3>

              {/* Month Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                    )
                  }
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="font-medium capitalize">{monthName}</span>
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                    )
                  }
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </button>
              </div>

              {/* Calendar */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                  <div key={day} className="text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}

                {/* Empty cells for offset */}
                {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isUnavailable = unavailableDates.includes(day);
                  const isSelected = selectedDates.includes(day);

                  return (
                    <button
                      key={day}
                      onClick={() => toggleDate(day)}
                      disabled={isUnavailable}
                      className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                        isUnavailable
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#2563eb] text-white font-semibold'
                          : 'hover:bg-muted cursor-pointer'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gray-100 dark:bg-gray-800 rounded" />
                  <span className="text-muted-foreground">Indisponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-[#2563eb] rounded" />
                  <span className="text-muted-foreground">Sélectionné</span>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Jours sélectionnés</span>
                <span className="font-semibold">{selectedDates.length} jour(s)</span>
              </div>

              {selectedDates.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {selectedDates.length} × {equipment.pricePerDay}€
                    </span>
                    <span className="font-medium">
                      {selectedDates.length * equipment.pricePerDay}€
                    </span>
                  </div>

                  {selectedDates.length >= 7 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span className="text-sm">Remise semaine appliquée</span>
                      <span className="font-medium">
                        -{selectedDates.length * equipment.pricePerDay - totalPrice}€
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-[#2563eb]">{totalPrice}€</span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    + {equipment.deposit}€ de dépôt de garantie (remboursable)
                  </div>
                </>
              )}

              {selectedDates.length === 0 && (
                <div className="text-center py-4">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez des dates pour voir le prix total
                  </p>
                </div>
              )}

              <button
                onClick={handleReservationRequest}
                disabled={selectedDates.length === 0}
                className="w-full px-4 py-3 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Demander à louer
              </button>

              <p className="text-xs text-center text-muted-foreground">
                Vous ne serez pas débité immédiatement
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Confirmer la demande de location</h2>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Équipement</span>
                  <span className="font-medium">{equipment.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dates</span>
                  <span className="font-medium">
                    {selectedDates.length} jour(s) en {monthName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix total</span>
                  <span className="font-bold text-[#2563eb]">{totalPrice}€</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Dépôt de garantie</span>
                  <span className="font-medium">+{equipment.deposit}€</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-[#2563eb] mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Prochaines étapes</p>
                  <p className="text-muted-foreground">
                    Votre demande sera envoyée à {equipment.owner.name}. Vous recevrez une réponse
                    sous 24h. Le paiement ne sera demandé qu'après acceptation.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmReservation}
                className="flex-1 px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium"
              >
                Confirmer la demande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
