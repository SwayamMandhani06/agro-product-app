import '../../products/domain/product.dart';

/// Represents a single item line in the user's shopping cart.
class CartItem {
  const CartItem({
    required this.product,
    this.quantity = 1,
  }) : assert(quantity > 0, 'CartItem quantity must be greater than 0');

  final Product product;
  final int quantity;

  /// Effective unit price.
  double get unitPrice => product.price;

  /// Total price for this cart item line.
  double get totalPrice => unitPrice * quantity;

  /// Original unit price if discounted.
  double? get unitOriginalPrice => product.originalPrice;

  /// Total original price for this cart item line.
  double get totalOriginalPrice =>
      (product.originalPrice ?? product.price) * quantity;

  /// Total monetary savings on this item.
  double get savings => totalOriginalPrice - totalPrice;

  /// Whether this item has a promotional discount.
  bool get hasDiscount => savings > 0;

  CartItem copyWith({
    Product? product,
    int? quantity,
  }) {
    return CartItem(
      product: product ?? this.product,
      quantity: quantity ?? this.quantity,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CartItem &&
          runtimeType == other.runtimeType &&
          product.id == other.product.id &&
          quantity == other.quantity;

  @override
  int get hashCode => product.id.hashCode ^ quantity.hashCode;
}
