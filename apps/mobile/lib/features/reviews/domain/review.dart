/// Product review entity representing farmer feedback in AgriTrade.
class Review {
  const Review({
    required this.id,
    required this.productId,
    required this.userId,
    required this.userName,
    required this.rating,
    required this.title,
    required this.comment,
    required this.createdAt,
    this.verifiedPurchase = true,
  });

  final String id;
  final String productId;
  final String userId;
  final String userName;
  final double rating;
  final String title;
  final String comment;
  final DateTime createdAt;
  final bool verifiedPurchase;

  Review copyWith({
    String? id,
    String? productId,
    String? userId,
    String? userName,
    double? rating,
    String? title,
    String? comment,
    DateTime? createdAt,
    bool? verifiedPurchase,
  }) {
    return Review(
      id: id ?? this.id,
      productId: productId ?? this.productId,
      userId: userId ?? this.userId,
      userName: userName ?? this.userName,
      rating: rating ?? this.rating,
      title: title ?? this.title,
      comment: comment ?? this.comment,
      createdAt: createdAt ?? this.createdAt,
      verifiedPurchase: verifiedPurchase ?? this.verifiedPurchase,
    );
  }
}

/// Aggregated review statistics for a product.
class ReviewSummary {
  const ReviewSummary({
    required this.averageRating,
    required this.totalReviews,
    required this.breakdown,
  });

  final double averageRating;
  final int totalReviews;
  final Map<int, int> breakdown; // 5 -> count, 4 -> count, etc.
}
