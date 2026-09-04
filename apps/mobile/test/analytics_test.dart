// ============================================================
// AGRITRADE STAGE 9: MOBILE FARM ANALYTICS & INSIGHT TESTS
// Unit and Widget verification for deterministic intelligence
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:agro_product_app/features/analytics/application/analytics_calculator.dart';
import 'package:agro_product_app/features/analytics/application/farm_insight_engine.dart';
import 'package:agro_product_app/features/analytics/domain/analytics_metrics.dart';
import 'package:agro_product_app/features/analytics/domain/farm_insight.dart';
import 'package:agro_product_app/features/analytics/presentation/farm_insights_screen.dart';
import 'package:agro_product_app/features/analytics/presentation/providers/analytics_providers.dart';
import 'package:agro_product_app/features/analytics/presentation/widgets/insight_detail_sheet.dart';

void main() {
  group('Stage 9: AnalyticsCalculator Math Verification', () {
    test('calculates total savings correctly across discounts, delivery, and bulk', () {
      final total = AnalyticsCalculator.calculateTotalSavings(6840.0, 1200.0, 600.0);
      expect(total, 8640.0);
    });

    test('calculates traditional retail estimate with 16.5% offline markup', () {
      final retail = AnalyticsCalculator.calculateRetailComparison(46200.0, 16.5);
      expect(retail, 53823.0);
    });

    test('calculates average realized discount percentage', () {
      final discountPct = AnalyticsCalculator.calculateAverageDiscount(46200.0, 8640.0);
      expect(discountPct, 15.8);
    });

    test('calculates delivery savings vs rural freight standard', () {
      final deliverySavings = AnalyticsCalculator.calculateDeliverySavings(12, 600.0);
      // 12 * 150 = 1800 - 600 = 1200
      expect(deliverySavings, 1200.0);
    });

    test('computes spending change direction and delta percentage', () {
      final up = AnalyticsCalculator.calculateSpendingChange(46200.0, 39800.0);
      expect(up['trendDirection'], 'up');
      expect(up['percentageChange'], 16.1);

      final down = AnalyticsCalculator.calculateSpendingChange(12000.0, 15000.0);
      expect(down['trendDirection'], 'down');
      expect(down['percentageChange'], 20.0);

      final flat = AnalyticsCalculator.calculateSpendingChange(10000.0, 10020.0);
      expect(flat['trendDirection'], 'flat');
      expect(flat['percentageChange'], 0.0);
    });

    test('normalizes category allocation shares to 100%', () {
      const cats = [
        CategorySpend(
          categoryId: 'c1',
          categoryName: 'Fertilizers',
          amount: 5000.0,
          percentage: 0.0,
          orderCount: 2,
          topItem: 'NPK',
          growthRate: 25.0,
        ),
        CategorySpend(
          categoryId: 'c2',
          categoryName: 'Seeds',
          amount: 3000.0,
          percentage: 0.0,
          orderCount: 1,
          topItem: 'Soybean',
          growthRate: 0.0,
        ),
        CategorySpend(
          categoryId: 'c3',
          categoryName: 'Crop Protection',
          amount: 2000.0,
          percentage: 0.0,
          orderCount: 1,
          topItem: 'Coragen',
          growthRate: 33.0,
        ),
      ];

      final normalized = AnalyticsCalculator.normalizeCategoryPercentages(cats);
      expect(normalized[0].percentage, 50.0);
      expect(normalized[1].percentage, 30.0);
      expect(normalized[2].percentage, 20.0);
      final sum = normalized.fold<double>(0.0, (acc, c) => acc + c.percentage);
      expect(sum, 100.0);
    });
  });

  group('Stage 9: FarmInsightEngine Deterministic Evaluation', () {
    test('generates transparent, explainable decision insights from snapshot', () {
      final notifier = FarmAnalyticsNotifier();
      final snapshot = notifier.state;
      final insights = FarmInsightEngine.evaluate(snapshot);

      expect(insights.isNotEmpty, isTrue);

      // Verify spending anomaly rule
      final anomaly = insights.where((i) => i.type == InsightType.spendingAnomaly);
      expect(anomaly.isNotEmpty, isTrue);
      expect(anomaly.first.badgeLabel, 'Purchase Pattern');

      // Verify market opportunity rule
      final marketSignal = insights.where((i) => i.type == InsightType.priceOpportunity);
      expect(marketSignal.isNotEmpty, isTrue);
      expect(marketSignal.first.badgeLabel, 'Market Signal');

      // Verify delivery SLA rule
      final deliverySignal = insights.where((i) => i.type == InsightType.deliveryPerformance);
      expect(deliverySignal.isNotEmpty, isTrue);
      expect(deliverySignal.first.badgeLabel, 'Delivery Performance');

      // Verify transparency fields are populated on all insights
      for (final ins in insights) {
        expect(ins.whatHappened.length, greaterThan(15));
        expect(ins.whyDetected.length, greaterThan(15));
        expect(ins.supportingData.isNotEmpty, isTrue);
        expect(ins.recommendedConsideration.length, greaterThan(15));
      }
    });

    test('updates snapshot metrics dynamically when time range changes', () {
      final notifier = FarmAnalyticsNotifier();
      expect(notifier.state.timeRange, TimeRangeEnum.thirtyDays);

      notifier.setTimeRange(TimeRangeEnum.sevenDays);
      expect(notifier.state.timeRange, TimeRangeEnum.sevenDays);
      expect(notifier.state.spending.totalSpend, 14850.0);

      notifier.setTimeRange(TimeRangeEnum.threeMonths);
      expect(notifier.state.timeRange, TimeRangeEnum.threeMonths);
      expect(notifier.state.spending.totalSpend, 124300.0);

      notifier.setTimeRange(TimeRangeEnum.oneYear);
      expect(notifier.state.timeRange, TimeRangeEnum.oneYear);
      expect(notifier.state.spending.totalSpend, 342500.0);
    });
  });

  group('Stage 9: Mobile UI Widget Tests', () {
    testWidgets('renders FarmInsightsScreen with header, spend card, and categories', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: FarmInsightsScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Farm Insights'), findsOneWidget);
      expect(find.text('TOTAL AGRICULTURAL OUTLAY'), findsOneWidget);
      expect(find.text('INPUT CATEGORY ALLOCATION'), findsOneWidget);
      expect(find.text('FARMER SAVINGS INTELLIGENCE'), findsOneWidget);
      expect(find.text('LOGISTICS SLA & TURNAROUND'), findsOneWidget);
      expect(find.text('APMC COMMODITY BENCHMARKS'), findsOneWidget);
    });

    testWidgets('renders InsightDetailSheet with complete diagnostic transparency', (tester) async {
      const testInsight = FarmInsight(
        id: 'ins_test_1',
        type: InsightType.spendingAnomaly,
        severity: InsightSeverity.warning,
        badgeLabel: 'Purchase Pattern',
        title: 'Crop Protection spend is +43.8% above prior period',
        summary: 'Pesticide procurement increased significantly.',
        detectedAt: 'Deterministic Audit',
        supportingMetric: '+43.8% vs Baseline',
        whatHappened: 'Pesticide purchases increased following rain showers.',
        whyDetected: 'Deterministic threshold flagged 43.8% growth vs standard 15% limit.',
        supportingData: [
          InsightDataRow(metric: 'Current Spend', value: '₹12,800', benchmark: '₹8,900'),
          InsightDataRow(metric: 'Budget Share', value: '27.7%', benchmark: '30% max'),
        ],
        recommendedConsideration: 'Audit field application rates with agronomist before reordering.',
      );

      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: InsightDetailSheet(insight: testInsight),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('PURCHASE PATTERN'), findsOneWidget);
      expect(find.text('Crop Protection spend is +43.8% above prior period'), findsOneWidget);
      expect(find.text('WHAT HAPPENED'), findsOneWidget);
      expect(find.text('WHY DETECTED (DETERMINISTIC AUDIT)'), findsOneWidget);
      expect(find.text('SUPPORTING VERIFICATION DATA'), findsOneWidget);
      expect(find.text('RECOMMENDED ACTION / CONSIDERATION'), findsOneWidget);
      expect(find.text('Acknowledge Insight'), findsOneWidget);
    });
  });
}
