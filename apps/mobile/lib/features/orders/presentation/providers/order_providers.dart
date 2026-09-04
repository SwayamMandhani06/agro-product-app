import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/realtime/subscriptions/order_subscription.dart';
import '../../../cart_checkout/domain/cart_item.dart';
import '../../../cart_checkout/domain/delivery_address.dart';
import '../../../cart_checkout/domain/order.dart';
import '../../../cart_checkout/domain/order_repository.dart';
import '../../../cart_checkout/presentation/providers/cart_providers.dart';

/// State notifier managing reactive orders list and status transitions.
class OrdersNotifier extends StateNotifier<AsyncValue<List<Order>>> {
  OrdersNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadOrders();
    _sub = OrderSubscription.instance.stream.listen((update) {
      final current = state.value ?? [];
      final updated = current.map((order) {
        if (order.id == update.orderId) {
          return order.copyWith(
            status: update.status,
            estimatedDelivery: update.estimatedDelivery ?? order.estimatedDelivery,
            deliveryAgentName: update.agentName ?? order.deliveryAgentName,
            deliveryAgentPhone: update.agentPhone ?? order.deliveryAgentPhone,
          );
        }
        return order;
      }).toList();
      state = AsyncValue.data(updated);
    });
  }

  final OrderRepository _repository;
  StreamSubscription<OrderStatusUpdate>? _sub;

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  /// Loads all orders from the repository into memory.
  Future<void> loadOrders() async {
    state = const AsyncValue.loading();
    final result = await _repository.getOrders();
    result.fold(
      (failure) => state = AsyncValue.error(failure.message, StackTrace.current),
      (orders) => state = AsyncValue.data(orders),
    );
  }

  /// Places an order, adds it to the repository, and prepends to reactive state.
  Future<Order?> placeOrder({
    required List<CartItem> items,
    required DeliveryAddress address,
    required String paymentMethod,
    required double subtotal,
    required double deliveryFee,
    required double discount,
    required double totalAmount,
  }) async {
    final result = await _repository.placeOrder(
      items: items,
      address: address,
      paymentMethod: paymentMethod,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      discount: discount,
      totalAmount: totalAmount,
    );

    return result.fold(
      (failure) => null,
      (order) {
        final current = state.value ?? [];
        state = AsyncValue.data([
          order,
          ...current.where((o) => o.id != order.id),
        ]);
        return order;
      },
    );
  }

  /// Updates the status of an existing order and notifies listeners.
  Future<bool> updateOrderStatus(String orderId, OrderStatus newStatus) async {
    final result = await _repository.updateOrderStatus(orderId, newStatus);
    return result.fold(
      (failure) => false,
      (updatedOrder) {
        final current = state.value ?? [];
        state = AsyncValue.data(
          current.map((o) => o.id == orderId ? updatedOrder : o).toList(),
        );
        return true;
      },
    );
  }

  /// Cancels an active order.
  Future<bool> cancelOrder(String orderId) async {
    return updateOrderStatus(orderId, OrderStatus.cancelled);
  }
}

/// Provider managing reactive list of all orders.
final ordersProvider =
    StateNotifierProvider<OrdersNotifier, AsyncValue<List<Order>>>((ref) {
  final repository = ref.watch(orderRepositoryProvider);
  return OrdersNotifier(repository);
});

/// Currently selected filter chip tab on My Orders screen:
/// 'All' | 'Active' | 'Delivered' | 'Cancelled'
final selectedOrderFilterProvider = StateProvider<String>((ref) => 'All');

/// Active orders (placed, confirmed, processing, shipped, outForDelivery).
final activeOrdersProvider = Provider<List<Order>>((ref) {
  final ordersAsync = ref.watch(ordersProvider);
  return ordersAsync.maybeWhen(
    data: (orders) => orders.where((o) => o.status.isActive).toList(),
    orElse: () => const [],
  );
});

/// Past orders (delivered, cancelled).
final pastOrdersProvider = Provider<List<Order>>((ref) {
  final ordersAsync = ref.watch(ordersProvider);
  return ordersAsync.maybeWhen(
    data: (orders) => orders.where((o) => !o.status.isActive).toList(),
    orElse: () => const [],
  );
});

/// Filtered orders based on selected segment chip.
final filteredOrdersProvider = Provider<List<Order>>((ref) {
  final filter = ref.watch(selectedOrderFilterProvider);
  final ordersAsync = ref.watch(ordersProvider);

  return ordersAsync.maybeWhen(
    data: (orders) {
      switch (filter) {
        case 'Active':
          return orders.where((o) => o.status.isActive).toList();
        case 'Delivered':
          return orders.where((o) => o.status.isDelivered).toList();
        case 'Cancelled':
          return orders.where((o) => o.status.isCancelled).toList();
        case 'All':
        default:
          return orders;
      }
    },
    orElse: () => const [],
  );
});

/// Provider to fetch and cache a single order by ID.
final orderDetailsProvider =
    FutureProvider.family<Order, String>((ref, orderId) async {
  // Watch ordersProvider so this provider automatically invalidates/updates when status changes!
  final allOrders = ref.watch(ordersProvider).value ?? [];
  final matched = allOrders.where((o) => o.id == orderId);
  if (matched.isNotEmpty) {
    return matched.first;
  }

  final repository = ref.watch(orderRepositoryProvider);
  final result = await repository.getOrderById(orderId);
  return result.fold(
    (failure) => throw Exception(failure.message),
    (order) => order,
  );
});
