'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/features/admin/admin-store';
import { AdminPortalNav } from '@/features/admin/presentation/AdminPortalNav';
import { AuditEntityType } from '@/features/admin/domain/governance';
import {
  History,
  Search,
  Shield,
  Package,
  Scale,
  Building2,
} from 'lucide-react';

export default function AdminAuditPage() {
  const { auditLogs } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<'all' | AuditEntityType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = auditLogs.filter((log) => {
    const matchesSearch =
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityLabel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;

    return matchesSearch && matchesEntity;
  });

  const getEntityIcon = (type: AuditEntityType) => {
    switch (type) {
      case 'seller':
        return <Building2 size={14} color="#D97706" />;
      case 'product':
        return <Package size={14} color="#2563EB" />;
      case 'dispute':
        return <Scale size={14} color="#DC2626" />;
      case 'risk_signal':
        return <Shield size={14} color="#9333EA" />;
      default:
        return <History size={14} color="var(--color-neutral-500)" />;
    }
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
              Immutable Platform Governance Audit Trail
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
              Append-only cryptographic record of administrative decisions, lifecycle transitions, and risk interventions
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
              placeholder="Search actor, action, entity..."
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

        {/* Entity Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {(['all', 'seller', 'product', 'dispute', 'campaign', 'risk_signal'] as const).map((ent) => {
            const isActive = entityFilter === ent;
            const label = ent === 'all' ? 'All Logs' : ent.replace('_', ' ').toUpperCase();

            return (
              <button
                key={ent}
                onClick={() => setEntityFilter(ent)}
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
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Log List Card */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '14px 18px', background: 'var(--color-canvas)', borderBottom: '1px solid var(--color-surface-tint)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
              Showing {filtered.length} Recorded Governance Event{filtered.length > 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-forest)', fontWeight: 600 }}>
              • Tamper-proof Write-Once Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-neutral-500)', fontSize: '13px' }}>
                No audit entries found matching filter.
              </div>
            ) : (
              filtered.map((log) => {
                const isExpanded = expandedId === log.id;

                return (
                  <div
                    key={log.id}
                    style={{
                      padding: '14px 18px',
                      borderBottom: '1px solid var(--color-surface-tint)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {getEntityIcon(log.entityType)}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-slate)' }}>
                              {log.action.replace('_', ' ').toUpperCase()}
                            </span>
                            <span
                              style={{
                                fontSize: '11px',
                                background: '#E2E8F0',
                                color: '#334155',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                textTransform: 'capitalize',
                              }}
                            >
                              {log.entityType}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--color-neutral-600)', marginTop: '2px' }}>
                            Target: <strong style={{ color: '#0F172A' }}>{log.entityLabel}</strong> (ID: {log.entityId})
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-slate)' }}>
                          {log.actorName} ({log.actorRole})
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', marginTop: '2px' }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Metadata Toggle */}
                    {Object.keys(log.metadata).length > 0 && (
                      <div style={{ marginTop: '4px' }}>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : log.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-forest)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          {isExpanded ? 'Hide Payload [-]' : 'View Metadata Payload [+]'}
                        </button>

                        {isExpanded && (
                          <pre
                            style={{
                              marginTop: '6px',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              background: '#0F172A',
                              color: '#38BDF8',
                              fontSize: '11px',
                              overflowX: 'auto',
                              fontFamily: 'monospace',
                            }}
                          >
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
