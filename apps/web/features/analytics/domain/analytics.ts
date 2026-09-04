// ============================================================
// AGRITRADE ANALYTICS DOMAIN ENTITIES
// Institutional agricultural intelligence and financial metrics
// ============================================================

export type TimeRange = '7d' | '30d' | '3m' | '6m' | '1y';

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  '7d': '7 Days',
  '30d': '30 Days',
  '3m': '3 Months',
  '6m': '6 Months',
  '1y': '1 Year',
};

export interface SpendingMetric {
  totalSpend: number;
  previousPeriodSpend: number;
  percentageChange: number;
  trendDirection: 'up' | 'down' | 'flat';
  orderCount: number;
  averageOrderValue: number;
}

export interface SpendingTrendPoint {
  date: string;
  label: string;
  amount: number;
  benchmarkAmount?: number;
  orderCount: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  orderCount: number;
  topItem: string;
  previousPeriodAmount: number;
  growthRate: number;
}

export interface SeasonalPattern {
  id: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Pre-Monsoon';
  primaryCategory: string;
  peakMonths: string;
  observation: string;
  historicalSpend: number;
  recommendedAction: string;
  confidenceScore: number;
}

export interface SavingsMetric {
  totalSavings: number;
  productDiscountSavings: number;
  deliverySavings: number;
  bulkSavings: number;
  averageDiscountPercent: number;
  traditionalRetailEstimate: number;
  netFarmerAdvantage: number;
  savingsByCategory: Record<string, number>;
}

export interface DeliveryPerformanceMetric {
  totalOrders: number;
  deliveredOrders: number;
  activeShipments: number;
  delayedDeliveries: number;
  deliveryAttemptRate: number;
  averageDeliveryHours: number;
  onTimeRate: number;
  historyTrend: { period: string; onTimeRate: number }[];
}

export interface CommodityPriceHistoryPoint {
  date: string;
  label: string;
  price: number;
}

export interface MarketComparison {
  commodity: string;
  variety: string;
  mandi: string;
  state: string;
  currentPrice: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  movementPercent: number;
  trend: 'up' | 'down' | 'flat';
  historicalPrices: CommodityPriceHistoryPoint[];
}

export interface FarmAnalyticsSnapshot {
  timeRange: TimeRange;
  lastUpdated: string;
  spending: SpendingMetric;
  spendingTrend: SpendingTrendPoint[];
  categories: CategorySpending[];
  seasonalPatterns: SeasonalPattern[];
  savings: SavingsMetric;
  deliveryPerformance: DeliveryPerformanceMetric;
  marketComparisons: MarketComparison[];
}
