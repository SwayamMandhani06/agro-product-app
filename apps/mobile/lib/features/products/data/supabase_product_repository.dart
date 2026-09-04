import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:fpdart/fpdart.dart';

import '../../../core/config/backend_config.dart';
import '../../../core/error/failure.dart';
import '../domain/product.dart';
import '../domain/product_repository.dart';
import 'mock_product_repository.dart';

/// Product repository backed by Supabase PostgREST.
///
/// Falls back to [MockProductRepository] transparently when
/// [BackendConfig.isConfigured] returns `false`.
class SupabaseProductRepository implements ProductRepository {
  SupabaseProductRepository({Dio? dio})
      : _dio = dio ?? Dio(),
        _mock = const MockProductRepository();

  final Dio _dio;
  final MockProductRepository _mock;

  // Category IDs map for PostgREST filtering
  static const _categoryMap = <String, String>{
    'seeds': 'cat_seeds',
    'fertilizers': 'cat_fertilizers',
    'crop protection': 'cat_protection',
    'farm tools': 'cat_tools',
    'irrigation': 'cat_irrigation',
    'animal care': 'cat_animal',
  };

  static const _categoryNameMap = <String, String>{
    'cat_seeds': 'Seeds',
    'cat_fertilizers': 'Fertilizers',
    'cat_protection': 'Crop Protection',
    'cat_tools': 'Farm Tools',
    'cat_irrigation': 'Irrigation',
    'cat_animal': 'Animal Care',
  };

  static const _categoryIconMap = <String, IconData>{
    'cat_seeds': Icons.eco_rounded,
    'cat_fertilizers': Icons.science_rounded,
    'cat_protection': Icons.bug_report_rounded,
    'cat_tools': Icons.handyman_rounded,
    'cat_irrigation': Icons.water_drop_rounded,
    'cat_animal': Icons.pets_rounded,
  };

  // ──────────────────────────────────────────────────────────────
  // ProductRepository API
  // ──────────────────────────────────────────────────────────────

  @override
  Future<Result<List<Product>>> getFeaturedProducts() async {
    if (!BackendConfig.isConfigured) return _mock.getFeaturedProducts();

    try {
      final response = await _dio.get(
        '${BackendConfig.restBaseUrl}/products',
        queryParameters: {
          'select': '*',
          'order': 'rating.desc.nullslast',
          'limit': '8',
        },
        options: Options(headers: BackendConfig.headers),
      );

      final rows = response.data as List;
      return Right(rows.map(_mapRow).toList());
    } catch (e) {
      debugPrint('[SupabaseProductRepository] getFeaturedProducts error: $e');
      return _mock.getFeaturedProducts();
    }
  }

  @override
  Future<Result<List<Product>>> getProducts({
    String? category,
    String? query,
    ProductFilter? filter,
    ProductSort? sort,
  }) async {
    if (!BackendConfig.isConfigured) {
      return _mock.getProducts(
        category: category,
        query: query,
        filter: filter,
        sort: sort,
      );
    }

    try {
      final params = <String, dynamic>{
        'select': '*',
        'limit': '50',
      };

      // Category filter via PostgREST eq
      if (category != null && category.isNotEmpty) {
        final catId = _categoryMap[category.toLowerCase()];
        if (catId != null) {
          params['category_id'] = 'eq.$catId';
        }
      }

      // Sort via PostgREST order
      switch (sort) {
        case ProductSort.priceAsc:
          params['order'] = 'price.asc';
          break;
        case ProductSort.priceDesc:
          params['order'] = 'price.desc';
          break;
        case ProductSort.ratingDesc:
          params['order'] = 'rating.desc.nullslast';
          break;
        case ProductSort.newest:
          params['order'] = 'created_at.desc';
          break;
        case ProductSort.featured:
        default:
          params['order'] = 'rating.desc.nullslast';
          break;
      }

      final response = await _dio.get(
        '${BackendConfig.restBaseUrl}/products',
        queryParameters: params,
        options: Options(headers: BackendConfig.headers),
      );

      var products = (response.data as List).map(_mapRow).toList();

      // Client-side text search (PostgREST full-text would need a
      // ts_vector column — keep this simple for now).
      if (query != null && query.trim().isNotEmpty) {
        final q = query.toLowerCase().trim();
        products = products
            .where((p) =>
                p.title.toLowerCase().contains(q) ||
                (p.sellerName?.toLowerCase().contains(q) ?? false) ||
                (p.category?.toLowerCase().contains(q) ?? false))
            .toList();
      }

      // Client-side filter application
      if (filter != null && filter.hasActiveFilters) {
        if (filter.priceRange != null) {
          products =
              products.where((p) => filter.priceRange!.matches(p.price)).toList();
        }
        if (filter.minRating != null) {
          products = products
              .where((p) => (p.rating ?? 0) >= filter.minRating!)
              .toList();
        }
        if (filter.inStockOnly) {
          products = products.where((p) => p.inStock).toList();
        }
      }

      return Right(products);
    } catch (e) {
      debugPrint('[SupabaseProductRepository] getProducts error: $e');
      return _mock.getProducts(
        category: category,
        query: query,
        filter: filter,
        sort: sort,
      );
    }
  }

