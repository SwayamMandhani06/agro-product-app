'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import { useCartStore } from '@/features/cart/store';
import {
  Home,
  Sprout,
  ShoppingCart,
  User,
  Leaf,
  Package,
  LogOut,
  Bell,
  Bookmark,
  Activity,
  CloudRain,
} from 'lucide-react';
import { useNotificationsStore } from '@/features/notifications/notifications-store';
import { useWishlistStore } from '@/features/wishlist/wishlist-store';

import { connectionManager, type ConnectionState } from '@/lib/realtime/connection-manager';
import { realtimeClient } from '@/lib/realtime/realtime-client';
import { subscribeToNotifications } from '@/lib/realtime/subscriptions/notifications';
import { subscribeToOrderUpdates } from '@/lib/realtime/subscriptions/orders';
import { subscribeToShipmentUpdates } from '@/lib/realtime/subscriptions/shipments';
import { useOrdersStore } from '@/features/orders/store';
import { useLogisticsStore } from '@/features/logistics/logistics-store';
import { CheckCheck, CheckCircle2, WifiOff } from 'lucide-react';

const emptySubscribe = () => () => {};
const useMounted = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

const NAV_LINKS = [
  { href: '/home',                  label: 'Dashboard' },
  { href: '/insights',              label: 'Analytics' },
  { href: '/products',              label: 'Products' },
  { href: '/cooperative/campaigns', label: 'Cooperative' },
  { href: '/seller/dashboard',      label: 'Seller Portal' },
  { href: '/mandi',                 label: 'Mandi Rates' },
  { href: '/weather',               label: 'Weather' },
  { href: '/community',             label: 'Community' },
  { href: '/saved',                 label: 'Saved' },
  { href: '/orders',                label: 'Orders' },
  { href: '/shipments',             label: 'Logistics' },
];

