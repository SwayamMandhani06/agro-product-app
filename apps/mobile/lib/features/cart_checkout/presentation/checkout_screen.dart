import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../../core/routing/routes.dart';
import '../../../../core/widgets/app_loading.dart';
import 'order_confirmed_screen.dart';
import 'providers/cart_providers.dart';
import '../../orders/presentation/providers/order_providers.dart';
import 'widgets/address_selection_sheet.dart';
import 'widgets/payment_selection_sheet.dart';

/// Full Checkout Screen matching Stitch AgriTrade screen `1f9a38333e014c208bd97a5fdf66b791`.
class CheckoutScreen extends ConsumerWidget {
  const CheckoutScreen({super.key});

  static final _currencyFormat = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final items = ref.watch(cartItemsProvider);
    final itemCount = ref.watch(cartItemCountProvider);
    final subtotal = ref.watch(cartSubtotalProvider);
    final deliveryFee = ref.watch(cartDeliveryFeeProvider);
    final discount = ref.watch(cartSavingsProvider);
    final totalAmount = ref.watch(cartTotalAmountProvider);

    final selectedAddress = ref.watch(selectedAddressProvider);
    final selectedPaymentMethod = ref.watch(selectedPaymentMethodProvider);
    final isLoading = ref.watch(checkoutLoadingProvider);

    final bottomPadding = MediaQuery.of(context).padding.bottom;

