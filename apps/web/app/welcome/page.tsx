'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import {
  Leaf,
  Sprout,
  Store,
  Users,
  ShieldCheck,
  TrendingDown,
  Truck,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const VALUE_PROPS = [
  {
    Icon: Sprout,
    title: 'Certified Seeds & Inputs',
    desc: 'Direct dispatch from verified seed manufacturers and bio-fertilizer enterprises with batch testing certificates.',
    stat: '100% Verified',
  },
  {
    Icon: TrendingDown,
    title: 'Direct Farm-Gate Pricing',
    desc: 'Eliminates commission agents and local distributor markups, saving farmers an average of 18–25% per acre.',
    stat: '₹1,240 Avg. Savings',
  },
  {
    Icon: Truck,
    title: 'Rural Hub Logistics',
    desc: 'Specialized agricultural delivery network servicing village hubs and farm gates with OTP confirmation.',
    stat: '24–48 Hr Dispatch',
  },
];

const ROLES_LIST = [
  {
    role: 'Farmer / Grower',
    icon: Sprout,
    desc: 'Purchase inputs, monitor Mandi rates, and track shipments',
    path: '/login',
    color: '#145A43',
    bgColor: '#EAF6EF',
  },
  {
    role: 'Commercial Seller',
    icon: Store,
    desc: 'Manage inventory, process orders, and reconcile bank payouts',
    path: '/login',
    color: '#D97706',
    bgColor: '#FFF3E0',
  },
  {
    role: 'Cooperative FPO',
    icon: Users,
    desc: 'Run collective buying campaigns with tiered volume discounts',
    path: '/login',
    color: '#1B6BAA',
    bgColor: '#DCEEFD',
  },
  {
    role: 'Platform Admin',
    icon: ShieldCheck,
    desc: 'License verification, dispute mediation, and audit governance',
    path: '/login',
    color: '#991B1B',
    bgColor: '#FEE2E2',
  },
];

export default function WelcomePage() {
  const { status, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && user) {
      if (user.role === 'seller') router.replace('/seller/dashboard');
      else if (user.role === 'admin') router.replace('/admin/dashboard');
      else if (user.role === 'cooperative_manager') router.replace('/cooperative/campaigns');
      else router.replace('/home');
    }
  }, [status, user, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F9F7F2 0%, #EDE8DF 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          padding: '18px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(11, 61, 46, 0.08)',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(11, 61, 46, 0.25)',
            }}
          >
            <Leaf size={18} strokeWidth={2.4} />
          </div>
          <div>
            <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-forest)', letterSpacing: '-0.3px', display: 'block', lineHeight: 1 }}>
              AGRI TRADE
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-tertiary)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              Agricultural Commerce
            </span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/products"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              padding: '7px 14px',
            }}
          >
            Browse Catalog
          </Link>
          <Link
            href="/login"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#ffffff',
              background: 'var(--color-forest)',
              textDecoration: 'none',
              padding: '7px 16px',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(11, 61, 46, 0.2)',
            }}
          >
            <Lock size={13} /> Sign In
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          maxWidth: 1160,
          margin: '0 auto',
          padding: '40px 24px 60px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)', gap: 36, alignItems: 'center' }}>

          {/* Left Column: Hero Mission & Value Propositions */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EAF6EF', color: 'var(--color-forest)', padding: '5px 12px', borderRadius: 20, border: '1px solid #9FD4B0', fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
              <Zap size={13} strokeWidth={2.5} /> INDIA&apos;S FARMER-FIRST PLATFORM
            </div>

            <h1
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: 'var(--color-forest)',
                letterSpacing: '-0.8px',
                lineHeight: 1.2,
                margin: '0 0 16px',
              }}
            >
              Direct Agricultural Commerce &amp; Rural Market Intelligence
            </h1>

            <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', lineHeight: 1.55, margin: '0 0 28px' }}>
              AgriTrade eliminates intermediate commission layers, bringing factory-certified seeds, bio-nutrients, and crop protection directly to farm gates with daily APMC mandi price tracking.
            </p>

            {/* Value Proposition Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {VALUE_PROPS.map(({ Icon, title, desc, stat }) => (
                <div
                  key={title}
                  className="glass-card-hover"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    background: '#ffffff',
                    padding: '14px 18px',
                    borderRadius: 12,
                    border: '1px solid rgba(11, 61, 46, 0.09)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: 'rgba(11, 61, 46, 0.08)',
                      color: 'var(--color-forest)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {title}
                      </h4>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-forest)', background: '#EAF6EF', padding: '2px 8px', borderRadius: 12 }}>
                        {stat}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12.5, color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', gap: 24, paddingTop: 8, borderTop: '1px solid rgba(11, 61, 46, 0.1)' }}>
              <div>
                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-forest)', display: 'block', lineHeight: 1 }}>
                  50,000+
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
                  Active Farmers
                </span>
              </div>
              <div style={{ width: 1, height: 32, background: 'rgba(11, 61, 46, 0.1)' }} />
              <div>
                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-amber)', display: 'block', lineHeight: 1 }}>
                  ₹2.4 Cr+
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
                  Direct Cost Saved
                </span>
              </div>
              <div style={{ width: 1, height: 32, background: 'rgba(11, 61, 46, 0.1)' }} />
              <div>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#1A7A4A', display: 'block', lineHeight: 1 }}>
                  100%
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
                  CIB&amp;RC Certified
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Portal Gateway Selector */}
          <div
            className="glass-saas-card"
            style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: '32px 28px',
              border: '1px solid rgba(11, 61, 46, 0.1)',
              boxShadow: '0 20px 50px -10px rgba(11, 61, 46, 0.12)',
            }}
          >
            <div style={{ marginBottom: 20, textAlign: 'center' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'var(--color-forest)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 4px 12px rgba(11, 61, 46, 0.25)',
                }}
              >
                <Leaf size={24} strokeWidth={2} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 6px' }}>
                Select Your Access Portal
              </h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
                Choose your role to launch the dedicated environment
              </p>
            </div>

            {/* Role Gateway Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {ROLES_LIST.map((r) => {
                const Icon = r.icon;
                return (
                  <Link
                    key={r.role}
                    href={r.path}
                    className="glass-card-hover"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'var(--color-neutral-50)',
                      border: '1px solid var(--color-divider)',
                      textDecoration: 'none',
                      color: 'var(--color-text-primary)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: r.bgColor,
                        color: r.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} strokeWidth={2.2} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {r.role}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)' }}>
                        {r.desc}
                      </div>
                    </div>
                    <ArrowRight size={16} strokeWidth={2} color="var(--color-text-tertiary)" />
                  </Link>
                );
              })}
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                href="/login"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'var(--color-forest)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(11, 61, 46, 0.2)',
                }}
              >
                <span>Sign In with Demo Account</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <Link
                href="/signup"
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: 10,
                  background: '#ffffff',
                  color: 'var(--color-forest)',
                  border: '1.5px solid var(--color-forest)',
                  textDecoration: 'none',
                  fontSize: 13.5,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span>Create New Farmer Account</span>
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
