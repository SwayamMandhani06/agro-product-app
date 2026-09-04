'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAdminStore } from '@/features/admin/admin-store';
import { DisputeStatusBadge } from '@/features/admin/presentation/DisputeStatusBadge';
import { DISPUTE_TYPE_LABELS } from '@/features/admin/domain/governance';
import {
  ArrowLeft,
  Send,
  CheckCircle2,
} from 'lucide-react';

export default function SupportDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { disputes, addDisputeMessage } = useAdminStore();
  const [replyText, setReplyText] = useState('');

  const dispute = disputes.find((d) => d.id === id);

  if (!dispute) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', padding: '40px 24px', textAlign: 'center' }}>
        <h2>Support Case Not Found</h2>
        <p style={{ color: 'var(--color-neutral-500)', marginBottom: '20px' }}>
          No support claim found for reference ID: {id}
        </p>
        <Link
          href="/support"
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            background: 'var(--color-forest)',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          Back to Support Desk
        </Link>
      </div>
    );
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addDisputeMessage(
      dispute.id,
      replyText.trim(),
      dispute.farmerId,
      dispute.farmerName,
      'farmer'
    );
    setReplyText('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      {/* Top Header */}
      <header
        style={{
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-surface-tint)',
          marginBottom: '24px',
          padding: '16px 24px',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            href="/support"
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
            <span>Back to Support Desk</span>
          </Link>

          <Link
            href="/admin/dashboard"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#38BDF8',
              padding: '6px 12px',
              borderRadius: '6px',
              background: '#0F172A',
              textDecoration: 'none',
            }}
          >
            Admin View
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        {/* Case Summary Card */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            padding: '20px 24px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--color-slate)' }}>
                  {dispute.subject}
                </h1>
                <DisputeStatusBadge status={dispute.status} />
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
                Order Reference: <strong>{dispute.orderNumber}</strong> • Seller: {dispute.sellerName} • Type:{' '}
                {DISPUTE_TYPE_LABELS[dispute.type]}
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--color-neutral-400)' }}>
              Case ID: {dispute.id}
            </div>
          </div>

          <div
            style={{
              marginTop: '16px',
              padding: '14px 16px',
              background: 'var(--color-canvas)',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#334155',
              lineHeight: 1.6,
            }}
          >
            <strong>Original Claim: </strong>
            {dispute.description}
          </div>

          {dispute.resolution && (
            <div
              style={{
                marginTop: '14px',
                padding: '14px',
                borderRadius: '6px',
                background: '#EAF6EF',
                border: '1px solid #BBF7D0',
                fontSize: '13px',
                color: '#15803D',
              }}
            >
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} />
                <span>Binding Administrator Ruling:</span>
              </div>
              <div style={{ marginTop: '4px', color: '#166534' }}>{dispute.resolution}</div>
            </div>
          )}
        </div>

        {/* Message Timeline */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 16px', color: 'var(--color-slate)' }}>
            Case Communication Log ({dispute.messages.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {dispute.messages.map((msg) => {
              const isAdmin = msg.authorRole === 'admin';
              const isMe = msg.authorRole === 'farmer';

              return (
                <div
                  key={msg.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '6px',
                    background: isAdmin ? '#F8FAFC' : isMe ? '#EFF6FF' : '#FEF3C7',
                    borderLeft: `4px solid ${isAdmin ? '#0F172A' : isMe ? '#2563EB' : '#D97706'}`,
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
                          background: isAdmin ? '#0F172A' : isMe ? '#2563EB' : '#D97706',
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

          {/* Reply Form */}
          {dispute.status !== 'closed' && (
            <form onSubmit={handleSendReply} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Provide additional details or response to administrator/seller..."
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
                  <Send size={13} />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
