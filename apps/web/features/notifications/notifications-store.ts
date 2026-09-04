import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NotificationItem, NotificationType } from '@/types';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_default',
    title: 'Consignment Dispatched: Order #AT842918',
    body: 'Your 2x Premium Hybrid Soybean Seeds have been packed and handed over to Delhivery logistics. Expected delivery tomorrow.',
    type: 'orders',
    isRead: false,
    actionRoute: '/orders/ORD-2024-001',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'notif_2',
    userId: 'usr_default',
    title: 'Mandi Rate Spike: Yellow Soybean +₹45',
    body: 'Indore APMC benchmark modal price reached ₹4,320 / qtl with robust solvent extraction plant procurement.',
    type: 'prices',
    isRead: false,
    actionRoute: '/mandi',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'notif_3',
    userId: 'usr_default',
    title: 'Advisory: High Rainfall Warning in Pune',
    body: '65% precipitation probability forecast over next 24 hours. Postpone foliar pesticide sprays to prevent chemical wash-off.',
    type: 'weather',
    isRead: true,
    actionRoute: '/weather',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'notif_4',
    userId: 'usr_default',
    title: 'Back in Stock: EcoGrow Liquid Fertilizer',
    body: 'New manufacturing batch of 1L concentrated bottles is now available at verified direct-from-factory pricing.',
    type: 'products',
    isRead: true,
    actionRoute: '/products/prod_7',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: 'notif_5',
    userId: 'usr_default',
    title: 'Platform Maintenance Notice',
    body: 'Scheduled APMC price sync pipeline update on Sunday 02:00 AM. Ordering services will continue without interruption.',
    type: 'system',
    isRead: true,
    actionRoute: '/home',
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
];

interface NotificationsState {
  notifications: NotificationItem[];
  filter: 'all' | NotificationType;
  setFilter: (filter: 'all' | NotificationType) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: () => number;
  filteredNotifications: () => NotificationItem[];
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: INITIAL_NOTIFICATIONS,
      filter: 'all',

      setFilter: (filter) => set({ filter }),

      markAsRead: (id: string) => {
        set({
          notifications: get().notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        });
      },

      markAllAsRead: () => {
        set({
          notifications: get().notifications.map((n) => ({ ...n, isRead: true })),
        });
      },

      unreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length;
      },

      filteredNotifications: () => {
        const { notifications, filter } = get();
        if (filter === 'all') return notifications;
        return notifications.filter((n) => n.type === filter);
      },
    }),
    {
      name: 'agritrade-notifications',
    }
  )
);
