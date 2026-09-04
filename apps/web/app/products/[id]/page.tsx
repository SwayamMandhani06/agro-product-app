'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { getProductById, getSimilarProducts } from '@/lib/mock-data';
import { ProductImageResolver } from '@/lib/product-image-resolver';
import { useCartStore } from '@/features/cart/store';
import { useWishlistStore } from '@/features/wishlist/wishlist-store';
import { useRecentlyViewedStore } from '@/features/products/recently-viewed-store';
import { reviewRepository } from '@/features/reviews/data/review-repository';
import type { ProductReview, ReviewSummary } from '@/types';
import ProductCard from '@/components/common/ProductCard';
import {
  Package,
  Truck,
  ShoppingCart,
  CheckCircle,
  Star,
  Heart,
  X,
  Plus,
} from 'lucide-react';

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const product = getProductById(id);
  const similar = getSimilarProducts(id);

  const addItem = useCartStore((s) => s.addItem);
  const isSaved = useWishlistStore((s) => (product ? s.isSaved(product.id) : false));
  const toggleSaved = useWishlistStore((s) => s.toggleSaved);
  const recordView = useRecentlyViewedStore((s) => s.recordView);
  const getRecentExcluding = useRecentlyViewedStore((s) => s.getRecentExcluding);

  const [tab, setTab] = useState<'overview' | 'specs' | 'reviews'>('overview');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [reviewSort, setReviewSort] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  // Record viewing and load reviews
  useEffect(() => {
    if (product) {
      recordView(product);
      reviewRepository.getReviewsByProductId(product.id).then(setReviews);
      reviewRepository.getReviewSummary(product.id).then(setSummary);
    }
  }, [product, recordView]);

  if (!product) {
    return (
      <AppShell>
        <div className="empty-state" style={{ paddingTop: 64, textAlign: 'center' }}>
          <div className="empty-icon" style={{ margin: '0 auto 12px' }}><Package size={32} strokeWidth={1.5} /></div>
          <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>Product not found</h2>
          <Link href="/products" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>Browse Catalog</Link>
        </div>
      </AppShell>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savings = product.originalPrice
    ? (product.originalPrice - product.price) * quantity
    : 0;

  const imgSrc = ProductImageResolver.resolve(product.category, product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/cart');
  };

  const handleToggleWishlist = () => {
    toggleSaved(product.id);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) return;

    await reviewRepository.addReview({
      productId: product.id,
      userId: 'usr_current',
      userName: 'Verified Farmer (You)',
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      verifiedPurchase: true,
    });

    const refreshed = await reviewRepository.getReviewsByProductId(product.id);
    const refreshedSummary = await reviewRepository.getReviewSummary(product.id);
    setReviews(refreshed);
    setSummary(refreshedSummary);
    setIsWritingReview(false);
    setNewTitle('');
    setNewComment('');
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === 'highest') return b.rating - a.rating;
    if (reviewSort === 'lowest') return a.rating - b.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const recentProducts = getRecentExcluding(product.id, 4);

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 20, paddingBottom: 48 }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: 16, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
          <Link href="/home" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Dashboard</Link>
          {' › '}
          <Link href="/products" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Products</Link>
          {' › '}
          <span style={{ color: 'var(--color-text-primary)' }}>{product.title}</span>
        </nav>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: 28,
          }}
          className="product-detail-grid"
        >
          {/* Left: Product Media, Information & Reviews */}
          <div>
            {/* Image Container */}
            <div
              style={{
                height: 340,
                borderRadius: 'var(--radius-lg)',
                marginBottom: 20,
                position: 'relative',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                background: 'var(--color-surface-variant)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {discount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--color-amber)',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {discount}% OFF
                </span>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                title={isSaved ? 'Remove from Saved' : 'Save for later'}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.94)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                  color: isSaved ? '#dc2626' : 'var(--color-text-secondary)',
                  transition: 'transform var(--motion-fast) var(--ease-standard)',
                }}
              >
                <Heart size={18} fill={isSaved ? '#dc2626' : 'none'} />
              </button>
            </div>

            {/* Title & Seller info */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--color-forest-50, #EAF6EF)',
                    color: 'var(--color-forest)',
                  }}
                >
                  {product.category}
                </span>
                <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                  Brand: {product.brand ?? 'AgriTrade Certified'}
                </span>
              </div>

              <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 10px', lineHeight: 1.3 }}>
                {product.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={16} fill="var(--color-amber)" stroke="none" />
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{product.rating ?? 4.8}</span>
                  <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                    ({summary?.totalReviews ?? product.reviewCount ?? 12} reviews)
                  </span>
                </div>
                <span style={{ color: 'var(--color-border)' }}>|</span>
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  Sold by <strong>{product.sellerName ?? 'AgriGrow Official'}</strong>
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface-variant)',
                border: '1px solid var(--color-border)',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-forest)', letterSpacing: '-0.5px' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: 16, color: 'var(--color-text-tertiary)', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>/ {product.unit}</span>
              <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: 'var(--color-success)' }}>
                Direct Manufacturer Price
              </span>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--color-border)', marginBottom: 20 }}>
              {(['overview', 'specs', 'reviews'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: '10px 18px',
                    fontSize: 14,
                    fontWeight: tab === t ? 600 : 500,
                    color: tab === t ? 'var(--color-forest)' : 'var(--color-text-secondary)',
                    background: 'none',
                    border: 'none',
                    borderBottom: tab === t ? '2px solid var(--color-forest)' : '2px solid transparent',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    marginBottom: -1,
                  }}
                >
                  {t === 'reviews' ? `Reviews (${summary?.totalReviews ?? reviews.length})` : t}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {tab === 'overview' && (
              <div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: '0 0 20px' }}>
                  {product.description}
                </p>
                {product.highlights && (
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 10px' }}>
                      Key Product Highlights
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {product.highlights.map((h, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                          <CheckCircle size={16} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: 2 }} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Specifications */}
            {tab === 'specs' && product.specifications && (
              <div style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val], idx) => (
                      <tr key={key} style={{ background: idx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-variant)' }}>
                        <td style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', width: '40%' }}>
                          {key}
                        </td>
                        <td style={{ padding: '10px 16px', color: 'var(--color-text-primary)' }}>
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Reviews */}
            {tab === 'reviews' && (
              <div>
                {/* Summary Box */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: 20,
                    padding: 20,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface-variant)',
                    border: '1px solid var(--color-border)',
                    marginBottom: 24,
                  }}
                >
                  <div style={{ textAlign: 'center', borderRight: '1px solid var(--color-border)', paddingRight: 20 }}>
                    <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--color-forest)', lineHeight: 1 }}>
                      {summary?.averageRating ?? 4.8}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 3, margin: '8px 0 4px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={16} fill="var(--color-amber)" stroke="none" />
                      ))}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                      Based on {summary?.totalReviews ?? reviews.length} verified reviews
                    </div>
                  </div>

                  {/* Distribution breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = summary?.breakdown[stars as keyof typeof summary.breakdown] ?? 0;
                      const total = summary?.totalReviews || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                          <span style={{ width: 42, color: 'var(--color-text-secondary)' }}>{stars} Star</span>
                          <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--color-border)', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-amber)', borderRadius: 3 }} />
                          </div>
                          <span style={{ width: 28, textAlign: 'right', color: 'var(--color-text-tertiary)' }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review Header & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Sort by:</span>
                    <select
                      value={reviewSort}
                      onChange={(e) => setReviewSort(e.target.value as typeof reviewSort)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        fontSize: 13,
                      }}
                    >
                      <option value="newest">Most Recent</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsWritingReview(true)}
                    className="btn-primary"
                    style={{ fontSize: 12.5, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Plus size={14} />
                    Write a Review
                  </button>
                </div>

                {/* Review Cards List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {sortedReviews.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-text-primary)' }}>
                            {r.userName}
                          </span>
                          {r.verifiedPurchase && (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                padding: '1px 6px',
                                borderRadius: 'var(--radius-xs)',
                                background: 'var(--color-forest-50, #EAF6EF)',
                                color: 'var(--color-forest)',
                              }}
                            >
                              Verified Sower
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)' }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 6 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={13}
                            fill={s <= r.rating ? 'var(--color-amber)' : 'none'}
                            stroke={s <= r.rating ? 'none' : 'var(--color-border)'}
                          />
                        ))}
                      </div>

                      <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', color: 'var(--color-text-primary)' }}>
                        {r.title}
                      </h4>
                      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                        {r.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Sticky purchase panel */}
          <div className="purchase-panel">
            <div
              className="card-base"
              style={{
                padding: 22,
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                position: 'sticky',
                top: 100,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Procurement Summary</h3>

              {/* Quantity stepper */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ margin: '0 0 8px', fontSize: 13.5, fontWeight: 600 }}>Quantity ({product.unit})</p>
                <div style={{ display: 'flex', alignItems: 'center', width: 'fit-content', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ width: 32, height: 32, background: 'var(--color-surface-variant)', border: 'none', cursor: 'pointer', fontSize: 16 }}
                  >
                    −
                  </button>
                  <span style={{ width: 44, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockCount ?? 99, q + 1))}
                    style={{ width: 32, height: 32, background: 'var(--color-surface-variant)', border: 'none', cursor: 'pointer', fontSize: 16 }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price summary */}
              <div style={{ background: 'var(--color-surface-variant)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13.5 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Item Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(product.price * quantity)}</span>
                </div>
                {savings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13.5 }}>
                    <span style={{ color: 'var(--color-success)' }}>Middleman Savings</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>−{formatPrice(savings)}</span>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: 10,
                    marginTop: 4,
                    borderTop: '1px solid var(--color-border)',
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  <span>Payable</span>
                  <span style={{ color: 'var(--color-forest)' }}>{formatPrice(product.price * quantity)}</span>
                </div>
              </div>

              {/* Delivery info */}
              <p style={{ margin: '0 0 16px', fontSize: 12.5, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={15} style={{ color: 'var(--color-forest)', flexShrink: 0 }} />
                {product.price * quantity >= 1000 ? 'Free Doorstep Logistics' : '₹99 Delivery Fee'}
              </p>

              <button
                onClick={handleAddToCart}
                className="btn-primary"
                style={{ width: '100%', marginBottom: 10, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="btn-outline"
                style={{ width: '100%', padding: '10px', fontWeight: 600 }}
              >
                Instant Checkout
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700 }}>Similar Recommended Inputs</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        {recentProducts.length > 0 && (
          <div style={{ marginTop: 40, borderTop: '1px solid var(--color-border)', paddingTop: 28 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700 }}>Recently Inspected Products</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {recentProducts.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        )}

        {/* Write Review Modal */}
        {isWritingReview && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: 20,
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setIsWritingReview(false)}
          >
            <div
              className="card-base"
              style={{
                width: '100%',
                maxWidth: 520,
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                boxShadow: 'var(--shadow-xl)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Review this Product</h3>
                <button
                  onClick={() => setIsWritingReview(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', padding: 4 }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddReview}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    Overall Star Rating
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewRating(s)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 2,
                        }}
                      >
                        <Star
                          size={24}
                          fill={s <= newRating ? 'var(--color-amber)' : 'none'}
                          stroke={s <= newRating ? 'none' : 'var(--color-border)'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    Headline / Summary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Outstanding germination rate on black soil"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    Detailed Field Feedback
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Share information about emergence speed, yield, nodulation, or dosage applied..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      fontSize: 13,
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setIsWritingReview(false)}
                    className="btn-outline"
                    style={{ fontSize: 13, padding: '7px 14px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newTitle.trim() || !newComment.trim()}
                    className="btn-primary"
                    style={{ fontSize: 13, padding: '7px 18px' }}
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr 320px !important;
          }
        }
        .purchase-panel {
          display: none;
        }
        @media (min-width: 768px) {
          .purchase-panel {
            display: block;
          }
        }
      `}</style>
    </AppShell>
  );
}
