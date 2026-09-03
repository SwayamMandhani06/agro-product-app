import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../domain/cart_item.dart';

/// Reusable cart item card matching the Google Stitch visual source of truth.
class CartItemTile extends StatelessWidget {
  const CartItemTile({
    super.key,
    required this.item,
    required this.onIncrement,
    required this.onDecrement,
    required this.onRemove,
  });

  final CartItem item;
  final VoidCallback onIncrement;
  final VoidCallback onDecrement;
  final VoidCallback onRemove;

  static final _currencyFormat = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  @override
  Widget build(BuildContext context) {
    final product = item.product;
    final formattedPrice = _currencyFormat.format(product.price);
    final formattedOriginal = product.originalPrice != null
        ? _currencyFormat.format(product.originalPrice)
        : null;

    final sellerOrBrand = product.brand ?? product.sellerName ?? 'AgriTrade';

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
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Product Image
          Container(
            width: 80,
            height: 80,
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              color: AppColors.stitchCanvas,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.neutral200),
            ),
            child: product.imageUrl != null && product.imageUrl!.isNotEmpty
                ? CachedNetworkImage(
                    imageUrl: product.imageUrl!,
                    fit: BoxFit.cover,
                    placeholder: (_, __) => const Center(
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                    errorWidget: (_, __, ___) => const Center(
                      child: Icon(
                        Icons.eco_rounded,
                        color: AppColors.stitchForestGreen,
                        size: 32,
                      ),
                    ),
                  )
                : const Center(
                    child: Icon(
                      Icons.eco_rounded,
                      color: AppColors.stitchForestGreen,
                      size: 32,
                    ),
                  ),
          ),
          const SizedBox(width: AppSpacing.md),

          // 2. Details & Controls
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Row: Title + Remove Button
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Text(
                        product.title,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                          height: 1.25,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(
                        Icons.delete_outline_rounded,
                        size: 20,
                        color: AppColors.textTertiary,
                      ),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      splashRadius: 20,
                      onPressed: () {
                        HapticFeedback.lightImpact();
                        onRemove();
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 2),

                // Subtitle: Brand • Pack Size
                Text(
                  '$sellerOrBrand • ${product.unit}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),

                // Stock Badge
                if (product.stockCount != null && product.stockCount! <= 5)
                  Text(
                    'Only ${product.stockCount} left',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: AppColors.stitchAmber,
                    ),
                  )
                else
                  const Text(
                    'In stock',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: AppColors.stitchForestGreen,
                    ),
                  ),
                const SizedBox(height: AppSpacing.sm),

                // Bottom Row: Price & Stepper
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    // Price
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          formattedPrice,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: AppColors.stitchForestGreen,
                          ),
                        ),
                        if (formattedOriginal != null)
                          Text(
                            formattedOriginal,
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.textTertiary,
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                      ],
                    ),

                    // Stepper: [-]  quantity  [+]
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(AppRadius.sm),
                        border: Border.all(color: AppColors.neutral300),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          InkWell(
                            onTap: () {
                              HapticFeedback.selectionClick();
                              onDecrement();
                            },
                            borderRadius: const BorderRadius.horizontal(
                              left: Radius.circular(AppRadius.sm),
                            ),
                            child: const SizedBox(
                              width: 32,
                              height: 32,
                              child: Icon(
                                Icons.remove_rounded,
                                size: 16,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ),
                          Container(
                            constraints: const BoxConstraints(minWidth: 32),
                            alignment: Alignment.center,
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            child: Text(
                              '${item.quantity}',
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ),
                          InkWell(
                            onTap: () {
                              HapticFeedback.selectionClick();
                              onIncrement();
                            },
                            borderRadius: const BorderRadius.horizontal(
                              right: Radius.circular(AppRadius.sm),
                            ),
                            child: const SizedBox(
                              width: 32,
                              height: 32,
                              child: Icon(
                                Icons.add_rounded,
                                size: 16,
                                color: AppColors.stitchForestGreen,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
