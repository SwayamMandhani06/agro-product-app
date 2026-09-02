import 'package:flutter/material.dart';

/// Typography design tokens.
///
/// Font: Plus Jakarta Sans — loaded via google_fonts or bundled assets.
/// All sizes follow a disciplined type scale.
abstract final class AppTypography {
  static const String _fontFamily = 'PlusJakartaSans';

  // ---------------------------------------------------------------------------
  // TextTheme factory — call once inside AppTheme
  // ---------------------------------------------------------------------------
  static TextTheme get textTheme => const TextTheme(
    // Display
    displayLarge:  _display1,
    displayMedium: _display2,
    displaySmall:  _display3,
    // Headline
    headlineLarge:  _headline1,
    headlineMedium: _headline2,
    headlineSmall:  _headline3,
    // Title
    titleLarge:  _title1,
    titleMedium: _title2,
    titleSmall:  _title3,
    // Body
    bodyLarge:   _body1,
    bodyMedium:  _body2,
    bodySmall:   _body3,
    // Label
    labelLarge:  _label1,
    labelMedium: _label2,
    labelSmall:  _label3,
  );

  // ---------------------------------------------------------------------------
  // Display
  // ---------------------------------------------------------------------------
  static const TextStyle _display1 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 57,
    fontWeight: FontWeight.w700,
    letterSpacing: -1.5,
    height: 1.12,
  );
  static const TextStyle _display2 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 45,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.5,
    height: 1.16,
  );
  static const TextStyle _display3 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 36,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.25,
    height: 1.22,
  );

  // ---------------------------------------------------------------------------
  // Headline
  // ---------------------------------------------------------------------------
  static const TextStyle _headline1 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 32,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.5,
    height: 1.25,
  );
  static const TextStyle _headline2 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 28,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.25,
    height: 1.29,
  );
  static const TextStyle _headline3 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 24,
    fontWeight: FontWeight.w600,
    letterSpacing: 0,
    height: 1.33,
  );

  // ---------------------------------------------------------------------------
  // Title
  // ---------------------------------------------------------------------------
  static const TextStyle _title1 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w700,
    letterSpacing: 0,
    height: 1.4,
  );
  static const TextStyle _title2 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
    height: 1.5,
  );
  static const TextStyle _title3 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
    height: 1.43,
  );

  // ---------------------------------------------------------------------------
  // Body
  // ---------------------------------------------------------------------------
  static const TextStyle _body1 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.15,
    height: 1.5,
  );
  static const TextStyle _body2 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.25,
    height: 1.43,
  );
  static const TextStyle _body3 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.4,
    height: 1.33,
  );

  // ---------------------------------------------------------------------------
  // Label
  // ---------------------------------------------------------------------------
  static const TextStyle _label1 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
    height: 1.43,
  );
  static const TextStyle _label2 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w500,
    letterSpacing: 0.5,
    height: 1.33,
  );
  static const TextStyle _label3 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 11,
    fontWeight: FontWeight.w500,
    letterSpacing: 0.5,
    height: 1.45,
  );

  // ---------------------------------------------------------------------------
  // Convenience named styles used across components
  // ---------------------------------------------------------------------------

  /// Large prominent number / price display.
  static const TextStyle price = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 24,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.5,
    height: 1.2,
  );

  /// Button text — large.
  static const TextStyle buttonLarge = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
    height: 1,
  );

  /// Button text — medium.
  static const TextStyle buttonMedium = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
    height: 1,
  );

  /// Caption / helper text.
  static const TextStyle caption = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 11,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.4,
    height: 1.45,
  );

  /// Overline / uppercase label.
  static const TextStyle overline = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 10,
    fontWeight: FontWeight.w600,
    letterSpacing: 1.5,
    height: 1.6,
  );
}
