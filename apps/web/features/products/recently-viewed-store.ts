import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface RecentlyViewedState {
  items: Product[];
  recordView: (product: Product) => void;
  clearHistory: () => void;
  getRecentExcluding: (currentProductId?: string, limit?: number) => Product[];
}

const MAX_HISTORY = 8;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      recordView: (product: Product) => {
        const current = get().items;
        // Filter out duplicate if present, then prepend to start
        const filtered = current.filter((item) => item.id !== product.id);
        const updated = [product, ...filtered].slice(0, MAX_HISTORY);
        set({ items: updated });
      },

      clearHistory: () => set({ items: [] }),

      getRecentExcluding: (currentProductId?: string, limit = 4) => {
        const items = get().items;
        return items
          .filter((p) => p.id !== currentProductId)
          .slice(0, limit);
      },
    }),
    {
      name: 'agritrade-recently-viewed',
    }
  )
);
