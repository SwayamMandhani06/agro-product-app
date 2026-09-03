import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../../core/routing/routes.dart';

/// Contextual greeting header matching Stitch AgriTrade TopAppBar.
///
/// Features farmer avatar, dynamic time-of-day greeting, farm status subtitle,
/// interactive notification badge, location picker chip, and search trigger.
class FarmerGreetingHeader extends StatelessWidget {
  const FarmerGreetingHeader({
    super.key,
    this.farmerName = 'Farmer',
    this.location = 'Pune, Maharashtra',
    this.unreadNotifications = 2,
    this.cartItemCount = 0,
    this.onLocationTap,
  });

  final String farmerName;
  final String location;
  final int unreadNotifications;
  final int cartItemCount;
  final VoidCallback? onLocationTap;

  String get _timeGreeting {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.background,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + AppSpacing.sm,
        left: AppSpacing.pagePadding,
        right: AppSpacing.pagePadding,
        bottom: AppSpacing.sm,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Row 1: Profile Avatar + Greeting + Notifications & Cart Actions
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Avatar
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.stitchCanvas,
                  border: Border.all(
                    color: AppColors.borderSubtle,
                    width: 1.5,
                  ),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x0A0B3D2E),
                      blurRadius: 8,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(
                    Icons.person_rounded,
                    size: 26,
                    color: AppColors.stitchForestGreen,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),

              // Farmer Greeting Text
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '$_timeGreeting, $farmerName',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.stitchForestGreen,
                        height: 1.2,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    const Text(
                      'Here’s what’s happening on your farm today.',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        color: AppColors.textSecondary,
                        height: 1.2,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),

              // Notification Action Icon with Badge
              Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () => context.push(AppRoutes.notifications),
                  borderRadius: BorderRadius.circular(AppRadius.full),
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        const Icon(
                          Icons.notifications_none_rounded,
                          size: 22,
                          color: AppColors.textPrimary,
                        ),
                        if (unreadNotifications > 0)
                          Positioned(
                            top: 8,
                            right: 8,
                            child: Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.error,
                                shape: BoxShape.circle,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.md),

          // Row 2: Location chip + Search Field Trigger
          Row(
            children: [
              // Location Chip
              InkWell(
                onTap: onLocationTap,
                borderRadius: BorderRadius.circular(AppRadius.full),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.sm,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(AppRadius.full),
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.location_on_rounded,
                        size: 15,
                        color: AppColors.stitchForestGreen,
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Text(
                        location,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppColors.stitchForestGreen,
                        ),
                      ),
                      const SizedBox(width: 2),
                      const Icon(
                        Icons.keyboard_arrow_down_rounded,
                        size: 16,
                        color: AppColors.textSecondary,
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(width: AppSpacing.sm),

              // Search Trigger Bar
              Expanded(
                child: InkWell(
                  onTap: () => context.push(AppRoutes.search),
                  borderRadius: BorderRadius.circular(AppRadius.full),
                  child: Container(
                    height: 36,
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: const Row(
                      children: [
                        Icon(
                          Icons.search_rounded,
                          size: 18,
                          color: AppColors.textTertiary,
                        ),
                        SizedBox(width: AppSpacing.xs),
                        Expanded(
                          child: Text(
                            'Search products...',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppColors.textTertiary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
