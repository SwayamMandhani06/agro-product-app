import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
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
      title: 'Cash on Delivery',
      subtitle: 'Pay with cash or UPI upon delivery',
      icon: Icons.payments_outlined,
    ),
    (
      id: 'UPI',
      title: 'UPI',
      subtitle: 'Google Pay, PhonePe, Paytm, BHIM',
      icon: Icons.qr_code_2_rounded,
    ),
    (
      id: 'Credit / Debit Card',
      title: 'Credit / Debit Card',
      subtitle: 'Visa, Mastercard, RuPay',
      icon: Icons.credit_card_rounded,
    ),
    (
      id: 'Net Banking',
      title: 'Net Banking',
      subtitle: 'SBI, HDFC, ICICI, Bank of Baroda & more',
      icon: Icons.account_balance_rounded,
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
                    'Select Payment Method',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.sm),
              const Divider(height: 1, color: AppColors.neutral200),
              const SizedBox(height: AppSpacing.sm),

              // Payment Method Options
              ..._methods.map((method) {
                final isSelected = selectedMethod == method.id;
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
                                Text(
                                  method.title,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.textPrimary,
                                  ),
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
            ],
          ),
        ),
      ),
    );
  }
}
