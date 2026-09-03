import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_spacing.dart';
import 'app_card.dart';

/// Mandi price summary card matching Stitch market overview designs.
class MandiPriceCard extends StatelessWidget {
  const MandiPriceCard({
    super.key,
    required this.commodityName,
    required this.mandiName,
    required this.modalPrice,
    this.priceChange = 0.0,
    this.percentageChange = 0.0,
    this.minPrice,
    this.maxPrice,
    this.arrivalVolume,
    this.lastUpdated,
    this.onTap,
  });

  final String commodityName;
  final String mandiName;
  final double modalPrice;
  final double priceChange;
  final double percentageChange;
  final double? minPrice;
  final double? maxPrice;
  final String? arrivalVolume;
  final String? lastUpdated;
  final VoidCallback? onTap;

  static final _currencyFormatter = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  @override
  Widget build(BuildContext context) {
    final isPositive = priceChange >= 0;
    final trendColor = isPositive ? AppColors.success : AppColors.error;
    final trendBgColor = isPositive ? AppColors.successLight : AppColors.errorLight;

    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(AppSpacing.md),
      borderRadius: BorderRadius.circular(AppRadius.lg),
      variant: AppCardVariant.elevated,
      elevation: 1.0,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      commodityName,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        const Icon(
                          Icons.location_on_outlined,
                          size: 13,
                          color: AppColors.textTertiary,
                        ),
                        const SizedBox(width: AppSpacing.xs),
                        Expanded(
                          child: Text(
                            mandiName,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: AppColors.textSecondary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Trend indicator badge
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.xs,
                  vertical: 3,
                ),
                decoration: BoxDecoration(
                  color: trendBgColor,
                  borderRadius: BorderRadius.circular(AppRadius.xs),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      isPositive
                          ? Icons.arrow_upward_rounded
                          : Icons.arrow_downward_rounded,
                      size: 12,
                      color: trendColor,
                    ),
                    const SizedBox(width: 2),
                    Text(
                      '${isPositive ? '+' : ''}${percentageChange.toStringAsFixed(1)}%',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: trendColor,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),

          // Price row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Text(
                    _currencyFormatter.format(modalPrice),
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppColors.stitchForestGreen,
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Text(
                    '/ quintal',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
              if (minPrice != null && maxPrice != null)
                Text(
                  'Range: ${_currencyFormatter.format(minPrice)} - ${_currencyFormatter.format(maxPrice)}',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textTertiary,
                  ),
                ),
            ],
          ),

          if (arrivalVolume != null || lastUpdated != null) ...[
            const SizedBox(height: AppSpacing.xs),
            const Divider(color: AppColors.neutral100, height: 1),
            const SizedBox(height: AppSpacing.xs),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (arrivalVolume != null)
                  Text(
                    'Arrivals: $arrivalVolume',
                    style: const TextStyle(
                      fontSize: 11,
                      color: AppColors.textSecondary,
                    ),
                  ),
                if (lastUpdated != null)
                  Text(
                    lastUpdated!,
                    style: const TextStyle(
                      fontSize: 10,
                      color: AppColors.textTertiary,
                    ),
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
