import 'package:flutter/material.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_spacing.dart';

/// Top header bar matching the Stitch AgriTrade Home Dashboard visual spec.
///
/// Features location chip, search bar trigger, and interactive badge icons for
/// notifications and shopping cart.
class AppTopBar extends StatelessWidget implements PreferredSizeWidget {
  const AppTopBar({
    super.key,
    this.location = 'Indore, MP',
    this.cartItemCount = 0,
    this.unreadNotificationCount = 0,
    this.onLocationTap,
    this.onSearchTap,
    this.onCartTap,
    this.onNotificationsTap,
    this.showSearchField = true,
  });

  final String location;
  final int cartItemCount;
  final int unreadNotificationCount;
  final VoidCallback? onLocationTap;
  final VoidCallback? onSearchTap;
  final VoidCallback? onCartTap;
  final VoidCallback? onNotificationsTap;
  final bool showSearchField;

  @override
  Size get preferredSize => Size.fromHeight(showSearchField ? 116.0 : 64.0);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.background,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + AppSpacing.xs,
        left: AppSpacing.pagePadding,
        right: AppSpacing.pagePadding,
        bottom: AppSpacing.sm,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Row 1: Location picker & Action icons
          Row(
            children: [
              // Location chip
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
                        size: 16,
                        color: AppColors.stitchForestGreen,
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Text(
                        location,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(width: 2),
                      const Icon(
                        Icons.keyboard_arrow_down_rounded,
                        size: 18,
                        color: AppColors.textSecondary,
                      ),
                    ],
                  ),
                ),
              ),

              const Spacer(),

              // Notifications button with badge
              _buildBadgeIconButton(
                icon: Icons.notifications_none_rounded,
                badgeCount: unreadNotificationCount,
                onTap: onNotificationsTap,
              ),

              const SizedBox(width: AppSpacing.xs),

              // Cart button with badge
              _buildBadgeIconButton(
                icon: Icons.shopping_bag_outlined,
                badgeCount: cartItemCount,
                onTap: onCartTap,
              ),
            ],
          ),

          // Row 2: Search field trigger
          if (showSearchField) ...[
            const SizedBox(height: AppSpacing.sm),
            InkWell(
              onTap: onSearchTap,
              borderRadius: BorderRadius.circular(AppRadius.md),
              child: Container(
                height: 44,
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(color: AppColors.borderSubtle),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x08000000),
                      blurRadius: 8,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.search_rounded,
                      size: 20,
                      color: AppColors.textTertiary,
                    ),
                    const SizedBox(width: AppSpacing.xs),
                    const Expanded(
                      child: Text(
                        'Search seeds, fertilizers, mandi...',
                        style: TextStyle(
                          fontSize: 13,
                          color: AppColors.textTertiary,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: AppColors.stitchCanvas,
                        borderRadius: BorderRadius.circular(AppRadius.xs),
                      ),
                      child: const Icon(
                        Icons.tune_rounded,
                        size: 16,
                        color: AppColors.stitchForestGreen,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildBadgeIconButton({
    required IconData icon,
    required int badgeCount,
    required VoidCallback? onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
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
              Icon(icon, size: 20, color: AppColors.textPrimary),
              if (badgeCount > 0)
                Positioned(
                  top: 6,
                  right: 6,
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: const BoxDecoration(
                      color: AppColors.stitchAmber,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 14,
                      minHeight: 14,
                    ),
                    child: Text(
                      badgeCount > 99 ? '99+' : badgeCount.toString(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 8,
                        fontWeight: FontWeight.w800,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
