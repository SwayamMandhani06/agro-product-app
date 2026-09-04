'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import type { UserPlatformRole } from '@/types';
import {
  Leaf,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  Sprout,
  Store,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';

interface RolePortalConfig {
  id: UserPlatformRole;
  label: string;
  shortTitle: string;
  badge: string;
  Icon: React.ElementType;
  heading: string;
  subheading: string;
  demoEmail: string;
  demoPass: string;
  demoName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  targetPath: string;
}

const ROLE_PORTALS: RolePortalConfig[] = [
  {
    id: 'farmer',
    label: 'Farmer',
    shortTitle: 'Farmer Portal',
    badge: 'BUYER & GROWER',
    Icon: Sprout,
    heading: 'Farmer Account Login',
    subheading: 'Purchase certified seeds & nutrition, monitor live mandi rates, and track consignments',
    demoEmail: 'farmer@agritrade.in',
    demoPass: 'farmer123',
    demoName: 'Rahul Sharma (Nashik)',
    color: '#0B3D2E',
    bgColor: '#EAF6EF',
    borderColor: '#9FD4B0',
    targetPath: '/home',
  },
  {
    id: 'seller',
    label: 'Seller',
    shortTitle: 'Seller Portal',
    badge: 'SUPPLIER & VENDOR',
    Icon: Store,
    heading: 'Seller Marketplace Portal',
    subheading: 'Manage catalog inventory, fulfill farmer consignments, and reconcile bank payouts',
    demoEmail: 'seller@agritrade.in',
    demoPass: 'seller123',
    demoName: 'Maharashtra Krishi Kendra',
    color: '#D97706',
    bgColor: '#FFF3E0',
    borderColor: '#FFB46A',
    targetPath: '/seller/dashboard',
  },
  {
    id: 'cooperative_manager',
    label: 'Cooperative',
    shortTitle: 'Cooperative Portal',
    badge: 'GROUP PROCUREMENT',
    Icon: Users,
    heading: 'Cooperative Procurement Portal',
    subheading: 'Aggregate collective farmer volume, manage bulk campaigns, and negotiate tiered factory discounts',
    demoEmail: 'coop@agritrade.in',
    demoPass: 'coop123',
    demoName: 'Suresh Patil (FPO Manager)',
    color: '#1B6BAA',
    bgColor: '#DCEEFD',
    borderColor: '#93C5FD',
    targetPath: '/cooperative/campaigns',
  },
  {
    id: 'admin',
    label: 'Admin',
    shortTitle: 'Admin Console',
    badge: 'PLATFORM GOVERNANCE',
    Icon: ShieldCheck,
    heading: 'Platform Admin Desk',
    subheading: 'Verify merchant licensing, moderate input catalog compliance, mediate disputes, and inspect audit logs',
    demoEmail: 'admin@agritrade.in',
    demoPass: 'admin123',
    demoName: 'Platform Administrator',
    color: '#991B1B',
    bgColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    targetPath: '/admin/dashboard',
  },
];

export default function LoginPage() {
  const { signIn, status, user, error, clearError } = useAuthStore();
  const router = useRouter();

  const [activeRole, setActiveRole] = useState<UserPlatformRole>('farmer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePortal = ROLE_PORTALS.find((p) => p.id === activeRole) ?? ROLE_PORTALS[0];

  useEffect(() => {
    if (status === 'authenticated' && user) {
      if (user.role === 'seller') {
        router.replace('/seller/dashboard');
      } else if (user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else if (user.role === 'cooperative_manager') {
        router.replace('/cooperative/campaigns');
      } else {
        router.replace('/home');
      }
    }
  }, [status, user, router]);

  useEffect(() => {
    // When switching tabs, clear errors and populate identifier placeholder
    setFieldErrors({});
    clearError();
  }, [activeRole, clearError]);

  const validate = () => {
    const errs: typeof fieldErrors = {};
    if (!identifier.trim()) errs.identifier = 'Email address or mobile phone is required.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await signIn(identifier.trim(), password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstantDemoLogin = async (portal: RolePortalConfig) => {
    setIdentifier(portal.demoEmail);
    setPassword(portal.demoPass);
    setFieldErrors({});
    clearError();
    setIsSubmitting(true);
    try {
      await signIn(portal.demoEmail, portal.demoPass);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(11, 61, 46, 0.08)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Link
          href="/welcome"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--color-forest)',
            textDecoration: 'none',
            fontSize: 13.5,
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} strokeWidth={2.2} /> Back to Welcome
        </Link>

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Leaf size={16} strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-forest)', letterSpacing: '-0.3px' }}>
            AGRI TRADE
          </span>
        </Link>

        <span
          style={{
            fontSize: 12,
            color: 'var(--color-text-secondary)',
            display: 'none',
          }}
          className="desktop-support-tag"
        >
          Dedicated Agricultural Multi-Role Access
        </span>
      </header>

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 520 }}>

          {/* Role Portal Selector Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 6,
              background: 'rgba(255, 255, 255, 0.7)',
              padding: 6,
              borderRadius: 12,
              border: '1px solid rgba(11, 61, 46, 0.1)',
              marginBottom: 16,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            }}
          >
            {ROLE_PORTALS.map((portal) => {
              const active = activeRole === portal.id;
              const Icon = portal.Icon;
              return (
                <button
                  key={portal.id}
                  type="button"
                  onClick={() => {
                    setActiveRole(portal.id);
                    setIdentifier('');
                    setPassword('');
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 5,
                    padding: '10px 4px',
                    borderRadius: 8,
                    border: 'none',
                    background: active ? '#ffffff' : 'transparent',
                    boxShadow: active ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: active ? portal.color : 'var(--color-text-secondary)',
                  }}
                >
                  <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
                  <span style={{ fontSize: 11.5, fontWeight: active ? 700 : 500 }}>
                    {portal.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Login Card */}
          <div
            className="glass-saas-card"
            style={{
              borderRadius: 16,
              padding: '32px 30px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 40px -10px rgba(11, 61, 46, 0.1)',
              background: '#ffffff',
            }}
          >
            {/* Header Badge & Title */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    color: activePortal.color,
                    background: activePortal.bgColor,
                    padding: '3px 9px',
                    borderRadius: 20,
                    border: `1px solid ${activePortal.borderColor}`,
                  }}
                >
                  {activePortal.badge}
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)' }}>
                  Redirects to {activePortal.targetPath}
                </span>
              </div>
              <h1
                style={{
                  margin: '0 0 6px',
                  fontSize: 22,
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.3px',
                }}
              >
                {activePortal.heading}
              </h1>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 13, lineHeight: 1.45 }}>
                {activePortal.subheading}
              </p>
            </div>

            {/* Instant One-Click Demo Button */}
            <div
              style={{
                marginBottom: 24,
                padding: '14px 16px',
                borderRadius: 10,
                background: activePortal.bgColor,
                border: `1px solid ${activePortal.borderColor}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: activePortal.color, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Sparkles size={14} /> Quick Demo Credentials
                </span>
                <span style={{ fontSize: 11, color: activePortal.color, fontWeight: 500 }}>
                  {activePortal.demoName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleInstantDemoLogin(activePortal)}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: 7,
                  background: activePortal.color,
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  transition: 'opacity 0.2s',
                }}
              >
                <span>Instant Sign In as {activePortal.label}</span>
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                margin: '20px 0',
                color: 'var(--color-text-tertiary)',
                fontSize: 12,
              }}
            >
              <div style={{ flex: 1, height: 1, background: 'var(--color-divider)' }} />
              <span>or enter custom credentials</span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-divider)' }} />
            </div>

            {/* Error banner */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--color-error-light)',
                  color: 'var(--color-error)',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 18,
                  border: '1px solid rgba(183, 43, 43, 0.2)',
                }}
              >
                <AlertCircle size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="identifier"
                  style={{
                    display: 'block',
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: 6,
                  }}
                >
                  Email or Registered Mobile *
                </label>
                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder={activePortal.demoEmail}
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (fieldErrors.identifier) setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: fieldErrors.identifier ? '1.5px solid var(--color-error)' : '1px solid var(--color-divider)',
                    fontSize: 14,
                    color: 'var(--color-text-primary)',
                    background: '#ffffff',
                    outline: 'none',
                    transition: 'border-color var(--motion-fast)',
                  }}
                />
                {fieldErrors.identifier && (
                  <span style={{ fontSize: 12, color: 'var(--color-error)', marginTop: 4, display: 'block' }}>
                    {fieldErrors.identifier}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label
                    htmlFor="password"
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    Password *
                  </label>
                  <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                    Default: {activePortal.demoPass}
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 42px 10px 14px',
                      borderRadius: 8,
                      border: fieldErrors.password ? '1.5px solid var(--color-error)' : '1px solid var(--color-divider)',
                      fontSize: 14,
                      color: 'var(--color-text-primary)',
                      background: '#ffffff',
                      outline: 'none',
                      transition: 'border-color var(--motion-fast)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 2,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span style={{ fontSize: 12, color: 'var(--color-error)', marginTop: 4, display: 'block' }}>
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: 8,
                  background: 'var(--color-forest)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: 'var(--shadow-sm)',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                <Lock size={15} />
                <span>{isSubmitting ? 'Verifying Credentials…' : `Sign In to ${activePortal.shortTitle}`}</span>
              </button>
            </form>

            {/* Footer notice */}
            <div style={{ marginTop: 22, textAlign: 'center', borderTop: '1px solid var(--color-divider)', paddingTop: 16 }}>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                Don&apos;t have an account yet?{' '}
                <Link
                  href="/signup"
                  style={{ color: 'var(--color-forest)', fontWeight: 700, textDecoration: 'none' }}
                >
                  Create Farmer Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
