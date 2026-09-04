class MandiPrice {
  const MandiPrice({
    required this.commodity,
    required this.market,
    required this.state,
    required this.pricePerQuintal,
    required this.currency,
    required this.recordedAt,
    this.variety = 'Standard',
    this.minPrice,
    this.maxPrice,
    this.modalPrice,
    this.arrivalsQuintals = 240,
    this.trend = 'up',
    this.trendDiff = '+₹45',
    this.history = const [],
    this.marketComparisons = const [],
  });

  final String commodity;
  final String market;
  final String state;
  final double pricePerQuintal;
  final String currency;
  final DateTime recordedAt;
  final String variety;
  final double? minPrice;
  final double? maxPrice;
  final double? modalPrice;
  final int arrivalsQuintals;
  final String trend; // 'up' | 'down' | 'steady'
  final String trendDiff;
  final List<double> history;
  final List<MarketComparison> marketComparisons;
}

class MarketComparison {
  const MarketComparison({
    required this.mandi,
    required this.state,
    required this.modalPrice,
    required this.distanceKm,
    required this.diffFromLocal,
  });

  final String mandi;
  final String state;
  final double modalPrice;
  final int distanceKm;
  final String diffFromLocal;
}
