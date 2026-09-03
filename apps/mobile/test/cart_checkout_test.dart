import 'package:agro_product_app/features/cart_checkout/data/mock_cart_repository.dart';
import 'package:agro_product_app/features/cart_checkout/data/mock_order_repository.dart';
import 'package:agro_product_app/features/cart_checkout/domain/cart_item.dart';
import 'package:agro_product_app/features/cart_checkout/domain/delivery_address.dart';
import 'package:agro_product_app/features/cart_checkout/domain/order.dart';
import 'package:agro_product_app/features/cart_checkout/presentation/cart_screen.dart';
import 'package:agro_product_app/features/cart_checkout/presentation/checkout_screen.dart';
import 'package:agro_product_app/features/cart_checkout/presentation/order_confirmed_screen.dart';
import 'package:agro_product_app/features/cart_checkout/presentation/providers/cart_providers.dart';
import 'package:agro_product_app/features/cart_checkout/presentation/widgets/cart_item_tile.dart';
import 'package:agro_product_app/features/cart_checkout/presentation/widgets/order_summary_card.dart';
import 'package:agro_product_app/features/products/domain/product.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

Product _createSampleProduct({
  String id = 'prod_1',
  String title = 'Soybean Seeds JS-335',
  double price = 850.0,
  double? originalPrice = 1000.0,
  String unit = '10 kg bag',
  bool inStock = true,
}) {
  return Product(
    id: id,
    title: title,
    description: 'High-yield certified soybean seeds',
    price: price,
    originalPrice: originalPrice,
    unit: unit,
    category: 'Seeds',
    sellerName: 'Kisan Agro Kendra',
    rating: 4.8,
    reviewCount: 124,
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a',
    inStock: inStock,
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('CartItem Domain Tests', () {
    test('calculates totalPrice, totalOriginalPrice, savings, and discount badge', () {
      final product = _createSampleProduct(
        price: 800.0,
        originalPrice: 1000.0,
      );
      final item = CartItem(product: product, quantity: 3);

      expect(item.totalPrice, 2400.0);
      expect(item.totalOriginalPrice, 3000.0);
      expect(item.savings, 600.0);
      expect(item.hasDiscount, true);
    });

    test('handles product without originalPrice gracefully', () {
      final product = _createSampleProduct(
        price: 500.0,
        originalPrice: null,
      );
      final item = CartItem(product: product, quantity: 2);

      expect(item.totalPrice, 1000.0);
      expect(item.totalOriginalPrice, 1000.0);
      expect(item.savings, 0.0);
      expect(item.hasDiscount, false);
    });
  });

  group('DeliveryAddress Domain Tests', () {
    test('formats address correctly', () {
      const address = DeliveryAddress(
        id: 'addr_1',
        recipientName: 'Rahul Sharma',
        phone: '+91 98765 43210',
        addressLine: 'Plot 42, Green Fields',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411045',
        tag: 'Farm',
        isDefault: true,
      );

      expect(
        address.formattedAddress,
        'Plot 42, Green Fields, Pune, Maharashtra 411045',
      );
      expect(address.isDefault, true);
      expect(address.tag, 'Farm');
    });
  });

  group('Order Domain Tests', () {
    test('Order holds details and calculates total item count correctly', () {
      final p1 = _createSampleProduct(id: 'p1', price: 100);
      final p2 = _createSampleProduct(id: 'p2', price: 200);
      final order = Order(
        id: '#AT123456',
        items: [
          CartItem(product: p1, quantity: 2),
          CartItem(product: p2, quantity: 3),
        ],
        address: const DeliveryAddress(
          id: 'a1',
          recipientName: 'Rahul',
          phone: '9999999999',
          addressLine: 'Village Post',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
        ),
        paymentMethod: 'UPI',
        subtotal: 800,
        deliveryFee: 0,
        discount: 100,
        totalAmount: 800,
        createdAt: DateTime(2026, 9, 3),
      );

      expect(order.totalItemCount, 5);
      expect(order.status, OrderStatus.confirmed);
    });
  });

  group('MockCartRepository Tests', () {
    late MockCartRepository repo;

    setUp(() {
      repo = MockCartRepository();
    });

    test('starts with empty cart', () async {
      final res = await repo.getCartItems();
      res.fold(
        (l) => fail('Failed to get cart'),
        (items) => expect(items, isEmpty),
      );
    });

    test('adds new item and merges duplicate quantities', () async {
      final prod = _createSampleProduct(id: 'p1', price: 500);

      await repo.addItem(prod, quantity: 2);
      var res = await repo.getCartItems();
      expect(res.isRight(), true);
      res.fold((l) => null, (items) {
        expect(items.length, 1);
        expect(items.first.quantity, 2);
      });

      // Adding the same product again increments quantity
      await repo.addItem(prod, quantity: 3);
      res = await repo.getCartItems();
      res.fold((l) => null, (items) {
        expect(items.length, 1);
        expect(items.first.quantity, 5);
      });
    });

    test('updates item quantity and removes if quantity is 0', () async {
      final prod = _createSampleProduct(id: 'p1', price: 500);
      await repo.addItem(prod, quantity: 2);

      await repo.updateQuantity('p1', 4);
      var res = await repo.getCartItems();
      res.fold((l) => null, (items) => expect(items.first.quantity, 4));

      await repo.updateQuantity('p1', 0);
      res = await repo.getCartItems();
      res.fold((l) => null, (items) => expect(items, isEmpty));
    });

    test('removes item and clears cart', () async {
      final p1 = _createSampleProduct(id: 'p1');
      final p2 = _createSampleProduct(id: 'p2');
      await repo.addItem(p1, quantity: 1);
      await repo.addItem(p2, quantity: 2);

      await repo.removeItem('p1');
      var res = await repo.getCartItems();
      res.fold((l) => null, (items) {
        expect(items.length, 1);
        expect(items.first.product.id, 'p2');
      });

      await repo.clearCart();
      res = await repo.getCartItems();
      res.fold((l) => null, (items) => expect(items, isEmpty));
    });
  });

  group('MockOrderRepository Tests', () {
    late MockOrderRepository repo;

    setUp(() {
      repo = MockOrderRepository();
    });

    test('places order successfully and stores in order history', () async {
      final p1 = _createSampleProduct(id: 'p1', price: 1200);
      const address = DeliveryAddress(
        id: 'a1',
        recipientName: 'Rahul',
        phone: '9999999999',
        addressLine: 'Farm 1',
        city: 'Pune',
        state: 'MH',
        pincode: '411001',
      );

      final result = await repo.placeOrder(
        items: [CartItem(product: p1, quantity: 1)],
        address: address,
        paymentMethod: 'Cash on Delivery',
        subtotal: 1200,
        deliveryFee: 0,
        discount: 200,
        totalAmount: 1200,
      );

      expect(result.isRight(), true);
      result.fold(
        (l) => fail('Order placement failed'),
        (order) {
          expect(order.id.startsWith('#AT'), true);
          expect(order.paymentMethod, 'Cash on Delivery');
          expect(order.totalAmount, 1200);
        },
      );

      final historyResult = await repo.getOrders();
      historyResult.fold(
        (l) => fail('Failed to fetch orders'),
        (orders) => expect(orders.length, 1),
      );
    });
  });

  group('Cart Providers & Computations Tests', () {
    test('computes subtotal, originalTotal, savings, delivery fee, and total amount', () async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final p1 = _createSampleProduct(
        id: 'p1',
        price: 400,
        originalPrice: 500,
      );
      final p2 = _createSampleProduct(
        id: 'p2',
        price: 300,
        originalPrice: 350,
      );

      final notifier = container.read(cartItemsProvider.notifier);
      await notifier.addItem(p1, quantity: 2); // 800, orig 1000
      await notifier.addItem(p2, quantity: 1); // 300, orig 350

      // Total subtotal = 800 + 300 = 1100 (qualifies for free delivery >= 1000)
      expect(container.read(cartItemCountProvider), 3);
      expect(container.read(cartSubtotalProvider), 1100.0);
      expect(container.read(cartOriginalTotalProvider), 1350.0);
      expect(container.read(cartSavingsProvider), 250.0);
      expect(container.read(cartDeliveryFeeProvider), 0.0);
      expect(container.read(cartTotalAmountProvider), 1100.0);
    });

    test('charges delivery fee when subtotal is below 1000', () async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final p1 = _createSampleProduct(id: 'p1', price: 600, originalPrice: 700);
      await container.read(cartItemsProvider.notifier).addItem(p1, quantity: 1);

      expect(container.read(cartSubtotalProvider), 600.0);
      expect(container.read(cartDeliveryFeeProvider), 99.0);
      expect(container.read(cartTotalAmountProvider), 699.0);
    });
  });

  group('Cart & Checkout Presentation Widget Tests', () {
    testWidgets('CartItemTile renders product info, prices, and responds to stepper', (tester) async {
      final product = _createSampleProduct(
        title: 'Hybrid Maize Seeds',
        price: 450,
        originalPrice: 550,
      );
      final item = CartItem(product: product, quantity: 2);

      int incrementCount = 0;
      int decrementCount = 0;
      int removeCount = 0;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CartItemTile(
              item: item,
              onIncrement: () => incrementCount++,
              onDecrement: () => decrementCount++,
              onRemove: () => removeCount++,
            ),
          ),
        ),
      );

      expect(find.text('Hybrid Maize Seeds'), findsOneWidget);
      expect(find.text('₹450'), findsOneWidget);
      expect(find.text('₹550'), findsOneWidget);
      expect(find.text('2'), findsOneWidget);

      await tester.tap(find.byIcon(Icons.add_rounded));
      expect(incrementCount, 1);

      await tester.tap(find.byIcon(Icons.remove_rounded));
      expect(decrementCount, 1);

      await tester.tap(find.byIcon(Icons.delete_outline_rounded));
      expect(removeCount, 1);
    });

    testWidgets('OrderSummaryCard renders bill breakdown and savings badge', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: OrderSummaryCard(
              title: 'Bill Details',
              itemCount: 2,
              subtotal: 1200,
              deliveryFee: 0,
              discount: 250,
              totalAmount: 1200,
            ),
          ),
        ),
      );

      expect(find.text('Bill Details'), findsOneWidget);
      expect(find.text('Subtotal (2 items)'), findsOneWidget);
      expect(find.text('FREE'), findsOneWidget);
      expect(find.text('₹1,200'), findsNWidgets(2));
      expect(find.textContaining('You saved ₹250'), findsOneWidget);
    });

    testWidgets('CartScreen displays empty state when cart has no items', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: CartScreen(),
          ),
        ),
      );

      expect(find.text('Your Cart is Empty'), findsOneWidget);
      expect(find.text('Explore Products'), findsOneWidget);
    });

    testWidgets('CartScreen displays item list and sticky checkout bar when populated', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final p1 = _createSampleProduct(title: 'Cotton Seeds RCH-2', price: 950);
      await container.read(cartItemsProvider.notifier).addItem(p1, quantity: 2);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: CartScreen(),
          ),
        ),
      );
      await tester.pump();

      expect(find.text('Cotton Seeds RCH-2'), findsOneWidget);
      expect(find.text('Order Summary'), findsOneWidget);
      expect(find.text('Proceed to Checkout'), findsOneWidget);
    });

    testWidgets('CheckoutScreen renders address, payment method, bill details, and place order button', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final p1 = _createSampleProduct(title: 'Soybean Seeds JS-335', price: 850);
      await container.read(cartItemsProvider.notifier).addItem(p1, quantity: 1);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: const MaterialApp(
            home: CheckoutScreen(),
          ),
        ),
      );
      await tester.pump();

      expect(find.text('Checkout'), findsOneWidget);
      expect(find.text('DELIVER TO'), findsOneWidget);
      expect(find.text('PAYMENT METHOD'), findsOneWidget);
      expect(find.text('Cash on Delivery'), findsOneWidget);
      expect(find.text('Place Order'), findsOneWidget);
    });

    testWidgets('OrderConfirmedScreen renders success celebration, order ID, and CTAs', (tester) async {
      final p1 = _createSampleProduct(title: 'Soybean Seeds', price: 850);
      final sampleOrder = Order(
        id: '#AT284759',
        items: [CartItem(product: p1, quantity: 1)],
        address: const DeliveryAddress(
          id: 'addr_1',
          recipientName: 'Rahul Sharma',
          phone: '+91 98765 43210',
          addressLine: 'Plot 42, Green Fields',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411045',
        ),
        paymentMethod: 'Cash on Delivery',
        subtotal: 850,
        deliveryFee: 99,
        discount: 150,
        totalAmount: 949,
        createdAt: DateTime.now(),
        status: OrderStatus.confirmed,
        estimatedDelivery: 'Tomorrow – 2 days',
      );

      await tester.pumpWidget(
        MaterialApp(
          home: OrderConfirmedScreen(order: sampleOrder),
        ),
      );

      expect(find.text('Order Placed Successfully!'), findsOneWidget);
      expect(find.text('#AT284759'), findsOneWidget);
      expect(find.text('Tomorrow – 2 days'), findsOneWidget);
      expect(find.text('View Orders'), findsOneWidget);
      expect(find.text('Continue Shopping'), findsOneWidget);
    });
  });
}
