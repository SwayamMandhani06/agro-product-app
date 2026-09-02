import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'app_colors.dart';
import 'app_radius.dart';
import 'app_spacing.dart';
import 'app_typography.dart';

/// Material 3 ThemeData for the Agro Product App.
///
/// Build once, pass to MaterialApp.theme.
/// All tokens flow from the design-system files — no hardcoded values here.
abstract final class AppTheme {
  AppTheme._();

  // ---------------------------------------------------------------------------
  // Public entry point
  // ---------------------------------------------------------------------------
  static ThemeData get light => _buildLight();

  // ---------------------------------------------------------------------------
  // Builder
  // ---------------------------------------------------------------------------
  static ThemeData _buildLight() {
    const colorScheme = ColorScheme(
      brightness: Brightness.light,
      // Primary
      primary:          AppColors.primary,
      onPrimary:        AppColors.onPrimary,
      primaryContainer: AppColors.brand100,
      onPrimaryContainer: AppColors.primaryDark,
      // Secondary
      secondary:        AppColors.accent,
      onSecondary:      Colors.white,
      secondaryContainer: AppColors.amber100,
      onSecondaryContainer: AppColors.accentDark,
      // Tertiary
      tertiary:         AppColors.info,
      onTertiary:       Colors.white,
      tertiaryContainer: AppColors.infoLight,
      onTertiaryContainer: AppColors.info,
      // Error
      error:            AppColors.error,
      onError:          Colors.white,
      errorContainer:   AppColors.errorLight,
      onErrorContainer: AppColors.error,
      // Surface
      surface:          AppColors.surface,
      onSurface:        AppColors.textPrimary,
      surfaceContainerHighest: AppColors.surfaceSubtle,
      surfaceContainerHigh:    AppColors.surfaceMuted,
      surfaceContainer:        AppColors.surfaceTinted,
      surfaceContainerLow:     AppColors.surface,
      surfaceContainerLowest:  AppColors.background,
      // Outline
      outline:          AppColors.neutral300,
      outlineVariant:   AppColors.neutral100,
      // Shadow / scrim
      shadow:           AppColors.brand900,
      scrim:            AppColors.scrim,
      // Inverse
      inverseSurface:   AppColors.surfaceDark,
      onInverseSurface: AppColors.onSurfaceDark,
      inversePrimary:   AppColors.brand300,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme:  colorScheme,
      fontFamily:   'PlusJakartaSans',
      textTheme:    AppTypography.textTheme.apply(
        bodyColor:    AppColors.textPrimary,
        displayColor: AppColors.textPrimary,
      ),
      scaffoldBackgroundColor: AppColors.background,

      // ---------- AppBar ----------
      appBarTheme: AppBarTheme(
        backgroundColor:  AppColors.background,
        foregroundColor:  AppColors.textPrimary,
        elevation:        0,
        scrolledUnderElevation: 1,
        shadowColor:      AppColors.border,
        surfaceTintColor: Colors.transparent,
        titleTextStyle:   AppTypography.textTheme.titleLarge?.copyWith(
          color:      AppColors.textPrimary,
          fontWeight: FontWeight.w700,
        ),
        iconTheme: const IconThemeData(
          color: AppColors.textPrimary,
          size:  AppSpacing.iconMd,
        ),
        systemOverlayStyle: const SystemUiOverlayStyle(
          statusBarColor:            Colors.transparent,
          statusBarIconBrightness:   Brightness.dark,
          statusBarBrightness:       Brightness.light,
          systemNavigationBarColor:  AppColors.surface,
          systemNavigationBarIconBrightness: Brightness.dark,
        ),
      ),

      // ---------- Card ----------
      cardTheme: const CardThemeData(
        color:     AppColors.surface,
        elevation: 0,
        shape:     RoundedRectangleBorder(
          borderRadius: AppRadius.card,
          side: BorderSide(color: AppColors.border, width: 1),
        ),
        margin:    EdgeInsets.zero,
        clipBehavior: Clip.antiAlias,
      ),

      // ---------- Elevated Button ----------
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor:   AppColors.primary,
          foregroundColor:   AppColors.onPrimary,
          elevation:         0,
          shadowColor:       Colors.transparent,
          minimumSize:       const Size.fromHeight(AppSpacing.buttonHeight),
          shape:             const RoundedRectangleBorder(borderRadius: AppRadius.button),
          padding:           const EdgeInsets.symmetric(
            horizontal: AppSpacing.xl,
            vertical:   AppSpacing.base,
          ),
          textStyle: AppTypography.buttonLarge,
        ),
      ),

