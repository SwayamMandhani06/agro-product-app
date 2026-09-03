import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/widgets/app_error_state.dart';
import '../../../core/widgets/app_loading.dart';
import '../../mandi_prices/presentation/providers/mandi_prices_provider.dart';
import '../../products/presentation/providers/product_providers.dart';
import '../../weather/presentation/providers/weather_provider.dart';
import 'widgets/ai_recommendation_card.dart';
import 'widgets/category_grid_section.dart';
import 'widgets/farmer_greeting_header.dart';
import 'widgets/featured_products_section.dart';
import 'widgets/live_mandi_section.dart';
import 'widgets/quick_actions_section.dart';
import 'widgets/weather_hero_card.dart';

/// Farmer Home Dashboard matching the Google Stitch visual source of truth.
///
/// Integrates weather forecast, AgriTrade AI smart advisory, live APMC mandi prices,
/// quick action shortcuts, agricultural categories, and featured products.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final weatherAsync = ref.watch(currentWeatherProvider);
    final mandiAsync = ref.watch(dashboardMandiPricesProvider);
    final categoriesAsync = ref.watch(categoriesProvider);
    final productsAsync = ref.watch(featuredProductsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        top: false, // FarmerGreetingHeader handles top safe area padding
        child: RefreshIndicator(
          color: AppColors.stitchForestGreen,
          backgroundColor: AppColors.surface,
          onRefresh: () async {
            ref.invalidate(currentWeatherProvider);
            ref.invalidate(dashboardMandiPricesProvider);
            ref.invalidate(categoriesProvider);
            ref.invalidate(featuredProductsProvider);
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Top Bar / Farmer Greeting
                const FarmerGreetingHeader(
                  farmerName: 'Rahul',
                  location: 'Pune, Maharashtra',
                  unreadNotifications: 2,
                ),

                const SizedBox(height: AppSpacing.sm),

                // Main Dashboard Body
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.pagePadding,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 2. Weather Summary Card
                      weatherAsync.when(
                        data: (weather) => WeatherHeroCard(weather: weather),
                        loading: () => const SizedBox(
                          height: 150,
                          child: Center(child: AppSpinner()),
                        ),
                        error: (error, _) => AppErrorState(
                          message: 'Could not load weather forecast.',
                          onRetry: () => ref.invalidate(currentWeatherProvider),
                        ),
                      ),

                      const SizedBox(height: AppSpacing.base),

                      // 3. AgriTrade AI Hero Banner
                      const AiRecommendationCard(),

                      const SizedBox(height: AppSpacing.base),

                      // 4. Live Mandi Prices
                      mandiAsync.when(
                        data: (prices) => LiveMandiSection(prices: prices),
                        loading: () => const SizedBox(
                          height: 120,
                          child: Center(child: AppSpinner()),
                        ),
                        error: (error, _) => AppErrorState(
                          message: 'Could not load mandi prices.',
                          onRetry: () =>
                              ref.invalidate(dashboardMandiPricesProvider),
                        ),
                      ),

                      const SizedBox(height: AppSpacing.base),

                      // 5. Quick Actions
                      const QuickActionsSection(),

                      const SizedBox(height: AppSpacing.base),

                      // 6. Browse Categories
                      categoriesAsync.when(
                        data: (categories) =>
                            CategoryGridSection(categories: categories),
                        loading: () => const SizedBox(
                          height: 120,
                          child: Center(child: AppSpinner()),
                        ),
                        error: (error, _) => AppErrorState(
                          message: 'Could not load categories.',
                          onRetry: () => ref.invalidate(categoriesProvider),
                        ),
                      ),

                      const SizedBox(height: AppSpacing.base),

                      // 7. Recommended Products
                      productsAsync.when(
                        data: (products) =>
                            FeaturedProductsSection(products: products),
                        loading: () => const SizedBox(
                          height: 200,
                          child: Center(child: AppSpinner()),
                        ),
                        error: (error, _) => AppErrorState(
                          message: 'Could not load recommended products.',
                          onRetry: () =>
                              ref.invalidate(featuredProductsProvider),
                        ),
                      ),

                      // Safe area bottom padding for floating glass AppBottomNavBar
                      const SizedBox(height: 100),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
