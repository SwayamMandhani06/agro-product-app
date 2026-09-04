import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_radius.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/routing/routes.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_error_state.dart';
import '../../../core/widgets/app_loading.dart';
import '../../../core/widgets/price_text.dart';
import '../../../core/widgets/product_card.dart';
import '../../cart_checkout/presentation/providers/cart_providers.dart';
import '../../reviews/presentation/providers/reviews_provider.dart';
import '../../reviews/presentation/widgets/review_card.dart';
import '../../reviews/presentation/widgets/review_summary_card.dart';
import '../../reviews/presentation/widgets/write_review_sheet.dart';
import '../../wishlist/presentation/providers/wishlist_provider.dart';
import '../domain/product.dart';
import 'providers/product_providers.dart';
import 'providers/recently_viewed_provider.dart';

/// Full-screen Product Details screen featuring media gallery, specs, seller info,
/// similar product recommendations, and a sticky add-to-cart bottom bar.
///
/// Matches Google Stitch `AgriTrade Product Details - Soybean Seeds` visual specifications.
class ProductDetailsScreen extends ConsumerStatefulWidget {
  const ProductDetailsScreen({
    super.key,
    required this.productId,
  });

  final String productId;

  @override
  ConsumerState<ProductDetailsScreen> createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends ConsumerState<ProductDetailsScreen> {
  int _currentImageIndex = 0;
  bool _recordedView = false;
  late final PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onAddToCart(Product product, int quantity) {
    HapticFeedback.mediumImpact();
    ref.read(cartItemsProvider.notifier).addItem(product, quantity: quantity);
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Added $quantity x "${product.title}" to cart'),
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppColors.stitchForestGreen,
        action: SnackBarAction(
          label: 'VIEW CART',
          textColor: Colors.white,
          onPressed: () => context.push(AppRoutes.cartCheckout),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final productAsync = ref.watch(productDetailsProvider(widget.productId));
    final quantity = ref.watch(productQuantityProvider(widget.productId));

    return productAsync.when(
      data: (product) => _buildProductScaffold(context, product, quantity),
      loading: () => const Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: AppSpinner(size: 32),
        ),
      ),
      error: (error, _) => Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ),
        body: Center(
          child: AppErrorState(
            title: 'Product not found',
            message: error.toString(),
            onRetry: () => ref.refresh(productDetailsProvider(widget.productId)),
          ),
        ),
      ),
    );
  }

  Widget _buildProductScaffold(BuildContext context, Product product, int quantity) {
    final bottomPadding = MediaQuery.of(context).padding.bottom;
    final cartCount = ref.watch(cartItemCountProvider);
    final isSaved = ref.watch(isProductSavedProvider(product.id));

    // Record view into recently viewed history (once per screen load)
    if (!_recordedView) {
      _recordedView = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ref.read(recentlyViewedProvider.notifier).recordView(product);
      });
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: AppColors.surface.withValues(alpha: 0.85),
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: CircleAvatar(
            backgroundColor: AppColors.surface,
            child: IconButton(
              icon: const Icon(Icons.arrow_back_rounded, size: 20),
              color: AppColors.textPrimary,
              onPressed: () => Navigator.of(context).pop(),
            ),
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: CircleAvatar(
              backgroundColor: AppColors.surface,
              child: IconButton(
                icon: const Icon(Icons.share_outlined, size: 20),
                color: AppColors.textPrimary,
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Product link copied to clipboard'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                },
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: CircleAvatar(
              backgroundColor: AppColors.surface,
              child: IconButton(
                icon: Icon(
                  isSaved
                      ? Icons.favorite_rounded
                      : Icons.favorite_border_rounded,
                  size: 20,
                  color: isSaved
                      ? AppColors.error
                      : AppColors.textPrimary,
                ),
                onPressed: () {
                  ref.read(wishlistProvider.notifier).toggle(product.id);
                },
              ),
            ),
          ),
          // Shopping Cart Action Icon with Badge
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: CircleAvatar(
              backgroundColor: AppColors.surface,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  IconButton(
                    icon: const Icon(Icons.shopping_bag_outlined, size: 20),
                    color: AppColors.textPrimary,
                    onPressed: () => context.push(AppRoutes.cartCheckout),
                  ),
                  if (cartCount > 0)
                    Positioned(
                      top: 4,
                      right: 4,
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: const BoxDecoration(
                          color: AppColors.stitchForestGreen,
                          shape: BoxShape.circle,
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 16,
                          minHeight: 16,
                        ),
                        child: Text(
                          cartCount > 99 ? '99+' : '$cartCount',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Stack(
        children: [
          ListView(
            padding: EdgeInsets.fromLTRB(0, 0, 0, 100 + bottomPadding),
            children: [
              // 1. Media Carousel
              _buildMediaGallery(product),

              // 2. Product Information Content
              Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Brand / Tag
                    if (product.brand != null || product.sellerName != null) ...[
                      Text(
                        (product.brand ?? product.sellerName!).toUpperCase(),
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.0,
                          color: AppColors.textTertiary,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xxs),
                    ],

                    // Title
                    Text(
                      product.title,
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                        height: 1.25,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),

                    // Rating & Reviews
                    if (product.rating != null) ...[
                      Row(
                        children: [
                          const Icon(
                            Icons.star_rounded,
                            size: 18,
                            color: AppColors.stitchAmber,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            product.rating!.toStringAsFixed(1),
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          if (product.reviewCount != null) ...[
                            const SizedBox(width: 6),
                            Text(
                              '(${product.reviewCount} reviews)',
                              style: const TextStyle(
                                fontSize: 13,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: AppSpacing.md),
                    ],

                    // Pricing & Availability Card
                    _buildPricingCard(product),
                    const SizedBox(height: AppSpacing.md),

                    // Delivery Location Tile
                    _buildDeliveryTile(product),
                    const SizedBox(height: AppSpacing.md),

                    // Verified Seller Tile
                    _buildSellerTile(product),
                    const SizedBox(height: AppSpacing.md),

                    // Accordions: Description, Highlights, Specifications
                    _buildAccordionSection(product),
                    const SizedBox(height: AppSpacing.lg),

                    // Customer Ratings & Agronomic Reviews
                    _buildReviewsSection(context, product),
                    const SizedBox(height: AppSpacing.lg),

                    // Similar Products Section
                    _buildSimilarProducts(product),
                    const SizedBox(height: AppSpacing.lg),

                    // Recently Viewed Products Section
                    _buildRecentlyViewedSection(context, product.id),
                    const SizedBox(height: 80), // Padding above sticky bottom bar
                  ],
                ),
              ),
            ],
          ),

          // 3. Sticky Bottom Action Bar
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: _buildStickyBottomBar(context, product, quantity, bottomPadding),
          ),
        ],
      ),
    );
  }

  Widget _buildMediaGallery(Product product) {
    final images = product.galleryImages;

    return Container(
      width: double.infinity,
      color: AppColors.stitchCanvas,
      child: Stack(
        children: [
          AspectRatio(
            aspectRatio: 1.05,
            child: images.isNotEmpty
                ? PageView.builder(
                    controller: _pageController,
                    itemCount: images.length,
                    onPageChanged: (idx) {
                      setState(() {
                        _currentImageIndex = idx;
                      });
                    },
                    itemBuilder: (context, index) {
                      return CachedNetworkImage(
                        imageUrl: images[index],
                        fit: BoxFit.cover,
                        placeholder: (_, __) => const Center(
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                        errorWidget: (_, __, ___) => _buildImageFallback(),
                      );
                    },
                  )
                : _buildImageFallback(),
          ),

          // Indicators
          if (images.length > 1)
            Positioned(
              bottom: AppSpacing.md,
              left: 0,
              right: 0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(images.length, (idx) {
                  final isSelected = _currentImageIndex == idx;
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    width: isSelected ? 16 : 6,
                    height: 6,
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppColors.stitchForestGreen
                          : AppColors.neutral300,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                  );
                }),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildImageFallback() {
    return Container(
      color: AppColors.stitchCanvas,
      child: const Center(
        child: Icon(
          Icons.eco_rounded,
          size: 72,
          color: AppColors.stitchForestGreen,
        ),
      ),
    );
  }

  Widget _buildPricingCard(Product product) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.neutral200),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 10,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          PriceText(
            price: product.price,
            originalPrice: product.originalPrice,
            unit: product.unit,
            size: PriceTextSize.large,
            showDiscountBadge: true,
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Pack size: ${product.unit}',
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          const Divider(height: 1, color: AppColors.neutral200),
          const SizedBox(height: AppSpacing.sm),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: product.inStock
                          ? AppColors.success
                          : AppColors.error,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    product.inStock ? 'In stock' : 'Out of stock',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: product.inStock
                          ? AppColors.success
                          : AppColors.error,
                    ),
                  ),
                ],
              ),
              if (product.stockCount != null && product.stockCount! <= 15)
                Text(
                  'Only ${product.stockCount} packs left',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.error,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDeliveryTile(Product product) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.stitchCanvas,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.neutral200),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Icon(
                Icons.location_on_outlined,
                color: AppColors.stitchForestGreen,
                size: 22,
              ),
              const SizedBox(width: AppSpacing.sm),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Deliver to',
                    style: TextStyle(
                      fontSize: 11,
                      color: AppColors.textTertiary,
                    ),
                  ),
                  Text(
                    product.deliveryLocation ?? 'Pune, Maharashtra',
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
          TextButton(
            onPressed: () {
              context.push(AppRoutes.addresses);
            },
            style: TextButton.styleFrom(
              foregroundColor: AppColors.stitchForestGreen,
              textStyle: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
              ),
            ),
            child: const Text('Change'),
          ),
        ],
      ),
    );
  }

  Widget _buildSellerTile(Product product) {
    final sellerName = product.sellerName ?? 'AgriGrow Official';

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.neutral200),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.stitchCanvas,
              borderRadius: BorderRadius.circular(AppRadius.full),
            ),
            child: const Icon(
              Icons.storefront_rounded,
              color: AppColors.stitchForestGreen,
              size: 24,
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      sellerName,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Icon(
                      Icons.verified_rounded,
                      size: 16,
                      color: AppColors.stitchForestGreen,
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  '${product.sellerRating ?? 4.9} Seller Rating',
                  style: const TextStyle(
                    fontSize: 12,
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

  Widget _buildAccordionSection(Product product) {
    return Material(
      color: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        side: const BorderSide(color: AppColors.neutral200),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          // 1. Description
          ExpansionTile(
            initiallyExpanded: true,
            title: const Text(
              'Product Description',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppSpacing.md,
                  0,
                  AppSpacing.md,
                  AppSpacing.md,
                ),
                child: Text(
                  product.description ??
                      'High-quality agricultural product tested and certified for Indian farming conditions.',
                  style: const TextStyle(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                    height: 1.4,
                  ),
                ),
              ),
            ],
          ),
          const Divider(height: 1, color: AppColors.neutral200),

          // 2. Highlights
          if (product.highlights != null && product.highlights!.isNotEmpty) ...[
            ExpansionTile(
              initiallyExpanded: true,
              title: const Text(
                'Key Highlights',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    AppSpacing.md,
                    0,
                    AppSpacing.md,
                    AppSpacing.md,
                  ),
                  child: Column(
                    children: product.highlights!.map((highlight) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: AppSpacing.xs),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(
                              Icons.check_circle_outline_rounded,
                              size: 16,
                              color: AppColors.stitchForestGreen,
                            ),
                            const SizedBox(width: AppSpacing.xs),
                            Expanded(
                              child: Text(
                                highlight,
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: AppColors.textSecondary,
                                  height: 1.3,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
            const Divider(height: 1, color: AppColors.neutral200),
          ],

          // 3. Specifications
          if (product.specifications != null && product.specifications!.isNotEmpty)
            ExpansionTile(
              initiallyExpanded: true,
              title: const Text(
                'Specifications',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    AppSpacing.md,
                    0,
                    AppSpacing.md,
                    AppSpacing.md,
                  ),
                  child: Column(
                    children: product.specifications!.entries.map((entry) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              entry.key,
                              style: const TextStyle(
                                fontSize: 13,
                                color: AppColors.textTertiary,
                              ),
                            ),
                            Text(
                              entry.value,
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }

  Widget _buildSimilarProducts(Product product) {
    final similarAsync = ref.watch(similarProductsProvider(product.id));

    return similarAsync.when(
      data: (similarProducts) {
        if (similarProducts.isEmpty) return const SizedBox.shrink();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Similar Products',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            SizedBox(
              height: 295,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: similarProducts.length,
                separatorBuilder: (_, __) => const SizedBox(width: AppSpacing.sm),
                itemBuilder: (context, index) {
                  final item = similarProducts[index];
                  return SizedBox(
                    width: 170,
                    child: ProductCard(
                      id: item.id,
                      title: item.title,
                      price: item.price,
                      originalPrice: item.originalPrice,
                      unit: item.unit,
                      sellerName: item.sellerName,
                      category: item.category,
                      imageUrl: item.imageUrl,
                      rating: item.rating,
                      reviewCount: item.reviewCount,
                      inStock: item.inStock,
                      isFavorite: item.isFavorite,
                      variant: ProductCardVariant.grid,
                      onTap: () {
                        context.push('${AppRoutes.products}/${item.id}');
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        );
      },
      loading: () => const SizedBox.shrink(),
      error: (_, __) => const SizedBox.shrink(),
    );
  }

  Widget _buildReviewsSection(BuildContext context, Product product) {
    final summaryAsync = ref.watch(productReviewSummaryProvider(product.id));
    final reviewsAsync = ref.watch(productReviewsProvider(product.id));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Expanded(
              child: Text(
                'Ratings & Farmer Reviews',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            TextButton(
              onPressed: () {
                WriteReviewSheet.show(
                  context,
                  productId: product.id,
                  productTitle: product.title,
                );
              },
              child: const Text(
                'Write Review',
                style: TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.stitchForestGreen,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.xs),

        // Summary Breakdown Card
        summaryAsync.when(
          data: (summary) => ReviewSummaryCard(summary: summary),
          loading: () => const SizedBox.shrink(),
          error: (_, __) => const SizedBox.shrink(),
        ),
        const SizedBox(height: AppSpacing.sm),

        // Top 2 Reviews
        reviewsAsync.when(
          data: (reviews) {
            if (reviews.isEmpty) return const SizedBox.shrink();
            return Column(
              children: reviews.take(2).map((r) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                  child: ReviewCard(review: r),
                );
              }).toList(),
            );
          },
          loading: () => const SizedBox.shrink(),
          error: (_, __) => const SizedBox.shrink(),
        ),
      ],
    );
  }

  Widget _buildRecentlyViewedSection(BuildContext context, String currentProductId) {
    final recentItems = ref.watch(recentProductsExcludingProvider(currentProductId));
    if (recentItems.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Recently Inspected Inputs',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        SizedBox(
          height: 295,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: recentItems.length,
            separatorBuilder: (_, __) => const SizedBox(width: AppSpacing.sm),
            itemBuilder: (context, index) {
              final item = recentItems[index];
              return SizedBox(
                width: 170,
                child: ProductCard(
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  unit: item.unit,
                  sellerName: item.sellerName,
                  category: item.category,
                  imageUrl: item.imageUrl,
                  rating: item.rating,
                  reviewCount: item.reviewCount,
                  inStock: item.inStock,
                  variant: ProductCardVariant.grid,
                  onTap: () {
                    context.push('${AppRoutes.products}/${item.id}');
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildStickyBottomBar(
    BuildContext context,
    Product product,
    int quantity,
    double bottomPadding,
  ) {
    return Container(
      padding: EdgeInsets.fromLTRB(
        AppSpacing.md,
        AppSpacing.sm,
        AppSpacing.md,
        AppSpacing.sm + bottomPadding,
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
          // Quantity Selector
          Container(
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.stitchCanvas,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.neutral200),
            ),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.remove_rounded, size: 18),
                  color: quantity > 1
                      ? AppColors.textPrimary
                      : AppColors.neutral300,
                  onPressed: quantity > 1
                      ? () {
                          ref
                              .read(productQuantityProvider(product.id).notifier)
                              .state--;
                        }
                      : null,
                ),
                Text(
                  '$quantity',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.add_rounded, size: 18),
                  color: AppColors.textPrimary,
                  onPressed: () {
                    ref
                        .read(productQuantityProvider(product.id).notifier)
                        .state++;
                  },
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.sm),

          // Add to Cart Button
          Expanded(
            child: SizedBox(
              height: 48,
              child: AppButton(
                label: product.inStock ? 'Add to Cart' : 'Out of Stock',
                variant: AppButtonVariant.primary,
                size: AppButtonSize.large,
                leadingIcon: const Icon(Icons.shopping_cart_outlined, size: 20),
                onPressed: product.inStock
                    ? () => _onAddToCart(product, quantity)
                    : null,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