      // ---------- Outlined Button ----------
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          minimumSize:     const Size.fromHeight(AppSpacing.buttonHeight),
          shape:           const RoundedRectangleBorder(borderRadius: AppRadius.button),
          side:            const BorderSide(color: AppColors.primary, width: 1.5),
          padding:         const EdgeInsets.symmetric(
            horizontal: AppSpacing.xl,
            vertical:   AppSpacing.base,
          ),
          textStyle: AppTypography.buttonLarge,
        ),
      ),

      // ---------- Text Button ----------
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          minimumSize:     const Size(AppSpacing.minTouchTarget, AppSpacing.minTouchTarget),
          shape:           const RoundedRectangleBorder(borderRadius: AppRadius.button),
          textStyle: AppTypography.buttonMedium,
        ),
      ),

      // ---------- Input ----------
      inputDecorationTheme: InputDecorationTheme(
        filled:      true,
        fillColor:   AppColors.surfaceTinted,
        hintStyle:   AppTypography.textTheme.bodyLarge?.copyWith(
          color: AppColors.textTertiary,
        ),
        labelStyle: AppTypography.textTheme.bodyLarge?.copyWith(
          color: AppColors.textSecondary,
        ),
        floatingLabelStyle: WidgetStateTextStyle.resolveWith((states) {
          final focused = states.contains(WidgetState.focused);
          return AppTypography.textTheme.bodySmall!.copyWith(
            color: focused ? AppColors.primary : AppColors.textSecondary,
            fontWeight: FontWeight.w500,
          );
        }),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.base,
          vertical:   AppSpacing.base,
        ),
        border: const OutlineInputBorder(
          borderRadius: AppRadius.input,
          borderSide:   BorderSide(color: AppColors.border, width: 1),
        ),
        enabledBorder: const OutlineInputBorder(
          borderRadius: AppRadius.input,
          borderSide:   BorderSide(color: AppColors.border, width: 1),
        ),
        focusedBorder: const OutlineInputBorder(
          borderRadius: AppRadius.input,
          borderSide:   BorderSide(color: AppColors.primary, width: 1.5),
        ),
        errorBorder: const OutlineInputBorder(
          borderRadius: AppRadius.input,
          borderSide:   BorderSide(color: AppColors.error, width: 1),
        ),
        focusedErrorBorder: const OutlineInputBorder(
          borderRadius: AppRadius.input,
          borderSide:   BorderSide(color: AppColors.error, width: 1.5),
        ),
        disabledBorder: const OutlineInputBorder(
          borderRadius: AppRadius.input,
          borderSide:   BorderSide(color: AppColors.neutral100, width: 1),
        ),
        errorStyle: AppTypography.textTheme.bodySmall?.copyWith(
          color: AppColors.error,
        ),
        constraints: const BoxConstraints(minHeight: AppSpacing.inputHeight),
      ),

      // ---------- Chip ----------
      chipTheme: ChipThemeData(
        backgroundColor:      AppColors.surfaceSubtle,
        selectedColor:        AppColors.brand100,
        labelStyle:           AppTypography.textTheme.labelMedium?.copyWith(
          color: AppColors.textSecondary,
        ),
        shape:                const RoundedRectangleBorder(
          borderRadius: AppRadius.chip,
          side:         BorderSide(color: AppColors.border),
        ),
        padding:              const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical:   AppSpacing.xs,
        ),
        elevation:        0,
        pressElevation:   0,
      ),

      // ---------- Dialog ----------
      dialogTheme: DialogThemeData(
        backgroundColor:  AppColors.surface,
        elevation:        0,
        shape:            const RoundedRectangleBorder(
          borderRadius: AppRadius.dialog,
        ),
        titleTextStyle: AppTypography.textTheme.titleLarge?.copyWith(
          color: AppColors.textPrimary,
        ),
        contentTextStyle: AppTypography.textTheme.bodyMedium?.copyWith(
          color: AppColors.textSecondary,
        ),
      ),

      // ---------- Bottom Sheet ----------
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor:      AppColors.surface,
        surfaceTintColor:     Colors.transparent,
        elevation:            0,
        shape:                RoundedRectangleBorder(
          borderRadius: AppRadius.sheet,
        ),
        modalBackgroundColor: AppColors.surface,
        modalElevation:       0,
      ),

      // ---------- Divider ----------
      dividerTheme: const DividerThemeData(
        color:     AppColors.divider,
        thickness: 1,
        space:     1,
      ),

      // ---------- Icon ----------
      iconTheme: const IconThemeData(
        color: AppColors.textSecondary,
        size:  AppSpacing.iconMd,
      ),
      primaryIconTheme: const IconThemeData(
        color: AppColors.onPrimary,
        size:  AppSpacing.iconMd,
      ),

      // ---------- Progress indicators ----------
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color:            AppColors.primary,
        circularTrackColor: AppColors.brand50,
        linearTrackColor:   AppColors.brand50,
      ),

      // ---------- Switch ----------
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((s) =>
          s.contains(WidgetState.selected) ? AppColors.primary : AppColors.neutral400,
        ),
        trackColor: WidgetStateProperty.resolveWith((s) =>
          s.contains(WidgetState.selected) ? AppColors.brand100 : AppColors.neutral100,
        ),
      ),

      // ---------- Snack bar ----------
      snackBarTheme: SnackBarThemeData(
        backgroundColor:   AppColors.neutral900,
        contentTextStyle:  AppTypography.textTheme.bodyMedium?.copyWith(
          color: AppColors.textInverse,
        ),
        shape:             const RoundedRectangleBorder(
          borderRadius: AppRadius.snackBar,
        ),
        behavior:          SnackBarBehavior.floating,
        elevation:         8,
      ),

      // ---------- Navigation bar ----------
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor:        Colors.transparent,
        indicatorColor:         AppColors.brand50,
        labelTextStyle:         WidgetStateProperty.resolveWith((s) =>
          AppTypography.textTheme.labelSmall!.copyWith(
            color: s.contains(WidgetState.selected)
              ? AppColors.primary
              : AppColors.textTertiary,
            fontWeight: s.contains(WidgetState.selected)
              ? FontWeight.w600
              : FontWeight.w400,
          ),
        ),
        iconTheme: WidgetStateProperty.resolveWith((s) =>
          IconThemeData(
            color: s.contains(WidgetState.selected)
              ? AppColors.primary
              : AppColors.textTertiary,
            size: AppSpacing.iconMd,
          ),
        ),
        elevation: 0,
        height:    64,
      ),

      // ---------- List tile ----------
      listTileTheme: ListTileThemeData(
        contentPadding:  const EdgeInsets.symmetric(
          horizontal: AppSpacing.base,
          vertical:   AppSpacing.sm,
        ),
        minLeadingWidth: 0,
        shape:           const RoundedRectangleBorder(
          borderRadius: AppRadius.baseAll,
        ),
        titleTextStyle:    AppTypography.textTheme.titleSmall?.copyWith(
          color: AppColors.textPrimary,
        ),
        subtitleTextStyle: AppTypography.textTheme.bodySmall?.copyWith(
          color: AppColors.textSecondary,
        ),
      ),

      // ---------- Page transitions ----------
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.android: FadeForwardsPageTransitionsBuilder(),
          TargetPlatform.iOS:     CupertinoPageTransitionsBuilder(),
          TargetPlatform.windows: FadeForwardsPageTransitionsBuilder(),
          TargetPlatform.linux:   FadeForwardsPageTransitionsBuilder(),
          TargetPlatform.macOS:   CupertinoPageTransitionsBuilder(),
        },
      ),
    );
  }
}
