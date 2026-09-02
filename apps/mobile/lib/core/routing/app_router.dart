import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/addresses/presentation/addresses_screen.dart';
import '../../features/admin/presentation/admin_screen.dart';
import '../../features/auth/presentation/auth_screen.dart';
import '../../features/cart_checkout/presentation/cart_checkout_screen.dart';
import '../../features/forum/presentation/forum_screen.dart';
import '../../features/home/presentation/design_system_preview.dart';
import '../../features/home/presentation/home_screen.dart';
import '../../features/mandi_prices/presentation/mandi_prices_screen.dart';
import '../../features/notifications/presentation/notifications_screen.dart';
import '../../features/onboarding/presentation/onboarding_screen.dart';
import '../../features/orders/presentation/orders_screen.dart';
import '../../features/products/presentation/products_screen.dart';
import '../../features/recommendations/presentation/recommendations_screen.dart';
import '../../features/reviews/presentation/reviews_screen.dart';
import '../../features/search/presentation/search_screen.dart';
import '../../features/seller/presentation/seller_screen.dart';
import '../../features/weather/presentation/weather_screen.dart';
import '../../features/wishlist/presentation/wishlist_screen.dart';
import 'routes.dart';

final goRouterProvider = Provider<GoRouter>((ref) {
  final analytics = FirebaseAnalytics.instance;

  return GoRouter(
    initialLocation: AppRoutes.home,
    observers: [
      FirebaseAnalyticsObserver(analytics: analytics),
    ],
    redirect: (context, state) {
      // TODO(Stage 4): Check auth state and user role, redirect unauthenticated
      // users to /auth and role-restricted routes to the correct home.
      return null;
    },
    routes: [
      GoRoute(
        path: AppRoutes.home,
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: AppRoutes.auth,
        builder: (context, state) => const AuthScreen(),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: AppRoutes.products,
        builder: (context, state) => const ProductsScreen(),
      ),
      GoRoute(
        path: AppRoutes.cartCheckout,
        builder: (context, state) => const CartCheckoutScreen(),
      ),
      GoRoute(
        path: AppRoutes.orders,
        builder: (context, state) => const OrdersScreen(),
      ),
      GoRoute(
        path: AppRoutes.wishlist,
        builder: (context, state) => const WishlistScreen(),
      ),
      GoRoute(
        path: AppRoutes.addresses,
        builder: (context, state) => const AddressesScreen(),
      ),
      GoRoute(
        path: AppRoutes.reviews,
        builder: (context, state) => const ReviewsScreen(),
      ),
      GoRoute(
        path: AppRoutes.search,
        builder: (context, state) => const SearchScreen(),
      ),
      GoRoute(
        path: AppRoutes.seller,
        builder: (context, state) => const SellerScreen(),
      ),
      GoRoute(
        path: AppRoutes.admin,
        builder: (context, state) => const AdminScreen(),
      ),
      GoRoute(
        path: AppRoutes.recommendations,
        builder: (context, state) => const RecommendationsScreen(),
      ),
      GoRoute(
        path: AppRoutes.weather,
        builder: (context, state) => const WeatherScreen(),
      ),
      GoRoute(
        path: AppRoutes.mandiPrices,
        builder: (context, state) => const MandiPricesScreen(),
      ),
      GoRoute(
        path: AppRoutes.notifications,
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: AppRoutes.forum,
        builder: (context, state) => const ForumScreen(),
      ),
      GoRoute(
        path: AppRoutes.designSystemPreview,
        builder: (context, state) => const DesignSystemPreviewScreen(),
      ),
    ],
  );
});
