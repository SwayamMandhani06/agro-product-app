// ============================================================
// AGRITRADE DECISION INSIGHT DOMAIN ENTITIES
// Deterministic, explainable agronomic and financial intelligence
// ============================================================

export type InsightType =
  | 'spending_anomaly'
  | 'price_opportunity'
  | 'delivery_performance'
  | 'seasonal_reminder';

export type InsightSeverity = 'info' | 'positive' | 'warning' | 'alert';

export type InsightCategory = 'spending' | 'market' | 'logistics' | 'planning';

export interface InsightSupportingDatum {
  metric: string;
  value: string;
  benchmark?: string;
}

export interface InsightDetail {
  whatHappened: string;
  whyDetected: string;
  supportingData: InsightSupportingDatum[];
  recommendedConsideration: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface DecisionInsight {
  id: string;
  type: InsightType;
  severity: InsightSeverity;
  category: InsightCategory;
  badgeLabel: string;
  title: string;
  summary: string;
  detectedAt: string;
  supportingMetric: string;
  detail: InsightDetail;
}
