import 'dart:async';

class MandiPriceTick {
  const MandiPriceTick({
    required this.commodity,
    required this.market,
    required this.newPrice,
    required this.trend,
    required this.trendDiff,
    required this.timestamp,
  });

  final String commodity;
  final String market;
  final double newPrice;
  final String trend; // 'up' | 'down' | 'steady'
  final String trendDiff;
  final DateTime timestamp;
}

/// Broadcast stream subscription manager for real-time Mandi price ticks.
class MandiSubscription {
  MandiSubscription._();
  static final MandiSubscription instance = MandiSubscription._();

  final _controller = StreamController<MandiPriceTick>.broadcast();

  Stream<MandiPriceTick> get stream => _controller.stream;

  void emit(MandiPriceTick tick) {
    if (!_controller.isClosed) {
      _controller.add(tick);
    }
  }

  void dispose() {
    _controller.close();
  }
}
