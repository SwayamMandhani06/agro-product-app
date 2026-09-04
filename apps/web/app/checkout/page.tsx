'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useCartStore } from '@/features/cart/store';
import { useOrdersStore } from '@/features/orders/store';
import { useNotificationsStore } from '@/features/notifications/notifications-store';
import { paymentService } from '@/features/payments/payment-service';
import type { PaymentMethod, PaymentProvider } from '@/features/payments/types';
import { useAddressStore } from '@/features/address/address-store';
import AddAddressModal from '@/components/checkout/AddAddressModal';
import { MOCK_ADDRESSES } from '@/lib/mock-data';
import {
  ArrowLeft,
  ShoppingCart,
  MapPin,
  Phone,
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Lock,
  Zap,
  Plus,
  Leaf,
  CheckCircle2,
} from 'lucide-react';

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

interface PaymentOption {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number; color?: string }>;
  provider: PaymentProvider;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'upi',
    title: 'UPI / QR Instant Pay',
    subtitle: 'Google Pay, PhonePe, Paytm, BHIM (Razorpay Test Mode)',
    badge: 'INSTANT',
    badgeColor: '#166534',
    Icon: Smartphone,
    provider: 'razorpay_test',
  },
  {
    id: 'card',
    title: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard, RuPay test cards (3D Secure)',
    Icon: CreditCard,
    provider: 'razorpay_test',
  },
  {
    id: 'demo',
    title: 'AgriTrade Instant Sandbox',
    subtitle: 'Deterministic test payment simulation (Zero external dependencies)',
    badge: 'EVALUATOR DEMO',
    badgeColor: '#92400E',
    Icon: Zap,
    provider: 'demo',
  },
  {
    id: 'cod',
    title: 'Cash on Farm Delivery',
    subtitle: 'Inspect seeds & germination seal at your doorstep before paying',
    badge: 'FARM GATE',
    badgeColor: '#1e3a8a',
    Icon: Banknote,
    provider: 'cod',
  },
];

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, totalAmount, clearCart } = useCartStore();
  const { placeOrder } = useOrdersStore();
  const { addNotification } = useNotificationsStore();
  const router = useRouter();

  const { addresses, selectedAddressId, selectAddress } = useAddressStore();
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('upi');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');

  // Transaction States: 'idle' | 'processing' | 'failed' | 'cancelled'
  const [txState, setTxState] = useState<'idle' | 'processing' | 'failed' | 'cancelled'>('idle');
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const sub = subtotal();
  const fee = deliveryFee();
  const total = totalAmount();
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0] ?? MOCK_ADDRESSES[0];
  const activePaymentOption = PAYMENT_OPTIONS.find((p) => p.id === selectedPaymentMethod) ?? PAYMENT_OPTIONS[0];

  if (items.length === 0 && txState === 'idle') {
    return (
      <AppShell>
        <div className="container-app" style={{ paddingTop: 60, paddingBottom: 40 }}>
          <div className="empty-state" style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--color-brand-50, #f0fdf4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--color-forest)',
              }}
            >
              <ShoppingCart size={28} strokeWidth={1.75} />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 20, margin: '0 0 8px' }}>Your Cart is Empty</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, margin: '0 0 20px' }}>
              Select certified seed lots or nutrition inputs to proceed to secure checkout.
            </p>
            <Link href="/products" className="btn btn-primary" style={{ padding: '10px 22px' }}>
              Explore Inputs Catalog
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleInitiatePayment = async () => {
    if (txState === 'processing') return; // Prevent double-clicking

    setTxState('processing');
    setErrorMessage('');
    setProcessingStep('Validating consignment inventory & farm gate address...');

    const tempOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setCurrentOrderId(tempOrderId);

    try {
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStep(
        activePaymentOption.provider === 'cod'
          ? 'Confirming cash on delivery booking...'
          : activePaymentOption.provider === 'razorpay_test'
          ? 'Opening Razorpay Test Mode Gateway...'
          : 'Connecting to AgriTrade Test Sandbox...'
      );

      // Execute through unified Payment Service
      const result = await paymentService.executePayment({
        orderId: tempOrderId,
        userId: 'usr_default',
        amount: total,
        currency: 'INR',
        method: selectedPaymentMethod,
        provider: activePaymentOption.provider,
        customerName: selectedAddress.recipientName,
        customerEmail: 'farmer@agritrade.in',
        customerPhone: selectedAddress.phone,
        address: selectedAddress,
        items: items,
        simulateFailure: simulateFailure,
      });

      if (result.cancelled) {
        setTxState('cancelled');
        setErrorMessage(result.failureReason || 'Payment checkout was cancelled by the user.');
        return;
      }

      if (!result.success || !result.transaction) {
        setTxState('failed');
        setErrorMessage(result.failureReason || 'Transaction could not be completed. Please retry.');
        return;
      }

      // Step 3: Payment verified, finalize order
      setProcessingStep('Payment authorized. Generating delivery consignment...');
      await new Promise((r) => setTimeout(r, 500));

      const finalOrder = placeOrder(
        items,
        selectedAddress,
        activePaymentOption.title
      );

      // Trigger realtime notification alert
      addNotification({
        userId: 'usr_default',
        title: selectedPaymentMethod === 'cod' ? 'COD Order Booked' : 'Payment Confirmed',
        body: `Consignment #${finalOrder.id} confirmed for ₹${total.toLocaleString('en-IN')}. Tracking initiated.`,
        type: 'orders',
        actionRoute: `/orders/${finalOrder.id}`,
      });

      // Clear cart only after successful order placement
      clearCart();
      router.replace(`/checkout/confirmed?orderId=${finalOrder.id}&txnId=${result.transaction.id}`);
    } catch (err) {
      setTxState('failed');
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred during checkout.');
    }
  };

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 28, paddingBottom: 64 }}>
        {/* Breadcrumb & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              href="/cart"
              style={{
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <ArrowLeft size={16} strokeWidth={2} /> Back to Cart
            </Link>
            <span style={{ color: 'var(--color-border)' }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Secure Transaction Checkout
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#166534', background: '#F0FDF4', padding: '4px 10px', borderRadius: 20, border: '1px solid #BBF7D0' }}>
            <ShieldCheck size={14} />
            <span style={{ fontWeight: 600 }}>Test Mode &amp; Sandbox Verified</span>
          </div>
        </div>

        {/* Cancellation or Failure Alert Banner */}
        {txState === 'cancelled' && (
          <div
            className="slide-up"
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              color: '#92400E',
              fontSize: 13,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} />
              <span>{errorMessage} Your items are safely saved in your cart.</span>
            </div>
            <button
              onClick={() => setTxState('idle')}
              style={{ background: 'none', border: 'none', color: '#92400E', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {txState === 'failed' && (
          <div
            className="slide-up"
            style={{
              padding: '14px 18px',
              borderRadius: 8,
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <AlertCircle size={18} style={{ marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5 }}>Payment Transaction Failed</p>
                <p style={{ margin: '3px 0 10px', fontSize: 12.5, color: '#7F1D1D' }}>{errorMessage}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={handleInitiatePayment}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      background: '#991B1B',
                      color: '#fff',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <RefreshCw size={12} /> Retry Transaction
                  </button>
                  <button
                    onClick={() => {
                      setTxState('idle');
                      setSimulateFailure(false);
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      background: '#fff',
                      color: '#991B1B',
                      border: '1px solid #FCA5A5',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Choose Another Method
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Checkout Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28,
            alignItems: 'flex-start',
          }}
        >
          {/* ============================================================
              LEFT COLUMN: Address & Payment Selection
              ============================================================ */}
          <div>
            {/* Step 1: Delivery Address */}
            <div
              style={{
                background: 'var(--color-surface)',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                padding: '20px',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'var(--color-forest)',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    1
                  </div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Farm Gate Delivery Destination</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 12px',
                    borderRadius: 6,
                    background: 'var(--color-brand-50, #f0fdf4)',
                    color: 'var(--color-forest)',
                    border: '1px solid #bbf7d0',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--motion-fast)',
                  }}
                >
                  <Plus size={13} strokeWidth={2.5} /> Add Address
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {addresses.map((addr) => {
                  const isSelected = addr.id === selectedAddressId;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => selectAddress(addr.id)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 8,
                        border: `1.5px solid ${isSelected ? 'var(--color-forest)' : 'var(--color-border)'}`,
                        background: isSelected ? 'var(--color-brand-50, #f0fdf4)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all var(--motion-fast)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: 13.5 }}>{addr.recipientName}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(0,0,0,0.06)', padding: '1px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                            {addr.tag}
                          </span>
                          {addr.isDefault && (
                            <span style={{ fontSize: 10, fontWeight: 700, background: '#e0e7ff', color: '#3730a3', padding: '1px 6px', borderRadius: 4 }}>
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? 'var(--color-forest)' : 'var(--color-border)'}`,
                            background: isSelected ? 'var(--color-forest)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSelected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                      </div>
                      <p style={{ margin: '2px 0 4px', fontSize: 12.5, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                        <MapPin size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                        {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                        <Phone size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
                        {addr.phone}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div
              style={{
                background: 'var(--color-surface)',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                padding: '20px',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'var(--color-forest)',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    2
                  </div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Select Payment Instrument</h2>
                </div>
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lock size={12} /> 256-Bit TLS
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PAYMENT_OPTIONS.map((opt) => {
                  const isSelected = opt.id === selectedPaymentMethod;
                  const Icon = opt.Icon;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedPaymentMethod(opt.id)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 8,
                        border: `1.5px solid ${isSelected ? 'var(--color-forest)' : 'var(--color-border)'}`,
                        background: isSelected ? 'var(--color-brand-50, #f0fdf4)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all var(--motion-fast)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 8,
                            background: isSelected ? 'var(--color-forest)' : 'var(--color-surface-variant)',
                            color: isSelected ? '#fff' : 'var(--color-text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={20} strokeWidth={2} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 700, fontSize: 13.5 }}>{opt.title}</span>
                            {opt.badge && (
                              <span
                                style={{
                                  fontSize: 9.5,
                                  fontWeight: 700,
                                  color: '#fff',
                                  background: opt.badgeColor || '#0B3D2E',
                                  padding: '1px 6px',
                                  borderRadius: 4,
                                  letterSpacing: '0.4px',
                                }}
                              >
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                            {opt.subtitle}
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: `2px solid ${isSelected ? 'var(--color-forest)' : 'var(--color-border)'}`,
                          background: isSelected ? 'var(--color-forest)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Developer / Evaluator Sandbox Controls */}
              <div
                style={{
                  marginTop: 16,
                  padding: '10px 14px',
                  borderRadius: 6,
                  background: 'var(--color-surface-variant)',
                  border: '1px dashed var(--color-border)',
                  fontSize: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Evaluator Sandbox Test Mode:
                  </span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 600, color: 'var(--color-forest)' }}>
                    <input
                      type="checkbox"
                      checked={simulateFailure}
                      onChange={(e) => setSimulateFailure(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    Simulate Payment Failure
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Security & Trust Reassurance */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 12,
                color: 'var(--color-text-secondary)',
              }}
            >
              <ShieldCheck size={20} color="var(--color-forest)" style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Zero Financial Risk:
                </span>{' '}
                Transactions operate strictly in test mode or demo sandbox. No real bank accounts or UPI balances will ever be debited.
              </div>
            </div>
          </div>

          {/* ============================================================
              RIGHT COLUMN: Sticky Order Summary & Transparent Bill
              ============================================================ */}
          <div
            style={{
              position: 'sticky',
              top: 80,
              background: 'var(--color-surface)',
              borderRadius: 10,
              border: '1px solid var(--color-border)',
              padding: '22px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
              Order &amp; Consignment Summary
            </h3>

            {/* Item Previews */}
            <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 16, borderBottom: '1px solid var(--color-divider)', paddingBottom: 14 }}>
              {items.map((it) => (
                <div key={it.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                  <div style={{ flex: 1, paddingRight: 12 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {it.product.title}
                    </p>
                    <span style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)' }}>
                      Qty: {it.quantity} × {formatPrice(it.product.price)}
                    </span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {formatPrice(it.product.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Inputs Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{formatPrice(sub)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Factory Doorstep Logistics</span>
                <span style={{ fontWeight: 600, color: '#166534' }}>
                  {fee === 0 ? 'FREE (Special Subsidy)' : formatPrice(fee)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Direct Farm-Gate Price Savings</span>
                <span style={{ fontWeight: 600, color: '#166534' }}>
                  Save ₹{(items.reduce((s, i) => s + ((i.product.originalPrice ?? i.product.price) - i.product.price) * i.quantity, 0)).toLocaleString('en-IN')}
                </span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--color-divider)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800 }}>
                <span>Total Payable</span>
                <span style={{ color: 'var(--color-forest)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleInitiatePayment}
              disabled={txState === 'processing'}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: 14.5,
                fontWeight: 700,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: txState === 'processing' ? 'not-allowed' : 'pointer',
                opacity: txState === 'processing' ? 0.75 : 1,
              }}
            >
              {txState === 'processing' ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Processing Transaction...</span>
                </>
              ) : selectedPaymentMethod === 'cod' ? (
                <>
                  <Banknote size={16} />
                  <span>Confirm Farm Delivery (Pay {formatPrice(total)})</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Pay {formatPrice(total)} via {activePaymentOption.title.split('/')[0]}</span>
                </>
              )}
            </button>

            <p style={{ margin: '10px 0 0', fontSize: 11, textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              Seed germination certificate &amp; GST tax invoice issued immediately upon confirmation.
            </p>
          </div>
        </div>

        {/* Animated Thermal Receipt Dispenser Modal */}
        {txState === 'processing' && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(5, 20, 15, 0.78)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <div
              className="receipt-dispenser-casing slide-up"
              style={{
                maxWidth: 440,
                width: '100%',
                padding: '24px 20px 22px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              {/* POS Terminal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: '0 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: '#22c55e',
                      animation: 'ledPulse 1.4s infinite ease-in-out',
                    }}
                  />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: '#94a3b8', fontFamily: 'monospace' }}>
                    ESCROW TERMINAL #TR-808
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    letterSpacing: '0.5px',
                  }}
                >
                  DISPENSING RECEIPT
                </span>
              </div>

              {/* Terminal Printer Slit */}
              <div className="receipt-slit" style={{ width: '92%', height: 6, margin: '0 auto', background: '#020617', borderRadius: 3 }} />

              {/* Animated Thermal Receipt Paper */}
              <div
                className="animated-thermal-receipt"
                style={{
                  width: '90%',
                  margin: '0 auto',
                  background: '#ffffff',
                  color: '#0f172a',
                  padding: '20px 20px 14px',
                  textAlign: 'left',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 12,
                  boxShadow: '0 12px 24px -6px rgba(0,0,0,0.3)',
                  borderLeft: '1px solid #e2e8f0',
                  borderRight: '1px solid #e2e8f0',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.5px', color: '#0f172a' }}>
                    AGRITRADE AGROCOMMERCE
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>
                    DIRECT FARM ESCROW TAX INVOICE
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: 11, letterSpacing: '-1px', margin: '4px 0' }}>
                    ----------------------------------------
                  </div>
                </div>

                <div style={{ fontSize: 11, lineHeight: 1.6, color: '#334155', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>ORDER REF:</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentOrderId || 'ORD-2026-ESCROW'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>DATE / TIME:</span>
                    <span>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>DESTINATION:</span>
                    <span style={{ fontWeight: 600 }}>{selectedAddress.recipientName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>FARM LOCATION:</span>
                    <span>{selectedAddress.city}, {selectedAddress.state}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>PAY METHOD:</span>
                    <span style={{ fontWeight: 700, color: '#166534' }}>{activePaymentOption.title.split('/')[0].toUpperCase()}</span>
                  </div>
                </div>

                <div style={{ color: '#cbd5e1', fontSize: 11, letterSpacing: '-1px', margin: '6px 0' }}>
                  ----------------------------------------
                </div>

                {/* Items breakdown */}
                <div style={{ marginBottom: 10 }}>
                  {items.slice(0, 3).map((item) => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4 }}>
                      <span style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.product.title} ×{item.quantity}
                      </span>
                      <span style={{ fontWeight: 600 }}>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div style={{ fontSize: 10, color: '#64748b', fontStyle: 'italic', marginTop: 2 }}>
                      + {items.length - 3} additional input lots
                    </div>
                  )}
                </div>

                <div style={{ color: '#cbd5e1', fontSize: 11, letterSpacing: '-1px', margin: '6px 0' }}>
                  ----------------------------------------
                </div>

                {/* Totals */}
                <div style={{ fontSize: 11.5, lineHeight: 1.6, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Consignment Subtotal:</span>
                    <span>₹{sub.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                    <span>Logistics Subsidy:</span>
                    <span>{fee === 0 ? 'FREE' : `₹${fee}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, marginTop: 4, paddingTop: 4, borderTop: '1px dashed #94a3b8' }}>
                    <span>TOTAL AUTHORIZED:</span>
                    <span style={{ color: '#0f172a' }}>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Step badge */}
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px dashed #22c55e',
                    borderRadius: 4,
                    padding: '8px 10px',
                    margin: '10px 0',
                    fontSize: 11,
                    textAlign: 'center',
                    color: '#166534',
                    fontWeight: 700,
                  }}
                >
                  ● {processingStep}
                </div>

                {/* Simulated Barcode */}
                <div style={{ textAlign: 'center', marginTop: 12, marginBottom: 4 }}>
                  <div
                    style={{
                      height: 28,
                      background: 'repeating-linear-gradient(90deg, #0f172a 0, #0f172a 2px, transparent 2px, transparent 4px, #0f172a 4px, #0f172a 7px, transparent 7px, transparent 9px, #0f172a 9px, #0f172a 12px, transparent 12px, transparent 15px)',
                      width: '80%',
                      margin: '0 auto',
                      opacity: 0.85,
                    }}
                  />
                  <div style={{ fontSize: 9, letterSpacing: '3px', color: '#64748b', marginTop: 3 }}>
                    *AGRITRADE-ESCROW-SEAL*
                  </div>
                </div>

                {/* Perforated edge at bottom */}
                <div className="perforated-bottom" style={{ margin: '12px -20px -14px -20px' }} />
              </div>

              {/* Progress bar and helper text under printer */}
              <div style={{ marginTop: 20, padding: '0 12px' }}>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #22c55e, #10b981)',
                      width: '70%',
                      borderRadius: 2,
                      animation: 'indeterminate 1.5s infinite ease-in-out',
                    }}
                  />
                </div>
                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>
                  Please keep this window open while the transaction escrow lock is secured.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add Address Modal Component */}
        <AddAddressModal
          isOpen={isAddAddressOpen}
          onClose={() => setIsAddAddressOpen(false)}
          onSuccess={(newAddr) => selectAddress(newAddr.id)}
        />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </AppShell>
  );
}
