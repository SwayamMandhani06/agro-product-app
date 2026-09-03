'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { useOrdersStore } from '@/features/orders/store';
import type { Order, OrderStatus } from '@/types';
import { ORDER_STATUS_LABELS } from '@/types';

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  placed: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
  confirmed: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
  processing: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  shipped: { bg: 'var(--color-amber-50)', color: 'var(--color-amber-600)' },
  outForDelivery: { bg: 'var(--color-amber-50)', color: 'var(--color-amber-600)' },
  delivered: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  cancelled: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

function OrderCard({ order }: { order: Order }) {
  const statusStyle = STATUS_COLORS[order.status] ?? STATUS_COLORS.placed;
  const firstItem = order.items[0];
  const CATEGORY_EMOJI: Record<string, string> = {
    Seeds: '🌱', Fertilizers: '🧪', 'Crop Protection': '🛡️', Irrigation: '💧', 'Farm Tools': '🔧', 'Animal Care': '🐄',
  };
  const emoji = CATEGORY_EMOJI[firstItem?.product.category ?? ''] ?? '📦';

  return (
    <Link href={`/orders/${order.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="card card-hover"
        style={{ padding: '18px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: 'var(--color-forest)', letterSpacing: '0.3px' }}>
              {order.id}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
              {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 700,
              background: statusStyle.bg,
              color: statusStyle.color,
            }}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', borderTop: '1px solid var(--color-divider)', paddingTop: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 10,
              background: 'var(--color-brand-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            {emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: '0 0 2px',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {firstItem?.product.title}
              {order.items.length > 1 && (
                <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 500 }}>
                  {' '}+{order.items.length - 1} more
                </span>
              )}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)' }}>
              via {order.paymentMethod}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 2px', fontSize: 17, fontWeight: 800, color: 'var(--color-forest)' }}>
              {formatPrice(order.totalAmount)}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>Total</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

type FilterTab = 'all' | 'active' | 'delivered' | 'cancelled';

const TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'active', label: 'Active' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  const { orders } = useOrdersStore();
  const [tab, setTab] = useState<FilterTab>('all');

  const filtered = orders.filter((o) => {
    if (tab === 'all') return true;
    if (tab === 'active') return ['placed', 'confirmed', 'processing', 'shipped', 'outForDelivery'].includes(o.status);
    return o.status === tab;
  });

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <h1 style={{ margin: '0 0 20px', fontSize: 24, fontWeight: 700 }}>My Orders</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid var(--color-divider)' }}>
          {TABS.map((t) => (
            <button
              key={t.value}
              id={`orders-tab-${t.value}`}
              onClick={() => setTab(t.value)}
              style={{
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                borderBottom: tab === t.value ? '2px solid var(--color-forest)' : '2px solid transparent',
                marginBottom: -2,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: tab === t.value ? 700 : 500,
                color: tab === t.value ? 'var(--color-forest)' : 'var(--color-text-secondary)',
                whiteSpace: 'nowrap',
                transition: 'all 150ms ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>No orders yet</h2>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 15 }}>
              {tab === 'all' ? "You haven't placed any orders yet." : `No ${tab} orders found.`}
            </p>
            {tab === 'all' && (
              <Link href="/products" className="btn btn-primary" id="orders-shop-now-btn" style={{ borderRadius: 12 }}>
                Shop Now
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
