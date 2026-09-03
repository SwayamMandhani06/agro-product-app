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
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_loading.dart';
import '../../cart_checkout/domain/order.dart';
import '../../cart_checkout/presentation/providers/cart_providers.dart';
import 'providers/order_providers.dart';
import 'widgets/cancel_order_dialog.dart';
import 'widgets/order_status_badge.dart';
import 'widgets/order_tracking_timeline.dart';

/// Full Order Details screen matching Google Stitch `e24d0f780f4d4c1a9907336f07191628`.
class OrderDetailsScreen extends ConsumerWidget {
  const OrderDetailsScreen({
    super.key,
    required this.orderId,
  });

  final String orderId;

  static final _currencyFormat = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  static final _dateFormat = DateFormat('dd MMM yyyy, hh:mm a');

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orderAsync = ref.watch(orderDetailsProvider(orderId));

    return Scaffold(
      backgroundColor: AppColors.stitchCanvas,
      appBar: AppBar(
        title: const Text(
          'Order Details',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        backgroundColor: AppColors.surface,
        elevation: 0,
        scrolledUnderElevation: 1,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(
              Icons.help_outline_rounded,
              color: AppColors.textPrimary,
            ),
            tooltip: 'Support',
            onPressed: () => _showSupportSnackbar(context),
          ),
          const SizedBox(width: AppSpacing.xs),
        ],
      ),
      body: orderAsync.when(
        loading: () => const Center(
          child: AppSpinner(size: 32),
        ),
        error: (err, stack) => _buildNotFoundState(context),
        data: (order) => _buildOrderContent(context, ref, order),
      ),
    );
  }

  Widget _buildNotFoundState(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.search_off_rounded,
              size: 48,
              color: AppColors.neutral400,
            ),
            const SizedBox(height: AppSpacing.md),
            const Text(
              'Order Not Found',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(
              'We could not find details for order "$orderId".',
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 13,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            AppButton(
              label: 'Back to Orders',
              onPressed: () => context.go(AppRoutes.orders),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderContent(BuildContext context, WidgetRef ref, Order order) {
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Stack(
      children: [
        ListView(
          padding: EdgeInsets.only(
            left: AppSpacing.md,
            right: AppSpacing.md,
            top: AppSpacing.md,
            bottom: 90 + bottomPadding,
          ),
          children: [
            // Section 1: Header Order Info & Status Card
            _buildHeaderCard(order),
            const SizedBox(height: AppSpacing.md),

            // Section 2: Order Tracking Timeline
            OrderTrackingTimeline(
              order: order,
              onAdvanceStatus: (newStatus) {
                ref
                    .read(ordersProvider.notifier)
                    .updateOrderStatus(order.id, newStatus);
              },
            ),
            const SizedBox(height: AppSpacing.md),

            // Section 3: Ordered Products
            _buildProductsCard(order),
            const SizedBox(height: AppSpacing.md),

            // Section 4: Bill Breakdown / Order Summary
            _buildSummaryCard(order),
            const SizedBox(height: AppSpacing.md),

            // Section 5: Delivery Address
            _buildAddressCard(order),
            const SizedBox(height: AppSpacing.md),

            // Section 6: Payment Method
            _buildPaymentCard(order),
          ],
        ),

        // Sticky Bottom Actions Bar
        Positioned(
          left: 0,
          right: 0,
          bottom: 0,
          child: _buildBottomBar(context, ref, order, bottomPadding),
        ),
      ],
    );
  }

  Widget _buildHeaderCard(Order order) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.neutral200),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Order ${order.id}',
                style: const TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                'Placed ${_dateFormat.format(order.createdAt)}',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textTertiary,
                ),
              ),
            ],
          ),
          OrderStatusBadge(status: order.status),
        ],
      ),
    );
  }

  Widget _buildProductsCard(Order order) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.neutral200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.shopping_bag_outlined,
                size: 18,
                color: AppColors.stitchForestGreen,
              ),
              const SizedBox(width: AppSpacing.xs),
              Text(
                'PRODUCTS (${order.totalItemCount})',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                  color: AppColors.textTertiary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          ...order.items.map((item) {
            final p = item.product;
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    clipBehavior: Clip.antiAlias,
                    decoration: BoxDecoration(
                      color: AppColors.stitchCanvas,
                      borderRadius: BorderRadius.circular(AppRadius.sm),
                      border: Border.all(color: AppColors.neutral200),
                    ),
                    child: p.imageUrl != null && p.imageUrl!.isNotEmpty
                        ? CachedNetworkImage(
                            imageUrl: p.imageUrl!,
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
                          p.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Qty: ${item.quantity} × ${_currencyFormat.format(p.price)}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
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

  Widget _buildSummaryCard(Order order) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.neutral200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(
                Icons.receipt_long_outlined,
                size: 18,
                color: AppColors.stitchForestGreen,
              ),
              SizedBox(width: AppSpacing.xs),
              Text(
                'ORDER SUMMARY',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                  color: AppColors.textTertiary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          _buildRow('Subtotal', _currencyFormat.format(order.subtotal)),
          const SizedBox(height: 6),
          _buildRow(
            'Delivery Fee',
            order.deliveryFee == 0
                ? 'FREE'
                : _currencyFormat.format(order.deliveryFee),
            valueColor: order.deliveryFee == 0 ? AppColors.stitchForestGreen : null,
          ),
          if (order.discount > 0) ...[
            const SizedBox(height: 6),
            _buildRow(
              'Discount Saved',
              '-${_currencyFormat.format(order.discount)}',
              valueColor: AppColors.stitchForestGreen,
            ),
          ],
          const SizedBox(height: AppSpacing.sm),
          const Divider(height: 1, color: AppColors.neutral200),
          const SizedBox(height: AppSpacing.sm),
          _buildRow(
            'Total Amount',
            _currencyFormat.format(order.totalAmount),
            isBold: true,
          ),
        ],
      ),
    );
  }

  Widget _buildAddressCard(Order order) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.neutral200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(
                Icons.location_on_outlined,
                size: 18,
                color: AppColors.stitchForestGreen,
              ),
              SizedBox(width: AppSpacing.xs),
              Text(
                'DELIVERY ADDRESS',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                  color: AppColors.textTertiary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            order.address.recipientName,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            order.address.formattedAddress,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Phone: ${order.address.phone}',
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textTertiary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentCard(Order order) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.neutral200),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Icon(
                Icons.credit_card_outlined,
                size: 18,
                color: AppColors.stitchForestGreen,
              ),
              const SizedBox(width: AppSpacing.xs),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'PAYMENT METHOD',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.8,
                      color: AppColors.textTertiary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    order.paymentMethod,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: AppColors.successLight,
              borderRadius: BorderRadius.circular(AppRadius.xs),
            ),
            child: const Text(
              'Confirmed',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: AppColors.stitchForestGreen,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(
    BuildContext context,
    WidgetRef ref,
    Order order,
    double bottomPadding,
  ) {
    return Container(
      padding: EdgeInsets.only(
        left: AppSpacing.md,
        right: AppSpacing.md,
        top: AppSpacing.md,
        bottom: AppSpacing.md + bottomPadding,
      ),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.neutral200)),
        boxShadow: [
          BoxShadow(
            color: Color(0x0D000000),
            blurRadius: 10,
            offset: Offset(0, -4),
          ),
        ],
      ),
      child: Row(
        children: [
          // If active: Cancel Order
          if (order.status.isActive) ...[
            Expanded(
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  side: const BorderSide(color: AppColors.neutral300),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  ),
                ),
                onPressed: () => _handleCancelOrder(context, ref, order),
                child: const Text(
                  'Cancel Order',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.error,
                  ),
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  backgroundColor: AppColors.stitchForestGreen,
                  foregroundColor: AppColors.surface,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  ),
                ),
                onPressed: () => context.push('/orders/${order.id}/track'),
                icon: const Icon(Icons.route_rounded, size: 18),
                label: const Text(
                  'Track Order',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ] else ...[
            // Delivered or Cancelled: Reorder
            Expanded(
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  backgroundColor: AppColors.stitchForestGreen,
                  foregroundColor: AppColors.surface,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  ),
                ),
                onPressed: () => _handleReorder(context, ref, order),
                icon: const Icon(Icons.replay_rounded, size: 18),
                label: const Text(
                  'Reorder All Items',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildRow(
    String label,
    String value, {
    bool isBold = false,
    Color? valueColor,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: isBold ? 15 : 13,
            fontWeight: isBold ? FontWeight.w700 : FontWeight.w500,
            color: isBold ? AppColors.textPrimary : AppColors.textSecondary,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: isBold ? 16 : 13,
            fontWeight: isBold ? FontWeight.w800 : FontWeight.w600,
            color: valueColor ??
                (isBold ? AppColors.stitchForestGreen : AppColors.textPrimary),
          ),
        ),
      ],
    );
  }

  Future<void> _handleReorder(
    BuildContext context,
    WidgetRef ref,
    Order order,
  ) async {
    HapticFeedback.mediumImpact();

    for (final item in order.items) {
      await ref.read(cartItemsProvider.notifier).addItem(
            item.product,
            quantity: item.quantity,
          );
    }

    if (!context.mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          '${order.items.length} product(s) added to cart',
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        action: SnackBarAction(
          label: 'View Cart',
          textColor: AppColors.brand100,
          onPressed: () => context.push(AppRoutes.cartCheckout),
        ),
        backgroundColor: AppColors.stitchForestGreen,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  Future<void> _handleCancelOrder(
    BuildContext context,
    WidgetRef ref,
    Order order,
  ) async {
    final confirmed = await CancelOrderDialog.show(context, orderId: order.id);

    if (confirmed == true && context.mounted) {
      final success = await ref
          .read(ordersProvider.notifier)
          .cancelOrder(order.id);

      if (success && context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Order ${order.id} has been cancelled.'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  void _showSupportSnackbar(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('AgriTrade Farmer Support: 1800-AGRI-HELP (toll-free)'),
        backgroundColor: AppColors.stitchForestGreen,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
