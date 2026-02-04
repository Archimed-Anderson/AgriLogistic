import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Clock,
  Check,
  X,
  MessageCircle,
  AlertCircle,
  Sparkles,
  History,
  Send,
  Target,
  Calculator,
} from 'lucide-react';
import { toast } from 'sonner';

interface PriceNegotiatorProps {
  productName: string;
  originalPrice: number;
  minPrice?: number;
  sellerId: string;
  sellerName: string;
  onAccept?: (finalPrice: number) => void;
  onClose?: () => void;
  className?: string;
}

interface NegotiationOffer {
  id: string;
  type: 'buyer' | 'seller';
  price: number;
  timestamp: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
}

export function PriceNegotiator({
  productName,
  originalPrice,
  minPrice = originalPrice * 0.8,
  sellerId,
  sellerName,
  onAccept,
  onClose,
  className = '',
}: PriceNegotiatorProps) {
  const [proposedPrice, setProposedPrice] = useState(originalPrice * 0.9);
  const [message, setMessage] = useState('');
  const [offers, setOffers] = useState<NegotiationOffer[]>([]);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 heures en secondes
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'negotiate' | 'history'>('negotiate');

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const discountPercentage = ((originalPrice - proposedPrice) / originalPrice) * 100;
  const minDiscountPercentage = ((originalPrice - minPrice) / originalPrice) * 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProposedPrice(parseFloat(e.target.value));
  };

  const handlePropose = async () => {
    if (proposedPrice >= originalPrice) {
      toast.error('Votre offre doit être inférieure au prix initial');
      return;
    }

    setIsNegotiating(true);

    const newOffer: NegotiationOffer = {
      id: `offer-${Date.now()}`,
      type: 'buyer',
      price: proposedPrice,
      timestamp: new Date().toLocaleString('fr-FR'),
      message: message || undefined,
      status: 'pending',
    };

    setOffers([newOffer, ...offers]);
    setMessage('');

    // Simulation de réponse du vendeur
    setTimeout(() => {
      const counterPrice = Math.max(proposedPrice + (originalPrice - proposedPrice) / 2, minPrice);
      const randomResponse = Math.random();

      let sellerOffer: NegotiationOffer;

      if (proposedPrice >= minPrice) {
        // Acceptation
        sellerOffer = {
          id: `offer-${Date.now()}-seller`,
          type: 'seller',
          price: proposedPrice,
          timestamp: new Date().toLocaleString('fr-FR'),
          message: "J'accepte votre offre !",
          status: 'accepted',
        };
        toast.success(`Offre acceptée à ${proposedPrice}€ !`);
      } else if (randomResponse > 0.7) {
        // Contre-offre
        sellerOffer = {
          id: `offer-${Date.now()}-seller`,
          type: 'seller',
          price: counterPrice,
          timestamp: new Date().toLocaleString('fr-FR'),
          message: `Je peux vous proposer ${counterPrice.toFixed(2)}€. C'est mon meilleur prix.`,
          status: 'countered',
        };
        setProposedPrice(counterPrice);
        toast.info(`Contre-offre reçue: ${counterPrice.toFixed(2)}€`);
      } else {
        // Rejet
        sellerOffer = {
          id: `offer-${Date.now()}-seller`,
          type: 'seller',
          price: originalPrice,
          timestamp: new Date().toLocaleString('fr-FR'),
          message: 'Désolé, cette offre est trop basse. Pouvez-vous proposer un meilleur prix ?',
          status: 'rejected',
        };
        toast.error('Offre refusée. Essayez un prix plus élevé.');
      }

      setOffers((prev) => [sellerOffer, ...prev]);
      setIsNegotiating(false);
    }, 2000);
  };

  const handleAcceptCounter = (price: number) => {
    toast.success(`Contre-offre acceptée à ${price}€ !`);
    onAccept?.(price);
  };

  const handleRejectCounter = () => {
    toast.info('Contre-offre refusée. Continuez à négocier.');
  };

  const getRecommendedPrice = () => {
    return originalPrice * 0.85; // 15% de réduction recommandée
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Négocier le Prix</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avec {sellerName}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Product & Timer */}
      <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Produit</p>
            <p className="font-bold text-gray-900 dark:text-white">{productName}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-semibold">Expire dans</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          {[
            { id: 'negotiate', label: 'Négocier', icon: DollarSign },
            { id: 'history', label: 'Historique', icon: History, count: offers.length },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-semibold">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'negotiate' && (
          <div className="space-y-6">
            {/* Price Comparison */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prix initial</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{originalPrice}€</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Votre offre</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {proposedPrice.toFixed(2)}€
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm text-green-600 dark:text-green-400 mb-1">Économie</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  -{discountPercentage.toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ajustez votre offre
                </label>
                <button
                  onClick={() => setProposedPrice(getRecommendedPrice())}
                  className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-semibold"
                >
                  <Target className="h-3 w-3" />
                  Prix recommandé
                </button>
              </div>

              <input
                type="range"
                min={minPrice}
                max={originalPrice}
                step="0.01"
                value={proposedPrice}
                onChange={handleSliderChange}
                className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />

              <div className="flex items-center justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Min: {minPrice.toFixed(2)}€</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {proposedPrice.toFixed(2)}€
                </span>
                <span>Max: {originalPrice}€</span>
              </div>
            </div>

            {/* Recommended Price Alert */}
            {Math.abs(proposedPrice - getRecommendedPrice()) < 5 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Prix recommandé !
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ce prix a {Math.floor(Math.random() * 20 + 70)}% de chances d'être accepté par
                      le vendeur.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Message to Seller */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message au vendeur (optionnel)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Expliquez pourquoi vous proposez ce prix..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handlePropose}
                disabled={isNegotiating || proposedPrice >= originalPrice}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-500/30"
              >
                {isNegotiating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Proposer ce prix
                  </>
                )}
              </button>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Conseils de négociation
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Soyez respectueux et professionnel</li>
                    <li>• Justifiez votre offre avec des arguments solides</li>
                    <li>• Le vendeur peut accepter, refuser ou contre-proposer</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {offers.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-semibold">
                  Aucune offre pour le moment
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Commencez à négocier pour voir l'historique
                </p>
              </div>
            ) : (
              offers.map((offer) => (
                <div
                  key={offer.id}
                  className={`p-4 rounded-lg border-2 ${
                    offer.type === 'buyer'
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          offer.type === 'buyer'
                            ? 'bg-purple-100 dark:bg-purple-900/30'
                            : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}
                      >
                        {offer.type === 'buyer' ? (
                          <DollarSign className="h-4 w-4 text-purple-600" />
                        ) : (
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {offer.type === 'buyer' ? 'Vous' : sellerName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {offer.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {offer.price.toFixed(2)}€
                      </p>
                      {offer.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                          <Check className="h-3 w-3" />
                          Acceptée
                        </span>
                      )}
                      {offer.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                          <X className="h-3 w-3" />
                          Refusée
                        </span>
                      )}
                      {offer.status === 'countered' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
                          <TrendingUp className="h-3 w-3" />
                          Contre-offre
                        </span>
                      )}
                    </div>
                  </div>

                  {offer.message && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg">
                      "{offer.message}"
                    </p>
                  )}

                  {offer.type === 'seller' && offer.status === 'countered' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleAcceptCounter(offer.price)}
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Accepter
                      </button>
                      <button
                        onClick={handleRejectCounter}
                        className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
