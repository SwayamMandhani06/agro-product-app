import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { wishlistRepository } from './data/wishlist-repository';

interface WishlistState {
  savedProductIds: string[];
  toggleSaved: (productId: string, userId?: string) => void;
  saveProduct: (productId: string, userId?: string) => void;
  removeProduct: (productId: string, userId?: string) => void;
  isSaved: (productId: string) => boolean;
  getSavedProducts: (allProducts?: Product[]) => Product[];
  clearWishlist: () => void;
  syncWithBackend: (userId?: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      savedProductIds: ['prod_1', 'prod_4'], // Seeded initially for rich demonstration

      toggleSaved: (productId: string, userId?: string) => {
        const current = get().savedProductIds;
        if (current.includes(productId)) {
          set({ savedProductIds: current.filter((id) => id !== productId) });
          wishlistRepository.removeWishlistItem(productId, userId);
        } else {
          set({ savedProductIds: [productId, ...current] });
          wishlistRepository.addWishlistItem(productId, userId);
        }
      },

      saveProduct: (productId: string, userId?: string) => {
        const current = get().savedProductIds;
        if (!current.includes(productId)) {
          set({ savedProductIds: [productId, ...current] });
          wishlistRepository.addWishlistItem(productId, userId);
        }
      },

      removeProduct: (productId: string, userId?: string) => {
        set({ savedProductIds: get().savedProductIds.filter((id) => id !== productId) });
        wishlistRepository.removeWishlistItem(productId, userId);
      },

      isSaved: (productId: string) => {
        return get().savedProductIds.includes(productId);
      },

      getSavedProducts: (allProducts = MOCK_PRODUCTS) => {
        const ids = get().savedProductIds;
        return ids
          .map((id) => allProducts.find((p) => p.id === id))
          .filter((p): p is Product => p !== undefined);
      },

      clearWishlist: () => set({ savedProductIds: [] }),

      syncWithBackend: async (userId = 'usr_default') => {
        const remoteIds = await wishlistRepository.getWishlistProductIds(userId);
        if (remoteIds.length > 0) {
          const merged = Array.from(new Set([...get().savedProductIds, ...remoteIds]));
          set({ savedProductIds: merged });
        }
      },
    }),
    {
      name: 'agritrade-wishlist',
    }
  )
);
