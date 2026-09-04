'use client';

import React, { useState } from 'react';
import { useMarketplaceStore } from '@/features/marketplace/marketplace-store';
import { SellerPortalNav } from '@/features/marketplace/presentation/SellerPortalNav';
import { Building2, CheckCircle2, RefreshCw, ArrowUpRight } from 'lucide-react';

export default function SellerPayoutsPage() {
  const { payouts, sellerProfiles, activeSellerId, requestPayoutSimulation } = useMarketplaceStore();
  const seller = sellerProfiles.find((s) => s.id === activeSellerId) || sellerProfiles[0];
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const availableBalance = seller?.metrics?.availableBalance ?? 82400;
  const pendingPayout = seller?.metrics?.pendingPayoutAmount ?? 42500;
  const totalPaid = payouts
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + p.amount, 0);

  const handleRequestPayout = () => {
    if (availableBalance <= 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      const payout = requestPayoutSimulation(seller.id);
      setIsProcessing(false);
      if (payout) {
        setSuccessMsg(`Deterministic settlement cycle generated for ₹${payout.amount.toLocaleString('en-IN')}. Reference UTR will be reconciled in test ledger.`);
        setTimeout(() => setSuccessMsg(''), 6000);
      }
    }, 600);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <SellerPortalNav />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-slate)' }}>
              Seller Payouts & Settlement Ledger
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              Net automated disbursement ledger with platform commission reconciliation
            </span>
          </div>

          <button
            onClick={handleRequestPayout}
            disabled={availableBalance <= 0 || isProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: availableBalance > 0 ? 'var(--color-forest)' : 'var(--color-neutral-400)',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: availableBalance > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            {isProcessing ? <RefreshCw size={15} className="animate-spin" /> : <ArrowUpRight size={15} />}
            Request Payout (₹{availableBalance.toLocaleString('en-IN')})
          </button>
        </div>

        {/* Free-tier simulation notice */}
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: '#334155',
          }}
        >
          <Building2 size={16} color="#475569" />
          <div>
            <strong>Institutional Banking Simulation (100% Free-Tier Safe):</strong> Settlements are computed deterministically against gross order volume minus platform commission (4.5%). Real payout adapters can be attached without schema changes.
          </div>
        </div>

        {successMsg && (
          <div
            style={{
              background: '#EAF6EF',
              border: '1px solid #CEEAD9',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '12px',
              color: '#01421E',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} color="#027A38" />
            {successMsg}
          </div>
        )}

        {/* Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '16px 20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
              Available for Disbursement
            </span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-forest)', marginTop: '6px' }}>
              ₹{availableBalance.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              Eligible from delivered orders past return window
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '16px 20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
              Pending In-Cycle Processing
            </span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#92400E', marginTop: '6px' }}>
              ₹{pendingPayout.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              Scheduled for automated NEFT batch run
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '16px 20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
              Disbursed to Bank Account
            </span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '6px' }}>
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              HDFC Bank (•••• 4821) • IFSC: HDFC0000491
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '16px 20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
              Platform Commission Rate
            </span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '6px' }}>
              {seller?.commissionRate ?? 4.5}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '4px' }}>
              Includes rural hub logistics & insurance
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-surface-tint)' }}>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Disbursement Cycle</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Orders</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Gross Sales</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Platform Fee (4.5%)</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Net Settled</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Bank UTR / Reference</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((pay) => {
                  const isPaid = pay.status === 'paid';
                  const isProcessing = pay.status === 'processing';

                  return (
                    <tr key={pay.id} style={{ borderBottom: '1px solid var(--color-surface-subtle)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--color-slate)' }}>
                        <div style={{ fontWeight: 600 }}>
                          {new Date(pay.periodStart).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} –{' '}
                          {new Date(pay.periodEnd).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>
                          Batch: {pay.id}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', color: 'var(--color-neutral-700)' }}>
                        {pay.orderCount} orders
                      </td>

                      <td style={{ padding: '12px 16px', color: 'var(--color-slate)' }}>
                        ₹{pay.grossRevenue.toLocaleString('en-IN')}
                      </td>

                      <td style={{ padding: '12px 16px', color: 'var(--color-neutral-500)' }}>
                        -₹{pay.commissionDeducted.toLocaleString('en-IN')}
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-forest)' }}>
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: isPaid ? '#EAF6EF' : isProcessing ? '#FEF3C7' : '#EFF6FF',
                            color: isPaid ? '#01421E' : isProcessing ? '#92400E' : '#1E40AF',
                            textTransform: 'uppercase',
                          }}
                        >
                          {pay.status}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-neutral-700)' }}>
                        <div>{pay.utrReference || 'Processing Clearance'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)', fontFamily: 'system-ui, sans-serif' }}>
                          {pay.bankAccountMasked}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
