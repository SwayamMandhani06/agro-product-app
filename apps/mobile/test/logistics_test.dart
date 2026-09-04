import 'package:agro_product_app/features/cart_checkout/domain/cart_item.dart';
import 'package:agro_product_app/features/cart_checkout/domain/delivery_address.dart';
import 'package:agro_product_app/features/cart_checkout/domain/order.dart';
import 'package:agro_product_app/features/logistics/data/demo_logistics_provider.dart';
import 'package:agro_product_app/features/logistics/domain/shipment.dart';
import 'package:agro_product_app/features/logistics/presentation/providers/logistics_providers.dart';
import 'package:agro_product_app/features/logistics/presentation/widgets/delivery_attempt_sheet.dart';
import 'package:agro_product_app/features/products/domain/product.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

Product _testProduct() {
  return const Product(
    id: 'prod_fertilizer_1',
    title: 'Certified Organic NPK Fertilizer',
    description: 'Soil nourishment compound for sugarcane & wheat',
    price: 1250.0,
    originalPrice: 1500.0,
    unit: '50 kg bag',
    category: 'Fertilizers',
    sellerName: 'Maharashtra Krishi Kendra',
    rating: 4.8,
    reviewCount: 42,
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a',
    inStock: true,
  );
}

DeliveryAddress _testAddress() {
  return const DeliveryAddress(
    id: 'addr_farm_1',
    recipientName: 'Suresh Patil',
    phone: '+91 98220 12345',
    addressLine: 'Survey No. 42, Farm House, Haveli Road',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '412207',
    tag: 'Farm Gate',
    isDefault: true,
  );
}

Order _testOrder({String id = 'ORD-9901'}) {
  return Order(
    id: id,
    items: [
      CartItem(
        product: _testProduct(),
        quantity: 2,
      ),
    ],
    address: _testAddress(),
    paymentMethod: 'Demo Payment',
    subtotal: 2500.0,
    deliveryFee: 0.0,
    discount: 0.0,
    totalAmount: 2500.0,
    createdAt: DateTime.now(),
    status: OrderStatus.confirmed,
  );
}

