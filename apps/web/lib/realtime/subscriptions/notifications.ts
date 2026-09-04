// ============================================================
// REALTIME NOTIFICATIONS SUBSCRIPTION
// Subscribes to postgres_changes on public.notifications
// ============================================================

import { getSupabaseClient } from '@/lib/supabase/client';
import type { NotificationItem, NotificationType } from '@/types';

export type NotificationListener = (notification: NotificationItem) => void;

export function subscribeToNotifications(
  userId = 'usr_default',
  onNotification: NotificationListener
): () => void {
  const client = getSupabaseClient();

  if (client) {
    const channel = client
      .channel(`realtime_notifications_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          if (payload.new) {
            const row = payload.new;
            const item: NotificationItem = {
              id: row.id,
              userId: row.user_id,
              title: row.title,
              body: row.body,
              type: row.type as NotificationType,
              isRead: row.is_read,
              actionRoute: row.action_route,
              createdAt: row.created_at,
            };
            onNotification(item);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }

  return () => {};
}
