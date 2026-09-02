import 'package:flutter/material.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_motion.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_shadows.dart';
import '../design_system/app_spacing.dart';

/// Card surface variant.
enum AppCardVariant { elevated, tonal, outlined, glass, dark }

/// Flexible premium card surface.
///
/// Supports five visual variants covering the full elevation system.
/// Use [AppGlass] for glass effects on floating elements.
class AppCard extends StatefulWidget {
  const AppCard({
    required this.child,
    super.key,
    this.variant    = AppCardVariant.elevated,
    this.padding,
    this.margin,
    this.borderRadius,
    this.onTap,
    this.elevation,
    this.clipBehavior = Clip.antiAlias,
  });

  final Widget child;
  final AppCardVariant variant;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;
  final VoidCallback? onTap;
  final double? elevation;
  final Clip clipBehavior;

  @override
  State<AppCard> createState() => _AppCardState();
}

class _AppCardState extends State<AppCard> {
  bool _pressed = false;

  void _onTapDown(TapDownDetails _) {
    if (widget.onTap != null) setState(() => _pressed = true);
  }

  void _onTapUp(TapUpDetails _)  => setState(() => _pressed = false);
  void _onTapCancel()            => setState(() => _pressed = false);

  @override
  Widget build(BuildContext context) {
    final radius   = widget.borderRadius ?? AppRadius.card;
    final padding  = widget.padding ?? const EdgeInsets.all(AppSpacing.cardPadding);
    final variant  = widget.variant;
    final colors   = _variantColors(variant);
    final shadows  = _variantShadow(variant);

    Widget content = Padding(padding: padding, child: widget.child);

    if (widget.onTap != null) {
      content = GestureDetector(
        onTapDown:   _onTapDown,
        onTapUp:     _onTapUp,
        onTapCancel: _onTapCancel,
        onTap:       widget.onTap,
        child: content,
      );
    }

    return AnimatedContainer(
      duration:   AppMotion.base,
      curve:      AppMotion.easeOut,
      margin:     widget.margin,
      clipBehavior: widget.clipBehavior,
      transform:  _pressed
          ? Matrix4.diagonal3Values(0.98, 0.98, 1.0)
          : Matrix4.identity(),
      decoration: BoxDecoration(
        color:        colors.bg,
        gradient:     colors.gradient,
        borderRadius: radius,
        border:       colors.border != null
            ? Border.all(color: colors.border!, width: 1)
            : null,
        boxShadow:    _pressed
            ? AppShadows.subtle
            : shadows,
      ),
      child: ClipRRect(
        borderRadius: radius,
        child:        content,
      ),
    );
  }

  _CardColors _variantColors(AppCardVariant v) => switch (v) {
    AppCardVariant.elevated => const _CardColors(
      bg:     AppColors.surface,
      border: AppColors.border,
    ),
    AppCardVariant.tonal => const _CardColors(
      bg:     AppColors.surfaceTinted,
      border: AppColors.borderSubtle,
    ),
    AppCardVariant.outlined => const _CardColors(
      bg:     AppColors.surface,
      border: AppColors.neutral200,
    ),
    AppCardVariant.glass => const _CardColors(
      bg:     AppColors.glassSurface,
      border: AppColors.glassBorder,
    ),
    AppCardVariant.dark => const _CardColors(
      gradient: LinearGradient(
        begin:  Alignment.topLeft,
        end:    Alignment.bottomRight,
        colors: [AppColors.surfaceDark, AppColors.surfaceDarkElevated],
      ),
    ),
  };

  List<BoxShadow> _variantShadow(AppCardVariant v) => switch (v) {
    AppCardVariant.elevated => AppShadows.subtle,
    AppCardVariant.tonal    => AppShadows.flat,
    AppCardVariant.outlined => AppShadows.flat,
    AppCardVariant.glass    => AppShadows.raised,
    AppCardVariant.dark     => AppShadows.raised,
  };
}

class _CardColors {
  const _CardColors({this.bg, this.gradient, this.border});
  final Color? bg;
  final Gradient? gradient;
  final Color? border;
}
