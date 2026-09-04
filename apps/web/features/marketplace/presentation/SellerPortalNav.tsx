'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMarketplaceStore } from '../marketplace-store';
import {
  Store,
  Package,
  Layers,
  ShoppingBag,
  CreditCard,
  Building2,
  ShieldCheck,
  PlusCircle,
  Users,
} from 'lucide-react';

const TABS = [
  { href: '/seller/dashboard', label: 'Overview', icon: Store },
  { href: '/seller/products', label: 'Product Catalog', icon: Package },
  { href: '/seller/inventory', label: 'Inventory & Movements', icon: Layers },
  { href: '/seller/orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
  { href: '/seller/payouts', label: 'Payouts & Ledger', icon: CreditCard },
  { href: '/seller/profile', label: 'Seller Profile', icon: Building2 },
];

export function SellerPortalNav() {
  const pathname = usePathname();
  const { sellerProfiles, activeSellerId } = useMarketplaceStore();
  const seller = sellerProfiles.find((s) => s.id === activeSellerId) || sellerProfiles[0];

  return (
    <header
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-surface-tint)',
        marginBottom: '24px',
      }}
    >
      {/* Top Seller Bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px 12px',
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
              background: 'var(--color-forest)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '18px',
            }}
          >
            M
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--color-slate)',
                  letterSpacing: '-0.01em',
                }}
              >
                {seller?.businessName || 'Seller Enterprise Portal'}
              </h1>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: '#EAF6EF',
                  color: '#01421E',
                  border: '1px solid #CEEAD9',
                }}
              >
                <ShieldCheck size={13} color="#027A38" />
                Verified Seller
              </span>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
              <span>APMC License: MH-PUN-0491</span>
              <span>•</span>
              <span>24h Dispatch SLA</span>
              <span>•</span>
              <span>Commission: {seller?.commissionRate ?? 4.5}%</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/seller/products/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-forest)',
              color: '#FFFFFF',
              padding: '7px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 120ms ease',
            }}
          >
            <PlusCircle size={15} />
            Add New Product
          </Link>

          <Link
            href="/cooperative/campaigns"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-surface-subtle)',
              color: 'var(--color-slate)',
              border: '1px solid var(--color-surface-tint)',
              padding: '7px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <Users size={14} />
            Cooperative FPO
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.href !== '/seller/dashboard' && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 0',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-forest)' : 'var(--color-neutral-600)',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid var(--color-forest)' : '2px solid transparent',
                transition: 'all 120ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
