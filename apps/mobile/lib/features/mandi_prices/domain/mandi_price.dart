class MandiPrice {
  const MandiPrice({
    required this.commodity,
    required this.market,
    required this.state,
    required this.pricePerQuintal,
    required this.currency,
    required this.recordedAt,
  });

  final String commodity;
  final String market;
  final String state;
  final double pricePerQuintal;
  final String currency;
  final DateTime recordedAt;
}
