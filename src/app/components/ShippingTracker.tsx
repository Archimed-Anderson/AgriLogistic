import { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Clock,
  Phone,
  User,
  Navigation,
  AlertCircle,
  Calendar,
  Mail,
  MessageCircle,
  Download,
  Share2,
  Map,
} from 'lucide-react';
import { toast } from 'sonner';

interface ShippingTrackerProps {
  trackingNumber?: string;
  onContactCarrier?: () => void;
  className?: string;
}

interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  icon: any;
  completed: boolean;
}

interface CarrierInfo {
  name: string;
  phone: string;
  email: string;
  driver: string;
  vehicleNumber: string;
}

export function ShippingTracker({
  trackingNumber = 'AGR-2024-001234',
  onContactCarrier,
  className = '',
}: ShippingTrackerProps) {
  const [showMap, setShowMap] = useState(false);
  const [activeTab, setActiveTab] = useState<'progress' | 'history' | 'details'>('progress');

  // Données de démonstration
  const currentStatus = 'in-transit';
  const estimatedDelivery = 'Demain, 15 Janvier 2026';
  const progress = 60; // Pourcentage de progression

  const trackingStages = [
    {
      id: '1',
      status: 'Commande confirmée',
      icon: CheckCircle,
      completed: true,
      timestamp: '11 Jan, 14:30',
    },
    {
      id: '2',
      status: 'Préparation',
      icon: Package,
      completed: true,
      timestamp: '11 Jan, 16:45',
    },
    {
      id: '3',
      status: 'En route',
      icon: Truck,
      completed: true,
      timestamp: '12 Jan, 08:20',
      current: true,
    },
    {
      id: '4',
      status: 'Livraison',
      icon: CheckCircle,
      completed: false,
      timestamp: 'Estimé: 15 Jan',
    },
  ];

  const trackingHistory: TrackingEvent[] = [
    {
      id: '1',
      status: 'En route vers destination',
      location: 'Lyon, France',
      timestamp: '14 Jan 2026, 10:30',
      description: 'Le colis est actuellement en transit',
      icon: Truck,
      completed: false,
    },
    {
      id: '2',
      status: 'Arrivé au centre de tri',
      location: 'Paris, France',
      timestamp: '13 Jan 2026, 18:45',
      description: 'Tri et préparation pour livraison',
      icon: Package,
      completed: true,
    },
    {
      id: '3',
      status: 'Colis collecté',
      location: 'Toulouse, France',
      timestamp: '12 Jan 2026, 08:20',
      description: 'Récupéré par le transporteur',
      icon: CheckCircle,
      completed: true,
    },
    {
      id: '4',
      status: 'Commande préparée',
      location: 'Toulouse, France',
      timestamp: '11 Jan 2026, 16:45',
      description: 'Emballage et étiquetage terminés',
      icon: Package,
      completed: true,
    },
  ];

  const carrierInfo: CarrierInfo = {
    name: 'AgriGator Express',
    phone: '+33 1 23 45 67 89',
    email: 'contact@agrigator.com',
    driver: 'Jean Dupont',
    vehicleNumber: 'FR-1234-AB',
  };

  const handleContactCarrier = () => {
    onContactCarrier?.();
    toast.success('Demande de contact envoyée au transporteur');
  };

  const handleDownloadReceipt = () => {
    toast.success('Reçu de livraison téléchargé');
  };

  const handleShareTracking = () => {
    toast.success('Lien de suivi copié dans le presse-papiers');
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Suivi de Livraison
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Numéro: {trackingNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShareTracking}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Partager"
            >
              <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Télécharger"
            >
              <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Estimated Delivery Banner */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Livraison prévue</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{estimatedDelivery}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
              <Truck className="h-4 w-4" />
              En transit
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          {[
            { id: 'progress', label: 'Progression', icon: Navigation },
            { id: 'history', label: 'Historique', icon: Clock },
            { id: 'details', label: 'Détails', icon: Package },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progression
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {progress}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Tracking Stages */}
            <div className="space-y-4">
              {trackingStages.map((stage, index) => {
                const Icon = stage.icon;
                const isLast = index === trackingStages.length - 1;
                return (
                  <div key={stage.id} className="flex items-start gap-4">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          stage.completed
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : stage.current
                            ? 'bg-blue-100 dark:bg-blue-900/30 ring-4 ring-blue-500/20'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            stage.completed
                              ? 'text-green-600 dark:text-green-400'
                              : stage.current
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                      {!isLast && (
                        <div
                          className={`absolute left-6 top-12 w-0.5 h-12 ${
                            stage.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-semibold ${
                            stage.current
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {stage.status}
                        </h3>
                        {stage.current && (
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                            En cours
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {stage.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Toggle */}
            <button
              onClick={() => setShowMap(!showMap)}
              className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Map className="h-5 w-5" />
              {showMap ? 'Masquer' : 'Voir'} la carte GPS
            </button>

            {showMap && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
                <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-semibold">
                  Carte GPS en temps réel
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Position actuelle: Lyon, France
                </p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {trackingHistory.map((event) => {
              const Icon = event.icon;
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      event.completed
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        event.completed
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {event.status}
                      </h3>
                      {!event.completed && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                          Actuel
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <Clock className="h-3 w-3" />
                      <span>{event.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Carrier Information */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                Informations Transporteur
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Société</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {carrierInfo.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Chauffeur</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {carrierInfo.driver}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Véhicule</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {carrierInfo.vehicleNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleContactCarrier}
                className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <Phone className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Téléphone</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{carrierInfo.phone}</p>
                </div>
              </button>

              <button
                onClick={handleContactCarrier}
                className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Mail className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{carrierInfo.email}</p>
                </div>
              </button>
            </div>

            {/* Chat Option */}
            <button
              onClick={handleContactCarrier}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <MessageCircle className="h-5 w-5" />
              Contacter le transporteur par chat
            </button>

            {/* Delivery Instructions */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Instructions de livraison
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Veuillez livrer au dépôt principal. Signature requise à la réception.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
