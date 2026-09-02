import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Shadow / elevation design tokens.
///
/// All shadows use the brand dark green tint instead of black,
/// giving a softer, warmer depth that feels premium and on-brand.
abstract final class AppShadows {
  AppShadows._();

  // ---------------------------------------------------------------------------
  // Tinted shadow colours
  // ---------------------------------------------------------------------------
  /// Soft brand-tinted shadow (replaces Material's black-based shadows).
  static const Color _s1  = Color(0x0A012D1D); // 4%
  static const Color _s2  = Color(0x0F012D1D); // 6%
  static const Color _s3  = Color(0x14012D1D); // 8%
  static const Color _s4  = Color(0x1E012D1D); // 12%
  static const Color _s5  = Color(0x28012D1D); // 16%

  // ---------------------------------------------------------------------------
  // Elevation levels
  // ---------------------------------------------------------------------------

  /// No elevation — used for flat surfaces.
  static const List<BoxShadow> flat = [];

  /// Subtle — barely-there lift. Use for default cards.
  static const List<BoxShadow> subtle = [
    BoxShadow(color: _s1, blurRadius: 2, offset: Offset(0, 1)),
    BoxShadow(color: _s2, blurRadius: 6, offset: Offset(0, 2)),
  ];

  /// Raised — standard interactive card elevation.
  static const List<BoxShadow> raised = [
    BoxShadow(color: _s1, blurRadius: 4,  offset: Offset(0, 1)),
    BoxShadow(color: _s3, blurRadius: 12, offset: Offset(0, 4)),
    BoxShadow(color: _s1, blurRadius: 2,  offset: Offset(0, 0)),
  ];

  /// Floating — for FABs, modals, bottom nav, glass elements.
  static const List<BoxShadow> floating = [
    BoxShadow(color: _s2, blurRadius: 8,  offset: Offset(0, 2)),
    BoxShadow(color: _s4, blurRadius: 24, offset: Offset(0, 8)),
    BoxShadow(color: _s1, blurRadius: 4,  offset: Offset(0, 0)),
  ];

  /// Dialog / overlay — deep, clearly separated from page.
  static const List<BoxShadow> overlay = [
    BoxShadow(color: _s3, blurRadius: 16, offset: Offset(0, 4)),
    BoxShadow(color: _s5, blurRadius: 48, offset: Offset(0, 16)),
  ];

  // ---------------------------------------------------------------------------
  // Accent glow — for focus states, CTAs
  // ---------------------------------------------------------------------------
  static final List<BoxShadow> focusGlow = [
    BoxShadow(
      color: AppColors.brand700.withAlpha(38), // ~15%
      blurRadius: 0,
      spreadRadius: 3,
    ),
  ];

  static final List<BoxShadow> accentGlow = [
    BoxShadow(
      color: AppColors.accent.withAlpha(51), // ~20%
      blurRadius: 12,
      spreadRadius: 0,
      offset: const Offset(0, 4),
    ),
  ];
}
