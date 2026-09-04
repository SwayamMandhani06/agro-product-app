'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminStore } from '../admin-store';
import {
  LayoutDashboard,
  ShieldCheck,
  PackageCheck,
  Scale,
  BarChart3,
  History,
  AlertTriangle,
  ExternalLink,
  LifeBuoy,
} from 'lucide-react';

const TABS = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, key: 'overview' },
  { href: '/admin/sellers', label: 'Seller Verifications', icon: ShieldCheck, key: 'sellers' },
  { href: '/admin/moderation', label: 'Product Moderation', icon: PackageCheck, key: 'moderation' },
  { href: '/admin/disputes', label: 'Disputes & Support', icon: Scale, key: 'disputes' },
  { href: '/admin/analytics', label: 'Platform Analytics', icon: BarChart3, key: 'analytics' },
  { href: '/admin/audit', label: 'Audit Trail', icon: History, key: 'audit' },
];

export function AdminPortalNav() {
  const pathname = usePathname();
  const { verifications, moderations, disputes, riskSignals } = useAdminStore();

  const pendingSellers = verifications.filter(
    (v) => v.status === 'submitted' || v.status === 'under_review'
  ).length;

  const pendingMods = moderations.filter((m) => m.status === 'pending_review').length;

  const activeDisputes = disputes.filter(
    (d) => d.status === 'open' || d.status === 'under_review' || d.status === 'awaiting_user'
  ).length;

  const unresolvedRisks = riskSignals.filter((r) => !r.isResolved).length;

  return (
    <header
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-surface-tint)',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Top Admin Status Strip */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '14px 24px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38BDF8',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-slate)', letterSpacing: '-0.01em' }}>
                AgriTrade Governance
              </span>
              <span
                style={{
                  background: '#0F172A',
                  color: '#38BDF8',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Admin Control
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              Trust, Verification, Dispute Escalations & Marketplace Security
            </p>
          </div>
        </div>

        {/* Global operational indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {unresolvedRisks > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#DC2626',
              }}
            >
              <AlertTriangle size={14} />
              <span>{unresolvedRisks} Risk Signal{unresolvedRisks > 1 ? 's' : ''} Active</span>
            </div>
          )}

          <Link
            href="/support"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-neutral-600)',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-surface-tint)',
              textDecoration: 'none',
              background: 'var(--color-canvas)',
            }}
          >
            <LifeBuoy size={14} />
            <span>Support Desk</span>
          </Link>

          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-neutral-600)',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-surface-tint)',
              textDecoration: 'none',
              background: 'var(--color-canvas)',
            }}
          >
            <ExternalLink size={14} />
            <span>Marketplace</span>
          </Link>
        </div>
      </div>

      {/* Tab Navigation Row */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
        }}
      >
        {TABS.map((tab) => {
          const isActive =
            tab.href === '/admin/dashboard'
              ? pathname === '/admin' || pathname === '/admin/dashboard'
              : pathname.startsWith(tab.href);

          let badgeCount = 0;
          if (tab.key === 'sellers') badgeCount = pendingSellers;
          if (tab.key === 'moderation') badgeCount = pendingMods;
          if (tab.key === 'disputes') badgeCount = activeDisputes;

          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#0F172A' : 'var(--color-neutral-500)',
                borderBottom: isActive ? '2px solid #0F172A' : '2px solid transparent',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} color={isActive ? '#0F172A' : 'currentColor'} />
              <span>{tab.label}</span>
              {badgeCount > 0 && (
                <span
                  style={{
                    background: isActive ? '#0F172A' : '#E2E8F0',
                    color: isActive ? '#FFFFFF' : '#475569',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    minWidth: '18px',
                    textAlign: 'center',
                  }}
                >
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
