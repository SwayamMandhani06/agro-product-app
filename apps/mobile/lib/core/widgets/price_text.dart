import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_spacing.dart';

enum PriceTextSize {
  small,
  medium,
  large,
}

/// Formatted Indian Rupee currency display widget with optional discount
/// strikethrough, unit denominator, and percentage badge.
class PriceText extends StatelessWidget {
  const PriceText({
    super.key,
    required this.price,
    this.originalPrice,
    this.unit,
    this.size = PriceTextSize.medium,
    this.color,
    this.showDiscountBadge = false,
  });

  final double price;
  final double? originalPrice;
  final String? unit;
  final PriceTextSize size;
  final Color? color;
  final bool showDiscountBadge;

  static final _formatter = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  int? get _discountPercent {
    if (originalPrice == null || originalPrice! <= price) return null;
    return (((originalPrice! - price) / originalPrice!) * 100).round();
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = color ?? AppColors.stitchForestGreen;
    final discount = _discountPercent;

    final (priceStyle, strikethroughStyle, unitStyle) = switch (size) {
      PriceTextSize.small => (
          TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: primaryColor,
            height: 1.2,
          ),
          const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w400,
            color: AppColors.textTertiary,
            decoration: TextDecoration.lineThrough,
            height: 1.2,
          ),
          const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w500,
            color: AppColors.textSecondary,
          ),
        ),
      PriceTextSize.medium => (
          TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: primaryColor,
            height: 1.25,
          ),
          const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w400,
            color: AppColors.textTertiary,
            decoration: TextDecoration.lineThrough,
            height: 1.25,
          ),
          const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: AppColors.textSecondary,
          ),
        ),
      PriceTextSize.large => (
          TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: primaryColor,
            height: 1.2,
          ),
          const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w400,
            color: AppColors.textTertiary,
            decoration: TextDecoration.lineThrough,
            height: 1.2,
          ),
          const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: AppColors.textSecondary,
          ),
        ),
    };

    return Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: AppSpacing.xs,
      runSpacing: 2,
      children: [
        Text(_formatter.format(price), style: priceStyle),
        if (unit != null)
          Text('/ $unit', style: unitStyle),
        if (originalPrice != null && originalPrice! > price)
          Text(_formatter.format(originalPrice), style: strikethroughStyle),
        if (showDiscountBadge && discount != null && discount > 0)
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.xs,
              vertical: 2,
            ),
            decoration: BoxDecoration(
              color: AppColors.successLight,
              borderRadius: BorderRadius.circular(AppRadius.xs),
            ),
            child: Text(
              '-$discount%',
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: AppColors.success,
              ),
            ),
          ),
      ],
    );
  }
}
