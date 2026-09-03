'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useCartStore } from '@/features/cart/store';
import { useOrdersStore } from '@/features/orders/store';
import { MOCK_ADDRESSES } from '@/lib/mock-data';


function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / Google Pay / PhonePe', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
];

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, totalAmount, clearCart } = useCartStore();
  const { placeOrder } = useOrdersStore();
  const router = useRouter();

  const [selectedAddressId, setSelectedAddressId] = useState(MOCK_ADDRESSES[0].id);
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [placing, setPlacing] = useState(false);

  const sub = subtotal();
  const fee = deliveryFee();
  const total = totalAmount();

  const selectedAddress = MOCK_ADDRESSES.find((a) => a.id === selectedAddressId) ?? MOCK_ADDRESSES[0];

  if (items.length === 0) {
    return (
      <AppShell>
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-icon">🛒</div>
          <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>Cart is empty</p>
          <Link href="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </AppShell>
    );
  }

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1200));
    const order = placeOrder(items, selectedAddress, PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.label ?? selectedPayment);
    clearCart();
    router.replace(`/checkout/confirmed?orderId=${order.id}`);
  };

  const SECTION_STYLE = {
    background: 'var(--color-surface)',
    borderRadius: 16,
    border: '1px solid var(--color-border)',
    padding: '20px',
    marginBottom: 16,
  };

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link href="/cart" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 20 }}>←</Link>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Checkout</h1>
        </div>

        {/* Progress indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
          {['Cart', 'Checkout', 'Confirmed'].map((step, i) => (
            <React.Fragment key={step}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: i <= 1 ? 'var(--color-forest)' : 'var(--color-neutral-200)',
                    color: i <= 1 ? '#fff' : 'var(--color-text-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {i < 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: i === 1 ? 700 : 500, color: i <= 1 ? 'var(--color-forest)' : 'var(--color-text-tertiary)' }}>
                  {step}
                </span>
              </div>
              {i < 2 && (
                <div style={{ flex: 1, height: 2, background: i < 1 ? 'var(--color-forest)' : 'var(--color-neutral-200)', margin: '0 8px' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="checkout-layout">
          <div>
            {/* Delivery address */}
            <div style={SECTION_STYLE}>
              <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700 }}>📍 Delivery Address</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_ADDRESSES.map((addr) => (
                  <label
                    key={addr.id}
                    id={`checkout-addr-${addr.id}`}
                    style={{
                      display: 'flex',
                      gap: 14,
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: `2px solid ${selectedAddressId === addr.id ? 'var(--color-forest)' : 'var(--color-border)'}`,
                      background: selectedAddressId === addr.id ? 'var(--color-brand-50)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      style={{ accentColor: 'var(--color-forest)', marginTop: 2 }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{addr.recipientName}</span>
                        <span className="badge badge-slate">{addr.tag}</span>
                        {addr.isDefault && <span className="badge badge-forest">Default</span>}
                      </div>
                      <p style={{ margin: '0 0 2px', fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        {addr.addressLine}, {addr.city}, {addr.state} {addr.pincode}
                      </p>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                        📞 {addr.phone}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div style={SECTION_STYLE}>
              <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700 }}>💳 Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.id}
                    id={`checkout-payment-${pm.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '13px 16px',
                      borderRadius: 12,
                      border: `2px solid ${selectedPayment === pm.id ? 'var(--color-forest)' : 'var(--color-border)'}`,
                      background: selectedPayment === pm.id ? 'var(--color-brand-50)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={pm.id}
                      checked={selectedPayment === pm.id}
                      onChange={() => setSelectedPayment(pm.id)}
                      style={{ accentColor: 'var(--color-forest)' }}
                    />
                    <span style={{ fontSize: 20 }}>{pm.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>{pm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order items summary */}
            <div style={SECTION_STYLE}>
              <h2 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 700 }}>📦 Order Items ({items.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item) => (
                  <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.product.title.slice(0, 35)}…</span>
                      <span style={{ color: 'var(--color-text-tertiary)', marginLeft: 6 }}>×{item.quantity}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--color-forest)' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary panel */}
          <div>
            <div className="card" style={{ padding: 20, position: 'sticky', top: 100 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700 }}>Bill Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Item Total</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(sub)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Delivery</span>
                  <span style={{ fontWeight: 600, color: fee === 0 ? 'var(--color-success)' : 'inherit' }}>
                    {fee === 0 ? 'FREE' : formatPrice(fee)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Discount</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>−₹0</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderTop: '2px solid var(--color-divider)',
                  marginBottom: 20,
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                <span>Total Payable</span>
                <span style={{ color: 'var(--color-forest)' }}>{formatPrice(total)}</span>
              </div>

              {/* Delivering to */}
              <div
                style={{
                  background: 'var(--color-canvas)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 16,
                  fontSize: 13,
                  color: 'var(--color-text-secondary)',
                }}
              >
                <strong>Delivering to:</strong>{' '}
                {selectedAddress.city}, {selectedAddress.state}
              </div>

              <button
                id="checkout-place-order-btn"
                onClick={handlePlaceOrder}
                disabled={placing}
                className="btn btn-primary btn-full"
                style={{ borderRadius: 12, padding: '14px 24px', fontSize: 16 }}
              >
                {placing ? 'Placing Order…' : `Place Order · ${formatPrice(total)}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .checkout-layout {
            grid-template-columns: 1fr 320px !important;
          }
        }
      `}</style>
    </AppShell>
  );
}
