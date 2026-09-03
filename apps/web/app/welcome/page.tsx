'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import { Leaf, Sprout, TrendingDown, Truck, ChevronRight } from 'lucide-react';

const VALUE_PROPS = [
  {
    Icon: Sprout,
    title: 'Certified Seeds & Inputs',
    desc: 'Sourced directly from verified agri-companies and government-approved suppliers.',
  },
  {
    Icon: TrendingDown,
    title: 'Farm-Gate Pricing',
    desc: 'Best prices updated daily with live mandi rate tracking for your region.',
  },
  {
    Icon: Truck,
    title: 'Doorstep Delivery',
    desc: 'Free delivery on orders above ₹1,000. Same-day dispatch from local hubs.',
  },
];

export default function WelcomePage() {
  const { status } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') router.replace('/home');
  }, [status, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-canvas)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          borderBottom: '1px solid var(--color-divider)',
          background: '#fff',
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: 'var(--color-forest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <Leaf size={16} strokeWidth={2.2} />
        </div>
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--color-forest)',
            letterSpacing: '-0.2px',
          }}
        >
          AGRI TRADE
        </span>
      </header>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          maxWidth: 560,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#fff',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <Leaf size={32} strokeWidth={1.8} />
          </div>
          <h1
            style={{
              margin: '0 0 10px',
              fontSize: 32,
              fontWeight: 800,
              color: 'var(--color-forest)',
              letterSpacing: '-0.5px',
            }}
          >
            AGRI TRADE
          </h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 16, lineHeight: 1.5 }}>
            India&apos;s Farmer-First Agricultural Marketplace
          </p>
        </div>

        {/* Value propositions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            width: '100%',
            marginBottom: 36,
          }}
        >
          {VALUE_PROPS.map(({ Icon, title, desc }) => (
            <div
              key={title}
              style={{
                display: 'flex',
                gap: 14,
                background: '#fff',
                borderRadius: 10,
                padding: '14px 16px',
                border: '1px solid var(--color-divider)',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
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
              <div>
                <p
                  style={{
                    margin: '0 0 3px',
                    fontWeight: 700,
                    fontSize: 14,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {title}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          <Link
            href="/login"
            id="welcome-signin-btn"
            className="btn btn-primary btn-full"
            style={{ justifyContent: 'space-between', padding: '13px 20px' }}
          >
            <span>Sign In</span>
            <ChevronRight size={18} strokeWidth={2.5} />
          </Link>
          <Link
            href="/signup"
            id="welcome-signup-btn"
            className="btn btn-secondary btn-full"
            style={{ justifyContent: 'space-between', padding: '12px 20px' }}
          >
            <span>Create Account</span>
            <ChevronRight size={18} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Demo note */}
        <p
          style={{
            marginTop: 24,
            fontSize: 12,
            color: 'var(--color-text-tertiary)',
            textAlign: 'center',
          }}
        >
          Demo credentials available on the Sign In screen
        </p>
      </div>
    </div>
  );
}
