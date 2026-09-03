import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../domain/product.dart';
import '../providers/product_providers.dart';

/// Modal bottom sheet for choosing product catalogue sort ordering.
class ProductSortSheet extends ConsumerWidget {
  const ProductSortSheet({super.key});

  /// Helper to display this sort sheet as a modal bottom sheet.
  static Future<void> show(BuildContext context) {
    return showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => const ProductSortSheet(),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentSort = ref.watch(productSortProvider);

    return Material(
      color: AppColors.surface,
      borderRadius: const BorderRadius.vertical(
        top: Radius.circular(AppRadius.xxl),
      ),
      clipBehavior: Clip.antiAlias,
      child: SafeArea(
        top: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(
            AppSpacing.md,
            AppSpacing.sm,
            AppSpacing.md,
            AppSpacing.md,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.neutral300,
                borderRadius: BorderRadius.circular(AppRadius.full),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          // Title
          const Row(
            children: [
              Icon(
                Icons.sort_rounded,
                size: 20,
                color: AppColors.textPrimary,
              ),
              SizedBox(width: AppSpacing.xs),
              Text(
                'Sort By',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          const Divider(height: 1, color: AppColors.neutral200),
          const SizedBox(height: AppSpacing.xs),

          // Sort Options
          ...ProductSort.values.map((sortOption) {
            final isSelected = currentSort == sortOption;
            return ListTile(
              contentPadding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.xs,
                vertical: 2,
              ),
              leading: Icon(
                _getSortIcon(sortOption),
                color: isSelected
                    ? AppColors.stitchForestGreen
                    : AppColors.textSecondary,
                size: 20,
              ),
              title: Text(
                sortOption.label,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  color: isSelected
                      ? AppColors.stitchForestGreen
                      : AppColors.textPrimary,
                ),
              ),
              trailing: isSelected
                  ? const Icon(
                      Icons.check_circle_rounded,
                      color: AppColors.stitchForestGreen,
                      size: 20,
                    )
                  : null,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              onTap: () {
                ref.read(productSortProvider.notifier).state = sortOption;
                Navigator.of(context).pop();
              },
            );
          }),
        ],
      ),
    ),
  ),
);
  }

  IconData _getSortIcon(ProductSort sort) {
    switch (sort) {
      case ProductSort.featured:
        return Icons.auto_awesome_rounded;
      case ProductSort.priceAsc:
        return Icons.arrow_upward_rounded;
      case ProductSort.priceDesc:
        return Icons.arrow_downward_rounded;
      case ProductSort.ratingDesc:
        return Icons.star_rounded;
      case ProductSort.newest:
        return Icons.schedule_rounded;
    }
  }
}
