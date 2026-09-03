import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:agro_product_app/core/design_system/design_system.dart';
import 'package:agro_product_app/core/widgets/app_error_state.dart';
import 'package:agro_product_app/core/widgets/app_loading.dart';
import 'package:agro_product_app/features/home/presentation/home_screen.dart';
import 'package:agro_product_app/features/home/presentation/widgets/ai_recommendation_card.dart';
import 'package:agro_product_app/features/home/presentation/widgets/category_grid_section.dart';
import 'package:agro_product_app/features/home/presentation/widgets/farmer_greeting_header.dart';
import 'package:agro_product_app/features/home/presentation/widgets/featured_products_section.dart';
import 'package:agro_product_app/features/home/presentation/widgets/live_mandi_section.dart';
import 'package:agro_product_app/features/home/presentation/widgets/quick_actions_section.dart';
import 'package:agro_product_app/features/home/presentation/widgets/weather_hero_card.dart';
import 'package:agro_product_app/features/mandi_prices/domain/mandi_price.dart';
import 'package:agro_product_app/features/mandi_prices/presentation/providers/mandi_prices_provider.dart';
import 'package:agro_product_app/features/products/domain/product.dart';
import 'package:agro_product_app/features/products/presentation/providers/product_providers.dart';
import 'package:agro_product_app/features/weather/domain/weather_info.dart';
import 'package:agro_product_app/features/weather/presentation/providers/weather_provider.dart';

void main() {
  const sampleWeather = WeatherInfo(
    location: 'Pune, Maharashtra',
    temperatureCelsius: 28.0,
    condition: 'Partly Cloudy',
    humidityPercent: 45,
    windSpeedKph: 12.0,
    iconCode: 'partly_cloudy_day',
  );

  final sampleMandiPrices = [
    MandiPrice(
      commodity: 'Soybean',
      market: 'Indore Mandi',
      state: 'Madhya Pradesh',
      pricePerQuintal: 4850,
      currency: 'INR',
      recordedAt: DateTime(2026, 7, 1),
    ),
    MandiPrice(
      commodity: 'Wheat',
      market: 'Pune APMC',
      state: 'Maharashtra',
      pricePerQuintal: 2420,
      currency: 'INR',
      recordedAt: DateTime(2026, 7, 1),
    ),
  ];

  const sampleCategories = [
    ProductCategory(id: '1', name: 'Seeds', icon: Icons.eco_rounded),
    ProductCategory(id: '2', name: 'Fertilizers', icon: Icons.science_rounded),
    ProductCategory(id: '3', name: 'Crop Protection', icon: Icons.bug_report_rounded),
  ];

  const sampleProducts = [
    Product(
      id: 'prod_1',
      title: 'JS-335 Certified Soybean Seeds',
      price: 1850,
      originalPrice: 2200,
      sellerName: 'Mahyco Krishi',
      category: 'Seeds',
      rating: 4.8,
      reviewCount: 142,
    ),
  ];

  group('Farmer Home Dashboard Screen', () {
    testWidgets('renders all core dashboard sections and data', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            currentWeatherProvider.overrideWith((ref) => Future.value(sampleWeather)),
            dashboardMandiPricesProvider.overrideWith((ref) => Future.value(sampleMandiPrices)),
            categoriesProvider.overrideWith((ref) => Future.value(sampleCategories)),
            featuredProductsProvider.overrideWith((ref) => Future.value(sampleProducts)),
          ],
          child: MaterialApp(
            theme: AppTheme.light,
            home: const HomeScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // 1. Farmer greeting
      expect(find.byType(FarmerGreetingHeader), findsOneWidget);
      expect(find.textContaining('Farmer'), findsOneWidget);
      expect(find.text("Here’s what’s happening on your farm today."), findsOneWidget);

      // 2. Weather hero card
      expect(find.byType(WeatherHeroCard), findsOneWidget);
      expect(find.text('Pune, Maharashtra'), findsWidgets);
      expect(find.text('28°C'), findsOneWidget);
      expect(find.text('Partly Cloudy'), findsOneWidget);
      expect(find.text('45%'), findsOneWidget);
      expect(find.text('12 km/h'), findsOneWidget);
      expect(find.text('View detailed forecast'), findsOneWidget);

      // 3. AgriTrade AI card
      expect(find.byType(AiRecommendationCard), findsOneWidget);
      expect(find.text('AGRITRADE AI'), findsOneWidget);
      expect(find.text('Optimal watering window'), findsOneWidget);

      // 4. Live Mandi Prices
      expect(find.byType(LiveMandiSection), findsOneWidget);
      expect(find.text('Live Mandi Prices'), findsOneWidget);
      expect(find.text('Soybean'), findsOneWidget);
      expect(find.text('Wheat'), findsOneWidget);

      // 5. Quick Actions
      expect(find.byType(QuickActionsSection), findsOneWidget);
      expect(find.text('Quick Actions'), findsOneWidget);
      expect(find.text('Browse Products'), findsOneWidget);
      expect(find.text('Ask AgriTrade AI'), findsOneWidget);
      expect(find.text('Track Orders'), findsOneWidget);
      expect(find.text('Community'), findsOneWidget);

      // 6. Categories section
      expect(find.byType(CategoryGridSection), findsOneWidget);
      expect(find.text('Browse Categories'), findsOneWidget);
      expect(find.text('Seeds'), findsWidgets);
      expect(find.text('Fertilizers'), findsOneWidget);

      // 7. Recommended products
      expect(find.byType(FeaturedProductsSection), findsOneWidget);
      expect(find.text('Recommended for You'), findsOneWidget);
      expect(find.text('JS-335 Certified Soybean Seeds'), findsOneWidget);
    });

    testWidgets('handles loading states gracefully', (tester) async {
      final weatherCompleter = Completer<WeatherInfo>();
      final mandiCompleter = Completer<List<MandiPrice>>();
      final catCompleter = Completer<List<ProductCategory>>();
      final prodCompleter = Completer<List<Product>>();

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            currentWeatherProvider.overrideWith((ref) => weatherCompleter.future),
            dashboardMandiPricesProvider.overrideWith((ref) => mandiCompleter.future),
            categoriesProvider.overrideWith((ref) => catCompleter.future),
            featuredProductsProvider.overrideWith((ref) => prodCompleter.future),
          ],
          child: MaterialApp(
            theme: AppTheme.light,
            home: const HomeScreen(),
          ),
        ),
      );

      // Initial frame must show loading spinners
      await tester.pump();
      expect(find.byType(AppSpinner), findsWidgets);

      // Complete futures to clean up
      weatherCompleter.complete(sampleWeather);
      mandiCompleter.complete(sampleMandiPrices);
      catCompleter.complete(sampleCategories);
      prodCompleter.complete(sampleProducts);
      await tester.pumpAndSettle();

      expect(find.byType(AppSpinner), findsNothing);
    });

    testWidgets('handles error states with retry action', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            currentWeatherProvider.overrideWith((ref) => Future.error(Exception('Weather fetch failed'))),
            dashboardMandiPricesProvider.overrideWith((ref) => Future.value(sampleMandiPrices)),
            categoriesProvider.overrideWith((ref) => Future.value(sampleCategories)),
            featuredProductsProvider.overrideWith((ref) => Future.value(sampleProducts)),
          ],
          child: MaterialApp(
            theme: AppTheme.light,
            home: const HomeScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.byType(AppErrorState), findsOneWidget);
      expect(find.text('Could not load weather forecast.'), findsOneWidget);
      expect(find.text('Try again'), findsOneWidget);
    });
  });
}
