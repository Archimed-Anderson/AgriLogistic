/**
 * Traceability Hook
 * Manages product traceability and blockchain data
 */
import { useQuery } from '@tanstack/react-query';
import type { Traceability, TraceabilityStep, QualityTest, Certificate } from '@/types/buyer';

const mockTraceabilityData: Traceability[] = [
  {
    id: 'trace-001',
    productId: 'p-001',
    blockchainHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    journey: [
      {
        id: 'step-1',
        type: 'planting',
        location: 'Ferme Bio Casamance, Ziguinchor',
        coordinates: [-16.2733, 12.5658],
        timestamp: new Date('2025-09-15T08:00:00'),
        description: 'Semis des graines de tomates bio variété Roma',
        actor: 'Mamadou Diallo',
        verified: true,
      },
      {
        id: 'step-2',
        type: 'growing',
        location: 'Ferme Bio Casamance, Ziguinchor',
        coordinates: [-16.2733, 12.5658],
        timestamp: new Date('2025-10-01T10:00:00'),
        description: 'Croissance végétative - Irrigation goutte à goutte',
        actor: 'Équipe agricole',
        verified: true,
      },
      {
        id: 'step-3',
        type: 'treatment',
        location: 'Ferme Bio Casamance, Ziguinchor',
        coordinates: [-16.2733, 12.5658],
        timestamp: new Date('2025-10-15T14:00:00'),
        description: 'Traitement bio préventif - Purin d\'ortie',
        actor: 'Abdou Ndiaye',
        documents: ['bio-treatment-cert.pdf'],
        verified: true,
      },
      {
        id: 'step-4',
        type: 'harvest',
        location: 'Ferme Bio Casamance, Ziguinchor',
        coordinates: [-16.2733, 12.5658],
        timestamp: new Date('2026-01-10T06:00:00'),
        description: 'Récolte manuelle à maturité optimale',
        actor: 'Équipe de récolte',
        verified: true,
      },
      {
        id: 'step-5',
        type: 'processing',
        location: 'Centre de conditionnement Casamance',
        coordinates: [-16.2650, 12.5700],
        timestamp: new Date('2026-01-10T10:00:00'),
        description: 'Tri, lavage et calibrage des tomates',
        actor: 'Centre de conditionnement',
        verified: true,
      },
      {
        id: 'step-6',
        type: 'packaging',
        location: 'Centre de conditionnement Casamance',
        coordinates: [-16.2650, 12.5700],
        timestamp: new Date('2026-01-10T14:00:00'),
        description: 'Emballage en caisses de 10kg',
        actor: 'Centre de conditionnement',
        verified: true,
      },
      {
        id: 'step-7',
        type: 'transport',
        location: 'Route Ziguinchor - Dakar',
        coordinates: [-15.5000, 13.5000],
        timestamp: new Date('2026-01-11T05:00:00'),
        description: 'Transport réfrigéré vers Dakar',
        actor: 'AgroTransport SN',
        verified: true,
      },
      {
        id: 'step-8',
        type: 'delivery',
        location: 'Dakar, Sénégal',
        coordinates: [-17.4467, 14.6928],
        timestamp: new Date('2026-01-11T18:00:00'),
        description: 'Livraison au client final',
        actor: 'AgroTransport SN',
        verified: true,
      },
    ],
    certificates: [
      {
        id: 'cert-1',
        type: 'organic',
        name: 'Agriculture Biologique',
        issuer: 'Ecocert',
        issuedAt: new Date('2024-01-15'),
        expiresAt: new Date('2027-01-15'),
        documentUrl: '/certs/bio-cert.pdf',
        verified: true,
      },
      {
        id: 'cert-2',
        type: 'global_gap',
        name: 'GlobalG.A.P.',
        issuer: 'GlobalG.A.P.',
        issuedAt: new Date('2023-06-01'),
        expiresAt: new Date('2026-06-01'),
        documentUrl: '/certs/globalgap.pdf',
        verified: true,
      },
    ],
    qualityTests: [
      {
        id: 'test-1',
        type: 'Résidus de pesticides',
        result: 'pass',
        value: 0,
        unit: 'ppm',
        testedAt: new Date('2026-01-10T12:00:00'),
        testedBy: 'Laboratoire AgriTest',
      },
      {
        id: 'test-2',
        type: 'Taux de sucre (Brix)',
        result: 'pass',
        value: 5.2,
        unit: '°Brix',
        testedAt: new Date('2026-01-10T12:30:00'),
        testedBy: 'Laboratoire AgriTest',
      },
    ],
  },
];

export function useTraceability(productId?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['buyer', 'traceability', productId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      if (productId) {
        return mockTraceabilityData.find(t => t.productId === productId) || null;
      }
      return mockTraceabilityData[0];
    },
  });

  return {
    traceability: data,
    journey: data?.journey || [],
    certificates: data?.certificates || [],
    qualityTests: data?.qualityTests || [],
    isLoading,
    error,
  };
}
