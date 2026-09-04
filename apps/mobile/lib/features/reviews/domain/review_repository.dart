
import '../../../core/error/failure.dart';
import 'review.dart';

/// Contract for fetching and submitting product reviews.
abstract class ReviewRepository {
  /// Retrieves reviews for a specific product.
  Future<Result<List<Review>>> getReviewsByProductId(String productId);

  /// Retrieves calculated summary stats for a product.
  Future<Result<ReviewSummary>> getReviewSummary(String productId);

  /// Submits a new review.
  Future<Result<Review>> submitReview({
    required String productId,
    required String userId,
    required String userName,
    required double rating,
    required String title,
    required String comment,
    bool verifiedPurchase = true,
  });
}
