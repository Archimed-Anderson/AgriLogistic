import { useState } from 'react';

// Hook pour la gestion de l'inventaire
export function useInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateStock = (itemId: string, quantity: number) => {
    // Logique de mise à jour du stock
    console.log('Updating stock:', itemId, quantity);
  };

  const addItem = (item: any) => {
    setInventory((prev) => [...prev, item]);
  };

  const removeItem = (itemId: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== itemId));
  };

  const getLowStockItems = () => {
    return lowStockItems;
  };

  return {
    inventory,
    lowStockItems,
    isLoading,
    updateStock,
    addItem,
    removeItem,
    getLowStockItems,
  };
}
