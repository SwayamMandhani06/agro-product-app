import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../cart_checkout/domain/order.dart';
import '../../domain/payment_transaction.dart';

/// Tax invoice and transaction receipt bottom sheet matching AgriTrade visual standards.
class ReceiptSheet extends StatelessWidget {
  const ReceiptSheet({
    super.key,
    required this.order,
    this.transaction,
  });

  final Order order;
  final PaymentTransaction? transaction;

  static void show(BuildContext context, {required Order order, PaymentTransaction? transaction}) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => ReceiptSheet(order: order, transaction: transaction),
    );
  }

  static final _currencyFormat = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  static final _dateFormat = DateFormat('dd MMM yyyy, hh:mm a');

  @override
  Widget build(BuildContext context) {
    final isDemo = transaction?.provider == PaymentProvider.demo ||
        order.paymentMethod.toLowerCase().contains('demo');
    final isTest = transaction?.provider == PaymentProvider.razorpayTest ||
        (!isDemo && order.paymentMethod.toLowerCase() != 'cash on delivery');

    return Material(
      color: AppColors.surface,
      borderRadius: const BorderRadius.vertical(
        top: Radius.circular(AppRadius.xxl),
      ),
      clipBehavior: Clip.antiAlias,
      child: SafeArea(
        top: false,
        child: Container(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.88,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // 1. Drag Handle & Top Bar
              Padding(
                padding: const EdgeInsets.only(top: AppSpacing.sm, bottom: AppSpacing.xs),
                child: Center(
                  child: Container(
                    width: 36,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppColors.neutral300,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Tax Invoice / Receipt',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, size: 20),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1, color: AppColors.neutral200),

              // 2. Receipt Body
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  children: [
                    // Sandbox Disclosure Banner
                    if (isDemo || isTest) ...[
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.sm,
                          vertical: AppSpacing.xs,
                        ),
                        decoration: BoxDecoration(
                          color: isDemo
                              ? const Color(0xFFEFF6FF)
                              : const Color(0xFFF3E8FF),
                          borderRadius: BorderRadius.circular(AppRadius.sm),
                          border: Border.all(
                            color: isDemo
                                ? const Color(0xFF93C5FD)
                                : const Color(0xFFD8B4FE),
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.verified_user_outlined,
                              size: 16,
                              color: isDemo
                                  ? const Color(0xFF1E40AF)
                                  : const Color(0xFF6B21A8),
                            ),
                            const SizedBox(width: AppSpacing.xs),
                            Expanded(
                              child: Text(
                                isDemo
                                    ? 'DEMO PAYMENT · EDUCATIONAL SANDBOX (ZERO REAL CHARGES)'
                                    : 'TEST PAYMENT · RAZORPAY TEST MODE ENVIRONMENT',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: 0.5,
                                  color: isDemo
                                      ? const Color(0xFF1E40AF)
                                      : const Color(0xFF6B21A8),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),
                    ],

                    // AgriTrade Header
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: AppColors.stitchForestGreen,
                            borderRadius: BorderRadius.circular(AppRadius.md),
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.spa_rounded,
                              color: Colors.white,
                              size: 24,
                            ),
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'AgriTrade Marketplace',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              Text(
                                'GSTIN: 27AABCA1234F1Z5 · Krishi Bhavan Pune',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: AppColors.textTertiary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: (transaction?.status == PaymentStatus.paid ||
                                    order.paymentMethod.toLowerCase() != 'cash on delivery')
                                ? const Color(0xFFDCFCE7)
                                : const Color(0xFFFEF9C3),
                            borderRadius: BorderRadius.circular(AppRadius.xs),
                          ),
                          child: Text(
                            (transaction?.status == PaymentStatus.paid ||
                                    order.paymentMethod.toLowerCase() != 'cash on delivery')
                                ? 'PAID'
                                : 'PENDING (COD)',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: (transaction?.status == PaymentStatus.paid ||
                                      order.paymentMethod.toLowerCase() != 'cash on delivery')
                                  ? const Color(0xFF166534)
                                  : const Color(0xFF854D0E),
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: AppSpacing.md),
                    const Divider(height: 1, color: AppColors.neutral200),
                    const SizedBox(height: AppSpacing.md),

                    // Order & Customer Metadata
                    _buildMetaRow('Invoice No.', 'INV-${order.id.toUpperCase()}'),
                    const SizedBox(height: 6),
                    _buildMetaRow('Date', _dateFormat.format(order.createdAt)),
                    const SizedBox(height: 6),
                    _buildMetaRow('Customer', order.address.recipientName),
                    const SizedBox(height: 6),
                    _buildMetaRow('Address', order.address.formattedAddress),
                    const SizedBox(height: 6),
                    _buildMetaRow('Payment Method', order.paymentMethod),
                    if (transaction?.providerPaymentId != null) ...[
                      const SizedBox(height: 6),
                      _buildMetaRow('Transaction Ref', transaction!.providerPaymentId!),
                    ],

                    const SizedBox(height: AppSpacing.md),
                    const Divider(height: 1, color: AppColors.neutral200),
                    const SizedBox(height: AppSpacing.md),

                    // Itemized List
                    const Text(
                      'Billed Consignment Items',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),

                    ...order.items.map((item) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: AppSpacing.xs),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.product.title,
                                    style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.textPrimary,
                                    ),
                                  ),
                                  Text(
                                    'Qty: ${item.quantity} × ${_currencyFormat.format(item.product.price)}',
                                    style: const TextStyle(
                                      fontSize: 11,
                                      color: AppColors.textTertiary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Text(
                              _currencyFormat.format(item.totalPrice),
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                      );
                    }),

                    const SizedBox(height: AppSpacing.md),
                    const Divider(height: 1, color: AppColors.neutral200),
                    const SizedBox(height: AppSpacing.sm),

                    // Financial Breakdown
                    _buildFinancialRow('Subtotal', _currencyFormat.format(order.subtotal)),
                    if (order.discount > 0) ...[
                      const SizedBox(height: 4),
                      _buildFinancialRow(
                        'Discount Applied',
                        '-${_currencyFormat.format(order.discount)}',
                        isDiscount: true,
                      ),
                    ],
                    const SizedBox(height: 4),
                    _buildFinancialRow(
                      'Estimated GST (5%)',
                      _currencyFormat.format((order.subtotal * 0.05).round()),
                    ),
                    const SizedBox(height: 4),
                    _buildFinancialRow(
                      'Delivery Logistics',
                      order.deliveryFee == 0 ? 'FREE' : _currencyFormat.format(order.deliveryFee),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    const Divider(height: 1, color: AppColors.neutral200),
                    const SizedBox(height: AppSpacing.sm),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Total Amount',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        Text(
                          _currencyFormat.format(order.totalAmount),
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: AppColors.stitchForestGreen,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // 3. Bottom Close Action
              Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: AppColors.neutral300),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.md),
                      ),
                    ),
                    child: const Text(
                      'Done',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetaRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 100,
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: AppColors.textTertiary,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFinancialRow(String label, String value, {bool isDiscount = false}) {
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
            fontWeight: FontWeight.w600,
            color: isDiscount ? AppColors.stitchForestGreen : AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}
