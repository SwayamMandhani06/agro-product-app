import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:agro_product_app/core/design_system/design_system.dart';
import 'package:agro_product_app/core/widgets/widgets.dart';

void main() {
  group('PriceText Widget', () {
    testWidgets('formats rupee price and shows unit', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: PriceText(
              price: 1850,
              unit: 'kg',
            ),
          ),
        ),
      );

      expect(find.textContaining('1,850'), findsOneWidget);
      expect(find.text('/ kg'), findsOneWidget);
    });

    testWidgets('shows strikethrough original price and discount badge', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: PriceText(
              price: 1000,
              originalPrice: 1250,
              showDiscountBadge: true,
            ),
          ),
        ),
      );

      expect(find.textContaining('1,000'), findsOneWidget);
      expect(find.textContaining('1,250'), findsOneWidget);
      expect(find.text('-20%'), findsOneWidget);
    });
  });

  group('ProductCard Widget', () {
    testWidgets('renders product info and handles interactions', (tester) async {
      var cardTapped = false;
      var cartTapped = false;

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: SingleChildScrollView(
              child: SizedBox(
                width: 200,
                child: ProductCard(
                  id: 'prod_1',
                  title: 'JS-335 Certified Soybean Seeds',
                  price: 1850,
                  originalPrice: 2200,
                  sellerName: 'Mahyco Krishi',
                  category: 'Seeds',
                  rating: 4.8,
                  reviewCount: 142,
                  onTap: () => cardTapped = true,
                  onAddToCart: () => cartTapped = true,
                ),
              ),
            ),
          ),
        ),
      );

      expect(find.text('JS-335 Certified Soybean Seeds'), findsOneWidget);
      expect(find.text('Mahyco Krishi'), findsOneWidget);
      expect(find.text('Seeds'), findsOneWidget);
      expect(find.text('4.8'), findsOneWidget);
      expect(find.text('(142)'), findsOneWidget);

      await tester.tap(find.text('JS-335 Certified Soybean Seeds'));
      expect(cardTapped, isTrue);

      await tester.tap(find.byIcon(Icons.add_shopping_cart_rounded));
      expect(cartTapped, isTrue);
    });

    testWidgets('renders horizontal list variant', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(
            body: ProductCard(
              id: 'prod_2',
              title: 'DAP Fertilizer 50kg',
              price: 1350,
              variant: ProductCardVariant.list,
            ),
          ),
        ),
      );

      expect(find.text('DAP Fertilizer 50kg'), findsOneWidget);
      expect(find.textContaining('1,350'), findsOneWidget);
    });
  });

  group('MandiPriceCard Widget', () {
    testWidgets('renders commodity and trend badge', (tester) async {
      var tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: Scaffold(
            body: MandiPriceCard(
              commodityName: 'Soybean (Yellow)',
              mandiName: 'Indore Mandi, MP',
              modalPrice: 4850,
              percentageChange: 2.5,
              priceChange: 120,
              minPrice: 4600,
              maxPrice: 5100,
              arrivalVolume: '1,200 quintals',
              lastUpdated: 'Today, 11:30 AM',
              onTap: () => tapped = true,
            ),
          ),
        ),
      );

      expect(find.text('Soybean (Yellow)'), findsOneWidget);
      expect(find.text('Indore Mandi, MP'), findsOneWidget);
      expect(find.textContaining('4,850'), findsOneWidget);
      expect(find.text('+2.5%'), findsOneWidget);
      expect(find.text('Arrivals: 1,200 quintals'), findsOneWidget);

      await tester.tap(find.text('Soybean (Yellow)'));
      expect(tapped, isTrue);
    });
  });

  group('AppTopBar Widget', () {
    testWidgets('renders location and badge counters', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: const Scaffold(
            appBar: AppTopBar(
              location: 'Ujjain, MP',
              cartItemCount: 3,
              unreadNotificationCount: 5,
            ),
          ),
        ),
      );

      expect(find.text('Ujjain, MP'), findsOneWidget);
      expect(find.text('3'), findsOneWidget);
      expect(find.text('5'), findsOneWidget);
      expect(find.text('Search seeds, fertilizers, mandi...'), findsOneWidget);
    });
  });

  group('AppBottomNavBar Widget', () {
    testWidgets('renders 5 tabs and responds to selection', (tester) async {
      var selectedIndex = 0;

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light,
          home: StatefulBuilder(
            builder: (context, setState) {
              return Scaffold(
                bottomNavigationBar: AppBottomNavBar(
                  currentIndex: selectedIndex,
                  onTap: (index) => setState(() => selectedIndex = index),
                ),
              );
            },
          ),
        ),
      );

      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Categories'), findsOneWidget);
      expect(find.text('Mandi'), findsOneWidget);
      expect(find.text('Orders'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);

      await tester.tap(find.text('Mandi'));
      await tester.pumpAndSettle();
      expect(selectedIndex, 2);

      await tester.tap(find.text('Orders'));
      await tester.pumpAndSettle();
      expect(selectedIndex, 3);
    });
  });
}
