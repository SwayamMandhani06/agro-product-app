import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/product.dart';

const int kMaxRecentlyViewed = 8;

/// Manages recently viewed products in memory with deduplication and most-recent ordering.
class RecentlyViewedNotifier extends StateNotifier<List<Product>> {
  RecentlyViewedNotifier() : super(const []);

  /// Records a product view, placing it at the front of the history.
  void recordView(Product product) {
    final filtered = state.where((p) => p.id != product.id).toList();
    final updated = [product, ...filtered];
    if (updated.length > kMaxRecentlyViewed) {
      state = updated.sublist(0, kMaxRecentlyViewed);
    } else {
      state = updated;
    }
  }

  /// Clears recently viewed history.
  void clear() {
    state = const [];
  }
}

/// Global provider for recently viewed products history.
final recentlyViewedProvider =
    StateNotifierProvider<RecentlyViewedNotifier, List<Product>>((ref) {
  return RecentlyViewedNotifier();
});

/// Family provider returning recently viewed products excluding the currently viewed product.
final recentProductsExcludingProvider =
    Provider.family<List<Product>, String?>((ref, currentProductId) {
  final allRecent = ref.watch(recentlyViewedProvider);
  if (currentProductId == null) return allRecent;
  return allRecent.where((p) => p.id != currentProductId).toList();
});
