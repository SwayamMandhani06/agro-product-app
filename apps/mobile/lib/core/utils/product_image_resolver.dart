/// Deterministic curated agricultural product image resolver.
///
/// Provides high-resolution agricultural photography matching the Next.js web application.
/// Used during mock development to replace generic placeholders with real domain imagery.
abstract final class ProductImageResolver {
  ProductImageResolver._();

  static const Map<String, String> _curatedProductImages = {
    'prod_1': 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80', // Hybrid Soybean Seeds
    'prod_2': 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80', // IFFCO DAP Fertilizer
    'prod_3': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80', // Neem Bio-Pesticide
    'prod_4': 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80', // Drip Irrigation Kit
    'prod_5': 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80', // Khurpi & Sickle Tool Set
    'prod_6': 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80', // Cattle Mineral Mixture
  };

  static const Map<String, String> _categoryFallbackImages = {
    'seeds': 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
    'fertilizers': 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
    'crop protection': 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80',
    'irrigation': 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80',
    'farm tools': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    'animal care': 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80',
  };

  static const String _defaultAgriImage =
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80';

  static String resolve([String? productId, String? category]) {
    if (productId != null && _curatedProductImages.containsKey(productId)) {
      return _curatedProductImages[productId]!;
    }
    if (category != null) {
      final key = category.toLowerCase().trim();
      if (_categoryFallbackImages.containsKey(key)) {
        return _categoryFallbackImages[key]!;
      }
    }
    return _defaultAgriImage;
  }

  static String resolveThumbnail([String? productId, String? category]) {
    final fullUrl = resolve(productId, category);
    return fullUrl.replaceAll('w=600', 'w=200');
  }
}
