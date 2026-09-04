'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/features/admin/admin-store';
import { AdminPortalNav } from '@/features/admin/presentation/AdminPortalNav';
import { VerificationStatusBadge } from '@/features/admin/presentation/VerificationStatusBadge';
import { SellerVerificationStatus } from '@/features/admin/domain/governance';
import {
  Search,
  CheckCircle,
  XCircle,
  AlertOctagon,
} from 'lucide-react';

export default function AdminSellersPage() {
  const { verifications, updateSellerVerification } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SellerVerificationStatus>('all');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filtered = verifications.filter((seller) => {
    const matchesSearch =
      seller.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.gstNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || seller.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    updateSellerVerification(id, 'verified');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingId && rejectionReason.trim()) {
      updateSellerVerification(rejectingId, 'rejected', { reason: rejectionReason.trim() });
      setRejectingId(null);
      setRejectionReason('');
    }
  };

  const handleSuspend = (id: string) => {
    const reason = window.prompt('Enter suspension rationale:');
    if (reason) {
      updateSellerVerification(id, 'suspended', { reason });
    }
  };

  const counts = {
    all: verifications.length,
    submitted: verifications.filter((v) => v.status === 'submitted').length,
    under_review: verifications.filter((v) => v.status === 'under_review').length,
    verified: verifications.filter((v) => v.status === 'verified').length,
    rejected: verifications.filter((v) => v.status === 'rejected').length,
    suspended: verifications.filter((v) => v.status === 'suspended').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <AdminPortalNav />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Page Title & Search Strip */}
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
              Seller Verification & Onboarding Governance
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
              Inspect credentials, verify GSTIN and licensing documentation, manage operational status
            </p>
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }}
            />
            <input
              type="text"
              placeholder="Search by name, owner, GSTIN, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '6px',
                border: '1px solid var(--color-surface-tint)',
                background: 'var(--color-surface)',
                fontSize: '13px',
                color: 'var(--color-slate)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {(['all', 'submitted', 'under_review', 'verified', 'rejected', 'suspended'] as const).map((st) => {
            const isActive = statusFilter === st;
            const label = st === 'all' ? 'All Sellers' : st.replace('_', ' ').toUpperCase();
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

        {/* Sellers Table */}
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
                  Business & Owner
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Legal Identifiers
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Region
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Risk & Notes
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
                    No seller records found matching the specified criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((seller) => (
                  <tr
                    key={seller.id}
                    style={{
                      borderBottom: '1px solid var(--color-surface-tint)',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {/* Business & Owner */}
                    <td style={{ padding: '14px 16px' }}>
                      <Link
                        href={`/admin/sellers/${seller.id}`}
                        style={{
                          fontWeight: 700,
                          color: '#0F172A',
                          textDecoration: 'none',
                          display: 'block',
                        }}
                      >
                        {seller.businessName}
                      </Link>
                      <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                        {seller.ownerName} • <span style={{ textTransform: 'capitalize' }}>{seller.businessType}</span>
                      </div>
                    </td>

                    {/* Identifiers */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-slate)' }}>
                        {seller.gstNumber}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '2px' }}>
                        {seller.registrationId || 'N/A'}
                      </div>
                    </td>

                    {/* Region */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ color: 'var(--color-slate)' }}>{seller.district}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>{seller.state}</div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <VerificationStatusBadge status={seller.status} />
                      {seller.rejectionReason && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#DC2626',
                            marginTop: '4px',
                            maxWidth: '180px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={seller.rejectionReason}
                        >
                          {seller.rejectionReason}
                        </div>
                      )}
                    </td>

                    {/* Risk & Notes */}
                    <td style={{ padding: '14px 16px' }}>
                      {seller.riskFlags.length > 0 ? (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {seller.riskFlags.map((rf) => (
                            <span
                              key={rf}
                              style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                background: '#FEF2F2',
                                color: '#DC2626',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {rf.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)' }}>None</span>
                      )}
                      {seller.internalNotes.length > 0 && (
                        <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
                          {seller.internalNotes.length} audit note{seller.internalNotes.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }}>
                        {seller.status !== 'verified' && (
                          <button
                            onClick={() => handleApprove(seller.id)}
                            title="Verify seller"
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
                            <span>Verify</span>
                          </button>
                        )}

                        {seller.status !== 'rejected' && (
                          <button
                            onClick={() => setRejectingId(seller.id)}
                            title="Reject seller"
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

                        {seller.status === 'verified' && (
                          <button
                            onClick={() => handleSuspend(seller.id)}
                            title="Suspend seller"
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
                            <AlertOctagon size={12} />
                            <span>Suspend</span>
                          </button>
                        )}

                        <Link
                          href={`/admin/sellers/${seller.id}`}
                          style={{
                            color: 'var(--color-neutral-600)',
                            padding: '5px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--color-surface-tint)',
                            fontSize: '11px',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          Details
                        </Link>
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
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: 'var(--color-slate)' }}>
                Reject Seller Verification
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
                Please specify the compliance failure or documentation issue. This will be recorded in the audit trail and sent to the applicant.
              </p>

              <form onSubmit={handleRejectSubmit}>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Expired pesticide license; physical address does not match APMC certificate..."
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
