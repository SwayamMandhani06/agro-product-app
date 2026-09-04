'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, ShoppingBag, ArrowRight, Trash2, ShoppingCart } from 'lucide-react';
import AppShellLayout from '@/components/layout/AppShell';
import ProductCard from '@/components/common/ProductCard';
import { useWishlistStore } from '@/features/wishlist/wishlist-store';
import { useRecentlyViewedStore } from '@/features/products/recently-viewed-store';
import { useCartStore } from '@/features/cart/store';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export default function SavedProductsPage() {
  const savedProductIds = useWishlistStore((s) => s.savedProductIds);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const addAllToCart = useCartStore((s) => s.addItem);
  const recentlyViewed = useRecentlyViewedStore((s) => s.items);

  const savedProducts = savedProductIds
    .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const handleAddAll = () => {
    savedProducts.forEach((p) => {
      if (p.inStock) {
        addAllToCart(p);
      }
    });
  };

  return (
    <AppShellLayout>
      <div className="container-app" style={{ paddingBottom: 'var(--space-2xl)' }}>
        {/* Breadcrumb & Header */}
        <div style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
            <Link href="/home" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Saved Products</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="text-h1" style={{ margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Bookmark size={24} style={{ color: 'var(--color-amber)' }} />
                Saved Products & Wishlist
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                {savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'} saved for quick re-ordering and price tracking
              </p>
            </div>

            {savedProducts.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={handleAddAll}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '8px 16px' }}
                >
                  <ShoppingCart size={15} />
                  Add All In-Stock to Cart
                </button>
                <button
                  onClick={clearWishlist}
                  className="btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '8px 14px' }}
                >
                  <Trash2 size={14} />
                  Clear List
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Grid or Empty State */}
        {savedProducts.length === 0 ? (
          <div
            className="card-base"
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)',
              border: '1px dashed var(--color-border)',
              margin: '20px 0 40px',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--color-surface-variant)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--color-text-tertiary)',
              }}
            >
              <Bookmark size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
              Your Wishlist is Empty
            </h3>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', maxWidth: 420, margin: '0 auto 20px', lineHeight: 1.5 }}>
              Tap the heart icon on any certified seed, fertilizer, or equipment in the catalog to save it here for fast access.
            </p>
            <Link
              href="/products"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
            >
              <ShoppingBag size={16} />
              Browse Agricultural Catalog
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 'var(--space-md)',
              margin: '20px 0 40px',
            }}
          >
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <div style={{ marginTop: 40, borderTop: '1px solid var(--color-border)', paddingTop: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                  Recently Viewed
                </h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', margin: '2px 0 0' }}>
                  Items you recently inspected in the catalog
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 'var(--space-md)',
              }}
            >
              {recentlyViewed.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShellLayout>
  );
}
