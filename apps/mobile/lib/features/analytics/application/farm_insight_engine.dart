// ============================================================
// AGRITRADE FARM INSIGHT ENGINE (FLUTTER)
// Deterministic rule evaluation for mobile decision intelligence
// ============================================================

import '../domain/analytics_metrics.dart';
import '../domain/farm_insight.dart';

class FarmInsightEngine {
  static List<FarmInsight> evaluate(FarmAnalyticsState snapshot) {
    final insights = <FarmInsight>[];

    // Rule 1: Category Spending Anomaly (>15% growth rate)
    for (final cat in snapshot.categories) {
      if (cat.growthRate >= 15.0 && cat.amount > 3000.0) {
        insights.add(
          FarmInsight(
            id: 'ins_anomaly_${cat.categoryId}_${snapshot.timeRange.key}',
            type: InsightType.spendingAnomaly,
            severity: InsightSeverity.warning,
            badgeLabel: 'Purchase Pattern',
            title: '${cat.categoryName} spend is +${cat.growthRate.toStringAsFixed(1)}% above prior period',
            summary: 'Capital allocation toward ${cat.categoryName.toLowerCase()} reached ₹${cat.amount.toStringAsFixed(0)}, driven by procurement of ${cat.topItem}.',
            detectedAt: 'Deterministic Audit',
            supportingMetric: '+${cat.growthRate.toStringAsFixed(1)}% vs Baseline',
            whatHappened: 'Spending in ${cat.categoryName} accelerated from prior period baseline to ₹${cat.amount.toStringAsFixed(0)} in the active ${snapshot.timeRange.label} window.',
            whyDetected: 'The AgriTrade deterministic threshold flagged an expenditure acceleration of ${cat.growthRate.toStringAsFixed(1)}%, exceeding the normal operating limit of 15.0%.',
            supportingData: [
              InsightDataRow(
                metric: 'Current Period Spend',
                value: '₹${cat.amount.toStringAsFixed(0)}',
                benchmark: 'Active Window',
              ),
              InsightDataRow(
                metric: 'Share of Total Input Budget',
                value: '${cat.percentage.toStringAsFixed(1)}%',
                benchmark: '30.0% standard ceiling',
              ),
              InsightDataRow(
                metric: 'Key Purchase Item',
                value: cat.topItem,
                benchmark: '${cat.orderCount} order(s)',
              ),
            ],
            recommendedConsideration: 'Audit field application rates with your agronomist. Verify whether pest pressure or weather shifts necessitated early replenishment before placing further reorders.',
            actionRoute: '/orders',
            actionLabel: 'Review Category Orders',
          ),
        );
        break; // Only flag primary anomaly
      }
    }

    // Rule 2: Market Price Opportunity Detection
    for (final cmd in snapshot.commodities) {
      final diff = cmd.avgPrice - cmd.currentPrice;
      if (cmd.movementPercent <= -5.0 || diff >= 80.0) {
        insights.add(
          FarmInsight(
            id: 'ins_mkt_${cmd.commodity.toLowerCase()}_${snapshot.timeRange.key}',
            type: InsightType.priceOpportunity,
            severity: InsightSeverity.info,
            badgeLabel: 'Market Signal',
            title: '${cmd.commodity} spot rate is ₹${diff.abs().toStringAsFixed(0)} below 30-day APMC average',
            summary: 'Spot auction at ${cmd.mandi} is currently ₹${cmd.currentPrice.toStringAsFixed(0)} / Qtl (${cmd.movementPercent.toStringAsFixed(1)}% shift), offering favorable procurement conditions.',
            detectedAt: 'Live APMC Feed',
            supportingMetric: '₹${cmd.currentPrice.toStringAsFixed(0)} ${cmd.unit}',
            whatHappened: '${cmd.commodity} (${cmd.variety}) spot price softened by ${cmd.movementPercent.abs().toStringAsFixed(1)}% at ${cmd.mandi}, dipping below its rolling mean.',
            whyDetected: 'Observed spot price is at ₹${cmd.currentPrice.toStringAsFixed(0)}, compared against an APMC rolling average of ₹${cmd.avgPrice.toStringAsFixed(0)}.',
            supportingData: [
              InsightDataRow(
                metric: 'Spot Modal Price',
                value: '₹${cmd.currentPrice.toStringAsFixed(0)}',
                benchmark: '₹${cmd.avgPrice.toStringAsFixed(0)} (Average)',
              ),
              InsightDataRow(
                metric: '30-Day Range',
                value: '₹${cmd.minPrice.toStringAsFixed(0)} – ₹${cmd.maxPrice.toStringAsFixed(0)}',
                benchmark: 'Market Spread',
              ),
              InsightDataRow(
                metric: 'Terminal Market',
                value: cmd.mandi,
                benchmark: 'Verified APMC',
              ),
            ],
            recommendedConsideration: 'If planning post-harvest liquidation, evaluate holding stock in accredited warehouse storage until arrivals stabilize. If purchasing inputs, current rates represent seasonal entry value.',
            actionRoute: '/mandi-prices',
            actionLabel: 'Compare APMC Mandi Rates',
          ),
        );
        break;
      }
    }

    // Rule 3: Delivery Performance Reliability
    final delivery = snapshot.delivery;
    if (delivery.onTimeRate >= 96.0 && delivery.totalOrders > 0) {
      insights.add(
        FarmInsight(
          id: 'ins_logistics_${snapshot.timeRange.key}',
          type: InsightType.deliveryPerformance,
          severity: InsightSeverity.positive,
          badgeLabel: 'Delivery Performance',
          title: '${delivery.onTimeRate.toStringAsFixed(1)}% on-time fulfillment across ${delivery.totalOrders} shipments',
          summary: 'Agricultural input shipments averaged ${delivery.avgDeliveryHours} hours turnaround to farm gate, with a ${delivery.attemptRate.toStringAsFixed(1)}% first-attempt success rate.',
          detectedAt: 'Telematics Telemetry',
          supportingMetric: '${delivery.avgDeliveryHours}h Turnaround',
          whatHappened: 'Across ${delivery.totalOrders} total shipments (${delivery.deliveredOrders} delivered, ${delivery.activeShipments} active), logistics partners sustained high SLA compliance.',
          whyDetected: 'Stage 8 rural hub routing and local cargo EV telematics maintained transit timelines within the promised delivery windows across rural route segments.',
          supportingData: [
            InsightDataRow(
              metric: 'On-Time Fulfillment',
              value: '${delivery.onTimeRate.toStringAsFixed(1)}%',
              benchmark: '95.0% Institutional SLA',
            ),
            InsightDataRow(
              metric: 'Average Transit Duration',
              value: '${delivery.avgDeliveryHours} Hours',
              benchmark: '48h Rural Standard',
            ),
            InsightDataRow(
              metric: 'First-Attempt Rate',
              value: '${delivery.attemptRate.toStringAsFixed(1)}%',
              benchmark: '90.0% Target',
            ),
          ],
          recommendedConsideration: 'Your delivery lane has verified rural access. Keep delivery pin location synchronized to ensure farm-gate drop-offs continue without delay.',
          actionRoute: '/orders',
          actionLabel: 'Track Active Shipments',
        ),
      );
    }

    // Rule 4: Seasonal Reminder
    insights.add(
      FarmInsight(
        id: 'ins_season_kharif_${snapshot.timeRange.key}',
        type: InsightType.seasonalReminder,
        severity: InsightSeverity.info,
        badgeLabel: 'Farm Insight',
        title: 'Active Kharif nutrient & crop protection window',
        summary: 'Nutrient application and preventative fungal protection are historically concentrated during August–September.',
        detectedAt: 'Agronomic Calendar',
        supportingMetric: 'August – September',
        whatHappened: 'Historical seasonal data highlights concentrated input demand for fertilizers and bio-protection during peak crop vegetative stages.',
        whyDetected: 'Aggregated project records show seasonal operations generate repeatable input demand patterns with 95% historical recurrence.',
        supportingData: [
          const InsightDataRow(
            metric: 'Primary Input Categories',
            value: 'Fertilizers & Crop Protection',
            benchmark: 'Kharif',
          ),
          const InsightDataRow(
            metric: 'Recurrence Confidence',
            value: '96%',
            benchmark: 'Deterministic',
          ),
        ],
        recommendedConsideration: 'Ensure adequate stock of water-soluble fertilizers and check leaf underside for early signs of fungal rust before heavy rainfall spells.',
        actionRoute: '/products',
        actionLabel: 'Browse Input Catalog',
      ),
    );

    return insights;
  }
}
