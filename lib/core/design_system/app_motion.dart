import 'package:flutter/material.dart';

/// Motion / animation design tokens.
///
/// Centralising all durations and curves prevents ad-hoc animation values
/// scattered across feature widgets.
abstract final class AppMotion {
  AppMotion._();

  // ---------------------------------------------------------------------------
  // Durations
  // ---------------------------------------------------------------------------
  static const Duration instant    = Duration(milliseconds: 0);
  static const Duration micro      = Duration(milliseconds: 100);
  static const Duration fast       = Duration(milliseconds: 150);
  static const Duration base       = Duration(milliseconds: 200);
  static const Duration normal     = Duration(milliseconds: 300);
  static const Duration slow       = Duration(milliseconds: 400);
  static const Duration xSlow     = Duration(milliseconds: 600);
  static const Duration page       = Duration(milliseconds: 350);

  // ---------------------------------------------------------------------------
  // Standard curves
  // ---------------------------------------------------------------------------
  static const Curve easeOut       = Curves.easeOutCubic;
  static const Curve easeIn        = Curves.easeInCubic;
  static const Curve easeInOut     = Curves.easeInOutCubic;
  static const Curve spring        = Curves.elasticOut;
  static const Curve decelerate    = Curves.decelerate;
  static const Curve emphasized    = Curves.easeOutExpo;
  static const Curve linear        = Curves.linear;

  // ---------------------------------------------------------------------------
  // Pre-composed animation presets (duration + curve pairs)
  // ---------------------------------------------------------------------------

  /// Micro-interactions: button press, chip toggle.
  static const (Duration, Curve) micro_    = (fast,   easeOut);
  /// Component entrance: card slide-in, dialog open.
  static const (Duration, Curve) entrance  = (normal, emphasized);
  /// State change: loading → content, error → retry.
  static const (Duration, Curve) stateChange = (base, easeInOut);
  /// Page transition.
  static const (Duration, Curve) pageTransition = (page, emphasized);

  // ---------------------------------------------------------------------------
  // Button press scale
  // ---------------------------------------------------------------------------
  static const double buttonPressScale = 0.96;

  // ---------------------------------------------------------------------------
  // Shimmer
  // ---------------------------------------------------------------------------
  static const Duration shimmerCycle = Duration(milliseconds: 1200);
}
