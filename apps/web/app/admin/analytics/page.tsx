'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/features/admin/admin-store';
import { AdminPortalNav } from '@/features/admin/presentation/AdminPortalNav';
import {
  TrendingUp,
  Percent,
  CheckCircle,
} from 'lucide-react';

const CATEGORY_BREAKDOWN = [
  { category: 'Fertilizers', orders: 142, gmv: 624000, commission: 28080, disputeRate: 1.4 },
  { category: 'Seeds', orders: 98, gmv: 412000, commission: 18540, disputeRate: 2.0 },
  { category: 'Plant Protection', orders: 76, gmv: 295000, commission: 13275, disputeRate: 2.6 },
  { category: 'Farm Machinery', orders: 34, gmv: 348000, commission: 15660, disputeRate: 0.0 },
  { category: 'Irrigation', orders: 45, gmv: 166000, commission: 7470, disputeRate: 0.0 },
];

const DISTRICT_DATA = [
  { district: 'Pune', orders: 186, gmv: 792000, activeSellers: 34, status: 'High Growth' },
  { district: 'Nashik', orders: 84, gmv: 374000, activeSellers: 18, status: 'Active' },
  { district: 'Satara', orders: 58, gmv: 260000, activeSellers: 14, status: 'Active' },
  { district: 'Solapur', orders: 42, gmv: 228000, activeSellers: 10, status: 'Monitoring' },
  { district: 'Nagpur', orders: 25, gmv: 191000, activeSellers: 8, status: 'Expanding' },
];

export default function AdminAnalyticsPage() {
  const { metrics } = useAdminStore();
  const [period, setPeriod] = useState<'7d' | '30d' | 'ytd'>('30d');

  const estimatedCommission = (metrics.totalGmv * 0.045).toFixed(0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <AdminPortalNav />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header Strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--color-slate)' }}>
              Platform Operations Analytics & Marketplace Intelligence
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
              Gross Merchandise Value, revenue take-rate, regional throughput, and category risk metrics
            </p>
          </div>

          {/* Period selector */}
          <div
            style={{
              display: 'flex',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '6px',
              padding: '2px',
            }}
          >
            {(['7d', '30d', 'ytd'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: period === p ? '#0F172A' : 'transparent',
                  color: period === p ? '#FFFFFF' : 'var(--color-neutral-600)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'Year to Date'}
              </button>
            ))}
          </div>
        </div>

        {/* Top KPI row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* GMV */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                Gross Merchandise Value
              </span>
              <TrendingUp size={16} color="var(--color-forest)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '8px' }}>
              ₹{metrics.totalGmv.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-forest)', marginTop: '4px', fontWeight: 500 }}>
              +14.8% vs preceding period
            </div>
          </div>

          {/* Commission Take */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                Platform Take-Rate (4.5%)
              </span>
              <Percent size={16} color="#2563EB" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '8px' }}>
              ₹{Number(estimatedCommission).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              Auto-deducted at settlement
            </div>
          </div>

          {/* Order Completion */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                On-Time Dispatch SLA
              </span>
              <CheckCircle size={16} color="var(--color-forest)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '8px' }}>
              94.2%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              Within 24-48h seller window
            </div>
          </div>

          {/* Dispute Rate */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
                Dispute Ratio
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#15803D',
                  background: '#EAF6EF',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                Healthy
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '8px' }}>
              1.24%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              Benchmark threshold: &lt; 3.0%
            </div>
          </div>
        </div>

        {/* Category Performance Breakdown */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px', color: 'var(--color-slate)' }}>
            Category Performance & Revenue Contribution
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--color-canvas)', borderBottom: '1px solid var(--color-surface-tint)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                    Category
                  </th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                    Orders
                  </th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                    Gross Volume
                  </th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                    Platform Commission (4.5%)
                  </th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--color-neutral-500)', fontSize: '11px', textTransform: 'uppercase' }}>
                    Dispute Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {CATEGORY_BREAKDOWN.map((cat) => (
                  <tr key={cat.category} style={{ borderBottom: '1px solid var(--color-surface-tint)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--color-slate)' }}>
                      {cat.category}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--color-slate)' }}>
                      {cat.orders}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--color-slate)' }}>
                      ₹{cat.gmv.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--color-forest)', fontWeight: 600 }}>
                      ₹{cat.commission.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: cat.disputeRate > 2.0 ? '#D97706' : '#15803D',
                        }}
                      >
                        {cat.disputeRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional District Throughput */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px', color: 'var(--color-slate)' }}>
            Regional Geographic Cluster Throughput (Maharashtra)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {DISTRICT_DATA.map((dist) => (
              <div
                key={dist.district}
                style={{
                  padding: '14px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-surface-tint)',
                  background: 'var(--color-canvas)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-slate)' }}>
                    {dist.district}
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      background: dist.status === 'Monitoring' ? '#FEF3C7' : '#EAF6EF',
                      color: dist.status === 'Monitoring' ? '#B45309' : '#15803D',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {dist.status}
                  </span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '8px' }}>
                  ₹{(dist.gmv / 1000).toFixed(0)}k
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
                  {dist.orders} orders • {dist.activeSellers} active sellers
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
