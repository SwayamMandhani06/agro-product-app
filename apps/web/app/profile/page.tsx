'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/features/auth/store';
import { useOrdersStore } from '@/features/orders/store';
import { MOCK_ADDRESSES } from '@/lib/mock-data';



export default function ProfilePage() {
  const { user, signOut } = useAuthStore();
  const { orders } = useOrdersStore();
  const router = useRouter();
  const [signOutDialog, setSignOutDialog] = useState(false);

  const activeOrders = orders.filter((o) => ['placed', 'confirmed', 'processing', 'shipped', 'outForDelivery'].includes(o.status));
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const totalSpent = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0);

  const handleSignOut = () => {
    signOut();
    router.replace('/welcome');
  };

  const MENU_ITEMS = [
    { label: 'My Orders', desc: `${orders.length} total orders`, href: '/orders', icon: '📦' },
    { label: 'Saved Addresses', desc: `${MOCK_ADDRESSES.length} addresses saved`, href: '#', icon: '📍' },
    { label: 'Wishlist', desc: 'Your saved products', href: '/products', icon: '❤️' },
    { label: 'Notifications', desc: 'Order updates & offers', href: '#', icon: '🔔' },
    { label: 'Help & Support', desc: 'FAQs, contact us', href: '#', icon: '💬' },
  ];

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* Profile header */}
        <div
          style={{
            background: `linear-gradient(135deg, var(--color-forest) 0%, var(--color-brand-700) 100%)`,
            borderRadius: 20,
            padding: '28px',
            marginBottom: 20,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'var(--color-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 800,
                color: '#fff',
                flexShrink: 0,
                border: '3px solid rgba(255,255,255,0.3)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() ?? 'F'}
            </div>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.3px' }}>
                {user?.name}
              </h1>
              <p style={{ margin: '0 0 4px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                {user?.email}
              </p>
              {user?.phone && (
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
                  📞 {user.phone}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 0, marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 16 }}>
            {[
              { label: 'Active', value: activeOrders.length },
              { label: 'Delivered', value: deliveredOrders.length },
              { label: 'Total Spent', value: `₹${Math.round(totalSpent / 100) * 100 >= 1000 ? (totalSpent / 1000).toFixed(1) + 'K' : totalSpent}` },
            ].map((stat, i) => (
              <div key={stat.label} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                <p style={{ margin: '0 0 2px', fontSize: 20, fontWeight: 800 }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
          {MENU_ITEMS.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              id={`profile-${item.label.toLowerCase().replace(/\s/g, '-')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                textDecoration: 'none',
                borderBottom: i < MENU_ITEMS.length - 1 ? '1px solid var(--color-divider)' : 'none',
                background: 'var(--color-surface)',
                transition: 'background 150ms ease',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'var(--color-brand-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {item.label}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)' }}>{item.desc}</p>
              </div>
              <span style={{ color: 'var(--color-text-tertiary)', fontSize: 18 }}>›</span>
            </Link>
          ))}
        </div>

        {/* App info */}
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 16,
            border: '1px solid var(--color-border)',
            padding: '14px 20px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
            🌿 AgriTrade Web v1.0
          </span>
          <span className="badge badge-forest">FARMER</span>
        </div>

        {/* Sign out button */}
        <button
          id="profile-signout-btn"
          onClick={() => setSignOutDialog(true)}
          className="btn btn-secondary btn-full"
          style={{ borderRadius: 14, padding: '14px 24px', fontSize: 16, borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
        >
          🚪 Sign Out
        </button>
      </div>

      {/* Sign out dialog */}
      {signOutDialog && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
            onClick={() => setSignOutDialog(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--color-surface)',
              borderRadius: 20,
              padding: '28px',
              width: '90%',
              maxWidth: 380,
              zIndex: 101,
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 700 }}>Sign Out?</h3>
            <p style={{ margin: '0 0 24px', color: 'var(--color-text-secondary)', fontSize: 15 }}>
              Are you sure you want to sign out of AgriTrade?
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setSignOutDialog(false)}
                className="btn btn-secondary"
                style={{ flex: 1, borderRadius: 12 }}
              >
                Cancel
              </button>
              <button
                id="profile-confirm-signout-btn"
                onClick={handleSignOut}
                className="btn btn-primary"
                style={{ flex: 1, borderRadius: 12, background: 'var(--color-error)' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
