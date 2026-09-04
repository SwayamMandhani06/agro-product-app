// ============================================================
// AGRITRADE ANALYTICS CALCULATOR (FLUTTER)
// Deterministic financial calculation formulas
// ============================================================

import 'dart:math' as math;
import '../domain/analytics_metrics.dart';

class AnalyticsCalculator {
  static double calculateTotalSavings(double discount, double delivery, [double bulk = 0.0]) {
    return math.max(0.0, discount + delivery + bulk);
  }

  static double calculateRetailComparison(double totalSpend, [double markup = 16.5]) {
    if (totalSpend <= 0) return 0.0;
    return (totalSpend * (1.0 + markup / 100.0)).roundToDouble();
  }

  static double calculateAverageDiscount(double subtotal, double discount) {
    if (subtotal <= 0) return 0.0;
    final val = (discount / (subtotal + discount)) * 100.0;
    return (val * 10.0).roundToDouble() / 10.0;
  }

  static double calculateDeliverySavings(int deliveredOrderCount, double actualDeliveryFeesPaid) {
    final baseline = deliveredOrderCount * 150.0;
    return math.max(0.0, baseline - actualDeliveryFeesPaid);
  }

  static Map<String, dynamic> calculateSpendingChange(double currentSpend, double previousSpend) {
    if (previousSpend <= 0) {
      return {
        'percentageChange': currentSpend > 0 ? 100.0 : 0.0,
        'trendDirection': currentSpend > 0 ? 'up' : 'flat',
      };
    }

    final change = ((currentSpend - previousSpend) / previousSpend) * 100.0;
    final rounded = (change * 10.0).roundToDouble() / 10.0;

    if (rounded.abs() < 0.5) {
      return {
        'percentageChange': 0.0,
        'trendDirection': 'flat',
      };
    }

    return {
      'percentageChange': rounded.abs(),
      'trendDirection': rounded > 0 ? 'up' : 'down',
    };
  }

  static List<CategorySpend> normalizeCategoryPercentages(List<CategorySpend> categories) {
    final total = categories.fold<double>(0.0, (sum, c) => sum + c.amount);
    if (total <= 0) return categories;

    return categories.map((cat) {
      final pct = (cat.amount / total) * 100.0;
      final rounded = (pct * 10.0).roundToDouble() / 10.0;
      return CategorySpend(
        categoryId: cat.categoryId,
        categoryName: cat.categoryName,
        amount: cat.amount,
        percentage: rounded,
        orderCount: cat.orderCount,
        topItem: cat.topItem,
        growthRate: cat.growthRate,
      );
    }).toList();
  }
}
