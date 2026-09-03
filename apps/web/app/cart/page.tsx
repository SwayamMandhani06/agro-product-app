'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { useCartStore } from '@/features/cart/store';

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function CartPage() {
  const {
    items,
    subtotal,
    deliveryFee,
    totalSavings,
    totalAmount,
    totalItemCount,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();


  const sub = subtotal();
  const fee = deliveryFee();
  const savings = totalSavings();
  const total = totalAmount();
  const count = totalItemCount();

  const CATEGORY_EMOJI: Record<string, string> = {
    Seeds: '🌱',
    Fertilizers: '🧪',
    'Crop Protection': '🛡️',
    Irrigation: '💧',
    'Farm Tools': '🔧',
    'Animal Care': '🐄',
  };

  if (items.length === 0) {
    return (
      <AppShell>
        <div className="container-app" style={{ paddingTop: 24, paddingBottom: 40 }}>
          <div className="empty-state" style={{ paddingTop: 64 }}>
            <div className="empty-icon" style={{ fontSize: 40 }}>🛒</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Your cart is empty
            </h2>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 15, maxWidth: 300, textAlign: 'center' }}>
              Add seeds, fertilizers, or farm tools to get started.
            </p>
            <Link href="/products" className="btn btn-primary" id="cart-browse-btn" style={{ borderRadius: 12, padding: '13px 28px' }}>
              Browse Products
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>
            My Cart ({count})
          </h1>
          <button
            onClick={clearCart}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--color-error)', fontSize: 13 }}
          >
            Clear All
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="cart-layout">
          {/* Cart items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((item) => {
              const discount = item.product.originalPrice
                ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
                : 0;
              const emoji = CATEGORY_EMOJI[item.product.category ?? ''] ?? '📦';

              return (
                <div
                  key={item.product.id}
                  className="card"
                  style={{ padding: '16px' }}
                >
                  <div style={{ display: 'flex', gap: 14 }}>
                    {/* Image */}
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, var(--color-brand-50), var(--color-brand-100))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 36,
                        flexShrink: 0,
                        position: 'relative',
                      }}
                    >
                      {emoji}
                      {discount > 0 && (
                        <span className="discount-badge" style={{ position: 'absolute', bottom: -4, right: -4, fontSize: 9 }}>
                          {discount}%
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 2px', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                        {item.product.sellerName}
                      </p>
                      <p
                        style={{
                          margin: '0 0 6px',
                          fontSize: 15,
                          fontWeight: 700,
                          color: 'var(--color-text-primary)',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.product.title}
                      </p>
                      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                        {item.product.unit}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                          <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-forest)' }}>
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          {item.product.originalPrice && (
                            <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textDecoration: 'line-through' }}>
                              {formatPrice(item.product.originalPrice * item.quantity)}
                            </span>
                          )}
                        </div>

                        {/* Stepper */}
                        <div className="qty-stepper">
                          <button
                            id={`cart-decrease-${item.product.id}`}
                            className="qty-btn"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            id={`cart-increase-${item.product.id}`}
                            className="qty-btn"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      id={`cart-remove-${item.product.id}`}
                      onClick={() => removeItem(item.product.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-text-tertiary)',
                        fontSize: 18,
                        alignSelf: 'flex-start',
                        padding: 4,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div>
            <div
              className="card"
              style={{ padding: 20, position: 'sticky', top: 100 }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700 }}>Order Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal ({count} items)</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(sub)}</span>
                </div>
                {savings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--color-success)' }}>Savings</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>−{formatPrice(savings)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Delivery</span>
                  <span style={{ fontWeight: 600, color: fee === 0 ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
                    {fee === 0 ? 'FREE' : formatPrice(fee)}
                  </span>
                </div>
                {fee === 0 && (
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--color-success)' }}>
                    🎉 Free delivery applied!
                  </p>
                )}
                {fee > 0 && (
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                    Add {formatPrice(1000 - sub)} more for free delivery
                  </p>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderTop: '2px solid var(--color-divider)',
                  marginBottom: 20,
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                <span>Total</span>
                <span style={{ color: 'var(--color-forest)' }}>{formatPrice(total)}</span>
              </div>

              <Link
                href="/checkout"
                id="cart-checkout-btn"
                className="btn btn-primary btn-full"
                style={{ borderRadius: 12, padding: '14px 24px', fontSize: 16 }}
              >
                Proceed to Checkout →
              </Link>

              <Link
                href="/products"
                className="btn btn-ghost btn-full"
                style={{ marginTop: 10, borderRadius: 12 }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .cart-layout {
            grid-template-columns: 1fr 340px !important;
          }
        }
      `}</style>
    </AppShell>
  );
}
