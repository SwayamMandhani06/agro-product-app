'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useOrdersStore } from '@/features/orders/store';
import { ProductImageResolver } from '@/lib/product-image-resolver';
import { useCartStore } from '@/features/cart/store';
import { useLogisticsStore } from '@/features/logistics/logistics-store';
import { RouteCorridorVisualizer } from '@/features/logistics/presentation/RouteCorridorVisualizer';
import {
  SHIPMENT_STATUS_LABELS,
  SHIPMENT_STATUS_COLORS,
} from '@/features/logistics/domain/shipment';
import {
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from '@/types';

import {
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  AlertCircle,
  MapPin,
  Phone,
  Receipt,
  RotateCcw,
  Check,
  ShieldCheck,
  Sliders,
  ChevronRight,
} from 'lucide-react';

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  placed: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
  confirmed: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
  processing: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  packed: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
  shipped: { bg: 'var(--color-amber-50)', color: 'var(--color-amber-600)' },
  outForDelivery: { bg: 'var(--color-amber-50)', color: 'var(--color-amber-600)' },
  out_for_delivery: { bg: 'var(--color-amber-50)', color: 'var(--color-amber-600)' },
  delivered: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  cancelled: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
  refund_requested: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  refund_processing: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  refunded: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  disputed: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, cancelOrder } = useOrdersStore();
  const {
    getShipmentByOrderId,
    createShipmentForOrder,
    advanceMilestone,
    simulateException,
    recordDeliveryAttempt,
    completeDelivery,
  } = useLogisticsStore();
  const { addItem } = useCartStore();
  const router = useRouter();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showDemoControls, setShowDemoControls] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const order = getOrderById(id);
  const shipment = order ? getShipmentByOrderId(order.id) : undefined;

  // Automatically initialize shipment if not yet created for this order
  useEffect(() => {
    if (order && !shipment) {
      createShipmentForOrder(order);
    }
  }, [order, shipment, createShipmentForOrder]);

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
  const isCancelled = order.status === 'cancelled';
  const isActive = ['placed', 'confirmed', 'processing', 'shipped', 'outForDelivery'].includes(order.status);

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

  // Demo actions
  const handleAdvance = async () => {
    if (!shipment) return;
    setActionLoading(true);
    await advanceMilestone(shipment.id);
    setActionLoading(false);
  };

  const handleSimulateDelay = async () => {
    if (!shipment) return;
    setActionLoading(true);
    await simulateException(shipment.id, 'weather_delay');
    setActionLoading(false);
  };

  const handleRecordAttempt = async () => {
    if (!shipment) return;
    setActionLoading(true);
    await recordDeliveryAttempt(shipment.id, 'customer_unavailable');
    setActionLoading(false);
  };

  const handleCompleteDelivery = async () => {
    if (!shipment) return;
    setActionLoading(true);
    await completeDelivery(shipment.id);
    setActionLoading(false);
  };

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* Breadcrumb navigation */}
        <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/orders" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}>My Orders</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{order.id}</span>
          {shipment && (
            <>
              <span>·</span>
              <Link href="/shipments" style={{ color: 'var(--color-forest)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                Logistics Operations <ChevronRight size={13} />
              </Link>
            </>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="order-detail-layout">
          <div>
            {/* 1. OPERATIONAL ORDER & SHIPMENT HEADER */}
            <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)' }}>
                      Order #{order.id}
                    </h1>
                    {shipment && (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--color-forest)',
                          background: 'var(--color-brand-50)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          border: '1px solid var(--color-brand-200)',
                        }}
                      >
                        Shipment #{shipment.id}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                    Booked on {formatDate(order.createdAt)} · Carrier: {shipment?.provider === 'delhivery_rural' ? 'Delhivery Rural Express' : 'AgriTrade Rural Express'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.2px',
                      background: shipment ? SHIPMENT_STATUS_COLORS[shipment.status]?.bg || statusStyle.bg : statusStyle.bg,
                      color: shipment ? SHIPMENT_STATUS_COLORS[shipment.status]?.color || statusStyle.color : statusStyle.color,
                    }}
                  >
                    {shipment ? SHIPMENT_STATUS_LABELS[shipment.status] : ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--color-text-secondary)', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--color-divider)', paddingTop: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CreditCard size={14} strokeWidth={2} />
                  {order.paymentMethod}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Package size={14} strokeWidth={2} />
                  {order.items.length} product item{order.items.length !== 1 ? 's' : ''}
                </span>
                {shipment && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-forest)' }}>
                    <Truck size={14} strokeWidth={2} />
                    Waybill: {shipment.trackingNumber}
                  </span>
                )}
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 800, marginLeft: 'auto', fontSize: 15 }}>
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* 2. STRUCTURED SPLIT-PANEL SHIPMENT TRACKING & INTELLIGENCE */}
            {!isCancelled && shipment && (
              <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Truck size={18} strokeWidth={2} color="var(--color-forest)" />
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Logistics & Rural Shipment Operations</h2>
                  </div>

                  {/* Dev/Demo Controls Toggle */}
                  <button
                    onClick={() => setShowDemoControls(!showDemoControls)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 10px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      background: showDemoControls ? 'var(--color-forest)' : 'var(--color-canvas)',
                      color: showDemoControls ? '#fff' : 'var(--color-forest)',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer',
                    }}
                  >
                    <Sliders size={13} />
                    {showDemoControls ? 'Hide Demo Controls' : 'Demo Operations'}
                  </button>
                </div>

                {/* Demo Logistics Operations Toolbar */}
                {showDemoControls && (
                  <div
                    style={{
                      background: 'var(--color-brand-50)',
                      border: '1px dashed var(--color-forest)',
                      borderRadius: 8,
                      padding: '12px 14px',
                      marginBottom: 20,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-forest)' }}>
                        Interactive Demo Logistics Controls (Free Tier / No Courier API Required)
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Updates sync to real-time</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        onClick={handleAdvance}
                        disabled={actionLoading || shipment.status === 'delivered'}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '5px 10px',
                          borderRadius: 4,
                          background: '#fff',
                          border: '1px solid var(--color-border)',
                          cursor: 'pointer',
                          color: 'var(--color-forest)',
                        }}
                      >
                        Advance Milestone →
                      </button>
                      <button
                        onClick={handleSimulateDelay}
                        disabled={actionLoading || shipment.status === 'delivered'}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '5px 10px',
                          borderRadius: 4,
                          background: '#fff',
                          border: '1px solid var(--color-border)',
                          cursor: 'pointer',
                          color: 'var(--color-warning)',
                        }}
                      >
                        Simulate Weather Delay
                      </button>
                      <button
                        onClick={handleRecordAttempt}
                        disabled={actionLoading || shipment.status === 'delivered'}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '5px 10px',
                          borderRadius: 4,
                          background: '#fff',
                          border: '1px solid var(--color-border)',
                          cursor: 'pointer',
                          color: 'var(--color-amber-600)',
                        }}
                      >
                        Simulate Delivery Attempt
                      </button>
                      <button
                        onClick={handleCompleteDelivery}
                        disabled={actionLoading || shipment.status === 'delivered'}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '5px 10px',
                          borderRadius: 4,
                          background: 'var(--color-forest)',
                          border: '1px solid var(--color-forest)',
                          cursor: 'pointer',
                          color: '#fff',
                        }}
                      >
                        Mark Delivered ✓
                      </button>
                    </div>
                  </div>
                )}

                {/* Split Panel: Left = Shipment Timeline, Right = Delivery Intelligence */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="shipment-split-panel">
                  {/* LEFT: Granular Shipment Timeline */}
                  <div>
                    <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--color-text-tertiary)' }}>
                      Shipment Milestones
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {shipment.events.map((evt, idx) => {
                        const isLatest = idx === shipment.events.length - 1;
                        return (
                          <div key={evt.id} style={{ display: 'flex', gap: 14, paddingBottom: isLatest ? 0 : 20 }}>
                            {/* Node & vertical track line */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24 }}>
                              <div
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  background: isLatest ? 'var(--color-amber)' : 'var(--color-forest)',
                                  border: `2px solid ${isLatest ? 'var(--color-amber-600)' : 'var(--color-forest)'}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  color: '#fff',
                                  boxShadow: isLatest ? '0 0 0 4px rgba(217, 119, 6, 0.2)' : 'none',
                                }}
                              >
                                {isLatest ? (
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                                ) : (
                                  <Check size={12} strokeWidth={3} />
                                )}
                              </div>
                              {!isLatest && (
                                <div style={{ width: 2, flex: 1, background: 'var(--color-forest)', marginTop: 2 }} />
                              )}
                            </div>

                            {/* Event details */}
                            <div style={{ flex: 1, paddingBottom: 2 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 }}>
                                <span style={{ fontSize: 13.5, fontWeight: isLatest ? 700 : 600, color: isLatest ? 'var(--color-amber-700)' : 'var(--color-text-primary)' }}>
                                  {SHIPMENT_STATUS_LABELS[evt.status] || evt.status}
                                </span>
                                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                                  {formatDate(evt.eventTime)}
                                </span>
                              </div>
                              <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 500, color: 'var(--color-forest)' }}>
                                {evt.location}
                              </p>
                              <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                                {evt.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT: Rural Delivery Intelligence */}
                  <div
                    style={{
                      background: 'var(--color-canvas)',
                      borderRadius: 10,
                      padding: '16px',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14,
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--color-text-tertiary)' }}>
                      Delivery Intelligence
                    </h3>

                    {/* ETA Window */}
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Estimated Delivery Window
                      </span>
                      <p style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 800, color: 'var(--color-forest)' }}>
                        {new Date(shipment.estimatedDeliveryStart).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} –{' '}
                        {new Date(shipment.estimatedDeliveryEnd).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Service Zone & Distance */}
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Service Zone & Line-haul
                      </span>
                      <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {shipment.serviceZone} ({shipment.distanceBand})
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <ShieldCheck size={14} color="var(--color-forest)" />
                        <span style={{ fontSize: 11.5, color: 'var(--color-forest)', fontWeight: 600 }}>
                          96% Rural First-Attempt Dispatch Reliability
                        </span>
                      </div>
                    </div>

                    {/* Current Hub */}
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Current Sorting Location
                      </span>
                      <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {shipment.currentLocation}
                      </p>
                    </div>

                    {/* Delivery Agent Card */}
                    {shipment.deliveryAgent && (
                      <div
                        style={{
                          background: '#fff',
                          border: '1px solid var(--color-border)',
                          borderRadius: 8,
                          padding: '12px',
                          marginTop: 'auto',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                            Designated Courier Agent
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-forest)' }}>
                            ★ {shipment.deliveryAgent.rating}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 2px', fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          {shipment.deliveryAgent.name}
                        </p>
                        <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                          {shipment.deliveryAgent.vehicleType} · {shipment.deliveryAgent.vehicleNumber}
                        </p>
                        <a
                          href={`tel:${shipment.deliveryAgent.phone}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--color-forest)',
                            textDecoration: 'none',
                          }}
                        >
                          <Phone size={12} /> Call Agent ({shipment.deliveryAgent.phone})
                        </a>
                      </div>
                    )}

                    {/* Delivery Attempt Notification Alert */}
                    {shipment.status === 'deliveryAttempted' && shipment.attempts.length > 0 && (
                      <div
                        style={{
                          background: 'var(--color-warning-light)',
                          border: '1px solid var(--color-warning)',
                          borderRadius: 8,
                          padding: '10px 12px',
                          fontSize: 12,
                          color: 'var(--color-warning)',
                        }}
                      >
                        <strong>Delivery Issue:</strong> {shipment.attempts[shipment.attempts.length - 1].notes || 'Address verification pending. Carrier re-attempt scheduled for next morning.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. TOPOLOGICAL ROUTE CORRIDOR VISUALIZATION */}
            {!isCancelled && shipment && (
              <div style={{ marginBottom: 16 }}>
                <RouteCorridorVisualizer shipment={shipment} />
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

            {/* 4. SHIPMENT ITEMS */}
            <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Package size={18} strokeWidth={2} color="var(--color-forest)" />
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Items Ordered & Consignment Lots</h2>
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

            {/* 5. DELIVERY ADDRESS */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <MapPin size={18} strokeWidth={2} color="var(--color-forest)" />
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Registered Farm Delivery Address</h2>
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

          {/* RIGHT COLUMN: BILL SUMMARY & ACTIONS */}
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
          .shipment-split-panel {
            grid-template-columns: 1.4fr 1fr !important;
          }
        }
      `}</style>
    </AppShell>
  );
}
