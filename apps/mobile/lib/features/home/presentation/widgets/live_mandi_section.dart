import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../../core/routing/routes.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../mandi_prices/domain/mandi_price.dart';

/// Live Mandi Prices horizontal scrolling section matching Stitch visual specs.
class LiveMandiSection extends StatelessWidget {
  const LiveMandiSection({
    super.key,
    required this.prices,
  });

  final List<MandiPrice> prices;

  static final _currencyFormatter = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Live Mandi Prices',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.stitchForestGreen,
              ),
            ),
            InkWell(
              onTap: () => context.push(AppRoutes.mandiPrices),
              borderRadius: BorderRadius.circular(AppRadius.xs),
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                child: Row(
                  children: [
                    Text(
                      'See all',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.stitchForestGreen,
                      ),
                    ),
                    SizedBox(width: 2),
                    Icon(
                      Icons.arrow_forward_rounded,
                      size: 14,
                      color: AppColors.stitchForestGreen,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: AppSpacing.sm),

        // Horizontal scrolling card list
        SizedBox(
          height: 126,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            clipBehavior: Clip.none,
            itemCount: prices.length,
            separatorBuilder: (context, index) =>
                const SizedBox(width: AppSpacing.sm),
            itemBuilder: (context, index) {
              final item = prices[index];
              final isPositive = index % 2 == 0;
              final trendPercent = isPositive ? 1.2 : 0.5;

              return SizedBox(
                width: 204,
                child: AppCard(
                  onTap: () => context.push(
                    '${AppRoutes.mandiPrices}/${item.commodity.toLowerCase()}',
                  ),
                  padding: const EdgeInsets.all(AppSpacing.md),
                  borderRadius: BorderRadius.circular(AppRadius.xl),
                  variant: AppCardVariant.elevated,
                  elevation: 1.0,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Commodity name + updated tag
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              item.commodity,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const Text(
                            '10 min ago',
                            style: TextStyle(
                              fontSize: 10,
                              color: AppColors.textTertiary,
                            ),
                          ),
                        ],
                      ),

                      // Price readout
                      FittedBox(
                        fit: BoxFit.scaleDown,
                        alignment: Alignment.centerLeft,
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.baseline,
                          textBaseline: TextBaseline.alphabetic,
                          children: [
                            Text(
                              _currencyFormatter.format(item.pricePerQuintal),
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w800,
                                color: AppColors.stitchForestGreen,
                              ),
                            ),
                            const Text(
                              '/qtl',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Trend indicator badge
                      Row(
                        children: [
                          Icon(
                            isPositive
                                ? Icons.trending_up_rounded
                                : Icons.trending_down_rounded,
                            size: 16,
                            color: isPositive
                                ? AppColors.success
                                : AppColors.error,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${isPositive ? '+' : '-'}${trendPercent.toStringAsFixed(1)}%',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: isPositive
                                  ? AppColors.success
                                  : AppColors.error,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
