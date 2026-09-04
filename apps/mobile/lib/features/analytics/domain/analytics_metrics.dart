// ============================================================
// AGRITRADE FARM ANALYTICS DOMAIN MODELS (FLUTTER)
// Platform-neutral metrics aligned with Next.js web domain
// ============================================================

enum TimeRangeEnum {
  sevenDays('7d', '7 Days'),
  thirtyDays('30d', '30 Days'),
  threeMonths('3m', '3 Months'),
  sixMonths('6m', '6 Months'),
  oneYear('1y', '1 Year');

  const TimeRangeEnum(this.key, this.label);
  final String key;
  final String label;

  static TimeRangeEnum fromKey(String key) {
    return TimeRangeEnum.values.firstWhere(
      (e) => e.key == key,
      orElse: () => TimeRangeEnum.thirtyDays,
    );
  }
}

class SpendingSummary {
  final double totalSpend;
  final double previousPeriodSpend;
  final double percentageChange;
  final String trendDirection; // 'up' | 'down' | 'flat'
  final int orderCount;
  final double avgOrderValue;

  const SpendingSummary({
    required this.totalSpend,
    required this.previousPeriodSpend,
    required this.percentageChange,
    required this.trendDirection,
    required this.orderCount,
    required this.avgOrderValue,
  });
}

class SpendingTrendDataPoint {
  final String date;
  final String label;
  final double amount;
  final int orderCount;

  const SpendingTrendDataPoint({
    required this.date,
    required this.label,
    required this.amount,
    required this.orderCount,
  });
}

class CategorySpend {
  final String categoryId;
  final String categoryName;
  final double amount;
  final double percentage;
  final int orderCount;
  final String topItem;
  final double growthRate;

  const CategorySpend({
    required this.categoryId,
    required this.categoryName,
    required this.amount,
    required this.percentage,
    required this.orderCount,
    required this.topItem,
    required this.growthRate,
  });
}

class SavingsMetric {
  final double totalSavings;
  final double productDiscounts;
  final double deliverySavings;
  final double bulkSavings;
  final double avgDiscountPercent;
  final double offlineRetailEstimate;
  final Map<String, double> categorySavings;

  const SavingsMetric({
    required this.totalSavings,
    required this.productDiscounts,
    required this.deliverySavings,
    required this.bulkSavings,
    required this.avgDiscountPercent,
    required this.offlineRetailEstimate,
    required this.categorySavings,
  });
}

class DeliveryAnalytics {
  final int totalOrders;
  final int deliveredOrders;
  final int activeShipments;
  final int delayedDeliveries;
  final double attemptRate;
  final int avgDeliveryHours;
  final double onTimeRate;

  const DeliveryAnalytics({
    required this.totalOrders,
    required this.deliveredOrders,
    required this.activeShipments,
    required this.delayedDeliveries,
    required this.attemptRate,
    required this.avgDeliveryHours,
    required this.onTimeRate,
  });
}

class CommodityTrend {
  final String commodity;
  final String variety;
  final String mandi;
  final double currentPrice;
  final double avgPrice;
  final double minPrice;
  final double maxPrice;
  final double movementPercent;
  final String unit;

  const CommodityTrend({
    required this.commodity,
    required this.variety,
    required this.mandi,
    required this.currentPrice,
    required this.avgPrice,
    required this.minPrice,
    required this.maxPrice,
    required this.movementPercent,
    required this.unit,
  });
}

class FarmAnalyticsState {
  final TimeRangeEnum timeRange;
  final String lastUpdated;
  final SpendingSummary spending;
  final List<SpendingTrendDataPoint> spendingTrend;
  final List<CategorySpend> categories;
  final SavingsMetric savings;
  final DeliveryAnalytics delivery;
  final List<CommodityTrend> commodities;

  const FarmAnalyticsState({
    required this.timeRange,
    required this.lastUpdated,
    required this.spending,
    required this.spendingTrend,
    required this.categories,
    required this.savings,
    required this.delivery,
    required this.commodities,
  });
}
