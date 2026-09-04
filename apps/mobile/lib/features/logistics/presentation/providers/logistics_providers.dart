import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/realtime/subscriptions/order_subscription.dart';
import '../../../../core/realtime/subscriptions/shipment_subscription.dart';
import '../../../cart_checkout/domain/order.dart';
import '../../data/demo_logistics_provider.dart';
import '../../domain/logistics_provider.dart';
import '../../domain/shipment.dart';

final logisticsProvider = Provider<LogisticsProvider>((ref) {
  return DemoLogisticsProvider();
});

class ShipmentsNotifier extends StateNotifier<AsyncValue<Map<String, Shipment>>> {
  ShipmentsNotifier(this._provider) : super(const AsyncValue.loading()) {
    _init();
  }

  final LogisticsProvider _provider;
  StreamSubscription<ShipmentStatusUpdate>? _sub;

  void _init() async {
    // Start with empty map, populate on-demand
    state = const AsyncValue.data({});
    _sub = ShipmentSubscription.instance.stream.listen((update) {
      final current = state.value ?? {};
      final existing = current[update.shipmentId];
      if (existing != null) {
        final updated = existing.copyWith(
          status: update.status,
          currentLocation: update.currentLocation,
          updatedAt: update.timestamp,
          deliveryAgent: update.deliveryAgent ?? existing.deliveryAgent,
        );
        state = AsyncValue.data({
          ...current,
          updated.id: updated,
          updated.orderId: updated,
        });
      }
    });
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  Future<Shipment> getOrCreateShipment(Order order) async {
    final current = state.value ?? {};
    final existing = current[order.id];
    if (existing != null) return existing;

    final found = await _provider.getShipmentByOrderId(order.id);
    if (found != null) {
      state = AsyncValue.data({
        ...current,
        found.id: found,
        found.orderId: found,
      });
      return found;
    }

    final created = await _provider.createShipment(order);
    state = AsyncValue.data({
      ...current,
      created.id: created,
      created.orderId: created,
    });
    return created;
  }

  Future<Shipment?> advanceMilestone(String shipmentId) async {
    final updated = await _provider.advanceMilestone(shipmentId);
    if (updated != null) {
      final current = state.value ?? {};
      state = AsyncValue.data({
        ...current,
        updated.id: updated,
        updated.orderId: updated,
      });

      // Synchronize backward-compatible Order status
      final orderStatus = updated.status.toOrderStatus();
      OrderSubscription.instance.emit(OrderStatusUpdate(
        orderId: updated.orderId,
        status: orderStatus,
        timestamp: DateTime.now(),
        agentName: updated.deliveryAgent?.name,
        agentPhone: updated.deliveryAgent?.phone,
      ));
    }
    return updated;
  }

  Future<Shipment?> simulateException(String shipmentId, String reason) async {
    final updated = await _provider.simulateException(shipmentId, reason);
    if (updated != null) {
      final current = state.value ?? {};
      state = AsyncValue.data({
        ...current,
        updated.id: updated,
        updated.orderId: updated,
      });
    }
    return updated;
  }

  Future<Shipment?> recordDeliveryAttempt(String shipmentId, String reason, [String? notes]) async {
    final updated = await _provider.recordDeliveryAttempt(shipmentId, reason, notes);
    if (updated != null) {
      final current = state.value ?? {};
      state = AsyncValue.data({
        ...current,
        updated.id: updated,
        updated.orderId: updated,
      });

      final orderStatus = updated.status.toOrderStatus();
      OrderSubscription.instance.emit(OrderStatusUpdate(
        orderId: updated.orderId,
        status: orderStatus,
        timestamp: DateTime.now(),
      ));
    }
    return updated;
  }

  Future<Shipment?> completeDelivery(String shipmentId) async {
    final updated = await _provider.completeDelivery(shipmentId);
    if (updated != null) {
      final current = state.value ?? {};
      state = AsyncValue.data({
        ...current,
        updated.id: updated,
        updated.orderId: updated,
      });

      OrderSubscription.instance.emit(OrderStatusUpdate(
        orderId: updated.orderId,
        status: OrderStatus.delivered,
        timestamp: DateTime.now(),
      ));
    }
    return updated;
  }
}

final shipmentsNotifierProvider =
    StateNotifierProvider<ShipmentsNotifier, AsyncValue<Map<String, Shipment>>>((ref) {
  final provider = ref.watch(logisticsProvider);
  return ShipmentsNotifier(provider);
});

final shipmentForOrderProvider =
    FutureProvider.family<Shipment?, Order>((ref, order) async {
  final notifier = ref.read(shipmentsNotifierProvider.notifier);
  return await notifier.getOrCreateShipment(order);
});
