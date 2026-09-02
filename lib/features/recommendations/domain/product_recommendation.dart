class ProductRecommendation {
  const ProductRecommendation({
    required this.productId,
    required this.productName,
    required this.reason,
    required this.score,
    required this.category,
  });

  final String productId;
  final String productName;
  final String reason;
  final double score;
  final String category;
}
