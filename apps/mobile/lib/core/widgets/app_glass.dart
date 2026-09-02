import 'dart:ui';

import 'package:flutter/material.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_shadows.dart';
import '../design_system/app_spacing.dart';

/// Reusable glassmorphism container.
///
/// Use selectively for floating UI elements:
/// - Bottom navigation bar
/// - Floating action areas
/// - Overlay / modal surfaces
/// - Special highlight cards
///
/// Do NOT wrap every card in [AppGlass]. For standard cards use [AppCard].
class AppGlass extends StatelessWidget {
  const AppGlass({
    required this.child,
    super.key,
    this.borderRadius,
    this.blur        = 16.0,
    this.opacity     = 0.80,
    this.dark        = false,
    this.padding,
    this.border      = true,
    this.shadow      = true,
  });

  final Widget child;
  final BorderRadius? borderRadius;

  /// Blur strength — keep between 8–24 for best performance.
  final double blur;

  /// Surface opacity — 0.0 (fully transparent) to 1.0 (fully opaque).
  final double opacity;

  /// Dark-surface glass (for dark overlays or premium dark sections).
  final bool dark;

  final EdgeInsetsGeometry? padding;

  /// Show a thin white/translucent border.
  final bool border;

  /// Show the floating box shadow.
  final bool shadow;

  @override
  Widget build(BuildContext context) {
    final radius  = borderRadius ?? AppRadius.glass;
    final bgColor = dark
        ? AppColors.glassDark.withAlpha((opacity * 255).round())
        : AppColors.glassSurface.withAlpha((opacity * 255).round());
    final borderColor = dark
        ? Colors.white.withAlpha(30)
        : AppColors.glassBorder;

    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: radius,
        boxShadow:    shadow ? AppShadows.floating : null,
      ),
      child: ClipRRect(
        borderRadius: radius,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
          child: Container(
            padding: padding ?? const EdgeInsets.all(AppSpacing.cardPadding),
            decoration: BoxDecoration(
              color:        bgColor,
              borderRadius: radius,
              border:       border
                  ? Border.all(color: borderColor, width: 1)
                  : null,
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

/// A glass-surface bottom navigation bar scaffold.
///
/// Wraps [NavigationBar] in [AppGlass] with correct system padding.
class AppGlassNavBar extends StatelessWidget {
  const AppGlassNavBar({
    required this.destinations,
    required this.selectedIndex,
    required this.onDestinationSelected,
    super.key,
    this.animationDuration,
    this.labelBehavior,
  });

  final List<NavigationDestination> destinations;
  final int selectedIndex;
  final ValueChanged<int> onDestinationSelected;
  final Duration? animationDuration;
  final NavigationDestinationLabelBehavior? labelBehavior;

  @override
  Widget build(BuildContext context) {
    final bottom = MediaQuery.paddingOf(context).bottom;
    return AppGlass(
      blur:         20,
      opacity:      0.88,
      padding:      EdgeInsets.only(bottom: bottom),
      borderRadius: const BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
      child: NavigationBar(
        selectedIndex:             selectedIndex,
        onDestinationSelected:     onDestinationSelected,
        destinations:              destinations,
        backgroundColor:           Colors.transparent,
        shadowColor:               Colors.transparent,
        surfaceTintColor:          Colors.transparent,
        animationDuration:         animationDuration,
        labelBehavior:             labelBehavior,
      ),
    );
  }
}
