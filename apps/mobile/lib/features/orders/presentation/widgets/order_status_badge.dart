import 'package:flutter/material.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../cart_checkout/domain/order.dart';

/// Reusable status badge chip matching Google Stitch AgriTrade design.
class OrderStatusBadge extends StatelessWidget {
  const OrderStatusBadge({
    super.key,
    required this.status,
    this.compact = false,
  });

  final OrderStatus status;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final (bgColor, textColor, icon) = switch (status) {
      OrderStatus.delivered => (
          AppColors.successLight,
          AppColors.stitchForestGreen,
          Icons.check_circle_rounded,
        ),
      OrderStatus.outForDelivery => (
          AppColors.warningLight,
          AppColors.stitchAmber,
          Icons.local_shipping_rounded,
        ),
      OrderStatus.processing => (
          AppColors.neutral100,
          AppColors.textSecondary,
          Icons.inventory_2_outlined,
        ),
      OrderStatus.shipped => (
          AppColors.infoLight,
          AppColors.info,
          Icons.local_shipping_outlined,
        ),
      OrderStatus.confirmed || OrderStatus.placed => (
          AppColors.brand100,
          AppColors.stitchForestGreen,
          Icons.check_circle_outline_rounded,
        ),
      OrderStatus.cancelled => (
          AppColors.errorLight,
          AppColors.error,
          Icons.cancel_rounded,
        ),
    };

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: compact ? AppSpacing.xs : AppSpacing.sm,
        vertical: compact ? 2 : 4,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(AppRadius.full),
        border: Border.all(
          color: textColor.withValues(alpha: 0.2),
          width: 0.8,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: compact ? 12 : 14,
            color: textColor,
          ),
          const SizedBox(width: 4),
          Text(
            status.displayName,
            style: TextStyle(
              fontSize: compact ? 11 : 12,
              fontWeight: FontWeight.w700,
              color: textColor,
              letterSpacing: 0.1,
            ),
          ),
        ],
      ),
    );
  }
}
