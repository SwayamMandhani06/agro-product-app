import '../../../core/error/failure.dart';
import 'product.dart';

abstract interface class ProductRepository {
  Future<Result<List<Product>>> getFeaturedProducts();
  Future<Result<List<Product>>> getProductsByCategory(String category);
  Future<Result<List<ProductCategory>>> getCategories();
  Future<Result<Product>> getProductById(String id);
  Future<Result<List<Product>>> getProducts({
    String? category,
    String? query,
    ProductFilter? filter,
    ProductSort? sort,
  });
  Future<Result<List<Product>>> getSimilarProducts(String productId);
}
