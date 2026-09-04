'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/features/admin/admin-store';
import { AdminPortalNav } from '@/features/admin/presentation/AdminPortalNav';
import { DisputeStatusBadge } from '@/features/admin/presentation/DisputeStatusBadge';
import { DisputeStatus, DisputeType, DISPUTE_TYPE_LABELS } from '@/features/admin/domain/governance';
import {
  Search,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

export default function AdminDisputesPage() {
  const { disputes } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DisputeStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | DisputeType>('all');

  const filtered = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    const matchesType = typeFilter === 'all' || dispute.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const counts = {
    all: disputes.length,
    open: disputes.filter((d) => d.status === 'open').length,
    under_review: disputes.filter((d) => d.status === 'under_review').length,
    awaiting_user: disputes.filter((d) => d.status === 'awaiting_user').length,
    resolved: disputes.filter((d) => d.status === 'resolved').length,
    closed: disputes.filter((d) => d.status === 'closed').length,
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
              Dispute Resolution & Buyer Protection Desk
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
              Mediate order issues, transit damages, batch mismatches, and process settlements under SLA
            </p>
          </div>

          {/* Search & Type Filter */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-400)' }}
              />
              <input
                type="text"
                placeholder="Search order, claimant, seller..."
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

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | DisputeType)}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid var(--color-surface-tint)',
                background: 'var(--color-surface)',
                fontSize: '13px',
                outline: 'none',
                color: 'var(--color-slate)',
              }}
            >
              <option value="all">All Claim Types</option>
              {Object.entries(DISPUTE_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {(['all', 'open', 'under_review', 'awaiting_user', 'resolved', 'closed'] as const).map((st) => {
            const isActive = statusFilter === st;
            const label = st === 'all' ? 'All Disputes' : st.replace('_', ' ').toUpperCase();
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

        {/* Disputes Table */}
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
                  Dispute & Order
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Claimant & Seller
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Type & Category
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                  Timeline & Messages
                </th>
                <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-neutral-500)' }}>
                    No disputes match the active filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((dispute) => (
                  <tr key={dispute.id} style={{ borderBottom: '1px solid var(--color-surface-tint)' }}>
                    {/* Dispute & Order */}
                    <td style={{ padding: '14px 16px' }}>
                      <Link
                        href={`/admin/disputes/${dispute.id}`}
                        style={{ fontWeight: 700, color: '#0F172A', textDecoration: 'none' }}
                      >
                        {dispute.subject}
                      </Link>
                      <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                        Order: {dispute.orderNumber}
                      </div>
                    </td>

                    {/* Claimant & Seller */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-slate)' }}>{dispute.farmerName} (Buyer)</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                        Seller: {dispute.sellerName}
                      </div>
                    </td>

                    {/* Type */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: '#F1F5F9',
                          color: '#334155',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {DISPUTE_TYPE_LABELS[dispute.type] || dispute.type}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <DisputeStatusBadge status={dispute.status} />
                      {dispute.resolution && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-forest)',
                            marginTop: '4px',
                            maxWidth: '180px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={dispute.resolution}
                        >
                          {dispute.resolution}
                        </div>
                      )}
                    </td>

                    {/* Messages */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-neutral-600)' }}>
                        <MessageSquare size={14} />
                        <span>{dispute.messages.length} message{dispute.messages.length > 1 ? 's' : ''}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '2px' }}>
                        Opened: {new Date(dispute.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <Link
                        href={`/admin/disputes/${dispute.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: '#0F172A',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        <span>Mediate</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
