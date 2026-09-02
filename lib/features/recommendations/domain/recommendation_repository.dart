import '../../../core/error/failure.dart';
import 'product_recommendation.dart';

abstract interface class RecommendationRepository {
  Future<Result<List<ProductRecommendation>>> getRecommendations({
    required String userId,
    String? cropType,
  });
}
