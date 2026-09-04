// ============================================================
// CART STORE — Zustand
// Mirrors apps/mobile/lib/features/cart_checkout/
// Business rule: delivery ₹0 if subtotal >= ₹1000, else ₹99
// ============================================================

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';
import { calculateDeliveryFee } from '@/types';

interface CartState {
  items: CartItem[];

  // Computed (derived inline)
  subtotal: () => number;
  totalSavings: () => number;
  deliveryFee: () => number;
  totalAmount: () => number;
  totalItemCount: () => number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  hasItem: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

      totalSavings: () =>
        get().items.reduce((sum, item) => {
          const orig = item.product.originalPrice ?? item.product.price;
          return sum + (orig - item.product.price) * item.quantity;
        }, 0),

      deliveryFee: () => calculateDeliveryFee(get().subtotal()),

      totalAmount: () => get().subtotal() + get().deliveryFee(),

      totalItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      addItem: (product: Product, quantity = 1) => {
        const maxStock = product.stockCount !== undefined && product.stockCount > 0 ? product.stockCount : 99;
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, maxStock);
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: nextQty } : i
              ),
            };
          }
          const initialQty = Math.min(quantity, maxStock);
          return { items: [...state.items, { product, quantity: initialQty }] };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => {
          const target = state.items.find((i) => i.product.id === productId);
          const maxStock = target?.product.stockCount !== undefined && target.product.stockCount > 0 ? target.product.stockCount : 99;
          const clamped = Math.min(quantity, maxStock);
          return {
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity: clamped } : i
            ),
          };
        });
      },


      clearCart: () => set({ items: [] }),

      hasItem: (productId: string) =>
        get().items.some((i) => i.product.id === productId),

      getItemQuantity: (productId: string) =>
        get().items.find((i) => i.product.id === productId)?.quantity ?? 0,
    }),
    {
      name: 'agritrade-cart',
    }
  )
);
