// ============================================================
// AGRITRADE DECISION INSIGHT DOMAIN MODELS (FLUTTER)
// Deterministic agronomic & financial intelligence
// ============================================================

enum InsightType {
  spendingAnomaly,
  priceOpportunity,
  deliveryPerformance,
  seasonalReminder,
}

enum InsightSeverity {
  info,
  positive,
  warning,
  alert,
}

class InsightDataRow {
  final String metric;
  final String value;
  final String? benchmark;

  const InsightDataRow({
    required this.metric,
    required this.value,
    this.benchmark,
  });
}

class FarmInsight {
  final String id;
  final InsightType type;
  final InsightSeverity severity;
  final String badgeLabel;
  final String title;
  final String summary;
  final String detectedAt;
  final String supportingMetric;
  final String whatHappened;
  final String whyDetected;
  final List<InsightDataRow> supportingData;
  final String recommendedConsideration;
  final String? actionRoute;
  final String? actionLabel;

  const FarmInsight({
    required this.id,
    required this.type,
    required this.severity,
    required this.badgeLabel,
    required this.title,
    required this.summary,
    required this.detectedAt,
    required this.supportingMetric,
    required this.whatHappened,
    required this.whyDetected,
    required this.supportingData,
    required this.recommendedConsideration,
    this.actionRoute,
    this.actionLabel,
  });
}
