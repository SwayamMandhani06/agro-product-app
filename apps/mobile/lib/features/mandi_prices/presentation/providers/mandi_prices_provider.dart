import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/di/providers.dart';
import '../../../../core/realtime/subscriptions/mandi_subscription.dart';
import '../../domain/mandi_price.dart';

final dashboardMandiPricesProvider = FutureProvider<List<MandiPrice>>((ref) async {
  final repo = ref.watch(mandiPriceRepositoryProvider);
  final result = await repo.getLatestPrices();
  return result.fold(
    (failure) => throw Exception(failure.message),
    (prices) => prices,
  );
});

/// Reactive StateNotifier providing live-updating APMC Mandi prices.
class LiveMandiPricesNotifier extends StateNotifier<AsyncValue<List<MandiPrice>>> {
  LiveMandiPricesNotifier(this.ref) : super(const AsyncValue.loading()) {
    _init();
  }

  final Ref ref;
  StreamSubscription<MandiPriceTick>? _sub;

  Future<void> _init() async {
    try {
      final repo = ref.read(mandiPriceRepositoryProvider);
      final result = await repo.getLatestPrices();
      result.fold(
        (failure) => state = AsyncValue.error(failure.message, StackTrace.current),
        (prices) => state = AsyncValue.data(prices),
      );
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }

    _sub = MandiSubscription.instance.stream.listen((tick) {
      final current = state.value;
      if (current == null) return;

      final updated = current.map((p) {
        if (p.commodity.toLowerCase() == tick.commodity.toLowerCase()) {
          return MandiPrice(
            commodity: p.commodity,
            market: tick.market,
            state: p.state,
            pricePerQuintal: tick.newPrice,
            currency: p.currency,
            recordedAt: tick.timestamp,
            variety: p.variety,
            minPrice: p.minPrice,
            maxPrice: p.maxPrice,
            modalPrice: tick.newPrice,
            arrivalsQuintals: p.arrivalsQuintals,
            trend: tick.trend,
            trendDiff: tick.trendDiff,
            history: [...p.history, tick.newPrice],
            marketComparisons: p.marketComparisons,
          );
        }
        return p;
      }).toList();

      state = AsyncValue.data(updated);
    });
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }
}

/// Live APMC Mandi Prices Provider with realtime websocket stream subscription.
final liveMandiPricesProvider =
    StateNotifierProvider<LiveMandiPricesNotifier, AsyncValue<List<MandiPrice>>>((ref) {
  return LiveMandiPricesNotifier(ref);
});

/// Alias for the full Mandi Intelligence screen.
final mandiPricesProvider = liveMandiPricesProvider;
