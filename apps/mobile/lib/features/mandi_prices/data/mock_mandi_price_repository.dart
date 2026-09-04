import 'package:fpdart/fpdart.dart';

import '../../../core/error/failure.dart';
import '../domain/mandi_price.dart';
import '../domain/mandi_price_repository.dart';

class MockMandiPriceRepository implements MandiPriceRepository {
  const MockMandiPriceRepository();

  static final _samples = [
    MandiPrice(
      commodity: 'Soybean',
      variety: 'Yellow (Grade A)',
      market: 'Latur APMC',
      state: 'Maharashtra',
      pricePerQuintal: 4680,
      currency: 'INR',
      recordedAt: DateTime.now(),
      minPrice: 4450,
      maxPrice: 4790,
      modalPrice: 4680,
      arrivalsQuintals: 4200,
      trend: 'up',
      trendDiff: '+₹120',
      history: [4480, 4520, 4510, 4590, 4610, 4640, 4680],
      marketComparisons: const [
        MarketComparison(mandi: 'Latur APMC', state: 'Maharashtra', modalPrice: 4680, distanceKm: 0, diffFromLocal: 'Local Mandi'),
        MarketComparison(mandi: 'Indore Mandi', state: 'Madhya Pradesh', modalPrice: 4750, distanceKm: 480, diffFromLocal: '+₹70/qtl'),
        MarketComparison(mandi: 'Akola APMC', state: 'Maharashtra', modalPrice: 4620, distanceKm: 240, diffFromLocal: '-₹60/qtl'),
      ],
    ),
    MandiPrice(
      commodity: 'Cotton',
      variety: 'Shankar-6 (Long Staple)',
      market: 'Adilabad APMC',
      state: 'Telangana',
      pricePerQuintal: 7420,
      currency: 'INR',
      recordedAt: DateTime.now(),
      minPrice: 7100,
      maxPrice: 7650,
      modalPrice: 7420,
      arrivalsQuintals: 1850,
      trend: 'up',
      trendDiff: '+₹180',
      history: [7100, 7180, 7250, 7300, 7340, 7390, 7420],
      marketComparisons: const [
        MarketComparison(mandi: 'Adilabad APMC', state: 'Telangana', modalPrice: 7420, distanceKm: 0, diffFromLocal: 'Local Mandi'),
        MarketComparison(mandi: 'Rajkot APMC', state: 'Gujarat', modalPrice: 7550, distanceKm: 850, diffFromLocal: '+₹130/qtl'),
      ],
    ),
    MandiPrice(
      commodity: 'Wheat',
      variety: 'Sharbati Premium',
      market: 'Pune APMC',
      state: 'Maharashtra',
      pricePerQuintal: 2580,
      currency: 'INR',
      recordedAt: DateTime.now(),
      minPrice: 2420,
      maxPrice: 2690,
      modalPrice: 2580,
      arrivalsQuintals: 6200,
      trend: 'down',
      trendDiff: '-₹35',
      history: [2650, 2640, 2620, 2600, 2590, 2585, 2580],
      marketComparisons: const [
        MarketComparison(mandi: 'Pune APMC', state: 'Maharashtra', modalPrice: 2580, distanceKm: 0, diffFromLocal: 'Local Mandi'),
        MarketComparison(mandi: 'Sehore Mandi', state: 'Madhya Pradesh', modalPrice: 2680, distanceKm: 620, diffFromLocal: '+₹100/qtl'),
      ],
    ),
    MandiPrice(
      commodity: 'Onion',
      variety: 'Red Nashik Grade A',
      market: 'Lasalgaon APMC',
      state: 'Maharashtra',
      pricePerQuintal: 2150,
      currency: 'INR',
      recordedAt: DateTime.now(),
      minPrice: 1650,
      maxPrice: 2380,
      modalPrice: 2150,
      arrivalsQuintals: 14500,
      trend: 'up',
      trendDiff: '+₹90',
      history: [1920, 1980, 2050, 2080, 2100, 2110, 2150],
      marketComparisons: const [
        MarketComparison(mandi: 'Lasalgaon APMC', state: 'Maharashtra', modalPrice: 2150, distanceKm: 0, diffFromLocal: 'Local Mandi'),
        MarketComparison(mandi: 'Azadpur Mandi', state: 'Delhi', modalPrice: 2480, distanceKm: 1250, diffFromLocal: '+₹330/qtl'),
      ],
    ),
    MandiPrice(
      commodity: 'Chana (Bengal Gram)',
      variety: 'Desi Bold',
      market: 'Buldhana APMC',
      state: 'Maharashtra',
      pricePerQuintal: 5850,
      currency: 'INR',
      recordedAt: DateTime.now(),
      minPrice: 5600,
      maxPrice: 6050,
      modalPrice: 5850,
      arrivalsQuintals: 2100,
      trend: 'steady',
      trendDiff: '₹0',
      history: [5840, 5850, 5860, 5845, 5850, 5850, 5850],
      marketComparisons: const [
        MarketComparison(mandi: 'Buldhana APMC', state: 'Maharashtra', modalPrice: 5850, distanceKm: 0, diffFromLocal: 'Local Mandi'),
      ],
    ),
  ];

  @override
  Future<Result<List<MandiPrice>>> getLatestPrices({
    String? commodity,
    String? state,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    var results = _samples;
    if (commodity != null && commodity != 'All') {
      results = results
          .where(
            (price) =>
                price.commodity.toLowerCase().contains(commodity.toLowerCase()),
          )
          .toList();
    }
    if (state != null && state != 'All') {
      results = results
          .where(
            (price) => price.state.toLowerCase().contains(state.toLowerCase()),
          )
          .toList();
    }
    return Right(results);
  }
}
