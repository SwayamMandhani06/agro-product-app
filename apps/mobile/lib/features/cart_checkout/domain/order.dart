import 'cart_item.dart';
import 'delivery_address.dart';

enum OrderStatus {
  placed,
  confirmed,
  processing,
  shipped,
  outForDelivery,
  delivered,
  cancelled;

  bool get isActive =>
      this == OrderStatus.placed ||
      this == OrderStatus.confirmed ||
      this == OrderStatus.processing ||
      this == OrderStatus.shipped ||
      this == OrderStatus.outForDelivery;

  bool get isDelivered => this == OrderStatus.delivered;
  bool get isCancelled => this == OrderStatus.cancelled;

  String get displayName => switch (this) {
        OrderStatus.placed => 'Order Placed',
        OrderStatus.confirmed => 'Confirmed',
        OrderStatus.processing => 'Processing',
        OrderStatus.shipped => 'Shipped',
        OrderStatus.outForDelivery => 'Out for Delivery',
        OrderStatus.delivered => 'Delivered',
        OrderStatus.cancelled => 'Cancelled',
      };

  int get stepIndex => switch (this) {
        OrderStatus.placed => 0,
        OrderStatus.confirmed => 1,
        OrderStatus.processing => 2,
        OrderStatus.shipped => 3,
        OrderStatus.outForDelivery => 4,
        OrderStatus.delivered => 5,
        OrderStatus.cancelled => -1,
      };
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
    this.deliveryAgentName,
    this.deliveryAgentPhone,
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
  final String? deliveryAgentName;
  final String? deliveryAgentPhone;

  int get totalItemCount => items.fold(0, (sum, item) => sum + item.quantity);

  Order copyWith({
    String? id,
    List<CartItem>? items,
    DeliveryAddress? address,
    String? paymentMethod,
    double? subtotal,
    double? deliveryFee,
    double? discount,
    double? totalAmount,
    DateTime? createdAt,
    OrderStatus? status,
    String? estimatedDelivery,
    String? deliveryAgentName,
    String? deliveryAgentPhone,
  }) {
    return Order(
      id: id ?? this.id,
      items: items ?? this.items,
      address: address ?? this.address,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      subtotal: subtotal ?? this.subtotal,
      deliveryFee: deliveryFee ?? this.deliveryFee,
      discount: discount ?? this.discount,
      totalAmount: totalAmount ?? this.totalAmount,
      createdAt: createdAt ?? this.createdAt,
      status: status ?? this.status,
      estimatedDelivery: estimatedDelivery ?? this.estimatedDelivery,
      deliveryAgentName: deliveryAgentName ?? this.deliveryAgentName,
      deliveryAgentPhone: deliveryAgentPhone ?? this.deliveryAgentPhone,
    );
  }
}
