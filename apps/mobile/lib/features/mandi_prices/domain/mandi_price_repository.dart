import '../../../core/error/failure.dart';
import 'mandi_price.dart';

abstract interface class MandiPriceRepository {
  Future<Result<List<MandiPrice>>> getLatestPrices({
    String? commodity,
    String? state,
  });
}
