'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { useOrdersStore } from '@/features/orders/store';
import type { Order, OrderStatus } from '@/types';
import { ORDER_STATUS_LABELS } from '@/types';
import { Package } from 'lucide-react';

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

  return (
    <Link href={`/orders/${order.id}`} style={{ textDecoration: 'none' }}>
      <div className="card card-hover" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
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
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2px',
              background: statusStyle.bg,
              color: statusStyle.color,
            }}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', borderTop: '1px solid var(--color-divider)', paddingTop: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid var(--color-divider)',
              background: 'var(--color-neutral-50)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://picsum.photos/seed/${firstItem?.product.id}/120/120`}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: '0 0 2px',
                fontSize: 14,
                fontWeight: 600,
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
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              via {order.paymentMethod}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {formatPrice(order.totalAmount)}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-tertiary)' }}>Total</p>
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
        <h1 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 700 }}>My Orders</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: '1px solid var(--color-divider)', paddingBottom: 2 }}>
          {TABS.map((t) => (
            <button
              key={t.value}
              id={`orders-tab-${t.value}`}
              onClick={() => setTab(t.value)}
              style={{
                padding: '8px 14px',
                background: 'none',
                border: 'none',
                borderBottom: tab === t.value ? '2px solid var(--color-forest)' : '2px solid transparent',
                marginBottom: -3,
                cursor: 'pointer',
                fontSize: 13,
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
            <div className="empty-icon"><Package size={28} strokeWidth={1.5} /></div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>No orders yet</h2>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>
              {tab === 'all' ? "You haven't placed any orders yet." : `No ${tab} orders found.`}
            </p>
            {tab === 'all' && (
              <Link href="/products" className="btn btn-primary" id="orders-shop-now-btn">
                Shop Now
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
