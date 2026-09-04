'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAdminStore } from '@/features/admin/admin-store';
import { AdminPortalNav } from '@/features/admin/presentation/AdminPortalNav';
import { DisputeStatusBadge } from '@/features/admin/presentation/DisputeStatusBadge';
import { DISPUTE_TYPE_LABELS, DisputeStatus } from '@/features/admin/domain/governance';
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  User,
  Building2,
} from 'lucide-react';

export default function DisputeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    disputes,
    updateDisputeStatus,
    addDisputeMessage,
    auditLogs,
  } = useAdminStore();

  const [messageText, setMessageText] = useState('');
  const [resolutionText, setResolutionText] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const dispute = disputes.find((d) => d.id === id);

  if (!dispute) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas)' }}>
        <AdminPortalNav />
        <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <h2>Dispute Not Found</h2>
          <p style={{ color: 'var(--color-neutral-500)', marginBottom: '20px' }}>
            No dispute record found matching ID: {id}
          </p>
          <Link
            href="/admin/disputes"
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
            Back to Disputes Desk
          </Link>
        </main>
      </div>
    );
  }

  const disputeAudits = auditLogs.filter(
    (a) => a.entityType === 'dispute' && (a.entityId === dispute.id || a.entityId === dispute.orderId)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    addDisputeMessage(
      dispute.id,
      messageText.trim(),
      'usr_admin_demo',
      'Platform Admin',
      'admin'
    );
    setMessageText('');
  };

  const handleStatusChange = (newStatus: DisputeStatus) => {
    updateDisputeStatus(dispute.id, newStatus);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionText.trim()) return;

    updateDisputeStatus(dispute.id, 'resolved', { resolution: resolutionText.trim() });
    setIsResolving(false);
    setResolutionText('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <AdminPortalNav />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '16px' }}>
          <Link
            href="/admin/disputes"
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
            <span>Back to Disputes Queue</span>
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
              <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--color-slate)' }}>
                {dispute.subject}
              </h1>
              <DisputeStatusBadge status={dispute.status} />
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
              Order Reference: <strong style={{ color: 'var(--color-slate)' }}>{dispute.orderNumber}</strong> • Claim Type:{' '}
              {DISPUTE_TYPE_LABELS[dispute.type]} • Opened: {new Date(dispute.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Quick Lifecycle Progression Actions */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {dispute.status === 'open' && (
              <button
                onClick={() => handleStatusChange('under_review')}
                style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: '#1D4ED8',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Mark Under Review
              </button>
            )}

            {dispute.status === 'under_review' && (
              <button
                onClick={() => handleStatusChange('awaiting_user')}
                style={{
                  background: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  color: '#B45309',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Await User Response
              </button>
            )}

            {(dispute.status === 'under_review' || dispute.status === 'awaiting_user') && (
              <button
                onClick={() => setIsResolving(true)}
                style={{
                  background: 'var(--color-forest)',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={14} />
                <span>Resolve Dispute</span>
              </button>
            )}

            {dispute.status === 'resolved' && (
              <button
                onClick={() => handleStatusChange('closed')}
                style={{
                  background: '#0F172A',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close Dispute
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Mediation Screen */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column: Claim description & Message timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Dispute Details */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 10px', color: 'var(--color-slate)' }}>
                Farmer Claim Description
              </h2>
              <div
                style={{
                  padding: '14px 16px',
                  background: 'var(--color-canvas)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#334155',
                  lineHeight: 1.6,
                }}
              >
                {dispute.description}
              </div>
            </div>

            {/* Message Timeline */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 16px', color: 'var(--color-slate)' }}>
                Dispute Timeline & Communication History ({dispute.messages.length})
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {dispute.messages.map((msg) => {
                  const isAdmin = msg.authorRole === 'admin';
                  const isFarmer = msg.authorRole === 'farmer';

                  return (
                    <div
                      key={msg.id}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '6px',
                        background: isAdmin ? '#F8FAFC' : isFarmer ? '#EFF6FF' : '#FEF3C7',
                        borderLeft: `4px solid ${isAdmin ? '#0F172A' : isFarmer ? '#2563EB' : '#D97706'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-slate)' }}>
                            {msg.authorName}
                          </span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: isAdmin ? '#0F172A' : isFarmer ? '#2563EB' : '#D97706',
                              color: '#FFFFFF',
                            }}
                          >
                            {msg.authorRole}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)' }}>
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#1E293B', marginTop: '4px', lineHeight: 1.5 }}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <textarea
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Post administrative ruling, instruction, or notice to parties..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-surface-tint)',
                    background: 'var(--color-canvas)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#0F172A',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Send size={13} />
                    <span>Send Notice</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Case meta & Resolution */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Resolution Status Card */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px', color: 'var(--color-slate)' }}>
                Resolution Outcome
              </h2>

              {dispute.resolution ? (
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '6px',
                    background: '#EAF6EF',
                    border: '1px solid #BBF7D0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803D', fontWeight: 700, fontSize: '13px' }}>
                    <CheckCircle2 size={16} />
                    <span>Case Resolved</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#14532D', marginTop: '6px', lineHeight: 1.5 }}>
                    {dispute.resolution}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                  This dispute is currently active and pending final determination.
                </div>
              )}
            </div>

            {/* Dispute Parties Info */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 14px', color: 'var(--color-slate)' }}>
                Claim Parties
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '10px 12px', borderRadius: '6px', background: 'var(--color-canvas)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                    <User size={13} />
                    <span>Claimant (Buyer)</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-slate)', marginTop: '2px' }}>
                    {dispute.farmerName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)' }}>
                    ID: {dispute.farmerId}
                  </div>
                </div>

                <div style={{ padding: '10px 12px', borderRadius: '6px', background: 'var(--color-canvas)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                    <Building2 size={13} />
                    <span>Respondent (Seller)</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-slate)', marginTop: '2px' }}>
                    {dispute.sellerName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)' }}>
                    ID: {dispute.sellerId}
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Trail for this case */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px', color: 'var(--color-slate)' }}>
                Case Audit Trail
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {disputeAudits.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--color-neutral-400)' }}>
                    No audit records logged for this dispute yet.
                  </div>
                ) : (
                  disputeAudits.map((a) => (
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

        {/* Resolution Modal */}
        {isResolving && (
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
                Submit Dispute Resolution
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
                Detail the final binding ruling (e.g. refund amount, replacement shipment dispatch, seller penalty):
              </p>

              <form onSubmit={handleResolveSubmit}>
                <textarea
                  required
                  rows={4}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="e.g. 100% transit damage credit authorized to buyer wallet. Seller cautioned on carrier packaging."
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
                    onClick={() => setIsResolving(false)}
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
                      background: 'var(--color-forest)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Authorize & Finalize
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
