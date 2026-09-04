// ============================================================
// REALTIME SHIPMENTS & TRACKING SUBSCRIPTION
// Subscribes to postgres_changes on public.shipments and public.tracking_events
// ============================================================

import { getSupabaseClient } from '@/lib/supabase/client';
import type { Shipment, TrackingEvent } from '@/features/logistics/domain/shipment';

export type ShipmentUpdateListener = (shipment: Partial<Shipment> & { id: string }) => void;
export type TrackingEventListener = (event: TrackingEvent) => void;

export function subscribeToShipmentUpdates(
  userId = 'usr_default',
  onShipmentUpdate: ShipmentUpdateListener,
  onNewTrackingEvent?: TrackingEventListener
): () => void {
  const client = getSupabaseClient();

  if (client) {
    const channel = client
      .channel(`realtime_shipments_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shipments',
          filter: `user_id=eq.${userId}`,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          if (payload.new) {
            const row = payload.new;
            onShipmentUpdate({
              id: row.id,
              orderId: row.order_id,
              status: row.status,
              currentLocation: row.current_location,
              updatedAt: row.updated_at,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tracking_events',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          if (payload.new && onNewTrackingEvent) {
            const row = payload.new;
            onNewTrackingEvent({
              id: row.id,
              shipmentId: row.shipment_id,
              status: row.status,
              location: row.location,
              description: row.description,
              eventTime: row.event_time,
            });
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }

  // No-op unsubscribe for local demo mode
  return () => {};
}
