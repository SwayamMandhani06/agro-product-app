import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_radius.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/routing/routes.dart';
import '../../../core/widgets/app_empty_state.dart';
import '../../../core/widgets/app_error_state.dart';
import '../../../core/widgets/app_loading.dart';
import '../../../core/widgets/product_card.dart';
import '../../cart_checkout/presentation/providers/cart_providers.dart';
import 'providers/wishlist_provider.dart';

/// Full implementation of the Farmer Wishlist / Saved Products screen.
class WishlistScreen extends ConsumerWidget {
  const WishlistScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final wishlistAsync = ref.watch(wishlistProductsProvider);
    final savedIds = ref.watch(savedProductIdsProvider);

    return Scaffold(
      backgroundColor: AppColors.stitchCanvas,
      appBar: AppBar(
        title: const Text('Saved Products'),
        backgroundColor: AppColors.stitchCanvas,
        elevation: 0,
        scrolledUnderElevation: 0,
        actions: [
          if (savedIds.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(right: AppSpacing.sm),
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.stitchAmber.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                  child: Text(
                    '${savedIds.length} Saved',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppColors.stitchAmber,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
      body: wishlistAsync.when(
        data: (products) {
          if (products.isEmpty) {
            return AppEmptyState(
              title: 'No Saved Products Yet',
              message:
                  'Items you bookmark with the heart icon while browsing will appear here for fast re-ordering.',
              icon: Icons.bookmark_border_rounded,
              actionLabel: 'Explore Catalog',
              onAction: () => context.go(AppRoutes.products),
            );
          }

          return RefreshIndicator(
            onRefresh: () => ref.refresh(wishlistProductsProvider.future),
            color: AppColors.stitchForestGreen,
            child: GridView.builder(
              padding: const EdgeInsets.all(AppSpacing.md),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.68,
                crossAxisSpacing: AppSpacing.md,
                mainAxisSpacing: AppSpacing.md,
              ),
              itemCount: products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                return ProductCard(
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  unit: product.unit,
                  sellerName: product.sellerName,
                  category: product.category,
                  imageUrl: product.imageUrl,
                  rating: product.rating,
                  reviewCount: product.reviewCount,
                  inStock: product.inStock,
                  isFavorite: true,
                  onTap: () {
                    context.push('${AppRoutes.products}/${product.id}');
                  },
                  onToggleFavorite: () {
                    ref.read(wishlistProvider.notifier).toggle(product.id);
                  },
                  onAddToCart: () {
                    ref.read(cartItemsProvider.notifier).addItem(product);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Added ${product.title} to cart'),
                        backgroundColor: AppColors.stitchForestGreen,
                        duration: const Duration(seconds: 2),
                        action: SnackBarAction(
                          label: 'View Cart',
                          textColor: Colors.white,
                          onPressed: () => context.push(AppRoutes.cartCheckout),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          );
        },
        loading: () => const Center(
          child: AppSpinner(size: 36),
        ),
        error: (error, _) => Center(
          child: AppErrorState(
            title: 'Failed to load wishlist',
            message: error.toString(),
            onRetry: () => ref.invalidate(wishlistProductsProvider),
          ),
        ),
      ),
    );
  }
}
