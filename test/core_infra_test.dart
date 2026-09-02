import 'package:flutter_test/flutter_test.dart';

import 'package:agro_product_app/core/error/exception_mapper.dart';
import 'package:agro_product_app/core/error/failure.dart';
import 'package:agro_product_app/features/cart_checkout/data/mock_payment_gateway.dart';
import 'package:agro_product_app/features/cart_checkout/domain/payment_result.dart';
import 'package:agro_product_app/features/mandi_prices/data/mock_mandi_price_repository.dart';
import 'package:agro_product_app/features/recommendations/data/mock_recommendation_repository.dart';
import 'package:agro_product_app/features/weather/data/mock_weather_repository.dart';

void main() {
  group('Failure mapping', () {
    test('maps unknown errors to UnknownFailure', () {
      final failure = mapExceptionToFailure(Exception('boom'));
      expect(failure, isA<UnknownFailure>());
    });
  });

  group('Mock repositories', () {
    test('weather repository returns sample data', () async {
      const repo = MockWeatherRepository();
      final result = await repo.getCurrentWeather();
      expect(result.isRight(), isTrue);
      result.fold(
        (_) => fail('expected right'),
        (weather) => expect(weather.location, isNotEmpty),
      );
    });

    test('mandi price repository returns samples', () async {
      const repo = MockMandiPriceRepository();
      final result = await repo.getLatestPrices();
      expect(result.getOrElse((_) => []).length, greaterThan(0));
    });

    test('recommendation repository requires user id', () async {
      const repo = MockRecommendationRepository();
      final result = await repo.getRecommendations(userId: '');
      expect(result.isLeft(), isTrue);
    });

    test('mock payment gateway succeeds', () async {
      const gateway = MockPaymentGateway();
      final result = await gateway.pay(
        const PaymentRequest(
          orderId: 'order-1',
          amountInPaise: 10000,
          currency: 'INR',
          customerName: 'Test Farmer',
          customerEmail: 'farmer@example.com',
          customerPhone: '9999999999',
        ),
      );
      expect(result.isRight(), isTrue);
      result.fold(
        (_) => fail('expected success'),
        (payment) => expect(payment.status, PaymentStatus.success),
      );
    });
  });
}
