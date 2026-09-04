// ============================================================
// ORDERS STORE — Zustand
// Mirrors apps/mobile/lib/features/orders/
// ============================================================

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, CartItem, DeliveryAddress } from '@/types';
import { MOCK_ORDERS } from '@/lib/mock-data';
import { calculateDeliveryFee } from '@/types';

interface OrdersState {
  orders: Order[];

  // Actions
  placeOrder: (
    items: CartItem[],
    address: DeliveryAddress,
    paymentMethod: string
  ) => Order;
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (
    orderId: string,
    status: Order['status'],
    details?: { estimatedDelivery?: string; agentName?: string; agentPhone?: string }
  ) => void;
  advanceOrderStatus: (orderId: string) => Order['status'] | null;
  reorder: (orderId: string) => CartItem[];
  getOrderById: (orderId: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: MOCK_ORDERS,

      placeOrder: (items, address, paymentMethod) => {
        const subtotal = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        const deliveryFee = calculateDeliveryFee(subtotal);

        const newOrder: Order = {
          id: `ORD-${Date.now()}`,
          items,
          address,
          paymentMethod,
          subtotal,
          deliveryFee,
          discount: 0,
          totalAmount: subtotal + deliveryFee,
          createdAt: new Date().toISOString(),
          status: 'confirmed',
          estimatedDelivery: '2–4 business days',
        };

        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },

      cancelOrder: (orderId: string) => {
        const cancellable = ['placed', 'confirmed', 'processing'];
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId && cancellable.includes(o.status)
              ? { ...o, status: 'cancelled' }
              : o
          ),
        }));
      },

      updateOrderStatus: (orderId, status, details) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id === orderId) {
              return {
                ...o,
                status,
                estimatedDelivery: details?.estimatedDelivery ?? o.estimatedDelivery,
                deliveryAgentName: details?.agentName ?? o.deliveryAgentName,
                deliveryAgentPhone: details?.agentPhone ?? o.deliveryAgentPhone,
              };
            }
            return o;
          }),
        }));
      },

      advanceOrderStatus: (orderId) => {
        const order = get().getOrderById(orderId);
        if (!order || order.status === 'cancelled' || order.status === 'delivered') {
          return null;
        }

        const stages: Order['status'][] = [
          'placed',
          'confirmed',
          'processing',
          'shipped',
          'outForDelivery',
          'delivered',
        ];

        const currentIndex = stages.indexOf(order.status);
        if (currentIndex < 0 || currentIndex >= stages.length - 1) return null;

        const nextStatus = stages[currentIndex + 1];
        get().updateOrderStatus(orderId, nextStatus);
        return nextStatus;
      },

      reorder: (orderId: string) => {
        const order = get().getOrderById(orderId);
        return order ? order.items : [];
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((o) => o.id === orderId);
      },
    }),

    {
      name: 'agritrade-orders',
    }
  )
);
