import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

interface WishlistState {
  savedProductIds: string[];
  toggleSaved: (productId: string) => void;
  saveProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  isSaved: (productId: string) => boolean;
  getSavedProducts: (allProducts?: Product[]) => Product[];
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      savedProductIds: ['prod_1', 'prod_4'], // Seeded initially for rich demonstration

      toggleSaved: (productId: string) => {
        const current = get().savedProductIds;
        if (current.includes(productId)) {
          set({ savedProductIds: current.filter((id) => id !== productId) });
        } else {
          set({ savedProductIds: [productId, ...current] });
        }
      },

      saveProduct: (productId: string) => {
        const current = get().savedProductIds;
        if (!current.includes(productId)) {
          set({ savedProductIds: [productId, ...current] });
        }
      },

      removeProduct: (productId: string) => {
        set({ savedProductIds: get().savedProductIds.filter((id) => id !== productId) });
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
    }),
    {
      name: 'agritrade-wishlist',
    }
  )
);
