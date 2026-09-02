import 'package:fpdart/fpdart.dart';

import '../../../core/error/failure.dart';
import '../domain/mandi_price.dart';
import '../domain/mandi_price_repository.dart';

class MockMandiPriceRepository implements MandiPriceRepository {
  const MockMandiPriceRepository();

  static final _samples = [
    MandiPrice(
      commodity: 'Wheat',
      market: 'Pune APMC',
      state: 'Maharashtra',
      pricePerQuintal: 2450,
      currency: 'INR',
      recordedAt: DateTime(2026, 7, 1),
    ),
    MandiPrice(
      commodity: 'Soybean',
      market: 'Indore Mandi',
      state: 'Madhya Pradesh',
      pricePerQuintal: 4120,
      currency: 'INR',
      recordedAt: DateTime(2026, 7, 1),
    ),
    MandiPrice(
      commodity: 'Onion',
      market: 'Lasalgaon APMC',
      state: 'Maharashtra',
      pricePerQuintal: 1850,
      currency: 'INR',
      recordedAt: DateTime(2026, 7, 1),
    ),
  ];

  @override
  Future<Result<List<MandiPrice>>> getLatestPrices({
    String? commodity,
    String? state,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    var results = _samples;
    if (commodity != null) {
      results = results
          .where(
            (price) =>
                price.commodity.toLowerCase().contains(commodity.toLowerCase()),
          )
          .toList();
    }
    if (state != null) {
      results = results
          .where(
            (price) => price.state.toLowerCase().contains(state.toLowerCase()),
          )
          .toList();
    }
    return Right(results);
  }
}
