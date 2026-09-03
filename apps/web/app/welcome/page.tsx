'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';

export default function WelcomePage() {
  const { status } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/home');
    }
  }, [status, router]);

  const VALUE_PROPS = [
    {
      icon: '🌱',
      title: 'Certified Seeds & Inputs',
      desc: 'Sourced directly from verified agri-companies and government-approved suppliers.',
    },
    {
      icon: '💰',
      title: 'Farm-Gate Pricing',
      desc: 'Best prices updated daily with live mandi rate tracking for your region.',
    },
    {
      icon: '🚛',
      title: 'Doorstep Delivery',
      desc: 'Free delivery on orders above ₹1,000. Same-day dispatch from local hubs.',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-canvas)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: 'var(--color-forest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            margin: '0 auto 20px',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          🌿
        </div>
        <h1
          style={{
            margin: '0 0 8px',
            fontSize: 32,
            fontWeight: 800,
            color: 'var(--color-forest)',
            letterSpacing: '-0.5px',
          }}
        >
          AGRI TRADE
        </h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 16 }}>
          India&apos;s Farmer-First Agri Marketplace
        </p>
      </div>

      {/* Value props */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: '100%',
          maxWidth: 480,
          marginBottom: 40,
        }}
      >
        {VALUE_PROPS.map((vp) => (
          <div
            key={vp.title}
            style={{
              display: 'flex',
              gap: 16,
              background: 'var(--color-surface)',
              borderRadius: 16,
              padding: '16px 20px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: 28, flexShrink: 0 }}>{vp.icon}</div>
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: 'var(--color-text-primary)' }}>
                {vp.title}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                {vp.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link
          href="/login"
          id="welcome-signin-btn"
          className="btn btn-primary btn-full"
          style={{ borderRadius: 14, padding: '15px 24px', fontSize: 17 }}
        >
          Sign In to Your Account
        </Link>
        <Link
          href="/signup"
          id="welcome-signup-btn"
          className="btn btn-secondary btn-full"
          style={{ borderRadius: 14, padding: '14px 24px', fontSize: 17 }}
        >
          Create New Account
        </Link>
      </div>

      {/* Demo hint */}
      <div
        style={{
          marginTop: 24,
          padding: '12px 20px',
          background: 'var(--color-brand-50)',
          borderRadius: 12,
          border: '1px solid var(--color-brand-100)',
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-forest)', fontWeight: 500 }}>
          🌾 Demo account: <strong>farmer@agritrade.in</strong> / <strong>farmer123</strong>
        </p>
      </div>
    </div>
  );
}
