import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/config/backend_config.dart';
import '../../../products/domain/product.dart';
import '../../../products/presentation/providers/product_providers.dart';
import '../../data/mock_wishlist_repository.dart';
import '../../data/supabase_wishlist_repository.dart';
import '../../domain/wishlist_repository.dart';

/// Wishlist repository provider with conditional Supabase/Mock resolution.
final wishlistRepositoryProvider = Provider<WishlistRepository>((ref) {
  final productRepo = ref.watch(productRepositoryProvider);
  if (BackendConfig.isConfigured) {
    return SupabaseWishlistRepository(productRepository: productRepo);
  }
  return MockWishlistRepository(productRepository: productRepo);
});

/// StateNotifier that acts as the single source of truth for saved product IDs across the entire app.
class WishlistNotifier extends StateNotifier<AsyncValue<Set<String>>> {
  WishlistNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadWishlist();
  }

  final WishlistRepository _repository;

  Future<void> loadWishlist() async {
    state = const AsyncValue.loading();
    final result = await _repository.getWishlistProductIds();
    result.fold(
      (failure) => state = AsyncValue.error(failure, StackTrace.current),
      (ids) => state = AsyncValue.data(ids),
    );
  }

  Future<bool> toggle(String productId) async {
    final currentIds = state.value ?? <String>{};
    final isSaved = currentIds.contains(productId);

    // Optimistic UI update
    final updated = Set<String>.from(currentIds);
    if (isSaved) {
      updated.remove(productId);
    } else {
      updated.add(productId);
    }
    state = AsyncValue.data(updated);

    final result = await _repository.toggleWishlist(productId);
    return result.fold(
      (failure) {
        // Rollback on failure
        state = AsyncValue.data(currentIds);
        return isSaved;
      },
      (nowSaved) => nowSaved,
    );
  }

  Future<void> remove(String productId) async {
    final currentIds = state.value ?? <String>{};
    if (!currentIds.contains(productId)) return;

    final updated = Set<String>.from(currentIds)..remove(productId);
    state = AsyncValue.data(updated);

    final result = await _repository.removeFromWishlist(productId);
    result.fold(
      (_) => state = AsyncValue.data(currentIds), // Rollback on error
      (_) {},
    );
  }
}

/// Global provider for the WishlistNotifier.
final wishlistProvider =
    StateNotifierProvider<WishlistNotifier, AsyncValue<Set<String>>>((ref) {
  final repo = ref.watch(wishlistRepositoryProvider);
  return WishlistNotifier(repo);
});

/// Selector provider exposing the set of saved product IDs.
final savedProductIdsProvider = Provider<Set<String>>((ref) {
  final asyncValue = ref.watch(wishlistProvider);
  return asyncValue.value ?? const <String>{};
});

/// Family provider to check if a specific product ID is saved.
final isProductSavedProvider = Provider.family<bool, String>((ref, productId) {
  final savedIds = ref.watch(savedProductIdsProvider);
  return savedIds.contains(productId);
});

/// Provider fetching full Product models for the user's wishlist.
final wishlistProductsProvider = FutureProvider<List<Product>>((ref) async {
  final repo = ref.watch(wishlistRepositoryProvider);
  // Re-run whenever the set of saved IDs changes
  ref.watch(savedProductIdsProvider);

  final result = await repo.getWishlistProducts();
  return result.fold(
    (failure) => throw failure,
    (products) => products,
  );
});
