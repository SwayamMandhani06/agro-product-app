import 'package:flutter/material.dart';
import 'package:fpdart/fpdart.dart';

import '../../../core/error/failure.dart';
import '../domain/product.dart';
import '../domain/product_repository.dart';

class MockProductRepository implements ProductRepository {
  const MockProductRepository();

  static const List<ProductCategory> _categories = [
    ProductCategory(
      id: 'cat_seeds',
      name: 'Seeds',
      icon: Icons.eco_rounded,
      itemCount: 148,
    ),
    ProductCategory(
      id: 'cat_fertilizers',
      name: 'Fertilizers',
      icon: Icons.science_rounded,
      itemCount: 92,
    ),
    ProductCategory(
      id: 'cat_protection',
      name: 'Crop Protection',
      icon: Icons.bug_report_rounded,
      itemCount: 76,
    ),
    ProductCategory(
      id: 'cat_tools',
      name: 'Farm Tools',
      icon: Icons.handyman_rounded,
      itemCount: 115,
    ),
    ProductCategory(
      id: 'cat_irrigation',
      name: 'Irrigation',
      icon: Icons.water_drop_rounded,
      itemCount: 54,
    ),
    ProductCategory(
      id: 'cat_animal',
      name: 'Animal Care',
      icon: Icons.pets_rounded,
      itemCount: 38,
    ),
  ];

  static const List<Product> _featuredProducts = [
    Product(
      id: 'prod_1',
      title: 'JS-335 Certified Soybean Seeds',
      price: 1850,
      originalPrice: 2200,
      unit: '30kg bag',
      sellerName: 'Mahyco Krishi',
      category: 'Seeds',
      rating: 4.8,
      reviewCount: 142,
      inStock: true,
      isFavorite: false,
    ),
    Product(
      id: 'prod_2',
      title: 'IFFCO DAP Fertilizer (Di-Ammonium Phosphate)',
      price: 1350,
      originalPrice: 1500,
      unit: '50kg bag',
      sellerName: 'IFFCO Agro Center',
      category: 'Fertilizers',
      rating: 4.7,
      reviewCount: 98,
      inStock: true,
      isFavorite: false,
    ),
    Product(
      id: 'prod_3',
      title: 'Neem Shield Bio-Pesticide Concentrate',
      price: 420,
      originalPrice: 500,
      unit: '1L bottle',
      sellerName: 'AgroPure Organics',
      category: 'Crop Protection',
      rating: 4.6,
      reviewCount: 67,
      inStock: true,
      isFavorite: true,
    ),
    Product(
      id: 'prod_4',
      title: 'Premium Drip Irrigation Starter Kit (1 Acre)',
      price: 4500,
      originalPrice: 5200,
      unit: '1 set',
      sellerName: 'Jain Irrigation Ltd',
      category: 'Irrigation',
      rating: 4.9,
      reviewCount: 215,
      inStock: true,
      isFavorite: false,
    ),
  ];

  @override
  Future<Result<List<Product>>> getFeaturedProducts() async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    return const Right(_featuredProducts);
  }

  @override
  Future<Result<List<Product>>> getProductsByCategory(String category) async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    final filtered = _featuredProducts
        .where((p) => p.category?.toLowerCase() == category.toLowerCase())
        .toList();
    return Right(filtered.isNotEmpty ? filtered : _featuredProducts);
  }

  @override
  Future<Result<List<ProductCategory>>> getCategories() async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    return const Right(_categories);
  }

  @override
  Future<Result<Product>> getProductById(String id) async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    final product = _featuredProducts.firstWhere(
      (p) => p.id == id,
      orElse: () => _featuredProducts.first,
    );
    return Right(product);
  }
}
