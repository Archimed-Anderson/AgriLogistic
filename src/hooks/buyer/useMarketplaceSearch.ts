/**
 * Marketplace Search Hook
 * Advanced product search with filters and facets
 */
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type {
  Product,
  MarketplaceFilters,
  MarketplaceSearchResult,
  Supplier,
  ProductCategory,
} from '@/types/buyer';

// Mock suppliers
const mockSuppliers: Supplier[] = [
  {
    id: 's-001',
    name: 'Ferme Bio Casamance',
    location: 'Ziguinchor, Sénégal',
    coordinates: [-16.2733, 12.5658],
    rating: 4.8,
    totalOrders: 234,
    reliabilityScore: 95,
    certifications: [],
    specialties: ['légumes bio', 'fruits tropicaux'],
    contactEmail: 'contact@fermebio.sn',
    contactPhone: '+221 77 123 45 67',
    isVerified: true,
    memberSince: new Date('2022-03-15'),
  },
  {
    id: 's-002',
    name: 'Coopérative Niayes',
    location: 'Thiès, Sénégal',
    coordinates: [-16.926, 14.7886],
    rating: 4.6,
    totalOrders: 189,
    reliabilityScore: 92,
    certifications: [],
    specialties: ['oignons', 'pommes de terre', 'carottes'],
    contactEmail: 'coop@niayes.sn',
    contactPhone: '+221 77 234 56 78',
    isVerified: true,
    memberSince: new Date('2021-06-20'),
  },
];

// Mock products
const mockProducts: Product[] = [
  {
    id: 'p-001',
    name: 'Tomates Bio',
    category: 'vegetables',
    subcategory: 'tomates',
    description: 'Tomates cultivées sans pesticides, goût authentique',
    images: ['/products/tomatoes.jpg'],
    pricePerKg: 1850,
    unit: 'kg',
    minOrderQuantity: 5,
    availableQuantity: 500,
    supplierId: 's-001',
    supplier: mockSuppliers[0],
    origin: 'Casamance, Sénégal',
    certifications: [
      {
        id: 'c-1',
        type: 'organic',
        name: 'Bio',
        issuer: 'Ecocert',
        issuedAt: new Date(),
        verified: true,
      },
    ],
    qualityScore: 4.8,
    seasonality: [5, 6, 7, 8, 9, 10],
    isOrganic: true,
    isFavorite: true,
  },
  {
    id: 'p-002',
    name: 'Mangues Kent Premium',
    category: 'fruits',
    subcategory: 'mangues',
    description: 'Mangues Kent de qualité export, sucrées et juteuses',
    images: ['/products/mangoes.jpg'],
    pricePerKg: 2500,
    unit: 'kg',
    minOrderQuantity: 10,
    availableQuantity: 1000,
    supplierId: 's-001',
    supplier: mockSuppliers[0],
    origin: 'Ziguinchor, Sénégal',
    certifications: [],
    qualityScore: 4.9,
    seasonality: [4, 5, 6, 7],
    isOrganic: false,
    isFavorite: true,
  },
  {
    id: 'p-003',
    name: 'Oignons Violets',
    category: 'vegetables',
    subcategory: 'oignons',
    description: 'Oignons violets savoureux de la région de Potou',
    images: ['/products/onions.jpg'],
    pricePerKg: 800,
    unit: 'kg',
    minOrderQuantity: 20,
    availableQuantity: 5000,
    supplierId: 's-002',
    supplier: mockSuppliers[1],
    origin: 'Potou, Sénégal',
    certifications: [],
    qualityScore: 4.5,
    seasonality: [1, 2, 3, 11, 12],
    isOrganic: false,
    isFavorite: false,
  },
  {
    id: 'p-004',
    name: 'Carottes Niayes',
    category: 'vegetables',
    subcategory: 'carottes',
    description: 'Carottes fraîches cultivées dans les Niayes',
    images: ['/products/carrots.jpg'],
    pricePerKg: 950,
    unit: 'kg',
    minOrderQuantity: 10,
    availableQuantity: 800,
    supplierId: 's-002',
    supplier: mockSuppliers[1],
    origin: 'Niayes, Sénégal',
    certifications: [],
    qualityScore: 4.6,
    seasonality: [10, 11, 12, 1, 2, 3],
    isOrganic: false,
    isFavorite: false,
  },
  {
    id: 'p-005',
    name: 'Papayes Solo',
    category: 'fruits',
    subcategory: 'papayes',
    description: 'Papayes Solo sucrées et parfumées',
    images: ['/products/papayas.jpg'],
    pricePerKg: 1200,
    unit: 'kg',
    minOrderQuantity: 5,
    availableQuantity: 300,
    supplierId: 's-001',
    supplier: mockSuppliers[0],
    origin: 'Casamance, Sénégal',
    certifications: [],
    qualityScore: 4.7,
    seasonality: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    isOrganic: false,
    isFavorite: true,
  },
  {
    id: 'p-006',
    name: 'Haricots Verts Bio',
    category: 'vegetables',
    subcategory: 'haricots',
    description: 'Haricots verts extra-fins cultivés en agriculture biologique',
    images: ['/products/green-beans.jpg'],
    pricePerKg: 2200,
    unit: 'kg',
    minOrderQuantity: 5,
    availableQuantity: 200,
    supplierId: 's-001',
    supplier: mockSuppliers[0],
    origin: 'Casamance, Sénégal',
    certifications: [
      {
        id: 'c-2',
        type: 'organic',
        name: 'Bio',
        issuer: 'Ecocert',
        issuedAt: new Date(),
        verified: true,
      },
    ],
    qualityScore: 4.8,
    seasonality: [11, 12, 1, 2, 3, 4],
    isOrganic: true,
    isFavorite: false,
  },
];

