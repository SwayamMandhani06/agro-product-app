// ============================================================
// REALTIME ORDER TRACKING SUBSCRIPTION
// Subscribes to postgres_changes on public.orders for active updates
// ============================================================

import { getSupabaseClient } from '@/lib/supabase/client';
import type { OrderStatus } from '@/types';

export interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
  updatedAt: string;
  estimatedDelivery?: string;
  deliveryAgentName?: string;
  deliveryAgentPhone?: string;
}

export type OrderUpdateListener = (update: OrderStatusUpdate) => void;

export function subscribeToOrderUpdates(
  userId = 'usr_default',
  onUpdate: OrderUpdateListener
): () => void {
  const client = getSupabaseClient();

  if (client) {
    const channel = client
      .channel(`realtime_orders_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          if (payload.new) {
            const row = payload.new;
            onUpdate({
              orderId: row.id,
              status: row.status as OrderStatus,
              updatedAt: row.updated_at || new Date().toISOString(),
              estimatedDelivery: row.estimated_delivery,
              deliveryAgentName: row.delivery_agent_name,
              deliveryAgentPhone: row.delivery_agent_phone,
            });
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }

  // No-op unsubscribe for local mock mode
  return () => {};
}
