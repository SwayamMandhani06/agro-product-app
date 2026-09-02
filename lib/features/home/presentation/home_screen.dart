import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/routing/routes.dart';
import '../../../core/widgets/app_button.dart';

/// Stage 1 placeholder home screen.
///
/// Navigates to the Stage 2 design system preview via the
/// /design-system-preview route.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'app_title'.tr(),
          style: Theme.of(context).textTheme.titleLarge,
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.spa_outlined,
              size:  64,
              color: AppColors.primary,
            ),
            const SizedBox(height: AppSpacing.xl),
            Text(
              'home_placeholder'.tr(),
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.xxxl),
            AppButton(
              label:    'View Design System ↗',
              onPressed: () => context.push(AppRoutes.designSystemPreview),
            ),
          ],
        ),
      ),
    );
  }
}