export function useMarketplaceSearch() {
  const [filters, setFilters] = useState<MarketplaceFilters>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['buyer', 'marketplace', 'search', filters],
    queryFn: async (): Promise<MarketplaceSearchResult> => {
      await new Promise((resolve) => setTimeout(resolve, 600));

      let filtered = [...mockProducts];

      // Apply filters
      if (filters.query) {
        const q = filters.query.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.origin.toLowerCase().includes(q)
        );
      }

      if (filters.categories?.length) {
        filtered = filtered.filter((p) => filters.categories!.includes(p.category));
      }

      if (filters.isOrganic !== undefined) {
        filtered = filtered.filter((p) => p.isOrganic === filters.isOrganic);
      }

      if (filters.priceRange) {
        filtered = filtered.filter(
          (p) => p.pricePerKg >= filters.priceRange![0] && p.pricePerKg <= filters.priceRange![1]
        );
      }

      // Sort
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price':
              return filters.sortOrder === 'desc'
                ? b.pricePerKg - a.pricePerKg
                : a.pricePerKg - b.pricePerKg;
            case 'rating':
              return filters.sortOrder === 'desc'
                ? b.qualityScore - a.qualityScore
                : a.qualityScore - b.qualityScore;
            default:
              return 0;
          }
        });
      }

      return {
        products: filtered,
        totalCount: filtered.length,
        page: 1,
        pageSize: 20,
        facets: {
          categories: [
            {
              value: 'vegetables',
              label: 'Légumes',
              count: mockProducts.filter((p) => p.category === 'vegetables').length,
            },
            {
              value: 'fruits',
              label: 'Fruits',
              count: mockProducts.filter((p) => p.category === 'fruits').length,
            },
          ],
          origins: [
            { value: 'casamance', label: 'Casamance', count: 4 },
            { value: 'niayes', label: 'Niayes', count: 2 },
          ],
          certifications: [{ value: 'organic', label: 'Bio', count: 2 }],
          priceRanges: [
            { value: '0-1000', label: '< 1000 FCFA', count: 2 },
            { value: '1000-2000', label: '1000-2000 FCFA', count: 3 },
            { value: '2000+', label: '> 2000 FCFA', count: 1 },
          ],
        },
      };
    },
  });

  const updateFilters = (newFilters: Partial<MarketplaceFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return {
    products: data?.products || [],
    totalCount: data?.totalCount || 0,
    facets: data?.facets,
    filters,
    updateFilters,
    resetFilters,
    isLoading,
    error,
  };
}
