import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { ProductCard } from "../cards/ProductCard";
import { Badge } from "../../ui/badge";

interface ProductGridProps {
  products: any[];
  viewMode: "grid" | "list" | "map";
  favorites: string[];
  compareProducts: string[];
  selectedForEdit: string[];
  isAdminMode: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onAddToCart: (id: string) => void;
  onProductClick: (product: any) => void;
  onToggleSelect: (id: string) => void;
  onEditProduct: (product: any) => void;
  onArchiveProduct: (id: string) => void;
}

export function ProductGrid({
  products,
  viewMode,
  favorites,
  compareProducts,
  selectedForEdit,
  isAdminMode,
  onToggleFavorite,
  onToggleCompare,
  onAddToCart,
  onProductClick,
  onToggleSelect,
  onEditProduct,
  onArchiveProduct,
}: ProductGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setVisibleCount(Math.min(products.length, 24));
  }, [products]);

  const layoutClass =
    viewMode === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 grid"
      : "flex flex-col gap-4 list";

  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount],
  );

  const markerPositions = useMemo(
    () =>
      visibleProducts.map((_, index) => {
        const base = index * 37;
        const top = 15 + (base % 70);
        const left = 10 + ((base * 2) % 80);
        return { top, left };
      }),
    [visibleProducts],
  );

  const handleScroll = () => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = node;
    if (scrollTop + clientHeight >= scrollHeight - 200 && visibleCount < products.length) {
      setVisibleCount((current) => Math.min(products.length, current + 24));
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`max-h-[900px] overflow-auto ${
        viewMode === "map" ? "" : layoutClass
      }`}
      data-testid="product-container"
    >
      {viewMode === "map" ? (
        <div className="relative h-[600px] rounded-xl border bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-emerald-900/40 overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <div className="grid h-full w-full grid-cols-6 gap-px">
              {Array.from({ length: 36 }).map((_, index) => (
                <div
                  key={index}
                  className="border border-emerald-200/40 dark:border-emerald-700/40"
                />
              ))}
            </div>
          </div>
          {visibleProducts.map((product, index) => {
            const position = markerPositions[index];
            return (
              <button
                key={product.id}
                type="button"
                style={{
                  top: `${position.top}%`,
                  left: `${position.left}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                onClick={() => onProductClick(product)}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/30 p-2">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg bg-background/90 px-2 py-1 text-xs shadow-md border border-border/60 min-w-[140px] max-w-[180px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">
                        {product.name}
                      </span>
                      {typeof product.price === "number" && (
                        <span className="text-[11px] font-semibold text-primary">
                          {product.price}€
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground truncate">
                        {product.seller?.location || "Localisation inconnue"}
                      </span>
                      {product.seller?.distance != null && (
                        <Badge className="px-1.5 py-0 text-[10px]">
                          {product.seller.distance} km
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            isFavorite={favorites.includes(product.id)}
            isComparing={compareProducts.includes(product.id)}
            onToggleFavorite={() => onToggleFavorite(product.id)}
            onToggleCompare={() => onToggleCompare(product.id)}
            onAddToCart={() => onAddToCart(product.id)}
            onClick={() => onProductClick(product)}
            isAdminMode={isAdminMode}
            isSelected={selectedForEdit.includes(product.id)}
            onToggleSelect={() => onToggleSelect(product.id)}
            onEdit={() => onEditProduct(product)}
            onArchive={() => onArchiveProduct(product.id)}
          />
        ))
      )}
    </div>
  );
}