const BOTTOM_NAV = [
  { href: '/home',        label: 'Home',       Icon: Home,         badge: false },
  { href: '/products',    label: 'Catalog',    Icon: Sprout,       badge: false },
  { href: '/mandi',       label: 'Mandi',      Icon: Activity,     badge: false },
  { href: '/weather',     label: 'Weather',    Icon: CloudRain,    badge: false },
  { href: '/cart',        label: 'Cart',       Icon: ShoppingCart, badge: true  },
  { href: '/profile',     label: 'Profile',    Icon: User,         badge: false },
];

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { status, user, signOut } = useAuthStore();
  const cartCount = useCartStore((s) => s.totalItemCount());
  const { notifications, markAllAsRead } = useNotificationsStore();
  const unreadCount = useNotificationsStore((s) => s.unreadCount());
  const savedCount = useWishlistStore((s) => s.savedProductIds.length);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>(connectionManager.getState());
  const [showRestoredBanner, setShowRestoredBanner] = useState(false);
  const mounted   = useMounted();

  // Initialize Realtime Client & Subscriptions
  useEffect(() => {
    if (!mounted) return;
    realtimeClient.init();

    const unsubConn = connectionManager.subscribe((state, prevState) => {
      setConnectionState(state);
      if (prevState === 'offline' && state === 'connected') {
        setShowRestoredBanner(true);
        setTimeout(() => setShowRestoredBanner(false), 3000);
      }
    });

    const unsubNotif = subscribeToNotifications('usr_default', (notif) => {
      useNotificationsStore.getState().incomingRealtimeNotification(notif);
    });

    const unsubOrders = subscribeToOrderUpdates('usr_default', (update) => {
      useOrdersStore.getState().updateOrderStatus(update.orderId, update.status, {
        estimatedDelivery: update.estimatedDelivery,
        agentName: update.deliveryAgentName,
        agentPhone: update.deliveryAgentPhone,
      });
    });

    const unsubShipments = subscribeToShipmentUpdates('usr_default', (update) => {
      useLogisticsStore.getState().updateShipmentFromRealtime(update);
    });

    return () => {
      unsubConn();
      unsubNotif();
      unsubOrders();
      unsubShipments();
    };
  }, [mounted]);

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
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 13, margin: 0 }}>Loading AgriTrade…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* ============================================================
          TOP NAVIGATION BAR (SaaS Glassmorphic Header)
          ============================================================ */}
      <header
        className="glass-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="container-app"
          style={{ display: 'flex', alignItems: 'center', height: 'var(--nav-height)', gap: 24 }}
        >
          {/* Brand Logo */}
          <Link
            href="/home"
            style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: 'rgba(255,255,255,0.16)',
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
              const active = pathname === link.href || (pathname.startsWith(link.href + '/') && link.href !== '/home');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: active ? '#fff' : 'rgba(255,255,255,0.72)',
                    textDecoration: 'none',
                    fontWeight: active ? 600 : 500,
                    fontSize: 13.5,
                    padding: '6px 13px',
                    borderRadius: 6,
                    background: active ? 'rgba(255,255,255,0.16)' : 'transparent',
                    transition: 'all var(--motion-fast) var(--ease-standard)',
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
            {/* Connection State Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.08)',
                fontSize: 11,
                fontWeight: 600,
                color: connectionState === 'connected' ? 'var(--color-brand-100, #bbf7d0)' :
                       connectionState === 'reconnecting' ? '#fde047' :
                       connectionState === 'offline' ? '#fca5a5' : '#e2e8f0',
                letterSpacing: '0.2px',
                marginRight: 4,
              }}
              title={`Realtime Status: ${connectionState}`}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: connectionState === 'connected' ? '#22c55e' :
                              connectionState === 'reconnecting' ? '#eab308' :
                              connectionState === 'offline' ? '#ef4444' : '#94a3b8',
                  boxShadow: connectionState === 'connected' ? '0 0 6px rgba(34,197,94,0.6)' : 'none',
                }}
              />
              <span style={{ textTransform: 'capitalize' }}>
                {connectionState === 'connected' ? 'Live' : connectionState}
              </span>
            </div>

            {/* Saved / Wishlist Link */}
            <Link
              href="/saved"
              title="Saved Products"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.10)',
                color: '#fff',
                textDecoration: 'none',
                transition: 'background var(--motion-fast) var(--ease-standard)',
              }}
            >
              <Bookmark size={17} strokeWidth={2} />
              {savedCount > 0 && (
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
                    boxShadow: '0 0 0 2px var(--color-forest)',
                  }}
                >
                  {savedCount}
                </span>
              )}
            </Link>

            {/* Notification Bell with Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setNotifDropdownOpen((prev) => !prev)}
                title="Platform Alerts"
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: notifDropdownOpen ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.10)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background var(--motion-fast) var(--ease-standard)',
                }}
              >
                <Bell size={17} strokeWidth={2} />
                {unreadCount > 0 && (
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
                      boxShadow: '0 0 0 2px var(--color-forest)',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {notifDropdownOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                    onClick={() => setNotifDropdownOpen(false)}
                  />
                  <div
                    className="slide-up"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'var(--color-surface)',
                      borderRadius: 10,
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--color-divider)',
                      width: 340,
                      maxWidth: '90vw',
                      zIndex: 50,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--color-divider)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--color-brand-50)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-forest)' }}>
                          Alerts & Intelligence
                        </span>
                        {unreadCount > 0 && (
                          <span
                            style={{
                              background: 'var(--color-forest)',
                              color: '#fff',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: 10,
                            }}
                          >
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllAsRead()}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-forest)',
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            padding: 0,
                          }}
                        >
                          <CheckCheck size={13} />
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                      {notifications.slice(0, 4).map((n) => (
                        <div
                          key={n.id}
                          style={{
                            padding: '10px 14px',
                            borderBottom: '1px solid var(--color-divider)',
                            background: n.isRead ? 'transparent' : 'rgba(238, 248, 241, 0.4)',
                            display: 'flex',
                            gap: 10,
                            alignItems: 'flex-start',
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: n.isRead ? 'transparent' : 'var(--color-forest)',
                              marginTop: 6,
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                              {n.title}
                            </p>
                            <p style={{ margin: '2px 0 4px', fontSize: 11.5, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                              {n.body}
                            </p>
                            <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        textAlign: 'center',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--color-forest)',
                        background: 'var(--color-canvas)',
                        textDecoration: 'none',
                        borderTop: '1px solid var(--color-divider)',
                      }}
                    >
                      View all notifications →
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Cart Button */}
            <Link
              href="/cart"
              id="nav-cart-btn"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.10)',
                color: '#fff',
                textDecoration: 'none',
                transition: 'background var(--motion-fast) var(--ease-standard)',
              }}
            >
              <ShoppingCart size={18} strokeWidth={2} />
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

            {/* User Avatar / Dropdown */}
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
                  padding: '4px 10px 4px 4px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'background var(--motion-fast) var(--ease-standard)',
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
                    className="slide-up"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'var(--color-surface)',
                      borderRadius: 10,
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--color-divider)',
                      minWidth: 210,
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
                          fontSize: 13.5,
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
                        fontSize: 13.5,
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

      {/* Connection Notification Banners */}
      {connectionState === 'offline' && (
        <div
          style={{
            background: '#FEF2F2',
            borderBottom: '1px solid #FCA5A5',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: '#991B1B',
            fontSize: 12.5,
            fontWeight: 500,
          }}
        >
          <WifiOff size={14} strokeWidth={2} />
          <span>You&apos;re offline. Showing the latest available information.</span>
        </div>
      )}

      {showRestoredBanner && (
        <div
          style={{
            background: '#F0FDF4',
            borderBottom: '1px solid #86EFAC',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: '#166534',
            fontSize: 12.5,
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={14} strokeWidth={2} />
          <span>Connection restored</span>
        </div>
      )}

      {/* ============================================================
          PAGE CONTENT
          ============================================================ */}
      <main style={{ minHeight: 'calc(100vh - var(--nav-height))', paddingBottom: 72 }}>
        {children}
      </main>

      {/* ============================================================
          BOTTOM NAVIGATION (mobile web only)
          ============================================================ */}
      <nav className="bottom-nav glass-surface" id="bottom-nav">
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
