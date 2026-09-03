import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';

/// Reusable order summary and bill details card matching Stitch specifications.
class OrderSummaryCard extends StatelessWidget {
  const OrderSummaryCard({
    super.key,
    required this.itemCount,
    required this.subtotal,
    required this.deliveryFee,
    required this.discount,
    required this.totalAmount,
    this.title = 'Order Summary',
  });

  final int itemCount;
  final double subtotal;
  final double deliveryFee;
  final double discount;
  final double totalAmount;
  final String title;

  static final _currencyFormat = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.neutral200),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          // Subtotal
          _buildRow(
            label: 'Subtotal ($itemCount ${itemCount == 1 ? 'item' : 'items'})',
            value: _currencyFormat.format(subtotal),
          ),
          const SizedBox(height: AppSpacing.xs),

          // Delivery Fee
          _buildRow(
            label: 'Delivery Fee',
            value: deliveryFee == 0
                ? 'FREE'
                : _currencyFormat.format(deliveryFee),
            isHighlighted: deliveryFee == 0,
            valueColor: deliveryFee == 0
                ? AppColors.stitchForestGreen
                : AppColors.textPrimary,
          ),

          // Discount / Savings
          if (discount > 0) ...[
            const SizedBox(height: AppSpacing.xs),
            _buildRow(
              label: 'Discount',
              value: '-${_currencyFormat.format(discount)}',
              valueColor: AppColors.stitchForestGreen,
            ),
          ],

          const Padding(
            padding: EdgeInsets.symmetric(vertical: AppSpacing.sm),
            child: Divider(height: 1, color: AppColors.neutral200),
          ),

          // Total
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Total Amount',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                _currencyFormat.format(totalAmount),
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: AppColors.stitchForestGreen,
                ),
              ),
            ],
          ),

          // Savings Pill Banner
          if (discount > 0) ...[
            const SizedBox(height: AppSpacing.sm),
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.sm,
                vertical: 8,
              ),
              decoration: BoxDecoration(
                color: AppColors.successLight,
                borderRadius: BorderRadius.circular(AppRadius.sm),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.check_circle_rounded,
                    size: 16,
                    color: AppColors.stitchForestGreen,
                  ),
                  const SizedBox(width: AppSpacing.xs),
                  Text(
                    'You saved ${_currencyFormat.format(discount)} on this order',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.stitchForestGreen,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildRow({
    required String label,
    required String value,
    Color? valueColor,
    bool isHighlighted = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            color: AppColors.textSecondary,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: isHighlighted ? FontWeight.w700 : FontWeight.w500,
            color: valueColor ?? AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}
