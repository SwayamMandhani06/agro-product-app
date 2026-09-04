// ============================================================
// AGRITRADE FARM INSIGHTS SCREEN (FLUTTER)
// Mobile-first decision intelligence, spending analytics & APMC signals
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_radius.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/routing/routes.dart';
import '../domain/analytics_metrics.dart';
import '../domain/farm_insight.dart';
import 'providers/analytics_providers.dart';
import 'widgets/insight_detail_sheet.dart';
import 'widgets/spending_chart_widget.dart';

class FarmInsightsScreen extends ConsumerWidget {
  const FarmInsightsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeRange = ref.watch(timeRangeProvider);
    final analytics = ref.watch(farmAnalyticsProvider);
    final insights = ref.watch(decisionInsightsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Farm Insights',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              'Decision Intelligence & Farm Spend',
              style: TextStyle(fontSize: 11, color: AppColors.textTertiary),
            ),
          ],
        ),
        backgroundColor: AppColors.surface,
        elevation: 0,
        scrolledUnderElevation: 1,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, size: 20),
            tooltip: 'Refresh Analytics',
            onPressed: () {
              ref.invalidate(farmAnalyticsProvider);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding, vertical: AppSpacing.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Time Range Selector
            _buildTimeRangeSelector(context, ref, activeRange),

            const SizedBox(height: AppSpacing.base),

            // 2. Spending Summary & Financial Trend Chart
            _buildSpendingSummaryCard(context, analytics),

            const SizedBox(height: AppSpacing.base),

            // 3. Category Spending Breakdown
            _buildCategoryBreakdownCard(context, analytics),

            const SizedBox(height: AppSpacing.base),

            // 4. Deterministic Farm Decision Insights
            _buildDecisionInsightsSection(context, insights),

            const SizedBox(height: AppSpacing.base),

            // 5. Savings Intelligence Card
            _buildSavingsCard(context, analytics),

            const SizedBox(height: AppSpacing.base),

            // 6. Delivery & Operational Performance
            _buildDeliveryPerformanceCard(context, analytics.delivery),

            const SizedBox(height: AppSpacing.base),

            // 7. Commodity Market Signals
            _buildMarketSignalsSection(context, analytics.commodities),

            const SizedBox(height: AppSpacing.lg),
          ],
        ),
      ),
    );
  }

  // Segmented Time Range Selector
  Widget _buildTimeRangeSelector(BuildContext context, WidgetRef ref, TimeRangeEnum activeRange) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: TimeRangeEnum.values.map((range) {
          final isSelected = range == activeRange;
          return Padding(
            padding: const EdgeInsets.only(right: 6),
            child: ChoiceChip(
              label: Text(range.label),
              selected: isSelected,
              selectedColor: AppColors.stitchForestGreen,
              labelStyle: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? Colors.white : AppColors.textSecondary,
              ),
              backgroundColor: AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.sm),
                side: BorderSide(
                  color: isSelected ? AppColors.stitchForestGreen : AppColors.border,
                ),
              ),
              showCheckmark: false,
              onSelected: (_) {
                ref.read(timeRangeProvider.notifier).state = range;
              },
            ),
          );
        }).toList(),
      ),
    );
  }

  // Primary Spending Summary Card with Sparkline
  Widget _buildSpendingSummaryCard(BuildContext context, FarmAnalyticsState state) {
    final spending = state.spending;
    final isUp = spending.trendDirection == 'up';

    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'TOTAL AGRICULTURAL OUTLAY',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                  color: AppColors.textSecondary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: isUp ? const Color(0xFFFEF3C7) : const Color(0xFFD1FAE5),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  '${isUp ? "↑" : "↓"} ${spending.percentageChange.toStringAsFixed(1)}%',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: isUp ? const Color(0xFF92400E) : const Color(0xFF065F46),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            '₹${spending.totalSpend.toStringAsFixed(0)}',
            style: const TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w800,
              color: AppColors.textPrimary,
            ),
          ),
          Text(
            'Across ${spending.orderCount} orders · Avg ₹${spending.avgOrderValue.toStringAsFixed(0)} / order',
            style: const TextStyle(fontSize: 12, color: AppColors.textTertiary),
          ),
          const SizedBox(height: AppSpacing.sm),
          SpendingChartWidget(dataPoints: state.spendingTrend, height: 130),
        ],
      ),
    );
  }

  // Category Spending Breakdown Horizontal Bars
  Widget _buildCategoryBreakdownCard(BuildContext context, FarmAnalyticsState state) {
    final maxAmount = state.categories.map((c) => c.amount).fold<double>(1.0, (a, b) => a > b ? a : b);

    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'INPUT CATEGORY ALLOCATION',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          ...state.categories.map((cat) {
            final barWidth = (cat.amount / maxAmount).clamp(0.02, 1.0);

            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        cat.categoryName,
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                      ),
                      Text(
                        '₹${cat.amount.toStringAsFixed(0)} (${cat.percentage.toStringAsFixed(1)}%)',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(2),
                    child: LinearProgressIndicator(
                      value: barWidth,
                      minHeight: 6,
                      backgroundColor: AppColors.surfaceVariant,
                      valueColor: const AlwaysStoppedAnimation<Color>(AppColors.stitchForestGreen),
                    ),
                  ),
                  if (cat.amount > 0)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(
                        'Top: ${cat.topItem}',
                        style: const TextStyle(fontSize: 10, color: AppColors.textTertiary),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  // Decision Insights List (Click to open InsightDetailSheet)
  Widget _buildDecisionInsightsSection(BuildContext context, List<FarmInsight> insights) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'DECISION INTELLIGENCE SIGNALS',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.5,
                color: AppColors.textSecondary,
              ),
            ),
            Text(
              '${insights.length} Signals',
              style: const TextStyle(fontSize: 11, color: AppColors.textTertiary),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        ...insights.map((ins) {
          Color badgeBg;
          Color badgeText;
          switch (ins.severity) {
            case InsightSeverity.warning:
              badgeBg = const Color(0xFFFEF3C7);
              badgeText = const Color(0xFF92400E);
              break;
            case InsightSeverity.positive:
              badgeBg = const Color(0xFFD1FAE5);
              badgeText = const Color(0xFF065F46);
              break;
            case InsightSeverity.alert:
              badgeBg = const Color(0xFFFEE2E2);
              badgeText = const Color(0xFF991B1B);
              break;
            case InsightSeverity.info:
              badgeBg = const Color(0xFFF3F4F6);
              badgeText = const Color(0xFF374151);
              break;
          }

          return InkWell(
            onTap: () => InsightDetailSheet.show(context, ins),
            borderRadius: BorderRadius.circular(AppRadius.md),
            child: Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(AppSpacing.base),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(AppRadius.md),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: badgeBg,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          ins.badgeLabel.toUpperCase(),
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.4,
                            color: badgeText,
                          ),
                        ),
                      ),
                      Text(
                        ins.detectedAt,
                        style: const TextStyle(fontSize: 10, color: AppColors.textTertiary),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    ins.title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    ins.summary,
                    style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        ins.supportingMetric,
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.stitchForestGreen),
                      ),
                      const Row(
                        children: [
                          Text(
                            'Inspect Diagnosis',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.stitchForestGreen),
                          ),
                          Icon(Icons.arrow_forward_ios_rounded, size: 10, color: AppColors.stitchForestGreen),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  // Savings Summary Card
  Widget _buildSavingsCard(BuildContext context, FarmAnalyticsState state) {
    final savings = state.savings;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'FARMER SAVINGS INTELLIGENCE',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Total Direct Savings', style: TextStyle(fontSize: 11, color: AppColors.textTertiary)),
                    Text(
                      '₹${savings.totalSavings.toStringAsFixed(0)}',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF065F46)),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Traditional Retail Est.', style: TextStyle(fontSize: 11, color: AppColors.textTertiary)),
                    Text(
                      '₹${savings.offlineRetailEstimate.toStringAsFixed(0)}',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const Divider(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Direct Catalog Discounts', style: TextStyle(fontSize: 12)),
              Text('₹${savings.productDiscounts.toStringAsFixed(0)}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Rural Freight Subsidies', style: TextStyle(fontSize: 12)),
              Text('₹${savings.deliverySavings.toStringAsFixed(0)}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }

  // Delivery Operations Card
  Widget _buildDeliveryPerformanceCard(BuildContext context, DeliveryAnalytics delivery) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'LOGISTICS SLA & TURNAROUND',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                  color: AppColors.textSecondary,
                ),
              ),
              InkWell(
                onTap: () => context.push(AppRoutes.orders),
                child: const Text(
                  'Orders →',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.stitchForestGreen),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildMetricTile('On-Time Delivery', '${delivery.onTimeRate.toStringAsFixed(1)}%', AppColors.stitchForestGreen),
              _buildMetricTile('Avg Duration', '${delivery.avgDeliveryHours}h', AppColors.textPrimary),
              _buildMetricTile('Attempt Rate', '${delivery.attemptRate.toStringAsFixed(1)}%', const Color(0xFF065F46)),
              _buildMetricTile('Active Transit', '${delivery.activeShipments}', const Color(0xFF92400E)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricTile(String label, String value, Color valueColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textTertiary)),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: valueColor),
        ),
      ],
    );
  }

  // Market Signals Section
  Widget _buildMarketSignalsSection(BuildContext context, List<CommodityTrend> commodities) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'APMC COMMODITY BENCHMARKS',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.5,
                color: AppColors.textSecondary,
              ),
            ),
            InkWell(
              onTap: () => context.push(AppRoutes.mandiPrices),
              child: const Text(
                'Mandi Terminal →',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.stitchForestGreen),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: commodities.map((c) {
              final isPos = c.movementPercent >= 0;
              return Container(
                width: 140,
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.all(AppSpacing.sm),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      c.commodity,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      c.mandi,
                      style: const TextStyle(fontSize: 10, color: AppColors.textTertiary),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '₹${c.currentPrice.toStringAsFixed(0)}',
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.stitchForestGreen),
                    ),
                    Text(
                      '${isPos ? "+" : ""}${c.movementPercent.toStringAsFixed(1)}%',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isPos ? const Color(0xFF065F46) : const Color(0xFF991B1B),
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
