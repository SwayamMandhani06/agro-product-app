import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../../core/routing/routes.dart';
import '../../../products/domain/product.dart';

/// Categories grid section with circular icon tiles matching Stitch visual specs.
class CategoryGridSection extends StatelessWidget {
  const CategoryGridSection({
    super.key,
    required this.categories,
  });

  final List<ProductCategory> categories;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Browse Categories',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.stitchForestGreen,
              ),
            ),
            InkWell(
              onTap: () => context.push(AppRoutes.categories),
              borderRadius: BorderRadius.circular(AppRadius.xs),
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                child: Row(
                  children: [
                    Text(
                      'View all',
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

        const SizedBox(height: AppSpacing.md),

        // 3-column Grid of Categories
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: categories.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            mainAxisSpacing: AppSpacing.md,
            crossAxisSpacing: AppSpacing.sm,
            childAspectRatio: 0.88,
          ),
          itemBuilder: (context, index) {
            final category = categories[index];
            return InkWell(
              onTap: () => context.push('${AppRoutes.products}?category=${category.name}'),
              borderRadius: BorderRadius.circular(AppRadius.lg),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.stitchForestGreen.withValues(alpha: 0.06),
                      border: Border.all(
                        color: AppColors.stitchForestGreen.withValues(alpha: 0.12),
                        width: 1,
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x060B3D2E),
                          blurRadius: 8,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Center(
                      child: Icon(
                        category.icon,
                        size: 28,
                        color: AppColors.stitchForestGreen,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    category.name,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
