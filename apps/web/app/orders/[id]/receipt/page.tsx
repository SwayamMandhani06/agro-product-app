'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useOrdersStore } from '@/features/orders/store';
import { paymentService } from '@/features/payments/payment-service';
import ReceiptModal from '@/components/checkout/ReceiptModal';
import { ArrowLeft, Printer } from 'lucide-react';

export default function OrderReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.id as string) ?? '';
  const { getOrderById } = useOrdersStore();
  const order = getOrderById(orderId);
  const transaction = paymentService.getTransactionByOrderId(orderId);

  if (!order) {
    return (
      <AppShell>
        <div className="container-app" style={{ paddingTop: 60, textAlign: 'center' }}>
          <h2>Order Not Found</h2>
          <p>The requested order reference could not be located.</p>
          <Link href="/orders" className="btn btn-primary">
            Return to Orders
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: 'var(--color-text-secondary)',
            }}
          >
            <ArrowLeft size={16} /> Back to Order Details
          </button>
          <button
            onClick={() => window.print()}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Printer size={14} /> Print Document
          </button>
        </div>

        {/* Inline receipt preview */}
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <ReceiptModal
            order={order}
            transaction={transaction}
            onClose={() => router.push(`/orders/${order.id}`)}
          />
        </div>
      </div>
    </AppShell>
  );
}
