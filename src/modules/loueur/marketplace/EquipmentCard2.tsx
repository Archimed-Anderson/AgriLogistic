import { useState } from "react";
import {
  MapPin,
  Star,
  TrendingUp,
  Wifi,
  Shield,
  Clock,
  Heart,
  Share2,
  ChevronRight,
  Zap,
  Award,
  Activity,
} from "lucide-react";
import type { Equipment } from "../types";

interface EquipmentCard2Props {
  equipment: Equipment;
  onClick: () => void;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export function EquipmentCard2({ equipment, onClick, onFavorite, isFavorite }: EquipmentCard2Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const getStatusColor = (status: Equipment["status"]) => {
    const colors = {
      available: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      reserved: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
      "in-use": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      maintenance: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
      unavailable: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    };
    return colors[status] || colors.unavailable;
  };

  const getStatusLabel = (status: Equipment["status"]) => {
    const labels = {
      available: "Disponible",
      reserved: "Réservé",
      "in-use": "En utilisation",
      maintenance: "Maintenance",
      unavailable: "Indisponible",
    };
    return labels[status] || status;
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(equipment.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: equipment.name,
        text: equipment.description,
        url: window.location.href,
      });
    }
  };

  return (
    <div
      className="group bg-card border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer relative"
      onClick={onClick}
      onMouseEnter={() => setShowQuickView(true)}
      onMouseLeave={() => setShowQuickView(false)}
    >
      {/* Image Container with 3D Preview */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Equipment Image */}
        {equipment.images && equipment.images[0] ? (
          <img
            src={equipment.images[0]}
            alt={equipment.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-40">
            {equipment.category === "Tracteur" && "🚜"}
            {equipment.category === "Couveuse" && "🥚"}
            {equipment.category === "Remorque" && "🚛"}
            {equipment.category === "Scie" && "🪚"}
            {equipment.category === "Pulvérisateur" && "💧"}
            {equipment.category === "Outil" && "🔧"}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(
              equipment.status
            )}`}
          >
            {getStatusLabel(equipment.status)}
          </span>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleFavorite}
              className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform shadow-lg"
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"}`}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform shadow-lg"
            >
              <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-black/50 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            {equipment.category}
          </span>
        </div>

        {/* IoT & Features Badges */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          {equipment.iotEnabled && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/90 text-white rounded-full backdrop-blur-sm text-xs">
              <Wifi className="h-3 w-3" />
              <span className="font-medium">IoT</span>
            </div>
          )}
          {equipment.insurance && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/90 text-white rounded-full backdrop-blur-sm text-xs">
              <Shield className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* Quick View Overlay */}
        {showQuickView && (
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent transform translate-y-0 transition-transform duration-300">
            <div className="text-white space-y-2">
              <p className="text-sm line-clamp-2">{equipment.description}</p>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{equipment.totalRentals} locations</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  <span>{equipment.reliabilityScore}% fiabilité</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title & Model */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-lg leading-tight group-hover:text-[#2563eb] transition-colors line-clamp-1">
              {equipment.name}
            </h3>
            {equipment.owner.verified && (
              <div className="flex-shrink-0 mt-0.5" title="Propriétaire vérifié">
                <Award className="h-5 w-5 text-blue-500" />
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{equipment.model}</p>
          {equipment.brand && (
            <p className="text-xs text-muted-foreground mt-0.5">{equipment.brand}</p>
          )}
        </div>

        {/* Rating & Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(equipment.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold">{equipment.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({equipment.totalRentals})</span>
          </div>

          {equipment.reliabilityScore >= 90 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
              <Zap className="h-3 w-3" />
              <span>Top</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{equipment.location.city}</span>
          {equipment.distance !== undefined && (
            <span className="text-xs">• {equipment.distance.toFixed(1)} km</span>
          )}
        </div>

        {/* Real-time IoT Data (if available) */}
        {equipment.iotEnabled && equipment.iotData?.currentData && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                Données en temps réel
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Carburant:</span>
                <span className="ml-1 font-medium">{equipment.iotData.currentData.fuelLevel}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Heures:</span>
                <span className="ml-1 font-medium">{equipment.iotData.currentData.engineHours}h</span>
              </div>
            </div>
          </div>
        )}

        {/* Features/Tags (max 3) */}
        {equipment.features && equipment.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {equipment.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground"
              >
                {feature}
              </span>
            ))}
            {equipment.features.length > 3 && (
              <span className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground">
                +{equipment.features.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#2563eb]">
                {equipment.pricePerDay}€
              </span>
              {equipment.dynamicPricing && (
                <div title="Prix dynamique activé">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">par jour</div>
            {equipment.pricePerWeek && (
              <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                {equipment.pricePerWeek}€/sem
              </div>
            )}
          </div>
          <button className="px-4 py-2.5 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-all flex items-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg">
            Réserver
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-3 pt-3 border-t">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#2563eb] to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {equipment.owner.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{equipment.owner.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{equipment.owner.rating.toFixed(1)} ⭐</span>
              <span>•</span>
              <span>{equipment.owner.totalEquipments} équipements</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
