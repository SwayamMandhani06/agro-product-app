import 'package:flutter/material.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_motion.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_spacing.dart';
import '../design_system/app_typography.dart';
import 'app_button.dart';

/// Sophisticated empty-state widget.
///
/// Icon inside a tonal circular container, strong typography,
/// concise message, optional CTA, with entrance animation.
class AppEmptyState extends StatefulWidget {
  const AppEmptyState({
    required this.icon,
    required this.title,
    super.key,
    this.message,
    this.actionLabel,
    this.onAction,
    this.iconColor,
    this.compact = false,
  });

  final IconData icon;
  final String title;
  final String? message;
  final String? actionLabel;
  final VoidCallback? onAction;
  final Color? iconColor;

  /// If true, renders a more compact version for inline use.
  final bool compact;

  @override
  State<AppEmptyState> createState() => _AppEmptyStateState();
}

class _AppEmptyStateState extends State<AppEmptyState>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double>   _fade;
  late Animation<Offset>   _slide;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: AppMotion.slow);
    _fade  = CurvedAnimation(parent: _ctrl, curve: AppMotion.easeOut);
    _slide = Tween<Offset>(
      begin: const Offset(0, 0.08),
      end:   Offset.zero,
    ).animate(CurvedAnimation(parent: _ctrl, curve: AppMotion.emphasized));
    _ctrl.forward();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color    = widget.iconColor ?? AppColors.primary;
    final iconSize = widget.compact ? AppSpacing.iconXl : AppSpacing.iconHuge;
    final contSize = widget.compact ? 64.0 : 88.0;

    return FadeTransition(
      opacity: _fade,
      child:   SlideTransition(
        position: _slide,
        child:    Padding(
          padding: EdgeInsets.symmetric(
            horizontal: AppSpacing.pagePadding,
            vertical:   widget.compact ? AppSpacing.xl : AppSpacing.xxxl,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Icon container
              Container(
                width:  contSize,
                height: contSize,
                decoration: BoxDecoration(
                  color:        color.withAlpha(18),
                  borderRadius: AppRadius.circleAll,
                ),
                child: Center(
                  child: Icon(widget.icon, size: iconSize, color: color),
                ),
              ),
              SizedBox(height: widget.compact ? AppSpacing.base : AppSpacing.xl),
              // Title
              Text(
                widget.title,
                style: (widget.compact
                    ? AppTypography.textTheme.titleMedium
                    : AppTypography.textTheme.headlineSmall
                )?.copyWith(
                  color:      AppColors.textPrimary,
                  fontWeight: FontWeight.w700,
                ),
                textAlign: TextAlign.center,
              ),
              if (widget.message != null) ...[
                const SizedBox(height: AppSpacing.sm),
                Text(
                  widget.message!,
                  style: AppTypography.textTheme.bodyMedium?.copyWith(
                    color:  AppColors.textSecondary,
                    height: 1.6,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
              if (widget.actionLabel != null && widget.onAction != null) ...[
                SizedBox(height: widget.compact ? AppSpacing.base : AppSpacing.xl),
                AppButton(
                  label:       widget.actionLabel!,
                  onPressed:   widget.onAction,
                  isFullWidth: false,
                  size:        widget.compact ? AppButtonSize.small : AppButtonSize.medium,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
