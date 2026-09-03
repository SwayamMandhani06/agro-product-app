import 'package:fpdart/fpdart.dart';

import '../../../core/error/failure.dart';
import '../../products/domain/product.dart';
import '../domain/cart_item.dart';
import '../domain/cart_repository.dart';

/// In-memory mock implementation of [CartRepository].
class MockCartRepository implements CartRepository {
  MockCartRepository([List<CartItem>? initialItems]) {
    if (initialItems != null) {
      _items.addAll(initialItems);
    }
  }

  final List<CartItem> _items = [];

  @override
  Future<Result<List<CartItem>>> getCartItems() async {
    return right(List.unmodifiable(_items));
  }

  @override
  Future<Result<List<CartItem>>> addItem(
    Product product, {
    int quantity = 1,
  }) async {
    final existingIndex = _items.indexWhere(
      (item) => item.product.id == product.id,
    );

    if (existingIndex >= 0) {
      final existing = _items[existingIndex];
      _items[existingIndex] = existing.copyWith(
        quantity: existing.quantity + quantity,
      );
    } else {
      _items.add(CartItem(product: product, quantity: quantity));
    }

    return right(List.unmodifiable(_items));
  }

  @override
  Future<Result<List<CartItem>>> updateQuantity(
    String productId,
    int quantity,
  ) async {
    if (quantity <= 0) {
      return removeItem(productId);
    }

    final index = _items.indexWhere(
      (item) => item.product.id == productId,
    );

    if (index >= 0) {
      _items[index] = _items[index].copyWith(quantity: quantity);
    }

    return right(List.unmodifiable(_items));
  }

  @override
  Future<Result<List<CartItem>>> removeItem(String productId) async {
    _items.removeWhere((item) => item.product.id == productId);
    return right(List.unmodifiable(_items));
  }

  @override
  Future<Result<void>> clearCart() async {
    _items.clear();
    return right(null);
  }
}
