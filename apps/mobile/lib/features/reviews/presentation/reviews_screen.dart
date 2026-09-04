import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/widgets/app_error_state.dart';
import '../../../core/widgets/app_loading.dart';
import '../domain/review.dart';
import 'providers/reviews_provider.dart';
import 'widgets/review_card.dart';
import 'widgets/review_summary_card.dart';
import 'widgets/write_review_sheet.dart';

/// Full screen displaying all reviews and summary breakdown for a product.
class ReviewsScreen extends ConsumerStatefulWidget {
  const ReviewsScreen({
    super.key,
    this.productId = 'prod_1',
    this.productTitle = 'Agricultural Input',
  });

  final String productId;
  final String productTitle;

  @override
  ConsumerState<ReviewsScreen> createState() => _ReviewsScreenState();
}

class _ReviewsScreenState extends ConsumerState<ReviewsScreen> {
  String _sort = 'newest';

  @override
  Widget build(BuildContext context) {
    final reviewsAsync = ref.watch(productReviewsProvider(widget.productId));
    final summaryAsync = ref.watch(productReviewSummaryProvider(widget.productId));

    return Scaffold(
      backgroundColor: AppColors.stitchCanvas,
      appBar: AppBar(
        title: Text('${widget.productTitle} Reviews'),
        backgroundColor: AppColors.stitchCanvas,
        elevation: 0,
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.stitchForestGreen,
        icon: const Icon(Icons.rate_review_outlined, color: Colors.white),
        label: const Text('Write Review', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
        onPressed: () {
          WriteReviewSheet.show(
            context,
            productId: widget.productId,
            productTitle: widget.productTitle,
          );
        },
      ),
      body: reviewsAsync.when(
        data: (reviews) {
          final sorted = List<Review>.from(reviews);
          if (_sort == 'highest') {
            sorted.sort((a, b) => b.rating.compareTo(a.rating));
          } else if (_sort == 'lowest') {
            sorted.sort((a, b) => a.rating.compareTo(b.rating));
          } else {
            sorted.sort((a, b) => b.createdAt.compareTo(a.createdAt));
          }

          return ListView(
            padding: const EdgeInsets.all(AppSpacing.md),
            children: [
              // Summary card
              summaryAsync.when(
                data: (summary) => ReviewSummaryCard(summary: summary),
                loading: () => const SizedBox(height: 100, child: Center(child: AppSpinner(size: 24))),
                error: (_, __) => const SizedBox.shrink(),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Sort dropdown header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${reviews.length} Verified Reviews',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  DropdownButton<String>(
                    value: _sort,
                    underline: const SizedBox.shrink(),
                    style: const TextStyle(fontSize: 13, color: AppColors.stitchForestGreen, fontWeight: FontWeight.w600),
                    items: const [
                      DropdownMenuItem(value: 'newest', child: Text('Most Recent')),
                      DropdownMenuItem(value: 'highest', child: Text('Highest Rating')),
                      DropdownMenuItem(value: 'lowest', child: Text('Lowest Rating')),
                    ],
                    onChanged: (val) {
                      if (val != null) setState(() => _sort = val);
                    },
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.sm),

              // Review Cards
              ...sorted.map((r) => Padding(
                    padding: const EdgeInsets.only(bottom: AppSpacing.md),
                    child: ReviewCard(review: r),
                  )),
              const SizedBox(height: 72), // Padding for FAB
            ],
          );
        },
        loading: () => const Center(child: AppSpinner(size: 36)),
        error: (error, _) => Center(
          child: AppErrorState(
            title: 'Failed to load reviews',
            message: error.toString(),
            onRetry: () => ref.invalidate(productReviewsProvider(widget.productId)),
          ),
        ),
      ),
    );
  }
}
