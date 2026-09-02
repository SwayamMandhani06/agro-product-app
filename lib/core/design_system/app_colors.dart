import 'package:flutter/material.dart';

/// Design token — all colour values for the Agro Product App.
///
/// DO NOT use raw hex literals elsewhere. Always reference this class.
abstract final class AppColors {
  // ---------------------------------------------------------------------------
  // Brand — Deep Forest
  // ---------------------------------------------------------------------------
  static const Color brand900 = Color(0xFF00160C);
  static const Color brand800 = Color(0xFF012D1D);
  static const Color brand700 = Color(0xFF01421E); // primary interactive
  static const Color brand600 = Color(0xFF025A2A);
  static const Color brand500 = Color(0xFF027A38);
  static const Color brand400 = Color(0xFF2E9E5E);
  static const Color brand300 = Color(0xFF5FBA86);
  static const Color brand200 = Color(0xFF9FD4B0);
  static const Color brand100 = Color(0xFFCEEAD9);
  static const Color brand50  = Color(0xFFEAF6EF);

  // Convenience aliases
  static const Color primary        = brand700;
  static const Color primaryDark    = brand800;
  static const Color primaryDeep    = brand900;
  static const Color primaryLight   = brand50;
  static const Color onPrimary      = Color(0xFFFFFFFF);

  // ---------------------------------------------------------------------------
  // Accent — Warm Amber
  // ---------------------------------------------------------------------------
  static const Color amber600 = Color(0xFF914D00);
  static const Color amber500 = Color(0xFFB86200);
  static const Color amber400 = Color(0xFFFE932C);
  static const Color amber300 = Color(0xFFFFB46A);
  static const Color amber100 = Color(0xFFFFDEB8);
  static const Color amber50  = Color(0xFFFFF3E0);

  static const Color accent     = amber400;
  static const Color accentDark = amber600;

  // ---------------------------------------------------------------------------
  // Neutral — Warm Bone
  // ---------------------------------------------------------------------------
  static const Color neutral900 = Color(0xFF1A1510);
  static const Color neutral800 = Color(0xFF2D2620);
  static const Color neutral700 = Color(0xFF463D35);
  static const Color neutral600 = Color(0xFF60554C);
  static const Color neutral500 = Color(0xFF7A6E63);
  static const Color neutral400 = Color(0xFF9E9289);
  static const Color neutral300 = Color(0xFFC2B9B2);
  static const Color neutral200 = Color(0xFFDDD6D0);
  static const Color neutral100 = Color(0xFFEEE7E3);
  static const Color neutral50  = Color(0xFFF4ECE8);

  // ---------------------------------------------------------------------------
  // Surface / Background
  // ---------------------------------------------------------------------------
  static const Color background     = Color(0xFFFFF8F5); // warm bone
  static const Color surface        = Color(0xFFFFFFFF);
  static const Color surfaceTinted  = Color(0xFFFAF2EE);
  static const Color surfaceMuted   = Color(0xFFF4ECE8);
  static const Color surfaceSubtle  = Color(0xFFEEE7E3);

  // Dark premium surface (for showcases / dark cards)
  static const Color surfaceDark        = Color(0xFF012D1D);
  static const Color surfaceDarkElevated = Color(0xFF01421E);
  static const Color onSurfaceDark      = Color(0xFFEAF6EF);

  // Glass
  static const Color glassSurface = Color(0xCCFFFFFF);   // 80% white
  static const Color glassBorder  = Color(0x33FFFFFF);   // 20% white
  static const Color glassDark    = Color(0xCC012D1D);   // 80% brand900

  // ---------------------------------------------------------------------------
  // Semantic
  // ---------------------------------------------------------------------------
  static const Color success      = Color(0xFF1A7A4A);
  static const Color successLight = Color(0xFFD4EEE0);
  static const Color warning      = Color(0xFFC17900);
  static const Color warningLight = Color(0xFFFFF0C2);
  static const Color error        = Color(0xFFB72B2B);
  static const Color errorLight   = Color(0xFFFFE8E8);
  static const Color info         = Color(0xFF1B6BAA);
  static const Color infoLight    = Color(0xFFDCEEFB);

  // ---------------------------------------------------------------------------
  // Text
  // ---------------------------------------------------------------------------
  static const Color textPrimary   = neutral900;
  static const Color textSecondary = neutral600;
  static const Color textTertiary  = neutral400;
  static const Color textDisabled  = neutral300;
  static const Color textInverse   = Color(0xFFFFFFFF);
  static const Color textOnBrand   = Color(0xFFFFFFFF);

  // ---------------------------------------------------------------------------
  // Border / Divider
  // ---------------------------------------------------------------------------
  static const Color border        = Color(0x1A012D1D); // brand900 @ 10%
  static const Color borderSubtle  = Color(0x0D012D1D); // brand900 @ 5%
  static const Color borderFocus   = brand700;
  static const Color divider       = neutral100;

  // ---------------------------------------------------------------------------
  // Overlay
  // ---------------------------------------------------------------------------
  static const Color overlay       = Color(0x80012D1D); // 50% dark
  static const Color overlayLight  = Color(0x33012D1D); // 20% dark
  static const Color scrim         = Color(0x99000000); // dialog scrim

  // ---------------------------------------------------------------------------
  // Shimmer
  // ---------------------------------------------------------------------------
  static const Color shimmerBase      = Color(0xFFF0EAE6);
  static const Color shimmerHighlight = Color(0xFFFFF8F5);
}
