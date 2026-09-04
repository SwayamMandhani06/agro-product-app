// ============================================================
// LOGISTICS STORE — Zustand
// Operational state store for rural logistics & shipment intelligence
// ============================================================

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order } from '@/types';
import type {
  Shipment,
  ShipmentStatus,
} from './domain/shipment';
import { DemoLogisticsProvider, INITIAL_MOCK_SHIPMENTS } from './data/demo-logistics-provider';
import { shipmentStatusToOrderStatus } from './domain/shipment';
import { useOrdersStore } from '@/features/orders/store';
import { useNotificationsStore } from '@/features/notifications/notifications-store';

const provider = new DemoLogisticsProvider();

interface LogisticsState {
  shipments: Shipment[];
  searchQuery: string;
  statusFilter: ShipmentStatus | 'all';
  selectedShipmentId: string | null;

  // Selectors & Actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: ShipmentStatus | 'all') => void;
  selectShipment: (id: string | null) => void;
  getShipmentById: (id: string) => Shipment | undefined;
  getShipmentByOrderId: (orderId: string) => Shipment | undefined;

  // Lifecycle Operations
  createShipmentForOrder: (order: Order) => Promise<Shipment>;
  advanceMilestone: (shipmentId: string) => Promise<Shipment | null>;
  simulateException: (
    shipmentId: string,
    reason: 'weather_delay' | 'route_delay' | 'address_clarification_required'
  ) => Promise<Shipment | null>;
  recordDeliveryAttempt: (
    shipmentId: string,
    reason: 'customer_unavailable' | 'security_gate_locked' | 'weather_delay'
  ) => Promise<Shipment | null>;
  completeDelivery: (shipmentId: string) => Promise<Shipment | null>;
  updateShipmentFromRealtime: (updated: Partial<Shipment> & { id: string }) => void;
}

export const useLogisticsStore = create<LogisticsState>()(
  persist(
    (set, get) => ({
      shipments: INITIAL_MOCK_SHIPMENTS,
      searchQuery: '',
      statusFilter: 'all',
      selectedShipmentId: null,

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),
      selectShipment: (selectedShipmentId) => set({ selectedShipmentId }),

      getShipmentById: (id) => get().shipments.find((s) => s.id === id),
      getShipmentByOrderId: (orderId) => get().shipments.find((s) => s.orderId === orderId),

      createShipmentForOrder: async (order: Order) => {
        const existing = get().getShipmentByOrderId(order.id);
        if (existing) return existing;

        const newShipment = await provider.createShipment(order);
        set((state) => ({
          shipments: [newShipment, ...state.shipments],
        }));

        useNotificationsStore.getState().addNotification({
          userId: 'usr_default',
          title: 'Shipment Created',
          body: `Shipment #${newShipment.id} created for Order #${order.id}. Waybill: ${newShipment.trackingNumber}`,
          type: 'orders',
          actionRoute: `/orders/${order.id}`,
        });

        return newShipment;
      },

      advanceMilestone: async (shipmentId: string) => {
        const updated = await provider.advanceMilestone(shipmentId);
        if (!updated) return null;

        set((state) => ({
          shipments: state.shipments.map((s) => (s.id === shipmentId ? { ...updated } : s)),
        }));

        // Keep Order status synchronized
        const orderStatus = shipmentStatusToOrderStatus(updated.status);
        useOrdersStore.getState().updateOrderStatus(updated.orderId, orderStatus, {
          estimatedDelivery: `${new Date(updated.estimatedDeliveryEnd).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
          })}`,
          agentName: updated.deliveryAgent?.name,
          agentPhone: updated.deliveryAgent?.phone,
        });

        useNotificationsStore.getState().addNotification({
          userId: 'usr_default',
          title: `Shipment ${updated.status}`,
          body: `Shipment #${updated.id} reached: ${updated.currentLocation}`,
          type: 'orders',
          actionRoute: `/orders/${updated.orderId}`,
        });

        return updated;
      },

      simulateException: async (shipmentId, reason) => {
        const updated = await provider.simulateException(shipmentId, reason);
        if (!updated) return null;

        set((state) => ({
          shipments: state.shipments.map((s) => (s.id === shipmentId ? { ...updated } : s)),
        }));

        useNotificationsStore.getState().addNotification({
          userId: 'usr_default',
          title: 'Transit Advisory',
          body: `Delay recorded on #${shipmentId}: ${reason.replace(/_/g, ' ')}`,
          type: 'weather',
          actionRoute: `/orders/${updated.orderId}`,
        });

        return updated;
      },

      recordDeliveryAttempt: async (shipmentId, reason) => {
        const updated = await provider.recordDeliveryAttempt(shipmentId, reason);
        if (!updated) return null;

        set((state) => ({
          shipments: state.shipments.map((s) => (s.id === shipmentId ? { ...updated } : s)),
        }));

        const orderStatus = shipmentStatusToOrderStatus(updated.status);
        useOrdersStore.getState().updateOrderStatus(updated.orderId, orderStatus);

        useNotificationsStore.getState().addNotification({
          userId: 'usr_default',
          title: 'Delivery Attempted',
          body: `Attempt registered on #${shipmentId}: ${reason.replace(/_/g, ' ')}`,
          type: 'orders',
          actionRoute: `/orders/${updated.orderId}`,
        });

        return updated;
      },

      completeDelivery: async (shipmentId) => {
        const updated = await provider.completeDelivery(shipmentId);
        if (!updated) return null;

        set((state) => ({
          shipments: state.shipments.map((s) => (s.id === shipmentId ? { ...updated } : s)),
        }));

        const orderStatus = shipmentStatusToOrderStatus('delivered');
        useOrdersStore.getState().updateOrderStatus(updated.orderId, orderStatus);

        useNotificationsStore.getState().addNotification({
          userId: 'usr_default',
          title: 'Order Delivered',
          body: `Shipment #${updated.id} has been delivered successfully to your farm gate.`,
          type: 'orders',
          actionRoute: `/orders/${updated.orderId}`,
        });

        return updated;
      },

      updateShipmentFromRealtime: (updated) => {
        set((state) => ({
          shipments: state.shipments.map((s) =>
            s.id === updated.id ? ({ ...s, ...updated } as Shipment) : s
          ),
        }));
      },
    }),
    {
      name: 'agritrade_logistics_store',
      partialize: (state) => ({
        shipments: state.shipments,
      }),
    }
  )
);
