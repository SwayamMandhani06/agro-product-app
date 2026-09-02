import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/cart_checkout/data/mock_payment_gateway.dart';
import '../../features/cart_checkout/domain/payment_gateway.dart';
import '../../features/mandi_prices/data/mock_mandi_price_repository.dart';
import '../../features/mandi_prices/domain/mandi_price_repository.dart';
import '../../features/recommendations/data/mock_recommendation_repository.dart';
import '../../features/recommendations/domain/recommendation_repository.dart';
import '../../features/weather/data/mock_weather_repository.dart';
import '../../features/weather/domain/weather_repository.dart';
import '../network/env_config.dart';

final envConfigProvider = Provider<EnvConfig>((ref) => const EnvConfig());

/// Swap mock implementations for real data-layer classes in later stages.
final weatherRepositoryProvider = Provider<WeatherRepository>(
  (ref) => const MockWeatherRepository(),
);

final mandiPriceRepositoryProvider = Provider<MandiPriceRepository>(
  (ref) => const MockMandiPriceRepository(),
);

final recommendationRepositoryProvider = Provider<RecommendationRepository>(
  (ref) => const MockRecommendationRepository(),
);

final paymentGatewayProvider = Provider<PaymentGateway>(
  (ref) => const MockPaymentGateway(),
);

/// Central place for Riverpod overrides used in tests or flavor-specific wiring.
List<Override> appProviderOverrides() => const [];
