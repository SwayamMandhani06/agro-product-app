'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/features/auth/store';
import { useOrdersStore } from '@/features/orders/store';
import { MOCK_ADDRESSES } from '@/lib/mock-data';
import {
  Package,
  MapPin,
  Heart,
  Bell,
  MessageCircle,
  Phone,
  ChevronRight,
  Leaf,
  LogOut,
} from 'lucide-react';

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
    { label: 'My Orders', desc: `${orders.length} total orders`, href: '/orders', Icon: Package },
    { label: 'Saved Addresses', desc: `${MOCK_ADDRESSES.length} addresses saved`, href: '#', Icon: MapPin },
    { label: 'Wishlist', desc: 'Your saved products', href: '/products', Icon: Heart },
    { label: 'Notifications', desc: 'Order updates & offers', href: '#', Icon: Bell },
    { label: 'Help & Support', desc: 'FAQs, contact us', href: '#', Icon: MessageCircle },
  ];

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* Profile header */}
        <div
          style={{
            background: 'var(--color-forest)',
            borderRadius: 12,
            padding: '24px',
            marginBottom: 16,
            color: '#fff',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'var(--color-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 800,
                color: '#fff',
                flexShrink: 0,
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() ?? 'F'}
            </div>
            <div>
              <h1 style={{ margin: '0 0 2px', fontSize: 20, fontWeight: 700, letterSpacing: '-0.2px' }}>
                {user?.name}
              </h1>
              <p style={{ margin: '0 0 2px', color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
                {user?.email}
              </p>
              {user?.phone && (
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Phone size={11} strokeWidth={2} /> {user.phone}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 0, marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 14 }}>
            {[
              { label: 'Active Orders', value: activeOrders.length },
              { label: 'Delivered', value: deliveredOrders.length },
              { label: 'Total Spent', value: `₹${Math.round(totalSpent / 100) * 100 >= 1000 ? (totalSpent / 1000).toFixed(1) + 'K' : totalSpent}` },
            ].map((stat, i) => (
              <div key={stat.label} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
                <p style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 700 }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.2px' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
          {MENU_ITEMS.map(({ label, desc, href, Icon }, i) => (
            <Link
              key={label}
              href={href}
              id={`profile-${label.toLowerCase().replace(/\s/g, '-')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                textDecoration: 'none',
                borderBottom: i < MENU_ITEMS.length - 1 ? '1px solid var(--color-divider)' : 'none',
                background: 'var(--color-surface)',
                transition: 'background 150ms ease',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: 'var(--color-brand-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--color-forest)',
                }}
              >
                <Icon size={18} strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {label}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>{desc}</p>
              </div>
              <ChevronRight size={16} strokeWidth={2} color="var(--color-text-tertiary)" />
            </Link>
          ))}
        </div>

        {/* App info */}
        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 10,
            border: '1px solid var(--color-divider)',
            padding: '12px 18px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Leaf size={14} strokeWidth={2} color="var(--color-forest)" />
            AgriTrade Web v1.0
          </span>
          <span className="badge badge-forest">FARMER</span>
        </div>

        {/* Sign out button */}
        <button
          id="profile-signout-btn"
          onClick={() => setSignOutDialog(true)}
          className="btn btn-secondary btn-full"
          style={{
            borderRadius: 10,
            padding: '12px 20px',
            fontSize: 14,
            borderColor: 'var(--color-error)',
            color: 'var(--color-error)',
            gap: 8,
          }}
        >
          <LogOut size={16} strokeWidth={2} />
          Sign Out
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
              borderRadius: 12,
              padding: '24px',
              width: '90%',
              maxWidth: 380,
              zIndex: 101,
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>Sign Out?</h3>
            <p style={{ margin: '0 0 20px', color: 'var(--color-text-secondary)', fontSize: 14 }}>
              Are you sure you want to sign out of AgriTrade?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setSignOutDialog(false)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px 16px', fontSize: 14 }}
              >
                Cancel
              </button>
              <button
                id="profile-confirm-signout-btn"
                onClick={handleSignOut}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px 16px', fontSize: 14, background: 'var(--color-error)', borderColor: 'var(--color-error)' }}
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
