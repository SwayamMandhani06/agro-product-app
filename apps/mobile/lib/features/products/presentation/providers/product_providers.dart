import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/mock_product_repository.dart';
import '../../domain/product.dart';
import '../../domain/product_repository.dart';

final productRepositoryProvider = Provider<ProductRepository>((ref) {
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
