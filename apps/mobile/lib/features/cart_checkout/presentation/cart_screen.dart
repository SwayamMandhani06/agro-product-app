import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../../core/routing/routes.dart';
import '../../../../core/widgets/app_button.dart';
import 'providers/cart_providers.dart';
import 'widgets/address_selection_sheet.dart';
import 'widgets/cart_item_tile.dart';
import 'widgets/order_summary_card.dart';

/// Full Cart Screen matching Google Stitch AgriTrade screen `a7f9f1c5f5df49cf83fbac7fc65bbbe4`.
class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

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
    final savings = ref.watch(cartSavingsProvider);
    final totalAmount = ref.watch(cartTotalAmountProvider);
    final selectedAddress = ref.watch(selectedAddressProvider);

    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go(AppRoutes.home);
            }
          },
        ),
        title: Text(
          items.isEmpty ? 'Cart' : 'Cart ($itemCount)',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        centerTitle: true,
        actions: [
          if (items.isNotEmpty)
            TextButton(
              onPressed: () {
                _showClearCartDialog(context, ref);
              },
              child: const Text(
                'Clear',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textTertiary,
                ),
              ),
            ),
        ],
      ),
      body: items.isEmpty
          ? _buildEmptyState(context)
          : Stack(
              children: [
                ListView(
                  padding: EdgeInsets.fromLTRB(
                    AppSpacing.md,
                    AppSpacing.md,
                    AppSpacing.md,
                    96 + bottomPadding,
                  ),
                  children: [
                    // 1. Delivery Location Row
                    _buildDeliveryLocationBanner(context, selectedAddress),
                    const SizedBox(height: AppSpacing.md),

                    // 2. Cart Items List
                    ...items.map((item) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: AppSpacing.md),
                        child: CartItemTile(
                          item: item,
                          onIncrement: () => ref
                              .read(cartItemsProvider.notifier)
                              .incrementQuantity(item.product.id),
                          onDecrement: () => ref
                              .read(cartItemsProvider.notifier)
                              .decrementQuantity(item.product.id),
                          onRemove: () => ref
                              .read(cartItemsProvider.notifier)
                              .removeItem(item.product.id),
                        ),
                      );
                    }),

                    // 3. Order Summary Card
                    OrderSummaryCard(
                      itemCount: itemCount,
                      subtotal: subtotal,
                      deliveryFee: deliveryFee,
                      discount: savings,
                      totalAmount: totalAmount,
                    ),
                    const SizedBox(height: AppSpacing.md),

                    // 4. AgriTrade Trust Guarantee
                    _buildTrustGuarantee(),
                  ],
                ),

                // 5. Sticky Bottom Action Bar
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 0,
                  child: _buildStickyBottomBar(
                    context,
                    totalAmount,
                    bottomPadding,
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 96,
              height: 96,
              decoration: BoxDecoration(
                color: AppColors.surface,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.neutral200),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x0A000000),
                    blurRadius: 16,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(
                Icons.shopping_bag_outlined,
                size: 44,
                color: AppColors.stitchForestGreen,
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            const Text(
              'Your Cart is Empty',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.xs),
            const Text(
              'Explore our wide catalog of certified seeds, fertilizers, and farm equipment.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
                height: 1.4,
              ),
            ),
            const SizedBox(height: AppSpacing.xl),
            AppButton(
              label: 'Explore Products',
              leadingIcon: const Icon(Icons.search_rounded, size: 18),
              onPressed: () {
                context.push(AppRoutes.products);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDeliveryLocationBanner(BuildContext context, dynamic address) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.neutral200),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.stitchForestGreen.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.location_on_rounded,
              color: AppColors.stitchForestGreen,
              size: 20,
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Delivering to',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textTertiary,
                  ),
                ),
                Text(
                  address.formattedAddress,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
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
    );
  }

  Widget _buildTrustGuarantee() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.stitchCanvas,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.neutral200),
      ),
      child: const Row(
        children: [
          Icon(
            Icons.verified_user_outlined,
            size: 24,
            color: AppColors.stitchForestGreen,
          ),
          SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '100% Verified Quality Assured',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AppColors.stitchForestGreen,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Certified agricultural products tested for authentic farm performance.',
                  style: TextStyle(
                    fontSize: 11,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStickyBottomBar(
    BuildContext context,
    double totalAmount,
    double bottomPadding,
  ) {
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
              onPressed: () {
                HapticFeedback.mediumImpact();
                context.push(AppRoutes.checkout);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.stitchForestGreen,
                foregroundColor: Colors.white,
                elevation: 0,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Proceed to Checkout',
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

  void _showClearCartDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Clear Cart?'),
        content: const Text(
          'Are you sure you want to remove all items from your shopping cart?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(cartItemsProvider.notifier).clearCart();
              Navigator.of(ctx).pop();
            },
            child: const Text(
              'Clear',
              style: TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );
  }
}
