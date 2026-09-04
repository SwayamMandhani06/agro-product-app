import type { MandiPrice, MandiCommodityDetail } from '@/types';
import { MOCK_MANDI_PRICES } from '@/lib/mock-data';
import { getSupabaseClient } from '@/lib/supabase/client';

export const MOCK_COMMODITY_DETAILS: MandiCommodityDetail[] = [
  {
    id: 'cmd_soybean',
    crop: 'Soybean',
    variety: 'Yellow (Standard Moisture)',
    market: 'Indore APMC',
    state: 'Madhya Pradesh',
    modalPrice: 4320,
    minPrice: 4150,
    maxPrice: 4450,
    change: '+₹45 (+1.05%)',
    trend: 'up',
    arrivalVolumeTonnes: 1250,
    updatedAt: 'Today, 11:30 AM',
    sparkline: [4180, 4210, 4200, 4250, 4275, 4300, 4320],
    marketComparisons: [
      { marketName: 'Indore APMC (MP)', modalPrice: 4320, difference: 'Benchmark' },
      { marketName: 'Dewas APMC (MP)', modalPrice: 4280, difference: '-₹40' },
      { marketName: 'Ujjain APMC (MP)', modalPrice: 4310, difference: '-₹10' },
      { marketName: 'Latur APMC (MH)', modalPrice: 4360, difference: '+₹40' },
    ],
  },
  {
    id: 'cmd_cotton',
    crop: 'Cotton',
    variety: 'Medium Staple (Shankar-6)',
    market: 'Rajkot APMC',
    state: 'Gujarat',
    modalPrice: 7150,
    minPrice: 6900,
    maxPrice: 7350,
    change: '+₹80 (+1.13%)',
    trend: 'up',
    arrivalVolumeTonnes: 890,
    updatedAt: 'Today, 10:45 AM',
    sparkline: [6980, 7020, 7050, 7010, 7090, 7120, 7150],
    marketComparisons: [
      { marketName: 'Rajkot APMC (GJ)', modalPrice: 7150, difference: 'Benchmark' },
      { marketName: 'Akola APMC (MH)', modalPrice: 7080, difference: '-₹70' },
      { marketName: 'Warangal Mandi (TS)', modalPrice: 7190, difference: '+₹40' },
      { marketName: 'Surendranagar (GJ)', modalPrice: 7110, difference: '-₹40' },
    ],
  },
  {
    id: 'cmd_wheat',
    crop: 'Wheat',
    variety: 'Sharbati (Grade A)',
    market: 'Sehore APMC',
    state: 'Madhya Pradesh',
    modalPrice: 2480,
    minPrice: 2350,
    maxPrice: 2560,
    change: '₹0 (0.00%)',
    trend: 'flat',
    arrivalVolumeTonnes: 2100,
    updatedAt: 'Today, 01:15 PM',
    sparkline: [2480, 2470, 2490, 2480, 2485, 2480, 2480],
    marketComparisons: [
      { marketName: 'Sehore APMC (MP)', modalPrice: 2480, difference: 'Benchmark' },
      { marketName: 'Vidisha APMC (MP)', modalPrice: 2460, difference: '-₹20' },
      { marketName: 'Khanna Mandi (PB)', modalPrice: 2320, difference: '-₹160' },
      { marketName: 'Karnal Mandi (HR)', modalPrice: 2340, difference: '-₹140' },
    ],
  },
  {
    id: 'cmd_mustard',
    crop: 'Mustard',
    variety: 'Black (42% Oil Content)',
    market: 'Jaipur Mandi',
    state: 'Rajasthan',
    modalPrice: 5620,
    minPrice: 5450,
    maxPrice: 5750,
    change: '+₹30 (+0.54%)',
    trend: 'up',
    arrivalVolumeTonnes: 650,
    updatedAt: 'Today, 12:00 PM',
    sparkline: [5520, 5540, 5580, 5560, 5590, 5600, 5620],
    marketComparisons: [
      { marketName: 'Jaipur Mandi (RJ)', modalPrice: 5620, difference: 'Benchmark' },
      { marketName: 'Alwar APMC (RJ)', modalPrice: 5580, difference: '-₹40' },
      { marketName: 'Bharatpur APMC (RJ)', modalPrice: 5610, difference: '-₹10' },
      { marketName: 'Agra Mandi (UP)', modalPrice: 5540, difference: '-₹80' },
    ],
  },
  {
    id: 'cmd_onion',
    crop: 'Onion',
    variety: 'Red Nashik (Medium-Large)',
    market: 'Lasalgaon APMC',
    state: 'Maharashtra',
    modalPrice: 1850,
    minPrice: 1600,
    maxPrice: 2100,
    change: '-₹60 (-3.14%)',
    trend: 'down',
    arrivalVolumeTonnes: 4200,
    updatedAt: 'Today, 10:15 AM',
    sparkline: [1980, 1960, 1920, 1940, 1900, 1890, 1850],
    marketComparisons: [
      { marketName: 'Lasalgaon APMC (MH)', modalPrice: 1850, difference: 'Benchmark' },
      { marketName: 'Pimpalgaon APMC (MH)', modalPrice: 1890, difference: '+₹40' },
      { marketName: 'Solapur APMC (MH)', modalPrice: 1780, difference: '-₹70' },
      { marketName: 'Yeshwanthpur (KA)', modalPrice: 2120, difference: '+₹270' },
    ],
  },
  {
    id: 'cmd_tomato',
    crop: 'Tomato',
    variety: 'Hybrid Round',
    market: 'Narayangaon APMC',
    state: 'Maharashtra',
    modalPrice: 1250,
    minPrice: 1000,
    maxPrice: 1450,
    change: '+₹120 (+10.6%)',
    trend: 'up',
    arrivalVolumeTonnes: 1800,
    updatedAt: 'Today, 09:30 AM',
    sparkline: [1020, 1080, 1110, 1150, 1180, 1200, 1250],
    marketComparisons: [
      { marketName: 'Narayangaon (MH)', modalPrice: 1250, difference: 'Benchmark' },
      { marketName: 'Kolar APMC (KA)', modalPrice: 1320, difference: '+₹70' },
      { marketName: 'Madanapalle (AP)', modalPrice: 1280, difference: '+₹30' },
      { marketName: 'Nashik APMC (MH)', modalPrice: 1210, difference: '-₹40' },
    ],
  },
];

export interface MandiRepository {
  getMandiPrices(): Promise<MandiPrice[]>;
  getCommodityDetails(): Promise<MandiCommodityDetail[]>;
  getCommodityById(id: string): Promise<MandiCommodityDetail | null>;
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

  async getCommodityDetails(): Promise<MandiCommodityDetail[]> {
    return MOCK_COMMODITY_DETAILS;
  }

  async getCommodityById(id: string): Promise<MandiCommodityDetail | null> {
    const item = MOCK_COMMODITY_DETAILS.find((c) => c.id === id);
    return item ?? null;
  }
}

export const mandiRepository: MandiRepository = new SupabaseMandiRepository();
