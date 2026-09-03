import type { Product, ProductCategory, ProductSortKey } from '@/types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, getProductById as mockGetById, getSimilarProducts as mockGetSimilar } from '@/lib/mock-data';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface ProductRepository {
  getCategories(): Promise<ProductCategory[]>;
  getProducts(params?: { category?: string; query?: string; sort?: ProductSortKey }): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getSimilarProducts(id: string, category: string): Promise<Product[]>;
}

export class SupabaseProductRepository implements ProductRepository {
  async getCategories(): Promise<ProductCategory[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return MOCK_CATEGORIES;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return MOCK_CATEGORIES;
      }

      return data.map((row) => ({
        id: row.id,
        name: row.name,
        icon: row.icon,
        description: row.description ?? undefined,
        itemCount: row.item_count ?? 0,
      }));
    } catch {
      return MOCK_CATEGORIES;
    }
  }

  async getProducts(params?: { category?: string; query?: string; sort?: ProductSortKey }): Promise<Product[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return this.filterMockProducts(params);
    }

    try {
      let query = supabase.from('products').select('*');

      if (params?.category && params.category !== 'All') {
        // Look up category id or match name
        const cat = MOCK_CATEGORIES.find((c) => c.name.toLowerCase() === params.category!.toLowerCase());
        if (cat) {
          query = query.eq('category_id', cat.id);
        }
      }

      if (params?.query && params.query.trim()) {
        const q = `%${params.query.trim()}%`;
        query = query.or(`title.ilike.${q},description.ilike.${q},seller_name.ilike.${q}`);
      }

      switch (params?.sort) {
        case 'priceAsc':
          query = query.order('price', { ascending: true });
          break;
        case 'priceDesc':
          query = query.order('price', { ascending: false });
          break;
        case 'ratingDesc':
          query = query.order('rating', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false });
          break;
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return this.filterMockProducts(params);
      }

      return data.map(this.mapRowToProduct);
    } catch {
      return this.filterMockProducts(params);
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return mockGetById(id) ?? null;
    }

    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error || !data) {
        return mockGetById(id) ?? null;
      }
      return this.mapRowToProduct(data);
    } catch {
      return mockGetById(id) ?? null;
    }
  }

  async getSimilarProducts(id: string, category: string): Promise<Product[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return mockGetSimilar(id);
    }

    try {
      const cat = MOCK_CATEGORIES.find((c) => c.name.toLowerCase() === category.toLowerCase());
      const catId = cat?.id ?? 'cat_seeds';

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', catId)
        .neq('id', id)
        .limit(4);

      if (error || !data || data.length === 0) {
        return mockGetSimilar(id);
      }

      return data.map(this.mapRowToProduct);
    } catch {
      return mockGetSimilar(id);
    }
  }

  private filterMockProducts(params?: { category?: string; query?: string; sort?: ProductSortKey }): Product[] {
    let list = [...MOCK_PRODUCTS];

    if (params?.category && params.category !== 'All') {
      list = list.filter((p) => p.category?.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.sellerName && p.sellerName.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    switch (params?.sort) {
      case 'priceAsc':
        return list.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return list.sort((a, b) => b.price - a.price);
      case 'ratingDesc':
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'newest':
        return list;
      default:
        return list;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapRowToProduct(row: any): Product {
    // Map category_id back to display name
    const cat = MOCK_CATEGORIES.find((c) => c.id === row.category_id);
    const categoryName = cat?.name ?? 'Seeds';

    return {
      id: row.id,
      title: row.title,
      description: row.description ?? '',
      category: categoryName,
      sellerName: row.seller_name,
      sellerRating: row.seller_rating ? Number(row.seller_rating) : 4.8,
      price: Number(row.price),
      originalPrice: row.original_price ? Number(row.original_price) : undefined,
      unit: row.unit ?? 'pack',
      inStock: row.in_stock ?? true,
      isFavorite: false,
      stockCount: row.stock_count ?? 10,
      rating: row.rating ? Number(row.rating) : 4.7,
      reviewCount: row.review_count ?? 0,
      deliveryLocation: row.delivery_location ?? 'Pune, Maharashtra',
      highlights: Array.isArray(row.highlights) ? row.highlights : [],
      specifications: typeof row.specifications === 'object' && row.specifications !== null ? row.specifications : {},
      images: row.image_url ? [row.image_url] : undefined,
    };
  }
}

export const productRepository: ProductRepository = new SupabaseProductRepository();
