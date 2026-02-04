/**
 * Offline Storage using IndexedDB
 */

import React from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface FarmerDB extends DBSchema {
  kpis: {
    key: string;
    value: any;
  };
  tasks: {
    key: string;
    value: any;
  };
  weather: {
    key: string;
    value: any;
  };
  products: {
    key: string;
    value: any;
  };
  orders: {
    key: string;
    value: any;
  };
  syncQueue: {
    key: string;
    value: {
      id: string;
      action: 'create' | 'update' | 'delete';
      entity: string;
      data: any;
      timestamp: number;
    };
  };
}

class OfflineStorage {
  private db: IDBPDatabase<FarmerDB> | null = null;
  private dbName = 'farmer-dashboard';
  private version = 1;

  async init(): Promise<void> {
    this.db = await openDB<FarmerDB>(this.dbName, this.version, {
      upgrade(db) {
        // Create object stores
        if (!db.objectStoreNames.contains('kpis')) {
          db.createObjectStore('kpis');
        }
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks');
        }
        if (!db.objectStoreNames.contains('weather')) {
          db.createObjectStore('weather');
        }
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products');
        }
        if (!db.objectStoreNames.contains('orders')) {
          db.createObjectStore('orders');
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue');
        }
      },
    });
  }

  async get<T>(store: keyof FarmerDB, key: string): Promise<T | undefined> {
    if (!this.db) await this.init();
    return this.db!.get(store as any, key);
  }

  async set<T>(store: keyof FarmerDB, key: string, value: T): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put(store as any, value, key);
  }

  async delete(store: keyof FarmerDB, key: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete(store as any, key);
  }

  async getAll<T>(store: keyof FarmerDB): Promise<T[]> {
    if (!this.db) await this.init();
    return this.db!.getAll(store as any);
  }

  async clear(store: keyof FarmerDB): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.clear(store as any);
  }

  // Sync queue operations
  async addToSyncQueue(
    action: 'create' | 'update' | 'delete',
    entity: string,
    data: any
  ): Promise<void> {
    const id = `${entity}-${Date.now()}-${Math.random()}`;
    await this.set('syncQueue', id, {
      id,
      action,
      entity,
      data,
      timestamp: Date.now(),
    });
  }

  async getSyncQueue(): Promise<any[]> {
    return this.getAll('syncQueue');
  }

  async clearSyncQueue(): Promise<void> {
    await this.clear('syncQueue');
  }

  async removeSyncItem(id: string): Promise<void> {
    await this.delete('syncQueue', id);
  }
}

// Singleton instance
let storage: OfflineStorage | null = null;

export function getOfflineStorage(): OfflineStorage {
  if (!storage) {
    storage = new OfflineStorage();
  }
  return storage;
}

// React Hook for offline storage
export function useOfflineStorage<T>(
  store: keyof FarmerDB,
  key: string,
  initialValue?: T
): [T | undefined, (value: T) => Promise<void>, boolean] {
  const [value, setValue] = React.useState<T | undefined>(initialValue);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      const storage = getOfflineStorage();
      const data = await storage.get<T>(store, key);
      setValue(data || initialValue);
      setIsLoading(false);
    };
    loadData();
  }, [store, key, initialValue]);

  const updateValue = async (newValue: T) => {
    const storage = getOfflineStorage();
    await storage.set(store, key, newValue);
    setValue(newValue);
  };

  return [value, updateValue, isLoading];
}

// Background sync
export async function syncOfflineData(): Promise<void> {
  const storage = getOfflineStorage();
  const queue = await storage.getSyncQueue();

  if (queue.length === 0) {
    console.log('No offline data to sync');
    return;
  }

  console.log(`Syncing ${queue.length} offline changes...`);

  for (const item of queue) {
    try {
      // TODO: Send to actual API
      // await fetch(`/api/${item.entity}`, {
      //   method: item.action === 'delete' ? 'DELETE' : 'POST',
      //   body: JSON.stringify(item.data),
      // });

      console.log(`Synced ${item.action} on ${item.entity}`);
      await storage.removeSyncItem(item.id);
    } catch (error) {
      console.error(`Failed to sync ${item.id}:`, error);
    }
  }

  console.log('Sync complete');
}
