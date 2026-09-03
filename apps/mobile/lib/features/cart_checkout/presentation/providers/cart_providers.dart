import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../products/domain/product.dart';
import '../../data/mock_cart_repository.dart';
import '../../data/mock_order_repository.dart';
import '../../domain/cart_item.dart';
import '../../domain/cart_repository.dart';
import '../../domain/delivery_address.dart';
import '../../domain/order_repository.dart';

/// Singleton provider for the Cart Repository.
final cartRepositoryProvider = Provider<CartRepository>((ref) {
  return MockCartRepository();
});

/// Singleton provider for the Order Repository.
final orderRepositoryProvider = Provider<OrderRepository>((ref) {
  return MockOrderRepository();
});

/// State notifier managing the cart items and reactive state transitions.
class CartNotifier extends StateNotifier<List<CartItem>> {
  CartNotifier(this._repository) : super(const []) {
    _loadCart();
  }

  final CartRepository _repository;

  Future<void> _loadCart() async {
    final result = await _repository.getCartItems();
    result.fold(
      (failure) => null,
      (items) => state = items,
    );
  }

  /// Adds a product with the specified quantity.
  /// If product already exists, increments the quantity.
  Future<void> addItem(Product product, {int quantity = 1}) async {
    final result = await _repository.addItem(product, quantity: quantity);
    result.fold(
      (failure) => null,
      (items) => state = items,
    );
  }

  /// Sets an explicit quantity for a product.
  Future<void> updateQuantity(String productId, int quantity) async {
    final result = await _repository.updateQuantity(productId, quantity);
    result.fold(
      (failure) => null,
      (items) => state = items,
    );
  }

  /// Increments quantity by 1.
  Future<void> incrementQuantity(String productId) async {
    final item = state.firstWhere(
      (i) => i.product.id == productId,
      orElse: () => throw Exception('Product $productId not in cart'),
    );
    await updateQuantity(productId, item.quantity + 1);
  }

  /// Decrements quantity by 1. If reaches 0, removes the item.
  Future<void> decrementQuantity(String productId) async {
    final item = state.firstWhere(
      (i) => i.product.id == productId,
      orElse: () => throw Exception('Product $productId not in cart'),
    );
    if (item.quantity <= 1) {
      await removeItem(productId);
    } else {
      await updateQuantity(productId, item.quantity - 1);
    }
  }

  /// Removes product completely from cart.
  Future<void> removeItem(String productId) async {
    final result = await _repository.removeItem(productId);
    result.fold(
      (failure) => null,
      (items) => state = items,
    );
  }

  /// Empties the cart.
  Future<void> clearCart() async {
    await _repository.clearCart();
    state = const [];
  }
}

/// Global reactive cart items provider.
final cartItemsProvider =
    StateNotifierProvider<CartNotifier, List<CartItem>>((ref) {
  final repo = ref.watch(cartRepositoryProvider);
  return CartNotifier(repo);
});

/// Total number of individual items in the cart.
final cartItemCountProvider = Provider<int>((ref) {
  final items = ref.watch(cartItemsProvider);
  return items.fold(0, (sum, item) => sum + item.quantity);
});

/// Cart subtotal (discounted sum).
final cartSubtotalProvider = Provider<double>((ref) {
  final items = ref.watch(cartItemsProvider);
  return items.fold(0.0, (sum, item) => sum + item.totalPrice);
});

/// Cart total calculated using original prices before discounts.
final cartOriginalTotalProvider = Provider<double>((ref) {
  final items = ref.watch(cartItemsProvider);
  return items.fold(0.0, (sum, item) => sum + item.totalOriginalPrice);
});

/// Total discount savings for the cart.
final cartSavingsProvider = Provider<double>((ref) {
  final original = ref.watch(cartOriginalTotalProvider);
  final subtotal = ref.watch(cartSubtotalProvider);
  final savings = original - subtotal;
  return savings > 0 ? savings : 0.0;
});

/// Delivery fee: Free (₹0) if subtotal >= ₹1,000 or empty; otherwise standard ₹99.
final cartDeliveryFeeProvider = Provider<double>((ref) {
  final subtotal = ref.watch(cartSubtotalProvider);
  if (subtotal == 0) return 0.0;
  return subtotal >= 1000 ? 0.0 : 99.0;
});

/// Total payable amount: subtotal + delivery fee.
final cartTotalAmountProvider = Provider<double>((ref) {
  final subtotal = ref.watch(cartSubtotalProvider);
  if (subtotal == 0) return 0.0;
  final deliveryFee = ref.watch(cartDeliveryFeeProvider);
  return subtotal + deliveryFee;
});

/// Pre-populated realistic delivery addresses matching Stitch designs.
final savedAddressesProvider = Provider<List<DeliveryAddress>>((ref) {
  return const [
    DeliveryAddress(
      id: 'addr_1',
      recipientName: 'Rahul Sharma',
      phone: '+91 98765 43210',
      addressLine: 'Flat 402, Shivneri Residency, Baner Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045',
      tag: 'Home',
      isDefault: true,
    ),
    DeliveryAddress(
      id: 'addr_2',
      recipientName: 'Rahul Sharma',
      phone: '+91 98765 43210',
      addressLine: 'Farm Plot 12, Krishi Vigyan Road, Baramati',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '413102',
      tag: 'Farm / Warehouse',
      isDefault: false,
    ),
  ];
});

/// Currently selected delivery address for checkout.
final selectedAddressProvider = StateProvider<DeliveryAddress>((ref) {
  final addresses = ref.watch(savedAddressesProvider);
  return addresses.firstWhere(
    (a) => a.isDefault,
    orElse: () => addresses.first,
  );
});

/// Currently selected payment method: 'Cash on Delivery', 'UPI', or 'Credit / Debit Card'.
final selectedPaymentMethodProvider = StateProvider<String>((ref) {
  return 'Cash on Delivery';
});

/// Checkout submission loading state.
final checkoutLoadingProvider = StateProvider<bool>((ref) {
  return false;
});