void main() {
  group('Stage 8: Mobile Logistics & Rural Shipment Intelligence', () {
    // 1. Domain Status Mapping
    test('ShipmentStatus maps accurately to backward-compatible OrderStatus', () {
      expect(ShipmentStatus.created.toOrderStatus(), OrderStatus.confirmed);
      expect(ShipmentStatus.pickupScheduled.toOrderStatus(), OrderStatus.confirmed);
      expect(ShipmentStatus.pickedUp.toOrderStatus(), OrderStatus.processing);
      expect(ShipmentStatus.processing.toOrderStatus(), OrderStatus.processing);
      expect(ShipmentStatus.inTransit.toOrderStatus(), OrderStatus.shipped);
      expect(ShipmentStatus.atRegionalHub.toOrderStatus(), OrderStatus.shipped);
      expect(ShipmentStatus.outForDelivery.toOrderStatus(), OrderStatus.outForDelivery);
      expect(ShipmentStatus.deliveryAttempted.toOrderStatus(), OrderStatus.outForDelivery);
      expect(ShipmentStatus.delivered.toOrderStatus(), OrderStatus.delivered);
      expect(ShipmentStatus.cancelled.toOrderStatus(), OrderStatus.cancelled);
      expect(ShipmentStatus.returned.toOrderStatus(), OrderStatus.cancelled);
    });

    // 2. DemoLogisticsProvider Deterministic Simulation
    test('DemoLogisticsProvider creates shipment with valid tracking attributes', () async {
      final provider = DemoLogisticsProvider();
      final order = _testOrder(id: 'ORD-5501');

      final shipment = await provider.createShipment(order);

      expect(shipment.id, 'SHP-5501');
      expect(shipment.orderId, 'ORD-5501');
      expect(shipment.status, ShipmentStatus.created);
      expect(shipment.trackingNumber.startsWith('AGRI-EXP-'), isTrue);
      expect(shipment.events.isNotEmpty, isTrue);
      expect(shipment.deliveryAgent, isNotNull);
      expect(shipment.serviceZone, 'Rural Priority Route');
    });

    // 3. Milestone Advancement
    test('DemoLogisticsProvider advances through sequential logistics milestones', () async {
      final provider = DemoLogisticsProvider();
      final order = _testOrder(id: 'ORD-7701');
      final shipment = await provider.createShipment(order);

      // Advance from created -> pickedUp
      final s1 = await provider.advanceMilestone(shipment.id);
      expect(s1?.status, ShipmentStatus.pickedUp);

      // Advance to processing
      final s2 = await provider.advanceMilestone(shipment.id);
      expect(s2?.status, ShipmentStatus.processing);

      // Advance to inTransit
      final s3 = await provider.advanceMilestone(shipment.id);
      expect(s3?.status, ShipmentStatus.inTransit);

      // Advance to atRegionalHub
      final s4 = await provider.advanceMilestone(shipment.id);
      expect(s4?.status, ShipmentStatus.atRegionalHub);

      // Advance to outForDelivery
      final s5 = await provider.advanceMilestone(shipment.id);
      expect(s5?.status, ShipmentStatus.outForDelivery);

      // Advance to delivered
      final s6 = await provider.advanceMilestone(shipment.id);
      expect(s6?.status, ShipmentStatus.delivered);
    });

    // 4. Logistics Exception & Delay Handling
    test('DemoLogisticsProvider records in-transit transit exception', () async {
      final provider = DemoLogisticsProvider();
      final order = _testOrder(id: 'ORD-8801');
      final shipment = await provider.createShipment(order);

      final updated = await provider.simulateException(shipment.id, 'weather_delay');

      expect(updated, isNotNull);
      expect(updated?.events.any((e) => e.description.contains('monsoon')), isTrue);
    });

    // 5. Delivery Attempt Flow
    test('DemoLogisticsProvider records delivery attempt without corrupting state', () async {
      final provider = DemoLogisticsProvider();
      final order = _testOrder(id: 'ORD-9901');
      final shipment = await provider.createShipment(order);

      final attempted = await provider.recordDeliveryAttempt(
        shipment.id,
        'customer_unavailable',
        'Farm entrance gate locked.',
      );

      expect(attempted?.status, ShipmentStatus.deliveryAttempted);
      expect(attempted?.attempts.length, 1);
      expect(attempted?.attempts.first.reason, 'customer_unavailable');
      expect(attempted?.attempts.first.nextAttemptDate, isNotNull);
    });

    // 6. Complete Delivery Terminal Action
    test('DemoLogisticsProvider marks consignment delivered at farm gate', () async {
      final provider = DemoLogisticsProvider();
      final order = _testOrder(id: 'ORD-3301');
      final shipment = await provider.createShipment(order);

      final delivered = await provider.completeDelivery(shipment.id);

      expect(delivered?.status, ShipmentStatus.delivered);
      expect(delivered?.currentLocation, contains('Farm Gate'));
    });

    // 7. Riverpod ShipmentsNotifier State Flow
    test('ShipmentsNotifier manages reactive shipment lifecycle', () async {
      final provider = DemoLogisticsProvider();
      final notifier = ShipmentsNotifier(provider);
      final order = _testOrder(id: 'ORD-4401');

      final shipment = await notifier.getOrCreateShipment(order);
      expect(shipment.id, 'SHP-4401');

      final advanced = await notifier.advanceMilestone(shipment.id);
      expect(advanced?.status, ShipmentStatus.pickedUp);
    });

    // 8. Widget Test: DeliveryAttemptSheet renders and fires callback
    testWidgets('DeliveryAttemptSheet allows selecting reason and submitting', (tester) async {
      String? submittedReason;
      String? submittedNotes;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: DeliveryAttemptSheet(
              shipmentId: 'SHP-1001',
              onSubmit: (reason, notes) {
                submittedReason = reason;
                submittedNotes = notes;
              },
            ),
          ),
        ),
      );

      expect(find.text('Log Delivery Exception'), findsOneWidget);
      expect(find.text('Customer Unavailable'), findsOneWidget);
      expect(find.text('Unseasonal Weather Delay'), findsOneWidget);

      // Select weather delay
      await tester.tap(find.text('Unseasonal Weather Delay'));
      await tester.pump();

      // Submit
      await tester.tap(find.text('Record Exception'));
      await tester.pump();

      expect(submittedReason, 'weather_delay');
      expect(submittedNotes, isNull);
    });
  });
}
