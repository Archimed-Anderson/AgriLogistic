/**
 * Inventory Hook
 * Manages stock levels and inventory alerts
 */
import { useQuery } from '@tanstack/react-query';

export interface InventoryItem {
  id: string;
  productName: string;
  productCategory: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  location: string;
  lastRestocked: Date;
  expiryDate?: Date;
  status: 'optimal' | 'low' | 'critical' | 'overstock';
  supplier: string;
  supplierId: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: Date;
  user: string;
}

const mockInventory: InventoryItem[] = [
  {
    id: 'inv-001',
    productName: 'Tomates Bio',
    productCategory: 'Légumes',
    sku: 'TOM-BIO-001',
    currentStock: 250,
    minStock: 100,
    maxStock: 500,
    unit: 'kg',
    unitPrice: 1850,
    totalValue: 462500,
    location: 'Entrepôt A - Zone Frais',
    lastRestocked: new Date('2026-01-20'),
    expiryDate: new Date('2026-01-28'),
    status: 'optimal',
    supplier: 'Ferme Bio Casamance',
    supplierId: 's-001',
  },
  {
    id: 'inv-002',
    productName: 'Oignons Violets',
    productCategory: 'Légumes',
    sku: 'OIG-VIO-001',
    currentStock: 45,
    minStock: 80,
    maxStock: 300,
    unit: 'kg',
    unitPrice: 800,
    totalValue: 36000,
    location: 'Entrepôt A - Zone Sèche',
    lastRestocked: new Date('2026-01-15'),
    status: 'low',
    supplier: 'Coopérative Niayes',
    supplierId: 's-002',
  },
  {
    id: 'inv-003',
    productName: 'Mangues Kent',
    productCategory: 'Fruits',
    sku: 'MAN-KEN-001',
    currentStock: 15,
    minStock: 50,
    maxStock: 200,
    unit: 'kg',
    unitPrice: 2500,
    totalValue: 37500,
    location: 'Entrepôt B - Zone Frais',
    lastRestocked: new Date('2026-01-10'),
    expiryDate: new Date('2026-01-25'),
    status: 'critical',
    supplier: 'Verger du Fleuve',
    supplierId: 's-003',
  },
  {
    id: 'inv-004',
    productName: 'Arachides',
    productCategory: 'Céréales',
    sku: 'ARA-STD-001',
    currentStock: 450,
    minStock: 100,
    maxStock: 400,
    unit: 'kg',
    unitPrice: 1200,
    totalValue: 540000,
    location: 'Entrepôt A - Zone Sèche',
    lastRestocked: new Date('2026-01-18'),
    status: 'overstock',
    supplier: 'Ferme Kolda',
    supplierId: 's-004',
  },
  {
    id: 'inv-005',
    productName: 'Carottes Niayes',
    productCategory: 'Légumes',
    sku: 'CAR-NIA-001',
    currentStock: 180,
    minStock: 80,
    maxStock: 300,
    unit: 'kg',
    unitPrice: 600,
    totalValue: 108000,
    location: 'Entrepôt A - Zone Frais',
    lastRestocked: new Date('2026-01-21'),
    expiryDate: new Date('2026-02-05'),
    status: 'optimal',
    supplier: 'Coopérative Niayes',
    supplierId: 's-002',
  },
];

const mockMovements: StockMovement[] = [
  { id: 'm-1', itemId: 'inv-001', type: 'in', quantity: 100, reason: 'Réception commande', date: new Date('2026-01-20'), user: 'Amadou Fall' },
  { id: 'm-2', itemId: 'inv-001', type: 'out', quantity: 50, reason: 'Vente client', date: new Date('2026-01-21'), user: 'Marie Seck' },
  { id: 'm-3', itemId: 'inv-003', type: 'out', quantity: 35, reason: 'Vente client', date: new Date('2026-01-22'), user: 'Marie Seck' },
];

export function useInventory() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['buyer', 'inventory'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        items: mockInventory,
        movements: mockMovements,
      };
    },
  });

  const items = data?.items || [];
  const lowStockItems = items.filter(i => i.status === 'low' || i.status === 'critical');
  const totalValue = items.reduce((acc, i) => acc + i.totalValue, 0);
  const expiringItems = items.filter(i => {
    if (!i.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((new Date(i.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7;
  });

  return {
    items,
    movements: data?.movements || [],
    lowStockItems,
    expiringItems,
    totalValue,
    isLoading,
    error,
  };
}
