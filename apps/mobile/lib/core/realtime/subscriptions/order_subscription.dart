import 'dart:async';
import '../../../features/cart_checkout/domain/order.dart';

class OrderStatusUpdate {
  const OrderStatusUpdate({
    required this.orderId,
    required this.status,
    required this.timestamp,
    this.estimatedDelivery,
    this.agentName,
    this.agentPhone,
  });

  final String orderId;
  final OrderStatus status;
  final DateTime timestamp;
  final String? estimatedDelivery;
  final String? agentName;
  final String? agentPhone;
}

/// Broadcast stream manager for real-time order lifecycle transitions.
class OrderSubscription {
  OrderSubscription._();
  static final OrderSubscription instance = OrderSubscription._();

  final _controller = StreamController<OrderStatusUpdate>.broadcast();

  Stream<OrderStatusUpdate> get stream => _controller.stream;

  void emit(OrderStatusUpdate update) {
    if (!_controller.isClosed) {
      _controller.add(update);
    }
  }

  void dispose() {
    _controller.close();
  }
}
