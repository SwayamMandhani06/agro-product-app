import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/addresses/presentation/addresses_screen.dart';
import '../../features/admin/presentation/admin_screen.dart';
import '../../features/auth/presentation/auth_screen.dart';
import '../../features/cart_checkout/domain/delivery_address.dart';
import '../../features/cart_checkout/domain/order.dart';
import '../../features/cart_checkout/presentation/cart_screen.dart';
import '../../features/cart_checkout/presentation/checkout_screen.dart';
import '../../features/cart_checkout/presentation/order_confirmed_screen.dart';
import '../../features/forum/presentation/forum_screen.dart';
import '../../features/home/presentation/design_system_preview.dart';
import '../../features/home/presentation/home_screen.dart';
import '../../features/home/presentation/main_shell_screen.dart';
import '../../features/mandi_prices/presentation/mandi_prices_screen.dart';
import '../../features/notifications/presentation/notifications_screen.dart';
import '../../features/onboarding/presentation/onboarding_screen.dart';
import '../../features/orders/presentation/order_details_screen.dart';
import '../../features/orders/presentation/order_tracking_screen.dart';
import '../../features/orders/presentation/orders_screen.dart';
import '../../features/products/presentation/categories_screen.dart';
import '../../features/products/presentation/product_details_screen.dart';
import '../../features/products/presentation/products_screen.dart';
import '../../features/profile/presentation/profile_screen.dart';
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
      // -----------------------------------------------------------------------
      // Main App Shell with Floating Bottom Navigation
      // -----------------------------------------------------------------------
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return MainShellScreen(navigationShell: navigationShell);
        },
        branches: [
          // Branch 0: Home
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.home,
                builder: (context, state) => const HomeScreen(),
              ),
            ],
          ),

          // Branch 1: Categories
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.categories,
                builder: (context, state) => const CategoriesScreen(),
              ),
            ],
          ),

          // Branch 2: Mandi Prices
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.mandiPrices,
                builder: (context, state) => const MandiPricesScreen(),
              ),
            ],
          ),

          // Branch 3: Orders
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.orders,
                builder: (context, state) => const OrdersScreen(),
              ),
            ],
          ),

          // Branch 4: Profile
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: AppRoutes.profile,
                builder: (context, state) => const ProfileScreen(),
              ),
            ],
          ),
        ],
      ),

      // -----------------------------------------------------------------------
      // Full-screen Top-level / Push Routes
      // -----------------------------------------------------------------------
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
        builder: (context, state) {
          final category = state.uri.queryParameters['category'];
          final query = state.uri.queryParameters['query'];
          return ProductsScreen(
            initialCategory: category,
            initialQuery: query,
          );
        },
        routes: [
          GoRoute(
            path: ':id',
            builder: (context, state) {
              final id = state.pathParameters['id'] ?? '';
              return ProductDetailsScreen(productId: id);
            },
          ),
        ],
      ),
      GoRoute(
        path: AppRoutes.cartCheckout,
        builder: (context, state) => const CartScreen(),
      ),
      GoRoute(
        path: AppRoutes.checkout,
        builder: (context, state) => const CheckoutScreen(),
      ),
      GoRoute(
        path: AppRoutes.orderConfirmed,
        builder: (context, state) {
          final order = state.extra as Order?;
          if (order != null) {
            return OrderConfirmedScreen(order: order);
          }
          return OrderConfirmedScreen(
            order: Order(
              id: '#AT${100000 + DateTime.now().millisecondsSinceEpoch % 900000}',
              items: const [],
              address: const DeliveryAddress(
                id: 'addr_1',
                recipientName: 'Rahul Sharma',
                phone: '+91 98765 43210',
                addressLine: 'Flat 402, Shivneri Residency, Baner Road',
                city: 'Pune',
                state: 'Maharashtra',
                pincode: '411045',
              ),
              paymentMethod: 'Cash on Delivery',
              subtotal: 0,
              deliveryFee: 0,
              discount: 0,
              totalAmount: 0,
              createdAt: DateTime.now(),
            ),
          );
        },
      ),
      GoRoute(
        path: AppRoutes.orderDetails,
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return OrderDetailsScreen(orderId: id);
        },
        routes: [
          GoRoute(
            path: 'track',
            builder: (context, state) {
              final id = state.pathParameters['id'] ?? '';
              return OrderTrackingScreen(orderId: id);
            },
          ),
        ],
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
