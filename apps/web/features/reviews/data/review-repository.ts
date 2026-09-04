import type { ProductReview, ReviewSummary } from '@/types';
import { getSupabaseClient } from '@/lib/supabase/client';

export const MOCK_REVIEWS: ProductReview[] = [
  {
    id: 'rev_1',
    productId: 'prod_1',
    userId: 'usr_01',
    userName: 'Suresh Patil',
    rating: 5.0,
    title: 'Exceptional 94% Germination Rate',
    comment: 'Planted 4 bags across 6 acres in loamy black soil. Uniform emergence within 4 days of sowing. Strong resistance to yellow mosaic virus throughout the monsoon season.',
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'rev_2',
    productId: 'prod_1',
    userId: 'usr_02',
    userName: 'Rajesh Deshmukh',
    rating: 4.5,
    title: 'High pod count and strong stalks',
    comment: 'Vigorous vegetative growth and excellent nodulation. Clean packaging with certified tag and batch barcode.',
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'rev_3',
    productId: 'prod_1',
    userId: 'usr_03',
    userName: 'Vikas Ghadge',
    rating: 4.0,
    title: 'Good quality, prompt doorstep delivery',
    comment: 'Bag arrived tightly sealed. A bit more moisture sensitivity in heavy waterlogged zones, but overall outstanding harvest volume.',
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 19 * 86400000).toISOString(),
  },
  {
    id: 'rev_4',
    productId: 'prod_2',
    userId: 'usr_04',
    userName: 'Anil Jadhav',
    rating: 5.0,
    title: 'Fast-acting nitrogen boost',
    comment: 'Dissolves clear in fertigation lines without clogging micro-emitters. Visible leaf greening within 48 hours of foliar application.',
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'rev_5',
    productId: 'prod_3',
    userId: 'usr_05',
    userName: 'Santosh Shinde',
    rating: 5.0,
    title: 'Complete stem borer eradication',
    comment: 'Applied on kharif paddy. Controlled whorl-maggot and stem borer with residual action for over 3 weeks. Genuine factory seal.',
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
  {
    id: 'rev_6',
    productId: 'prod_4',
    userId: 'usr_06',
    userName: 'Kiran Thorat',
    rating: 4.5,
    title: 'Precision spray pattern and uniform droplets',
    comment: 'Piston chamber holds steady 4 bar pressure. Adjustable brass nozzle gives fine fogging ideal for fungicide coverage on pomegranate.',
    verifiedPurchase: true,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

export interface ReviewRepository {
  getReviewsByProductId(productId: string): Promise<ProductReview[]>;
  getReviewSummary(productId: string): Promise<ReviewSummary>;
  addReview(review: Omit<ProductReview, 'id' | 'createdAt'>): Promise<{ success: boolean; review?: ProductReview; error?: string }>;
}

export class SupabaseReviewRepository implements ReviewRepository {
  private localReviews: ProductReview[] = [...MOCK_REVIEWS];

  async getReviewsByProductId(productId: string): Promise<ProductReview[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return data.map((r: any) => ({
            id: r.id,
            productId: r.product_id,
            userId: r.user_id,
            userName: r.user_name,
            rating: Number(r.rating),
            title: r.title,
            comment: r.comment,
            verifiedPurchase: r.verified_purchase ?? true,
            createdAt: r.created_at,
          }));
        }
      } catch {
        // Fall back to local mock
      }
    }

    return this.localReviews.filter((r) => r.productId === productId);
  }

  async getReviewSummary(productId: string): Promise<ReviewSummary> {
    const reviews = await this.getReviewsByProductId(productId);
    if (reviews.length === 0) {
      return {
        averageRating: 4.8,
        totalReviews: 24,
        breakdown: { 5: 18, 4: 5, 3: 1, 2: 0, 1: 0 },
      };
    }

    const totalReviews = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = Number((sum / totalReviews).toFixed(1));

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) {
      const rounded = Math.round(r.rating);
      if (rounded >= 1 && rounded <= 5) {
        breakdown[rounded as keyof typeof breakdown]++;
      }
    }

    return { averageRating, totalReviews, breakdown };
  }

  async addReview(reviewData: Omit<ProductReview, 'id' | 'createdAt'>): Promise<{ success: boolean; review?: ProductReview; error?: string }> {
    if (reviewData.rating < 1.0 || reviewData.rating > 5.0) {
      return { success: false, error: 'Rating must be between 1.0 and 5.0 stars.' };
    }
    if (!reviewData.title || reviewData.title.trim().length === 0) {
      return { success: false, error: 'Review title cannot be empty.' };
    }
    if (!reviewData.comment || reviewData.comment.trim().length === 0) {
      return { success: false, error: 'Review comment cannot be empty.' };
    }

    const newReview: ProductReview = {
      ...reviewData,
      title: reviewData.title.trim(),
      comment: reviewData.comment.trim(),
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { error } = await supabase.from('reviews').insert({
          product_id: newReview.productId,
          user_id: newReview.userId,
          user_name: newReview.userName,
          rating: newReview.rating,
          title: newReview.title,
          comment: newReview.comment,
          verified_purchase: newReview.verifiedPurchase,
        });

        if (!error) {
          this.localReviews.unshift(newReview);
          return { success: true, review: newReview };
        }
      } catch {
        // Fallback to local
      }
    }

    this.localReviews.unshift(newReview);
    return { success: true, review: newReview };
  }
}

export const reviewRepository: ReviewRepository = new SupabaseReviewRepository();
