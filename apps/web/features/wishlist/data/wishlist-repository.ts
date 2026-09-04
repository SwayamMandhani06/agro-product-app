import { getSupabaseClient } from '@/lib/supabase/client';

export interface WishlistRepository {
  getWishlistProductIds(userId?: string): Promise<string[]>;
  addWishlistItem(productId: string, userId?: string): Promise<boolean>;
  removeWishlistItem(productId: string, userId?: string): Promise<boolean>;
}

export class SupabaseWishlistRepository implements WishlistRepository {
  async getWishlistProductIds(userId = 'usr_default'): Promise<string[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', userId);

      if (error || !data) {
        return [];
      }

      return data.map((row: { product_id: string }) => row.product_id);
    } catch {
      return [];
    }
  }

  async addWishlistItem(productId: string, userId = 'usr_default'): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return true; // Graceful mock fallback handled by store
    }

    try {
      const { error } = await supabase.from('wishlists').upsert(
        { user_id: userId, product_id: productId },
        { onConflict: 'user_id,product_id' }
      );

      return !error;
    } catch {
      return false;
    }
  }

  async removeWishlistItem(productId: string, userId = 'usr_default'): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return true;
    }

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      return !error;
    } catch {
      return false;
    }
  }
}

export const wishlistRepository: WishlistRepository = new SupabaseWishlistRepository();
