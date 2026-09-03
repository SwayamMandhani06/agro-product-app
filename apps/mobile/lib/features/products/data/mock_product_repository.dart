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

  static const List<Product> _products = [
    Product(
      id: 'prod_1',
      title: 'Premium Hybrid Soybean Seeds',
      price: 1250,
      originalPrice: 1450,
      unit: '5 kg pack',
      sellerName: 'AgriGrow Official',
      category: 'Seeds',
      rating: 4.7,
      reviewCount: 124,
      inStock: true,
      isFavorite: false,
      brand: 'AgriGrow',
      stockCount: 12,
      sellerRating: 4.9,
      deliveryLocation: 'Pune, Maharashtra',
      description:
          'High-yielding premium hybrid soybean seeds optimized for diverse soil conditions. Ensures rapid germination and robust root development for maximum crop output.',
      highlights: [
        'High germination rate (>90%)',
        'Suitable for Indian climate conditions',
        'High disease resistance (Yellow Mosaic Virus)',
        'Maturity window: 95-100 days',
      ],
      specifications: {
        'Crop': 'Soybean',
        'Brand': 'AgriGrow',
        'Pack Size': '5 kg',
        'Seed Type': 'Certified Hybrid',
        'Suitable Soil': 'Loamy & Black Soil',
      },
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
      brand: 'IFFCO',
      stockCount: 45,
      sellerRating: 4.8,
      deliveryLocation: 'Pune, Maharashtra',
      description:
          'High-grade phosphatic fertilizer essential for root establishment, vigorous early plant growth, and higher crop yields.',
      highlights: [
        '18% Nitrogen & 46% Phosphorus',
        '100% water soluble phosphate',
        'Boosts root development and tillering',
      ],
      specifications: {
        'Type': 'Inorganic Fertilizer',
        'Brand': 'IFFCO',
        'Pack Size': '50kg bag',
        'Form': 'Granular',
      },
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
      brand: 'AgroPure Organics',
      stockCount: 30,
      sellerRating: 4.7,
      deliveryLocation: 'Pune, Maharashtra',
      description:
          'Cold-pressed pure neem oil bio-pesticide with 10,000 ppm azadirachtin. Effective against whiteflies, aphids, and bollworms.',
      highlights: [
        '100% Organic & Eco-friendly',
        'Broad spectrum pest repellant',
        'Safe for beneficial insects',
      ],
      specifications: {
        'Type': 'Bio-Pesticide',
        'Brand': 'AgroPure Organics',
        'Pack Size': '1L bottle',
        'Application': 'Foliar Spray',
      },
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
      brand: 'Jain Irrigation',
      stockCount: 8,
      sellerRating: 4.9,
      deliveryLocation: 'Pune, Maharashtra',
      description:
          'Complete micro-irrigation system designed for 1 acre agricultural farmland. Delivers uniform water and fertigation directly to roots.',
      highlights: [
        'Saves up to 60% irrigation water',
        'Clog-resistant emitters',
        'UV-stabilized virgin grade polyethylene',
      ],
      specifications: {
        'Coverage': '1 Acre',
        'Brand': 'Jain Irrigation Ltd',
        'Emitter Spacing': '40 cm',
        'Operating Pressure': '1.0 - 2.5 bar',
      },
    ),
    Product(
      id: 'prod_5',
      title: 'Heavy-Duty Khurpi & Sickle Tool Set',
      price: 380,
      originalPrice: 450,
      unit: '1 set',
      sellerName: 'Kisan Forge Official',
      category: 'Farm Tools',
      rating: 4.5,
      reviewCount: 84,
      inStock: true,
      isFavorite: false,
      brand: 'Kisan Forge',
      stockCount: 50,
      sellerRating: 4.6,
      deliveryLocation: 'Pune, Maharashtra',
      description:
          'Hand-forged carbon steel weeding trowel (khurpi) and curved serrated harvesting sickle with ergonomic treated wooden grips.',
      highlights: [
        'Tempered high-carbon steel',
        'Rust-resistant protective coating',
        'Ergonomic moisture-resistant wooden handle',
      ],
      specifications: {
        'Material': 'High Carbon Steel',
        'Brand': 'Kisan Forge',
        'Weight': '650g total',
      },
    ),
    Product(
      id: 'prod_6',
      title: 'Kisan Premium Sharbati Wheat Seeds',
      price: 350,
      originalPrice: 420,
      unit: '1kg pack',
      sellerName: 'Kisan Seeds',
      category: 'Seeds',
      rating: 4.8,
      reviewCount: 156,
      inStock: true,
      isFavorite: false,
      brand: 'Kisan Seeds',
      stockCount: 85,
      sellerRating: 4.8,
      deliveryLocation: 'Pune, Maharashtra',
      description:
          'Authentic MP Sharbati golden wheat grains renowned for sweetness, high protein content, and superior chapati puffing quality.',
      highlights: [
        'Rich in golden luster and grain density',
        'Maturity duration: 115-120 days',
        'Drought tolerant variety',
      ],
      specifications: {
        'Crop': 'Wheat',
        'Brand': 'Kisan Seeds',
        'Pack Size': '1kg pack',
        'Protein': '14.2%',
      },
    ),
    Product(
      id: 'prod_7',
      title: 'EcoGrow Organic Liquid Fertilizer',
      price: 520,
      originalPrice: 600,
      unit: '1L bottle',
      sellerName: 'EcoGrow Solutions',
      category: 'Fertilizers',
      rating: 4.6,
      reviewCount: 92,
      inStock: true,
      isFavorite: false,
      brand: 'EcoGrow',
      stockCount: 22,
      sellerRating: 4.6,
      deliveryLocation: 'Pune, Maharashtra',
      description:
          'Fermented seaweed extract enriched with micronutrients, amino acids, and fulvic acid for vigorous vegetative growth.',
      highlights: [
        'Rapid nutrient absorption',
        'Enhances chlorophyll synthesis',
        'Improves soil biological activity',
      ],
      specifications: {
        'Form': 'Liquid Concentrate',
        'Brand': 'EcoGrow',
        'Pack Size': '1L bottle',
        'Dosage': '2.5 ml / Litre',
      },
    ),
    Product(
      id: 'prod_8',
      title: 'AgriGrow Hybrid Maize Seeds Gold',
      price: 890,
      originalPrice: 1050,
      unit: '5kg pack',
      sellerName: 'AgriGrow Official',
      category: 'Seeds',
      rating: 4.7,
      reviewCount: 110,
      inStock: true,
      isFavorite: false,
      brand: 'AgriGrow',
      stockCount: 16,
      sellerRating: 4.7,
      deliveryLocation: 'Pune, Maharashtra',
      description:
          'High-yield yellow hybrid corn seeds with strong stalk strength, stay-green foliage, and high shelling percentage.',
      highlights: [
        'Uniform cob placement and filling',
        'Tolerant to drought and leaf blight',
        'High test weight grain',
      ],
      specifications: {
        'Crop': 'Maize / Corn',
        'Brand': 'AgriGrow',
        'Pack Size': '5kg pack',
        'Yield Potential': '35-40 q/acre',
      },
    ),
    Product(
      id: 'prod_9',
      title: 'Cattle Calcium Tonic & Mineral Mix',
      price: 650,
      originalPrice: 750,
      unit: '5L can',
      sellerName: 'VetCare India',
      category: 'Animal Care',
      rating: 4.8,
      reviewCount: 73,
      inStock: true,
      isFavorite: false,
      brand: 'VetCare India',
      stockCount: 19,
      sellerRating: 4.8,
      deliveryLocation: 'Pune, Maharashtra',
      description:
          'Chelated calcium, phosphorus, and vitamin D3 nutritional supplement to enhance milk yield and skeletal strength in dairy cattle.',
      highlights: [
        'High bioavailability chelated minerals',
        'Prevents milk fever in fresh cows',
        'Improves overall lactation peak',
      ],
      specifications: {
        'Target': 'Dairy Cows & Buffaloes',
        'Brand': 'VetCare India',
        'Volume': '5L can',
        'Calcium Content': '43,000 mg/L',
      },
    ),
  ];

  @override
  Future<Result<List<Product>>> getFeaturedProducts() async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    return const Right(_products);
  }

  @override
  Future<Result<List<Product>>> getProductsByCategory(String category) async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    final filtered = _products
        .where((p) => p.category?.toLowerCase() == category.toLowerCase())
        .toList();
    return Right(filtered.isNotEmpty ? filtered : _products);
  }

  @override
  Future<Result<List<ProductCategory>>> getCategories() async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    return const Right(_categories);
  }

  @override
  Future<Result<Product>> getProductById(String id) async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    final product = _products.firstWhere(
      (p) => p.id == id,
      orElse: () => _products.first,
    );
    return Right(product);
  }

  @override
  Future<Result<List<Product>>> getProducts({
    String? category,
    String? query,
    ProductFilter? filter,
    ProductSort? sort,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    var results = List<Product>.from(_products);

    // 1. Direct category parameter or filter category
    final targetCategory = category ?? filter?.category;
    if (targetCategory != null &&
        targetCategory.isNotEmpty &&
        targetCategory.toLowerCase() != 'all') {
      results = results
          .where((p) => p.category?.toLowerCase() == targetCategory.toLowerCase())
          .toList();
    }

    // 2. Search query filter
    if (query != null && query.trim().isNotEmpty) {
      final q = query.trim().toLowerCase();
      results = results.where((p) {
        final titleMatch = p.title.toLowerCase().contains(q);
        final descMatch = p.description?.toLowerCase().contains(q) ?? false;
        final brandMatch = p.brand?.toLowerCase().contains(q) ?? false;
        final categoryMatch = p.category?.toLowerCase().contains(q) ?? false;
        final sellerMatch = p.sellerName?.toLowerCase().contains(q) ?? false;
        return titleMatch || descMatch || brandMatch || categoryMatch || sellerMatch;
      }).toList();
    }

    // 3. Price range filter
    if (filter?.priceRange != null) {
      results = results.where((p) => filter!.priceRange!.matches(p.price)).toList();
    }

    // 4. Rating filter
    if (filter?.minRating != null) {
      results = results.where((p) => (p.rating ?? 0.0) >= filter!.minRating!).toList();
    }

    // 5. In-stock only filter
    if (filter?.inStockOnly == true) {
      results = results.where((p) => p.inStock).toList();
    }

    // 6. Sorting
    switch (sort ?? ProductSort.featured) {
      case ProductSort.priceAsc:
        results.sort((a, b) => a.price.compareTo(b.price));
      case ProductSort.priceDesc:
        results.sort((a, b) => b.price.compareTo(a.price));
      case ProductSort.ratingDesc:
        results.sort((a, b) => (b.rating ?? 0.0).compareTo(a.rating ?? 0.0));
      case ProductSort.newest:
        results.sort((a, b) => b.id.compareTo(a.id));
      case ProductSort.featured:
        // Keep default order
        break;
    }

    return Right(results);
  }

  @override
  Future<Result<List<Product>>> getSimilarProducts(String productId) async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    final current = _products.firstWhere(
      (p) => p.id == productId,
      orElse: () => _products.first,
    );

    final sameCategory = _products
        .where((p) => p.id != current.id && p.category == current.category)
        .toList();

    if (sameCategory.isNotEmpty) {
      return Right(sameCategory);
    }

    // Fallback to other products
    return Right(
      _products.where((p) => p.id != current.id).take(3).toList(),
    );
  }
}
