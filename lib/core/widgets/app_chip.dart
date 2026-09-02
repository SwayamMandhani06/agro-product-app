import 'package:flutter/material.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_motion.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_spacing.dart';
import '../design_system/app_typography.dart';

/// Chip semantic variant.
enum AppChipVariant {
  neutral,
  primary,
  success,
  warning,
  error,
  info,
}

/// Compact, pill-shaped chip with optional status dot and animated selection.
class AppChip extends StatelessWidget {
  const AppChip({
    required this.label,
    super.key,
    this.variant     = AppChipVariant.neutral,
    this.selected    = false,
    this.onTap,
    this.leadingDot  = false,
    this.icon,
    this.onDeleted,
  });

  final String label;
  final AppChipVariant variant;
  final bool selected;
  final VoidCallback? onTap;

  /// Show a small filled circle before the label (status indicator).
  final bool leadingDot;
  final IconData? icon;
  final VoidCallback? onDeleted;

  @override
  Widget build(BuildContext context) {
    final colors = _resolveColors(variant, selected);

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: AppMotion.base,
        curve:    AppMotion.easeOut,
        padding:  EdgeInsets.symmetric(
          horizontal: onDeleted != null ? AppSpacing.sm : AppSpacing.md,
          vertical:   AppSpacing.xs + 2,
        ),
        decoration: BoxDecoration(
          color:        colors.bg,
          borderRadius: AppRadius.chip,
          border:       Border.all(color: colors.border, width: 1),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (leadingDot) ...[
              Container(
                width:  6,
                height: 6,
                decoration: BoxDecoration(
                  color:  colors.dot,
                  shape:  BoxShape.circle,
                ),
              ),
              const SizedBox(width: AppSpacing.xs),
            ],
            if (icon != null) ...[
              Icon(icon, size: 14, color: colors.fg),
              const SizedBox(width: AppSpacing.xs),
            ],
            Text(
              label,
              style: AppTypography.textTheme.labelMedium?.copyWith(
                color:      colors.fg,
                fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
              ),
            ),
            if (onDeleted != null) ...[
              const SizedBox(width: AppSpacing.xs),
              GestureDetector(
                onTap: onDeleted,
                child: Icon(
                  Icons.close_rounded,
                  size:  14,
                  color: colors.fg.withAlpha(180),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  _ChipColors _resolveColors(AppChipVariant v, bool selected) {
    if (selected) {
      return switch (v) {
        AppChipVariant.neutral => const _ChipColors(
          bg:     AppColors.primary,
          fg:     AppColors.onPrimary,
          border: AppColors.primary,
          dot:    AppColors.brand200,
        ),
        AppChipVariant.primary => const _ChipColors(
          bg:     AppColors.primary,
          fg:     AppColors.onPrimary,
          border: AppColors.primary,
          dot:    AppColors.brand200,
        ),
        AppChipVariant.success => const _ChipColors(
          bg:     AppColors.success,
          fg:     Colors.white,
          border: AppColors.success,
          dot:    AppColors.brand200,
        ),
        AppChipVariant.warning => const _ChipColors(
          bg:     AppColors.warning,
          fg:     Colors.white,
          border: AppColors.warning,
          dot:    AppColors.amber100,
        ),
        AppChipVariant.error => const _ChipColors(
          bg:     AppColors.error,
          fg:     Colors.white,
          border: AppColors.error,
          dot:    AppColors.errorLight,
        ),
        AppChipVariant.info => const _ChipColors(
          bg:     AppColors.info,
          fg:     Colors.white,
          border: AppColors.info,
          dot:    AppColors.infoLight,
        ),
      };
    }

    return switch (v) {
      AppChipVariant.neutral => const _ChipColors(
        bg:     AppColors.surfaceSubtle,
        fg:     AppColors.textSecondary,
        border: AppColors.border,
        dot:    AppColors.neutral400,
      ),
      AppChipVariant.primary => const _ChipColors(
        bg:     AppColors.brand50,
        fg:     AppColors.primary,
        border: AppColors.brand200,
        dot:    AppColors.primary,
      ),
      AppChipVariant.success => const _ChipColors(
        bg:     AppColors.successLight,
        fg:     AppColors.success,
        border: AppColors.successLight,
        dot:    AppColors.success,
      ),
      AppChipVariant.warning => const _ChipColors(
        bg:     AppColors.warningLight,
        fg:     AppColors.warning,
        border: AppColors.warningLight,
        dot:    AppColors.warning,
      ),
      AppChipVariant.error => const _ChipColors(
        bg:     AppColors.errorLight,
        fg:     AppColors.error,
        border: AppColors.errorLight,
        dot:    AppColors.error,
      ),
      AppChipVariant.info => const _ChipColors(
        bg:     AppColors.infoLight,
        fg:     AppColors.info,
        border: AppColors.infoLight,
        dot:    AppColors.info,
      ),
    };
  }
}

class _ChipColors {
  const _ChipColors({
    required this.bg,
    required this.fg,
    required this.border,
    required this.dot,
  });
  final Color bg;
  final Color fg;
  final Color border;
  final Color dot;
}
