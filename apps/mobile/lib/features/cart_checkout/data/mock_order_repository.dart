import 'dart:math';
import 'package:fpdart/fpdart.dart' hide Order;

import '../../../core/error/failure.dart';
import '../domain/cart_item.dart';
import '../domain/delivery_address.dart';
import '../domain/order.dart';
import '../domain/order_repository.dart';

/// In-memory mock implementation of [OrderRepository].
class MockOrderRepository implements OrderRepository {
  MockOrderRepository();

  final List<Order> _orders = [];

  @override
  Future<Result<Order>> placeOrder({
    required List<CartItem> items,
    required DeliveryAddress address,
    required String paymentMethod,
    required double subtotal,
    required double deliveryFee,
    required double discount,
    required double totalAmount,
  }) async {
    await Future.delayed(const Duration(milliseconds: 350));

    final randomId = 100000 + Random().nextInt(900000);
    final order = Order(
      id: '#AT$randomId',
      items: List.from(items),
      address: address,
      paymentMethod: paymentMethod,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      discount: discount,
      totalAmount: totalAmount,
      createdAt: DateTime.now(),
      status: OrderStatus.confirmed,
      estimatedDelivery: 'Tomorrow – 2 days',
    );

    _orders.insert(0, order);
    return right(order);
  }

  @override
  Future<Result<List<Order>>> getOrders() async {
    return right(List.unmodifiable(_orders));
  }

  @override
  Future<Result<Order>> getOrderById(String orderId) async {
    final index = _orders.indexWhere((o) => o.id == orderId);
    if (index >= 0) {
      return right(_orders[index]);
    }
    return left(const NotFoundFailure('Order not found'));
  }
}
