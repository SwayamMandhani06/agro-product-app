'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';

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

  const fillDemo = () => {
    setIdentifier('farmer@agritrade.in');
    setPassword('farmer123');
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      {/* Back link */}
      <div style={{ width: '100%', maxWidth: 480, marginBottom: 16 }}>
        <Link
          href="/welcome"
          style={{ color: 'var(--color-forest)', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}
        >
          ← Back
        </Link>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--color-surface)',
          borderRadius: 20,
          padding: '32px 28px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              margin: '0 auto 16px',
            }}
          >
            🌿
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Welcome Back
          </h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Sign in to your AgriTrade account
          </p>
        </div>

        {/* Demo pill */}
        <button
          type="button"
          onClick={fillDemo}
          id="login-demo-btn"
          style={{
            width: '100%',
            padding: '10px 16px',
            background: 'var(--color-brand-50)',
            border: '1px solid var(--color-brand-100)',
            borderRadius: 10,
            cursor: 'pointer',
            marginBottom: 20,
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-forest)',
            transition: 'all 150ms ease',
          }}
        >
          🌾 Use Demo Farmer Credentials
        </button>

        {/* Error banner */}
        {error && (
          <div
            style={{
              background: 'var(--color-error-light)',
              border: '1px solid var(--color-error)',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 20,
              fontSize: 13,
              color: 'var(--color-error)',
              fontWeight: 500,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email / Phone */}
          <div>
            <label
              htmlFor="login-identifier"
              style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}
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
              style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}
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
                style={{ paddingRight: 48 }}
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
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? '🙈' : '👁️'}
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
            style={{ marginTop: 8, padding: '14px 24px', fontSize: 16, borderRadius: 12 }}
          >
            {status === 'loading' ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--color-forest)', fontWeight: 600, textDecoration: 'none' }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
