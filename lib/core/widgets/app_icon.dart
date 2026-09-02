import 'package:flutter/material.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_spacing.dart';

/// Centralised icon wrapper ensuring consistent sizing, colour, and style.
///
/// Always use this instead of raw [Icon] in feature widgets
/// so icon style stays uniform.
class AppIcon extends StatelessWidget {
  const AppIcon(
    this.icon, {
    super.key,
    this.size   = AppSpacing.iconMd,
    this.color,
    this.semanticLabel,
    this.onSurface = false,
  });

  final IconData icon;
  final double size;
  final Color? color;
  final String? semanticLabel;

  /// If true, uses [AppColors.onPrimary] as the default colour
  /// (for icons placed on brand/primary surfaces).
  final bool onSurface;

  Color get _defaultColor =>
      onSurface ? AppColors.onPrimary : AppColors.textSecondary;

  @override
  Widget build(BuildContext context) => Icon(
        icon,
        size:          size,
        color:         color ?? _defaultColor,
        semanticLabel: semanticLabel,
      );
}

/// A tonal icon container — icon inside a softly tinted circular background.
class AppIconContainer extends StatelessWidget {
  const AppIconContainer({
    required this.icon,
    super.key,
    this.size        = 48,
    this.iconSize,
    this.color,
    this.backgroundColor,
    this.shape       = BoxShape.circle,
  });

  final IconData icon;
  final double size;
  final double? iconSize;
  final Color? color;
  final Color? backgroundColor;
  final BoxShape shape;

  @override
  Widget build(BuildContext context) {
    final iconColor = color ?? AppColors.primary;
    final bgColor   = backgroundColor ?? iconColor.withAlpha(20);

    return Container(
      width:  size,
      height: size,
      decoration: BoxDecoration(
        color: bgColor,
        shape: shape,
      ),
      child: Center(
        child: Icon(
          icon,
          size:  iconSize ?? size * 0.5,
          color: iconColor,
        ),
      ),
    );
  }
}

/// Semantic badge — a small coloured dot or label indicator.
class AppBadge extends StatelessWidget {
  const AppBadge({
    super.key,
    this.count,
    this.color,
    this.size = 8,
  });

  /// If null, renders a plain dot. Otherwise renders the count number.
  final int? count;
  final Color? color;
  final double size;

  @override
  Widget build(BuildContext context) {
    final bg = color ?? AppColors.error;
    if (count == null) {
      return Container(
        width:  size,
        height: size,
        decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
      );
    }
    return Container(
      constraints: BoxConstraints(minWidth: size * 2),
      height: size * 2,
      padding: EdgeInsets.symmetric(horizontal: size * 0.5),
      decoration: BoxDecoration(
        color:        bg,
        borderRadius: BorderRadius.circular(size),
      ),
      child: Center(
        child: Text(
          count! > 99 ? '99+' : count.toString(),
          style: TextStyle(
            color:      Colors.white,
            fontSize:   size * 0.9,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}
