'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import { Leaf, Eye, EyeOff, ArrowLeft, AlertCircle, Sprout } from 'lucide-react';

export default function LoginPage() {
  const { signIn, status, error, clearError } = useAuthStore();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});

  useEffect(() => {
    if (status === 'authenticated') router.replace('/home');
  }, [status, router]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validate = () => {
    const errs: typeof fieldErrors = {};
    if (!identifier.trim()) errs.identifier = 'Email or phone is required.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    await signIn(identifier.trim(), password);
  };

  const fillDemo = (email = 'farmer@agritrade.in', pass = 'farmer123') => {
    setIdentifier(email);
    setPassword(pass);
    setFieldErrors({});
    clearError();
  };

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
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          borderBottom: '1px solid var(--color-divider)',
          background: '#fff',
        }}
      >
        <Link
          href="/welcome"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
            marginRight: 12,
          }}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back
        </Link>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'var(--color-forest)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <Leaf size={14} strokeWidth={2.2} />
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-forest)', letterSpacing: '-0.2px' }}>
          AGRI TRADE
        </span>
      </header>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Card */}
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '32px 28px',
              border: '1px solid var(--color-divider)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <h1
                style={{
                  margin: '0 0 6px',
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.3px',
                }}
              >
                Sign In
              </h1>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>
                Access your AgriTrade farmer account
              </p>
            </div>

            {/* Demo Personas Grid */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Quick Demo Accounts
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>No signup required</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                <button
                  type="button"
                  id="login-demo-farmer-btn"
                  onClick={() => fillDemo('farmer@agritrade.in', 'farmer123')}
                  style={{
                    padding: '8px 10px',
                    background: 'var(--color-brand-50)',
                    border: '1px solid var(--color-brand-100)',
                    borderRadius: 6,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-forest)' }}>Farmer</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>farmer@agritrade.in</div>
                </button>
                <button
                  type="button"
                  id="login-demo-seller-btn"
                  onClick={() => fillDemo('seller@agritrade.in', 'seller123')}
                  style={{
                    padding: '8px 10px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: 6,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1e40af' }}>Seller</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>seller@agritrade.in</div>
                </button>
                <button
                  type="button"
                  id="login-demo-coop-btn"
                  onClick={() => fillDemo('coop@agritrade.in', 'coop123')}
                  style={{
                    padding: '8px 10px',
                    background: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    borderRadius: 6,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6b21a8' }}>Cooperative</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>coop@agritrade.in</div>
                </button>
                <button
                  type="button"
                  id="login-demo-admin-btn"
                  onClick={() => fillDemo('admin@agritrade.in', 'admin123')}
                  style={{
                    padding: '8px 10px',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: 6,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e' }}>Admin</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>admin@agritrade.in</div>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div
                style={{
                  background: 'var(--color-error-light)',
                  border: '1px solid var(--color-error)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginBottom: 20,
                  fontSize: 13,
                  color: 'var(--color-error)',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                }}
              >
                <AlertCircle size={15} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Email / Phone */}
              <div>
                <label
                  htmlFor="login-identifier"
                  style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}
                >
                  Email or Phone
                </label>
                <input
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); clearError(); }}
                  placeholder="farmer@agritrade.in or 9876543210"
                  className={`input-base ${fieldErrors.identifier ? 'input-error' : ''}`}
                  autoComplete="username"
                />
                {fieldErrors.identifier && (
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-error)' }}>{fieldErrors.identifier}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="login-password"
                  style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    placeholder="Enter your password"
                    className={`input-base ${fieldErrors.password ? 'input-error' : ''}`}
                    style={{ paddingRight: 44 }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
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
                      padding: 0,
                    }}
                  >
                    {showPassword
                      ? <EyeOff size={17} strokeWidth={2} />
                      : <Eye size={17} strokeWidth={2} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-error)' }}>{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="login-submit-btn"
                disabled={status === 'loading'}
                className="btn btn-primary btn-full"
                style={{ marginTop: 6, padding: '13px 24px', fontSize: 15 }}
              >
                {status === 'loading' ? 'Signing In…' : 'Sign In'}
              </button>
            </form>

            {/* Footer */}
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                Don&apos;t have an account?{' '}
                <Link href="/signup" style={{ color: 'var(--color-forest)', fontWeight: 600, textDecoration: 'none' }}>
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
