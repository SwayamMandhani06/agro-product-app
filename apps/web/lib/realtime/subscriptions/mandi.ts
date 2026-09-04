// ============================================================
// REALTIME MANDI PRICE SUBSCRIPTION
// Subscribes to postgres_changes on public.mandi_prices
// with fallback to realistic live APMC simulation
// ============================================================

import { getSupabaseClient } from '@/lib/supabase/client';
import type { MandiPrice } from '@/types';
import { MOCK_MANDI_PRICES } from '@/lib/mock-data';

export type MandiUpdateListener = (updatedPrice: MandiPrice) => void;

export function subscribeToMandiPrices(onUpdate: MandiUpdateListener): () => void {
  const client = getSupabaseClient();

  if (client) {
    const channel = client
      .channel('realtime_mandi_prices')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mandi_prices',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          if (payload.new) {
            const row = payload.new;
            const updated: MandiPrice = {
              crop: row.crop,
              price: row.price,
              change: row.change,
              trend: row.trend as 'up' | 'down' | 'flat',
              market: row.market,
            };
            onUpdate(updated);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }

  // Graceful high-fidelity simulation in mock / offline mode:
  // Subtly updates a random commodity price every 14 seconds to demonstrate live intelligence
  let index = 0;
  const timer = setInterval(() => {
    const base = MOCK_MANDI_PRICES[index % MOCK_MANDI_PRICES.length];
    index++;

    // Minor realistic price fluctuation (+/- ₹10 to ₹30)
    const delta = (Math.random() > 0.45 ? 1 : -1) * Math.floor(Math.random() * 25 + 5);
    const numericBase = parseInt(base.price.replace(/[^0-9]/g, ''), 10) || 4000;
    const newPriceVal = numericBase + delta;
    const newTrend: 'up' | 'down' | 'flat' = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
    const sign = delta > 0 ? '+' : '';

    const updated: MandiPrice = {
      ...base,
      price: `₹${newPriceVal.toLocaleString('en-IN')}`,
      change: `${sign}₹${delta} (${sign}${((delta / numericBase) * 100).toFixed(2)}%)`,
      trend: newTrend,
    };

    onUpdate(updated);
  }, 14000);

  return () => {
    clearInterval(timer);
  };
}
