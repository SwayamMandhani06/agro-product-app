import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/config/backend_config.dart';
import '../../data/mock_product_repository.dart';
import '../../data/supabase_product_repository.dart';
import '../../domain/product.dart';
import '../../domain/product_repository.dart';

final productRepositoryProvider = Provider<ProductRepository>((ref) {
  if (BackendConfig.isConfigured) {
    return SupabaseProductRepository();
  }
  return const MockProductRepository();
});

final featuredProductsProvider = FutureProvider<List<Product>>((ref) async {
  final repo = ref.watch(productRepositoryProvider);
  final result = await repo.getFeaturedProducts();
  return result.fold(
    (failure) => throw Exception(failure.message),
    (products) => products,
  );
});

final categoriesProvider = FutureProvider<List<ProductCategory>>((ref) async {
  final repo = ref.watch(productRepositoryProvider);
  final result = await repo.getCategories();
  return result.fold(
    (failure) => throw Exception(failure.message),
    (categories) => categories,
  );
});

/// User profile greeting name provider with safe fallback 'Farmer'.
final farmerNameProvider = Provider<String>((ref) {
  return 'Farmer';
});

/// Active catalog filter criteria.
final productFilterProvider = StateProvider<ProductFilter>((ref) {
  return ProductFilter.empty;
});

/// Active catalog sort ordering.
final productSortProvider = StateProvider<ProductSort>((ref) {
  return ProductSort.featured;
});

/// Active search query in product discovery.
final productSearchQueryProvider = StateProvider<String>((ref) {
  return '';
});

/// Reactive filtered and sorted product catalogue list provider.
final productsListProvider = FutureProvider.family<List<Product>, ({String? category, String? query})>(
  (ref, params) async {
    final repo = ref.watch(productRepositoryProvider);
    final filter = ref.watch(productFilterProvider);
    final sort = ref.watch(productSortProvider);

    final result = await repo.getProducts(
      category: params.category,
      query: params.query,
      filter: filter,
      sort: sort,
    );

    return result.fold(
      (failure) => throw Exception(failure.message),
      (products) => products,
    );
  },
);

/// Product details provider for a specific product ID.
final productDetailsProvider = FutureProvider.family<Product, String>((ref, id) async {
  final repo = ref.watch(productRepositoryProvider);
  final result = await repo.getProductById(id);
  return result.fold(
    (failure) => throw Exception(failure.message),
    (product) => product,
  );
});

/// Similar products provider for recommendations on product details.
final similarProductsProvider = FutureProvider.family<List<Product>, String>((ref, productId) async {
  final repo = ref.watch(productRepositoryProvider);
  final result = await repo.getSimilarProducts(productId);
  return result.fold(
    (failure) => throw Exception(failure.message),
    (products) => products,
  );
});

/// Quantity counter provider for the Product Details screen.
final productQuantityProvider = StateProvider.autoDispose.family<int, String>((ref, productId) {
  return 1;
});