  @override
  Future<Result<List<Product>>> getProductsByCategory(String category) async {
    return getProducts(category: category);
  }

  @override
  Future<Result<List<ProductCategory>>> getCategories() async {
    if (!BackendConfig.isConfigured) return _mock.getCategories();

    try {
      final response = await _dio.get(
        '${BackendConfig.restBaseUrl}/categories',
        queryParameters: {'select': '*', 'order': 'name.asc'},
        options: Options(headers: BackendConfig.headers),
      );

      final rows = response.data as List;
      final categories = rows.map((row) {
        final id = row['id'] as String;
        return ProductCategory(
          id: id,
          name: _categoryNameMap[id] ?? (row['name'] as String? ?? 'Unknown'),
          icon: _categoryIconMap[id] ?? Icons.category_rounded,
          itemCount: row['item_count'] as int? ?? 0,
        );
      }).toList();

      return Right(categories);
    } catch (e) {
      debugPrint('[SupabaseProductRepository] getCategories error: $e');
      return _mock.getCategories();
    }
  }

  @override
  Future<Result<Product>> getProductById(String id) async {
    if (!BackendConfig.isConfigured) return _mock.getProductById(id);

    try {
      final response = await _dio.get(
        '${BackendConfig.restBaseUrl}/products',
        queryParameters: {
          'select': '*',
          'id': 'eq.$id',
          'limit': '1',
        },
        options: Options(headers: BackendConfig.headers),
      );

      final rows = response.data as List;
      if (rows.isEmpty) {
        return _mock.getProductById(id);
      }

      return Right(_mapRow(rows.first));
    } catch (e) {
      debugPrint('[SupabaseProductRepository] getProductById error: $e');
      return _mock.getProductById(id);
    }
  }

  @override
  Future<Result<List<Product>>> getSimilarProducts(String productId) async {
    if (!BackendConfig.isConfigured) return _mock.getSimilarProducts(productId);

    try {
      // First get the product to find its category
      final productResult = await getProductById(productId);

      return productResult.fold(
        (failure) => _mock.getSimilarProducts(productId),
        (product) async {
          final catId =
              _categoryMap[product.category?.toLowerCase() ?? ''] ?? 'cat_seeds';

          final response = await _dio.get(
            '${BackendConfig.restBaseUrl}/products',
            queryParameters: {
              'select': '*',
              'category_id': 'eq.$catId',
              'id': 'neq.$productId',
              'limit': '4',
            },
            options: Options(headers: BackendConfig.headers),
          );

          final rows = response.data as List;
          if (rows.isEmpty) {
            return _mock.getSimilarProducts(productId);
          }
          return Right(rows.map(_mapRow).toList());
        },
      );
    } catch (e) {
      debugPrint('[SupabaseProductRepository] getSimilarProducts error: $e');
      return _mock.getSimilarProducts(productId);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────

  Product _mapRow(dynamic row) {
    final categoryId = row['category_id'] as String? ?? 'cat_seeds';
    final categoryName = _categoryNameMap[categoryId] ?? 'Seeds';

    // Parse highlights from JSONB array
    List<String>? highlights;
    if (row['highlights'] is List) {
      highlights =
          (row['highlights'] as List).map((e) => e.toString()).toList();
    }

    // Parse specifications from JSONB object
    Map<String, String>? specifications;
    if (row['specifications'] is Map) {
      specifications = (row['specifications'] as Map)
          .map((k, v) => MapEntry(k.toString(), v.toString()));
    }

    return Product(
      id: row['id'] as String,
      title: row['title'] as String? ?? 'Unknown Product',
      price: (row['price'] is num ? (row['price'] as num).toDouble() : 0),
      originalPrice: row['original_price'] is num
          ? (row['original_price'] as num).toDouble()
          : null,
      unit: row['unit'] as String? ?? 'pack',
      sellerName: row['seller_name'] as String?,
      category: categoryName,
      rating: row['rating'] is num ? (row['rating'] as num).toDouble() : null,
      reviewCount: row['review_count'] as int? ?? 0,
      inStock: row['in_stock'] as bool? ?? true,
      isFavorite: false,
      brand: row['brand'] as String?,
      stockCount: row['stock_count'] as int? ?? 10,
      sellerRating: row['seller_rating'] is num
          ? (row['seller_rating'] as num).toDouble()
          : null,
      deliveryLocation: row['delivery_location'] as String? ?? 'Pune, Maharashtra',
      description: row['description'] as String?,
      highlights: highlights,
      specifications: specifications,
    );
  }
}
