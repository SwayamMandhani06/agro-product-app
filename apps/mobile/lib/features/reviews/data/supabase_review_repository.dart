import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:fpdart/fpdart.dart';

import '../../../core/config/backend_config.dart';
import '../../../core/error/failure.dart';
import '../domain/review.dart';
import '../domain/review_repository.dart';
import 'mock_review_repository.dart';

/// Supabase PostgREST implementation of [ReviewRepository] with mock fallback.
class SupabaseReviewRepository implements ReviewRepository {
  SupabaseReviewRepository({Dio? dio})
      : _dio = dio ?? Dio(),
        _mock = MockReviewRepository();

  final Dio _dio;
  final MockReviewRepository _mock;

  @override
  Future<Result<List<Review>>> getReviewsByProductId(String productId) async {
    if (!BackendConfig.isConfigured) return _mock.getReviewsByProductId(productId);

    try {
      final response = await _dio.get(
        '${BackendConfig.restBaseUrl}/reviews',
        queryParameters: {
          'product_id': 'eq.$productId',
          'order': 'created_at.desc',
        },
        options: Options(headers: BackendConfig.headers),
      );

      final rows = response.data as List;
      if (rows.isEmpty) return _mock.getReviewsByProductId(productId);

      final reviews = rows.map((r) => Review(
            id: r['id'] as String,
            productId: r['product_id'] as String,
            userId: r['user_id'] as String,
            userName: r['user_name'] as String,
            rating: (r['rating'] as num).toDouble(),
            title: r['title'] as String,
            comment: r['comment'] as String,
            createdAt: DateTime.tryParse(r['created_at'] as String? ?? '') ?? DateTime.now(),
            verifiedPurchase: r['verified_purchase'] as bool? ?? true,
          )).toList();

      return right(reviews);
    } catch (e) {
      debugPrint('[SupabaseReviewRepository] getReviewsByProductId error: $e');
      return _mock.getReviewsByProductId(productId);
    }
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
    if (!BackendConfig.isConfigured) {
      return _mock.submitReview(
        productId: productId,
        userId: userId,
        userName: userName,
        rating: rating,
        title: title,
        comment: comment,
        verifiedPurchase: verifiedPurchase,
      );
    }

    try {
      final response = await _dio.post(
        '${BackendConfig.restBaseUrl}/reviews',
        data: {
          'product_id': productId,
          'user_id': userId,
          'user_name': userName,
          'rating': rating,
          'title': title,
          'comment': comment,
          'verified_purchase': verifiedPurchase,
        },
        options: Options(headers: BackendConfig.headers),
      );

      final row = (response.data as List).first;
      final review = Review(
        id: row['id'] as String,
        productId: row['product_id'] as String,
        userId: row['user_id'] as String,
        userName: row['user_name'] as String,
        rating: (row['rating'] as num).toDouble(),
        title: row['title'] as String,
        comment: row['comment'] as String,
        createdAt: DateTime.tryParse(row['created_at'] as String? ?? '') ?? DateTime.now(),
        verifiedPurchase: row['verified_purchase'] as bool? ?? true,
      );
      return right(review);
    } catch (e) {
      debugPrint('[SupabaseReviewRepository] submitReview error: $e');
      return _mock.submitReview(
        productId: productId,
        userId: userId,
        userName: userName,
        rating: rating,
        title: title,
        comment: comment,
        verifiedPurchase: verifiedPurchase,
      );
    }
  }
}
