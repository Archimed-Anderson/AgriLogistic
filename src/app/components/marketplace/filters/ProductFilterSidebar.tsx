import { useMemo, useState } from 'react';
import { ChevronRight, History, Plus, SlidersHorizontal, Sparkles, Star } from 'lucide-react';

export type PriceRange = [number, number];

export interface QuickFilter {
  id: string;
  name: string;
  description: string;
  apply: () => void;
}

export interface SavedFilterPreset {
  id: string;
  name: string;
  filters: {
    categories: string[];
    priceRange: PriceRange;
    maxDistance: number;
    minRating: number;
    labels: string[];
  };
}

export interface ProductFilterSidebarProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
  maxDistance: number;
  onMaxDistanceChange: (distance: number) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  selectedLabels: string[];
  onLabelsChange: (labels: string[]) => void;
  onClearAll: () => void;
  categories: { id: string; name: string; icon?: string }[];
  isAdminMode: boolean;
  editingCategory: string | null;
  onEditCategory: (id: string | null) => void;
  categoryMenuOpen: string | null;
  onCategoryMenuOpen: (id: string | null) => void;
  onRenameCategory: (id: string, name: string) => void;
  savedFilterPresets: SavedFilterPreset[];
  quickFilters: QuickFilter[];
  onLoadPreset: (preset: SavedFilterPreset) => void;
  onDeletePreset: (id: string) => void;
  onSaveCurrentFilters: () => void;
}

export function ProductFilterSidebar({
  selectedCategories,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  maxDistance,
  onMaxDistanceChange,
  minRating,
  onMinRatingChange,
  selectedLabels,
  onLabelsChange,
  onClearAll,
  categories,
  isAdminMode,
  editingCategory,
  onEditCategory,
  categoryMenuOpen,
  onCategoryMenuOpen,
  onRenameCategory,
  savedFilterPresets,
  quickFilters,
  onLoadPreset,
  onDeletePreset,
  onSaveCurrentFilters,
}: ProductFilterSidebarProps) {
  const labels = ['Bio', 'Local', 'Primeur', 'Fermier', 'AOP'];
  const [categoryRename, setCategoryRename] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  const hasActiveFilters = useMemo(
    () =>
      selectedCategories.length > 0 ||
      priceRange[0] !== 0 ||
      priceRange[1] !== 100 ||
      maxDistance !== 50 ||
      minRating > 0 ||
      selectedLabels.length > 0,
    [selectedCategories, priceRange, maxDistance, minRating, selectedLabels]
  );

  return (
    <aside className="bg-card border rounded-lg p-6 sticky top-6 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-[#15803d]" />
          Filtres
        </h2>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onSaveCurrentFilters}
              className="p-2 text-[#15803d] hover:bg-[#15803d]/10 rounded-lg transition-colors"
              title="Enregistrer ces filtres"
              data-testid="save-filters-button"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-[#15803d] hover:underline"
            data-testid="clear-filters"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#15803d]" />
          Filtres rapides
        </div>
        <div className="grid grid-cols-2 gap-2" data-testid="label-filter">
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={filter.apply}
              className="p-3 border rounded-lg hover:border-[#15803d] hover:bg-[#15803d]/5 transition-all text-left group"
              title={filter.description}
              data-testid={`quick-filter-${filter.id}`}
            >
              <div className="text-sm font-medium">{filter.name}</div>
              <div className="text-xs text-muted-foreground group-hover:text-[#15803d] transition-colors">
                {filter.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {savedFilterPresets.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="w-full flex items-center justify-between text-sm font-medium mb-3 hover:text-[#15803d] transition-colors"
            data-testid="saved-presets-button"
          >
            <span className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Mes filtres enregistrés ({savedFilterPresets.length})
            </span>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${showPresets ? 'rotate-90' : ''}`}
            />
          </button>
          {showPresets && (
            <div className="space-y-2">
              {savedFilterPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center gap-2 p-2 border rounded-lg hover:bg-muted/50 transition-colors group"
                  data-testid="filter-preset"
                >
                  <button
                    type="button"
                    onClick={() => onLoadPreset(preset)}
                    className="flex-1 text-left text-sm font-medium"
                  >
                    {preset.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeletePreset(preset.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div data-testid="category-filter">
        <div className="text-sm font-medium mb-3">Catégories</div>
        <div className="space-y-2">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.name);
            return (
              <div
                key={category.id}
                className="flex items-center justify-between gap-2"
                data-testid={`category-${category.name}`}
              >
                <button
                  type="button"
                  onClick={() =>
                    onCategoriesChange(
                      isSelected
                        ? selectedCategories.filter((c) => c !== category.name)
                        : [...selectedCategories, category.name]
                    )
                  }
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                    isSelected
                      ? 'border-[#15803d] bg-[#15803d]/10 text-[#15803d]'
                      : 'border-border hover:border-[#15803d]/60'
                  }`}
                >
                  {category.name}
                </button>
                {isAdminMode && (
                  <button
                    type="button"
                    onClick={() =>
                      onCategoryMenuOpen(categoryMenuOpen === category.id ? null : category.id)
                    }
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    ⋯
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {isAdminMode && categoryMenuOpen && (
          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={categoryRename}
              onChange={(event) => setCategoryRename(event.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
              placeholder="Renommer la catégorie"
            />
            <button
              type="button"
              onClick={() => {
                if (!categoryRename.trim()) return;
                onRenameCategory(categoryMenuOpen, categoryRename.trim());
                setCategoryRename('');
                onCategoryMenuOpen(null);
                onEditCategory(null);
              }}
              className="w-full px-3 py-2 rounded-lg bg-[#15803d] text-white text-sm font-medium"
            >
              Enregistrer
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Prix</span>
          </div>
          <div className="flex items-center gap-3" data-testid="price-range-slider">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(event) =>
                onPriceRangeChange([Number(event.target.value) || 0, priceRange[1]])
              }
              className="w-20 px-2 py-1 border rounded-lg text-sm"
              data-testid="price-min-input"
            />
            <span className="text-xs text-muted-foreground">à</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(event) =>
                onPriceRangeChange([priceRange[0], Number(event.target.value) || 0])
              }
              className="w-20 px-2 py-1 border rounded-lg text-sm"
              data-testid="price-max-input"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Note minimale</span>
          </div>
          <div className="flex items-center gap-2" data-testid="rating-filter">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onMinRatingChange(rating)}
                data-testid={`rating-${rating}`}
                className={`flex items-center gap-1 px-2 py-1 border rounded-lg text-xs ${
                  minRating === rating
                    ? 'border-[#15803d] bg-[#15803d]/10 text-[#15803d]'
                    : 'border-border'
                }`}
              >
                <Star
                  className={`h-3 w-3 ${
                    minRating >= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
                {rating}+
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Labels</div>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => {
              const isSelected = selectedLabels.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    onLabelsChange(
                      isSelected
                        ? selectedLabels.filter((l) => l !== label)
                        : [...selectedLabels, label]
                    )
                  }
                  data-testid={`label-${label}`}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    isSelected
                      ? 'border-[#15803d] bg-[#15803d]/10 text-[#15803d]'
                      : 'border-border hover:border-[#15803d]/60'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
