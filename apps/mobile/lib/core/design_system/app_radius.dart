import 'package:flutter/material.dart';

/// Border-radius design tokens.
abstract final class AppRadius {
  AppRadius._();

  // ---------------------------------------------------------------------------
  // Named scale
  // ---------------------------------------------------------------------------
  static const double none   = 0;
  static const double xs     = 4;
  static const double sm     = 8;
  static const double md     = 12;
  static const double base   = 16;
  static const double lg     = 20;
  static const double xl     = 24;
  static const double xxl    = 32;
  static const double circle = 9999;

  // ---------------------------------------------------------------------------
  // BorderRadius helpers
  // ---------------------------------------------------------------------------
  static const BorderRadius noneAll   = BorderRadius.zero;
  static const BorderRadius xsAll     = BorderRadius.all(Radius.circular(xs));
  static const BorderRadius smAll     = BorderRadius.all(Radius.circular(sm));
  static const BorderRadius mdAll     = BorderRadius.all(Radius.circular(md));
  static const BorderRadius baseAll   = BorderRadius.all(Radius.circular(base));
  static const BorderRadius lgAll     = BorderRadius.all(Radius.circular(lg));
  static const BorderRadius xlAll     = BorderRadius.all(Radius.circular(xl));
  static const BorderRadius xxlAll    = BorderRadius.all(Radius.circular(xxl));
  static const BorderRadius circleAll = BorderRadius.all(Radius.circular(circle));

  // ---------------------------------------------------------------------------
  // Component defaults
  // ---------------------------------------------------------------------------
  /// Standard card radius.
  static const BorderRadius card        = xlAll;
  /// Compact card radius (list tiles, compact rows).
  static const BorderRadius cardCompact = baseAll;
  /// Dialog radius.
  static const BorderRadius dialog      = xxlAll;
  /// Bottom sheet.
  static const BorderRadius sheet       = BorderRadius.vertical(
    top: Radius.circular(xxl),
  );
  /// Button radius.
  static const BorderRadius button      = BorderRadius.all(Radius.circular(14));
  /// Input field radius.
  static const BorderRadius input       = baseAll;
  /// Chip radius — fully rounded pill.
  static const BorderRadius chip        = circleAll;
  /// Badge / tag radius.
  static const BorderRadius badge       = BorderRadius.all(Radius.circular(6));
  /// Snack bar.
  static const BorderRadius snackBar    = baseAll;
  /// Image / avatar.
  static const BorderRadius image       = mdAll;
  /// Glass container.
  static const BorderRadius glass       = xlAll;
}
