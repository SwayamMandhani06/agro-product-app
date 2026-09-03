'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/features/auth/store';
import { useCartStore } from '@/features/cart/store';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_MANDI_PRICES } from '@/lib/mock-data';
import Link from 'next/link';
import type { Product } from '@/types';
import CategoryIcon from '@/components/icons/CategoryIcon';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ShoppingCart,
  CheckCircle,
  Package,
  Star,
} from 'lucide-react';

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}`;
}

function ProductCard({ product }: { product: Product }) {
  const addItem  = useCartStore((s) => s.addItem);
  const hasItem  = useCartStore((s) => s.hasItem);
  const inCart   = hasItem(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const imgSrc = `https://picsum.photos/seed/${product.id}/400/280`;

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="card card-hover" style={{ overflow: 'hidden' }}>
        {/* Product image */}
        <div className="product-img-wrap" style={{ height: 140, position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc} alt={product.title} loading="lazy" />
          {discount > 0 && (
            <span className="discount-badge" style={{ position: 'absolute', top: 8, left: 8 }}>
              {discount}% OFF
            </span>
          )}
        </div>

        <div style={{ padding: '12px 14px 14px' }}>
          <p style={{ margin: '0 0 2px', fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            {product.sellerName}
          </p>
          <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.title}
          </p>

          {product.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 8 }}>
              <Star size={11} fill="var(--color-amber)" color="var(--color-amber)" strokeWidth={1} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>{product.rating}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>({product.reviewCount})</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <button
            id={`home-add-cart-${product.id}`}
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className={`btn btn-full btn-sm ${inCart ? 'btn-secondary' : 'btn-primary'}`}
            style={{ gap: 6, fontSize: 12 }}
          >
            {inCart
              ? <><CheckCircle size={13} strokeWidth={2.5} />In Cart</>
              : <><ShoppingCart size={13} strokeWidth={2} />Add to Cart</>
            }
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { user } = useAuthStore();
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const firstName = user?.name?.split(' ')[0] ?? 'Farmer';

  return (
    <AppShell>
      <div style={{ background: 'var(--color-bg)' }}>

        {/* ============================================================
            HERO GREETING SECTION — clean, minimal
            ============================================================ */}
        <div style={{ background: 'var(--color-forest)', paddingBottom: 40 }}>
          <div className="container-app" style={{ paddingTop: 28 }}>
            <p style={{ margin: '0 0 2px', color: 'rgba(255,255,255,0.65)', fontSize: 13, letterSpacing: '0.1px' }}>
              {greeting},
            </p>
            <h1 style={{ margin: '0 0 20px', color: '#fff', fontSize: 24, fontWeight: 700, letterSpacing: '-0.3px' }}>
              {firstName}
            </h1>

            {/* Integrated search bar */}
            <Link href="/products" style={{ display: 'block', textDecoration: 'none' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 8,
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: 'rgba(255,255,255,0.60)',
                  fontSize: 14,
                }}
              >
                <Search size={16} strokeWidth={2} />
                Search seeds, fertilizers, farm tools…
              </div>
            </Link>
          </div>
        </div>

        {/* ============================================================
            CATEGORY STRIP — refined icon labels
            ============================================================ */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--color-divider)' }}>
          <div className="container-app">
            <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingTop: 4, paddingBottom: 4 }}>
              {MOCK_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories?id=${cat.id}`}
                  id={`home-cat-${cat.id}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    textDecoration: 'none',
                    flexShrink: 0,
                    padding: '16px 18px',
                    borderBottom: '2px solid transparent',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div className="cat-icon-wrap" style={{ width: 44, height: 44 }}>
                    <CategoryIcon categoryName={cat.name} size={20} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="container-app" style={{ paddingTop: 28, paddingBottom: 32 }}>

          {/* ============================================================
              MANDI MARKET RATES — structured table layout
              ============================================================ */}
          <div style={{ marginBottom: 36 }}>
            <div className="section-header">
              <div>
                <h2 style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.1px' }}>
                  Live Mandi Rates
                </h2>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>Today&apos;s commodity prices</p>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid var(--color-divider)', overflow: 'hidden' }}>
              <table className="mandi-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th style={{ paddingLeft: 16, paddingRight: 8 }}>Commodity</th>
                    <th>Price / qtl</th>
                    <th>Change</th>
                    <th style={{ paddingRight: 16 }}>Market</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_MANDI_PRICES.map((mp) => (
                    <tr key={mp.crop}>
                      <td style={{ paddingLeft: 16, paddingRight: 8, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {mp.crop}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--color-forest)', fontSize: 15 }}>
                        {mp.price}
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }} className={mp.trend === 'up' ? 'mandi-change-up' : mp.trend === 'down' ? 'mandi-change-down' : ''}>
                          {mp.trend === 'up'   && <TrendingUp   size={13} strokeWidth={2.5} />}
                          {mp.trend === 'down' && <TrendingDown size={13} strokeWidth={2.5} />}
                          {mp.trend === 'flat' && <Minus        size={13} strokeWidth={2.5} style={{ color: 'var(--color-text-tertiary)' }} />}
                          {mp.change}
                        </span>
                      </td>
                      <td style={{ paddingRight: 16, color: 'var(--color-text-tertiary)', fontSize: 13 }}>
                        {mp.market}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================================
              FEATURED PRODUCTS
              ============================================================ */}
          <div>
            <div className="section-header">
              <div>
                <h2 style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.1px' }}>
                  Featured Products
                </h2>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>Curated agri-inputs for this season</p>
              </div>
              <Link
                href="/products"
                id="home-see-all-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-forest)', fontWeight: 600, textDecoration: 'none' }}
              >
                View All <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {MOCK_PRODUCTS.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Browse all CTA */}
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <Link href="/products" className="btn btn-secondary" id="home-browse-all-btn" style={{ fontSize: 14 }}>
                <Package size={15} strokeWidth={2} />
                Browse All Products
              </Link>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
