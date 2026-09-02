import 'package:flutter/material.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_motion.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_shadows.dart';
import '../design_system/app_spacing.dart';
import '../design_system/app_typography.dart';

/// Premium text field with animated focus glow, floating label,
/// and refined error/disabled states.
class AppTextField extends StatefulWidget {
  const AppTextField({
    super.key,
    this.controller,
    this.label,
    this.hint,
    this.errorText,
    this.helperText,
    this.prefixIcon,
    this.suffixIcon,
    this.obscureText    = false,
    this.keyboardType,
    this.textInputAction,
    this.onChanged,
    this.onSubmitted,
    this.enabled        = true,
    this.maxLines       = 1,
    this.autofocus      = false,
    this.focusNode,
    this.readOnly       = false,
    this.onTap,
  });

  final TextEditingController? controller;
  final String? label;
  final String? hint;
  final String? errorText;
  final String? helperText;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final bool obscureText;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final bool enabled;
  final int maxLines;
  final bool autofocus;
  final FocusNode? focusNode;
  final bool readOnly;
  final VoidCallback? onTap;

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  late FocusNode _node;
  bool _hasFocus = false;

  @override
  void initState() {
    super.initState();
    _node = widget.focusNode ?? FocusNode();
    _node.addListener(() {
      if (mounted) setState(() => _hasFocus = _node.hasFocus);
    });
  }

  @override
  void dispose() {
    if (widget.focusNode == null) _node.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final hasError = widget.errorText != null;
    final Color borderColor = hasError
        ? AppColors.error
        : _hasFocus
            ? AppColors.borderFocus
            : AppColors.border;

    return AnimatedContainer(
      duration: AppMotion.base,
      curve:    AppMotion.easeOut,
      decoration: BoxDecoration(
        borderRadius: AppRadius.input,
        boxShadow:    _hasFocus && !hasError ? AppShadows.focusGlow : null,
      ),
      child: TextField(
        controller:      widget.controller,
        focusNode:       _node,
        obscureText:     widget.obscureText,
        keyboardType:    widget.keyboardType,
        textInputAction: widget.textInputAction,
        onChanged:       widget.onChanged,
        onSubmitted:     widget.onSubmitted,
        enabled:         widget.enabled,
        maxLines:        widget.maxLines,
        autofocus:       widget.autofocus,
        readOnly:        widget.readOnly,
        onTap:           widget.onTap,
        style:           AppTypography.textTheme.bodyLarge?.copyWith(
          color: widget.enabled ? AppColors.textPrimary : AppColors.textDisabled,
        ),
        decoration: InputDecoration(
          labelText:  widget.label,
          hintText:   widget.hint,
          errorText:  widget.errorText,
          helperText: widget.helperText,
          prefixIcon: widget.prefixIcon != null
              ? Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.sm,
                  ),
                  child: widget.prefixIcon,
                )
              : null,
          prefixIconConstraints: const BoxConstraints(
            minWidth:  AppSpacing.iconMd + AppSpacing.base,
            minHeight: AppSpacing.inputHeight,
          ),
          suffixIcon: widget.suffixIcon,
          filled:     true,
          fillColor:  widget.enabled
              ? (_hasFocus ? AppColors.surface : AppColors.surfaceTinted)
              : AppColors.surfaceSubtle,
          border: OutlineInputBorder(
            borderRadius: AppRadius.input,
            borderSide:   BorderSide(color: borderColor),
          ),
          enabledBorder: const OutlineInputBorder(
            borderRadius: AppRadius.input,
            borderSide:   BorderSide(color: AppColors.border, width: 1),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: AppRadius.input,
            borderSide: BorderSide(
              color: hasError ? AppColors.error : AppColors.borderFocus,
              width: 1.5,
            ),
          ),
          errorBorder: const OutlineInputBorder(
            borderRadius: AppRadius.input,
            borderSide: BorderSide(color: AppColors.error, width: 1),
          ),
          focusedErrorBorder: const OutlineInputBorder(
            borderRadius: AppRadius.input,
            borderSide: BorderSide(color: AppColors.error, width: 1.5),
          ),
          disabledBorder: const OutlineInputBorder(
            borderRadius: AppRadius.input,
            borderSide: BorderSide(color: AppColors.neutral100, width: 1),
          ),
        ),
      ),
    );
  }
}
