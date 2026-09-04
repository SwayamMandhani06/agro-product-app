import 'package:fpdart/fpdart.dart';
import '../../../core/error/failure.dart';
import '../../products/domain/product.dart';

/// Contract for farmer wishlist/saved products management.
abstract class WishlistRepository {
  /// Fetches the set of saved product IDs.
  Future<Result<Set<String>>> getWishlistProductIds();

  /// Fetches the full product entities currently in the user's wishlist.
  Future<Result<List<Product>>> getWishlistProducts();

  /// Adds a product to the wishlist.
  Future<Result<Unit>> addToWishlist(String productId);

  /// Removes a product from the wishlist.
  Future<Result<Unit>> removeFromWishlist(String productId);

  /// Toggles saved state of a product. Returns true if now saved.
  Future<Result<bool>> toggleWishlist(String productId);
}
