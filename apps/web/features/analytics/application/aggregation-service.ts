// ============================================================
// AGRITRADE ANALYTICS AGGREGATION SERVICE
// Deterministic financial and operational calculation formulas
// ============================================================

import type {
  TimeRange,
  CategorySpending,
} from '../domain/analytics';

/**
 * Calculates total direct savings achieved by the farmer across orders.
 * Includes explicit item discounts, coupon deductions, and free delivery thresholds.
 */
export function calculateTotalSavings(
  discountSavings: number,
  deliverySavings: number,
  bulkSavings: number = 0
): number {
  return Math.max(0, discountSavings + deliverySavings + bulkSavings);
}

/**
 * Calculates estimated traditional retail pricing.
 * In rural markets, offline middleman retail markup averages 14% to 18% over direct catalog prices.
 */
export function calculateRetailComparison(totalSpend: number, markupPercentage: number = 16.5): number {
  if (totalSpend <= 0) return 0;
  return Math.round(totalSpend * (1 + markupPercentage / 100));
}

/**
 * Calculates the average discount percentage realized across all purchased items.
 */
export function calculateAverageDiscount(subtotal: number, discountAmount: number): number {
  if (subtotal <= 0) return 0;
  return Math.min(100, Math.round((discountAmount / (subtotal + discountAmount)) * 1000) / 10);
}

/**
 * Calculates delivery savings compared to standard rural freight (₹150 standard tier).
 */
export function calculateDeliverySavings(deliveredOrderCount: number, actualDeliveryFeesPaid: number): number {
  const standardRuralFreightBaseline = deliveredOrderCount * 150;
  return Math.max(0, standardRuralFreightBaseline - actualDeliveryFeesPaid);
}

/**
 * Calculates spending change percentage between the current period and prior period.
 */
export function calculateSpendingChange(
  currentSpend: number,
  previousSpend: number
): { percentageChange: number; trendDirection: 'up' | 'down' | 'flat' } {
  if (previousSpend <= 0) {
    return {
      percentageChange: currentSpend > 0 ? 100 : 0,
      trendDirection: currentSpend > 0 ? 'up' : 'flat',
    };
  }

  const change = ((currentSpend - previousSpend) / previousSpend) * 100;
  const rounded = Math.round(change * 10) / 10;

  if (Math.abs(rounded) < 0.5) {
    return { percentageChange: 0, trendDirection: 'flat' };
  }

  return {
    percentageChange: Math.abs(rounded),
    trendDirection: rounded > 0 ? 'up' : 'down',
  };
}

/**
 * Normalizes category spending distribution to ensure exact 100% total allocation.
 */
export function normalizeCategoryPercentages(categories: CategorySpending[]): CategorySpending[] {
  const totalAmount = categories.reduce((sum, c) => sum + c.amount, 0);
  if (totalAmount <= 0) return categories;

  return categories.map((cat) => ({
    ...cat,
    percentage: Math.round((cat.amount / totalAmount) * 1000) / 10,
  }));
}

/**
 * Converts days filter to days count for analytics windowing.
 */
export function getTimeRangeDays(range: TimeRange): number {
  switch (range) {
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '3m':
      return 90;
    case '6m':
      return 180;
    case '1y':
      return 365;
  }
}
