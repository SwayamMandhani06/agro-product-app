'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useOrdersStore } from '@/features/orders/store';
import { ProductImageResolver } from '@/lib/product-image-resolver';
import { useCartStore } from '@/features/cart/store';
import {
  ORDER_STATUS_LABELS,
  ORDER_TIMELINE_STEPS,
  orderStatusStep,
  type OrderStatus,
} from '@/types';
import {
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  Calendar,
  AlertCircle,
  MapPin,
  Phone,
  Receipt,
  RotateCcw,
  Check,
  ClipboardList,
  CheckCircle,
  Bike,
  Home,
  type LucideProps,
} from 'lucide-react';

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

function TimelineIcon({ step, size = 13 }: { step: string; size?: number }) {
  const props: LucideProps = { size, strokeWidth: 2.2 };
  switch (step) {
    case 'placed': return <ClipboardList {...props} />;
    case 'confirmed': return <CheckCircle {...props} />;
    case 'processing': return <Package {...props} />;
    case 'shipped': return <Truck {...props} />;
    case 'outForDelivery': return <Bike {...props} />;
    case 'delivered': return <Home {...props} />;
    default: return <Check {...props} />;
  }
}

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
        <div className="container-app" style={{ paddingTop: 60, paddingBottom: 40 }}>
          <div className="empty-state">
            <div className="empty-icon"><Package size={28} strokeWidth={1.5} /></div>
            <p style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>Order not found</p>
            <Link href="/orders" className="btn btn-primary">View All Orders</Link>
          </div>
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

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/orders" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>My Orders</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{order.id}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="order-detail-layout">
          <div>
            {/* Order header */}
            <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h1 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {order.id}
                  </h1>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.2px',
                    background: statusStyle.bg,
                    color: statusStyle.color,
                  }}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--color-text-secondary)', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CreditCard size={14} strokeWidth={2} />
                  {order.paymentMethod}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Package size={14} strokeWidth={2} />
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 700, marginLeft: 'auto' }}>
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Tracking timeline (not cancelled) */}
            {!isCancelled && (
              <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <Truck size={18} strokeWidth={2} color="var(--color-forest)" />
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Track Order</h2>
                </div>
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
                              flexShrink: 0,
                              color: done || active ? '#fff' : 'var(--color-text-tertiary)',
                            }}
                          >
                            {done ? <Check size={14} strokeWidth={2.5} /> : active ? <TimelineIcon step={step} size={14} /> : <span style={{ fontSize: 10 }}>●</span>}
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
                    borderRadius: 8,
                    fontSize: 13,
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Calendar size={15} strokeWidth={2} color="var(--color-forest)" />
                  <span>Estimated delivery: <strong>{order.estimatedDelivery}</strong></span>
                </div>
              </div>
            )}

            {/* Cancelled notice */}
            {isCancelled && (
              <div
                style={{
                  background: 'var(--color-error-light)',
                  border: '1px solid var(--color-error)',
                  borderRadius: 10,
                  padding: '14px 18px',
                  marginBottom: 16,
                  fontSize: 14,
                  color: 'var(--color-error)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertCircle size={16} strokeWidth={2} />
                This order has been cancelled.
              </div>
            )}

            {/* Order items */}
            <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Package size={18} strokeWidth={2} color="var(--color-forest)" />
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Items Ordered</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {order.items.map((item) => (
                  <div key={item.product.id} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 8,
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid var(--color-divider)',
                        background: 'var(--color-neutral-50)',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ProductImageResolver.resolveThumbnail(item.product.id, item.product.category)}
                        alt={item.product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.product.title}</p>
                      <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                        {item.product.unit} · Qty: {item.quantity}
                      </p>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <MapPin size={18} strokeWidth={2} color="var(--color-forest)" />
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Delivery Address</h2>
              </div>
              <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 14 }}>{order.address.recipientName}</p>
              <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                {order.address.addressLine}, {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Phone size={12} strokeWidth={2} /> {order.address.phone}
              </p>
            </div>
          </div>

          {/* Right: Bill + Actions */}
          <div>
            {/* Bill summary */}
            <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Receipt size={18} strokeWidth={2} color="var(--color-forest)" />
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Payment Summary</h2>
              </div>
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
                    borderTop: '1px solid var(--color-divider)',
                    fontSize: 17,
                    fontWeight: 800,
                  }}
                >
                  <span>Total Paid</span>
                  <span style={{ color: 'var(--color-forest)' }}>{formatPrice(order.totalAmount)}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
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
                style={{ gap: 8, padding: '12px 20px', fontSize: 14 }}
              >
                <RotateCcw size={15} strokeWidth={2} />
                Reorder
              </button>
              {isActive && (
                <button
                  id="order-cancel-btn"
                  onClick={() => setCancelDialogOpen(true)}
                  className="btn btn-secondary btn-full"
                  style={{ padding: '11px 20px', fontSize: 14, borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                >
                  Cancel Order
                </button>
              )}
              <Link
                href="/orders"
                className="btn btn-ghost btn-full"
                style={{ gap: 6, fontSize: 13 }}
              >
                <ArrowLeft size={14} strokeWidth={2} />
                Back to Orders
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
              borderRadius: 12,
              padding: '24px',
              width: '90%',
              maxWidth: 400,
              zIndex: 101,
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>Cancel Order?</h3>
            <p style={{ margin: '0 0 20px', color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.5 }}>
              Are you sure you want to cancel order {order.id}? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setCancelDialogOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px 16px', fontSize: 14 }}
              >
                Keep Order
              </button>
              <button
                id="order-confirm-cancel-btn"
                onClick={handleCancel}
                disabled={cancelling}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px 16px', fontSize: 14, background: 'var(--color-error)', borderColor: 'var(--color-error)' }}
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
