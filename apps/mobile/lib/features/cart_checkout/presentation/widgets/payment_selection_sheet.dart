import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../payments/domain/payment_transaction.dart';
import '../../../payments/presentation/providers/payment_providers.dart';
import '../providers/cart_providers.dart';

/// Modal sheet for choosing payment method matching Stitch AgriTrade screens.
class PaymentSelectionSheet extends ConsumerWidget {
  const PaymentSelectionSheet({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => const PaymentSelectionSheet(),
    );
  }

  static const _methods = [
    (
      id: 'Cash on Delivery',
      enumMethod: PaymentMethod.cod,
      title: 'Cash on Delivery',
      subtitle: 'Pay with cash or UPI upon consignment arrival',
      badge: 'COD',
      icon: Icons.payments_outlined,
    ),
    (
      id: 'UPI',
      enumMethod: PaymentMethod.upi,
      title: 'UPI / QR Payment',
      subtitle: 'Google Pay, PhonePe, Paytm, BHIM (Test Mode)',
      badge: 'TEST',
      icon: Icons.qr_code_2_rounded,
    ),
    (
      id: 'Credit / Debit Card',
      enumMethod: PaymentMethod.card,
      title: 'Credit / Debit Card',
      subtitle: 'Visa, Mastercard, RuPay (Razorpay Test Mode)',
      badge: 'TEST',
      icon: Icons.credit_card_rounded,
    ),
    (
      id: 'Demo Payment',
      enumMethod: PaymentMethod.demo,
      title: 'Demo Payment Sandbox',
      subtitle: 'Simulated educational transaction flow (zero charges)',
      badge: 'DEMO',
      icon: Icons.science_outlined,
    ),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedMethod = ref.watch(selectedPaymentMethodProvider);

    return Material(
      color: AppColors.surface,
      borderRadius: const BorderRadius.vertical(
        top: Radius.circular(AppRadius.xxl),
      ),
      clipBehavior: Clip.antiAlias,
      child: SafeArea(
        top: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(
            AppSpacing.md,
            AppSpacing.sm,
            AppSpacing.md,
            AppSpacing.md,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Drag Handle
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.neutral300,
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.sm),

              // Title
              const Row(
                children: [
                  Icon(
                    Icons.account_balance_wallet_outlined,
                    size: 20,
                    color: AppColors.textPrimary,
                  ),
                  SizedBox(width: AppSpacing.xs),
                  Text(
                    'Select Payment Instrument',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.xs),
              const Text(
                'Student/Community non-production sandbox environment.',
                style: TextStyle(
                  fontSize: 12,
                  color: AppColors.textTertiary,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              const Divider(height: 1, color: AppColors.neutral200),
              const SizedBox(height: AppSpacing.sm),

              // Payment Method Options
              ..._methods.map((method) {
                final isSelected = selectedMethod == method.id ||
                    (method.id == 'UPI' && selectedMethod.startsWith('UPI')) ||
                    (method.id == 'Credit / Debit Card' &&
                        selectedMethod.contains('Card')) ||
                    (method.id == 'Demo Payment' &&
                        selectedMethod.contains('Demo'));

                return Container(
                  margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.stitchForestGreen.withValues(alpha: 0.04)
                        : AppColors.surface,
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    border: Border.all(
                      color: isSelected
                          ? AppColors.stitchForestGreen
                          : AppColors.neutral200,
                      width: isSelected ? 1.5 : 1.0,
                    ),
                  ),
                  child: InkWell(
                    onTap: () {
                      ref.read(selectedPaymentMethodProvider.notifier).state =
                          method.id;
                      ref
                          .read(paymentStateProvider.notifier)
                          .selectMethod(method.enumMethod);
                      Navigator.of(context).pop();
                    },
                    borderRadius: BorderRadius.circular(AppRadius.md),
                    child: Padding(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      child: Row(
                        children: [
                          Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? AppColors.stitchForestGreen
                                  : AppColors.neutral100,
                              borderRadius: BorderRadius.circular(AppRadius.md),
                            ),
                            child: Icon(
                              method.icon,
                              color: isSelected
                                  ? Colors.white
                                  : AppColors.textPrimary,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: AppSpacing.md),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      method.title,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                        color: AppColors.textPrimary,
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 5,
                                        vertical: 1,
                                      ),
                                      decoration: BoxDecoration(
                                        color: method.badge == 'DEMO'
                                            ? const Color(0xFFEFF6FF)
                                            : method.badge == 'TEST'
                                                ? const Color(0xFFF3E8FF)
                                                : const Color(0xFFDCFCE7),
                                        borderRadius: BorderRadius.circular(
                                          AppRadius.xs,
                                        ),
                                      ),
                                      child: Text(
                                        method.badge,
                                        style: TextStyle(
                                          fontSize: 9,
                                          fontWeight: FontWeight.w800,
                                          color: method.badge == 'DEMO'
                                              ? const Color(0xFF1E40AF)
                                              : method.badge == 'TEST'
                                                  ? const Color(0xFF6B21A8)
                                                  : const Color(0xFF166534),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  method.subtitle,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Icon(
                            isSelected
                                ? Icons.radio_button_checked_rounded
                                : Icons.radio_button_off_rounded,
                            color: isSelected
                                ? AppColors.stitchForestGreen
                                : AppColors.textTertiary,
                            size: 20,
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),

              // Security Guarantee Footer
              const SizedBox(height: AppSpacing.xs),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.sm,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: AppColors.neutral100,
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                ),
                child: const Row(
                  children: [
                    Icon(
                      Icons.lock_outline_rounded,
                      size: 14,
                      color: AppColors.textTertiary,
                    ),
                    SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Zero-cost student sandbox. No real currency is ever transferred.',
                        style: TextStyle(
                          fontSize: 11,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
