import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/config/backend_config.dart';
import '../../data/mock_review_repository.dart';
import '../../data/supabase_review_repository.dart';
import '../../domain/review.dart';
import '../../domain/review_repository.dart';

/// Review repository provider with conditional Supabase/Mock resolution.
final reviewRepositoryProvider = Provider<ReviewRepository>((ref) {
  if (BackendConfig.isConfigured) {
    return SupabaseReviewRepository();
  }
  return MockReviewRepository();
});

/// Fetches reviews for a given product ID.
final productReviewsProvider =
    FutureProvider.family<List<Review>, String>((ref, productId) async {
  final repo = ref.watch(reviewRepositoryProvider);
  final result = await repo.getReviewsByProductId(productId);
  return result.fold(
    (failure) => throw failure,
    (reviews) => reviews,
  );
});

/// Fetches calculated review summary stats for a given product ID.
final productReviewSummaryProvider =
    FutureProvider.family<ReviewSummary, String>((ref, productId) async {
  final repo = ref.watch(reviewRepositoryProvider);
  final result = await repo.getReviewSummary(productId);
  return result.fold(
    (failure) => throw failure,
    (summary) => summary,
  );
});
