'use client';

import React from 'react';
import Link from 'next/link';
import { X, Printer, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';
import type { Order } from '@/types';
import type { PaymentTransaction } from '@/features/payments/types';

interface ReceiptModalProps {
  order: Order;
  transaction?: PaymentTransaction | null;
  onClose: () => void;
}

export default function ReceiptModal({ order, transaction, onClose }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const isTestMode = transaction?.provider === 'razorpay_test';
  const isCod = order.paymentMethod?.toLowerCase().includes('cash') || transaction?.method === 'cod';

  return (
    <div
      className="receipt-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        className="slide-up print-receipt-card"
        style={{
          background: '#ffffff',
          borderRadius: 12,
          maxWidth: 640,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          color: '#0f172a',
          position: 'relative',
        }}
      >
        {/* Modal Action Header (Hidden during print) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={16} color="#145A43" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#145A43', letterSpacing: '0.3px' }}>
              AGRITRADE TRANSACTION RECEIPT
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link
              href={`/orders/${order.id}/receipt`}
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 12px',
                borderRadius: 6,
                background: '#F0FDF4',
                color: '#145A43',
                border: '1px solid #BBF7D0',
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>Full A4 Invoice</span>
              <ExternalLink size={12} />
            </Link>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 6,
                background: '#145A43',
                color: '#ffffff',
                border: 'none',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Printer size={14} /> Print Receipt
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div style={{ padding: '28px 32px' }} id="printable-receipt">
          {/* Watermark / Mode Banner */}
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: isCod ? '#FEF3C7' : '#F0FDF4',
              border: `1px solid ${isCod ? '#FDE68A' : '#BBF7D0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            <span style={{ color: isCod ? '#92400E' : '#166534' }}>
              {isCod
                ? 'CASH ON DELIVERY · PAYMENT DUE AT DOORSTEP'
                : isTestMode
                ? 'RAZORPAY TEST MODE · NO REAL MONEY CHARGED'
                : 'DEMO PAYMENT SANDBOX · EDUCATIONAL SIMULATION'}
            </span>
            <span style={{ color: '#64748b', fontWeight: 500 }}>
              VERIFIED RECORD
            </span>
          </div>

          {/* Letterhead */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#145A43', letterSpacing: '-0.3px' }}>
                AGRITRADE MARKETPLACE
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                Direct Farm-Gate Agricultural Inputs &amp; Certified Supply
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#94a3b8' }}>
                GSTIN: 27AABCA1234F1Z5 (Demo Enterprise Sandbox)
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Invoice #</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{order.id}</div>
              <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 3 }}>
                Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 0 18px' }} />

          {/* Customer & Payment Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24, fontSize: 12.5 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Billed To:</span>
              <p style={{ margin: '3px 0 1px', fontWeight: 700, color: '#0f172a' }}>{order.address.recipientName}</p>
              <p style={{ margin: '1px 0', color: '#475569', lineHeight: 1.4 }}>
                {order.address.addressLine}, {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
              <p style={{ margin: '1px 0', color: '#475569' }}>Phone: {order.address.phone}</p>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Payment Details:</span>
              <p style={{ margin: '3px 0 1px', fontWeight: 600, color: '#0f172a' }}>
                Method: <span style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</span>
              </p>
              <p style={{ margin: '1px 0', color: '#475569' }}>
                Transaction ID: {transaction?.providerPaymentId || `TXN-${order.id.replace('ORD-', '')}`}
              </p>
              <p style={{ margin: '1px 0', color: isCod ? '#D97706' : '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} />
                Status: {isCod ? 'Cash Due on Delivery' : 'Paid & Verified'}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 700 }}>Item Description</th>
                <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 700, textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 700, textAlign: 'right' }}>Unit Price</th>
                <th style={{ padding: '8px 10px', color: '#475569', fontWeight: 700, textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px', color: '#0f172a', fontWeight: 600 }}>
                    {item.product.title}
                    <span style={{ display: 'block', fontSize: 11, color: '#64748b', fontWeight: 400 }}>
                      Category: {item.product.category} · Seller: Direct Factory Dispatched
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#475569' }}>{item.quantity}</td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#475569' }}>
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bill Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <div style={{ width: 240, fontSize: 12.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#64748b' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#64748b' }}>
                <span>Direct Delivery:</span>
                <span style={{ fontWeight: 600, color: '#166534' }}>
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#166534' }}>
                  <span>Farm Discount:</span>
                  <span style={{ fontWeight: 600 }}>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', margin: '6px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14, fontWeight: 800, color: '#145A43' }}>
                <span>Total Amount:</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div
            style={{
              borderTop: '1px dashed #cbd5e1',
              paddingTop: 14,
              fontSize: 11,
              color: '#94a3b8',
              lineHeight: 1.5,
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0 }}>
              This document serves as an electronic proof of transaction for certified agricultural inputs.
            </p>
            <p style={{ margin: '2px 0 0' }}>
              All seed lots are covered by national germination warranties. Support: support@agritrade.in
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 10mm 12mm;
            size: A4 portrait;
          }
          body > *:not(.receipt-modal-backdrop),
          header, nav, footer, .no-print, button {
            display: none !important;
          }
          .receipt-modal-backdrop {
            position: static !important;
            inset: auto !important;
            display: block !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
          }
          .print-receipt-card {
            position: static !important;
            inset: auto !important;
            display: block !important;
            max-width: 100% !important;
            width: 100% !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            overflow: visible !important;
            transform: none !important;
          }
          #printable-receipt {
            position: static !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
