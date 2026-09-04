import type { NotificationItem, NotificationType } from '@/types';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface NotificationRepository {
  getNotifications(userId?: string): Promise<NotificationItem[]>;
  markAsRead(notificationId: string): Promise<boolean>;
  markAllAsRead(userId?: string): Promise<boolean>;
}

export class SupabaseNotificationRepository implements NotificationRepository {
  async getNotifications(userId = 'usr_default'): Promise<NotificationItem[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return [];
      }

      return data.map((row: {
        id: string;
        user_id: string;
        title: string;
        body: string;
        type: string;
        is_read: boolean;
        action_route?: string;
        created_at: string;
      }) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        body: row.body,
        type: row.type as NotificationType,
        isRead: row.is_read,
        actionRoute: row.action_route,
        createdAt: row.created_at,
      }));
    } catch {
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return true;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      return !error;
    } catch {
      return false;
    }
  }

  async markAllAsRead(userId = 'usr_default'): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return true;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId);

      return !error;
    } catch {
      return false;
    }
  }
}

export const notificationRepository: NotificationRepository = new SupabaseNotificationRepository();
