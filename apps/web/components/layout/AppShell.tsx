'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import { useCartStore } from '@/features/cart/store';
import {
  Home,
  LayoutGrid,
  Sprout,
  ShoppingCart,
  User,
  Leaf,
  Package,
  LogOut,
} from 'lucide-react';

const emptySubscribe = () => () => {};
const useMounted = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

const NAV_LINKS = [
  { href: '/home',       label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/products',   label: 'Products' },
  { href: '/orders',     label: 'My Orders' },
];

const BOTTOM_NAV = [
  { href: '/home',       label: 'Home',       Icon: Home,         badge: false },
  { href: '/categories', label: 'Categories', Icon: LayoutGrid,   badge: false },
  { href: '/products',   label: 'Products',   Icon: Sprout,       badge: false },
  { href: '/cart',       label: 'Cart',       Icon: ShoppingCart, badge: true  },
  { href: '/profile',    label: 'Profile',    Icon: User,         badge: false },
];

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { status, user, signOut } = useAuthStore();
  const cartCount = useCartStore((s) => s.totalItemCount());
  const [menuOpen, setMenuOpen] = useState(false);
  const mounted   = useMounted();

  // Route guard
  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.replace('/welcome');
    }
  }, [mounted, status, router]);

  if (!mounted || status === 'unauthenticated' || status === 'initializing') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-canvas)' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              color: '#fff',
            }}
          >
            <Leaf size={24} strokeWidth={2} />
          </div>
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 13, margin: 0 }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* ============================================================
          TOP NAVIGATION BAR
          ============================================================ */}
      <header
        style={{
          background: 'var(--color-forest)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.18)',
        }}
      >
        <div
          className="container-app"
          style={{ display: 'flex', alignItems: 'center', height: 'var(--nav-height)', gap: 24 }}
        >
          {/* Brand */}
          <Link
            href="/home"
            style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: 'rgba(255,255,255,0.14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Leaf size={18} strokeWidth={2.2} />
            </div>
            <span style={{ color: '#fff', fontSize: 17, fontWeight: 700, letterSpacing: '-0.2px' }}>
              AGRI TRADE
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'none', gap: 2 }} className="desktop-nav">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: active ? '#fff' : 'rgba(255,255,255,0.70)',
                    textDecoration: 'none',
                    fontWeight: active ? 600 : 500,
                    fontSize: 14,
                    padding: '5px 12px',
                    borderRadius: 6,
                    background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
                    transition: 'all 150ms ease',
                    letterSpacing: '0.1px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Cart */}
            <Link
              href="/cart"
              id="nav-cart-btn"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.10)',
                color: '#fff',
                textDecoration: 'none',
                transition: 'background 150ms ease',
              }}
            >
              <ShoppingCart size={19} strokeWidth={2} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    background: 'var(--color-amber)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 17,
                    height: 17,
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
            </Link>

            {/* User avatar / dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                id="nav-user-btn"
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255,255,255,0.10)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '5px 10px 5px 5px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'background 150ms ease',
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'var(--color-amber)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
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
                    style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'var(--color-surface)',
                      borderRadius: 10,
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--color-divider)',
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
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--color-forest)' }}>
                        {user?.name}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                        {user?.email}
                      </p>
                    </div>
                    {[
                      { href: '/profile', label: 'My Profile',  IconC: User    },
                      { href: '/orders',  label: 'My Orders',   IconC: Package },
                    ].map(({ href, label, IconC }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '11px 16px',
                          fontSize: 14,
                          fontWeight: 500,
                          color: 'var(--color-text-primary)',
                          textDecoration: 'none',
                          borderBottom: '1px solid var(--color-divider)',
                        }}
                      >
                        <IconC size={15} strokeWidth={2} color="var(--color-text-tertiary)" />
                        {label}
                      </Link>
                    ))}
                    <button
                      id="nav-signout-btn"
                      onClick={() => { signOut(); setMenuOpen(false); router.replace('/welcome'); }}
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--color-error)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <LogOut size={15} strokeWidth={2} />
                      Sign Out
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
      <main style={{ minHeight: 'calc(100vh - var(--nav-height))', paddingBottom: 72 }}>
        {children}
      </main>

      {/* ============================================================
          BOTTOM NAVIGATION (mobile only)
          ============================================================ */}
      <nav className="bottom-nav" id="bottom-nav">
        {BOTTOM_NAV.map(({ href, label, Icon, badge }) => {
          const active = pathname === href || (pathname.startsWith(href + '/') && href !== '/home');
          return (
            <Link
              key={href}
              href={href}
              id={`bottom-nav-${label.toLowerCase().replace(/\s/g, '-')}`}
              className={`bottom-nav-item ${active ? 'active' : ''}`}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={20} strokeWidth={active ? 2.2 : 1.75} />
                {badge && cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -7,
                      background: 'var(--color-amber)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 15,
                      height: 15,
                      fontSize: 8,
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
              <span style={{ fontSize: 9, fontWeight: active ? 600 : 500, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                {label}
              </span>
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
