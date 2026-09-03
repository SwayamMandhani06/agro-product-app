import '../../../core/error/failure.dart';
import '../../products/domain/product.dart';
import 'cart_item.dart';

abstract interface class CartRepository {
  Future<Result<List<CartItem>>> getCartItems();
  Future<Result<List<CartItem>>> addItem(Product product, {int quantity = 1});
  Future<Result<List<CartItem>>> updateQuantity(String productId, int quantity);
  Future<Result<List<CartItem>>> removeItem(String productId);
  Future<Result<void>> clearCart();
}
