'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useOrdersStore } from '@/features/orders/store';
import { paymentService } from '@/features/payments/payment-service';
import { ArrowLeft, Printer, ShieldCheck, CheckCircle2, Leaf } from 'lucide-react';

export default function OrderReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.id as string) ?? '';
  const { getOrderById } = useOrdersStore();
  const order = getOrderById(orderId);
  const transaction = paymentService.getTransactionByOrderId(orderId);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('autoPrint=true')) {
      const t = setTimeout(() => window.print(), 500);
      return () => clearTimeout(t);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <AppShell>
        <div className="container-app" style={{ paddingTop: 60, textAlign: 'center' }}>
          <h2>Order Reference Not Found</h2>
          <p>The requested order invoice could not be located.</p>
          <Link href="/orders" className="btn btn-primary" style={{ padding: '8px 18px' }}>
            Return to Orders
          </Link>
        </div>
      </AppShell>
    );
  }

  const invoiceNumber = `INV-${order.id.replace('ORD-', '')}-2026`;
  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const subtotal = order.totalAmount ? Math.round(order.totalAmount / 1.18) : 0;
  const totalTax = order.totalAmount - subtotal;
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 20, paddingBottom: 60 }}>
        {/* Screen-only Action Toolbar */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            padding: '12px 18px',
            background: '#ffffff',
            borderRadius: 10,
            border: '1px solid var(--color-divider)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <button
            onClick={() => router.push(`/orders/${order.id}`)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13.5,
              fontWeight: 600,
              color: 'var(--color-forest)',
            }}
          >
            <ArrowLeft size={16} strokeWidth={2.2} /> Back to Order Tracking
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 8,
              background: 'var(--color-forest)',
              color: '#ffffff',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(11, 61, 46, 0.25)',
            }}
          >
            <Printer size={15} strokeWidth={2.2} /> Print Tax Invoice
          </button>
        </div>

        {/* ============================================================
            PRINTABLE TAX INVOICE CARD
            Formatted for crisp standard A4 print output
            ============================================================ */}
        <div
          className="printable-invoice-page"
          style={{
            maxWidth: 780,
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            padding: '40px 48px',
            color: '#0f172a',
            fontFamily: 'inherit',
          }}
        >
          {/* Top Brand & Legal Title */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #145A43',
              paddingBottom: 20,
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 8,
                  background: '#145A43',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Leaf size={22} strokeWidth={2.4} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#145A43', letterSpacing: '-0.3px' }}>
                  AGRI TRADE
                </h1>
                <p style={{ margin: 0, fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Agricultural Marketplace &amp; Rural Logistics Network
                </p>
                <p style={{ margin: 0, fontSize: 10.5, color: '#94a3b8' }}>
                  GSTIN: 27AABCA1234F1Z8 · CIN: U01100MH2026PTC123456
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  color: '#166534',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                Original Tax Invoice
              </span>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                Invoice No: {invoiceNumber}
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b' }}>
                Date: {invoiceDate}
              </div>
            </div>
          </div>

          {/* Parties Grid (Seller vs Buyer) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 24,
              paddingBottom: 20,
              marginBottom: 24,
              borderBottom: '1px solid #e2e8f0',
              fontSize: 12.5,
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 4 }}>
                Sold By (Verified Supplier)
              </div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>
                Maharashtra Krishi Kendra
              </div>
              <div style={{ color: '#475569', lineHeight: 1.45, marginTop: 2 }}>
                Plot 14, APMC Commercial Yard, Market Yard Road<br />
                Nashik, Maharashtra — 422003<br />
                CIB&amp;RC License: MH/NSK/SEED/2026/041<br />
                State Code: 27 (Maharashtra)
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 4 }}>
                Billed &amp; Shipped To (Farmer)
              </div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 14 }}>
                {order.address?.recipientName ?? 'Rahul Sharma'}
              </div>
              <div style={{ color: '#475569', lineHeight: 1.45, marginTop: 2 }}>
                {order.address?.addressLine ?? 'Gut No. 42, Farm Gate Road'}<br />
                {order.address?.city ?? 'Nashik'}, {order.address?.state ?? 'Maharashtra'} — {order.address?.pincode ?? '422003'}<br />
                Phone: {order.address?.phone ?? '+91 98765 43210'}<br />
                Destination Type: {order.address?.tag ?? 'Farm Gate'}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: 24,
              fontSize: 12,
            }}
          >
            <thead>
              <tr style={{ background: '#f8fafc', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#334155' }}>#</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#334155' }}>Description of Goods</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#334155' }}>HSN</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#334155' }}>Qty</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#334155' }}>Unit Rate</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#334155' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => {
                const lineTotal = item.product.price * item.quantity;
                return (
                  <tr key={item.product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 10px', color: '#64748b' }}>{idx + 1}</td>
                    <td style={{ padding: '10px 10px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.product.title}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        Category: {item.product.category ?? 'Agri-Input'} · Unit: {item.product.unit}
                      </div>
                    </td>
                    <td style={{ padding: '10px 10px', textAlign: 'center', color: '#64748b' }}>120999</td>
                    <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', color: '#475569' }}>
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 700 }}>
                      ₹{lineTotal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Tax Calculation & Summary */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: 24,
              borderTop: '1px solid #e2e8f0',
              paddingTop: 16,
              marginBottom: 28,
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
                Payment &amp; Settlement Details
              </div>
              <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.5 }}>
                Payment Method: <strong>{order.paymentMethod ?? 'UPI Instant Transfer'}</strong><br />
                Transaction Status: <strong style={{ color: '#16A34A' }}>PAID / CONFIRMED</strong><br />
                Consignment ID: <strong>#{order.id}</strong><br />
                Delivery Channel: <strong>Delhivery Rural Agri Logistics</strong>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12 }}>
                <span style={{ color: '#64748b' }}>Taxable Value:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12 }}>
                <span style={{ color: '#64748b' }}>CGST (9%):</span>
                <span>₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12 }}>
                <span style={{ color: '#64748b' }}>SGST (9%):</span>
                <span>₹{sgst.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12 }}>
                <span style={{ color: '#64748b' }}>Rural Delivery Fee:</span>
                <span style={{ color: '#16A34A', fontWeight: 600 }}>FREE (Above ₹1,000)</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0 0',
                  marginTop: 6,
                  borderTop: '2px solid #145A43',
                  fontSize: 15,
                  fontWeight: 900,
                  color: '#145A43',
                }}
              >
                <span>Total Amount Paid:</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Legal Footer & Signatory */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '1px dashed #cbd5e1',
              paddingTop: 16,
              fontSize: 11,
              color: '#64748b',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#166534', fontWeight: 700, marginBottom: 2 }}>
                <ShieldCheck size={14} /> Certified Tax Document
              </div>
              <p style={{ margin: 0 }}>
                This is an authenticated computer-generated invoice under the GST Acts.
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ height: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', paddingBottom: 4 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#145A43' }}>
                  AgriTrade Finance · Verified
                </span>
              </div>
              <div style={{ borderTop: '1px solid #94a3b8', paddingTop: 2, fontWeight: 600 }}>
                Authorised Signatory
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 10mm 12mm;
            size: A4 portrait;
          }
          .container-app {
            padding: 0 !important;
            margin: 0 !important;
          }
          .printable-invoice-page {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </AppShell>
  );
}
