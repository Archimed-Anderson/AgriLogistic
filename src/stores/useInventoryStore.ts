import { create } from 'zustand';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  category: string;
  location: string;
}

interface InventoryStore {
  items: InventoryItem[];
  lowStockItems: InventoryItem[];
  isLoading: boolean;

  setItems: (items: InventoryItem[]) => void;
  addItem: (item: InventoryItem) => void;
  updateItem: (itemId: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (itemId: string) => void;
  updateStock: (itemId: string, quantity: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  items: [],
  lowStockItems: [],
  isLoading: false,

  setItems: (items) =>
    set({
      items,
      lowStockItems: items.filter((item) => item.quantity <= item.minStock),
    }),

  addItem: (item) =>
    set((state) => {
      const newItems = [...state.items, item];
      return {
        items: newItems,
        lowStockItems: newItems.filter((i) => i.quantity <= i.minStock),
      };
    }),

  updateItem: (itemId, updates) =>
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      return {
        items: newItems,
        lowStockItems: newItems.filter((i) => i.quantity <= i.minStock),
      };
    }),

  deleteItem: (itemId) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== itemId);
      return {
        items: newItems,
        lowStockItems: newItems.filter((i) => i.quantity <= i.minStock),
      };
    }),

  updateStock: (itemId, quantity) =>
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      return {
        items: newItems,
        lowStockItems: newItems.filter((i) => i.quantity <= i.minStock),
      };
    }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
