'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import { Leaf, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';

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
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 9, borderBottom: '1px solid var(--color-divider)', background: '#fff' }}>
        <Link href="/welcome" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500, marginRight: 12 }}>
          <ArrowLeft size={16} strokeWidth={2} />
          Back
        </Link>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <Leaf size={14} strokeWidth={2.2} />
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-forest)', letterSpacing: '-0.2px' }}>AGRI TRADE</span>
      </header>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--color-surface)',
          borderRadius: 12,
          padding: '32px 28px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-divider)',
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.3px' }}>
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
          {fields.map((f) => (
            <div key={f.id}>
              <label
                htmlFor={f.id}
                style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}
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
            <label htmlFor="signup-password" style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
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
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                {showPassword ? <EyeOff size={17} strokeWidth={2} /> : <Eye size={17} strokeWidth={2} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-error)' }}>{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="signup-confirm" style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
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
            style={{ marginTop: 6, padding: '13px 24px', fontSize: 15 }}
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
      </div>
    </div>
  );
}
