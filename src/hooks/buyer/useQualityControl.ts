/**
 * Quality Control Hook
 * Manages quality inspections and non-conformities
 */
import { useQuery } from '@tanstack/react-query';

export interface QualityInspection {
  id: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  supplierName: string;
  inspectionDate: Date;
  inspector: string;
  overallScore: number;
  status: 'passed' | 'failed' | 'pending' | 'warning';
  criteria: QualityCriteria[];
  photos: string[];
  comments: string;
  actionRequired?: string;
}

export interface QualityCriteria {
  name: string;
  score: number;
  maxScore: number;
  comment?: string;
}

export interface NonConformity {
  id: string;
  inspectionId: string;
  type: 'quality' | 'quantity' | 'packaging' | 'delivery' | 'documentation';
  severity: 'minor' | 'major' | 'critical';
  description: string;
  reportedAt: Date;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  resolution?: string;
  resolvedAt?: Date;
}

const mockInspections: QualityInspection[] = [
  {
    id: 'insp-001',
    orderId: 'ord-005',
    orderNumber: 'AGR-2026-0005',
    productName: 'Tomates Bio',
    supplierName: 'Ferme Bio Casamance',
    inspectionDate: new Date('2026-01-21T14:30:00'),
    inspector: 'Marie Seck',
    overallScore: 92,
    status: 'passed',
    criteria: [
      { name: 'Apparence visuelle', score: 9, maxScore: 10 },
      { name: 'Fraîcheur', score: 10, maxScore: 10 },
      { name: 'Calibrage', score: 8, maxScore: 10 },
      { name: 'Emballage', score: 9, maxScore: 10 },
      { name: 'Documentation', score: 10, maxScore: 10 },
    ],
    photos: ['/inspections/tomatoes-1.jpg'],
    comments: 'Excellent lot, produits conformes aux spécifications. Légère variation de calibre acceptable.',
  },
  {
    id: 'insp-002',
    orderId: 'ord-004',
    orderNumber: 'AGR-2026-0004',
    productName: 'Carottes Niayes',
    supplierName: 'Coopérative Niayes',
    inspectionDate: new Date('2026-01-22T10:00:00'),
    inspector: 'Amadou Fall',
    overallScore: 78,
    status: 'warning',
    criteria: [
      { name: 'Apparence visuelle', score: 7, maxScore: 10, comment: 'Quelques traces de terre' },
      { name: 'Fraîcheur', score: 9, maxScore: 10 },
      { name: 'Calibrage', score: 6, maxScore: 10, comment: 'Calibre irrégulier' },
      { name: 'Emballage', score: 8, maxScore: 10 },
      { name: 'Documentation', score: 9, maxScore: 10 },
    ],
    photos: ['/inspections/carrots-1.jpg', '/inspections/carrots-2.jpg'],
    comments: 'Lot acceptable avec réserves. Feedback envoyé au fournisseur concernant le calibrage.',
    actionRequired: 'Demander amélioration du tri pour prochaine commande',
  },
  {
    id: 'insp-003',
    orderId: 'ord-003',
    orderNumber: 'AGR-2026-0003',
    productName: 'Oignons Violets',
    supplierName: 'Coopérative Niayes',
    inspectionDate: new Date('2026-01-23T09:00:00'),
    inspector: 'Marie Seck',
    overallScore: 65,
    status: 'failed',
    criteria: [
      { name: 'Apparence visuelle', score: 5, maxScore: 10, comment: 'Traces de moisissure détectées' },
      { name: 'Fraîcheur', score: 6, maxScore: 10, comment: 'Signes de vieillissement' },
      { name: 'Calibrage', score: 8, maxScore: 10 },
      { name: 'Emballage', score: 7, maxScore: 10 },
      { name: 'Documentation', score: 7, maxScore: 10 },
    ],
    photos: ['/inspections/onions-1.jpg'],
    comments: 'Lot rejeté partiellement. 15% des oignons présentent des défauts. Réclamation en cours.',
    actionRequired: 'Retour partiel - Crédit fournisseur à demander',
  },
];

const mockNonConformities: NonConformity[] = [
  {
    id: 'nc-001',
    inspectionId: 'insp-003',
    type: 'quality',
    severity: 'major',
    description: 'Présence de moisissure sur 15% du lot d\'oignons',
    reportedAt: new Date('2026-01-23T09:30:00'),
    status: 'in_progress',
  },
  {
    id: 'nc-002',
    inspectionId: 'insp-002',
    type: 'quality',
    severity: 'minor',
    description: 'Calibrage irrégulier des carottes',
    reportedAt: new Date('2026-01-22T10:30:00'),
    status: 'resolved',
    resolution: 'Feedback accepté par le fournisseur, amélioration promise',
    resolvedAt: new Date('2026-01-22T16:00:00'),
  },
];

export function useQualityControl() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['buyer', 'quality'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        inspections: mockInspections,
        nonConformities: mockNonConformities,
      };
    },
  });

  const passedInspections = data?.inspections.filter(i => i.status === 'passed') || [];
  const failedInspections = data?.inspections.filter(i => i.status === 'failed') || [];
  const openNonConformities = data?.nonConformities.filter(nc => nc.status === 'open' || nc.status === 'in_progress') || [];

  return {
    inspections: data?.inspections || [],
    nonConformities: data?.nonConformities || [],
    passedInspections,
    failedInspections,
    openNonConformities,
    isLoading,
    error,
  };
}
