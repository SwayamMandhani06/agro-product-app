'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data';
import { ProductImageResolver } from '@/lib/product-image-resolver';
import { ProductCardSkeleton } from '@/components/common/Skeleton';
import { useCartStore } from '@/features/cart/store';
import type { Product, ProductSortKey } from '@/types';
import { Search, SlidersHorizontal, ShoppingCart, CheckCircle, Star, Package } from 'lucide-react';

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

const SORTS: { value: ProductSortKey; label: string }[] = [
  { value: 'featured',   label: 'Featured' },
  { value: 'priceAsc',   label: 'Price: Low to High' },
  { value: 'priceDesc',  label: 'Price: High to Low' },
  { value: 'ratingDesc', label: 'Highest Rated' },
  { value: 'newest',     label: 'Newest' },
];

const PRICE_FILTERS = [
  { label: 'Under ₹500',     min: 0,    max: 500 },
  { label: '₹500 – ₹1,000', min: 500,  max: 1000 },
  { label: '₹1,000 – ₹3,000', min: 1000, max: 3000 },
  { label: '₹3,000 & Above', min: 3000, max: Infinity },
];

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const hasItem = useCartStore((s) => s.hasItem);
  const inCart  = hasItem(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const imgSrc = ProductImageResolver.resolve(product.id, product.category);

  return (
    <div className="card card-hover">
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-img-wrap" style={{ height: 150, position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc} alt={product.title} loading="lazy" />
          {discount > 0 && (
            <span className="discount-badge" style={{ position: 'absolute', top: 8, left: 8 }}>
              {discount}% OFF
            </span>
          )}
        </div>
        <div style={{ padding: '12px 14px 8px' }}>
          <p style={{ margin: '0 0 2px', fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            {product.sellerName}
          </p>
          <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.title}
          </p>
          {product.rating && (
            <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Star size={11} fill="var(--color-amber)" color="var(--color-amber)" strokeWidth={1} />
              {product.rating} ({product.reviewCount})
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
      <div style={{ padding: '0 14px 14px' }}>
        <button
          id={`products-add-cart-${product.id}`}
          onClick={() => addItem(product)}
          className={`btn btn-full btn-sm ${inCart ? 'btn-secondary' : 'btn-primary'}`}
          style={{ gap: 5 }}
        >
          {inCart
            ? <><CheckCircle size={13} strokeWidth={2.5} />In Cart</>
            : <><ShoppingCart size={13} strokeWidth={2} />Add to Cart</>
          }
        </button>
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams      = useSearchParams();
  const initialCategory   = searchParams.get('category') ?? '';
  const [query, setQuery]                   = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortKey, setSortKey]               = useState<ProductSortKey>('featured');
  const [priceFilter, setPriceFilter]       = useState<number | null>(null);
  const [minRating, setMinRating]           = useState<number | null>(null);
  const [inStockOnly, setInStockOnly]       = useState(false);
  const [showFilters, setShowFilters]       = useState(false);

  const filtered = useMemo(() => {
    let results = [...MOCK_PRODUCTS];
    if (selectedCategory && selectedCategory !== 'All') {
      results = results.filter((p) => p.category === selectedCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) => p.title.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.sellerName?.toLowerCase().includes(q)
      );
    }
    if (priceFilter !== null) {
      const pf = PRICE_FILTERS[priceFilter];
      results = results.filter((p) => p.price >= pf.min && p.price <= pf.max);
    }
    if (minRating !== null) {
      results = results.filter((p) => (p.rating ?? 0) >= minRating);
    }
    if (inStockOnly) {
      results = results.filter((p) => p.inStock);
    }
    switch (sortKey) {
      case 'priceAsc':   results.sort((a, b) => a.price - b.price); break;
      case 'priceDesc':  results.sort((a, b) => b.price - a.price); break;
      case 'ratingDesc': results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case 'newest':     results.sort((a, b) => b.id.localeCompare(a.id)); break;
    }
    return results;
  }, [query, selectedCategory, sortKey, priceFilter, minRating, inStockOnly]);

  const activeFilterCount = [priceFilter !== null, minRating !== null, inStockOnly].filter(Boolean).length;

  return (
    <AppShell>
      <div style={{ background: 'var(--color-bg)' }}>
        {/* Sticky search bar */}
        <div style={{ background: 'var(--color-forest)', padding: '12px 0', position: 'sticky', top: 'var(--nav-height)', zIndex: 40 }}>
          <div className="container-app">
            <div className="search-input-wrap">
              <span className="search-icon" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <Search size={16} strokeWidth={2} />
              </span>
              <input
                id="products-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands, sellers…"
                className="input-base"
                style={{ paddingLeft: 40, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff' }}
              />
            </div>
          </div>
        </div>

        <div className="container-app" style={{ paddingTop: 16, paddingBottom: 32 }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <select
              id="products-sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as ProductSortKey)}
              style={{ padding: '7px 12px', borderRadius: 6, border: '1.5px solid var(--color-divider)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', background: '#fff', cursor: 'pointer' }}
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>

            <button
              id="products-filter-btn"
              onClick={() => setShowFilters((f) => !f)}
              className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
              style={{ gap: 6 }}
            >
              <SlidersHorizontal size={14} strokeWidth={2} />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--color-text-tertiary)' }}>
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            {/* Sidebar filters */}
            {showFilters && (
              <div style={{ width: 228, flexShrink: 0, background: '#fff', borderRadius: 10, padding: '18px 16px', border: '1px solid var(--color-divider)', alignSelf: 'start', position: 'sticky', top: 130 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, letterSpacing: '-0.1px' }}>Filters</h3>

                <div style={{ marginBottom: 18 }}>
                  <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 12, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Category</p>
                  {['All', ...MOCK_CATEGORIES.map((c) => c.name)].map((cat) => (
                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13, color: 'var(--color-text-primary)' }}>
                      <input type="radio" name="category" checked={selectedCategory === (cat === 'All' ? '' : cat)} onChange={() => setSelectedCategory(cat === 'All' ? '' : cat)} style={{ accentColor: 'var(--color-forest)' }} />
                      {cat}
                    </label>
                  ))}
                </div>

                <div style={{ marginBottom: 18 }}>
                  <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 12, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Price Range</p>
                  {PRICE_FILTERS.map((pf, i) => (
                    <label key={pf.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13, color: 'var(--color-text-primary)' }}>
                      <input type="radio" name="price" checked={priceFilter === i} onChange={() => setPriceFilter(priceFilter === i ? null : i)} style={{ accentColor: 'var(--color-forest)' }} />
                      {pf.label}
                    </label>
                  ))}
                </div>

                <div style={{ marginBottom: 18 }}>
                  <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 12, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Min Rating</p>
                  {[4.5, 4.0, 3.5].map((r) => (
                    <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13 }}>
                      <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(minRating === r ? null : r)} style={{ accentColor: 'var(--color-forest)' }} />
                      <Star size={11} fill="var(--color-amber)" color="var(--color-amber)" strokeWidth={1} /> {r}+
                    </label>
                  ))}
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--color-text-primary)' }}>
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} style={{ accentColor: 'var(--color-forest)' }} />
                  In Stock Only
                </label>

                {activeFilterCount > 0 && (
                  <button onClick={() => { setPriceFilter(null); setMinRating(null); setInStockOnly(false); }} className="btn btn-ghost btn-full" style={{ marginTop: 14, fontSize: 13 }}>
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Product grid */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Category chips */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 14, paddingBottom: 4 }}>
                {['All', ...MOCK_CATEGORIES.map((c) => c.name)].map((cat) => {
                  const active = selectedCategory === (cat === 'All' ? '' : cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                      style={{
                        flexShrink: 0,
                        padding: '5px 12px',
                        borderRadius: 4,
                        border: `1.5px solid ${active ? 'var(--color-forest)' : 'var(--color-divider)'}`,
                        background: active ? 'var(--color-forest)' : '#fff',
                        color: active ? '#fff' : 'var(--color-text-secondary)',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        letterSpacing: '0.1px',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><Package size={28} strokeWidth={1.5} /></div>
                  <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>No products found</p>
                  <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>Try adjusting your search or filters</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="container-app" style={{ paddingTop: 32, paddingBottom: 40 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 14 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </AppShell>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
