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
import '../../../cart_checkout/domain/order.dart';
import '../../../cart_checkout/presentation/providers/cart_providers.dart';
import 'order_status_badge.dart';

/// Reusable Order Card for Orders list screen matching Google Stitch `7ad8777b56f748caabf7496810184e45`.
class OrderCard extends ConsumerWidget {
  const OrderCard({
    super.key,
    required this.order,
    this.onTap,
  });

  final Order order;
  final VoidCallback? onTap;

  static final _currencyFormat = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  static final _dateFormat = DateFormat('dd MMM yyyy');

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final firstItem = order.items.isNotEmpty ? order.items.first : null;
    final product = firstItem?.product;

    return Container(
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
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(AppRadius.lg),
          onTap: onTap ?? () => context.push('/orders/${order.id}'),
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Top Row: Order ID, Date & Status Badge
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Order ${order.id}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
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
                const SizedBox(height: AppSpacing.sm),
                const Divider(height: 1, color: AppColors.neutral200),
                const SizedBox(height: AppSpacing.sm),

                // 2. Middle Row: Product Preview
                if (firstItem != null && product != null)
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Thumbnail
                      Container(
                        width: 60,
                        height: 60,
                        clipBehavior: Clip.antiAlias,
                        decoration: BoxDecoration(
                          color: AppColors.stitchCanvas,
                          borderRadius: BorderRadius.circular(AppRadius.sm),
                          border: Border.all(color: AppColors.neutral200),
                        ),
                        child: product.imageUrl != null &&
                                product.imageUrl!.isNotEmpty
                            ? CachedNetworkImage(
                                imageUrl: product.imageUrl!,
                                fit: BoxFit.cover,
                                errorWidget: (_, __, ___) => const Icon(
                                  Icons.eco_rounded,
                                  size: 24,
                                  color: AppColors.stitchForestGreen,
                                ),
                              )
                            : const Icon(
                                Icons.eco_rounded,
                                size: 24,
                                color: AppColors.stitchForestGreen,
                              ),
                      ),
                      const SizedBox(width: AppSpacing.sm),

                      // Title & Quantity
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              product.title,
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
                              'Qty: ${firstItem.quantity} • ${order.totalItemCount} item${order.totalItemCount > 1 ? "s" : ""}',
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              _currencyFormat.format(order.totalAmount),
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: AppColors.stitchForestGreen,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                const SizedBox(height: AppSpacing.md),

                // 3. Actions Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    // View Details Outline Button
                    OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.md,
                          vertical: 8,
                        ),
                        side: const BorderSide(color: AppColors.neutral300),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppRadius.sm),
                        ),
                      ),
                      onPressed: onTap ??
                          () => context.push('/orders/${order.id}'),
                      child: const Text(
                        'View Details',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),

                    // Active Action: Track Order
                    if (order.status.isActive) ...[
                      const SizedBox(width: AppSpacing.sm),
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.stitchForestGreen,
                          foregroundColor: AppColors.surface,
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.md,
                            vertical: 8,
                          ),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                          ),
                        ),
                        onPressed: () =>
                            context.push('/orders/${order.id}/track'),
                        icon: const Icon(Icons.local_shipping_outlined, size: 16),
                        label: const Text(
                          'Track Order',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],

                    // Delivered Action: Reorder
                    if (order.status.isDelivered) ...[
                      const SizedBox(width: AppSpacing.sm),
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.stitchForestGreen,
                          foregroundColor: AppColors.surface,
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.md,
                            vertical: 8,
                          ),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                          ),
                        ),
                        onPressed: () => _handleReorder(context, ref),
                        icon: const Icon(Icons.replay_rounded, size: 16),
                        label: const Text(
                          'Reorder',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _handleReorder(BuildContext context, WidgetRef ref) async {
    HapticFeedback.mediumImpact();

    // Add all items in the order to the cart
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
          '${order.items.length} item(s) from Order ${order.id} added to cart',
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
}
