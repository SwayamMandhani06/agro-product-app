'use client';

import React, { useState } from 'react';
import { useMarketplaceStore } from '@/features/marketplace/marketplace-store';
import { SellerPortalNav } from '@/features/marketplace/presentation/SellerPortalNav';
import { Clock, Phone, MapPin, Search } from 'lucide-react';

export default function SellerOrdersPage() {
  const { sellerOrders, updateOrderFulfillment } = useMarketplaceStore();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = sellerOrders.filter((ord) => {
    const matchesFilter = filter === 'all' || ord.fulfillmentStatus === filter;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerVillage.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <SellerPortalNav />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-slate)' }}>
              Order Fulfillment & Dispatch Pipeline
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              Manage packing, dispatch handoff, and rural delivery fulfillment across clusters
            </span>
          </div>

          {/* Quick status tabs */}
          <div style={{ display: 'flex', gap: '6px', background: 'var(--color-surface-subtle)', padding: '4px', borderRadius: '6px' }}>
            {['all', 'pending', 'packed', 'dispatched', 'delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                style={{
                  border: 'none',
                  background: filter === st ? 'var(--color-surface)' : 'transparent',
                  color: filter === st ? 'var(--color-forest)' : 'var(--color-neutral-600)',
                  fontWeight: filter === st ? 600 : 500,
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  boxShadow: filter === st ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Search size={15} color="var(--color-neutral-400)" />
          <input
            type="text"
            placeholder="Search by order number, farmer name, or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '13px',
              width: '100%',
              color: 'var(--color-slate)',
            }}
          />
        </div>

        {/* Orders Table */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-surface-tint)' }}>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Order Details</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Farmer / Customer</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Items</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Value & Payment</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>SLA Window</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Fulfillment Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => {
                  return (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--color-surface-subtle)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-slate)' }}>{ord.orderNumber}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-slate)' }}>{ord.customerName}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                          <MapPin size={11} /> {ord.customerVillage}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-neutral-500)' }}>
                          <Phone size={11} /> {ord.customerPhone}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        {ord.items.map((i, idx) => (
                          <div key={idx} style={{ color: 'var(--color-neutral-700)', lineHeight: 1.4 }}>
                            <strong>{i.quantity}×</strong> {i.productTitle}
                          </div>
                        ))}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-slate)' }}>
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>
                          {ord.paymentMethod}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-forest)', fontWeight: 600 }}>
                          <Clock size={12} /> Within 24h SLA
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-neutral-500)' }}>
                          Deadline: {new Date(ord.dispatchDeadline).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
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
                        {ord.fulfillmentStatus === 'pending' && (
                          <button
                            onClick={() => updateOrderFulfillment(ord.id, 'packed')}
                            style={{
                              border: '1px solid var(--color-surface-tint)',
                              background: 'var(--color-surface)',
                              color: 'var(--color-slate)',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '5px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            Mark Packed
                          </button>
                        )}
                        {ord.fulfillmentStatus === 'packed' && (
                          <button
                            onClick={() => updateOrderFulfillment(ord.id, 'dispatched')}
                            style={{
                              border: 'none',
                              background: 'var(--color-forest)',
                              color: '#FFFFFF',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '5px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            Dispatch Handoff
                          </button>
                        )}
                        {ord.fulfillmentStatus === 'dispatched' && (
                          <button
                            onClick={() => updateOrderFulfillment(ord.id, 'delivered')}
                            style={{
                              border: '1px solid #CEEAD9',
                              background: '#EAF6EF',
                              color: '#01421E',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '5px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            Mark Delivered
                          </button>
                        )}
                        {ord.fulfillmentStatus === 'delivered' && (
                          <span style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
