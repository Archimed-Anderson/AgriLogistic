import { useState } from "react";
import {
  Edit,
  Eye,
  Heart,
  MapPin,
  ShoppingCart,
  Star,
  Trash2,
  Truck,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

interface ProductCardProps {
  product: any;
  viewMode: "grid" | "list";
  isFavorite: boolean;
  isComparing: boolean;
  onToggleFavorite: () => void;
  onToggleCompare: () => void;
  onAddToCart: () => void;
  onClick: () => void;
  isAdminMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onArchive: () => void;
}

function convertToCurrency(value: number, currency: "EUR" | "USD") {
  if (currency === "USD") {
    return value * 1.08;
  }
  return value;
}

function formatCurrency(value: number, currency: "EUR" | "USD") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

const traceabilityDescriptions: Record<string, string> = {
  Bio: "Produit certifié issu de l'agriculture biologique.",
  Local: "Produit provenant de producteurs locaux vérifiés.",
  AOP: "Appellation d'Origine Protégée, traçabilité renforcée.",
  Primeur: "Produit de saison avec chaîne logistique courte.",
  Fermier: "Production fermière avec suivi de la ferme à l'assiette.",
};

export function ProductCard({
  product,
  viewMode,
  isFavorite,
  isComparing,
  onToggleFavorite,
  onToggleCompare,
  onAddToCart,
  onClick,
  isAdminMode,
  isSelected,
  onToggleSelect,
  onEdit,
  onArchive,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currency, setCurrency] = useState<"EUR" | "USD">("EUR");

  const convertedPrice = convertToCurrency(product.price, currency);

  const getStockBadge = () => {
    if (product.archived) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">
          Archivé
        </span>
      );
    }

    switch (product.stock) {
      case "in-stock":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">
            En stock
          </span>
        );
      case "limited":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-medium rounded-full">
            Stock limité
          </span>
        );
      case "pre-order":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium rounded-full">
            Pré-commande
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">
            Rupture
          </span>
        );
    }
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        data-testid="product-card"
        className={`bg-card border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer flex gap-4 relative ${
          product.archived ? "opacity-60" : ""
        }`}
      >
        {isAdminMode && (
          <div
            className="absolute top-4 left-4 z-10"
            onClick={(event) => event.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              className="h-5 w-5 rounded border-gray-300"
              data-testid="select-product"
            />
          </div>
        )}

        <div className="relative h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg" data-testid="product-name">
                {product.name}
                {product.isNew && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-medium rounded-full">
                    Nouveau
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="product-category">
                {product.category}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#15803d]" data-testid="product-price">
                {formatCurrency(convertedPrice, currency)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const filled = index + 1 <= Math.floor(product.rating);
                const half =
                  !filled && index + 0.5 <= product.rating && product.rating < index + 1;
                return (
                  <span key={index} className="relative inline-flex">
                    <Star
                      className={`h-4 w-4 ${
                        filled || half
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                    {half && (
                      <span className="absolute inset-0 overflow-hidden w-1/2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </span>
                    )}
                  </span>
                );
              })}
              <span className="ml-1 font-medium" data-testid="product-rating">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">({product.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {product.seller.distance} km
            </div>
            {getStockBadge()}
          </div>
        </div>

        {isAdminMode && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="p-2 bg-[#15803d] text-white rounded-lg hover:bg-emerald-700 transition-colors"
              data-testid="edit-product"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onArchive();
              }}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      data-testid="product-card"
      data-product-id={product.id}
      className={`group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] hover:border-[#15803d] transition-all duration-300 cursor-pointer ${
        product.archived ? "opacity-60" : ""
      } ${isSelected ? "ring-2 ring-[#15803d] shadow-lg" : ""}`}
    >
      {isAdminMode && (
        <div
          className="absolute top-3 left-3 z-20"
          onClick={(event) => event.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-5 w-5 rounded border-gray-300 bg-white shadow-sm"
            data-testid="select-product"
          />
        </div>
      )}

      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden group-hover:shadow-inner">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? "scale-110 brightness-105" : "scale-100"
          }`}
          onError={(event) => {
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=400&fit=crop";
          }}
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {getStockBadge()}
          {product.fastDelivery && !product.archived && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-[#15803d] to-emerald-600 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
              <Truck className="h-3.5 w-3.5" />
              Livré demain
            </span>
          )}
          {product.isNew && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
              Nouveau
            </span>
          )}
        </div>

        {product.labels.length > 0 && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            {product.labels.slice(0, 2).map((label: string) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Badge
                    variant="default"
                    data-testid="product-label"
                    className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm cursor-help"
                  >
                    {label}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs leading-relaxed">
                  {traceabilityDescriptions[label] ??
                    "Informations de traçabilité vérifiées pour ce produit."}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}

        {isAdminMode && isHovered && (
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="p-2 bg-[#15803d] text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
              data-testid="edit-product"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onArchive();
              }}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}

        {!isAdminMode && isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent backdrop-blur-[2px] flex items-center justify-center gap-3 transition-all duration-300">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClick();
              }}
              className="px-6 py-3 bg-white/95 backdrop-blur-md text-[#15803d] rounded-full font-semibold hover:bg-white transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Voir détails
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onAddToCart();
              }}
              data-testid="add-to-cart"
              className="p-3 bg-[#15803d] text-white rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-xl hover:scale-110"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        )}

        {!isAdminMode && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
            data-testid="favorite-button"
            className={`absolute top-4 left-4 p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full hover:scale-110 transition-all duration-300 shadow-lg z-10 border border-white/20 ${
              isFavorite ? "active filled" : ""
            }`}
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-600 dark:text-gray-400"
              }`}
            />
          </button>
        )}

        {!isAdminMode && (
          <div className="absolute bottom-3 right-3">
            <input
              type="checkbox"
              checked={isComparing}
              onChange={(event) => {
                event.stopPropagation();
                onToggleCompare();
              }}
              className="rounded border-gray-300 h-5 w-5"
              title="Comparer"
              data-testid="compare-button"
            />
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <h3
            className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-[#15803d] transition-colors line-clamp-2"
            data-testid="product-name"
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {product.seller.name}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => {
                const filled = index + 1 <= Math.floor(product.rating);
                const half =
                  !filled && index + 0.5 <= product.rating && product.rating < index + 1;
                return (
                  <span key={index} className="relative inline-flex">
                    <Star
                      className={`h-4 w-4 ${
                        filled || half
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                      }`}
                    />
                    {half && (
                      <span className="absolute inset-0 overflow-hidden w-1/2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            <span className="ml-1 font-bold text-gray-900 dark:text-white" data-testid="product-rating">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 font-medium">
            <MapPin className="h-4 w-4" />
            <span className="text-xs">{product.seller.distance}km</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div
              className="text-3xl font-bold bg-gradient-to-r from-[#15803d] to-emerald-600 bg-clip-text text-transparent"
              data-testid="product-price"
            >
              {formatCurrency(convertedPrice, currency)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>/{product.unit}</span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrency(currency === "EUR" ? "USD" : "EUR");
                }}
                className="px-2 py-0.5 rounded-full border border-[#15803d]/40 text-[10px] text-[#15803d] hover:bg-[#15803d]/10 transition-colors"
              >
                {currency === "EUR" ? "Afficher en USD" : "Afficher en EUR"}
              </button>
            </div>
          </div>
          {!isAdminMode && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onAddToCart();
              }}
              data-testid="add-to-cart"
              className="p-3 bg-gradient-to-r from-[#15803d] to-emerald-600 text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
