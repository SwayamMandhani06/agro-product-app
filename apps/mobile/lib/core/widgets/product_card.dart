import 'dart:io' show Platform;
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';

import '../design_system/app_colors.dart';
import '../design_system/app_radius.dart';
import '../design_system/app_spacing.dart';
import '../utils/product_image_resolver.dart';
import 'app_card.dart';
import 'price_text.dart';

enum ProductCardVariant {
  grid,
  list,
}

/// Modern Agrarian product card component matching Google Stitch visual specs.
///
/// Supports 2-column grid and horizontal list layout variants.
class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.id,
    required this.title,
    required this.price,
    this.originalPrice,
    this.unit = 'kg',
    this.sellerName,
    this.category,
    this.imageUrl,
    this.rating,
    this.reviewCount,
    this.inStock = true,
    this.isFavorite = false,
    this.variant = ProductCardVariant.grid,
    this.onTap,
    this.onAddToCart,
    this.onToggleFavorite,
  });

  final String id;
  final String title;
  final double price;
  final double? originalPrice;
  final String? unit;
  final String? sellerName;
  final String? category;
  final String? imageUrl;
  final double? rating;
  final int? reviewCount;
  final bool inStock;
  final bool isFavorite;
  final ProductCardVariant variant;
  final VoidCallback? onTap;
  final VoidCallback? onAddToCart;
  final VoidCallback? onToggleFavorite;

  @override
  Widget build(BuildContext context) {
    if (variant == ProductCardVariant.list) {
      return _buildListCard(context);
    }
    return _buildGridCard(context);
  }

  Widget _buildGridCard(BuildContext context) {
    return AppCard(
      onTap: onTap,
      padding: EdgeInsets.zero,
      borderRadius: BorderRadius.circular(AppRadius.lg),
      variant: AppCardVariant.elevated,
      elevation: 1.0,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image container with tags
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(AppRadius.lg),
                ),
                child: AspectRatio(
                  aspectRatio: 1.15,
                  child: _buildImage(),
                ),
              ),
              // Category / Stock badge
              if (category != null || !inStock)
                Positioned(
                  top: AppSpacing.sm,
                  left: AppSpacing.sm,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.xs,
                      vertical: 3,
                    ),
                    decoration: BoxDecoration(
                      color: inStock
                          ? AppColors.stitchForestGreen.withValues(alpha: 0.85)
                          : AppColors.error.withValues(alpha: 0.85),
                      borderRadius: BorderRadius.circular(AppRadius.xs),
                    ),
                    child: Text(
                      inStock ? category! : 'Out of Stock',
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              // Wishlist button
              Positioned(
                top: AppSpacing.xs,
                right: AppSpacing.xs,
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: onToggleFavorite,
                    borderRadius: BorderRadius.circular(AppRadius.full),
                    child: Container(
                      padding: const EdgeInsets.all(AppSpacing.xs),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.9),
                        shape: BoxShape.circle,
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x14000000),
                            blurRadius: 6,
                          ),
                        ],
                      ),
                      child: Icon(
                        isFavorite
                            ? Icons.favorite_rounded
                            : Icons.favorite_border_rounded,
                        size: 16,
                        color: isFavorite
                            ? AppColors.error
                            : AppColors.textSecondary,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),

          // Content body
          Padding(
            padding: const EdgeInsets.all(AppSpacing.sm),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (sellerName != null) ...[
                  Row(
                    children: [
                      const Icon(
                        Icons.verified_rounded,
                        size: 11,
                        color: AppColors.stitchAmber,
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Expanded(
                        child: Text(
                          sellerName!,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            color: AppColors.textTertiary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                ],
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                    height: 1.25,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: AppSpacing.xs),

                // Rating line
                if (rating != null) ...[
                  Row(
                    children: [
                      const Icon(
                        Icons.star_rounded,
                        size: 14,
                        color: AppColors.stitchAmber,
                      ),
                      const SizedBox(width: 2),
                      Text(
                        rating!.toStringAsFixed(1),
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      if (reviewCount != null) ...[
                        const SizedBox(width: 2),
                        Text(
                          '($reviewCount)',
                          style: const TextStyle(
                            fontSize: 11,
                            color: AppColors.textTertiary,
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: AppSpacing.xs),
                ],

                // Price and Add-To-Cart
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: PriceText(
                        price: price,
                        originalPrice: originalPrice,
                        unit: unit,
                        size: PriceTextSize.small,
                        showDiscountBadge: true,
                      ),
                    ),
                    Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: inStock ? onAddToCart : null,
                        borderRadius: BorderRadius.circular(AppRadius.sm),
                        child: Container(
                          padding: const EdgeInsets.all(AppSpacing.xs),
                          decoration: BoxDecoration(
                            color: inStock
                                ? AppColors.stitchForestGreen
                                : AppColors.neutral200,
                            borderRadius: BorderRadius.circular(AppRadius.sm),
                          ),
                          child: const Icon(
                            Icons.add_shopping_cart_rounded,
                            size: 16,
                            color: Colors.white,
                          ),
                        ),
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

  Widget _buildListCard(BuildContext context) {
    return AppCard(
      onTap: onTap,
      padding: const EdgeInsets.all(AppSpacing.sm),
      borderRadius: BorderRadius.circular(AppRadius.lg),
      variant: AppCardVariant.elevated,
      elevation: 1.0,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(AppRadius.md),
            child: SizedBox(
              width: 80,
              height: 80,
              child: _buildImage(),
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (sellerName != null)
                  Text(
                    sellerName!,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textTertiary,
                    ),
                  ),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: AppSpacing.xs),
                PriceText(
                  price: price,
                  originalPrice: originalPrice,
                  unit: unit,
                  size: PriceTextSize.small,
                  showDiscountBadge: true,
                ),
              ],
            ),
          ),
          if (onAddToCart != null)
            IconButton(
              icon: const Icon(Icons.add_circle_outline_rounded),
              color: AppColors.stitchForestGreen,
              onPressed: inStock ? onAddToCart : null,
            ),
        ],
      ),
    );
  }

  Widget _buildImage() {
    // In widget tests, avoid external network images to prevent pumpAndSettle timeouts
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) {
      return _buildFallbackImage();
    }
    final resolvedUrl = imageUrl ?? ProductImageResolver.resolve(id, category ?? '');
    if (resolvedUrl.startsWith('http')) {
      return CachedNetworkImage(
        imageUrl: resolvedUrl,
        fit: BoxFit.cover,
        placeholder: (context, url) => Container(
          color: AppColors.neutral100,
          child: const Center(
            child: SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
          ),
        ),
        errorWidget: (context, url, error) => _buildFallbackImage(),
      );
    }
    return _buildFallbackImage();
  }

  Widget _buildFallbackImage() {
    return Container(
      color: AppColors.stitchCanvas,
      child: const Center(
        child: Icon(
          Icons.eco_rounded,
          size: 32,
          color: AppColors.stitchForestGreen,
        ),
      ),
    );
  }
}
