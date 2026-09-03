import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:agro_product_app/features/cart_checkout/data/mock_cart_repository.dart';
import 'package:agro_product_app/features/cart_checkout/data/mock_order_repository.dart';
import 'package:agro_product_app/features/cart_checkout/domain/cart_item.dart';
import 'package:agro_product_app/features/cart_checkout/domain/delivery_address.dart';
import 'package:agro_product_app/features/cart_checkout/domain/order.dart';
import 'package:agro_product_app/features/cart_checkout/presentation/providers/cart_providers.dart';
import 'package:agro_product_app/features/orders/presentation/order_details_screen.dart';
import 'package:agro_product_app/features/orders/presentation/order_tracking_screen.dart';
import 'package:agro_product_app/features/orders/presentation/orders_screen.dart';
import 'package:agro_product_app/features/orders/presentation/providers/order_providers.dart';
import 'package:agro_product_app/features/orders/presentation/widgets/order_card.dart';
import 'package:agro_product_app/features/orders/presentation/widgets/order_status_badge.dart';
import 'package:agro_product_app/features/orders/presentation/widgets/order_tracking_timeline.dart';
import 'package:agro_product_app/features/products/domain/product.dart';

Product _createSampleProduct({
  String id = 'prod_1',
  String title = 'Premium Soybean Seeds',
  double price = 1250,
  double? originalPrice = 1500,
}) {
  return Product(
    id: id,
    title: title,
    description: 'High-germination certified agricultural seeds.',
    category: 'Seeds',
    price: price,
    originalPrice: originalPrice,
    unit: '50kg Bag',
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
  );
}

DeliveryAddress _createSampleAddress() {
  return const DeliveryAddress(
    id: 'addr_1',
    recipientName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    addressLine: 'Plot 42, Green Fields',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411045',
    isDefault: true,
    tag: 'Farm',
  );
}

Order _createSampleOrder({
  String id = '#AT284759',
  OrderStatus status = OrderStatus.confirmed,
  double subtotal = 1250,
  double deliveryFee = 0,
  double discount = 250,
  double totalAmount = 1250,
}) {
  final product = _createSampleProduct();
  return Order(
    id: id,
    items: [CartItem(product: product, quantity: 2)],
    address: _createSampleAddress(),
    paymentMethod: 'Cash on Delivery',
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    discount: discount,
    totalAmount: totalAmount,
    createdAt: DateTime(2026, 8, 12, 10, 30),
    status: status,
    estimatedDelivery: 'Tomorrow by 8 PM',
    deliveryAgentName: 'Ramesh Kumar',
    deliveryAgentPhone: '+91 98765 43210',
  );
}

