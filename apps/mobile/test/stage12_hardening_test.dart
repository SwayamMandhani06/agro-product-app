// ============================================================
// Stage 12: Mobile Hardening, Canonical Lifecycles & Parity Tests
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:agro_product_app/core/utils/order_transitions.dart';
import 'package:agro_product_app/core/widgets/universal_state_views.dart';
import 'package:agro_product_app/features/auth/data/mock_auth_repository.dart';
import 'package:agro_product_app/features/cart_checkout/domain/order.dart';

void main() {
  group('Stage 12: OrderTransitionValidator Rules', () {
    test('validates standard linear path from placed to delivered', () {
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.placed,
          OrderStatus.confirmed,
        ),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.confirmed,
          OrderStatus.processing,
        ),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.processing,
          OrderStatus.packed,
        ),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.packed,
          OrderStatus.shipped,
        ),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.shipped,
          OrderStatus.outForDelivery,
        ),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.outForDelivery,
          OrderStatus.delivered,
        ),
        isTrue,
      );
    });

    test('validates cancellation branches from early stages', () {
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.placed,
          OrderStatus.cancelled,
        ),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.confirmed,
          OrderStatus.cancelled,
        ),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.processing,
          OrderStatus.cancelled,
        ),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.packed,
          OrderStatus.cancelled,
        ),
        isTrue,
      );

      // Cancel NOT allowed once shipped or delivered
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.shipped,
          OrderStatus.cancelled,
        ),
        isFalse,
      );
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.delivered,
          OrderStatus.cancelled,
        ),
        isFalse,
      );
    });

    test('validates return, dispute and refund branch from delivered', () {
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.delivered,
          OrderStatus.refundRequested,
        ),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.delivered,
          OrderStatus.disputed,
        ),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.refundRequested,
          OrderStatus.refundProcessing,
        ),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isValidTransition(
          OrderStatus.refundProcessing,
          OrderStatus.refunded,
        ),
        isTrue,
      );
    });

    test('enforces terminal states cannot transition to anything', () {
      expect(
        OrderTransitionValidator.isTerminal(OrderStatus.delivered),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isTerminal(OrderStatus.refunded),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isTerminal(OrderStatus.cancelled),
        isTrue,
      );
      expect(
        OrderTransitionValidator.isTerminal(OrderStatus.processing),
        isFalse,
      );

      expect(
        OrderTransitionValidator.getNextAllowedTransitions(OrderStatus.refunded),
        isEmpty,
      );
      expect(
        OrderTransitionValidator.getNextAllowedTransitions(OrderStatus.cancelled),
        isEmpty,
      );
    });

    test('identity transitions return true as no-op', () {
      for (final status in OrderStatus.values) {
        expect(
          OrderTransitionValidator.isValidTransition(status, status),
          isTrue,
        );
      }
    });

    test('parses status string variations including snake_case and camelCase', () {
      expect(
        OrderTransitionValidator.parseOrderStatus('out_for_delivery'),
        OrderStatus.outForDelivery,
      );
      expect(
        OrderTransitionValidator.parseOrderStatus('outForDelivery'),
        OrderStatus.outForDelivery,
      );
      expect(
        OrderTransitionValidator.parseOrderStatus('refund_requested'),
        OrderStatus.refundRequested,
      );
      expect(
        OrderTransitionValidator.parseOrderStatus('refund_processing'),
        OrderStatus.refundProcessing,
      );
      expect(
        OrderTransitionValidator.parseOrderStatus(null, fallback: OrderStatus.placed),
        OrderStatus.placed,
      );
      expect(
        OrderTransitionValidator.parseOrderStatus('unknown_status', fallback: OrderStatus.placed),
        OrderStatus.placed,
      );
    });

    test('serializes status to canonical snake_case API string', () {
      expect(
        OrderTransitionValidator.toApiString(OrderStatus.outForDelivery),
        'out_for_delivery',
      );
      expect(
        OrderTransitionValidator.toApiString(OrderStatus.refundRequested),
        'refund_requested',
      );
      expect(
        OrderTransitionValidator.toApiString(OrderStatus.refundProcessing),
        'refund_processing',
      );
      expect(
        OrderTransitionValidator.toApiString(OrderStatus.placed),
        'placed',
      );
    });
  });

  group('Stage 12: Multi-Role Demo Personas in MockAuthRepository', () {
    late MockAuthRepository authRepo;

    setUp(() {
      authRepo = MockAuthRepository();
    });

    test('authenticates farmer demo account successfully', () async {
      final result = await authRepo.signIn(
        emailOrPhone: 'farmer@agritrade.in',
        password: 'farmer123',
      );
      expect(result.isRight(), isTrue);
      final user = result.getOrElse((_) => throw Exception());
      expect(user.role, 'farmer');
      expect(user.id, 'usr_farmer_01');
    });

    test('authenticates seller demo account successfully', () async {
      final result = await authRepo.signIn(
        emailOrPhone: 'seller@agritrade.in',
        password: 'seller123',
      );
      expect(result.isRight(), isTrue);
      final user = result.getOrElse((_) => throw Exception());
      expect(user.role, 'seller');
      expect(user.id, 'usr_seller_01');
    });

    test('authenticates cooperative manager demo account successfully', () async {
      final result = await authRepo.signIn(
        emailOrPhone: 'coop@agritrade.in',
        password: 'coop123',
      );
      expect(result.isRight(), isTrue);
      final user = result.getOrElse((_) => throw Exception());
      expect(user.role, 'cooperative_manager');
      expect(user.id, 'usr_coop_01');
    });

    test('authenticates platform admin demo account successfully', () async {
      final result = await authRepo.signIn(
        emailOrPhone: 'admin@agritrade.in',
        password: 'admin123',
      );
      expect(result.isRight(), isTrue);
      final user = result.getOrElse((_) => throw Exception());
      expect(user.role, 'admin');
      expect(user.id, 'usr_admin_01');
    });

    test('rejects incorrect password for demo accounts', () async {
      final result = await authRepo.signIn(
        emailOrPhone: 'farmer@agritrade.in',
        password: 'wrong_password',
      );
      expect(result.isLeft(), isTrue);
    });
  });

  group('Stage 12: Universal State Views Presentation', () {
    testWidgets('UniversalOfflineBanner displays offline label and reconnect button', (tester) async {
      var reconnected = false;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: UniversalOfflineBanner(
              cachedAt: '2 mins ago',
              onReconnect: () => reconnected = true,
            ),
          ),
        ),
      );

      expect(find.textContaining('Offline Mode'), findsOneWidget);
      expect(find.textContaining('2 mins ago'), findsOneWidget);
      expect(find.text('Reconnect'), findsOneWidget);

      await tester.tap(find.text('Reconnect'));
      expect(reconnected, isTrue);
    });

    testWidgets('UniversalProductSkeletonGrid renders requested itemCount items', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SingleChildScrollView(
              child: UniversalProductSkeletonGrid(itemCount: 4),
            ),
          ),
        ),
      );

      expect(find.byType(UniversalProductSkeletonGrid), findsOneWidget);
      expect(find.byType(GridView), findsOneWidget);
    });

    testWidgets('UniversalOrderSkeletonList renders skeleton list items', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SingleChildScrollView(
              child: UniversalOrderSkeletonList(itemCount: 3),
            ),
          ),
        ),
      );

      expect(find.byType(UniversalOrderSkeletonList), findsOneWidget);
      expect(find.byType(ListView), findsOneWidget);
    });
  });
}
