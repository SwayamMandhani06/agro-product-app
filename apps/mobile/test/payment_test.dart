import 'package:agro_product_app/features/cart_checkout/domain/cart_item.dart';
import 'package:agro_product_app/features/cart_checkout/domain/delivery_address.dart';
import 'package:agro_product_app/features/cart_checkout/domain/order.dart';
import 'package:agro_product_app/features/payments/data/cod_payment_provider.dart';
import 'package:agro_product_app/features/payments/data/demo_payment_provider.dart';
import 'package:agro_product_app/features/payments/data/razorpay_test_provider.dart';
import 'package:agro_product_app/features/payments/domain/payment_transaction.dart';
import 'package:agro_product_app/features/payments/presentation/providers/payment_providers.dart';
import 'package:agro_product_app/features/payments/presentation/widgets/receipt_sheet.dart';
import 'package:agro_product_app/features/products/domain/product.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

Product _sampleProduct() {
  return const Product(
    id: 'prod_test_1',
    title: 'Certified Organic NPK Fertilizer',
    description: 'High quality agricultural fertilizer',
    price: 1250.0,
    originalPrice: 1500.0,
    unit: '50 kg bag',
    category: 'Fertilizers',
    sellerName: 'Maharashtra Krishi Vikas',
    rating: 4.8,
    reviewCount: 84,
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a',
    inStock: true,
  );
}

DeliveryAddress _sampleAddress() {
  return const DeliveryAddress(
    id: 'addr_test_1',
    recipientName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    addressLine: 'Flat 402, Shivneri Residency, Baner Road',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411045',
    tag: 'Home',
    isDefault: true,
  );
}

