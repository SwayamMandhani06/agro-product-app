import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../../core/widgets/app_button.dart';
import '../providers/reviews_provider.dart';

/// Modal bottom sheet for submitting a product review.
class WriteReviewSheet extends ConsumerStatefulWidget {
  const WriteReviewSheet({
    super.key,
    required this.productId,
    required this.productTitle,
  });

  final String productId;
  final String productTitle;

  static Future<bool?> show(
    BuildContext context, {
    required String productId,
    required String productTitle,
  }) {
    return showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => WriteReviewSheet(
        productId: productId,
        productTitle: productTitle,
      ),
    );
  }

  @override
  ConsumerState<WriteReviewSheet> createState() => _WriteReviewSheetState();
}

class _WriteReviewSheetState extends ConsumerState<WriteReviewSheet> {
  double _rating = 5.0;
  final _titleController = TextEditingController();
  final _commentController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _titleController.dispose();
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final title = _titleController.text.trim();
    final comment = _commentController.text.trim();
    if (title.isEmpty || comment.isEmpty) return;

    setState(() => _isSubmitting = true);

    final repo = ref.read(reviewRepositoryProvider);
    final result = await repo.submitReview(
      productId: widget.productId,
      userId: 'usr_me',
      userName: 'Verified Farmer (You)',
      rating: _rating,
      title: title,
      comment: comment,
    );

    if (mounted) {
      setState(() => _isSubmitting = false);
      result.fold(
        (failure) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to submit review: ${failure.message}'),
              backgroundColor: AppColors.error,
            ),
          );
        },
        (_) {
          ref.invalidate(productReviewsProvider(widget.productId));
          ref.invalidate(productReviewSummaryProvider(widget.productId));
          Navigator.of(context).pop(true);
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        left: AppSpacing.lg,
        right: AppSpacing.lg,
        top: AppSpacing.lg,
        bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.xl,
      ),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Sheet Handle
            Center(
              child: Container(
                width: 36,
                height: 4,
                margin: const EdgeInsets.only(bottom: AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.neutral300,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
              ),
            ),

            Text(
              'Review ${widget.productTitle}',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 14),

            // Star Rating Picker
            const Text(
              'Your Rating',
              style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 6),
            Row(
              children: List.generate(5, (index) {
                final starValue = index + 1.0;
                return IconButton(
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                  iconSize: 32,
                  icon: Icon(
                    starValue <= _rating
                        ? Icons.star_rounded
                        : Icons.star_border_rounded,
                    color: AppColors.stitchAmber,
                  ),
                  onPressed: () => setState(() => _rating = starValue),
                );
              }),
            ),
            const SizedBox(height: 14),

            // Title Field
            const Text(
              'Review Title',
              style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                hintText: 'e.g. Excellent germination and crop vigor',
                filled: true,
                fillColor: AppColors.stitchCanvas,
                border: OutlineInputBorder(
                  borderRadius: AppRadius.input,
                  borderSide: BorderSide(color: AppColors.neutral200),
                ),
                contentPadding: EdgeInsets.symmetric(
                  horizontal: AppSpacing.md,
                  vertical: AppSpacing.sm,
                ),
              ),
            ),
            const SizedBox(height: 14),

            // Comment Field
            const Text(
              'Field Feedback',
              style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _commentController,
              maxLines: 4,
              decoration: const InputDecoration(
                hintText:
                    'Share details on emergence, soil type, dosage applied, and results...',
                filled: true,
                fillColor: AppColors.stitchCanvas,
                border: OutlineInputBorder(
                  borderRadius: AppRadius.input,
                  borderSide: BorderSide(color: AppColors.neutral200),
                ),
                contentPadding: EdgeInsets.all(AppSpacing.md),
              ),
            ),
            const SizedBox(height: 20),

            // Submit Button
            AppButton(
              label: 'Submit Review',
              isLoading: _isSubmitting,
              onPressed: _submit,
            ),
          ],
        ),
      ),
    );
  }
}
