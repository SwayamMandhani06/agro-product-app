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
