/**
 * Suppliers Hook
 * Manages supplier data and performance metrics
 */
import { useQuery } from '@tanstack/react-query';
import type { Supplier, Certificate, CertificationType } from '@/types/buyer';

export interface SupplierPerformance {
  supplierId: string;
  deliveryOnTime: number;
  qualityScore: number;
  responseTime: number; // hours
  orderAccuracy: number;
  averageDeliveryDays: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
}

export interface SupplierWithPerformance extends Supplier {
  performance: SupplierPerformance;
  isFavorite: boolean;
  notes?: string;
}

const mockCertificates: Certificate[] = [
  {
    id: 'c-1',
    type: 'organic',
    name: 'Agriculture Biologique',
    issuer: 'Ecocert',
    issuedAt: new Date('2024-01-15'),
    verified: true,
  },
  {
    id: 'c-2',
    type: 'global_gap',
    name: 'GlobalG.A.P.',
    issuer: 'GlobalG.A.P.',
    issuedAt: new Date('2023-06-01'),
    verified: true,
  },
];

const mockSuppliers: SupplierWithPerformance[] = [
  {
    id: 's-001',
    name: 'Ferme Bio Casamance',
    location: 'Ziguinchor, Sénégal',
    coordinates: [-16.2733, 12.5658],
    rating: 4.8,
    totalOrders: 234,
    reliabilityScore: 95,
    certifications: mockCertificates,
    specialties: ['Légumes bio', 'Fruits tropicaux', 'Herbes aromatiques'],
    contactEmail: 'contact@fermebio.sn',
    contactPhone: '+221 77 123 45 67',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=FBC',
    isVerified: true,
    memberSince: new Date('2022-03-15'),
    performance: {
      supplierId: 's-001',
      deliveryOnTime: 96,
      qualityScore: 4.8,
      responseTime: 2,
      orderAccuracy: 98,
      averageDeliveryDays: 3,
      totalOrders: 234,
      totalSpent: 4500000,
      lastOrderDate: new Date('2026-01-20'),
    },
    isFavorite: true,
    notes: 'Excellent partenaire, produits de qualité constante.',
  },
  {
    id: 's-002',
    name: 'Coopérative Niayes',
    location: 'Thiès, Sénégal',
    coordinates: [-16.926, 14.7886],
    rating: 4.6,
    totalOrders: 189,
    reliabilityScore: 92,
    certifications: [mockCertificates[1]],
    specialties: ['Oignons', 'Pommes de terre', 'Carottes'],
    contactEmail: 'coop@niayes.sn',
    contactPhone: '+221 77 234 56 78',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=CN',
    isVerified: true,
    memberSince: new Date('2021-06-20'),
    performance: {
      supplierId: 's-002',
      deliveryOnTime: 91,
      qualityScore: 4.6,
      responseTime: 4,
      orderAccuracy: 95,
      averageDeliveryDays: 2,
      totalOrders: 189,
      totalSpent: 2800000,
      lastOrderDate: new Date('2026-01-18'),
    },
    isFavorite: true,
  },
  {
    id: 's-003',
    name: 'Verger du Fleuve',
    location: 'Saint-Louis, Sénégal',
    coordinates: [-16.0179, 16.0326],
    rating: 4.4,
    totalOrders: 78,
    reliabilityScore: 88,
    certifications: [],
    specialties: ['Mangues', 'Citrons', 'Oranges'],
    contactEmail: 'verger@fleuve.sn',
    contactPhone: '+221 77 345 67 89',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=VF',
    isVerified: true,
    memberSince: new Date('2023-01-10'),
    performance: {
      supplierId: 's-003',
      deliveryOnTime: 85,
      qualityScore: 4.4,
      responseTime: 6,
      orderAccuracy: 92,
      averageDeliveryDays: 4,
      totalOrders: 78,
      totalSpent: 1200000,
      lastOrderDate: new Date('2026-01-15'),
    },
    isFavorite: false,
  },
  {
    id: 's-004',
    name: 'Ferme Kolda',
    location: 'Kolda, Sénégal',
    coordinates: [-14.95, 12.8833],
    rating: 4.7,
    totalOrders: 156,
    reliabilityScore: 94,
    certifications: mockCertificates,
    specialties: ['Arachides', 'Mil', 'Sorgho'],
    contactEmail: 'ferme@kolda.sn',
    contactPhone: '+221 77 456 78 90',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=FK',
    isVerified: true,
    memberSince: new Date('2020-09-01'),
    performance: {
      supplierId: 's-004',
      deliveryOnTime: 93,
      qualityScore: 4.7,
      responseTime: 3,
      orderAccuracy: 97,
      averageDeliveryDays: 5,
      totalOrders: 156,
      totalSpent: 3200000,
      lastOrderDate: new Date('2026-01-19'),
    },
    isFavorite: true,
  },
];

export function useSuppliers() {
  const {
    data: suppliers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['buyer', 'suppliers'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return mockSuppliers;
    },
  });

  const favoriteSuppliers = suppliers?.filter((s) => s.isFavorite) || [];
  const verifiedSuppliers = suppliers?.filter((s) => s.isVerified) || [];

  return {
    suppliers: suppliers || [],
    favoriteSuppliers,
    verifiedSuppliers,
    isLoading,
    error,
  };
}
