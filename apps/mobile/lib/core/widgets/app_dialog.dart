import 'package:flutter/material.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_motion.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_shadows.dart';
import '../design_system/app_spacing.dart';
import '../design_system/app_typography.dart';
import 'app_button.dart';

/// Displays a premium modal dialog with background blur, slide+fade entrance,
/// and clear action hierarchy.
Future<T?> showAppDialog<T>({
  required BuildContext context,
  required Widget Function(BuildContext) builder,
  bool barrierDismissible = true,
}) {
  return showGeneralDialog<T>(
    context: context,
    barrierDismissible: barrierDismissible,
    barrierLabel:       'Dismiss',
    barrierColor:       AppColors.scrim,
    transitionDuration: AppMotion.normal,
    pageBuilder:        (ctx, _, __) => builder(ctx),
    transitionBuilder:  (ctx, anim, _, child) {
      final curved = CurvedAnimation(
        parent: anim,
        curve:  AppMotion.emphasized,
      );
      return FadeTransition(
        opacity: curved,
        child:   ScaleTransition(
          scale: Tween<double>(begin: 0.92, end: 1).animate(curved),
          child: child,
        ),
      );
    },
  );
}

/// The dialog surface widget.
///
/// Use via [showAppDialog] or directly in tests.
class AppDialog extends StatelessWidget {
  const AppDialog({
    required this.title,
    required this.content,
    super.key,
    this.primaryAction,
    this.secondaryAction,
    this.icon,
    this.iconColor,
  });

  final String title;
  final Widget content;
  final AppDialogAction? primaryAction;
  final AppDialogAction? secondaryAction;
  final IconData? icon;
  final Color? iconColor;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor:  AppColors.surface,
      surfaceTintColor: Colors.transparent,
      elevation:        0,
      shape:            const RoundedRectangleBorder(
        borderRadius: AppRadius.dialog,
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 360),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.xl),
          child:   Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (icon != null) ...[
                Container(
                  width:  48,
                  height: 48,
                  decoration: BoxDecoration(
                    color:        (iconColor ?? AppColors.primary).withAlpha(20),
                    borderRadius: AppRadius.mdAll,
                  ),
                  child: Icon(
                    icon,
                    color: iconColor ?? AppColors.primary,
                    size:  AppSpacing.iconLg,
                  ),
                ),
                const SizedBox(height: AppSpacing.base),
              ],
              Text(
                title,
                style: AppTypography.textTheme.titleLarge?.copyWith(
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              DefaultTextStyle(
                style: AppTypography.textTheme.bodyMedium!.copyWith(
                  color: AppColors.textSecondary,
                  height: 1.6,
                ),
                child: content,
              ),
              if (primaryAction != null || secondaryAction != null) ...[
                const SizedBox(height: AppSpacing.xl),
                Row(
                  children: [
                    if (secondaryAction != null) ...[
                      Expanded(
                        child: AppButton(
                          label:     secondaryAction!.label,
                          onPressed: secondaryAction!.onPressed,
                          variant:   AppButtonVariant.secondary,
                          size:      AppButtonSize.medium,
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                    ],
                    if (primaryAction != null)
                      Expanded(
                        child: AppButton(
                          label:     primaryAction!.label,
                          onPressed: primaryAction!.onPressed,
                          variant:   primaryAction!.isDanger
                              ? AppButtonVariant.danger
                              : AppButtonVariant.primary,
                          size:      AppButtonSize.medium,
                        ),
                      ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class AppDialogAction {
  const AppDialogAction({
    required this.label,
    required this.onPressed,
    this.isDanger = false,
  });
  final String label;
  final VoidCallback? onPressed;
  final bool isDanger;
}

/// Convenience factory helpers.
extension AppDialogHelpers on AppDialog {
  static AppDialog confirm({
    required String title,
    required Widget content,
    required VoidCallback onConfirm,
    required BuildContext context,
    String confirmLabel    = 'Confirm',
    String cancelLabel     = 'Cancel',
    bool isDanger          = false,
    IconData? icon,
    Color? iconColor,
  }) =>
      AppDialog(
        title:   title,
        content: content,
        icon:    icon,
        iconColor: iconColor,
        primaryAction: AppDialogAction(
          label:     confirmLabel,
          onPressed: onConfirm,
          isDanger:  isDanger,
        ),
        secondaryAction: AppDialogAction(
          label:     cancelLabel,
          onPressed: () => Navigator.of(context).pop(),
        ),
      );
}

/// Premium bottom sheet with drag handle, rounded top corners, and safe area.
Future<T?> showAppSheet<T>({
  required BuildContext context,
  required Widget Function(BuildContext) builder,
  bool isDismissible = true,
  bool isScrollControlled = true,
  Color? barrierColor,
}) =>
    showModalBottomSheet<T>(
      context:             context,
      builder:             builder,
      isDismissible:       isDismissible,
      isScrollControlled:  isScrollControlled,
      backgroundColor:     AppColors.surface,
      barrierColor:        barrierColor ?? AppColors.scrim,
      shape:               const RoundedRectangleBorder(
        borderRadius: AppRadius.sheet,
      ),
      clipBehavior:        Clip.antiAlias,
      useSafeArea:         true,
    );

/// Standard drag handle for bottom sheets.
class AppSheetHandle extends StatelessWidget {
  const AppSheetHandle({super.key});

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
          child: Container(
            width:  40,
            height: 4,
            decoration: const BoxDecoration(
              color:        AppColors.neutral200,
              borderRadius: AppRadius.circleAll,
            ),
          ),
        ),
      );
}

/// Floating snack bar helper.
ScaffoldFeatureController<SnackBar, SnackBarClosedReason> showAppSnackBar(
  BuildContext context, {
  required String message,
  String? actionLabel,
  VoidCallback? onAction,
  bool isError  = false,
  Duration duration = const Duration(seconds: 3),
}) {
  final messenger = ScaffoldMessenger.of(context);
  return messenger.showSnackBar(
    SnackBar(
      content: Text(message),
      duration: duration,
      backgroundColor: isError ? AppColors.error : AppColors.neutral900,
      behavior:        SnackBarBehavior.floating,
      margin:          const EdgeInsets.all(AppSpacing.base),
      shape:           const RoundedRectangleBorder(
        borderRadius: AppRadius.snackBar,
      ),
      elevation: 6,
      action: actionLabel != null
          ? SnackBarAction(
              label:     actionLabel,
              onPressed: onAction ?? () {},
              textColor: AppColors.accent,
            )
          : null,
    ),
  );
}

/// Overlay container for dialog sections with rounded corners and shadows.
class AppOverlayCard extends StatelessWidget {
  const AppOverlayCard({required this.child, super.key, this.padding});

  final Widget child;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) => DecoratedBox(
        decoration: const BoxDecoration(
          color:        AppColors.surface,
          borderRadius: AppRadius.xlAll,
          boxShadow:    AppShadows.overlay,
        ),
        child: Padding(
          padding: padding ?? const EdgeInsets.all(AppSpacing.xl),
          child:   child,
        ),
      );
}
