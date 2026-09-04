'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAdminStore } from '@/features/admin/admin-store';
import { AdminPortalNav } from '@/features/admin/presentation/AdminPortalNav';
import { VerificationStatusBadge } from '@/features/admin/presentation/VerificationStatusBadge';
import { ModerationStatusBadge } from '@/features/admin/presentation/ModerationStatusBadge';
import { DisputeStatusBadge } from '@/features/admin/presentation/DisputeStatusBadge';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertOctagon,
  ShieldAlert,
  Send,
} from 'lucide-react';

export default function SellerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    verifications,
    moderations,
    disputes,
    auditLogs,
    updateSellerVerification,
    addSellerInternalNote,
  } = useAdminStore();

  const [noteInput, setNoteInput] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const seller = verifications.find((v) => v.id === id || v.sellerId === id);

  if (!seller) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas)' }}>
        <AdminPortalNav />
        <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <h2>Seller Verification Record Not Found</h2>
          <p style={{ color: 'var(--color-neutral-500)', marginBottom: '20px' }}>
            No seller verification dossier matches ID: {id}
          </p>
          <Link
            href="/admin/sellers"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: '#0F172A',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Back to Sellers Directory
          </Link>
        </main>
      </div>
    );
  }

  const sellerProducts = moderations.filter((m) => m.sellerId === seller.sellerId);
  const sellerDisputes = disputes.filter((d) => d.sellerId === seller.sellerId);
  const sellerAudits = auditLogs.filter(
    (a) => a.entityType === 'seller' && (a.entityId === seller.id || a.entityId === seller.sellerId)
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addSellerInternalNote(seller.id, noteInput.trim());
    setNoteInput('');
  };

  const handleApprove = () => {
    updateSellerVerification(seller.id, 'verified');
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;
    updateSellerVerification(seller.id, 'rejected', { reason: rejectionReason.trim() });
    setRejecting(false);
    setRejectionReason('');
  };

  const handleSuspend = () => {
    const reason = window.prompt('Provide reason for seller suspension:');
    if (reason) {
      updateSellerVerification(seller.id, 'suspended', { reason });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <AdminPortalNav />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '16px' }}>
          <Link
            href="/admin/sellers"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-neutral-600)',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Sellers List</span>
          </Link>
        </div>

        {/* Header Strip */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--color-slate)' }}>
                {seller.businessName}
              </h1>
              <VerificationStatusBadge status={seller.status} />
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
              Seller ID: <span style={{ fontFamily: 'monospace' }}>{seller.sellerId}</span> • Registered: {new Date(seller.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {seller.status !== 'verified' && (
              <button
                onClick={handleApprove}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--color-forest)',
                  color: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <CheckCircle size={15} />
                <span>Verify Seller</span>
              </button>
            )}

            {seller.status !== 'rejected' && (
              <button
                onClick={() => setRejecting(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FEE2E2',
                  color: '#B91C1C',
                  border: '1px solid #FECACA',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <XCircle size={15} />
                <span>Reject Application</span>
              </button>
            )}

            {seller.status === 'verified' && (
              <button
                onClick={handleSuspend}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#F3F4F6',
                  color: '#374151',
                  border: '1px solid #E5E7EB',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <AlertOctagon size={15} />
                <span>Suspend Account</span>
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Dossier */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Legal Entity & Registration Card */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 16px', color: 'var(--color-slate)' }}>
                Legal Entity & Business Dossier
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-400)', textTransform: 'uppercase' }}>
                    Proprietor / Signatory
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-slate)', marginTop: '2px' }}>
                    {seller.ownerName}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-400)', textTransform: 'uppercase' }}>
                    Entity Constitution
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-slate)', marginTop: '2px', textTransform: 'capitalize' }}>
                    {seller.businessType}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-400)', textTransform: 'uppercase' }}>
                    GST Identification Number
                  </div>
                  <div style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                    {seller.gstNumber}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-400)', textTransform: 'uppercase' }}>
                    APMC / Trade License ID
                  </div>
                  <div style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                    {seller.registrationId || 'Pending physical documentation'}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-400)', textTransform: 'uppercase' }}>
                    Physical Dispatch Facility Address
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-slate)', marginTop: '2px' }}>
                    {seller.address}, {seller.district}, {seller.state}
                  </div>
                </div>
              </div>

              {seller.rejectionReason && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#B91C1C' }}>Rejection Rationale:</div>
                  <div style={{ fontSize: '13px', color: '#991B1B', marginTop: '2px' }}>{seller.rejectionReason}</div>
                </div>
              )}
            </div>

            {/* Catalog Submissions & Moderation */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 16px', color: 'var(--color-slate)' }}>
                Catalog Listings ({sellerProducts.length})
              </h2>

              {sellerProducts.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--color-neutral-500)', padding: '12px 0' }}>
                  No catalog items submitted by this seller yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sellerProducts.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-surface-tint)',
                        background: 'var(--color-canvas)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-slate)' }}>
                          {p.productTitle}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                          Category: {p.category} • Price: ₹{p.price} • Stock: {p.stockQuantity}
                        </div>
                      </div>
                      <ModerationStatusBadge status={p.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dispute Record */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 16px', color: 'var(--color-slate)' }}>
                Farmer Disputes Involving Seller ({sellerDisputes.length})
              </h2>

              {sellerDisputes.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--color-forest)', padding: '12px 0' }}>
                  Clean record — 0 disputes filed against this seller.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sellerDisputes.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-surface-tint)',
                        background: 'var(--color-canvas)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-slate)' }}>
                          {d.orderNumber}: {d.subject}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                          Claimed by: {d.farmerName} • Type: {d.type.replace('_', ' ')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DisputeStatusBadge status={d.status} />
                        <Link
                          href={`/admin/disputes/${d.id}`}
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#0F172A',
                            textDecoration: 'none',
                          }}
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Risk Assessment */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px', color: 'var(--color-slate)' }}>
                Trust & Risk Assessment
              </h2>

              {seller.riskFlags.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-forest)', fontSize: '13px' }}>
                  <CheckCircle size={18} />
                  <span>No active risk flags detected</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {seller.riskFlags.map((flag) => (
                    <div
                      key={flag}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#991B1B',
                        fontWeight: 600,
                      }}
                    >
                      <ShieldAlert size={16} />
                      <span>{flag.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Internal Audit Notes */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px', color: 'var(--color-slate)' }}>
                Internal Compliance Notes
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {seller.internalNotes.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--color-neutral-400)' }}>
                    No internal notes logged yet.
                  </div>
                ) : (
                  seller.internalNotes.map((note, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '4px',
                        background: 'var(--color-canvas)',
                        fontSize: '12px',
                        color: '#334155',
                        borderLeft: '3px solid #0F172A',
                      }}
                    >
                      {note}
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Add compliance note..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-surface-tint)',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Send size={12} />
                </button>
              </form>
            </div>

            {/* Audit History */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px', color: 'var(--color-slate)' }}>
                Audit History
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sellerAudits.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--color-neutral-400)' }}>
                    No audit log entries recorded.
                  </div>
                ) : (
                  sellerAudits.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        fontSize: '11px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid var(--color-surface-tint)',
                      }}
                    >
                      <div style={{ fontWeight: 600, color: 'var(--color-slate)' }}>
                        {a.action.replace('_', ' ')}
                      </div>
                      <div style={{ color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                        By {a.actorName} • {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rejection Modal */}
        {rejecting && (
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
                Reject Seller Application
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
                Specify reason for rejection:
              </p>

              <form onSubmit={handleReject}>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason..."
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
                    onClick={() => setRejecting(false)}
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