void main() {
  group('OrderStatus and Order Domain Tests', () {
    test('OrderStatus helpers report correct active/delivered/cancelled flags and display names', () {
      expect(OrderStatus.placed.isActive, isTrue);
      expect(OrderStatus.confirmed.isActive, isTrue);
      expect(OrderStatus.processing.isActive, isTrue);
      expect(OrderStatus.shipped.isActive, isTrue);
      expect(OrderStatus.outForDelivery.isActive, isTrue);
      expect(OrderStatus.delivered.isActive, isFalse);
      expect(OrderStatus.cancelled.isActive, isFalse);

      expect(OrderStatus.delivered.isDelivered, isTrue);
      expect(OrderStatus.cancelled.isCancelled, isTrue);

      expect(OrderStatus.placed.displayName, 'Order Placed');
      expect(OrderStatus.confirmed.displayName, 'Confirmed');
      expect(OrderStatus.processing.displayName, 'Processing');
      expect(OrderStatus.shipped.displayName, 'Shipped');
      expect(OrderStatus.outForDelivery.displayName, 'Out for Delivery');
      expect(OrderStatus.delivered.displayName, 'Delivered');
      expect(OrderStatus.cancelled.displayName, 'Cancelled');

      expect(OrderStatus.placed.stepIndex, 0);
      expect(OrderStatus.confirmed.stepIndex, 1);
      expect(OrderStatus.processing.stepIndex, 2);
      expect(OrderStatus.shipped.stepIndex, 3);
      expect(OrderStatus.outForDelivery.stepIndex, 4);
      expect(OrderStatus.delivered.stepIndex, 5);
      expect(OrderStatus.cancelled.stepIndex, -1);
    });

    test('Order holds details, calculates total item count, and copyWith updates correctly', () {
      final order = _createSampleOrder();

      expect(order.id, '#AT284759');
      expect(order.totalItemCount, 2);
      expect(order.deliveryAgentName, 'Ramesh Kumar');

      final updated = order.copyWith(
        status: OrderStatus.delivered,
        estimatedDelivery: 'Delivered on 14 Aug',
      );

      expect(updated.id, '#AT284759');
      expect(updated.status, OrderStatus.delivered);
      expect(updated.estimatedDelivery, 'Delivered on 14 Aug');
      expect(updated.totalItemCount, 2);
    });
  });

  group('MockOrderRepository Tests', () {
    test('MockOrderRepository starts empty by default or accepts initial orders', () async {
      final emptyRepo = MockOrderRepository();
      final emptyResult = await emptyRepo.getOrders();
      expect(emptyResult.isRight(), isTrue);
      expect(emptyResult.getOrElse((_) => []), isEmpty);

      final seededRepo = MockOrderRepository(initialOrders: [_createSampleOrder()]);
      final seededResult = await seededRepo.getOrders();
      expect(seededResult.getOrElse((_) => []).length, 1);
    });

    test('placeOrder creates order, prepends to list, and getOrderById finds it', () async {
      final repo = MockOrderRepository();
      final product = _createSampleProduct();
      final address = _createSampleAddress();

      final placeResult = await repo.placeOrder(
        items: [CartItem(product: product, quantity: 3)],
        address: address,
        paymentMethod: 'UPI Payment',
        subtotal: 3750,
        deliveryFee: 0,
        discount: 0,
        totalAmount: 3750,
      );

      expect(placeResult.isRight(), isTrue);
      final placedOrder = placeResult.getOrElse((_) => throw Exception());
      expect(placedOrder.id.startsWith('#AT'), isTrue);
      expect(placedOrder.totalItemCount, 3);
      expect(placedOrder.totalAmount, 3750);

      // getOrders
      final allOrders = (await repo.getOrders()).getOrElse((_) => []);
      expect(allOrders.length, 1);
      expect(allOrders.first.id, placedOrder.id);

      // getOrderById
      final found = await repo.getOrderById(placedOrder.id);
      expect(found.isRight(), isTrue);
      expect(found.getOrElse((_) => throw Exception()).id, placedOrder.id);

      // not found
      final notFound = await repo.getOrderById('invalid_id');
      expect(notFound.isLeft(), isTrue);
    });

    test('updateOrderStatus changes status of existing order', () async {
      final sample = _createSampleOrder(status: OrderStatus.confirmed);
      final repo = MockOrderRepository(initialOrders: [sample]);

      final updateResult = await repo.updateOrderStatus(sample.id, OrderStatus.shipped);
      expect(updateResult.isRight(), isTrue);

      final updated = (await repo.getOrderById(sample.id)).getOrElse((_) => throw Exception());
      expect(updated.status, OrderStatus.shipped);
    });
  });

  group('Order Providers Tests', () {
    test('OrdersNotifier and filtered providers filter active and past orders reactively', () async {
      final activeOrder = _createSampleOrder(id: '#AT_ACTIVE', status: OrderStatus.confirmed);
      final deliveredOrder = _createSampleOrder(id: '#AT_DELIVERED', status: OrderStatus.delivered);
      final repo = MockOrderRepository(initialOrders: [activeOrder, deliveredOrder]);

      final container = ProviderContainer(
        overrides: [
          orderRepositoryProvider.overrideWithValue(repo),
        ],
      );
      addTearDown(container.dispose);

      // Trigger load
      await container.read(ordersProvider.notifier).loadOrders();

      final all = container.read(ordersProvider).value ?? [];
      expect(all.length, 2);

      final activeList = container.read(activeOrdersProvider);
      expect(activeList.length, 1);
      expect(activeList.first.id, '#AT_ACTIVE');

      final pastList = container.read(pastOrdersProvider);
      expect(pastList.length, 1);
      expect(pastList.first.id, '#AT_DELIVERED');

      // Test filteredOrdersProvider with tab selection
      container.read(selectedOrderFilterProvider.notifier).state = 'Active';
      expect(container.read(filteredOrdersProvider).length, 1);

      container.read(selectedOrderFilterProvider.notifier).state = 'Delivered';
      expect(container.read(filteredOrdersProvider).length, 1);

      container.read(selectedOrderFilterProvider.notifier).state = 'Cancelled';
      expect(container.read(filteredOrdersProvider).length, 0);

      container.read(selectedOrderFilterProvider.notifier).state = 'All';
      expect(container.read(filteredOrdersProvider).length, 2);
    });

    test('OrdersNotifier.cancelOrder updates order to cancelled', () async {
      final order = _createSampleOrder(id: '#AT_TO_CANCEL', status: OrderStatus.confirmed);
      final repo = MockOrderRepository(initialOrders: [order]);

      final container = ProviderContainer(
        overrides: [
          orderRepositoryProvider.overrideWithValue(repo),
        ],
      );
      addTearDown(container.dispose);

      await container.read(ordersProvider.notifier).loadOrders();
      final success = await container.read(ordersProvider.notifier).cancelOrder('#AT_TO_CANCEL');
      expect(success, isTrue);

      final cancelled = container
          .read(ordersProvider)
          .value!
          .firstWhere((o) => o.id == '#AT_TO_CANCEL');
      expect(cancelled.status, OrderStatus.cancelled);
    });
  });

  group('Orders Presentation Widget Tests', () {
    testWidgets('OrderStatusBadge renders correct label and icons', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Column(
              children: [
                OrderStatusBadge(status: OrderStatus.confirmed),
                OrderStatusBadge(status: OrderStatus.outForDelivery),
                OrderStatusBadge(status: OrderStatus.delivered),
                OrderStatusBadge(status: OrderStatus.cancelled),
              ],
            ),
          ),
        ),
      );

      expect(find.text('Confirmed'), findsOneWidget);
      expect(find.text('Out for Delivery'), findsOneWidget);
      expect(find.text('Delivered'), findsOneWidget);
      expect(find.text('Cancelled'), findsOneWidget);
    });

    testWidgets('OrderTrackingTimeline renders all timeline stages and active status', (tester) async {
      final order = _createSampleOrder(status: OrderStatus.outForDelivery);

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SingleChildScrollView(
              child: OrderTrackingTimeline(order: order),
            ),
          ),
        ),
      );

      expect(find.text('ORDER TRACKING'), findsOneWidget);
      expect(find.text('Order Placed'), findsOneWidget);
      expect(find.text('Order Confirmed'), findsOneWidget);
      expect(find.text('Packed'), findsOneWidget);
      expect(find.text('Shipped'), findsOneWidget);
      expect(find.text('Out for Delivery'), findsOneWidget);
      expect(find.text('CURRENT'), findsOneWidget);
      expect(find.textContaining('Ramesh Kumar'), findsOneWidget);
      expect(find.text('Delivered'), findsOneWidget);
    });

    testWidgets('OrderTrackingTimeline renders cancelled banner when order is cancelled', (tester) async {
      final order = _createSampleOrder(status: OrderStatus.cancelled);

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: OrderTrackingTimeline(order: order),
          ),
        ),
      );

      expect(find.text('Order Cancelled'), findsOneWidget);
      expect(find.textContaining('This order was cancelled'), findsOneWidget);
    });

    testWidgets('OrdersScreen renders empty state when repository has no orders', (tester) async {
      final emptyRepo = MockOrderRepository(initialOrders: []);
      final container = ProviderContainer(
        overrides: [
          orderRepositoryProvider.overrideWithValue(emptyRepo),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: OrdersScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('My Orders'), findsOneWidget);
      expect(find.text('No orders yet'), findsOneWidget);
      expect(find.text('Your agricultural purchases will appear here.'), findsOneWidget);
      expect(find.text('Start Shopping'), findsOneWidget);
      expect(find.text('Browse Categories'), findsOneWidget);
    });

    testWidgets('OrdersScreen renders filter tabs and OrderCards when orders exist', (tester) async {
      final sample = _createSampleOrder(id: '#AT123456', status: OrderStatus.confirmed);
      final repo = MockOrderRepository(initialOrders: [sample]);
      final container = ProviderContainer(
        overrides: [
          orderRepositoryProvider.overrideWithValue(repo),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: OrdersScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('My Orders'), findsOneWidget);
      expect(find.text('All'), findsOneWidget);
      expect(find.text('Active'), findsOneWidget);
      expect(find.text('Delivered'), findsOneWidget);
      expect(find.text('Cancelled'), findsOneWidget);

      expect(find.text('Order #AT123456'), findsOneWidget);
      expect(find.text('View Details'), findsOneWidget);
      expect(find.text('Track Order'), findsOneWidget);
    });

    testWidgets('OrderDetailsScreen renders order header, tracking, products, and summary', (tester) async {
      tester.view.physicalSize = const Size(800, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      final sample = _createSampleOrder(id: '#AT999888', status: OrderStatus.confirmed);
      final repo = MockOrderRepository(initialOrders: [sample]);
      final container = ProviderContainer(
        overrides: [
          orderRepositoryProvider.overrideWithValue(repo),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: OrderDetailsScreen(orderId: '#AT999888'),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Order Details'), findsOneWidget);
      expect(find.text('Order #AT999888'), findsOneWidget);
      expect(find.text('ORDER TRACKING'), findsOneWidget);
      expect(find.text('PRODUCTS (2)'), findsOneWidget);
      expect(find.text('ORDER SUMMARY'), findsOneWidget);
      expect(find.text('DELIVERY ADDRESS'), findsOneWidget);
      expect(find.text('PAYMENT METHOD'), findsOneWidget);
      expect(find.text('Cancel Order'), findsOneWidget);
      expect(find.text('Track Order'), findsOneWidget);
    });

    testWidgets('OrderTrackingScreen renders tracking header, delivery ETA, and timeline', (tester) async {
      tester.view.physicalSize = const Size(800, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      final sample = _createSampleOrder(id: '#AT777666', status: OrderStatus.outForDelivery);
      final repo = MockOrderRepository(initialOrders: [sample]);
      final container = ProviderContainer(
        overrides: [
          orderRepositoryProvider.overrideWithValue(repo),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: OrderTrackingScreen(orderId: '#AT777666'),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Track Order'), findsOneWidget);
      expect(find.text('#AT777666'), findsOneWidget);
      expect(find.text('Est. Delivery: '), findsOneWidget);
      expect(find.text('Tomorrow by 8 PM'), findsOneWidget);
      expect(find.text('ORDER TRACKING'), findsOneWidget);
      expect(find.text('Contact Support'), findsOneWidget);
      expect(find.text('Back to Order Details'), findsOneWidget);
    });

    testWidgets('Reorder merges ordered products into cart and updates totals', (tester) async {
      final cartRepo = MockCartRepository();
      final sample = _createSampleOrder(id: '#AT_REORDER', status: OrderStatus.delivered);
      final orderRepo = MockOrderRepository(initialOrders: [sample]);

      final container = ProviderContainer(
        overrides: [
          cartRepositoryProvider.overrideWithValue(cartRepo),
          orderRepositoryProvider.overrideWithValue(orderRepo),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: MaterialApp(
            home: Scaffold(
              body: OrderCard(order: sample),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Tap Reorder
      expect(find.text('Reorder'), findsOneWidget);
      await tester.tap(find.text('Reorder'));
      await tester.pumpAndSettle();

      // Check cart has items
      final cartItems = container.read(cartItemsProvider);
      expect(cartItems.length, 1);
      expect(cartItems.first.quantity, 2);
      expect(container.read(cartItemCountProvider), 2);
      expect(container.read(cartTotalAmountProvider), 2500);

      // SnackBar displayed
      expect(find.textContaining('added to cart'), findsOneWidget);
    });
  });
}
