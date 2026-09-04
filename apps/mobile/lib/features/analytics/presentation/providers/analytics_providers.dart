// ============================================================
// AGRITRADE FARM ANALYTICS PROVIDERS (FLUTTER)
// Riverpod state management for mobile farm insights & metrics
// ============================================================

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../application/analytics_calculator.dart';
import '../../application/farm_insight_engine.dart';
import '../../domain/analytics_metrics.dart';
import '../../domain/farm_insight.dart';

final timeRangeProvider = StateProvider<TimeRangeEnum>((ref) {
  return TimeRangeEnum.thirtyDays;
});

final selectedInsightProvider = StateProvider<FarmInsight?>((ref) {
  return null;
});

class FarmAnalyticsNotifier extends StateNotifier<FarmAnalyticsState> {
  FarmAnalyticsNotifier() : super(_buildSnapshot(TimeRangeEnum.thirtyDays));

  void setTimeRange(TimeRangeEnum range) {
    state = _buildSnapshot(range);
  }

  static FarmAnalyticsState _buildSnapshot(TimeRangeEnum range) {
    final commodities = [
      const CommodityTrend(
        commodity: 'Soybean',
        variety: 'Yellow Standard',
        mandi: 'Indore APMC',
        currentPrice: 4320.0,
        avgPrice: 4250.0,
        minPrice: 4120.0,
        maxPrice: 4450.0,
        movementPercent: 1.65,
        unit: '₹ / Qtl',
      ),
      const CommodityTrend(
        commodity: 'Wheat',
        variety: 'Sharbati A',
        mandi: 'Sehore APMC',
        currentPrice: 2480.0,
        avgPrice: 2510.0,
        minPrice: 2380.0,
        maxPrice: 2590.0,
        movementPercent: -1.19,
        unit: '₹ / Qtl',
      ),
      const CommodityTrend(
        commodity: 'Onion',
        variety: 'Nashik Red',
        mandi: 'Lasalgaon APMC',
        currentPrice: 1850.0,
        avgPrice: 1720.0,
        minPrice: 1540.0,
        maxPrice: 1980.0,
        movementPercent: 7.56,
        unit: '₹ / Qtl',
      ),
      const CommodityTrend(
        commodity: 'Tomato',
        variety: 'Hybrid Table',
        mandi: 'Narayangaon APMC',
        currentPrice: 1420.0,
        avgPrice: 1580.0,
        minPrice: 1350.0,
        maxPrice: 1850.0,
        movementPercent: -10.13,
        unit: '₹ / Qtl',
      ),
      const CommodityTrend(
        commodity: 'Cotton',
        variety: 'Shankar-6',
        mandi: 'Rajkot APMC',
        currentPrice: 7150.0,
        avgPrice: 7080.0,
        minPrice: 6920.0,
        maxPrice: 7300.0,
        movementPercent: 1.13,
        unit: '₹ / Qtl',
      ),
      const CommodityTrend(
        commodity: 'Maize',
        variety: 'Yellow Feed',
        mandi: 'Davangere APMC',
        currentPrice: 2180.0,
        avgPrice: 2150.0,
        minPrice: 2050.0,
        maxPrice: 2240.0,
        movementPercent: 1.4,
        unit: '₹ / Qtl',
      ),
    ];

    switch (range) {
      case TimeRangeEnum.sevenDays:
        final rawCategories = [
          const CategorySpend(
            categoryId: 'cat_protection',
            categoryName: 'Crop Protection',
            amount: 5600.0,
            percentage: 37.7,
            orderCount: 1,
            topItem: 'Coragen Bio-Pesticide (150ml)',
            growthRate: 47.4,
          ),
          const CategorySpend(
            categoryId: 'cat_fertilizers',
            categoryName: 'Fertilizers',
            amount: 4850.0,
            percentage: 32.7,
            orderCount: 1,
            topItem: 'IFFCO NPK 10:26:26 (50kg)',
            growthRate: -1.0,
          ),
          const CategorySpend(
            categoryId: 'cat_irrigation',
            categoryName: 'Irrigation',
            amount: 3200.0,
            percentage: 21.5,
            orderCount: 1,
            topItem: 'Jain Drip Inline Lateral (100m)',
            growthRate: 45.5,
          ),
          const CategorySpend(
            categoryId: 'cat_seeds',
            categoryName: 'Seeds',
            amount: 1200.0,
            percentage: 8.1,
            orderCount: 1,
            topItem: 'Mahyco Hybrid Cotton (450g)',
            growthRate: -40.0,
          ),
          const CategorySpend(
            categoryId: 'cat_tools',
            categoryName: 'Farm Tools',
            amount: 0.0,
            percentage: 0.0,
            orderCount: 0,
            topItem: 'None',
            growthRate: 0.0,
          ),
          const CategorySpend(
            categoryId: 'cat_animal',
            categoryName: 'Animal Care',
            amount: 0.0,
            percentage: 0.0,
            orderCount: 0,
            topItem: 'None',
            growthRate: 0.0,
          ),
        ];

        return FarmAnalyticsState(
          timeRange: range,
          lastUpdated: 'Today, 03:45 PM',
          spending: const SpendingSummary(
            totalSpend: 14850.0,
            previousPeriodSpend: 12900.0,
            percentageChange: 15.1,
            trendDirection: 'up',
            orderCount: 4,
            avgOrderValue: 3712.5,
          ),
          spendingTrend: const [
            SpendingTrendDataPoint(date: '2026-08-29', label: 'Sat', amount: 1200.0, orderCount: 1),
            SpendingTrendDataPoint(date: '2026-08-30', label: 'Sun', amount: 0.0, orderCount: 0),
            SpendingTrendDataPoint(date: '2026-08-31', label: 'Mon', amount: 4850.0, orderCount: 1),
            SpendingTrendDataPoint(date: '2026-09-01', label: 'Tue', amount: 0.0, orderCount: 0),
            SpendingTrendDataPoint(date: '2026-09-02', label: 'Wed', amount: 3200.0, orderCount: 1),
            SpendingTrendDataPoint(date: '2026-09-03', label: 'Thu', amount: 5600.0, orderCount: 1),
            SpendingTrendDataPoint(date: '2026-09-04', label: 'Fri', amount: 0.0, orderCount: 0),
          ],
          categories: AnalyticsCalculator.normalizeCategoryPercentages(rawCategories),
          savings: const SavingsMetric(
            totalSavings: 2850.0,
            productDiscounts: 2150.0,
            deliverySavings: 500.0,
            bulkSavings: 200.0,
            avgDiscountPercent: 16.1,
            offlineRetailEstimate: 17300.0,
            categorySavings: {
              'Crop Protection': 1120.0,
              'Fertilizers': 980.0,
              'Irrigation': 550.0,
              'Seeds': 200.0,
            },
          ),
          delivery: const DeliveryAnalytics(
            totalOrders: 4,
            deliveredOrders: 3,
            activeShipments: 1,
            delayedDeliveries: 0,
            attemptRate: 100.0,
            avgDeliveryHours: 38,
            onTimeRate: 100.0,
          ),
          commodities: commodities,
        );

      case TimeRangeEnum.thirtyDays:
        final rawCategories = [
          const CategorySpend(
            categoryId: 'cat_fert',
            categoryName: 'Fertilizers',
            amount: 17200.0,
            percentage: 37.2,
            orderCount: 4,
            topItem: 'IFFCO NPK 10:26:26 (50kg)',
            growthRate: 18.6,
          ),
          const CategorySpend(
            categoryId: 'cat_prot',
            categoryName: 'Crop Protection',
            amount: 12800.0,
            percentage: 27.7,
            orderCount: 3,
            topItem: 'Coragen Bio-Pesticide (150ml)',
            growthRate: 43.8,
          ),
          const CategorySpend(
            categoryId: 'cat_seeds',
            categoryName: 'Seeds',
            amount: 7400.0,
            percentage: 16.0,
            orderCount: 2,
            topItem: 'JK Seeds Hybrid Soybean JS-335',
            growthRate: -19.5,
          ),
          const CategorySpend(
            categoryId: 'cat_irrig',
            categoryName: 'Irrigation',
            amount: 5200.0,
            percentage: 11.3,
            orderCount: 2,
            topItem: 'Venturi Fertilizer Injector Kit',
            growthRate: 26.8,
          ),
          const CategorySpend(
            categoryId: 'cat_tools',
            categoryName: 'Farm Tools',
            amount: 2200.0,
            percentage: 4.8,
            orderCount: 1,
            topItem: 'Battery Sprayer 16L',
            growthRate: 22.2,
          ),
          const CategorySpend(
            categoryId: 'cat_care',
            categoryName: 'Animal Care',
            amount: 1400.0,
            percentage: 3.0,
            orderCount: 1,
            topItem: 'Agrimin Super Mineral Mixture',
            growthRate: 7.7,
          ),
        ];

        return FarmAnalyticsState(
          timeRange: range,
          lastUpdated: 'Today, 03:45 PM',
          spending: const SpendingSummary(
            totalSpend: 46200.0,
            previousPeriodSpend: 39800.0,
            percentageChange: 16.1,
            trendDirection: 'up',
            orderCount: 12,
            avgOrderValue: 3850.0,
          ),
          spendingTrend: const [
            SpendingTrendDataPoint(date: '2026-08-08', label: '08 Aug', amount: 6200.0, orderCount: 2),
            SpendingTrendDataPoint(date: '2026-08-13', label: '13 Aug', amount: 8400.0, orderCount: 2),
            SpendingTrendDataPoint(date: '2026-08-18', label: '18 Aug', amount: 5100.0, orderCount: 1),
            SpendingTrendDataPoint(date: '2026-08-23', label: '23 Aug', amount: 11650.0, orderCount: 3),
            SpendingTrendDataPoint(date: '2026-08-28', label: '28 Aug', amount: 7200.0, orderCount: 2),
            SpendingTrendDataPoint(date: '2026-09-02', label: '02 Sep', amount: 7650.0, orderCount: 2),
          ],
          categories: AnalyticsCalculator.normalizeCategoryPercentages(rawCategories),
          savings: const SavingsMetric(
            totalSavings: 8640.0,
            productDiscounts: 6840.0,
            deliverySavings: 1200.0,
            bulkSavings: 600.0,
            avgDiscountPercent: 15.7,
            offlineRetailEstimate: 53820.0,
            categorySavings: {
              'Fertilizers': 3450.0,
              'Crop Protection': 2680.0,
              'Seeds': 1350.0,
              'Irrigation': 760.0,
              'Farm Tools': 400.0,
            },
          ),
          delivery: const DeliveryAnalytics(
            totalOrders: 12,
            deliveredOrders: 11,
            activeShipments: 1,
            delayedDeliveries: 0,
            attemptRate: 98.2,
            avgDeliveryHours: 41,
            onTimeRate: 100.0,
          ),
          commodities: commodities,
        );

      case TimeRangeEnum.threeMonths:
        final rawCategories = [
          const CategorySpend(
            categoryId: 'cat_seeds',
            categoryName: 'Seeds',
            amount: 46200.0,
            percentage: 37.2,
            orderCount: 10,
            topItem: 'JK Seeds Hybrid Soybean JS-335',
            growthRate: 21.6,
          ),
          const CategorySpend(
            categoryId: 'cat_fert',
            categoryName: 'Fertilizers',
            amount: 39500.0,
            percentage: 31.8,
            orderCount: 9,
            topItem: 'IFFCO NPK 10:26:26 (50kg)',
            growthRate: 12.9,
          ),
          const CategorySpend(
            categoryId: 'cat_prot',
            categoryName: 'Crop Protection',
            amount: 21400.0,
            percentage: 17.2,
            orderCount: 6,
            topItem: 'Coragen Bio-Pesticide (150ml)',
            growthRate: 15.7,
          ),
          const CategorySpend(
            categoryId: 'cat_irrig',
            categoryName: 'Irrigation',
            amount: 10200.0,
            percentage: 8.2,
            orderCount: 3,
            topItem: 'Inline Lateral Drip Pipe (500m)',
            growthRate: 4.1,
          ),
          const CategorySpend(
            categoryId: 'cat_tools',
            categoryName: 'Farm Tools',
            amount: 4500.0,
            percentage: 3.6,
            orderCount: 2,
            topItem: 'High-Pressure Hose Spray Gun',
            growthRate: -13.5,
          ),
          const CategorySpend(
            categoryId: 'cat_care',
            categoryName: 'Animal Care',
            amount: 2500.0,
            percentage: 2.0,
            orderCount: 1,
            topItem: 'Cattle Calcium Supplement Gel',
            growthRate: -16.7,
          ),
        ];

        return FarmAnalyticsState(
          timeRange: range,
          lastUpdated: 'Today, 03:45 PM',
          spending: const SpendingSummary(
            totalSpend: 124300.0,
            previousPeriodSpend: 109500.0,
            percentageChange: 13.5,
            trendDirection: 'up',
            orderCount: 31,
            avgOrderValue: 4009.6,
          ),
          spendingTrend: const [
            SpendingTrendDataPoint(date: '2026-06-15', label: 'Mid Jun', amount: 38400.0, orderCount: 9),
            SpendingTrendDataPoint(date: '2026-07-05', label: 'Early Jul', amount: 24200.0, orderCount: 6),
            SpendingTrendDataPoint(date: '2026-07-25', label: 'Late Jul', amount: 21500.0, orderCount: 5),
            SpendingTrendDataPoint(date: '2026-08-15', label: 'Mid Aug', amount: 22800.0, orderCount: 6),
            SpendingTrendDataPoint(date: '2026-09-04', label: 'Early Sep', amount: 17400.0, orderCount: 5),
          ],
          categories: AnalyticsCalculator.normalizeCategoryPercentages(rawCategories),
          savings: const SavingsMetric(
            totalSavings: 23600.0,
            productDiscounts: 18900.0,
            deliverySavings: 3200.0,
            bulkSavings: 1500.0,
            avgDiscountPercent: 16.0,
            offlineRetailEstimate: 144800.0,
            categorySavings: {
              'Seeds': 9200.0,
              'Fertilizers': 7800.0,
              'Crop Protection': 4100.0,
              'Irrigation': 1700.0,
            },
          ),
          delivery: const DeliveryAnalytics(
            totalOrders: 31,
            deliveredOrders: 30,
            activeShipments: 1,
            delayedDeliveries: 1,
            attemptRate: 97.4,
            avgDeliveryHours: 43,
            onTimeRate: 96.8,
          ),
          commodities: commodities,
        );

      case TimeRangeEnum.sixMonths:
      case TimeRangeEnum.oneYear:
        final rawCategories = [
          const CategorySpend(
            categoryId: 'cat_fert',
            categoryName: 'Fertilizers',
            amount: 112000.0,
            percentage: 32.7,
            orderCount: 28,
            topItem: 'IFFCO NPK 10:26:26 (50kg)',
            growthRate: 7.7,
          ),
          const CategorySpend(
            categoryId: 'cat_seeds',
            categoryName: 'Seeds',
            amount: 106000.0,
            percentage: 30.9,
            orderCount: 24,
            topItem: 'JK Seeds Hybrid Soybean JS-335',
            growthRate: 8.2,
          ),
          const CategorySpend(
            categoryId: 'cat_prot',
            categoryName: 'Crop Protection',
            amount: 58000.0,
            percentage: 16.9,
            orderCount: 16,
            topItem: 'Coragen Bio-Pesticide (150ml)',
            growthRate: 7.4,
          ),
          const CategorySpend(
            categoryId: 'cat_irrig',
            categoryName: 'Irrigation',
            amount: 36500.0,
            percentage: 10.7,
            orderCount: 8,
            topItem: 'Drip Filtration Disk Unit',
            growthRate: 7.4,
          ),
          const CategorySpend(
            categoryId: 'cat_tools',
            categoryName: 'Farm Tools',
            amount: 18000.0,
            percentage: 5.3,
            orderCount: 5,
            topItem: 'Battery Sprayer 16L',
            growthRate: 5.9,
          ),
          const CategorySpend(
            categoryId: 'cat_care',
            categoryName: 'Animal Care',
            amount: 12000.0,
            percentage: 3.5,
            orderCount: 3,
            topItem: 'Agrimin Super Mineral Mixture',
            growthRate: 9.1,
          ),
        ];

        return FarmAnalyticsState(
          timeRange: range,
          lastUpdated: 'Today, 03:45 PM',
          spending: const SpendingSummary(
            totalSpend: 342500.0,
            previousPeriodSpend: 318000.0,
            percentageChange: 7.7,
            trendDirection: 'up',
            orderCount: 84,
            avgOrderValue: 4077.4,
          ),
          spendingTrend: const [
            SpendingTrendDataPoint(date: '2025-10-31', label: 'Q4 25', amount: 82000.0, orderCount: 20),
            SpendingTrendDataPoint(date: '2026-01-31', label: 'Q1 26', amount: 64500.0, orderCount: 16),
            SpendingTrendDataPoint(date: '2026-04-30', label: 'Q2 26', amount: 88000.0, orderCount: 22),
            SpendingTrendDataPoint(date: '2026-07-31', label: 'Q3 26', amount: 108000.0, orderCount: 26),
          ],
          categories: AnalyticsCalculator.normalizeCategoryPercentages(rawCategories),
          savings: const SavingsMetric(
            totalSavings: 64800.0,
            productDiscounts: 52400.0,
            deliverySavings: 8400.0,
            bulkSavings: 4000.0,
            avgDiscountPercent: 15.9,
            offlineRetailEstimate: 399000.0,
            categorySavings: {
              'Fertilizers': 22400.0,
              'Seeds': 21100.0,
              'Crop Protection': 11400.0,
            },
          ),
          delivery: const DeliveryAnalytics(
            totalOrders: 84,
            deliveredOrders: 83,
            activeShipments: 1,
            delayedDeliveries: 2,
            attemptRate: 98.8,
            avgDeliveryHours: 40,
            onTimeRate: 97.6,
          ),
          commodities: commodities,
        );
    }
  }
}

final farmAnalyticsProvider =
    StateNotifierProvider<FarmAnalyticsNotifier, FarmAnalyticsState>((ref) {
  final notifier = FarmAnalyticsNotifier();
  ref.listen<TimeRangeEnum>(timeRangeProvider, (_, nextRange) {
    notifier.setTimeRange(nextRange);
  });
  return notifier;
});

final decisionInsightsProvider = Provider<List<FarmInsight>>((ref) {
  final snapshot = ref.watch(farmAnalyticsProvider);
  return FarmInsightEngine.evaluate(snapshot);
});
