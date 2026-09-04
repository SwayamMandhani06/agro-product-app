import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:fpdart/fpdart.dart';

import '../../../core/config/backend_config.dart';
import '../../../core/error/failure.dart';
import '../../products/domain/product.dart';
import '../../products/domain/product_repository.dart';
import '../domain/wishlist_repository.dart';
import 'mock_wishlist_repository.dart';

/// Supabase PostgREST implementation of [WishlistRepository] with mock fallback.
class SupabaseWishlistRepository implements WishlistRepository {
  SupabaseWishlistRepository({
    Dio? dio,
    ProductRepository? productRepository,
  })  : _dio = dio ?? Dio(),
        _mock = MockWishlistRepository(productRepository: productRepository);

  final Dio _dio;
  final MockWishlistRepository _mock;

  @override
  Future<Result<Set<String>>> getWishlistProductIds() async {
    if (!BackendConfig.isConfigured) return _mock.getWishlistProductIds();

    try {
      final response = await _dio.get(
        '${BackendConfig.restBaseUrl}/wishlists',
        queryParameters: {'select': 'product_id'},
        options: Options(headers: BackendConfig.headers),
      );

      final rows = response.data as List;
      final ids = rows.map((r) => r['product_id'] as String).toSet();
      return right(ids);
    } catch (e) {
      debugPrint('[SupabaseWishlistRepository] getWishlistProductIds error: $e');
      return _mock.getWishlistProductIds();
    }
  }

  @override
  Future<Result<List<Product>>> getWishlistProducts() async {
    if (!BackendConfig.isConfigured) return _mock.getWishlistProducts();

    try {
      final idsResult = await getWishlistProductIds();
      return idsResult.fold(
        (failure) => left(failure),
        (ids) async {
          if (ids.isEmpty) return right(<Product>[]);
          return _mock.getWishlistProducts();
        },
      );
    } catch (e) {
      debugPrint('[SupabaseWishlistRepository] getWishlistProducts error: $e');
      return _mock.getWishlistProducts();
    }
  }

  @override
  Future<Result<Unit>> addToWishlist(String productId) async {
    if (!BackendConfig.isConfigured) return _mock.addToWishlist(productId);

    try {
      await _dio.post(
        '${BackendConfig.restBaseUrl}/wishlists',
        data: {
          'user_id': 'usr_default',
          'product_id': productId,
        },
        options: Options(headers: BackendConfig.headers),
      );
      await _mock.addToWishlist(productId);
      return right(unit);
    } catch (e) {
      debugPrint('[SupabaseWishlistRepository] addToWishlist error: $e');
      return _mock.addToWishlist(productId);
    }
  }

  @override
  Future<Result<Unit>> removeFromWishlist(String productId) async {
    if (!BackendConfig.isConfigured) return _mock.removeFromWishlist(productId);

    try {
      await _dio.delete(
        '${BackendConfig.restBaseUrl}/wishlists',
        queryParameters: {'product_id': 'eq.$productId'},
        options: Options(headers: BackendConfig.headers),
      );
      await _mock.removeFromWishlist(productId);
      return right(unit);
    } catch (e) {
      debugPrint('[SupabaseWishlistRepository] removeFromWishlist error: $e');
      return _mock.removeFromWishlist(productId);
    }
  }

  @override
  Future<Result<bool>> toggleWishlist(String productId) async {
    final idsResult = await getWishlistProductIds();
    final ids = idsResult.getOrElse((_) => <String>{});
    if (ids.contains(productId)) {
      await removeFromWishlist(productId);
      return right(false);
    } else {
      await addToWishlist(productId);
      return right(true);
    }
  }
}
