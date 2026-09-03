'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { getProductById, getSimilarProducts } from '@/lib/mock-data';
import { useCartStore } from '@/features/cart/store';
import { Package, Truck, ShoppingCart, CheckCircle, Star } from 'lucide-react';

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const product = getProductById(id);
  const similar = getSimilarProducts(id);

  const addItem = useCartStore((s) => s.addItem);
  const hasItem = useCartStore((s) => s.hasItem);
  const getQty = useCartStore((s) => s.getItemQuantity);
  const removeItem = useCartStore((s) => s.removeItem);


  const [tab, setTab] = useState<'overview' | 'specs'>('overview');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <AppShell>
        <div className="empty-state" style={{ paddingTop: 64 }}>
          <div className="empty-icon"><Package size={28} strokeWidth={1.5} /></div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Product not found</h2>
          <Link href="/products" className="btn btn-primary">Browse Products</Link>
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

  const inCart = hasItem(product.id);
  const cartQty = getQty(product.id);

  const imgSrc = `https://picsum.photos/seed/${product.id}/600/400`;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/cart');
  };

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 20, paddingBottom: 32 }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: 16, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
          <Link href="/home" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Home</Link>
          {' › '}
          <Link href="/products" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>Products</Link>
          {' › '}
          <span style={{ color: 'var(--color-text-primary)' }}>{product.title.slice(0, 30)}…</span>
        </nav>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: 24,
          }}
          className="product-detail-grid"
        >
          {/* Left: image + info */}
          <div>
            {/* Image */}
            <div className="product-img-wrap" style={{ height: 280, borderRadius: 12, marginBottom: 20, position: 'relative', border: '1px solid var(--color-divider)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgSrc} alt={product.title} />
              {discount > 0 && (
                <span className="discount-badge" style={{ position: 'absolute', top: 12, left: 12 }}>
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Title & seller */}
            <div style={{ marginBottom: 16 }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  background: 'var(--color-brand-50)',
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--color-forest)',
                  marginBottom: 8,
                }}
              >
                {product.category}
              </span>
              <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, lineHeight: 1.3, color: 'var(--color-text-primary)' }}>
                {product.title}
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                by {product.sellerName}
                {product.sellerRating && (
                  <span style={{ marginLeft: 8, color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <Star size={12} fill="var(--color-amber)" color="var(--color-amber)" strokeWidth={1} />
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{product.sellerRating}</span> Seller
                  </span>
                )}
              </p>
            </div>

            {/* Rating */}
            {product.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(product.rating!) ? 'var(--color-amber)' : 'var(--color-neutral-200)'} color={i < Math.floor(product.rating!) ? 'var(--color-amber)' : 'var(--color-neutral-200)'} strokeWidth={1} />
                  ))}
                </div>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{product.rating}</span>
                <span style={{ color: 'var(--color-text-tertiary)', fontSize: 14 }}>({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-forest)' }}>
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span style={{ fontSize: 16, color: 'var(--color-text-tertiary)', textDecoration: 'line-through' }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                per {product.unit}
              </p>
              {savings > 0 && (
                <span className="badge badge-success">
                  You save {formatPrice(savings)}
                </span>
              )}
            </div>

            {/* Stock */}
            {product.stockCount && (
              <p style={{ margin: '0 0 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: product.stockCount < 10 ? 'var(--color-warning)' : 'var(--color-success)', fontWeight: 600 }}>
                  {product.stockCount < 10 ? `Only ${product.stockCount} left` : `In Stock (${product.stockCount} units)`}
                </span>
              </p>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '2px solid var(--color-divider)' }}>
              {(['overview', 'specs'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: '10px 20px',
                    background: 'none',
                    border: 'none',
                    borderBottom: tab === t ? '2px solid var(--color-forest)' : '2px solid transparent',
                    marginBottom: -2,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    color: tab === t ? 'var(--color-forest)' : 'var(--color-text-secondary)',
                    transition: 'all 150ms ease',
                  }}
                >
                  {t === 'overview' ? 'Overview' : 'Specifications'}
                </button>
              ))}
            </div>

            {tab === 'overview' && (
              <div>
                {product.description && (
                  <p style={{ margin: '0 0 16px', fontSize: 15, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
                    {product.description}
                  </p>
                )}
                {product.highlights && (
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {product.highlights.map((h, i) => (
                      <li key={i} style={{ display: 'flex', gap: 8, fontSize: 14, alignItems: 'flex-start' }}>
                        <CheckCircle size={15} strokeWidth={2.5} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tab === 'specs' && product.specifications && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {Object.entries(product.specifications).map(([key, val], i) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: i < Object.keys(product.specifications!).length - 1 ? '1px solid var(--color-divider)' : 'none',
                      fontSize: 14,
                    }}
                  >
                    <span style={{ color: 'var(--color-text-secondary)' }}>{key}</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'right', maxWidth: '60%' }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: sticky purchase panel (desktop) */}
          <div className="purchase-panel">
            <div
              className="card"
              style={{
                padding: 20,
                position: 'sticky',
                top: 100,
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700 }}>Order Details</h3>

              {/* Quantity stepper */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>Quantity</p>
                <div className="qty-stepper" style={{ width: 'fit-content' }}>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.min(product.stockCount ?? 99, q + 1))}
                    disabled={quantity >= (product.stockCount ?? 99)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price summary */}
              <div style={{ background: 'var(--color-canvas)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Price (×{quantity})</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(product.price * quantity)}</span>
                </div>
                {savings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                    <span style={{ color: 'var(--color-success)' }}>Savings</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>−{formatPrice(savings)}</span>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: 10,
                    marginTop: 4,
                    borderTop: '1px solid var(--color-divider)',
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: 'var(--color-forest)' }}>{formatPrice(product.price * quantity)}</span>
                </div>
              </div>

              {/* Delivery info */}
              <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={14} strokeWidth={2} />
                Free delivery on orders above ₹1,000 · Delivers to {product.deliveryLocation}
              </p>

              {/* Cart badge */}
              {inCart && (
                <div
                  style={{ background: 'var(--color-success-light)', border: '1px solid var(--color-success)', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 13, color: 'var(--color-success)', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} strokeWidth={2.5} />{cartQty} in cart</span>
                  <button onClick={() => removeItem(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', fontSize: 12, fontWeight: 600 }}>Remove</button>
                </div>
              )}

              <button id="detail-add-cart-btn" onClick={handleAddToCart} className="btn btn-secondary btn-full" style={{ marginBottom: 10, gap: 6 }}>
                <ShoppingCart size={15} strokeWidth={2} />Add to Cart
              </button>
              <button id="detail-buy-now-btn" onClick={handleBuyNow} className="btn btn-primary btn-full" style={{ gap: 6 }}>
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 700 }}>Similar Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
              {similar.map((p) => {
                const simImgSrc = `https://picsum.photos/seed/${p.id}/400/280`;
                return (
                  <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card card-hover">
                      <div className="product-img-wrap" style={{ height: 100 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={simImgSrc} alt={p.title} loading="lazy" />
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{formatPrice(p.price)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
