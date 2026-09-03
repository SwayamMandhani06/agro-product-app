/// Spacing design tokens — 4-point grid.
///
/// Use these constants everywhere margins, paddings, and gaps are needed.
/// Never write raw numeric literals in layout code.
abstract final class AppSpacing {
  AppSpacing._();

  // ---------------------------------------------------------------------------
  // Base scale
  // ---------------------------------------------------------------------------
  static const double xxs  = 2.0;
  static const double xs   = 4.0;
  static const double sm   = 8.0;
  static const double md   = 12.0;
  static const double base = 16.0;
  static const double lg   = 20.0;
  static const double xl   = 24.0;
  static const double xxl  = 32.0;
  static const double xxxl = 48.0;
  static const double huge = 64.0;

  // ---------------------------------------------------------------------------
  // Page / screen
  // ---------------------------------------------------------------------------
  /// Standard horizontal screen padding.
  static const double pagePadding      = 20.0;
  /// Tight horizontal padding for dense contexts.
  static const double pagePaddingTight = 16.0;
  /// Wide padding for tablet / expanded breakpoints.
  static const double pagePaddingWide  = 32.0;

  // ---------------------------------------------------------------------------
  // Component
  // ---------------------------------------------------------------------------
  /// Standard internal card / tile padding.
  static const double cardPadding      = 20.0;
  /// Compact card padding.
  static const double cardPaddingSmall = 12.0;

  /// Gap between list items.
  static const double listGap      = 12.0;
  /// Tight gap (dense lists, chips).
  static const double listGapTight = 8.0;
  /// Wide gap (section spacing).
  static const double sectionGap   = 32.0;

  // ---------------------------------------------------------------------------
  // Icon
  // ---------------------------------------------------------------------------
  static const double iconXs   = 16.0;
  static const double iconSm   = 20.0;
  static const double iconMd   = 24.0;
  static const double iconLg   = 28.0;
  static const double iconXl   = 32.0;
  static const double iconHuge = 48.0;

  // ---------------------------------------------------------------------------
  // Hit target
  // ---------------------------------------------------------------------------
  /// Minimum touch target height for all interactive elements.
  static const double minTouchTarget = 48.0;
  static const double buttonHeight   = 54.0;
  static const double buttonHeightSm = 40.0;
  static const double inputHeight    = 56.0;
}
