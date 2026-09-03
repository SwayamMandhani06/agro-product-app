'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';

export default function SignupPage() {
  const { signUp, status, error, clearError } = useAuthStore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === 'authenticated') router.replace('/home');
  }, [status, router]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (!identifier.trim()) errs.identifier = 'Email or phone is required.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 6) errs.password = 'Minimum 6 characters.';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    await signUp(name.trim(), identifier.trim(), password);
  };

  const fields = [
    {
      id: 'signup-name',
      label: 'Full Name',
      value: name,
      setter: setName,
      type: 'text',
      placeholder: 'e.g. Ramesh Kumar',
      errorKey: 'name',
      autoComplete: 'name',
    },
    {
      id: 'signup-identifier',
      label: 'Email or Phone',
      value: identifier,
      setter: setIdentifier,
      type: 'text',
      placeholder: 'email@example.com or 9876543210',
      errorKey: 'identifier',
      autoComplete: 'username',
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
      <div style={{ width: '100%', maxWidth: 480, marginBottom: 16 }}>
        <Link href="/welcome" style={{ color: 'var(--color-forest)', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
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
            Create Account
          </h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Join AgriTrade and buy smarter
          </p>
        </div>

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
          {fields.map((f) => (
            <div key={f.id}>
              <label
                htmlFor={f.id}
                style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}
              >
                {f.label}
              </label>
              <input
                id={f.id}
                type={f.type}
                value={f.value}
                onChange={(e) => { f.setter(e.target.value); clearError(); }}
                placeholder={f.placeholder}
                className={`input-base ${fieldErrors[f.errorKey] ? 'input-error' : ''}`}
                autoComplete={f.autoComplete}
              />
              {fieldErrors[f.errorKey] && (
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-error)' }}>{fieldErrors[f.errorKey]}</p>
              )}
            </div>
          ))}

          {/* Password */}
          <div>
            <label htmlFor="signup-password" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                placeholder="Minimum 6 characters"
                className={`input-base ${fieldErrors.password ? 'input-error' : ''}`}
                style={{ paddingRight: 48 }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', fontSize: 18, display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {fieldErrors.password && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-error)' }}>{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="signup-confirm" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
              Confirm Password
            </label>
            <input
              id="signup-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
              placeholder="Re-enter password"
              className={`input-base ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
              autoComplete="new-password"
            />
            {fieldErrors.confirmPassword && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-error)' }}>{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            id="signup-submit-btn"
            disabled={status === 'loading'}
            className="btn btn-primary btn-full"
            style={{ marginTop: 8, padding: '14px 24px', fontSize: 16, borderRadius: 12 }}
          >
            {status === 'loading' ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--color-forest)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
