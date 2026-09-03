import 'package:flutter/material.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_motion.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_spacing.dart';

/// Shimmer skeleton placeholder for loading states.
///
/// Uses warm-neutral colours consistent with the app background.
class AppSkeleton extends StatefulWidget {
  const AppSkeleton({
    super.key,
    this.width,
    this.height  = 16,
    this.radius,
    this.circle  = false,
  });

  final double? width;
  final double height;
  final BorderRadius? radius;

  /// If true, renders a circular avatar placeholder.
  final bool circle;

  @override
  State<AppSkeleton> createState() => _AppSkeletonState();
}

class _AppSkeletonState extends State<AppSkeleton>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _shimmer;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync:    this,
      duration: AppMotion.shimmerCycle,
    )..repeat();
    _shimmer = Tween<double>(begin: -1.5, end: 2.5).animate(
      CurvedAnimation(parent: _ctrl, curve: AppMotion.linear),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final radius = widget.circle
        ? AppRadius.circleAll
        : (widget.radius ?? AppRadius.smAll);

    final size = widget.circle
        ? widget.height // circle: use height as diameter
        : null;

    return AnimatedBuilder(
      animation: _shimmer,
      builder: (_, __) => Container(
        width:  widget.circle ? size : widget.width,
        height: widget.height,
        decoration: BoxDecoration(
          borderRadius: radius,
          gradient: LinearGradient(
            begin:  Alignment.centerLeft,
            end:    Alignment.centerRight,
            stops: const [0.0, 0.5, 1.0],
            colors: [
              AppColors.shimmerBase,
              AppColors.shimmerHighlight,
              AppColors.shimmerBase,
            ],
            transform: _GradientTranslation(_shimmer.value),
          ),
        ),
      ),
    );
  }
}

class _GradientTranslation implements GradientTransform {
  const _GradientTranslation(this.t);
  final double t;

  @override
  Matrix4? transform(Rect bounds, {TextDirection? textDirection}) =>
      Matrix4.translationValues(bounds.width * t, 0, 0);
}

/// A skeleton row (line) with optional width.
class AppSkeletonLine extends StatelessWidget {
  const AppSkeletonLine({
    super.key,
    this.width,
    this.height = 14,
  });

  final double? width;
  final double height;

  @override
  Widget build(BuildContext context) =>
      AppSkeleton(width: width, height: height, radius: AppRadius.xsAll);
}

/// A paragraph of skeleton lines.
class AppSkeletonParagraph extends StatelessWidget {
  const AppSkeletonParagraph({
    super.key,
    this.lines = 3,
    this.lineHeight = 14,
    this.spacing = AppSpacing.sm,
  });

  final int lines;
  final double lineHeight;
  final double spacing;

  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: List.generate(lines * 2 - 1, (i) {
          if (i.isOdd) return SizedBox(height: spacing);
          final lineIndex = i ~/ 2;
          // Last line slightly shorter for visual realism.
          final width = lineIndex == lines - 1 ? 0.65 : null;
          return FractionallySizedBox(
            widthFactor: width,
            child:       AppSkeletonLine(height: lineHeight),
          );
        }),
      );
}

/// Elegant minimal spinner.
class AppSpinner extends StatelessWidget {
  const AppSpinner({
    super.key,
    this.size  = 24,
    this.color,
    this.strokeWidth = 2.5,
  });

  final double size;
  final Color? color;
  final double strokeWidth;

  @override
  Widget build(BuildContext context) => SizedBox(
        width:  size,
        height: size,
        child:  CircularProgressIndicator(
          strokeWidth:  strokeWidth,
          color:        color ?? AppColors.primary,
          strokeCap:    StrokeCap.round,
        ),
      );
}

/// Full-screen loading overlay.
class AppLoadingOverlay extends StatelessWidget {
  const AppLoadingOverlay({super.key, this.message});

  final String? message;

  @override
  Widget build(BuildContext context) => ColoredBox(
        color: AppColors.background.withAlpha(220),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const AppSpinner(size: 36),
              if (message != null) ...[
                const SizedBox(height: AppSpacing.base),
                Text(
                  message!,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ],
          ),
        ),
      );
}

/// Skeleton placeholder for product cards.
class ProductCardSkeleton extends StatelessWidget {
  const ProductCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 170,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppRadius.card,
        border: Border.all(color: AppColors.neutral100),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppSkeleton(
            height: 130,
            radius: BorderRadius.vertical(top: Radius.circular(10)),
          ),
          Padding(
            padding: EdgeInsets.all(AppSpacing.sm),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppSkeleton(width: 60, height: 10),
                SizedBox(height: 6),
                AppSkeleton(width: 130, height: 14),
                SizedBox(height: 10),
                AppSkeleton(width: 80, height: 16),
                SizedBox(height: 10),
                AppSkeleton(
                  width: double.infinity,
                  height: 32,
                  radius: AppRadius.smAll,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Skeleton placeholder for dashboard sections.
class DashboardSkeleton extends StatelessWidget {
  const DashboardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        AppSkeleton(
          width: double.infinity,
          height: 140,
          radius: BorderRadius.all(Radius.circular(12)),
        ),
        SizedBox(height: AppSpacing.base),
        AppSkeleton(
          width: double.infinity,
          height: 90,
          radius: BorderRadius.all(Radius.circular(12)),
        ),
        SizedBox(height: AppSpacing.base),
        Row(
          children: [
            Expanded(
              child: AppSkeleton(
                height: 70,
                radius: BorderRadius.all(Radius.circular(10)),
              ),
            ),
            SizedBox(width: AppSpacing.sm),
            Expanded(
              child: AppSkeleton(
                height: 70,
                radius: BorderRadius.all(Radius.circular(10)),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

