import 'package:fpdart/fpdart.dart';

import '../../../core/error/failure.dart';
import '../domain/product_recommendation.dart';
import '../domain/recommendation_repository.dart';

class MockRecommendationRepository implements RecommendationRepository {
  const MockRecommendationRepository();

  static const _samples = [
    ProductRecommendation(
      productId: 'seed-001',
      productName: 'Hybrid Tomato Seeds (500g)',
      reason: 'Popular for Kharif season in your region.',
      score: 0.92,
      category: 'Seeds',
    ),
    ProductRecommendation(
      productId: 'fert-014',
      productName: 'Organic Vermicompost (25kg)',
      reason: 'Pairs well with your recent vegetable seed purchases.',
      score: 0.87,
      category: 'Fertilizers',
    ),
    ProductRecommendation(
      productId: 'pest-008',
      productName: 'Neem Oil Spray (1L)',
      reason: 'Recommended for monsoon pest control.',
      score: 0.81,
      category: 'Pesticides',
    ),
  ];

  @override
  Future<Result<List<ProductRecommendation>>> getRecommendations({
    required String userId,
    String? cropType,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    if (userId.isEmpty) {
      return const Left(AuthFailure('User id is required for recommendations.'));
    }
    return const Right(_samples);
  }
}
