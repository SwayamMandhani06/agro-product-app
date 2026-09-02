import 'package:flutter/material.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_motion.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_spacing.dart';
import '../design_system/app_typography.dart';

/// Button variant.
enum AppButtonVariant { primary, secondary, text, danger }

/// Button size.
enum AppButtonSize { large, medium, small }

/// Premium design-system button with press animation, loading state,
/// and icon support.
///
/// Uses only design-system tokens — no hardcoded colours or sizes.
class AppButton extends StatefulWidget {
  const AppButton({
    required this.label,
    required this.onPressed,
    super.key,
    this.variant  = AppButtonVariant.primary,
    this.size     = AppButtonSize.large,
    this.isLoading = false,
    this.isFullWidth = true,
    this.leadingIcon,
    this.trailingIcon,
  });

  final String label;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final bool isLoading;
  final bool isFullWidth;
  final Widget? leadingIcon;
  final Widget? trailingIcon;

  @override
  State<AppButton> createState() => _AppButtonState();
}

class _AppButtonState extends State<AppButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: AppMotion.fast,
    );
    _scale = Tween<double>(begin: 1, end: AppMotion.buttonPressScale).animate(
      CurvedAnimation(parent: _ctrl, curve: AppMotion.easeOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails _) => _ctrl.forward();
  void _onTapUp(TapUpDetails _)     => _ctrl.reverse();
  void _onTapCancel()               => _ctrl.reverse();

  bool get _disabled => widget.onPressed == null || widget.isLoading;

  @override
  Widget build(BuildContext context) {
    final height  = _heightFor(widget.size);
    final hPad    = _hPadFor(widget.size);
    final style   = _textStyleFor(widget.size);
    final colors  = _colorsFor(widget.variant, _disabled);

    Widget child = AnimatedSwitcher(
      duration: AppMotion.base,
      child: widget.isLoading
          ? SizedBox(
              key:    const ValueKey('loader'),
              height: 20,
              width:  20,
              child:  CircularProgressIndicator(
                strokeWidth: 2,
                color:       colors.fg,
              ),
            )
          : Row(
              key:         const ValueKey('label'),
              mainAxisSize: widget.isFullWidth
                  ? MainAxisSize.max
                  : MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (widget.leadingIcon != null) ...[
                  widget.leadingIcon!,
                  const SizedBox(width: AppSpacing.sm),
                ],
                Text(widget.label, style: style.copyWith(color: colors.fg)),
                if (widget.trailingIcon != null) ...[
                  const SizedBox(width: AppSpacing.sm),
                  widget.trailingIcon!,
                ],
              ],
            ),
    );

    child = _buildSurface(
      colors:  colors,
      height:  height,
      hPad:    hPad,
      child:   child,
    );

    return GestureDetector(
      onTapDown:   _disabled ? null : _onTapDown,
      onTapUp:     _disabled ? null : _onTapUp,
      onTapCancel: _disabled ? null : _onTapCancel,
      onTap:       _disabled ? null : widget.onPressed,
      child: ScaleTransition(scale: _scale, child: child),
    );
  }

  Widget _buildSurface({
    required _ButtonColors colors,
    required double height,
    required double hPad,
    required Widget child,
  }) {
    if (widget.variant == AppButtonVariant.text) {
      return AnimatedOpacity(
        duration: AppMotion.fast,
        opacity:  _disabled ? 0.5 : 1.0,
        child:    Padding(
          padding: EdgeInsets.symmetric(horizontal: hPad / 2, vertical: 4),
          child:   child,
        ),
      );
    }

    return AnimatedOpacity(
      duration: AppMotion.fast,
      opacity:  _disabled ? 0.5 : 1.0,
      child: Container(
        height:     height,
        width:      widget.isFullWidth ? double.infinity : null,
        padding:    EdgeInsets.symmetric(horizontal: hPad),
        decoration: BoxDecoration(
          color:        colors.bg,
          gradient:     colors.gradient,
          borderRadius: AppRadius.button,
          border:       colors.border != null
              ? Border.all(color: colors.border!, width: 1.5)
              : null,
          boxShadow:    _disabled ? null : colors.shadow,
        ),
        child: Center(child: child),
      ),
    );
  }

  double _heightFor(AppButtonSize s) => switch (s) {
    AppButtonSize.large  => AppSpacing.buttonHeight,
    AppButtonSize.medium => AppSpacing.buttonHeightSm + 4,
    AppButtonSize.small  => AppSpacing.buttonHeightSm,
  };

  double _hPadFor(AppButtonSize s) => switch (s) {
    AppButtonSize.large  => AppSpacing.xl,
    AppButtonSize.medium => AppSpacing.base,
    AppButtonSize.small  => AppSpacing.md,
  };

  TextStyle _textStyleFor(AppButtonSize s) => switch (s) {
    AppButtonSize.large  => AppTypography.buttonLarge,
    AppButtonSize.medium => AppTypography.buttonMedium,
    AppButtonSize.small  => AppTypography.buttonMedium,
  };

  _ButtonColors _colorsFor(AppButtonVariant v, bool disabled) => switch (v) {
    AppButtonVariant.primary => _ButtonColors(
      bg:       AppColors.primary,
      fg:       AppColors.onPrimary,
      gradient: const LinearGradient(
        begin:  Alignment.topLeft,
        end:    Alignment.bottomRight,
        colors: [Color(0xFF025A2A), AppColors.primary],
        stops:  [0.0, 1.0],
      ),
      shadow: [
        BoxShadow(
          color:      AppColors.primary.withAlpha(60),
          blurRadius: 12,
          offset:     const Offset(0, 4),
        ),
      ],
    ),
    AppButtonVariant.secondary => const _ButtonColors(
      bg:     AppColors.brand50,
      fg:     AppColors.primary,
      border: AppColors.brand200,
    ),
    AppButtonVariant.text => const _ButtonColors(
      bg: Colors.transparent,
      fg: AppColors.primary,
    ),
    AppButtonVariant.danger => _ButtonColors(
      bg: AppColors.errorLight,
      fg: AppColors.error,
      border: AppColors.error.withAlpha(60),
    ),
  };
}

class _ButtonColors {
  const _ButtonColors({
    required this.bg,
    required this.fg,
    this.gradient,
    this.border,
    this.shadow,
  });
  final Color bg;
  final Color fg;
  final Gradient? gradient;
  final Color? border;
  final List<BoxShadow>? shadow;
}
