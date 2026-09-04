import 'dart:math';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:fpdart/fpdart.dart' hide Order;

import '../../../core/config/backend_config.dart';
import '../../../core/error/failure.dart';
import '../../products/domain/product.dart';
import '../domain/cart_item.dart';
import '../domain/delivery_address.dart';
import '../domain/order.dart';
import '../domain/order_repository.dart';
import 'mock_order_repository.dart';

/// Supabase-backed order repository using Dio PostgREST calls.
///
/// Falls back to [MockOrderRepository] when [BackendConfig.isConfigured]
/// is `false`, preserving seamless local/CI development and testing.
class SupabaseOrderRepository implements OrderRepository {
  SupabaseOrderRepository({Dio? dio})
      : _dio = dio ?? Dio(),
        _mock = MockOrderRepository();

  final Dio _dio;
  final MockOrderRepository _mock;

  // ──────────────────────────────────────────────────────────────
  // OrderRepository API
  // ──────────────────────────────────────────────────────────────

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
    if (!BackendConfig.isConfigured) {
      return _mock.placeOrder(
        items: items,
        address: address,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: discount,
        totalAmount: totalAmount,
      );
    }

    try {
      final randomId = 100000 + Random().nextInt(900000);
      final orderId = '#AT$randomId';
      final now = DateTime.now();

      // Insert order row
      await _dio.post(
        '${BackendConfig.restBaseUrl}/orders',
        data: {
          'id': orderId,
          'status': 'confirmed',
          'total_amount': totalAmount,
          'subtotal': subtotal,
          'delivery_fee': deliveryFee,
          'discount': discount,
          'payment_method': paymentMethod,
          'delivery_address': {
            'id': address.id,
            'recipientName': address.recipientName,
            'phone': address.phone,
            'addressLine': address.addressLine,
            'city': address.city,
            'state': address.state,
            'pincode': address.pincode,
            'tag': address.tag,
          },
          'estimated_delivery': 'Tomorrow – 2 days',
          'created_at': now.toIso8601String(),
        },
        options: Options(headers: BackendConfig.headers),
      );

      // Insert order item rows
      final orderItems = items.map((item) => {
            'order_id': orderId,
            'product_id': item.product.id,
            'product_title': item.product.title,
            'product_category': item.product.category ?? 'Seeds',
            'unit_price': item.product.price,
            'quantity': item.quantity,
          }).toList();

      await _dio.post(
        '${BackendConfig.restBaseUrl}/order_items',
        data: orderItems,
        options: Options(headers: BackendConfig.headers),
      );

      final order = Order(
        id: orderId,
        items: List.from(items),
        address: address,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: discount,
        totalAmount: totalAmount,
        createdAt: now,
        status: OrderStatus.confirmed,
        estimatedDelivery: 'Tomorrow – 2 days',
        deliveryAgentName: 'Ramesh Kumar',
        deliveryAgentPhone: '+91 98765 43210',
      );

      return right(order);
    } catch (e) {
      debugPrint('[SupabaseOrderRepository] placeOrder error: $e');
      // Graceful degradation to mock
      return _mock.placeOrder(
        items: items,
        address: address,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: discount,
        totalAmount: totalAmount,
      );
    }
  }

  @override
  Future<Result<List<Order>>> getOrders() async {
    if (!BackendConfig.isConfigured) return _mock.getOrders();

    try {
      final response = await _dio.get(
        '${BackendConfig.restBaseUrl}/orders',
        queryParameters: {
          'select': '*,order_items(*)',
          'order': 'created_at.desc',
        },
        options: Options(headers: BackendConfig.headers),
      );

      final rows = response.data as List;
      final orders = rows.map(_mapOrderRow).toList();
      return right(orders);
    } catch (e) {
      debugPrint('[SupabaseOrderRepository] getOrders error: $e');
      return _mock.getOrders();
    }
  }

  @override
  Future<Result<Order>> getOrderById(String orderId) async {
    if (!BackendConfig.isConfigured) return _mock.getOrderById(orderId);

    try {
      final response = await _dio.get(
        '${BackendConfig.restBaseUrl}/orders',
        queryParameters: {
          'select': '*,order_items(*)',
          'id': 'eq.$orderId',
          'limit': '1',
        },
        options: Options(headers: BackendConfig.headers),
      );

      final rows = response.data as List;
      if (rows.isEmpty) {
        return left(const NotFoundFailure('Order not found'));
      }

      return right(_mapOrderRow(rows.first));
    } catch (e) {
      debugPrint('[SupabaseOrderRepository] getOrderById error: $e');
      return _mock.getOrderById(orderId);
    }
  }

  @override
  Future<Result<Order>> updateOrderStatus(
    String orderId,
    OrderStatus newStatus,
  ) async {
    if (!BackendConfig.isConfigured) {
      return _mock.updateOrderStatus(orderId, newStatus);
    }

    try {
      final statusStr = newStatus.name;
      await _dio.patch(
        '${BackendConfig.restBaseUrl}/orders',
        queryParameters: {'id': 'eq.$orderId'},
        data: {'status': statusStr},
        options: Options(headers: BackendConfig.headers),
      );

      // Refetch the updated order
      return getOrderById(orderId);
    } catch (e) {
      debugPrint('[SupabaseOrderRepository] updateOrderStatus error: $e');
      return _mock.updateOrderStatus(orderId, newStatus);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────

  Order _mapOrderRow(dynamic row) {
    final orderItems = <CartItem>[];
    if (row['order_items'] is List) {
      for (final item in row['order_items'] as List) {
        orderItems.add(CartItem(
          product: Product(
            id: item['product_id'] as String? ?? '',
            title: item['product_title'] as String? ?? 'Unknown',
            price: (item['unit_price'] is num
                ? (item['unit_price'] as num).toDouble()
                : 0),
            category: item['product_category'] as String? ?? 'Seeds',
            inStock: true,
          ),
          quantity: item['quantity'] as int? ?? 1,
        ));
      }
    }

    // Parse delivery address from JSONB
    DeliveryAddress address;
    if (row['delivery_address'] is Map) {
      final addrMap = row['delivery_address'] as Map;
      address = DeliveryAddress(
        id: addrMap['id'] as String? ?? 'addr_remote',
        recipientName: addrMap['recipientName'] as String? ?? '',
        phone: addrMap['phone'] as String? ?? '',
        addressLine: addrMap['addressLine'] as String? ?? '',
        city: addrMap['city'] as String? ?? '',
        state: addrMap['state'] as String? ?? '',
        pincode: addrMap['pincode'] as String? ?? '',
        tag: addrMap['tag'] as String? ?? 'Home',
      );
    } else {
      address = const DeliveryAddress(
        id: 'addr_fallback',
        recipientName: 'Customer',
        phone: '+91 00000 00000',
        addressLine: 'Address',
        city: 'City',
        state: 'State',
        pincode: '000000',
      );
    }

    // Parse status string to enum
    final statusStr = row['status'] as String? ?? 'placed';
    final status = OrderStatus.values.firstWhere(
      (s) => s.name == statusStr,
      orElse: () => OrderStatus.placed,
    );

    return Order(
      id: row['id'] as String,
      items: orderItems,
      address: address,
      paymentMethod: row['payment_method'] as String? ?? 'UPI',
      subtotal: (row['subtotal'] is num ? (row['subtotal'] as num).toDouble() : 0),
      deliveryFee: (row['delivery_fee'] is num ? (row['delivery_fee'] as num).toDouble() : 0),
      discount: (row['discount'] is num ? (row['discount'] as num).toDouble() : 0),
      totalAmount: (row['total_amount'] is num ? (row['total_amount'] as num).toDouble() : 0),
      createdAt: DateTime.tryParse(row['created_at'] as String? ?? '') ?? DateTime.now(),
      status: status,
      estimatedDelivery: row['estimated_delivery'] as String? ?? 'Within 2 days',
      deliveryAgentName: row['delivery_agent_name'] as String?,
      deliveryAgentPhone: row['delivery_agent_phone'] as String?,
    );
  }
}
