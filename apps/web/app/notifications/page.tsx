'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  Package,
  TrendingUp,
  CloudRain,
  Sparkles,
  Info,
  ChevronRight,
} from 'lucide-react';
import AppShellLayout from '@/components/layout/AppShell';
import { useNotificationsStore } from '@/features/notifications/notifications-store';
import type { NotificationType } from '@/types';

const emptySubscribe = () => () => {};
const useMounted = () => React.useSyncExternalStore(emptySubscribe, () => true, () => false);

export default function NotificationsPage() {
  const router = useRouter();
  const mounted = useMounted();

  const notifications = useNotificationsStore((s) => s.notifications);
  const filter = useNotificationsStore((s) => s.filter);
  const setFilter = useNotificationsStore((s) => s.setFilter);
  const markAsRead = useNotificationsStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationsStore((s) => s.markAllAsRead);
  const unreadCount = useNotificationsStore((s) => s.unreadCount());

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === filter);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'orders':
        return <Package size={16} style={{ color: 'var(--color-forest)' }} />;
      case 'prices':
        return <TrendingUp size={16} style={{ color: 'var(--color-amber)' }} />;
      case 'weather':
        return <CloudRain size={16} style={{ color: '#0284c7' }} />;
      case 'products':
        return <Sparkles size={16} style={{ color: 'var(--color-forest)' }} />;
      case 'system':
      default:
        return <Info size={16} style={{ color: '#64748b' }} />;
    }
  };

  if (!mounted) return null;

  return (
    <AppShellLayout>
      <div className="container-app" style={{ paddingBottom: 'var(--space-2xl)', maxWidth: 840 }}>
        {/* Breadcrumb & Header */}
        <div style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
            <Link href="/home" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Notifications</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="text-h1" style={{ margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Bell size={24} style={{ color: 'var(--color-forest)' }} />
                Platform Alerts & Notifications
                {unreadCount > 0 && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-amber)',
                      color: '#fff',
                    }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                Order fulfillment milestones, APMC rate threshold alerts, and regional micro-met advisories
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '7px 14px' }}
              >
                <CheckCheck size={15} />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 20 }}>
          {(['all', 'orders', 'prices', 'weather', 'products', 'system'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: 13,
                fontWeight: filter === cat ? 600 : 500,
                background: filter === cat ? 'var(--color-forest)' : 'var(--color-surface)',
                color: filter === cat ? '#fff' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all var(--motion-fast) var(--ease-standard)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notification List */}
        {filtered.length === 0 ? (
          <div
            className="card-base"
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)',
              border: '1px dashed var(--color-border)',
            }}
          >
            <Bell size={32} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
              No notifications in this category
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
              You are all caught up with your operational alerts.
            </p>
          </div>
        ) : (
          <div
            className="card-base"
            style={{
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {filtered.map((item, idx) => {
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    markAsRead(item.id);
                    if (item.actionRoute) {
                      router.push(item.actionRoute);
                    }
                  }}
                  style={{
                    padding: '16px 20px',
                    borderBottom: idx < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
                    background: item.isRead ? 'transparent' : 'rgba(11, 61, 46, 0.03)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    cursor: item.actionRoute ? 'pointer' : 'default',
                    transition: 'background var(--motion-fast) var(--ease-standard)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-variant)')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = item.isRead ? 'transparent' : 'rgba(11, 61, 46, 0.03)')
                  }
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {getIcon(item.type)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <h4
                        style={{
                          fontSize: 14,
                          fontWeight: item.isRead ? 600 : 700,
                          color: 'var(--color-text-primary)',
                          margin: 0,
                        }}
                      >
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: 'var(--color-amber)',
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 6px', lineHeight: 1.45 }}>
                      {item.body}
                    </p>
                    <span style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)' }}>
                      {new Date(item.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {item.actionRoute && (
                    <ChevronRight size={18} style={{ color: 'var(--color-text-tertiary)', alignSelf: 'center' }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShellLayout>
  );
}