Order _sampleOrder() {
  return Order(
    id: 'ORD-78921',
    items: [
      CartItem(
        product: _sampleProduct(),
        quantity: 2,
      ),
    ],
    address: _sampleAddress(),
    paymentMethod: 'Demo Payment',
    subtotal: 2500.0,
    deliveryFee: 0.0,
    discount: 500.0,
    totalAmount: 2500.0,
    createdAt: DateTime(2026, 9, 4, 14, 30),
    status: OrderStatus.confirmed,
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Stage 7: Payment Domain & Providers', () {
    test('PaymentTransaction serialization and copyWith', () {
      final now = DateTime.now();
      final tx = PaymentTransaction(
        id: 'tx_123',
        orderId: 'ord_123',
        userId: 'usr_default',
        provider: PaymentProvider.demo,
        amount: 2500.0,
        currency: 'INR',
        method: PaymentMethod.demo,
        status: PaymentStatus.paid,
        createdAt: now,
        updatedAt: now,
      );

      final json = tx.toJson();
      expect(json['id'], 'tx_123');
      expect(json['order_id'], 'ord_123');
      expect(json['amount'], 2500.0);
      expect(json['status'], 'paid');
      expect(json['provider'], 'demo');

      final updated = tx.copyWith(status: PaymentStatus.refunded);
      expect(updated.status, PaymentStatus.refunded);
      expect(updated.id, 'tx_123');
    });

    test('DemoPaymentProvider simulates successful transaction deterministically', () async {
      const provider = DemoPaymentProvider(simulatedLatencyMs: 10);
      final result = await provider.processPayment(
        orderId: 'ord_demo_test',
        amount: 1450.0,
        method: PaymentMethod.demo,
        customerName: 'Kisan Patil',
        customerPhone: '+91 9988776655',
        simulateFailure: false,
      );

      expect(result.success, isTrue);
      expect(result.transaction, isNotNull);
      expect(result.transaction!.status, PaymentStatus.paid);
      expect(result.transaction!.provider, PaymentProvider.demo);
      expect(result.transaction!.currency, 'INR');
      expect(result.transaction!.amount, 1450.0);
      expect(result.transaction!.metadata['is_demo'], isTrue);
    });

    test('DemoPaymentProvider simulates declined payment without mutating order to paid', () async {
      const provider = DemoPaymentProvider(simulatedLatencyMs: 10);
      final result = await provider.processPayment(
        orderId: 'ord_demo_fail',
        amount: 800.0,
        method: PaymentMethod.demo,
        customerName: 'Kisan Patil',
        customerPhone: '+91 9988776655',
        simulateFailure: true,
      );

      expect(result.success, isFalse);
      expect(result.errorMessage, contains('Simulated payment failure'));
      expect(result.transaction?.status, PaymentStatus.failed);
    });

    test('CodPaymentProvider sets pending status for cash collection upon delivery', () async {
      const provider = CodPaymentProvider();
      final result = await provider.processPayment(
        orderId: 'ord_cod_test',
        amount: 3200.0,
        method: PaymentMethod.cod,
        customerName: 'Vikram Shinde',
        customerPhone: '+91 91234 56789',
      );

      expect(result.success, isTrue);
      expect(result.transaction, isNotNull);
      expect(result.transaction!.status, PaymentStatus.pending);
      expect(result.transaction!.provider, PaymentProvider.cod);
      expect(result.transaction!.method, PaymentMethod.cod);
    });

    test('RazorpayTestProvider safely routes to Demo sandbox when unconfigured', () async {
      final provider = RazorpayTestProvider(
        fallbackProvider: const DemoPaymentProvider(simulatedLatencyMs: 10),
      );

      final result = await provider.processPayment(
        orderId: 'ord_rzp_test',
        amount: 1999.0,
        method: PaymentMethod.upi,
        customerName: 'Suresh More',
        customerPhone: '+91 94567 89012',
      );

      expect(result.success, isTrue);
      expect(result.transaction, isNotNull);
      expect(result.transaction!.currency, 'INR');
    });
  });

  group('Stage 7: Payment State Notifier & Idempotency', () {
    test('PaymentNotifier manages lifecycle states and duplicate submission lock', () async {
      final container = ProviderContainer(
        overrides: [
          demoPaymentProvider.overrideWithValue(
            const DemoPaymentProvider(simulatedLatencyMs: 20),
          ),
        ],
      );
      addTearDown(container.dispose);

      final notifier = container.read(paymentStateProvider.notifier);
      expect(container.read(paymentStateProvider).lifecycle, PaymentLifecycle.idle);

      notifier.selectMethod(PaymentMethod.demo);
      expect(container.read(paymentStateProvider).selectedMethod, PaymentMethod.demo);

      // Execute payment
      final future1 = notifier.processPayment(
        orderId: 'ord_state_1',
        amount: 1000.0,
        customerName: 'Rahul',
        customerPhone: '+91 9999999999',
      );

      // Rapid duplicate attempt while processing must be blocked by idempotency lock
      final dupeResult = await notifier.processPayment(
        orderId: 'ord_state_1',
        amount: 1000.0,
        customerName: 'Rahul',
        customerPhone: '+91 9999999999',
      );
      expect(dupeResult.success, isFalse);
      expect(dupeResult.errorMessage, contains('already being processed'));

      final res1 = await future1;
      expect(res1.success, isTrue);
      expect(container.read(paymentStateProvider).lifecycle, PaymentLifecycle.success);
      expect(container.read(paymentStateProvider).lastTransaction?.status, PaymentStatus.paid);
    });

    test('PaymentNotifier preserves failure state and allows retry', () async {
      final container = ProviderContainer(
        overrides: [
          demoPaymentProvider.overrideWithValue(
            const DemoPaymentProvider(simulatedLatencyMs: 10),
          ),
        ],
      );
      addTearDown(container.dispose);

      final notifier = container.read(paymentStateProvider.notifier);
      notifier.selectMethod(PaymentMethod.demo);
      notifier.setSimulateFailure(true);

      final failResult = await notifier.processPayment(
        orderId: 'ord_fail_1',
        amount: 500.0,
        customerName: 'Rahul',
        customerPhone: '+91 9999999999',
      );

      expect(failResult.success, isFalse);
      expect(container.read(paymentStateProvider).lifecycle, PaymentLifecycle.failure);
      expect(container.read(paymentStateProvider).errorMessage, isNotNull);

      // Retrying with failure turned off succeeds
      notifier.setSimulateFailure(false);
      final retryResult = await notifier.processPayment(
        orderId: 'ord_fail_1',
        amount: 500.0,
        customerName: 'Rahul',
        customerPhone: '+91 9999999999',
      );

      expect(retryResult.success, isTrue);
      expect(container.read(paymentStateProvider).lifecycle, PaymentLifecycle.success);
    });
  });

  group('Stage 7: Tax Invoice / Receipt Widget', () {
    testWidgets('ReceiptSheet renders invoice details and educational sandbox notice', (tester) async {
      final order = _sampleOrder();
      final tx = PaymentTransaction(
        id: 'pay_demo_99999',
        orderId: order.id,
        userId: 'usr_default',
        provider: PaymentProvider.demo,
        providerPaymentId: 'demo_tx_78921',
        amount: order.totalAmount,
        currency: 'INR',
        method: PaymentMethod.demo,
        status: PaymentStatus.paid,
        createdAt: order.createdAt,
        updatedAt: order.createdAt,
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ReceiptSheet(order: order, transaction: tx),
          ),
        ),
      );

      expect(find.text('Tax Invoice / Receipt'), findsOneWidget);
      expect(find.text('AgriTrade Marketplace'), findsOneWidget);
      expect(find.text('DEMO PAYMENT · EDUCATIONAL SANDBOX (ZERO REAL CHARGES)'), findsOneWidget);
      expect(find.text('PAID'), findsOneWidget);
      expect(find.text('INV-${order.id.toUpperCase()}'), findsOneWidget);
      expect(find.text('Rahul Sharma'), findsOneWidget);
      expect(find.text('Certified Organic NPK Fertilizer'), findsOneWidget);
      expect(find.text('Done'), findsOneWidget);
    });
  });
}
