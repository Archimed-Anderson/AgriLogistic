import { useState } from "react";
import {
  MapPin,
  Navigation,
  Package,
  Clock,
  DollarSign,
  Truck,
  Calculator,
  AlertCircle,
  Check,
  Zap,
  Calendar,
  Map,
  ArrowRight,
  Bookmark,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface TransportCalculatorProps {
  productName?: string;
  productWeight?: number;
  onReserve?: (details: TransportQuote) => void;
  compact?: boolean;
  className?: string;
}

interface TransportQuote {
  origin: string;
  destination: string;
  merchandiseType: string;
  urgency: string;
  distance: number;
  estimatedCost: number;
  estimatedDays: number;
  carrier: string;
}

export function TransportCalculator({
  productName,
  productWeight,
  onReserve,
  compact = false,
  className = "",
}: TransportCalculatorProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [merchandiseType, setMerchandiseType] = useState("standard");
  const [urgency, setUrgency] = useState("standard");
  const [quote, setQuote] = useState<TransportQuote | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const merchandiseTypes = [
    { value: "standard", label: "Standard", icon: Package },
    { value: "perishable", label: "Périssable", icon: AlertCircle, color: "text-orange-600" },
    { value: "bulk", label: "Volumineux", icon: Truck, color: "text-blue-600" },
    { value: "fragile", label: "Fragile", icon: AlertCircle, color: "text-red-600" },
  ];

  const urgencyLevels = [
    { value: "standard", label: "Standard (3-5 jours)", price: 1, icon: Clock },
    { value: "express", label: "Express (1-2 jours)", price: 1.5, icon: Zap },
    { value: "urgent", label: "Urgent (24h)", price: 2, icon: AlertCircle },
  ];

  const calculateTransport = async () => {
    if (!origin || !destination) {
      toast.error("Veuillez renseigner l'adresse de départ et d'arrivée");
      return;
    }

    setIsCalculating(true);

    // Simulation de calcul avec API TomTom
    setTimeout(() => {
      const baseDistance = Math.floor(Math.random() * 500) + 50;
      const baseCost = baseDistance * 1.2;
      
      const merchandiseMultiplier = merchandiseType === "perishable" ? 1.3 : 
                                     merchandiseType === "bulk" ? 1.4 : 
                                     merchandiseType === "fragile" ? 1.2 : 1;
      
      const urgencyMultiplier = urgency === "express" ? 1.5 : 
                                 urgency === "urgent" ? 2 : 1;
      
      const totalCost = baseCost * merchandiseMultiplier * urgencyMultiplier;
      const estimatedDays = urgency === "urgent" ? 1 : urgency === "express" ? 2 : 4;

      const newQuote: TransportQuote = {
        origin,
        destination,
        merchandiseType,
        urgency,
        distance: baseDistance,
        estimatedCost: Math.round(totalCost),
        estimatedDays,
        carrier: "AgriGator Express",
      };

      setQuote(newQuote);
      setIsCalculating(false);
      toast.success("Coût de transport calculé avec succès !");
    }, 1500);
  };

  const handleReserve = () => {
    if (quote) {
      onReserve?.(quote);
      toast.success("Demande de réservation envoyée !");
    }
  };

  const handleSaveQuote = () => {
    if (quote) {
      toast.success("Devis sauvegardé dans vos favoris");
    }
  };

  if (compact) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Calculer le transport</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Adresse de livraison
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ville ou code postal"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={calculateTransport}
            disabled={isCalculating}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Calcul en cours...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4" />
                Calculer le coût
              </>
            )}
          </button>

          {quote && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Coût estimé</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{quote.estimatedCost}€</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Délai</span>
                <span className="font-semibold text-gray-900 dark:text-white">{quote.estimatedDays} jours</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Calculateur de Transport</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Optimisé par TomTom & AgriGator</p>
            </div>
          </div>
          {productName && (
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pour le produit</p>
              <p className="font-semibold text-gray-900 dark:text-white">{productName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Adresse de départ
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Ville, code postal ou adresse complète"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Navigation className="inline h-4 w-4 mr-1" />
              Adresse d'arrivée
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Ville, code postal ou adresse complète"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Merchandise Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Type de marchandise
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {merchandiseTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setMerchandiseType(type.value)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    merchandiseType === type.value
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${type.color || "text-gray-600"}`} />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Urgency Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Urgence de livraison
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {urgencyLevels.map((level) => {
              const Icon = level.icon;
              return (
                <button
                  key={level.value}
                  onClick={() => setUrgency(level.value)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    urgency === level.value
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-5 w-5 text-gray-600" />
                    {level.price > 1 && (
                      <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                        +{Math.round((level.price - 1) * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{level.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateTransport}
          disabled={isCalculating}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-green-500/30"
        >
          {isCalculating ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent" />
              Calcul en cours avec TomTom...
            </>
          ) : (
            <>
              <Calculator className="h-6 w-6" />
              Calculer le coût de transport
            </>
          )}
        </button>

        {/* Quote Result */}
        {quote && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Check className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Devis de transport</h3>
                </div>
                <button
                  onClick={handleSaveQuote}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <Bookmark className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Main Quote Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Coût total</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{quote.estimatedCost}€</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Délai estimé</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{quote.estimatedDays}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">jours ouvrés</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Map className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Distance</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{quote.distance}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">kilomètres</p>
                </div>
              </div>

              {/* Route Details */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Départ</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{quote.origin}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Arrivée</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{quote.destination}</p>
                  </div>
                </div>
              </div>

              {/* Carrier Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{quote.carrier}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Transporteur certifié</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReserve}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                >
                  <Check className="h-5 w-5" />
                  Réserver ce transport
                </button>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold flex items-center gap-2"
                >
                  <Map className="h-5 w-5" />
                  {showMap ? "Masquer" : "Voir"} carte
                </button>
              </div>
            </div>

            {/* Map View */}
            {showMap && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
                <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Carte interactive TomTom</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Itinéraire optimisé : {quote.origin} → {quote.destination}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
