'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/features/auth/store';
import { useCartStore } from '@/features/cart/store';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_MANDI_PRICES } from '@/lib/mock-data';
import Link from 'next/link';
import type { Product } from '@/types';

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}`;
}

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const hasItem = useCartStore((s) => s.hasItem);
  const inCart = hasItem(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div
        className="card card-hover"
        style={{ overflow: 'hidden' }}
      >
        {/* Product image placeholder */}
        <div
          style={{
            height: 140,
            background: `linear-gradient(135deg, var(--color-brand-50) 0%, var(--color-brand-100) 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            position: 'relative',
          }}
        >
          {product.category === 'Seeds' && '🌱'}
          {product.category === 'Fertilizers' && '🧪'}
          {product.category === 'Crop Protection' && '🛡️'}
          {product.category === 'Irrigation' && '💧'}
          {product.category === 'Farm Tools' && '🔧'}
          {product.category === 'Animal Care' && '🐄'}

          {discount > 0 && (
            <div
              className="discount-badge"
              style={{ position: 'absolute', top: 10, left: 10 }}
            >
              {discount}% OFF
            </div>
          )}
          {product.isFavorite && (
            <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 18 }}>❤️</span>
          )}
        </div>

        <div style={{ padding: '12px 14px' }}>
          <p style={{ margin: '0 0 2px', fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            {product.sellerName}
          </p>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.title}
          </p>

          {/* Rating */}
          {product.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <span className="rating-stars" style={{ fontSize: 12 }}>★</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {product.rating}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="price-primary" style={{ fontSize: 17 }}>{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <p style={{ margin: '0 0 12px', fontSize: 11, color: 'var(--color-text-tertiary)' }}>
            {product.unit}
          </p>

          {/* Add to cart */}
          <button
            id={`home-add-cart-${product.id}`}
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className={`btn btn-full btn-sm ${inCart ? 'btn-secondary' : 'btn-primary'}`}
            style={{ fontSize: 13, borderRadius: 10 }}
          >
            {inCart ? '✓ Added to Cart' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const firstName = user?.name?.split(' ')[0] ?? 'Farmer';

  return (
    <AppShell>
      <div style={{ background: 'var(--color-bg)' }}>
        {/* ============================================================
            HERO GREETING BANNER
            ============================================================ */}
        <div
          style={{
            background: `linear-gradient(135deg, var(--color-forest) 0%, var(--color-brand-700) 100%)`,
            padding: '28px 0 48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -20, right: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div className="container-app">
            <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
              {greeting},
            </p>
            <h1 style={{ margin: '0 0 6px', color: '#fff', fontSize: 26, fontWeight: 700, letterSpacing: '-0.3px' }}>
              {firstName} 👨‍🌾
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
              What are you shopping for today?
            </p>

            {/* Search bar */}
            <Link
              href="/products"
              style={{ display: 'block', marginTop: 20, textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  borderRadius: 14,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: 15,
                }}
              >
                🔍 Search seeds, fertilizers, tools…
              </div>
            </Link>
          </div>
        </div>

        {/* ============================================================
            QUICK CATEGORIES STRIP
            ============================================================ */}
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: '0 0 20px 20px',
            marginTop: -20,
            padding: '20px 0',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="container-app">
            <div
              style={{
                display: 'flex',
                gap: 12,
                overflowX: 'auto',
                paddingBottom: 4,
              }}
            >
              {MOCK_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories?id=${cat.id}`}
                  id={`home-cat-${cat.id}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    textDecoration: 'none',
                    flexShrink: 0,
                    minWidth: 70,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: 'var(--color-brand-50)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 26,
                      border: '1px solid var(--color-brand-100)',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {cat.icon}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center', lineHeight: 1.2 }}>
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="container-app" style={{ paddingTop: 24, paddingBottom: 24 }}>
          {/* ============================================================
              MANDI PRICES
              ============================================================ */}
          <div style={{ marginBottom: 28 }}>
            <div className="section-header">
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                🌾 Live Mandi Prices
              </h2>
              <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Today</span>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 10,
                overflowX: 'auto',
                paddingBottom: 4,
              }}
            >
              {MOCK_MANDI_PRICES.map((mp) => (
                <div
                  key={mp.crop}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 14,
                    padding: '14px 16px',
                    flexShrink: 0,
                    minWidth: 140,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: 'var(--color-text-primary)' }}>
                    {mp.crop}
                  </p>
                  <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 18, color: 'var(--color-forest)' }}>
                    {mp.price}
                  </p>
                  <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: mp.trend === 'up' ? 'var(--color-success)' : 'var(--color-error)' }}>
                    {mp.trend === 'up' ? '▲' : '▼'} {mp.change}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-tertiary)' }}>{mp.market}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================
              FEATURED PRODUCTS
              ============================================================ */}
          <div>
            <div className="section-header">
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                🔥 Featured Products
              </h2>
              <Link
                href="/products"
                id="home-see-all-btn"
                style={{ fontSize: 14, color: 'var(--color-forest)', fontWeight: 600, textDecoration: 'none' }}
              >
                See All →
              </Link>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 14,
              }}
            >
              {MOCK_PRODUCTS.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
