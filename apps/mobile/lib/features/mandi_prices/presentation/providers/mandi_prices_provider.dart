import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/di/providers.dart';
import '../../domain/mandi_price.dart';

final dashboardMandiPricesProvider = FutureProvider<List<MandiPrice>>((ref) async {
  final repo = ref.watch(mandiPriceRepositoryProvider);
  final result = await repo.getLatestPrices();
  return result.fold(
    (failure) => throw Exception(failure.message),
    (prices) => prices,
  );
});
