import 'package:fpdart/fpdart.dart';
import '../../../core/error/failure.dart';
import '../../products/domain/product.dart';
import '../../products/domain/product_repository.dart';
import '../../products/data/mock_product_repository.dart';
import '../domain/wishlist_repository.dart';

/// In-memory mock implementation of [WishlistRepository].
class MockWishlistRepository implements WishlistRepository {
  MockWishlistRepository({
    ProductRepository? productRepository,
    Set<String>? initialIds,
  })  : _productRepository = productRepository ?? const MockProductRepository(),
        _savedIds = initialIds != null ? Set.from(initialIds) : {'prod_1', 'prod_4'};

  final ProductRepository _productRepository;
  final Set<String> _savedIds;

  @override
  Future<Result<Set<String>>> getWishlistProductIds() async {
    return right(Set.unmodifiable(_savedIds));
  }

  @override
  Future<Result<List<Product>>> getWishlistProducts() async {
    final productsResult = await _productRepository.getProducts();
    return productsResult.map((allProducts) {
      return allProducts.where((p) => _savedIds.contains(p.id)).toList();
    });
  }

  @override
  Future<Result<Unit>> addToWishlist(String productId) async {
    _savedIds.add(productId);
    return right(unit);
  }

  @override
  Future<Result<Unit>> removeFromWishlist(String productId) async {
    _savedIds.remove(productId);
    return right(unit);
  }

  @override
  Future<Result<bool>> toggleWishlist(String productId) async {
    if (_savedIds.contains(productId)) {
      _savedIds.remove(productId);
      return right(false);
    } else {
      _savedIds.add(productId);
      return right(true);
    }
  }
}
