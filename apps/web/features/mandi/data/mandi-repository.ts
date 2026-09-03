import type { MandiPrice } from '@/types';
import { MOCK_MANDI_PRICES } from '@/lib/mock-data';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface MandiRepository {
  getMandiPrices(): Promise<MandiPrice[]>;
}

export class SupabaseMandiRepository implements MandiRepository {
  async getMandiPrices(): Promise<MandiPrice[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return MOCK_MANDI_PRICES;
    }

    try {
      const { data, error } = await supabase
        .from('mandi_prices')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return MOCK_MANDI_PRICES;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((row: any) => ({
        crop: row.crop,
        price: row.price,
        change: row.change,
        trend: row.trend as 'up' | 'down' | 'flat',
        market: row.market,
      }));
    } catch {
      return MOCK_MANDI_PRICES;
    }
  }
}

export const mandiRepository: MandiRepository = new SupabaseMandiRepository();
