import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/widgets/app_bottom_nav_bar.dart';

/// Primary application shell supporting persistent bottom navigation across
/// the 5 main feature branches: Home, Categories, Mandi, Orders, and Profile.
class MainShellScreen extends StatelessWidget {
  const MainShellScreen({
    super.key,
    required this.navigationShell,
  });

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: navigationShell,
      extendBody: true, // Allow body to render behind the floating glass nav bar
      bottomNavigationBar: AppBottomNavBar(
        currentIndex: navigationShell.currentIndex,
        onTap: (index) => _onTapBranch(context, index),
      ),
    );
  }

  void _onTapBranch(BuildContext context, int index) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }
}
