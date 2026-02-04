/**
 * Buyer Orders Hook
 * Manages orders data with React Query
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Order, OrderStatus, OrderEvent } from '@/types/buyer';

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'AGR-2026-0001',
    status: 'pending',
    items: [
      {
        id: 'item-001',
        productId: 'p-001',
        product: {} as any,
        quantity: 50,
        unitPrice: 1850,
        totalPrice: 92500,
      },
    ],
    supplierId: 's-001',
    supplier: {
      id: 's-001',
      name: 'Ferme Bio Casamance',
      location: 'Ziguinchor',
      coordinates: [-16.27, 12.56],
      rating: 4.8,
      totalOrders: 234,
      reliabilityScore: 95,
      certifications: [],
      specialties: [],
      contactEmail: 'contact@ferme.sn',
      contactPhone: '+221 77 123 45 67',
      isVerified: true,
      memberSince: new Date(),
    },
    totalAmount: 92500,
    currency: 'XOF',
    deliveryAddress: {
      street: '15 Avenue Cheikh Anta Diop',
      city: 'Dakar',
      postalCode: '10000',
      country: 'Sénégal',
    },
    deliveryDate: new Date('2026-01-25'),
    createdAt: new Date('2026-01-22T10:00:00'),
    updatedAt: new Date('2026-01-22T10:00:00'),
    paymentStatus: 'pending',
    timeline: [
      {
        id: 'e-1',
        type: 'created',
        timestamp: new Date('2026-01-22T10:00:00'),
        description: 'Commande créée',
      },
    ],
  },
  {
    id: 'ord-002',
    orderNumber: 'AGR-2026-0002',
    status: 'confirmed',
    items: [
      {
        id: 'item-002',
        productId: 'p-002',
        product: {} as any,
        quantity: 100,
        unitPrice: 2500,
        totalPrice: 250000,
      },
    ],
    supplierId: 's-001',
    supplier: {
      id: 's-001',
      name: 'Ferme Bio Casamance',
      location: 'Ziguinchor',
      coordinates: [-16.27, 12.56],
      rating: 4.8,
      totalOrders: 234,
      reliabilityScore: 95,
      certifications: [],
      specialties: [],
      contactEmail: 'contact@ferme.sn',
      contactPhone: '+221 77 123 45 67',
      isVerified: true,
      memberSince: new Date(),
    },
    totalAmount: 250000,
    currency: 'XOF',
    deliveryAddress: {
      street: '15 Avenue Cheikh Anta Diop',
      city: 'Dakar',
      postalCode: '10000',
      country: 'Sénégal',
    },
    deliveryDate: new Date('2026-01-24'),
    createdAt: new Date('2026-01-21T14:00:00'),
    updatedAt: new Date('2026-01-22T08:00:00'),
    paymentStatus: 'paid',
    timeline: [
      {
        id: 'e-1',
        type: 'created',
        timestamp: new Date('2026-01-21T14:00:00'),
        description: 'Commande créée',
      },
      {
        id: 'e-2',
        type: 'payment_received',
        timestamp: new Date('2026-01-21T14:30:00'),
        description: 'Paiement reçu',
      },
      {
        id: 'e-3',
        type: 'confirmed',
        timestamp: new Date('2026-01-22T08:00:00'),
        description: 'Confirmée par le fournisseur',
      },
    ],
  },
  {
    id: 'ord-003',
    orderNumber: 'AGR-2026-0003',
    status: 'preparing',
    items: [
      {
        id: 'item-003',
        productId: 'p-003',
        product: {} as any,
        quantity: 200,
        unitPrice: 800,
        totalPrice: 160000,
      },
    ],
    supplierId: 's-002',
    supplier: {
      id: 's-002',
      name: 'Coopérative Niayes',
      location: 'Thiès',
      coordinates: [-16.92, 14.78],
      rating: 4.6,
      totalOrders: 189,
      reliabilityScore: 92,
      certifications: [],
      specialties: [],
      contactEmail: 'coop@niayes.sn',
      contactPhone: '+221 77 234 56 78',
      isVerified: true,
      memberSince: new Date(),
    },
    totalAmount: 160000,
    currency: 'XOF',
    deliveryAddress: {
      street: '15 Avenue Cheikh Anta Diop',
      city: 'Dakar',
      postalCode: '10000',
      country: 'Sénégal',
    },
    deliveryDate: new Date('2026-01-23'),
    createdAt: new Date('2026-01-20T09:00:00'),
    updatedAt: new Date('2026-01-22T11:00:00'),
    paymentStatus: 'paid',
    timeline: [
      {
        id: 'e-1',
        type: 'created',
        timestamp: new Date('2026-01-20T09:00:00'),
        description: 'Commande créée',
      },
      {
        id: 'e-2',
        type: 'payment_received',
        timestamp: new Date('2026-01-20T09:30:00'),
        description: 'Paiement reçu',
      },
      {
        id: 'e-3',
        type: 'confirmed',
        timestamp: new Date('2026-01-20T14:00:00'),
        description: 'Confirmée',
      },
      {
        id: 'e-4',
        type: 'preparing',
        timestamp: new Date('2026-01-22T08:00:00'),
        description: 'En préparation',
      },
      {
        id: 'e-5',
        type: 'quality_check',
        timestamp: new Date('2026-01-22T11:00:00'),
        description: 'Contrôle qualité en cours',
      },
    ],
  },
  {
    id: 'ord-004',
    orderNumber: 'AGR-2026-0004',
    status: 'shipped',
    items: [
      {
        id: 'item-004',
        productId: 'p-004',
        product: {} as any,
        quantity: 75,
        unitPrice: 950,
        totalPrice: 71250,
      },
    ],
    supplierId: 's-002',
    supplier: {
      id: 's-002',
      name: 'Coopérative Niayes',
      location: 'Thiès',
      coordinates: [-16.92, 14.78],
      rating: 4.6,
      totalOrders: 189,
      reliabilityScore: 92,
      certifications: [],
      specialties: [],
      contactEmail: 'coop@niayes.sn',
      contactPhone: '+221 77 234 56 78',
      isVerified: true,
      memberSince: new Date(),
    },
    totalAmount: 71250,
    currency: 'XOF',
    deliveryAddress: {
      street: '15 Avenue Cheikh Anta Diop',
      city: 'Dakar',
      postalCode: '10000',
      country: 'Sénégal',
    },
    deliveryDate: new Date('2026-01-22'),
    createdAt: new Date('2026-01-19T16:00:00'),
    updatedAt: new Date('2026-01-22T07:00:00'),
    paymentStatus: 'paid',
    timeline: [
      {
        id: 'e-1',
        type: 'created',
        timestamp: new Date('2026-01-19T16:00:00'),
        description: 'Commande créée',
      },
      {
        id: 'e-2',
        type: 'confirmed',
        timestamp: new Date('2026-01-19T18:00:00'),
        description: 'Confirmée',
      },
      {
        id: 'e-3',
        type: 'preparing',
        timestamp: new Date('2026-01-21T08:00:00'),
        description: 'En préparation',
      },
      {
        id: 'e-4',
        type: 'shipped',
        timestamp: new Date('2026-01-22T07:00:00'),
        description: 'Expédiée',
      },
      {
        id: 'e-5',
        type: 'in_transit',
        timestamp: new Date('2026-01-22T07:30:00'),
        description: 'En transit vers Dakar',
      },
    ],
  },
  {
    id: 'ord-005',
    orderNumber: 'AGR-2026-0005',
    status: 'delivered',
    items: [
      {
        id: 'item-005',
        productId: 'p-005',
        product: {} as any,
        quantity: 30,
        unitPrice: 1200,
        totalPrice: 36000,
      },
    ],
    supplierId: 's-001',
    supplier: {
      id: 's-001',
      name: 'Ferme Bio Casamance',
      location: 'Ziguinchor',
      coordinates: [-16.27, 12.56],
      rating: 4.8,
      totalOrders: 234,
      reliabilityScore: 95,
      certifications: [],
      specialties: [],
      contactEmail: 'contact@ferme.sn',
      contactPhone: '+221 77 123 45 67',
      isVerified: true,
      memberSince: new Date(),
    },
    totalAmount: 36000,
    currency: 'XOF',
    deliveryAddress: {
      street: '15 Avenue Cheikh Anta Diop',
      city: 'Dakar',
      postalCode: '10000',
      country: 'Sénégal',
    },
    deliveryDate: new Date('2026-01-21'),
    createdAt: new Date('2026-01-18T10:00:00'),
    updatedAt: new Date('2026-01-21T14:00:00'),
    paymentStatus: 'paid',
    timeline: [
      {
        id: 'e-1',
        type: 'created',
        timestamp: new Date('2026-01-18T10:00:00'),
        description: 'Commande créée',
      },
      {
        id: 'e-2',
        type: 'confirmed',
        timestamp: new Date('2026-01-18T12:00:00'),
        description: 'Confirmée',
      },
      {
        id: 'e-3',
        type: 'shipped',
        timestamp: new Date('2026-01-21T08:00:00'),
        description: 'Expédiée',
      },
      {
        id: 'e-4',
        type: 'delivered',
        timestamp: new Date('2026-01-21T14:00:00'),
        description: 'Livrée',
      },
    ],
  },
];

export function useOrders() {
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['buyer', 'orders'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return mockOrders;
    },
  });

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders?.filter((o) => o.status === status) || [];
  };

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { orderId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer', 'orders'] });
    },
  });

  return {
    orders: orders || [],
    pendingOrders: getOrdersByStatus('pending'),
    confirmedOrders: getOrdersByStatus('confirmed'),
    preparingOrders: getOrdersByStatus('preparing'),
    shippedOrders: getOrdersByStatus('shipped'),
    deliveredOrders: getOrdersByStatus('delivered'),
    updateOrderStatus,
    isLoading,
    error,
  };
}
