import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:agro_product_app/core/design_system/app_theme.dart';
import 'package:agro_product_app/features/products/data/mock_product_repository.dart';
import 'package:agro_product_app/features/products/domain/product.dart';
import 'package:agro_product_app/features/products/presentation/categories_screen.dart';
import 'package:agro_product_app/features/products/presentation/product_details_screen.dart';
import 'package:agro_product_app/features/products/presentation/products_screen.dart';
import 'package:agro_product_app/features/products/presentation/widgets/product_filter_sheet.dart';
import 'package:agro_product_app/features/products/presentation/widgets/product_sort_sheet.dart';

void main() {
  group('Product Discovery Domain & Filtering Tests', () {
    test('PriceRangeFilter correctly matches price bounds', () {
      expect(PriceRangeFilter.under500.matches(499), isTrue);
      expect(PriceRangeFilter.under500.matches(500), isTrue);
      expect(PriceRangeFilter.under500.matches(501), isFalse);

      expect(PriceRangeFilter.between500And1000.matches(500), isTrue);
      expect(PriceRangeFilter.between500And1000.matches(750), isTrue);
      expect(PriceRangeFilter.between500And1000.matches(1000), isTrue);
      expect(PriceRangeFilter.between500And1000.matches(1001), isFalse);

      expect(PriceRangeFilter.between1000And3000.matches(1000), isTrue);
      expect(PriceRangeFilter.between1000And3000.matches(2500), isTrue);
      expect(PriceRangeFilter.between1000And3000.matches(3000), isTrue);
      expect(PriceRangeFilter.between1000And3000.matches(3001), isFalse);

      expect(PriceRangeFilter.above3000.matches(2999), isFalse);
      expect(PriceRangeFilter.above3000.matches(3000), isTrue);
      expect(PriceRangeFilter.above3000.matches(5000), isTrue);
    });

    test('ProductFilter tracks active filters count and hasActiveFilters flag', () {
      const emptyFilter = ProductFilter.empty;
      expect(emptyFilter.hasActiveFilters, isFalse);
      expect(emptyFilter.activeFilterCount, 0);

      const filter1 = ProductFilter(category: 'Seeds');
      expect(filter1.hasActiveFilters, isTrue);
      expect(filter1.activeFilterCount, 1);

      const filter2 = ProductFilter(
        category: 'Seeds',
        priceRange: PriceRangeFilter.between1000And3000,
        minRating: 4.0,
        inStockOnly: true,
      );
      expect(filter2.hasActiveFilters, isTrue);
      expect(filter2.activeFilterCount, 4);

      final cleared = filter2.copyWith(clearCategory: true, inStockOnly: false);
      expect(cleared.category, isNull);
      expect(cleared.inStockOnly, isFalse);
      expect(cleared.activeFilterCount, 2);
    });

    test('Product galleryImages computed property returns correct list', () {
      const productNoImages = Product(
        id: 'p1',
        title: 'Test',
        price: 100,
        unit: 'kg',
      );
      expect(productNoImages.galleryImages, isEmpty);

      const productSingle = Product(
        id: 'p2',
        title: 'Test',
        price: 100,
        unit: 'kg',
        imageUrl: 'https://example.com/main.png',
      );
      expect(productSingle.galleryImages, ['https://example.com/main.png']);

      const productMulti = Product(
        id: 'p3',
        title: 'Test',
        price: 100,
        unit: 'kg',
        imageUrl: 'https://example.com/main.png',
        images: ['https://example.com/thumb1.png', 'https://example.com/thumb2.png'],
      );
      expect(productMulti.galleryImages.length, 2);
      expect(productMulti.galleryImages.first, 'https://example.com/thumb1.png');
    });
  });

  group('MockProductRepository Tests', () {
    const repo = MockProductRepository();

    test('getProducts returns full catalogue without filters', () async {
      final result = await repo.getProducts();
      expect(result.isRight(), isTrue);
      final products = result.getOrElse((_) => []);
      expect(products.length, greaterThanOrEqualTo(6));
    });

    test('getProducts filters by category', () async {
      final result = await repo.getProducts(category: 'Seeds');
      expect(result.isRight(), isTrue);
      final products = result.getOrElse((_) => []);
      expect(products.every((p) => p.category?.toLowerCase() == 'seeds'), isTrue);
    });

    test('getProducts filters by search query', () async {
      final result = await repo.getProducts(query: 'Soybean');
      expect(result.isRight(), isTrue);
      final products = result.getOrElse((_) => []);
      expect(products.isNotEmpty, isTrue);
      expect(products.first.title, contains('Soybean'));
    });

    test('getProducts filters by price range', () async {
      final result = await repo.getProducts(
        filter: const ProductFilter(priceRange: PriceRangeFilter.under500),
      );
      expect(result.isRight(), isTrue);
      final products = result.getOrElse((_) => []);
      expect(products.every((p) => p.price <= 500), isTrue);
    });

    test('getProducts sorts by price ascending and descending', () async {
      final ascResult = await repo.getProducts(sort: ProductSort.priceAsc);
      final ascProducts = ascResult.getOrElse((_) => []);
      for (int i = 0; i < ascProducts.length - 1; i++) {
        expect(ascProducts[i].price <= ascProducts[i + 1].price, isTrue);
      }

      final descResult = await repo.getProducts(sort: ProductSort.priceDesc);
      final descProducts = descResult.getOrElse((_) => []);
      for (int i = 0; i < descProducts.length - 1; i++) {
        expect(descProducts[i].price >= descProducts[i + 1].price, isTrue);
      }
    });

    test('getSimilarProducts returns products excluding target item', () async {
      final result = await repo.getSimilarProducts('prod_1');
      expect(result.isRight(), isTrue);
      final similar = result.getOrElse((_) => []);
      expect(similar.any((p) => p.id == 'prod_1'), isFalse);
    });
  });

  group('CategoriesScreen Widget Tests', () {
    testWidgets('renders category browsing grid, search bar, and hero banner',
        (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: AppTheme.light,
            home: const CategoriesScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('Browse Categories'), findsOneWidget);
      expect(find.byType(TextField), findsOneWidget);
      expect(find.text('SEASONAL ESSENTIALS'), findsOneWidget);
      expect(find.text('All Categories'), findsOneWidget);
      expect(find.text('Seeds'), findsWidgets);
      expect(find.text('Fertilizers'), findsWidgets);
    });
  });

  group('ProductsScreen Widget Tests', () {
    testWidgets('renders products listing grid, filter and sort controls',
        (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: AppTheme.light,
            home: const ProductsScreen(initialCategory: 'Seeds'),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('Seeds'), findsWidgets);
      expect(find.text('Filters'), findsOneWidget);
      expect(find.text('Sort'), findsOneWidget);
      expect(find.byType(TextField), findsOneWidget);
    });

    testWidgets('opens filter bottom sheet on tap', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: AppTheme.light,
            home: const ProductsScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Tap filter button
      await tester.tap(find.text('Filters'));
      await tester.pumpAndSettle();

      expect(find.byType(ProductFilterSheet), findsOneWidget);
      expect(find.text('Apply Filters'), findsOneWidget);
      expect(find.text('PRICE RANGE'), findsOneWidget);
      expect(find.text('In Stock Only'), findsOneWidget);
    });

    testWidgets('opens sort bottom sheet on tap', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: AppTheme.light,
            home: const ProductsScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Tap sort button
      await tester.tap(find.text('Sort'));
      await tester.pumpAndSettle();

      expect(find.byType(ProductSortSheet), findsOneWidget);
      expect(find.text('Price: Low to High'), findsOneWidget);
      expect(find.text('Price: High to Low'), findsOneWidget);
      expect(find.text('Highest Rated'), findsOneWidget);
    });
  });

  group('ProductDetailsScreen Widget Tests', () {
    testWidgets('renders product specs, pricing, seller, and sticky bottom bar',
        (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: AppTheme.light,
            home: const ProductDetailsScreen(productId: 'prod_1'),
          ),
        ),
      );

      await tester.pumpAndSettle();
      await tester.pump(const Duration(milliseconds: 300));
      await tester.pumpAndSettle();

      expect(find.text('Premium Hybrid Soybean Seeds'), findsOneWidget);
      expect(find.text('AGRIGROW'), findsOneWidget);
      expect(find.text('Product Description'), findsOneWidget);
      expect(find.text('Key Highlights'), findsOneWidget);
      expect(find.text('Specifications'), findsOneWidget);
      expect(find.text('Add to Cart'), findsOneWidget);
      expect(find.byIcon(Icons.add_rounded), findsOneWidget);
      expect(find.byIcon(Icons.remove_rounded), findsOneWidget);
    });

    testWidgets('quantity selector increments counter', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: AppTheme.light,
            home: const ProductDetailsScreen(productId: 'prod_1'),
          ),
        ),
      );

      await tester.pumpAndSettle();
      await tester.pump(const Duration(milliseconds: 300));
      await tester.pumpAndSettle();

      final quantity1 = find.byWidgetPredicate(
        (w) => w is Text && w.data == '1' && w.style?.fontSize == 15,
      );
      expect(quantity1, findsOneWidget);

      // Increment
      await tester.tap(find.byIcon(Icons.add_rounded));
      await tester.pumpAndSettle();

      final quantity2 = find.byWidgetPredicate(
        (w) => w is Text && w.data == '2' && w.style?.fontSize == 15,
      );
      expect(quantity2, findsOneWidget);

      // Decrement
      await tester.tap(find.byIcon(Icons.remove_rounded));
      await tester.pumpAndSettle();

      expect(quantity1, findsOneWidget);
    });
  });
}
