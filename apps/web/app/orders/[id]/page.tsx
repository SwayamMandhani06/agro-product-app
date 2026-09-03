'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useOrdersStore } from '@/features/orders/store';
import { useCartStore } from '@/features/cart/store';
import {
  ORDER_STATUS_LABELS,
  ORDER_TIMELINE_STEPS,
  orderStatusStep,
  type OrderStatus,
} from '@/types';

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
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

const TIMELINE_ICONS: Record<string, string> = {
  placed: '📋',
  confirmed: '✅',
  processing: '📦',
  shipped: '🚚',
  outForDelivery: '🛵',
  delivered: '🏡',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, cancelOrder } = useOrdersStore();
  const { addItem } = useCartStore();
  const router = useRouter();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const order = getOrderById(id);

  if (!order) {
    return (
      <AppShell>
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-icon">📦</div>
          <p style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>Order not found</p>
          <Link href="/orders" className="btn btn-primary">View All Orders</Link>
        </div>
      </AppShell>
    );
  }

  const statusStyle = STATUS_COLORS[order.status];
  const stepIndex = orderStatusStep(order.status);
  const isActive = ['placed', 'confirmed', 'processing', 'shipped', 'outForDelivery'].includes(order.status);
  const isCancelled = order.status === 'cancelled';

  const handleReorder = () => {
    order.items.forEach((item) => addItem(item.product, item.quantity));
    router.push('/cart');
  };

  const handleCancel = async () => {
    setCancelling(true);
    await new Promise((r) => setTimeout(r, 800));
    cancelOrder(order.id);
    setCancelDialogOpen(false);
    setCancelling(false);
  };

  const CATEGORY_EMOJI: Record<string, string> = {
    Seeds: '🌱', Fertilizers: '🧪', 'Crop Protection': '🛡️', Irrigation: '💧', 'Farm Tools': '🔧', 'Animal Care': '🐄',
  };

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
          <Link href="/orders" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>My Orders</Link>
          {' › '}
          <span style={{ color: 'var(--color-text-primary)' }}>{order.id}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="order-detail-layout">
          <div>
            {/* Order header */}
            <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h1 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {order.id}
                  </h1>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  style={{
                    padding: '5px 14px',
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 700,
                    background: statusStyle.bg,
                    color: statusStyle.color,
                  }}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                <span>💳 {order.paymentMethod}</span>
                <span>📦 {order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                <span style={{ color: 'var(--color-forest)', fontWeight: 700 }}>
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Tracking timeline (not cancelled) */}
            {!isCancelled && (
              <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
                <h2 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700 }}>
                  🚛 Track Order
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {ORDER_TIMELINE_STEPS.map((step, i) => {
                    const done = i < stepIndex;
                    const active = i === stepIndex;

                    return (
                      <div key={step} style={{ display: 'flex', gap: 16, paddingBottom: i < ORDER_TIMELINE_STEPS.length - 1 ? 20 : 0 }}>
                        {/* Left: dot + line */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28 }}>
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: done ? 'var(--color-forest)' : active ? 'var(--color-amber)' : 'var(--color-neutral-100)',
                              border: `2px solid ${done ? 'var(--color-forest)' : active ? 'var(--color-amber)' : 'var(--color-neutral-200)'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 13,
                              flexShrink: 0,
                              color: done || active ? '#fff' : 'var(--color-text-tertiary)',
                            }}
                          >
                            {done ? '✓' : active ? TIMELINE_ICONS[step] ?? '●' : '○'}
                          </div>
                          {i < ORDER_TIMELINE_STEPS.length - 1 && (
                            <div style={{ width: 2, flex: 1, background: done ? 'var(--color-forest)' : 'var(--color-neutral-200)', marginTop: 2 }} />
                          )}
                        </div>

                        {/* Right: label */}
                        <div style={{ paddingBottom: 4 }}>
                          <p
                            style={{
                              margin: '2px 0 2px',
                              fontSize: 14,
                              fontWeight: active ? 700 : done ? 600 : 400,
                              color: active ? 'var(--color-amber-600)' : done ? 'var(--color-forest)' : 'var(--color-text-tertiary)',
                            }}
                          >
                            {ORDER_STATUS_LABELS[step]}
                          </p>
                          {active && (
                            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)' }}>
                              {step === 'shipped' && order.deliveryAgentName
                                ? `Delivery agent: ${order.deliveryAgentName} · ${order.deliveryAgentPhone}`
                                : 'Currently at this stage'}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    marginTop: 20,
                    padding: '12px 14px',
                    background: 'var(--color-canvas)',
                    borderRadius: 10,
                    fontSize: 13,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  🗓️ Estimated delivery: <strong>{order.estimatedDelivery}</strong>
                </div>
              </div>
            )}

            {/* Cancelled notice */}
            {isCancelled && (
              <div
                style={{
                  background: 'var(--color-error-light)',
                  border: '1px solid var(--color-error)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  marginBottom: 16,
                  fontSize: 15,
                  color: 'var(--color-error)',
                  fontWeight: 600,
                }}
              >
                ❌ This order has been cancelled.
              </div>
            )}

            {/* Order items */}
            <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700 }}>📦 Items Ordered</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {order.items.map((item) => {
                  const emoji = CATEGORY_EMOJI[item.product.category ?? ''] ?? '📦';
                  return (
                    <div key={item.product.id} style={{ display: 'flex', gap: 14 }}>
                      <div
                        style={{
                          width: 56,
                          height: 56,
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
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700 }}>{item.product.title}</p>
                        <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                          {item.product.unit} · Qty: {item.quantity}
                        </p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--color-forest)' }}>
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery address */}
            <div className="card" style={{ padding: '20px' }}>
              <h2 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 700 }}>📍 Delivery Address</h2>
              <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 15 }}>{order.address.recipientName}</p>
              <p style={{ margin: '0 0 2px', fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {order.address.addressLine}, {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                📞 {order.address.phone}
              </p>
            </div>
          </div>

          {/* Right: Bill + Actions */}
          <div>
            {/* Bill summary */}
            <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700 }}>💰 Payment Summary</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(order.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Delivery</span>
                  <span style={{ fontWeight: 600, color: order.deliveryFee === 0 ? 'var(--color-success)' : 'inherit' }}>
                    {order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--color-success)' }}>Discount</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>−{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: 12,
                    marginTop: 4,
                    borderTop: '2px solid var(--color-divider)',
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  <span>Total Paid</span>
                  <span style={{ color: 'var(--color-forest)' }}>{formatPrice(order.totalAmount)}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                  via {order.paymentMethod}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                id="order-reorder-btn"
                onClick={handleReorder}
                className="btn btn-primary btn-full"
                style={{ borderRadius: 12, padding: '13px 24px' }}
              >
                🔄 Reorder
              </button>
              {isActive && (
                <button
                  id="order-cancel-btn"
                  onClick={() => setCancelDialogOpen(true)}
                  className="btn btn-secondary btn-full"
                  style={{ borderRadius: 12, padding: '12px 24px', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                >
                  Cancel Order
                </button>
              )}
              <Link
                href="/orders"
                className="btn btn-ghost btn-full"
                style={{ borderRadius: 12 }}
              >
                ← Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel confirmation dialog */}
      {cancelDialogOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
            onClick={() => setCancelDialogOpen(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--color-surface)',
              borderRadius: 20,
              padding: '28px',
              width: '90%',
              maxWidth: 400,
              zIndex: 101,
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 700 }}>Cancel Order?</h3>
            <p style={{ margin: '0 0 24px', color: 'var(--color-text-secondary)', fontSize: 15 }}>
              Are you sure you want to cancel order {order.id}? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setCancelDialogOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1, borderRadius: 12 }}
              >
                Keep Order
              </button>
              <button
                id="order-confirm-cancel-btn"
                onClick={handleCancel}
                disabled={cancelling}
                className="btn btn-primary"
                style={{ flex: 1, borderRadius: 12, background: 'var(--color-error)', borderColor: 'var(--color-error)' }}
              >
                {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 768px) {
          .order-detail-layout {
            grid-template-columns: 1fr 300px !important;
          }
        }
      `}</style>
    </AppShell>
  );
}
