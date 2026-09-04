'use client';

import React from 'react';
import Link from 'next/link';
import { useMarketplaceStore } from '@/features/marketplace/marketplace-store';
import { SellerPortalNav } from '@/features/marketplace/presentation/SellerPortalNav';
import { RevenueTrendChart } from '@/features/marketplace/presentation/RevenueTrendChart';
import { InventoryStatusBadge } from '@/features/marketplace/presentation/InventoryStatusBadge';
import { computeStockHealth } from '@/features/marketplace/domain/inventory';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export default function SellerDashboardPage() {
  const { sellerProfiles, activeSellerId, inventory, sellerOrders, updateOrderFulfillment } = useMarketplaceStore();
  const seller = sellerProfiles.find((s) => s.id === activeSellerId) || sellerProfiles[0];

  const lowStockItems = inventory.filter((i) => i.stockQuantity <= i.reorderLevel);
  const activeOrders = sellerOrders.filter((o) => o.fulfillmentStatus !== 'delivered' && o.fulfillmentStatus !== 'cancelled');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <SellerPortalNav />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* KPI Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* Revenue */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                Total Gross Revenue
              </span>
              <span style={{ color: 'var(--color-forest)', background: '#EAF6EF', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                +14.2% MoM
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '8px' }}>
              ₹{seller?.metrics?.totalRevenue.toLocaleString('en-IN') ?? '4,86,250'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              Today: ₹84,600 (21 dispatches)
            </div>
          </div>

          {/* Active Orders */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                Fulfillment Queue
              </span>
              <span style={{ color: '#92400E', background: '#FEF3C7', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                {activeOrders.length} Pending
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '8px' }}>
              {activeOrders.length} Orders
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              Avg dispatch SLA: 18.4 hrs (24h Target)
            </div>
          </div>

          {/* Inventory Health */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                Inventory Status
              </span>
              <span style={{ color: lowStockItems.length > 0 ? '#991B1B' : '#01421E', background: lowStockItems.length > 0 ? '#FEE2E2' : '#EAF6EF', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                {lowStockItems.length} Low Stock
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '8px' }}>
              {inventory.length} Active SKUs
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              {inventory.reduce((acc, i) => acc + i.stockQuantity, 0)} Units in Baramati depot
            </div>
          </div>

          {/* Available Payout */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                Settlement Balance
              </span>
              <Link
                href="/seller/payouts"
                style={{ color: 'var(--color-forest)', fontSize: '11px', fontWeight: 600, textDecoration: 'none' }}
              >
                Ledger →
              </Link>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-forest)', marginTop: '8px' }}>
              ₹{seller?.metrics?.availableBalance.toLocaleString('en-IN') ?? '82,400'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              Pending processing: ₹{seller?.metrics?.pendingPayoutAmount.toLocaleString('en-IN') ?? '42,500'}
            </div>
          </div>
        </div>

        {/* Chart + Low Stock Alert Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <RevenueTrendChart />

          {/* Low Stock Attention Panel */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <AlertTriangle size={18} color="#D97706" />
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-slate)' }}>
                  Restock Recommendations
                </h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-neutral-600)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                {lowStockItems.length > 0
                  ? `${lowStockItems.length} SKU items are below configured safety reorder thresholds.`
                  : 'All inventory items are currently above target buffer capacity.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid var(--color-surface-tint)',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      background: 'var(--color-surface-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-slate)' }}>
                        {item.sku}
                      </span>
                      <InventoryStatusBadge stockHealth={computeStockHealth(item)} stockQuantity={item.stockQuantity} reorderLevel={item.reorderLevel} />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-neutral-600)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.productTitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/seller/inventory"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '16px',
                background: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-surface-tint)',
                color: 'var(--color-forest)',
                fontSize: '12px',
                fontWeight: 600,
                padding: '8px 14px',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              Manage Warehouse Stock <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* High-density Recent Orders Table */}
        <section
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-surface-tint)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--color-slate)' }}>
                Incoming Orders & Fulfillment Queue
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                Live dispatch queue synced across rural distribution hubs
              </span>
            </div>
            <Link
              href="/seller/orders"
              style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-forest)', textDecoration: 'none' }}
            >
              View All Orders →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-surface-tint)' }}>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Order</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Customer</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Item Details</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Fulfillment Action</th>
                </tr>
              </thead>
              <tbody>
                {sellerOrders.map((ord) => {
                  const isPending = ord.fulfillmentStatus === 'pending';
                  const isPacked = ord.fulfillmentStatus === 'packed';
                  const isDispatched = ord.fulfillmentStatus === 'dispatched';

                  return (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--color-surface-subtle)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-slate)' }}>
                        <div>{ord.orderNumber}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)', fontWeight: 400 }}>
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 500, color: 'var(--color-slate)' }}>{ord.customerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>{ord.customerVillage}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--color-neutral-700)' }}>
                        {ord.items.map((i, idx) => (
                          <div key={idx}>
                            {i.quantity}× {i.productTitle}
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-slate)' }}>
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>{ord.paymentMethod}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background:
                              ord.fulfillmentStatus === 'delivered'
                                ? '#EAF6EF'
                                : ord.fulfillmentStatus === 'dispatched'
                                ? '#EFF6FF'
                                : ord.fulfillmentStatus === 'packed'
                                ? '#FEF3C7'
                                : '#FFF1F2',
                            color:
                              ord.fulfillmentStatus === 'delivered'
                                ? '#01421E'
                                : ord.fulfillmentStatus === 'dispatched'
                                ? '#1E40AF'
                                : ord.fulfillmentStatus === 'packed'
                                ? '#92400E'
                                : '#9F1239',
                            textTransform: 'uppercase',
                          }}
                        >
                          {ord.fulfillmentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {isPending && (
                          <button
                            onClick={() => updateOrderFulfillment(ord.id, 'packed')}
                            style={{
                              border: '1px solid var(--color-surface-tint)',
                              background: 'var(--color-surface)',
                              color: 'var(--color-slate)',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '5px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            Mark Packed
                          </button>
                        )}
                        {isPacked && (
                          <button
                            onClick={() => updateOrderFulfillment(ord.id, 'dispatched')}
                            style={{
                              border: 'none',
                              background: 'var(--color-forest)',
                              color: '#FFFFFF',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '5px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            Dispatch Order
                          </button>
                        )}
                        {isDispatched && (
                          <button
                            onClick={() => updateOrderFulfillment(ord.id, 'delivered')}
                            style={{
                              border: '1px solid #CEEAD9',
                              background: '#EAF6EF',
                              color: '#01421E',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '5px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            Mark Delivered
                          </button>
                        )}
                        {ord.fulfillmentStatus === 'delivered' && (
                          <span style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>
                            Fulfillment Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
