import 'package:flutter/material.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_spacing.dart';
import '../design_system/app_typography.dart';
import 'app_button.dart';
import 'app_empty_state.dart';

/// Error severity level.
enum AppErrorSeverity { warning, critical }

/// Sophisticated error state widget.
///
/// Shares entrance-animation logic with [AppEmptyState] via composition.
class AppErrorState extends StatelessWidget {
  const AppErrorState({
    super.key,
    this.title      = 'Something went wrong',
    this.message,
    this.onRetry,
    this.retryLabel = 'Try again',
    this.severity   = AppErrorSeverity.warning,
    this.compact    = false,
  });

  final String title;
  final String? message;
  final VoidCallback? onRetry;
  final String retryLabel;
  final AppErrorSeverity severity;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final isWarning = severity == AppErrorSeverity.warning;
    return AppEmptyState(
      icon:        isWarning ? Icons.error_outline_rounded : Icons.cloud_off_rounded,
      iconColor:   isWarning ? AppColors.warning : AppColors.error,
      title:       title,
      message:     message,
      actionLabel: onRetry != null ? retryLabel : null,
      onAction:    onRetry,
      compact:     compact,
    );
  }
}

/// Inline network error banner (compact strip).
class AppNetworkBanner extends StatelessWidget {
  const AppNetworkBanner({super.key, this.onRetry});

  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.base,
          vertical:   AppSpacing.sm,
        ),
        color: AppColors.warningLight,
        child: Row(
          children: [
            const Icon(Icons.wifi_off_rounded,
              size:  AppSpacing.iconSm,
              color: AppColors.warning,
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Text(
                'No internet connection',
                style: AppTypography.textTheme.labelMedium?.copyWith(
                  color: AppColors.warning,
                ),
              ),
            ),
            if (onRetry != null)
              AppButton(
                label:     'Retry',
                onPressed: onRetry,
                variant:   AppButtonVariant.text,
                size:      AppButtonSize.small,
                isFullWidth: false,
              ),
          ],
        ),
      );
}
