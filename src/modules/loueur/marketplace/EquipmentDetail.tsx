/**
 * =======================================================
 * EQUIPMENT DETAIL PAGE
 * =======================================================
 * Complete equipment detail view with:
 * - High-quality images gallery
 * - Full specifications
 * - Real-time availability
 * - IoT data display
 * - Reviews and ratings
 * - Booking integration
 */

import { useState } from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Shield,
  Wifi,
  Activity,
  Award,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Wrench,
  FileText,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Info,
  Zap,
  Gauge,
  Droplet,
  Thermometer,
} from "lucide-react";
import type { Equipment } from "../types";
import { BookingWizard, BookingData } from "../reservation/BookingWizard";
import { AvailabilityCalendar } from "../reservation/AvailabilityCalendar";
import { generateMockAvailability, getConstraintsByCategory } from "../data/mockAvailability";

interface EquipmentDetailProps {
  equipment: Equipment;
  onBack: () => void;
  onBookingComplete: (booking: BookingData) => void;
}

export function EquipmentDetail({
  equipment,
  onBack,
  onBookingComplete,
}: EquipmentDetailProps) {
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Generate availability data
  const availability = generateMockAvailability(equipment.id);
  const constraints = getConstraintsByCategory(equipment.category);
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | undefined>();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % equipment.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + equipment.images.length) % equipment.images.length
    );
  };

  const handleBookingComplete = (booking: BookingData) => {
    setShowBookingWizard(false);
    onBookingComplete(booking);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Retour</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images & Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
              {equipment.images && equipment.images.length > 0 ? (
                <>
                  <img
                    src={equipment.images[currentImageIndex]}
                    alt={equipment.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Image Navigation */}
                  {equipment.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {equipment.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                              index === currentImageIndex
                                ? "w-8 bg-white"
                                : "w-2 bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🚜
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Disponible
                </span>
              </div>
            </div>

            {/* IoT Real-time Data */}
            {equipment.iotEnabled && equipment.iotData?.currentData && (
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Données en temps réel
                  </h3>
                  <span className="ml-auto text-xs text-blue-600 dark:text-blue-400">
                    Mis à jour il y a 5 min
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Carburant</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {equipment.iotData.currentData.fuelLevel}%
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-muted-foreground">Heures moteur</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {equipment.iotData.currentData.engineHours}h
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-muted-foreground">Température</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {equipment.iotData.currentData.temperature}°C
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">Localisation</span>
                    </div>
                    <div className="text-sm font-medium text-green-600">GPS actif</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details & Booking */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <h1 className="text-3xl font-bold flex-1">{equipment.name}</h1>
                {equipment.owner.verified && (
                  <div title="Propriétaire vérifié">
                    <Award className="h-6 w-6 text-blue-500" />
                  </div>
                )}
              </div>
              <p className="text-lg text-muted-foreground mb-2">{equipment.model}</p>
              <p className="text-sm text-muted-foreground">{equipment.brand}</p>

              {/* Rating */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(equipment.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{equipment.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({equipment.totalRentals} locations)
                  </span>
                </div>

                {equipment.reliabilityScore >= 90 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                    <Zap className="h-4 w-4" />
                    <span>Top Qualité</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Card */}
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border-2 border-green-200 dark:border-green-800">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-green-600">
                  {equipment.pricePerDay} €
                </span>
                <span className="text-muted-foreground">/ jour</span>
              </div>

              {equipment.pricePerWeek && (
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    {equipment.pricePerWeek} € / semaine (-10%)
                  </span>
                </div>
              )}

              {equipment.pricePerMonth && (
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 mb-4">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    {equipment.pricePerMonth} € / mois (-25%)
                  </span>
                </div>
              )}

              <button
                onClick={() => setShowBookingWizard(true)}
                className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Réserver maintenant
              </button>

              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                {showCalendar ? "Masquer le calendrier" : "Voir le calendrier complet"}
              </button>

              <p className="text-xs text-center text-muted-foreground mt-3">
                Annulation gratuite jusqu'à 48h avant
              </p>
            </div>

            {/* Features & Badges */}
            <div className="flex flex-wrap gap-2">
              {equipment.iotEnabled && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  <Wifi className="h-4 w-4" />
                  <span>IoT Connecté</span>
                </div>
              )}
              {equipment.insurance && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                  <Shield className="h-4 w-4" />
                  <span>Assuré</span>
                </div>
              )}
              <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                <Activity className="h-4 w-4" />
                <span>Fiabilité {equipment.reliabilityScore}%</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 bg-muted/30 rounded-xl">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-[#2563eb]" />
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">{equipment.description}</p>
            </div>

            {/* Specifications */}
            <div className="p-6 bg-muted/30 rounded-xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#2563eb]" />
                Spécifications techniques
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(equipment.specifications).map(([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <div className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className="font-medium">{value as string}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features List */}
            {equipment.features && equipment.features.length > 0 && (
              <div className="p-6 bg-muted/30 rounded-xl">
                <h3 className="font-semibold mb-4">Équipements inclus</h3>
                <div className="grid grid-cols-2 gap-3">
                  {equipment.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Maintenance History */}
            {equipment.maintenance && equipment.maintenance.length > 0 && (
              <div className="p-6 bg-muted/30 rounded-xl">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-[#2563eb]" />
                  Historique de maintenance
                </h3>
                <div className="space-y-3">
                  {equipment.maintenance.slice(0, 3).map((record) => (
                    <div key={record.id} className="flex items-start gap-3 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{record.description}</div>
                        <div className="text-muted-foreground">
                          {new Date(record.date).toLocaleDateString("fr-FR")} •{" "}
                          {record.performedBy}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Info */}
            <div className="p-6 bg-muted/30 rounded-xl">
              <h3 className="font-semibold mb-4">Propriétaire</h3>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#2563eb] to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {equipment.owner.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-lg">{equipment.owner.name}</p>
                    {equipment.owner.verified && (
                      <CheckCircle2 className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{equipment.owner.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{equipment.owner.totalEquipments} équipements</span>
                    <span>•</span>
                    <span>Répond en {equipment.owner.responseTime}</span>
                  </div>
                  {equipment.owner.badges && equipment.owner.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {equipment.owner.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Availability Calendar Section */}
      {showCalendar && (
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <AvailabilityCalendar
            equipmentId={equipment.id}
            equipmentName={equipment.name}
            basePrice={equipment.pricePerDay}
            peakPrice={equipment.dynamicPricing.peak}
            availability={availability}
            constraints={constraints}
            selectedRange={selectedDateRange}
            onDateSelect={(start, end) => {
              setSelectedDateRange({ start, end });
              setShowCalendar(false);
              setShowBookingWizard(true);
            }}
          />
        </div>
      )}

      {/* Booking Wizard Modal */}
      {showBookingWizard && (
        <BookingWizard
          equipment={equipment}
          onComplete={handleBookingComplete}
          onCancel={() => setShowBookingWizard(false)}
        />
      )}
    </div>
  );
}
