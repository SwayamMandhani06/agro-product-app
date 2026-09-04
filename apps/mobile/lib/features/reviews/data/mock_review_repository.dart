import 'package:fpdart/fpdart.dart';
import '../../../core/error/failure.dart';
import '../domain/review.dart';
import '../domain/review_repository.dart';

/// In-memory mock review repository with rich seed reviews.
class MockReviewRepository implements ReviewRepository {
  MockReviewRepository({List<Review>? initialReviews})
      : _reviews = initialReviews != null
            ? List.from(initialReviews)
            : [
                Review(
                  id: 'rev_1',
                  productId: 'prod_1',
                  userId: 'usr_01',
                  userName: 'Suresh Patil',
                  rating: 5.0,
                  title: 'Exceptional 94% Germination Rate',
                  comment:
                      'Planted 4 bags across 6 acres in loamy black soil. Uniform emergence within 4 days of sowing. Strong resistance to yellow mosaic virus throughout the monsoon season.',
                  createdAt: DateTime.now().subtract(const Duration(days: 4)),
                  verifiedPurchase: true,
                ),
                Review(
                  id: 'rev_2',
                  productId: 'prod_1',
                  userId: 'usr_02',
                  userName: 'Rajesh Deshmukh',
                  rating: 4.5,
                  title: 'High pod count and strong stalks',
                  comment:
                      'Vigorous vegetative growth and excellent nodulation. Clean packaging with certified tag and batch barcode.',
                  createdAt: DateTime.now().subtract(const Duration(days: 12)),
                  verifiedPurchase: true,
                ),
                Review(
                  id: 'rev_3',
                  productId: 'prod_1',
                  userId: 'usr_03',
                  userName: 'Vikas Ghadge',
                  rating: 4.0,
                  title: 'Good quality, prompt doorstep delivery',
                  comment:
                      'Bag arrived tightly sealed. A bit more moisture sensitivity in heavy waterlogged zones, but overall outstanding harvest volume.',
                  createdAt: DateTime.now().subtract(const Duration(days: 19)),
                  verifiedPurchase: true,
                ),
                Review(
                  id: 'rev_4',
                  productId: 'prod_2',
                  userId: 'usr_04',
                  userName: 'Anil Jadhav',
                  rating: 5.0,
                  title: 'Fast-acting nitrogen boost',
                  comment:
                      'Dissolves clear in fertigation lines without clogging micro-emitters. Visible leaf greening within 48 hours of foliar application.',
                  createdAt: DateTime.now().subtract(const Duration(days: 6)),
                  verifiedPurchase: true,
                ),
                Review(
                  id: 'rev_5',
                  productId: 'prod_3',
                  userId: 'usr_05',
                  userName: 'Santosh Shinde',
                  rating: 5.0,
                  title: 'Complete stem borer eradication',
                  comment:
                      'Applied on kharif paddy. Controlled whorl-maggot and stem borer with residual action for over 3 weeks. Genuine factory seal.',
                  createdAt: DateTime.now().subtract(const Duration(days: 9)),
                  verifiedPurchase: true,
                ),
                Review(
                  id: 'rev_6',
                  productId: 'prod_4',
                  userId: 'usr_06',
                  userName: 'Kiran Thorat',
                  rating: 4.5,
                  title: 'Precision spray pattern and uniform droplets',
                  comment:
                      'Piston chamber holds steady 4 bar pressure. Adjustable brass nozzle gives fine fogging ideal for fungicide coverage on pomegranate.',
                  createdAt: DateTime.now().subtract(const Duration(days: 15)),
                  verifiedPurchase: true,
                ),
              ];

  final List<Review> _reviews;

  @override
  Future<Result<List<Review>>> getReviewsByProductId(String productId) async {
    final filtered = _reviews.where((r) => r.productId == productId).toList();
    if (filtered.isEmpty) {
      // Return a default mock review if none exist for other items
      return right([
        Review(
          id: 'rev_generic',
          productId: productId,
          userId: 'usr_verified',
          userName: 'Ramesh Patil',
          rating: 4.8,
          title: 'Direct manufacturer quality batch',
          comment:
              'Product arrived in original tamper-proof packaging. Performs reliably with proven field results.',
          createdAt: DateTime.now().subtract(const Duration(days: 5)),
          verifiedPurchase: true,
        ),
      ]);
    }
    return right(filtered);
  }

  @override
  Future<Result<ReviewSummary>> getReviewSummary(String productId) async {
    final reviewsResult = await getReviewsByProductId(productId);
    return reviewsResult.map((reviews) {
      final total = reviews.length;
      final sum = reviews.fold<double>(0.0, (acc, r) => acc + r.rating);
      final avg = total > 0 ? (sum / total) : 4.8;

      final breakdown = <int, int>{5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
      for (final r in reviews) {
        final star = r.rating.round().clamp(1, 5);
        breakdown[star] = (breakdown[star] ?? 0) + 1;
      }

      return ReviewSummary(
        averageRating: double.parse(avg.toStringAsFixed(1)),
        totalReviews: total,
        breakdown: breakdown,
      );
    });
  }

  @override
  Future<Result<Review>> submitReview({
    required String productId,
    required String userId,
    required String userName,
    required double rating,
    required String title,
    required String comment,
    bool verifiedPurchase = true,
  }) async {
    final review = Review(
      id: 'rev_${DateTime.now().millisecondsSinceEpoch}',
      productId: productId,
      userId: userId,
      userName: userName,
      rating: rating,
      title: title,
      comment: comment,
      createdAt: DateTime.now(),
      verifiedPurchase: verifiedPurchase,
    );

    _reviews.insert(0, review);
    return right(review);
  }
}
