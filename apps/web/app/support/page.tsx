'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/features/admin/admin-store';
import { DisputeStatusBadge } from '@/features/admin/presentation/DisputeStatusBadge';
import { DisputeType, DISPUTE_TYPE_LABELS } from '@/features/admin/domain/governance';
import {
  LifeBuoy,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const RECENT_ORDERS = [
  { id: 'ord_demo_01', orderNumber: 'ORD-2026-8812', sellerId: 'sel_krishi_kendra_01', sellerName: 'Maharashtra Krishi Kendra', total: 1250, product: 'IFFCO NPK 10:26:26 (50kg)' },
  { id: 'ord_demo_02', orderNumber: 'ORD-2026-7940', sellerId: 'sel_shree_krishna_06', sellerName: 'Shree Krishna Agro Chemicals', total: 1850, product: 'Bio-Shield Organic Fungicide (1L)' },
  { id: 'ord_demo_03', orderNumber: 'ORD-2026-6510', sellerId: 'sel_baramati_agro_02', sellerName: 'Baramati Agro Chemical Hub', total: 2850, product: 'Certified Soybean Seeds JS-335 (30kg)' },
];

export default function SupportDeskPage() {
  const { disputes, createDispute } = useAdminStore();
  const [isCreating, setIsCreating] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(RECENT_ORDERS[0].id);
  const [type, setType] = useState<DisputeType>('damaged_product');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // For demo, show user disputes (farmer disputes)
  const myDisputes = disputes.filter((d) => d.farmerId === 'usr_farmer_demo' || d.farmerId === 'usr_farmer_2' || d.farmerId === 'usr_farmer_3');

  const handleCreateDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const ord = RECENT_ORDERS.find((o) => o.id === selectedOrder) || RECENT_ORDERS[0];

    createDispute({
      orderId: ord.id,
      orderNumber: ord.orderNumber,
      farmerId: 'usr_farmer_demo',
      farmerName: 'Rahul Shinde',
      sellerId: ord.sellerId,
      sellerName: ord.sellerName,
      type,
      subject: subject.trim(),
      description: description.trim(),
    });

    setIsCreating(false);
    setSubject('');
    setDescription('');
    setSuccessMessage('Your dispute has been logged with Priority Admin Escalation. Reference: ' + ord.orderNumber);
    setTimeout(() => setSuccessMessage(''), 6000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      {/* Top Header */}
      <header
        style={{
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-surface-tint)',
          marginBottom: '24px',
          padding: '16px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'var(--color-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <LifeBuoy size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--color-slate)' }}>
                AgriTrade Buyer Protection & Help Desk
              </h1>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                Transit damage protection, product quality verification & fair resolution guarantee
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              href="/"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-neutral-600)',
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid var(--color-surface-tint)',
                textDecoration: 'none',
                background: 'var(--color-surface)',
              }}
            >
              Back to Store
            </Link>
            <Link
              href="/admin/dashboard"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#38BDF8',
                padding: '8px 14px',
                borderRadius: '6px',
                background: '#0F172A',
                textDecoration: 'none',
              }}
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        {/* Banner */}
        {successMessage && (
          <div
            style={{
              background: '#EAF6EF',
              border: '1px solid #BBF7D0',
              padding: '14px 18px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#15803D',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Protection policy strip */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '8px',
            padding: '20px 24px',
            color: '#FFFFFF',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>
              <ShieldCheck size={16} />
              <span>AgriTrade SafeHarvest Guarantee</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '6px 0 4px', color: '#FFFFFF' }}>
              Have an issue with an agricultural shipment?
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8', maxWidth: '600px', lineHeight: 1.5 }}>
              All seed, fertilizer, and equipment dispatches are insured. Open a dispute within 7 days of delivery for immediate administrative mediation and 100% replacement or refund.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-forest)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <PlusCircle size={16} />
            <span>{isCreating ? 'Cancel' : 'File a Claim'}</span>
          </button>
        </div>

        {/* Dispute Creation Form */}
        {isCreating && (
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
          >
            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 16px', color: 'var(--color-slate)' }}>
              Submit Order Dispute
            </h2>

            <form onSubmit={handleCreateDispute} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-slate)', marginBottom: '6px' }}>
                  Select Delivered Order
                </label>
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-surface-tint)',
                    background: 'var(--color-canvas)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  {RECENT_ORDERS.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      {ord.orderNumber} — {ord.product} (₹{ord.total}) from {ord.sellerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-slate)', marginBottom: '6px' }}>
                  Dispute Nature
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as DisputeType)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-surface-tint)',
                    background: 'var(--color-canvas)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                >
                  {Object.entries(DISPUTE_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-slate)', marginBottom: '6px' }}>
                  Claim Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bag seal broken upon delivery; wrong formulation concentration..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-surface-tint)',
                    background: 'var(--color-canvas)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-slate)', marginBottom: '6px' }}>
                  Detailed Description & Evidence
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the condition, batch mismatch, driver notes, or unfulfilled promise..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-surface-tint)',
                    background: 'var(--color-canvas)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-surface-tint)',
                    background: 'transparent',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--color-forest)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Submit for Administrative Review
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Disputes List */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 16px', color: 'var(--color-slate)' }}>
            Your Active Claims & Cases ({myDisputes.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myDisputes.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-neutral-500)', fontSize: '13px' }}>
                You have no active claims or disputes.
              </div>
            ) : (
              myDisputes.map((d) => (
                <div
                  key={d.id}
                  style={{
                    padding: '16px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-surface-tint)',
                    background: 'var(--color-canvas)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-slate)' }}>
                        {d.subject}
                      </span>
                      <DisputeStatusBadge status={d.status} />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
                      Order: <strong style={{ color: 'var(--color-slate)' }}>{d.orderNumber}</strong> • Seller: {d.sellerName} • Opened: {new Date(d.createdAt).toLocaleDateString()}
                    </div>
                    {d.resolution && (
                      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--color-forest)', fontWeight: 600 }}>
                        Resolution: {d.resolution}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/support/${d.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-forest)',
                      textDecoration: 'none',
                    }}
                  >
                    <span>View Case Thread ({d.messages.length})</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
