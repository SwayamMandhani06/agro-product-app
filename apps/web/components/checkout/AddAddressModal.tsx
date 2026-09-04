'use client';

import React, { useState } from 'react';
import { X, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAddressStore } from '@/features/address/address-store';
import type { DeliveryAddress } from '@/types';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (address: DeliveryAddress) => void;
}

export default function AddAddressModal({ isOpen, onClose, onSuccess }: AddAddressModalProps) {
  const addAddress = useAddressStore((s) => s.addAddress);

  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [tag, setTag] = useState<'Home' | 'Farm Gate' | 'Warehouse' | 'Work'>('Farm Gate');
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      setError('Please enter the recipient / farmer name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!addressLine.trim()) {
      setError('Please specify village, taluka, or farm landmark.');
      return;
    }
    if (!city.trim()) {
      setError('Please specify the district / nearest mandi town.');
      return;
    }
    if (!pincode.trim() || pincode.trim().length !== 6) {
      setError('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    const created = addAddress({
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      tag,
      isDefault,
    });

    if (onSuccess) {
      onSuccess(created);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        className="slide-up"
        style={{
          background: '#ffffff',
          borderRadius: 14,
          maxWidth: 520,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--color-divider)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-divider)',
            background: 'var(--color-neutral-50)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(11, 61, 46, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-forest)',
              }}
            >
              <MapPin size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Add Delivery Address
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                Consignments dispatched directly to your farm gate or hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 5 }}>
                Farmer / Recipient Name *
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Rahul Sharma"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 5 }}>
                Mobile Phone Number *
              </label>
              <input
                type="tel"
                className="input"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 5 }}>
              Farm Gate / Village / Street Address *
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Gut No. 42, Near Cooperative Ginning Mill, Dindori Road"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', fontSize: 13 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 5 }}>
                District / Town *
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Nashik"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 5 }}>
                State *
              </label>
              <select
                className="input"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{ width: '100%', padding: '9px 10px', fontSize: 13, background: '#fff' }}
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 5 }}>
                PIN Code *
              </label>
              <input
                type="text"
                className="input"
                placeholder="422003"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
              Address Tag
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['Farm Gate', 'Home', 'Warehouse', 'Work'] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTag(t)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: tag === t ? '1.5px solid var(--color-forest)' : '1px solid var(--color-divider)',
                    background: tag === t ? 'rgba(11, 61, 46, 0.08)' : '#fff',
                    color: tag === t ? 'var(--color-forest)' : 'var(--color-text-secondary)',
                    fontWeight: tag === t ? 700 : 500,
                    fontSize: 12.5,
                    cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--color-forest)', cursor: 'pointer' }}
            />
            <label htmlFor="isDefault" style={{ fontSize: 13, color: 'var(--color-text-primary)', cursor: 'pointer' }}>
              Set as primary default delivery destination
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: '8px 16px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ padding: '8px 20px', gap: 6 }}
            >
              <CheckCircle size={15} /> Save Delivery Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
