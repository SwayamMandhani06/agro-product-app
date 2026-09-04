import 'package:flutter_test/flutter_test.dart';
import 'package:agro_product_app/core/realtime/realtime_connection_state.dart';
import 'package:agro_product_app/core/realtime/realtime_service.dart';
import 'package:agro_product_app/core/realtime/subscriptions/mandi_subscription.dart';
import 'package:agro_product_app/core/realtime/subscriptions/order_subscription.dart';
import 'package:agro_product_app/core/realtime/subscriptions/notification_subscription.dart';
import 'package:agro_product_app/features/cart_checkout/domain/order.dart';
import 'package:agro_product_app/features/notifications/domain/notification_item.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Stage 6: Realtime Service & Connection State', () {
    late RealtimeService realtimeService;

    setUp(() {
      realtimeService = RealtimeService(enableSimulation: false, listenConnectivity: false);
    });

    tearDown(() {
      realtimeService.dispose();
    });

    test('initial connection state defaults to connected', () {
      expect(realtimeService.currentState, equals(RealtimeConnectionState.connected));
      expect(realtimeService.currentState.isConnected, isTrue);
      expect(realtimeService.currentState.label, equals('Live'));
    });

    test('state transitions emit to connectionStateStream', () async {
      final emittedStates = <RealtimeConnectionState>[];
      final sub = realtimeService.connectionStateStream.listen(emittedStates.add);

      realtimeService.setConnectionState(RealtimeConnectionState.offline);
      realtimeService.setConnectionState(RealtimeConnectionState.reconnecting);
      realtimeService.setConnectionState(RealtimeConnectionState.connected);

      await Future.delayed(const Duration(milliseconds: 50));

      expect(emittedStates, equals([
        RealtimeConnectionState.offline,
        RealtimeConnectionState.reconnecting,
        RealtimeConnectionState.connected,
      ]));
      expect(emittedStates.first.isOffline, isTrue);

      await sub.cancel();
    });
  });

  group('Stage 6: Mandi Price Realtime Subscriptions', () {
    test('MandiSubscription broadcasts price tick events', () async {
      final ticks = <MandiPriceTick>[];
      final sub = MandiSubscription.instance.stream.listen(ticks.add);

      final testTick = MandiPriceTick(
        commodity: 'Soybean',
        market: 'Indore APMC',
        newPrice: 4325.0,
        trend: 'up',
        trendDiff: '+₹45',
        timestamp: DateTime.now(),
      );

      MandiSubscription.instance.emit(testTick);
      await Future.delayed(const Duration(milliseconds: 20));

      expect(ticks.length, equals(1));
      expect(ticks.first.commodity, equals('Soybean'));
      expect(ticks.first.newPrice, equals(4325.0));
      expect(ticks.first.trend, equals('up'));

      await sub.cancel();
    });
  });

  group('Stage 6: Order Status Realtime Updates', () {
    test('OrderSubscription broadcasts operational status updates', () async {
      final updates = <OrderStatusUpdate>[];
      final sub = OrderSubscription.instance.stream.listen(updates.add);

      final update = OrderStatusUpdate(
        orderId: 'ORD-2024-001',
        status: OrderStatus.outForDelivery,
        timestamp: DateTime.now(),
        estimatedDelivery: 'Today, 2:30 PM',
        agentName: 'Ramesh Singh',
        agentPhone: '+91 98231 44521',
      );

      OrderSubscription.instance.emit(update);
      await Future.delayed(const Duration(milliseconds: 20));

      expect(updates.length, equals(1));
      expect(updates.first.orderId, equals('ORD-2024-001'));
      expect(updates.first.status, equals(OrderStatus.outForDelivery));
      expect(updates.first.agentName, equals('Ramesh Singh'));

      await sub.cancel();
    });
  });

  group('Stage 6: Realtime In-App Notifications', () {
    test('NotificationSubscription broadcasts incoming platform alerts', () async {
      final notifs = <NotificationItem>[];
      final sub = NotificationSubscription.instance.stream.listen(notifs.add);

      final item = NotificationItem(
        id: 'notif_stage6_001',
        title: 'Mandi Price Alert: Soybean Spike',
        message: 'Soybean touched ₹4,320 in Indore APMC.',
        type: 'mandi',
        createdAt: DateTime.now(),
      );

      NotificationSubscription.instance.emit(item);
      await Future.delayed(const Duration(milliseconds: 20));

      expect(notifs.length, equals(1));
      expect(notifs.first.title, contains('Soybean Spike'));
      expect(notifs.first.type, equals('mandi'));

      await sub.cancel();
    });
  });
}
