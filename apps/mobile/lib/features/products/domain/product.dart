import 'package:flutter/material.dart';

/// Immutable domain model representing an agricultural product.
class Product {
  const Product({
    required this.id,
    required this.title,
    required this.price,
    this.originalPrice,
    this.unit = 'kg',
    this.sellerName,
    this.category,
    this.imageUrl,
    this.rating,
    this.reviewCount,
    this.inStock = true,
    this.isFavorite = false,
    this.description,
    this.images,
    this.highlights,
    this.specifications,
    this.sellerRating,
    this.stockCount,
    this.deliveryLocation,
    this.brand,
  });

  final String id;
  final String title;
  final double price;
  final double? originalPrice;
  final String unit;
  final String? sellerName;
  final String? category;
  final String? imageUrl;
  final double? rating;
  final int? reviewCount;
  final bool inStock;
  final bool isFavorite;
  final String? description;
  final List<String>? images;
  final List<String>? highlights;
  final Map<String, String>? specifications;
  final double? sellerRating;
  final int? stockCount;
  final String? deliveryLocation;
  final String? brand;

  /// Effective list of gallery image URLs, falling back to [imageUrl] if present.
  List<String> get galleryImages {
    if (images != null && images!.isNotEmpty) {
      return images!;
    }
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      return [imageUrl!];
    }
    return const [];
  }

  Product copyWith({
    String? id,
    String? title,
    double? price,
    double? originalPrice,
    String? unit,
    String? sellerName,
    String? category,
    String? imageUrl,
    double? rating,
    int? reviewCount,
    bool? inStock,
    bool? isFavorite,
    String? description,
    List<String>? images,
    List<String>? highlights,
    Map<String, String>? specifications,
    double? sellerRating,
    int? stockCount,
    String? deliveryLocation,
    String? brand,
  }) {
    return Product(
      id: id ?? this.id,
      title: title ?? this.title,
      price: price ?? this.price,
      originalPrice: originalPrice ?? this.originalPrice,
      unit: unit ?? this.unit,
      sellerName: sellerName ?? this.sellerName,
      category: category ?? this.category,
      imageUrl: imageUrl ?? this.imageUrl,
      rating: rating ?? this.rating,
      reviewCount: reviewCount ?? this.reviewCount,
      inStock: inStock ?? this.inStock,
      isFavorite: isFavorite ?? this.isFavorite,
      description: description ?? this.description,
      images: images ?? this.images,
      highlights: highlights ?? this.highlights,
      specifications: specifications ?? this.specifications,
      sellerRating: sellerRating ?? this.sellerRating,
      stockCount: stockCount ?? this.stockCount,
      deliveryLocation: deliveryLocation ?? this.deliveryLocation,
      brand: brand ?? this.brand,
    );
  }
}

/// Category metadata model for agricultural supplies discovery.
class ProductCategory {
  const ProductCategory({
    required this.id,
    required this.name,
    required this.icon,
    this.itemCount,
  });

  final String id;
  final String name;
  final IconData icon;
  final int? itemCount;
}

/// Price range filter presets matching Google Stitch specs.
enum PriceRangeFilter {
  under500('Under ₹500', max: 500),
  between500And1000('₹500 – ₹1,000', min: 500, max: 1000),
  between1000And3000('₹1,000 – ₹3,000', min: 1000, max: 3000),
  above3000('₹3,000 & Above', min: 3000);

  const PriceRangeFilter(this.label, {this.min, this.max});

  final String label;
  final double? min;
  final double? max;

  bool matches(double price) {
    if (min != null && price < min!) return false;
    if (max != null && price > max!) return false;
    return true;
  }
}

/// Product sorting options matching Google Stitch specs.
enum ProductSort {
  featured('Featured'),
  priceAsc('Price: Low to High'),
  priceDesc('Price: High to Low'),
  ratingDesc('Highest Rated'),
  newest('Newest Arrivals');

  const ProductSort(this.label);

  final String label;
}

/// Immutable filter criteria for product catalogue search and discovery.
class ProductFilter {
  const ProductFilter({
    this.category,
    this.priceRange,
    this.minRating,
    this.inStockOnly = false,
  });

  final String? category;
  final PriceRangeFilter? priceRange;
  final double? minRating;
  final bool inStockOnly;

  bool get hasActiveFilters =>
      category != null ||
      priceRange != null ||
      minRating != null ||
      inStockOnly;

  int get activeFilterCount {
    var count = 0;
    if (category != null) count++;
    if (priceRange != null) count++;
    if (minRating != null) count++;
    if (inStockOnly) count++;
    return count;
  }

  ProductFilter copyWith({
    String? category,
    bool clearCategory = false,
    PriceRangeFilter? priceRange,
    bool clearPriceRange = false,
    double? minRating,
    bool clearMinRating = false,
    bool? inStockOnly,
  }) {
    return ProductFilter(
      category: clearCategory ? null : (category ?? this.category),
      priceRange: clearPriceRange ? null : (priceRange ?? this.priceRange),
      minRating: clearMinRating ? null : (minRating ?? this.minRating),
      inStockOnly: inStockOnly ?? this.inStockOnly,
    );
  }

  static const empty = ProductFilter();
}
