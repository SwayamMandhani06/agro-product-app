import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_spacing.dart';

class NavItemData {
  const NavItemData({
    required this.icon,
    required this.selectedIcon,
    required this.label,
  });

  final IconData icon;
  final IconData selectedIcon;
  final String label;
}

/// Floating glassmorphic bottom navigation bar matching the Stitch AgriTrade spec.
class AppBottomNavBar extends StatelessWidget {
  const AppBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  final int currentIndex;
  final ValueChanged<int> onTap;

  static const List<NavItemData> items = [
    NavItemData(
      icon: Icons.home_outlined,
      selectedIcon: Icons.home_rounded,
      label: 'Home',
    ),
    NavItemData(
      icon: Icons.grid_view_outlined,
      selectedIcon: Icons.grid_view_rounded,
      label: 'Categories',
    ),
    NavItemData(
      icon: Icons.trending_up_rounded,
      selectedIcon: Icons.trending_up_rounded,
      label: 'Mandi',
    ),
    NavItemData(
      icon: Icons.receipt_long_outlined,
      selectedIcon: Icons.receipt_long_rounded,
      label: 'Orders',
    ),
    NavItemData(
      icon: Icons.person_outline_rounded,
      selectedIcon: Icons.person_rounded,
      label: 'Profile',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        left: AppSpacing.pagePadding,
        right: AppSpacing.pagePadding,
        bottom: MediaQuery.of(context).padding.bottom + AppSpacing.xs,
        top: AppSpacing.xs,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppRadius.xl),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
          child: Container(
            height: 64,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.92),
              borderRadius: BorderRadius.circular(AppRadius.xl),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.6),
                width: 1.5,
              ),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x140B3D2E),
                  blurRadius: 24,
                  offset: Offset(0, 8),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(items.length, (index) {
                final item = items[index];
                final isSelected = index == currentIndex;

                return Expanded(
                  child: InkWell(
                    onTap: () {
                      HapticFeedback.selectionClick();
                      onTap(index);
                    },
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      curve: Curves.easeOutCubic,
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: EdgeInsets.symmetric(
                              horizontal: isSelected ? 12 : 0,
                              vertical: isSelected ? 4 : 0,
                            ),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? AppColors.stitchForestGreen.withValues(alpha: 0.12)
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(AppRadius.full),
                            ),
                            child: Icon(
                              isSelected ? item.selectedIcon : item.icon,
                              size: 22,
                              color: isSelected
                                  ? AppColors.stitchForestGreen
                                  : AppColors.neutral500,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            item.label,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: isSelected
                                  ? FontWeight.w700
                                  : FontWeight.w500,
                              color: isSelected
                                  ? AppColors.stitchForestGreen
                                  : AppColors.neutral500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ),
          ),
        ),
      ),
    );
  }
}
