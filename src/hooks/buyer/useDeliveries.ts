/**
 * Deliveries Hook
 * Manages incoming deliveries and schedules
 */
import { useQuery } from '@tanstack/react-query';

export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  supplierName: string;
  supplierId: string;
  status: 'scheduled' | 'in_transit' | 'arriving' | 'delivered' | 'delayed';
  scheduledDate: Date;
  estimatedArrival?: Date;
  actualArrival?: Date;
  items: { name: string; quantity: number; unit: string }[];
  totalValue: number;
  transporterName: string;
  vehicleInfo: string;
  trackingCode: string;
  currentLocation?: string;
  notes?: string;
}

const mockDeliveries: Delivery[] = [
  {
    id: 'del-001',
    orderId: 'ord-001',
    orderNumber: 'AGR-2026-0001',
    supplierName: 'Ferme Bio Casamance',
    supplierId: 's-001',
    status: 'in_transit',
    scheduledDate: new Date('2026-01-23T10:00:00'),
    estimatedArrival: new Date('2026-01-23T14:30:00'),
    items: [
      { name: 'Tomates Bio', quantity: 100, unit: 'kg' },
      { name: 'Herbes aromatiques', quantity: 20, unit: 'kg' },
    ],
    totalValue: 92500,
    transporterName: 'AgroTransport SN',
    vehicleInfo: 'Camion frigorifique - DK-4521-AB',
    trackingCode: 'AGTR-2026-1234',
    currentLocation: 'Kaolack - En route vers Dakar',
  },
  {
    id: 'del-002',
    orderId: 'ord-002',
    orderNumber: 'AGR-2026-0002',
    supplierName: 'Coopérative Niayes',
    supplierId: 's-002',
    status: 'arriving',
    scheduledDate: new Date('2026-01-23T08:00:00'),
    estimatedArrival: new Date('2026-01-23T09:15:00'),
    items: [
      { name: 'Carottes Niayes', quantity: 150, unit: 'kg' },
      { name: 'Pommes de terre', quantity: 200, unit: 'kg' },
    ],
    totalValue: 160000,
    transporterName: 'Express Agro',
    vehicleInfo: 'Fourgon - TH-8765-CD',
    trackingCode: 'EXAG-2026-5678',
    currentLocation: 'Dakar - Périphérie',
  },
  {
    id: 'del-003',
    orderId: 'ord-003',
    orderNumber: 'AGR-2026-0003',
    supplierName: 'Verger du Fleuve',
    supplierId: 's-003',
    status: 'scheduled',
    scheduledDate: new Date('2026-01-24T11:00:00'),
    items: [
      { name: 'Mangues Kent', quantity: 80, unit: 'kg' },
      { name: 'Citrons', quantity: 50, unit: 'kg' },
    ],
    totalValue: 71250,
    transporterName: 'AgroTransport SN',
    vehicleInfo: 'Camion frigorifique',
    trackingCode: 'AGTR-2026-1235',
  },
  {
    id: 'del-004',
    orderId: 'ord-004',
    orderNumber: 'AGR-2026-0004',
    supplierName: 'Ferme Kolda',
    supplierId: 's-004',
    status: 'delivered',
    scheduledDate: new Date('2026-01-22T09:00:00'),
    actualArrival: new Date('2026-01-22T09:45:00'),
    items: [
      { name: 'Arachides', quantity: 200, unit: 'kg' },
    ],
    totalValue: 240000,
    transporterName: 'Kolda Express',
    vehicleInfo: 'Camion - KO-3456-EF',
    trackingCode: 'KEXP-2026-9012',
  },
  {
    id: 'del-005',
    orderId: 'ord-005',
    orderNumber: 'AGR-2026-0005',
    supplierName: 'Coopérative Niayes',
    supplierId: 's-002',
    status: 'delayed',
    scheduledDate: new Date('2026-01-22T14:00:00'),
    estimatedArrival: new Date('2026-01-23T16:00:00'),
    items: [
      { name: 'Oignons Violets', quantity: 300, unit: 'kg' },
    ],
    totalValue: 240000,
    transporterName: 'Express Agro',
    vehicleInfo: 'Fourgon - TH-1234-GH',
    trackingCode: 'EXAG-2026-3456',
    currentLocation: 'Thiès - Retard dû aux conditions météo',
    notes: 'Retard de 24h en raison de fortes pluies',
  },
];

export function useDeliveries() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['buyer', 'deliveries'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockDeliveries;
    },
  });

  const deliveries = data || [];
  const todayDeliveries = deliveries.filter(d => {
    const today = new Date();
    const schedDate = new Date(d.scheduledDate);
    return schedDate.toDateString() === today.toDateString() && d.status !== 'delivered';
  });
  const inTransitDeliveries = deliveries.filter(d => d.status === 'in_transit' || d.status === 'arriving');
  const delayedDeliveries = deliveries.filter(d => d.status === 'delayed');

  return {
    deliveries,
    todayDeliveries,
    inTransitDeliveries,
    delayedDeliveries,
    isLoading,
    error,
  };
}
