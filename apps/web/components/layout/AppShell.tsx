'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import { useCartStore } from '@/features/cart/store';

const emptySubscribe = () => () => {};
const useMounted = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

const NAV_LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/products', label: 'Products' },
  { href: '/orders', label: 'My Orders' },
];

const BOTTOM_NAV = [
  { href: '/home', label: 'Home', icon: HomeIcon },
  { href: '/categories', label: 'Categories', icon: GridIcon },
  { href: '/products', label: 'Products', icon: LeafIcon },
  { href: '/cart', label: 'Cart', icon: CartIcon, badge: true },
  { href: '/profile', label: 'Profile', icon: UserIcon },
];

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, user, signOut } = useAuthStore();
  const cartCount = useCartStore((s) => s.totalItemCount());
  const [menuOpen, setMenuOpen] = useState(false);
  const mounted = useMounted();


  // Route guard
  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.replace('/welcome');
    }
  }, [mounted, status, router]);

  if (!mounted || status === 'unauthenticated' || status === 'initializing') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-canvas)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 28,
            }}
          >
            🌿
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* ============================================================
          TOP NAVIGATION BAR (desktop & tablet)
          ============================================================ */}
      <header
        style={{
          background: 'var(--color-forest)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div
          className="container-app"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 64,
            gap: 24,
          }}
        >
          {/* Logo */}
          <Link
            href="/home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              🌿
            </div>
            <span
              style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.3px',
              }}
            >
              AGRI TRADE
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'none',
              gap: 4,
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                    textDecoration: 'none',
                    fontWeight: active ? 600 : 500,
                    fontSize: 14,
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                    transition: 'all 150ms ease',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Cart */}
            <Link
              href="/cart"
              id="nav-cart-btn"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                textDecoration: 'none',
                transition: 'background 150ms ease',
              }}
            >
              <CartIcon size={20} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: 'var(--color-amber)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User avatar / menu */}
            <div style={{ position: 'relative' }}>
              <button
                id="nav-user-btn"
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255,255,255,0.12)',
                  border: 'none',
                  borderRadius: 10,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'background 150ms ease',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--color-amber)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                </div>
                <span style={{ display: 'none' }} className="user-name-label">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              {menuOpen && (
                <>
                  <div
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 40,
                    }}
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'var(--color-surface)',
                      borderRadius: 12,
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--color-border)',
                      minWidth: 200,
                      zIndex: 50,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--color-divider)',
                        background: 'var(--color-brand-50)',
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: 'var(--color-forest)' }}>
                        {user?.name}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                        {user?.email}
                      </p>
                    </div>
                    {[
                      { href: '/profile', label: '👤  My Profile' },
                      { href: '/orders', label: '📦  My Orders' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          fontSize: 14,
                          fontWeight: 500,
                          color: 'var(--color-text-primary)',
                          textDecoration: 'none',
                          transition: 'background 150ms ease',
                          borderBottom: '1px solid var(--color-divider)',
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      id="nav-signout-btn"
                      onClick={() => { signOut(); setMenuOpen(false); router.replace('/welcome'); }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--color-error)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 150ms ease',
                      }}
                    >
                      🚪  Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          PAGE CONTENT
          ============================================================ */}
      <main
        style={{
          minHeight: 'calc(100vh - 64px)',
          paddingBottom: 80, // room for mobile bottom nav
        }}
      >
        {children}
      </main>

      {/* ============================================================
          BOTTOM NAVIGATION (mobile only — shown via CSS)
          ============================================================ */}
      <nav className="bottom-nav" id="bottom-nav">
        {BOTTOM_NAV.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || (pathname.startsWith(href + '/') && href !== '/home');
          return (
            <Link
              key={href}
              href={href}
              id={`bottom-nav-${label.toLowerCase().replace(/\s/g, '-')}`}
              className={`bottom-nav-item ${active ? 'active' : ''}`}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={22} />
                {badge && cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -8,
                      background: 'var(--color-amber)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 16,
                      height: 16,
                      fontSize: 9,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 500 }}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .user-name-label { display: block !important; }
          #bottom-nav { display: none !important; }
          main { padding-bottom: 0 !important; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// INLINE ICON COMPONENTS
// ============================================================

function HomeIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function GridIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" />
    </svg>
  );
}

function LeafIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 3.25-13 7.5 1.56-6.31 7.67-9 7.67-9-.86.56-1.3.9-1.3.9A6.44 6.44 0 0 1 17 8z" />
    </svg>
  );
}

function CartIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h11v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H18c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 22.46 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2z" />
    </svg>
  );
}

function UserIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}
