'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useOrdersStore } from '@/features/orders/store';
import { paymentService } from '@/features/payments/payment-service';
import ReceiptModal from '@/components/checkout/ReceiptModal';
import { CheckCircle2, Truck, ArrowRight, Printer, Clock } from 'lucide-react';

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function ConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';
  const txnId = searchParams.get('txnId') ?? '';
  const { getOrderById } = useOrdersStore();
  const order = getOrderById(orderId);
  const transaction = paymentService.getTransactionByOrderId(orderId);

  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const isCod = order?.paymentMethod?.toLowerCase().includes('cash');

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 36, paddingBottom: 64 }}>
        <div
          style={{
            maxWidth: 580,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {/* Success Checkmark Circle */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: '#F0FDF4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '1.5px solid #86EFAC',
              color: '#166534',
            }}
          >
            <CheckCircle2 size={40} strokeWidth={2} />
          </div>

          <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Consignment Confirmed
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 14.5, color: 'var(--color-text-secondary)' }}>
            Your agricultural inputs order has been synchronized with direct supplier logistics.
          </p>

          {order && (
            <div
              className="card-base"
              style={{
                padding: '24px',
                textAlign: 'left',
                marginBottom: 24,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Order & Payment Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                  paddingBottom: 14,
                  borderBottom: '1px solid var(--color-divider)',
                }}
              >
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    CONSIGNMENT ORDER ID
                  </p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--color-forest)', letterSpacing: '0.3px' }}>
                    {order.id}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: isCod ? '#FEF3C7' : '#F0FDF4',
                      color: isCod ? '#92400E' : '#166534',
                      border: `1px solid ${isCod ? '#FDE68A' : '#BBF7D0'}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {isCod ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                    {isCod ? 'Cash Due on Delivery' : 'Payment Paid & Verified'}
                  </span>
                </div>
              </div>

              {/* Transaction Metadata */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: 'var(--color-surface-variant)',
                  marginBottom: 16,
                  fontSize: 12.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Method: </span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{order.paymentMethod}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Txn Ref: </span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {transaction?.providerPaymentId || txnId || `TXN-${order.id.slice(-6)}`}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                  Purchased Items ({order.items.length})
                </p>
                {order.items.map((item) => (
                  <div
                    key={item.product.id}
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}
                  >
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {item.product.title} × {item.quantity}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div
                style={{
                  borderTop: '1px solid var(--color-divider)',
                  paddingTop: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: 'var(--color-forest)' }}>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowReceiptModal(true)}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13.5,
                padding: '10px 18px',
                borderRadius: 8,
              }}
            >
              <Printer size={15} /> View / Print Tax Invoice
            </button>

            {order && (
              <Link
                href={`/orders/${order.id}`}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13.5,
                  padding: '10px 20px',
                  borderRadius: 8,
                }}
              >
                <Truck size={15} /> Track Consignment Live <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>

        {/* Receipt Modal */}
        {showReceiptModal && order && (
          <ReceiptModal
            order={order}
            transaction={transaction}
            onClose={() => setShowReceiptModal(false)}
          />
        )}
      </div>
    </AppShell>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: 60 }}>Loading order confirmation...</div>}>
      <ConfirmedContent />
    </Suspense>
  );
}
