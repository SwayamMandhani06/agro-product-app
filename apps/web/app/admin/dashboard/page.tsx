'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/features/admin/admin-store';
import { AdminPortalNav } from '@/features/admin/presentation/AdminPortalNav';
import { RiskSignalBanner } from '@/features/admin/presentation/RiskSignalBanner';
import { VerificationStatusBadge } from '@/features/admin/presentation/VerificationStatusBadge';
import { ModerationStatusBadge } from '@/features/admin/presentation/ModerationStatusBadge';
import { DisputeStatusBadge } from '@/features/admin/presentation/DisputeStatusBadge';
import {
  Users,
  Building2,
  Package,
  CreditCard,
  Scale,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    metrics,
    alerts,
    verifications,
    moderations,
    disputes,
    auditLogs,
  } = useAdminStore();

  const pendingVerifications = verifications.filter(
    (v) => v.status === 'submitted' || v.status === 'under_review'
  );

  const pendingModerations = moderations.filter((m) => m.status === 'pending_review');

  const activeDisputes = disputes.filter(
    (d) => d.status === 'open' || d.status === 'under_review' || d.status === 'awaiting_user'
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <AdminPortalNav />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <RiskSignalBanner />

        {/* Compact KPI Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* Farmers */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                Total Farmers
              </span>
              <Users size={16} color="var(--color-neutral-400)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '8px' }}>
              {metrics.totalFarmers.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-forest)', marginTop: '4px', fontWeight: 500 }}>
              +18 this week
            </div>
          </div>

          {/* Sellers & Verifications */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                Sellers & Input Hubs
              </span>
              <Building2 size={16} color="var(--color-neutral-400)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '8px' }}>
              {metrics.totalSellers}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              <span style={{ color: 'var(--color-forest)', fontWeight: 600 }}>{metrics.verifiedSellers} verified</span>
              {pendingVerifications.length > 0 && (
                <span style={{ color: '#D97706', fontWeight: 600, marginLeft: '6px' }}>
                  • {pendingVerifications.length} pending review
                </span>
              )}
            </div>
          </div>

          {/* Active Products & Moderation */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                Active Products
              </span>
              <Package size={16} color="var(--color-neutral-400)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '8px' }}>
              {metrics.activeProducts}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              {pendingModerations.length > 0 ? (
                <span style={{ color: '#D97706', fontWeight: 600 }}>
                  {pendingModerations.length} items awaiting approval
                </span>
              ) : (
                <span style={{ color: 'var(--color-forest)' }}>Catalog queue clean</span>
              )}
            </div>
          </div>

          {/* Platform GMV */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                Platform GMV
              </span>
              <CreditCard size={16} color="var(--color-neutral-400)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '8px' }}>
              ₹{(metrics.totalGmv / 100000).toFixed(2)} Lakh
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-forest)', marginTop: '4px', fontWeight: 500 }}>
              {metrics.activeOrders} live dispatches
            </div>
          </div>

          {/* Disputes */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                Disputes & Claims
              </span>
              <Scale size={16} color="var(--color-neutral-400)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: activeDisputes.length > 0 ? '#DC2626' : 'var(--color-slate)', marginTop: '8px' }}>
              {activeDisputes.length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              {activeDisputes.length > 0 ? 'Resolution action required' : 'Zero escalated claims'}
            </div>
          </div>
        </div>

        {/* 2-Column Dashboard Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column: Queues & Fast Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Seller Verification Queue */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="var(--color-forest)" />
                  <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-slate)' }}>
                    Pending Seller Verifications
                  </h2>
                </div>
                <Link
                  href="/admin/sellers"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-forest)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>View all {verifications.length} sellers</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {pendingVerifications.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-neutral-500)', fontSize: '13px' }}>
                  <CheckCircle2 size={24} color="var(--color-forest)" style={{ margin: '0 auto 8px' }} />
                  All seller applications have been audited and verified.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pendingVerifications.map((seller) => (
                    <div
                      key={seller.id}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-surface-tint)',
                        background: 'var(--color-canvas)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-slate)' }}>
                            {seller.businessName}
                          </span>
                          <VerificationStatusBadge status={seller.status} />
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
                          Owner: {seller.ownerName} • GSTIN: {seller.gstNumber} • {seller.district}, {seller.state}
                        </div>
                        {seller.riskFlags.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                            {seller.riskFlags.map((flag) => (
                              <span
                                key={flag}
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  background: '#FEF2F2',
                                  color: '#DC2626',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                }}
                              >
                                {flag.replace('_', ' ').toUpperCase()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/admin/sellers/${seller.id}`}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#0F172A',
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-surface-tint)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                        }}
                      >
                        Inspect & Review
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Moderation Queue */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={18} color="#D97706" />
                  <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-slate)' }}>
                    Pending Product Moderation
                  </h2>
                </div>
                <Link
                  href="/admin/moderation"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-forest)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Open queue ({moderations.length})</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {pendingModerations.length === 0 ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--color-neutral-500)', fontSize: '13px' }}>
                  No pending product catalog submissions.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pendingModerations.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-surface-tint)',
                        background: 'var(--color-canvas)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-slate)' }}>
                          {item.productTitle}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                          Seller: {item.sellerName} • Category: {item.category} • Price: ₹{item.price} (MRP: ₹{item.mrp})
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ModerationStatusBadge status={item.status} />
                        <Link
                          href="/admin/moderation"
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#0F172A',
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-surface-tint)',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                          }}
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Disputes Strip */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scale size={18} color="#DC2626" />
                  <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-slate)' }}>
                    Active Disputes & Claims
                  </h2>
                </div>
                <Link
                  href="/admin/disputes"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-forest)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>All disputes</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {disputes.slice(0, 3).map((dispute) => (
                  <div
                    key={dispute.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-surface-tint)',
                      background: 'var(--color-canvas)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-slate)' }}>
                          {dispute.orderNumber}: {dispute.subject}
                        </span>
                        <DisputeStatusBadge status={dispute.status} />
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                        Farmer: {dispute.farmerName} • Seller: {dispute.sellerName}
                      </div>
                    </div>

                    <Link
                      href={`/admin/disputes/${dispute.id}`}
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#0F172A',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-surface-tint)',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                      }}
                    >
                      Resolve
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Operational Alerts & Audit Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Operational Alerts */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 14px', color: 'var(--color-slate)' }}>
                Operational Alerts
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {alerts.map((alert) => {
                  const isCrit = alert.severity === 'critical';
                  const isWarn = alert.severity === 'warning';
                  const dotColor = isCrit ? '#DC2626' : isWarn ? '#D97706' : '#2563EB';

                  return (
                    <div
                      key={alert.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: 'var(--color-canvas)',
                        border: '1px solid var(--color-surface-tint)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dotColor }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-slate)' }}>
                          {alert.title}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
                        {alert.context}
                      </div>
                      {alert.actionRoute && (
                        <Link
                          href={alert.actionRoute}
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--color-forest)',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            marginTop: '6px',
                          }}
                        >
                          <span>Take Action</span>
                          <ArrowUpRight size={12} />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit Log Stream Preview */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-surface-tint)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--color-slate)' }}>
                  Audit Trail Stream
                </h2>
                <Link
                  href="/admin/audit"
                  style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-forest)', textDecoration: 'none' }}
                >
                  Full log
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {auditLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    style={{
                      fontSize: '12px',
                      paddingBottom: '10px',
                      borderBottom: '1px solid var(--color-surface-tint)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-neutral-500)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-slate)' }}>{log.actorName}</span>
                      <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ color: 'var(--color-neutral-600)', marginTop: '2px' }}>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{log.action.replace('_', ' ')}</span> on{' '}
                      <em>{log.entityLabel}</em>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Engine Status */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <FileCheck size={16} color="var(--color-forest)" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  Platform Integrity
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                <li>PostgreSQL Row Level Security Active</li>
                <li>Centralized Role Permission Matrix Enforced</li>
                <li>Append-only Audit Trail Enabled</li>
                <li>Dispute Resolution SLA Target: 48h</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
