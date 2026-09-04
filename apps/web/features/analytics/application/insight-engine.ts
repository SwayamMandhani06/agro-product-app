// ============================================================
// AGRITRADE DETERMINISTIC DECISION INSIGHTS ENGINE
// Pure rules-based diagnosis without ungrounded heuristics
// ============================================================

import type { FarmAnalyticsSnapshot } from '../domain/analytics';
import type { DecisionInsight } from '../domain/insight';

export class FarmInsightEngine {
  /**
   * Generates deterministic decision insights from a verified analytics snapshot.
   */
  public static evaluateSnapshot(snapshot: FarmAnalyticsSnapshot): DecisionInsight[] {
    const insights: DecisionInsight[] = [];

    // Rule 1: Spending Anomaly Detection (>15% growth in any input category)
    const anomalousCategory = snapshot.categories.find(
      (cat) => cat.growthRate >= 15.0 && cat.amount > 3000
    );

    if (anomalousCategory) {
      insights.push({
        id: `ins_anomaly_${anomalousCategory.categoryId}_${snapshot.timeRange}`,
        type: 'spending_anomaly',
        severity: 'warning',
        category: 'spending',
        badgeLabel: 'Purchase Pattern',
        title: `${anomalousCategory.categoryName} spending is ${anomalousCategory.growthRate.toFixed(1)}% above previous baseline`,
        summary: `Capital allocation toward ${anomalousCategory.categoryName.toLowerCase()} reached ₹${anomalousCategory.amount.toLocaleString('en-IN')} across ${anomalousCategory.orderCount} order(s), driven by recurring procurement of ${anomalousCategory.topItem}.`,
        detectedAt: 'Realtime Audit',
        supportingMetric: `+${anomalousCategory.growthRate.toFixed(1)}% vs Prior Period`,
        detail: {
          whatHappened: `Your spending on ${anomalousCategory.categoryName} increased from ₹${anomalousCategory.previousPeriodAmount.toLocaleString('en-IN')} in the preceding period to ₹${anomalousCategory.amount.toLocaleString('en-IN')} in the active ${snapshot.timeRange} window.`,
          whyDetected: `The AgriTrade deterministic threshold flagged an expenditure acceleration of ${anomalousCategory.growthRate.toFixed(1)}%, which exceeds the standard normal operating variance limit of 15.0%.`,
          supportingData: [
            {
              metric: 'Current Period Spend',
              value: `₹${anomalousCategory.amount.toLocaleString('en-IN')}`,
              benchmark: `₹${anomalousCategory.previousPeriodAmount.toLocaleString('en-IN')} (Prior)`,
            },
            {
              metric: 'Share of Total Input Budget',
              value: `${anomalousCategory.percentage.toFixed(1)}%`,
              benchmark: '30.0% standard ceiling',
            },
            {
              metric: 'Key Purchase Item',
              value: anomalousCategory.topItem,
              benchmark: `${anomalousCategory.orderCount} purchase event(s)`,
            },
          ],
          recommendedConsideration: `Audit field application rates with your regional agronomist. Verify whether recent pest pressure or weather shifts necessitated early replenishment before placing further reorders.`,
          actionLabel: 'Review Category Orders',
          actionHref: '/orders',
        },
      });
    }

    // Rule 2: Market Price Opportunity Detection (Commodity dips or high APMC spreads)
    const discountedCommodity = snapshot.marketComparisons.find(
      (c) => c.movementPercent <= -5.0 || (c.avgPrice - c.currentPrice) >= 80
    );

    if (discountedCommodity) {
      const priceDifference = discountedCommodity.avgPrice - discountedCommodity.currentPrice;
      insights.push({
        id: `ins_mkt_${discountedCommodity.commodity.toLowerCase()}_${snapshot.timeRange}`,
        type: 'price_opportunity',
        severity: 'info',
        category: 'market',
        badgeLabel: 'Market Signal',
        title: `${discountedCommodity.commodity} trading ₹${Math.abs(priceDifference)} below 30-day APMC average`,
        summary: `Spot rate at ${discountedCommodity.mandi} is currently ₹${discountedCommodity.currentPrice.toLocaleString('en-IN')} / Quintal (${discountedCommodity.movementPercent.toFixed(1)}% movement), offering favorable procurement or storage retention conditions.`,
        detectedAt: 'Live APMC Feed',
        supportingMetric: `₹${discountedCommodity.currentPrice} ${discountedCommodity.unit}`,
        detail: {
          whatHappened: `${discountedCommodity.commodity} (${discountedCommodity.variety}) price has softened by ${Math.abs(discountedCommodity.movementPercent).toFixed(1)}% at ${discountedCommodity.mandi}, dipping below its rolling average of ₹${discountedCommodity.avgPrice.toLocaleString('en-IN')}.`,
          whyDetected: `Observed spot price is at ₹${discountedCommodity.currentPrice.toLocaleString('en-IN')}, compared against an APMC high of ₹${discountedCommodity.maxPrice.toLocaleString('en-IN')} and average of ₹${discountedCommodity.avgPrice.toLocaleString('en-IN')}.`,
          supportingData: [
            {
              metric: 'Spot Modal Price',
              value: `₹${discountedCommodity.currentPrice.toLocaleString('en-IN')}`,
              benchmark: `₹${discountedCommodity.avgPrice.toLocaleString('en-IN')} (Average)`,
            },
            {
              metric: '30-Day Range',
              value: `₹${discountedCommodity.minPrice} – ₹${discountedCommodity.maxPrice}`,
              benchmark: 'Market Spread',
            },
            {
              metric: 'Terminal Market',
              value: `${discountedCommodity.mandi} (${discountedCommodity.state})`,
              benchmark: 'Verified APMC',
            },
          ],
          recommendedConsideration: `If you are planning post-harvest liquidation, evaluate holding stock in accredited warehouse storage until terminal arrivals stabilize. If purchasing raw inputs, current rates represent seasonal entry value.`,
          actionLabel: 'Compare Mandi Rates',
          actionHref: '/mandi',
        },
      });
    }

    // Rule 3: Delivery Performance Reliability Tracking
    const logistics = snapshot.deliveryPerformance;
    if (logistics.onTimeRate >= 96.0 && logistics.totalOrders > 0) {
      insights.push({
        id: `ins_logistics_${snapshot.timeRange}`,
        type: 'delivery_performance',
        severity: 'positive',
        category: 'logistics',
        badgeLabel: 'Delivery Performance',
        title: `${logistics.onTimeRate.toFixed(1)}% on-time fulfillment rate across ${logistics.totalOrders} shipments`,
        summary: `Your agricultural inputs are averaging ${logistics.averageDeliveryHours} hours from dispatch to farm gate, with a ${logistics.deliveryAttemptRate.toFixed(1)}% first-attempt success rate.`,
        detectedAt: 'Telematics Telemetry',
        supportingMetric: `${logistics.averageDeliveryHours}h Avg Turnaround`,
        detail: {
          whatHappened: `Across ${logistics.totalOrders} total orders (${logistics.deliveredOrders} delivered, ${logistics.activeShipments} in transit), logistics partners sustained a ${logistics.onTimeRate.toFixed(1)}% on-time delivery window compliance.`,
          whyDetected: `Stage 8 rural hub routing and local cargo EV telematics maintained transit timelines within the promised delivery windows across rural route segments.`,
          supportingData: [
            {
              metric: 'On-Time Fulfillment',
              value: `${logistics.onTimeRate.toFixed(1)}%`,
              benchmark: '95.0% Institutional SLA',
            },
            {
              metric: 'Average Transit Duration',
              value: `${logistics.averageDeliveryHours} Hours`,
              benchmark: '48h Rural Standard',
            },
            {
              metric: 'First-Attempt Rate',
              value: `${logistics.deliveryAttemptRate.toFixed(1)}%`,
              benchmark: '90.0% Target',
            },
          ],
          recommendedConsideration: `Your delivery lane has verified rural access. Keep delivery pin location synchronized to ensure farm-gate drop-offs continue without delay.`,
          actionLabel: 'Track Active Shipments',
          actionHref: '/shipments',
        },
      });
    }

    // Rule 4: Seasonal Planning Reminder
    const activePattern = snapshot.seasonalPatterns[0];
    if (activePattern) {
      insights.push({
        id: `ins_season_${activePattern.id}_${snapshot.timeRange}`,
        type: 'seasonal_reminder',
        severity: 'info',
        category: 'planning',
        badgeLabel: 'Farm Insight',
        title: `Seasonal input cycle: ${activePattern.season} window active`,
        summary: activePattern.observation,
        detectedAt: 'Agronomic Calendar',
        supportingMetric: activePattern.peakMonths,
        detail: {
          whatHappened: `Historical purchasing patterns show high concentration in ${activePattern.primaryCategory} during ${activePattern.peakMonths}.`,
          whyDetected: `Aggregated data indicates ${activePattern.season} seasonal operations generate repeatable input demand patterns with ${activePattern.confidenceScore}% historical recurrence.`,
          supportingData: [
            {
              metric: 'Primary Input Category',
              value: activePattern.primaryCategory,
              benchmark: activePattern.season,
            },
            {
              metric: 'Historical Seasonal Outlay',
              value: `₹${activePattern.historicalSpend.toLocaleString('en-IN')}`,
              benchmark: 'Verified Records',
            },
            {
              metric: 'Recurrence Confidence',
              value: `${activePattern.confidenceScore}%`,
              benchmark: 'Deterministic',
            },
          ],
          recommendedConsideration: activePattern.recommendedAction,
          actionLabel: 'Explore Input Catalog',
          actionHref: '/products',
        },
      });
    }

    return insights;
  }
}
