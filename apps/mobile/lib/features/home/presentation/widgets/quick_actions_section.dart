import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../../core/routing/routes.dart';
import '../../../../core/widgets/app_card.dart';

class QuickActionItem {
  const QuickActionItem({
    required this.title,
    required this.icon,
    required this.route,
    this.onTap,
  });

  final String title;
  final IconData icon;
  final String route;
  final VoidCallback? onTap;
}

/// Quick Actions 2x2 grid matching Stitch visual specifications.
class QuickActionsSection extends StatelessWidget {
  const QuickActionsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final actions = [
      const QuickActionItem(
        title: 'Browse Products',
        icon: Icons.storefront_rounded,
        route: AppRoutes.products,
      ),
      QuickActionItem(
        title: 'Ask AgriTrade AI',
        icon: Icons.psychology_rounded,
        route: '',
        onTap: () => _openAiAssistant(context),
      ),
      const QuickActionItem(
        title: 'Track Orders',
        icon: Icons.local_shipping_rounded,
        route: AppRoutes.orders,
      ),
      const QuickActionItem(
        title: 'Community',
        icon: Icons.forum_rounded,
        route: AppRoutes.forum,
      ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.stitchForestGreen,
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: actions.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: AppSpacing.sm,
            crossAxisSpacing: AppSpacing.sm,
            childAspectRatio: 2.5,
          ),
          itemBuilder: (context, index) {
            final action = actions[index];
            return AppCard(
              onTap: () {
                if (action.onTap != null) {
                  action.onTap!();
                } else {
                  context.push(action.route);
                }
              },
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.sm,
                vertical: AppSpacing.xs,
              ),
              borderRadius: BorderRadius.circular(AppRadius.xl),
              variant: AppCardVariant.elevated,
              elevation: 1.0,
              child: Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: AppColors.stitchForestGreen.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      action.icon,
                      size: 20,
                      color: AppColors.stitchForestGreen,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Text(
                      action.title,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.stitchForestGreen,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  void _openAiAssistant(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xxl)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(AppSpacing.cardPadding),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.xs),
                    decoration: BoxDecoration(
                      color: AppColors.stitchForestGreen.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(AppRadius.sm),
                    ),
                    child: const Icon(
                      Icons.psychology_rounded,
                      color: AppColors.stitchForestGreen,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  const Text(
                    'Ask AgriTrade AI',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.stitchForestGreen,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              const Text(
                'Get instant agronomic advice, pest diagnostics, and weather impact analysis tailored for your crops.',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.stitchForestGreen,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadius.sm),
                    ),
                  ),
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('Close'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
