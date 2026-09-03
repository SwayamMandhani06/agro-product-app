import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_radius.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/routing/routes.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_error_state.dart';
import '../../../core/widgets/app_loading.dart';
import '../../../core/widgets/product_card.dart';
import '../domain/product.dart';
import 'providers/product_providers.dart';
import '../../cart_checkout/presentation/providers/cart_providers.dart';
import 'widgets/product_filter_sheet.dart';
import 'widgets/product_sort_sheet.dart';

/// Product catalogue listing screen supporting category browsing, live search,
/// multi-criteria filtering, and custom sorting.
///
/// Matches Google Stitch `AgriTrade Product List - Seeds` visual specifications.
class ProductsScreen extends ConsumerStatefulWidget {
  const ProductsScreen({
    super.key,
    this.initialCategory,
    this.initialQuery,
  });

  final String? initialCategory;
  final String? initialQuery;

  @override
  ConsumerState<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends ConsumerState<ProductsScreen> {
  late final TextEditingController _searchController;
  late String? _activeCategory;
  late String _currentQuery;

  @override
  void initState() {
    super.initState();
    _activeCategory = widget.initialCategory;
    _currentQuery = widget.initialQuery ?? '';
    _searchController = TextEditingController(text: _currentQuery);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    setState(() {
      _currentQuery = query;
    });
  }

  void _openFilters() {
    ProductFilterSheet.show(context, currentCategory: _activeCategory);
  }

  void _openSort() {
    ProductSortSheet.show(context);
  }

  void _onProductTapped(Product product) {
    context.push('${AppRoutes.products}/${product.id}');
  }

  void _onAddToCart(Product product) {
    ref.read(cartItemsProvider.notifier).addItem(product, quantity: 1);
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Added ${product.title} to cart'),
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
    final filter = ref.watch(productFilterProvider);
    final sort = ref.watch(productSortProvider);

    // Effective category is from filter if set, otherwise activeCategory
    final effectiveCategory = filter.category ?? _activeCategory;

    final productsAsync = ref.watch(
      productsListProvider((
        category: effectiveCategory,
        query: _currentQuery,
      )),
    );

    final title = (effectiveCategory != null && effectiveCategory.isNotEmpty && effectiveCategory != 'All')
        ? effectiveCategory
        : 'All Products';

    final activeFilterCount = filter.activeFilterCount;
    final cartCount = ref.watch(cartItemCountProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(Icons.arrow_back_rounded),
                color: AppColors.textPrimary,
                onPressed: () => Navigator.of(context).pop(),
              )
            : null,
        title: Text(
          title,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        backgroundColor: AppColors.surface,
        elevation: 0,
        centerTitle: false,
        actions: [
          Stack(
            alignment: Alignment.center,
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart_outlined),
                color: AppColors.textPrimary,
                tooltip: 'Cart',
                onPressed: () => context.push(AppRoutes.cartCheckout),
              ),
              if (cartCount > 0)
                Positioned(
                  top: 8,
                  right: 8,
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
          const SizedBox(width: 4),
        ],
      ),
      body: Column(
        children: [
          // 1. Search Bar Header
          Container(
            color: AppColors.surface,
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.md,
              0,
              AppSpacing.md,
              AppSpacing.sm,
            ),
            child: Container(
              decoration: BoxDecoration(
                color: AppColors.neutral100,
                borderRadius: BorderRadius.circular(AppRadius.full),
                border: Border.all(color: AppColors.neutral200),
              ),
              child: TextField(
                controller: _searchController,
                textInputAction: TextInputAction.search,
                onChanged: _onSearchChanged,
                decoration: InputDecoration(
                  hintText: 'Search $title...',
                  hintStyle: const TextStyle(
                    fontSize: 14,
                    color: AppColors.textTertiary,
                  ),
                  prefixIcon: const Icon(
                    Icons.search_rounded,
                    color: AppColors.textSecondary,
                  ),
                  suffixIcon: _currentQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear_rounded, size: 18),
                          color: AppColors.textTertiary,
                          onPressed: () {
                            _searchController.clear();
                            _onSearchChanged('');
                          },
                        )
                      : null,
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.md,
                    vertical: AppSpacing.sm,
                  ),
                ),
              ),
            ),
          ),

