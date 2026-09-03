'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useOrdersStore } from '@/features/orders/store';

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function ConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';
  const { getOrderById } = useOrdersStore();
  const order = getOrderById(orderId);

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div
          style={{
            maxWidth: 540,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {/* Success animation */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'var(--color-success-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 52,
              margin: '0 auto 24px',
              border: '3px solid var(--color-success)',
            }}
          >
            ✅
          </div>

          <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Order Confirmed!
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            Thank you for your order. We&apos;ve received it and it&apos;s being processed.
          </p>

          {order && (
            <div
              className="card"
              style={{ padding: '20px', textAlign: 'left', marginBottom: 24 }}
            >
              {/* Order ID */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 12, color: 'var(--color-text-tertiary)' }}>ORDER ID</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-forest)', letterSpacing: '0.5px' }}>
                    {order.id}
                  </p>
                </div>
                <span className="badge badge-success">Confirmed</span>
              </div>

              {/* Items */}
              <div style={{ borderTop: '1px solid var(--color-divider)', paddingTop: 14, marginBottom: 14 }}>
                {order.items.slice(0, 3).map((item) => (
                  <div
                    key={item.product.id}
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}
                  >
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {item.product.title.slice(0, 30)}… ×{item.quantity}
                    </span>
                    <span style={{ fontWeight: 600 }}>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                    +{order.items.length - 3} more items
                  </p>
                )}
              </div>

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 17 }}>
                <span>Total Paid</span>
                <span style={{ color: 'var(--color-forest)' }}>{formatPrice(order.totalAmount)}</span>
              </div>

              <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--color-canvas)', borderRadius: 10 }}>
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  🚛 Estimated Delivery: {order.estimatedDelivery}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                  📍 {order.address.city}, {order.address.state}
                </p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link
              href={`/orders/${orderId}`}
              id="confirmed-track-btn"
              className="btn btn-primary btn-full"
              style={{ borderRadius: 12, padding: '14px 24px', fontSize: 16 }}
            >
              Track My Order →
            </Link>
            <Link
              href="/home"
              id="confirmed-home-btn"
              className="btn btn-secondary btn-full"
              style={{ borderRadius: 12, padding: '13px 24px', fontSize: 16 }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: 'center' }}>Loading…</div>}>
      <ConfirmedContent />
    </Suspense>
  );
}