    if (items.isEmpty && !isLoading) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          backgroundColor: AppColors.surface,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
            onPressed: () => context.pop(),
          ),
          title: const Text(
            'Checkout',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Your cart is empty',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              ElevatedButton(
                onPressed: () => context.go(AppRoutes.products),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.stitchForestGreen,
                  foregroundColor: Colors.white,
                ),
                child: const Text('Go to Shop'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Checkout',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          ListView(
            padding: EdgeInsets.fromLTRB(
              AppSpacing.md,
              AppSpacing.md,
              AppSpacing.md,
              96 + bottomPadding,
            ),
            children: [
              // Section 1: Delivery Address Card
              _buildAddressCard(context, selectedAddress),
              const SizedBox(height: AppSpacing.md),

              // Section 2: Delivery Method Card
              _buildDeliveryMethodCard(),
              const SizedBox(height: AppSpacing.md),

              // Section 3: Order Items Summary
              _buildItemsSummaryCard(items, itemCount),
              const SizedBox(height: AppSpacing.md),

              // Section 4: Payment Method Card
              _buildPaymentMethodCard(context, selectedPaymentMethod),
              const SizedBox(height: AppSpacing.md),

              // Section 5: Bill Details
              _buildBillDetailsCard(
                subtotal: subtotal,
                deliveryFee: deliveryFee,
                discount: discount,
                totalAmount: totalAmount,
              ),
            ],
          ),

          // Sticky Bottom CTA
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: _buildStickyBottomBar(
              context,
              ref,
              totalAmount: totalAmount,
              isLoading: isLoading,
              bottomPadding: bottomPadding,
              onPlaceOrder: () => _handlePlaceOrder(
                context,
                ref,
                items: items,
                address: selectedAddress,
                paymentMethod: selectedPaymentMethod,
                subtotal: subtotal,
                deliveryFee: deliveryFee,
                discount: discount,
                totalAmount: totalAmount,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAddressCard(BuildContext context, dynamic address) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.neutral200),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 10,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(
                    Icons.location_on_rounded,
                    size: 18,
                    color: AppColors.stitchForestGreen,
                  ),
                  SizedBox(width: AppSpacing.xs),
                  Text(
                    'DELIVER TO',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.8,
                      color: AppColors.textTertiary,
                    ),
                  ),
                ],
              ),
              TextButton(
                onPressed: () => AddressSelectionSheet.show(context),
                child: const Text(
                  'Change',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.stitchForestGreen,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.neutral100,
                  borderRadius: BorderRadius.circular(AppRadius.xs),
                ),
                child: Text(
                  address.tag,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.xs),
              Text(
                address.recipientName,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            address.formattedAddress,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            address.phone,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textTertiary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeliveryMethodCard() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(
          color: AppColors.stitchForestGreen.withValues(alpha: 0.3),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: const Row(
        children: [
          Icon(
            Icons.check_circle_rounded,
            size: 20,
            color: AppColors.stitchForestGreen,
          ),
          SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Standard Farm Delivery',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Estimated: Tomorrow – 2 days',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.stitchForestGreen,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildItemsSummaryCard(List<dynamic> items, int itemCount) {
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Order Items',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.neutral100,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
                child: Text(
                  '$itemCount Items',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          ...items.map((item) {
            final product = item.product;
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 6.0),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    clipBehavior: Clip.antiAlias,
                    decoration: BoxDecoration(
                      color: AppColors.stitchCanvas,
                      borderRadius: BorderRadius.circular(AppRadius.sm),
                      border: Border.all(color: AppColors.neutral200),
                    ),
                    child: product.imageUrl != null && product.imageUrl!.isNotEmpty
                        ? CachedNetworkImage(
                            imageUrl: product.imageUrl!,
                            fit: BoxFit.cover,
                            errorWidget: (_, __, ___) => const Icon(
                              Icons.eco_rounded,
                              size: 20,
                              color: AppColors.stitchForestGreen,
                            ),
                          )
                        : const Icon(
                            Icons.eco_rounded,
                            size: 20,
                            color: AppColors.stitchForestGreen,
                          ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          product.title,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Qty: ${item.quantity} • ${product.unit}',
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
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildPaymentMethodCard(BuildContext context, String method) {
    IconData icon;
    if (method == 'UPI') {
      icon = Icons.qr_code_2_rounded;
    } else if (method == 'Credit / Debit Card') {
      icon = Icons.credit_card_rounded;
    } else if (method == 'Net Banking') {
      icon = Icons.account_balance_rounded;
    } else {
      icon = Icons.payments_outlined;
    }

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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(
                    Icons.account_balance_wallet_outlined,
                    size: 18,
                    color: AppColors.stitchForestGreen,
                  ),
                  SizedBox(width: AppSpacing.xs),
                  Text(
                    'PAYMENT METHOD',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.8,
                      color: AppColors.textTertiary,
                    ),
                  ),
                ],
              ),
              TextButton(
                onPressed: () => PaymentSelectionSheet.show(context),
                child: const Text(
                  'Change',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.stitchForestGreen,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.neutral100,
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                ),
                child: Icon(
                  icon,
                  color: AppColors.stitchForestGreen,
                  size: 20,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Text(
                  method,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
              const Icon(
                Icons.check_circle_rounded,
                size: 18,
                color: AppColors.stitchForestGreen,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBillDetailsCard({
    required double subtotal,
    required double deliveryFee,
    required double discount,
    required double totalAmount,
  }) {
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
          const Text(
            'Bill Details',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          _buildBillRow('Subtotal', _currencyFormat.format(subtotal)),
          const SizedBox(height: 6),
          _buildBillRow(
            'Delivery Fee',
            deliveryFee == 0 ? 'FREE' : _currencyFormat.format(deliveryFee),
            valueColor: deliveryFee == 0
                ? AppColors.stitchForestGreen
                : AppColors.textPrimary,
          ),
          if (discount > 0) ...[
            const SizedBox(height: 6),
            _buildBillRow(
              'Discount',
              '-${_currencyFormat.format(discount)}',
              valueColor: AppColors.stitchForestGreen,
            ),
          ],
          const Padding(
            padding: EdgeInsets.symmetric(vertical: AppSpacing.sm),
            child: Divider(height: 1, color: AppColors.neutral200),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Total Amount',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                _currencyFormat.format(totalAmount),
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
    );
  }

  Widget _buildBillRow(String label, String value, {Color? valueColor}) {
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
            color: valueColor ?? AppColors.textPrimary,
          ),
        ),
      ],
    );
  }

  Widget _buildStickyBottomBar(
    BuildContext context,
    WidgetRef ref, {
    required double totalAmount,
    required bool isLoading,
    required double bottomPadding,
    required VoidCallback onPlaceOrder,
  }) {
    return Container(
      padding: EdgeInsets.fromLTRB(
        AppSpacing.md,
        AppSpacing.sm,
        AppSpacing.md,
        AppSpacing.md + bottomPadding,
      ),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(
          top: BorderSide(color: AppColors.neutral200),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 16,
            offset: Offset(0, -4),
          ),
        ],
      ),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Total to pay',
                style: TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
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
          const SizedBox(width: AppSpacing.lg),
          Expanded(
            child: ElevatedButton(
              onPressed: isLoading ? null : onPlaceOrder,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.stitchForestGreen,
                foregroundColor: Colors.white,
                elevation: 0,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
              ),
              child: isLoading
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: AppSpinner(size: 20, color: Colors.white),
                    )
                  : const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Place Order',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        SizedBox(width: AppSpacing.xs),
                        Icon(Icons.arrow_forward_rounded, size: 18),
                      ],
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _handlePlaceOrder(
    BuildContext context,
    WidgetRef ref, {
    required List<dynamic> items,
    required dynamic address,
    required String paymentMethod,
    required double subtotal,
    required double deliveryFee,
    required double discount,
    required double totalAmount,
  }) async {
    HapticFeedback.heavyImpact();
    ref.read(checkoutLoadingProvider.notifier).state = true;

    try {
      final orderRepo = ref.read(orderRepositoryProvider);
      final result = await orderRepo.placeOrder(
        items: List.from(items),
        address: address,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: discount,
        totalAmount: totalAmount,
      );

      if (!context.mounted) return;

      result.fold(
        (failure) {
          ref.read(checkoutLoadingProvider.notifier).state = false;
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Order failed: ${failure.message}'),
              backgroundColor: AppColors.error,
            ),
          );
        },
        (order) {
          ref.read(cartItemsProvider.notifier).clearCart();
          ref.read(ordersProvider.notifier).loadOrders();
          ref.read(checkoutLoadingProvider.notifier).state = false;
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (ctx) => OrderConfirmedScreen(order: order),
            ),
          );
        },
      );
    } catch (e) {
      ref.read(checkoutLoadingProvider.notifier).state = false;
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error placing order: $e'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }
}
