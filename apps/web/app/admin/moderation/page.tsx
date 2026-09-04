'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/features/admin/admin-store';
import { AdminPortalNav } from '@/features/admin/presentation/AdminPortalNav';
import { ModerationStatusBadge } from '@/features/admin/presentation/ModerationStatusBadge';
import { ProductModerationStatus } from '@/features/admin/domain/governance';
import {
  Search,
  CheckCircle,
  XCircle,
  Archive,
} from 'lucide-react';

export default function AdminModerationPage() {
  const { moderations, updateProductModeration } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductModerationStatus>('all');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filtered = moderations.filter((item) => {
    const matchesSearch =
      item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    updateProductModeration(id, 'approved');
  };

  const handleArchive = (id: string) => {
    updateProductModeration(id, 'archived');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingId && rejectionReason.trim()) {
      updateProductModeration(rejectingId, 'rejected', { reason: rejectionReason.trim() });
      setRejectingId(null);
      setRejectionReason('');
    }
  };

  const counts = {
    all: moderations.length,
    pending_review: moderations.filter((m) => m.status === 'pending_review').length,
    approved: moderations.filter((m) => m.status === 'approved').length,
    rejected: moderations.filter((m) => m.status === 'rejected').length,
    archived: moderations.filter((m) => m.status === 'archived').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <AdminPortalNav />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--color-slate)' }}>
              Product Catalog Quality & Regulatory Moderation
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
              Review product specifications, label claims, pricing compliance, and pesticide/fertilizer safety documentation
            </p>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }}
            />
            <input
              type="text"
              placeholder="Search product, seller, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '6px',
                border: '1px solid var(--color-surface-tint)',
                background: 'var(--color-surface)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {(['all', 'pending_review', 'approved', 'rejected', 'archived'] as const).map((st) => {
            const isActive = statusFilter === st;
            const label = st === 'all' ? 'All Items' : st.replace('_', ' ').toUpperCase();
            const count = counts[st];

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? '#0F172A' : 'var(--color-surface)',
                  color: isActive ? '#FFFFFF' : 'var(--color-neutral-600)',
                  border: '1px solid',
                  borderColor: isActive ? '#0F172A' : 'var(--color-surface-tint)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{label}</span>
                <span
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-surface-tint)',
                    color: isActive ? '#FFFFFF' : 'var(--color-neutral-600)',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '11px',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Moderation Table */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--color-canvas)', borderBottom: '1px solid var(--color-surface-tint)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Product & Category
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Seller
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Pricing & Inventory
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Submitted
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-neutral-500)' }}>
                    No products found in the moderation queue matching filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-surface-tint)' }}>
                    {/* Product & Category */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-slate)' }}>{item.productTitle}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                        Category: <span style={{ fontWeight: 500, color: '#0F172A' }}>{item.category}</span> • ID: {item.productId}
                      </div>
                    </td>

                    {/* Seller */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-slate)' }}>{item.sellerName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '2px' }}>
                        {item.sellerId}
                      </div>
                    </td>

                    {/* Pricing */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-slate)' }}>₹{item.price.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '2px' }}>
                        MRP: ₹{item.mrp.toLocaleString('en-IN')} • Stock: {item.stockQuantity}
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <ModerationStatusBadge status={item.status} />
                      {item.rejectionReason && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#DC2626',
                            marginTop: '4px',
                            maxWidth: '220px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={item.rejectionReason}
                        >
                          {item.rejectionReason}
                        </div>
                      )}
                    </td>

                    {/* Submitted */}
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }}>
                        {item.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(item.id)}
                            title="Approve product listing"
                            style={{
                              background: '#EAF6EF',
                              border: '1px solid #BBF7D0',
                              color: '#15803D',
                              padding: '5px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <CheckCircle size={12} />
                            <span>Approve</span>
                          </button>
                        )}

                        {item.status !== 'rejected' && (
                          <button
                            onClick={() => setRejectingId(item.id)}
                            title="Reject listing"
                            style={{
                              background: '#FEE2E2',
                              border: '1px solid #FECACA',
                              color: '#B91C1C',
                              padding: '5px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <XCircle size={12} />
                            <span>Reject</span>
                          </button>
                        )}

                        {item.status === 'approved' && (
                          <button
                            onClick={() => handleArchive(item.id)}
                            title="Archive listing"
                            style={{
                              background: '#F3F4F6',
                              border: '1px solid #E5E7EB',
                              color: '#374151',
                              padding: '5px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Archive size={12} />
                            <span>Archive</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rejection Modal */}
        {rejectingId && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
            }}
          >
            <div
              style={{
                background: 'var(--color-surface)',
                borderRadius: '8px',
                padding: '24px',
                maxWidth: '480px',
                width: '90%',
              }}
            >
              <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: 'var(--color-slate)' }}>
                Reject Product Listing
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
                Specify compliance deficiency (e.g. missing CIB&RC license, prohibited active ingredient, incorrect MRP declaration):
              </p>

              <form onSubmit={handleRejectSubmit}>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-surface-tint)',
                    background: 'var(--color-canvas)',
                    fontSize: '13px',
                    outline: 'none',
                    marginBottom: '16px',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setRejectingId(null)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-surface-tint)',
                      background: 'transparent',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#DC2626',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