          // 2. Filter & Sort Bar
          Container(
            color: AppColors.surface,
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.xs,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Product count label
                productsAsync.maybeWhen(
                  data: (products) => Text(
                    '${products.length} products',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  orElse: () => const Text(
                    'Searching...',
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.textTertiary,
                    ),
                  ),
                ),

                // Action pills: Filters & Sort
                Row(
                  children: [
                    // Filter Pill Button
                    InkWell(
                      onTap: _openFilters,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.sm,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: activeFilterCount > 0
                              ? AppColors.stitchForestGreen.withValues(alpha: 0.1)
                              : AppColors.surface,
                          borderRadius: BorderRadius.circular(AppRadius.full),
                          border: Border.all(
                            color: activeFilterCount > 0
                                ? AppColors.stitchForestGreen
                                : AppColors.neutral200,
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.tune_rounded,
                              size: 16,
                              color: activeFilterCount > 0
                                  ? AppColors.stitchForestGreen
                                  : AppColors.textPrimary,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              activeFilterCount > 0
                                  ? 'Filters ($activeFilterCount)'
                                  : 'Filters',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: activeFilterCount > 0
                                    ? AppColors.stitchForestGreen
                                    : AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.xs),

                    // Sort Pill Button
                    InkWell(
                      onTap: _openSort,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.sm,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(AppRadius.full),
                          border: Border.all(color: AppColors.neutral200),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.sort_rounded,
                              size: 16,
                              color: AppColors.textPrimary,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              sort == ProductSort.featured ? 'Sort' : sort.label,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.neutral200),

          // 3. Active filter chips row (if any)
          if (filter.hasActiveFilters) _buildActiveFilterChips(filter),

          // 4. Products Grid or Empty/Loading/Error State
          Expanded(
            child: productsAsync.when(
              data: (products) {
                if (products.isEmpty) {
                  return _buildEmptyState();
                }
                return _buildProductGrid(products);
              },
              loading: () => const Center(
                child: AppSpinner(size: 32),
              ),
              error: (error, _) => Center(
                child: AppErrorState(
                  title: 'Failed to load products',
                  message: error.toString(),
                  onRetry: () => ref.refresh(
                    productsListProvider((
                      category: effectiveCategory,
                      query: _currentQuery,
                    )),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveFilterChips(ProductFilter filter) {
    return Container(
      color: AppColors.surface,
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.md,
        AppSpacing.xs,
        AppSpacing.md,
        AppSpacing.xs,
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            if (filter.category != null)
              _buildFilterChip(
                label: filter.category!,
                onDeleted: () {
                  ref.read(productFilterProvider.notifier).state =
                      filter.copyWith(clearCategory: true);
                },
              ),
            if (filter.priceRange != null)
              _buildFilterChip(
                label: filter.priceRange!.label,
                onDeleted: () {
                  ref.read(productFilterProvider.notifier).state =
                      filter.copyWith(clearPriceRange: true);
                },
              ),
            if (filter.minRating != null)
              _buildFilterChip(
                label: '${filter.minRating}★ & above',
                onDeleted: () {
                  ref.read(productFilterProvider.notifier).state =
                      filter.copyWith(clearMinRating: true);
                },
              ),
            if (filter.inStockOnly)
              _buildFilterChip(
                label: 'In Stock Only',
                onDeleted: () {
                  ref.read(productFilterProvider.notifier).state =
                      filter.copyWith(inStockOnly: false);
                },
              ),
            TextButton(
              onPressed: () {
                ref.read(productFilterProvider.notifier).state =
                    ProductFilter.empty;
              },
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xs),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: const Text(
                'Clear all',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.error,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip({
    required String label,
    required VoidCallback onDeleted,
  }) {
    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.xs),
      child: Chip(
        label: Text(label),
        deleteIcon: const Icon(Icons.close_rounded, size: 14),
        onDeleted: onDeleted,
        backgroundColor: AppColors.stitchForestGreen.withValues(alpha: 0.1),
        labelStyle: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: AppColors.stitchForestGreen,
        ),
        deleteIconColor: AppColors.stitchForestGreen,
        side: BorderSide.none,
        padding: const EdgeInsets.symmetric(horizontal: 4),
        visualDensity: VisualDensity.compact,
      ),
    );
  }

  Widget _buildProductGrid(List<Product> products) {
    return GridView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: products.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: AppSpacing.md,
        mainAxisSpacing: AppSpacing.md,
        childAspectRatio: 0.58,
      ),
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
          isFavorite: product.isFavorite,
          variant: ProductCardVariant.grid,
          onTap: () => _onProductTapped(product),
          onAddToCart: () => _onAddToCart(product),
          onToggleFavorite: () {
            // Favorite toggle interaction
          },
        );
      },
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                color: AppColors.neutral100,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.search_off_rounded,
                size: 40,
                color: AppColors.textTertiary,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            const Text(
              'No products found',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.xs),
            const Text(
              'Try changing your filters or searching with different keywords.',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.lg),
            AppButton(
              label: 'Reset Filters',
              variant: AppButtonVariant.secondary,
              size: AppButtonSize.medium,
              leadingIcon: const Icon(Icons.refresh_rounded, size: 18),
              onPressed: () {
                _searchController.clear();
                _onSearchChanged('');
                ref.read(productFilterProvider.notifier).state =
                    ProductFilter.empty;
              },
            ),
          ],
        ),
      ),
    );
  }
}
