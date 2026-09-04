// ============================================================
// AGRITRADE INSIGHT DETAIL SHEET (FLUTTER)
// Material 3 transparent diagnosis bottom sheet
// ============================================================

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:agro_product_app/core/design_system/app_colors.dart';
import 'package:agro_product_app/core/design_system/app_radius.dart';
import 'package:agro_product_app/core/design_system/app_spacing.dart';
import '../../domain/farm_insight.dart';

class InsightDetailSheet extends StatelessWidget {
  final FarmInsight insight;

  const InsightDetailSheet({
    super.key,
    required this.insight,
  });

  static void show(BuildContext context, FarmInsight insight) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => InsightDetailSheet(insight: insight),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    Color badgeBg;
    Color badgeText;
    switch (insight.severity) {
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

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.lg)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.base,
      ),
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.85,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: badgeBg,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    insight.badgeLabel.toUpperCase(),
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.5,
                      color: badgeText,
                    ),
                  ),
                ),
                Text(
                  insight.detectedAt,
                  style: const TextStyle(fontSize: 11, color: AppColors.textTertiary),
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                insight.title,
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
          ),

          const Divider(height: 24),

          // Scrollable diagnosis body
          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. What Happened
                  _buildSectionTitle('What Happened'),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(AppSpacing.sm),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceVariant,
                      borderRadius: BorderRadius.circular(AppRadius.sm),
                    ),
                    child: Text(
                      insight.whatHappened,
                      style: const TextStyle(fontSize: 13, height: 1.5),
                    ),
                  ),

                  const SizedBox(height: AppSpacing.base),

                  // 2. Why It Was Detected
                  _buildSectionTitle('Why Detected (Deterministic Audit)'),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(AppSpacing.sm),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceVariant,
                      borderRadius: BorderRadius.circular(AppRadius.sm),
                    ),
                    child: Text(
                      insight.whyDetected,
                      style: const TextStyle(fontSize: 13, height: 1.5),
                    ),
                  ),

                  const SizedBox(height: AppSpacing.base),

                  // 3. Supporting Verification Data
                  _buildSectionTitle('Supporting Verification Data'),
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.border),
                      borderRadius: BorderRadius.circular(AppRadius.sm),
                    ),
                    child: Column(
                      children: insight.supportingData.asMap().entries.map((entry) {
                        final idx = entry.key;
                        final d = entry.value;
                        final isLast = idx == insight.supportingData.length - 1;

                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            border: isLast ? null : const Border(bottom: BorderSide(color: AppColors.border)),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  d.metric,
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    d.value,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.stitchForestGreen,
                                    ),
                                  ),
                                  if (d.benchmark != null)
                                    Text(
                                      d.benchmark!,
                                      style: const TextStyle(fontSize: 10, color: AppColors.textTertiary),
                                    ),
                                ],
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),

                  const SizedBox(height: AppSpacing.base),

                  // 4. Recommended Agronomic Consideration
                  _buildSectionTitle('Recommended Action / Consideration'),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(AppSpacing.sm),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0FDF4),
                      border: const Border(
                        left: BorderSide(color: AppColors.stitchForestGreen, width: 3),
                      ),
                      borderRadius: BorderRadius.circular(AppRadius.xs),
                    ),
                    child: Text(
                      insight.recommendedConsideration,
                      style: const TextStyle(
                        fontSize: 13,
                        height: 1.5,
                        color: Color(0xFF14532D),
                      ),
                    ),
                  ),

                  const SizedBox(height: AppSpacing.base),
                ],
              ),
            ),
          ),

          // Bottom Action
          Padding(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: SizedBox(
              width: double.infinity,
              child: FilledButton(
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.stitchForestGreen,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                  ),
                ),
                onPressed: () {
                  Navigator.of(context).pop();
                  if (insight.actionRoute != null) {
                    context.push(insight.actionRoute!);
                  }
                },
                child: Text(
                  insight.actionLabel ?? 'Acknowledge Insight',
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.5,
          color: AppColors.textSecondary,
        ),
      ),
    );
  }
}
