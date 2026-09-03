import '../../../core/error/failure.dart';
import 'cart_item.dart';
import 'delivery_address.dart';
import 'order.dart';

abstract interface class OrderRepository {
  Future<Result<Order>> placeOrder({
    required List<CartItem> items,
    required DeliveryAddress address,
    required String paymentMethod,
    required double subtotal,
    required double deliveryFee,
    required double discount,
    required double totalAmount,
  });

  Future<Result<List<Order>>> getOrders();
  Future<Result<Order>> getOrderById(String orderId);
}
