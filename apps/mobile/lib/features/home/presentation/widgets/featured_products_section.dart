import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../../core/routing/routes.dart';
import '../../../../core/widgets/product_card.dart';
import '../../../cart_checkout/presentation/providers/cart_providers.dart';
import '../../../products/domain/product.dart';

/// Featured/Recommended Products 2-column grid for the Farmer Home Dashboard.
class FeaturedProductsSection extends ConsumerStatefulWidget {
  const FeaturedProductsSection({
    super.key,
    required this.products,
  });

  final List<Product> products;

  @override
  ConsumerState<FeaturedProductsSection> createState() =>
      _FeaturedProductsSectionState();
}

class _FeaturedProductsSectionState extends ConsumerState<FeaturedProductsSection> {
  late Set<String> _wishlistIds;

  @override
  void initState() {
    super.initState();
    _wishlistIds = widget.products
        .where((p) => p.isFavorite)
        .map((p) => p.id)
        .toSet();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Recommended for You',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.stitchForestGreen,
              ),
            ),
            InkWell(
              onTap: () => context.push(AppRoutes.products),
              borderRadius: BorderRadius.circular(AppRadius.xs),
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                child: Row(
                  children: [
                    Text(
                      'View all',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.stitchForestGreen,
                      ),
                    ),
                    SizedBox(width: 2),
                    Icon(
                      Icons.arrow_forward_rounded,
                      size: 14,
                      color: AppColors.stitchForestGreen,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: AppSpacing.md),

        // 2-column Grid
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: widget.products.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: AppSpacing.sm,
            crossAxisSpacing: AppSpacing.sm,
            childAspectRatio: 0.64,
          ),
          itemBuilder: (context, index) {
            final product = widget.products[index];
            final isFav = _wishlistIds.contains(product.id);

            return ProductCard(
              id: product.id,
              title: product.title,
              price: product.price,
              originalPrice: product.originalPrice,
              unit: product.unit,
              sellerName: product.sellerName,
              category: product.category,
              rating: product.rating,
              reviewCount: product.reviewCount,
              imageUrl: product.imageUrl,
              inStock: product.inStock,
              isFavorite: isFav,
              onTap: () => context.push('${AppRoutes.products}/${product.id}'),
              onAddToCart: () {
                HapticFeedback.lightImpact();
                ref.read(cartItemsProvider.notifier).addItem(product, quantity: 1);
                ScaffoldMessenger.of(context).hideCurrentSnackBar();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('${product.title} added to cart'),
                    duration: const Duration(seconds: 2),
                    behavior: SnackBarBehavior.floating,
                    backgroundColor: AppColors.stitchForestGreen,
                    action: SnackBarAction(
                      label: 'VIEW CART',
                      textColor: Colors.white,
                      onPressed: () => context.push(AppRoutes.cartCheckout),
                    ),
                  ),
                );
              },
              onToggleFavorite: () {
                setState(() {
                  if (isFav) {
                    _wishlistIds.remove(product.id);
                  } else {
                    _wishlistIds.add(product.id);
                  }
                });
              },
            );
          },
        ),
      ],
    );
  }
}
