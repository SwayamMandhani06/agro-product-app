import '../../../core/error/failure.dart';
import 'product.dart';

abstract interface class ProductRepository {
  Future<Result<List<Product>>> getFeaturedProducts();
  Future<Result<List<Product>>> getProductsByCategory(String category);
  Future<Result<List<ProductCategory>>> getCategories();
  Future<Result<Product>> getProductById(String id);
}
