import 'cart_item.dart';
import 'delivery_address.dart';

enum OrderStatus {
  confirmed,
  processing,
  shipped,
  delivered,
  cancelled,
}

/// Order entity representing a placed customer order in AgriTrade.
class Order {
  const Order({
    required this.id,
    required this.items,
    required this.address,
    required this.paymentMethod,
    required this.subtotal,
    required this.deliveryFee,
    required this.discount,
    required this.totalAmount,
    required this.createdAt,
    this.status = OrderStatus.confirmed,
    this.estimatedDelivery = 'Tomorrow – 2 days',
  });

  final String id;
  final List<CartItem> items;
  final DeliveryAddress address;
  final String paymentMethod;
  final double subtotal;
  final double deliveryFee;
  final double discount;
  final double totalAmount;
  final DateTime createdAt;
  final OrderStatus status;
  final String estimatedDelivery;

  int get totalItemCount => items.fold(0, (sum, item) => sum + item.quantity);
}
