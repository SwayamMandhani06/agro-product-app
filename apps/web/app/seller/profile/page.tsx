'use client';

import React from 'react';
import { useMarketplaceStore } from '@/features/marketplace/marketplace-store';
import { SellerPortalNav } from '@/features/marketplace/presentation/SellerPortalNav';
import { ShieldCheck } from 'lucide-react';

export default function SellerProfilePage() {
  const { sellerProfiles, activeSellerId } = useMarketplaceStore();
  const seller = sellerProfiles.find((s) => s.id === activeSellerId) || sellerProfiles[0];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <SellerPortalNav />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-slate)' }}>
            Seller Verification & Business Entity Profile
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
            Commercial licensing, APMC credentials, and fulfillment SLAs visible to marketplace buyers
          </span>
        </div>

        {/* Profile Card */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '8px',
                  background: 'var(--color-forest)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '22px',
                }}
              >
                M
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-slate)' }}>
                    {seller.businessName}
                  </h3>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: '#EAF6EF',
                      color: '#01421E',
                      border: '1px solid #CEEAD9',
                    }}
                  >
                    <ShieldCheck size={14} color="#027A38" />
                    Verified Enterprise Seller
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-neutral-600)', marginTop: '4px' }}>
                  Legal Name: <strong>{seller.legalName}</strong>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-neutral-700)', marginTop: '8px', maxWidth: '600px', lineHeight: 1.5 }}>
                  {seller.description}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)' }}>
                ★ {seller.rating.toFixed(1)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                Based on {seller.totalReviews} verified farmer reviews
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Statutory & APMC */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 14px 0', fontSize: '13px', fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Statutory Credentials
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>GSTIN</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--color-slate)' }}>
                  {seller.gstNumber}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>APMC Market Yard License</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--color-slate)' }}>
                  MH-PUN-BAR-2024/098
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>Seed License Number</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--color-slate)' }}>
                  SL/PUN/2022/F-910
                </span>
              </div>
            </div>
          </div>

          {/* Operational SLA */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 14px 0', fontSize: '13px', fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Logistics & Fulfillment SLA
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>Dispatch SLA Target</span>
                <span style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
                  {seller.dispatchSlaHours} Hours (Verified: 98.6% On-Time)
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>Central Fulfillment Depot</span>
                <span style={{ fontWeight: 600, color: 'var(--color-slate)' }}>
                  {seller.location}, {seller.district}, {seller.state}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>Return Window Policy</span>
                <span style={{ fontWeight: 600, color: 'var(--color-slate)' }}>
                  7 Days Replacement for sealed / damaged agro-inputs
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Banking */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 14px 0', fontSize: '13px', fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Disbursement & Banking
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>Settlement Bank</span>
                <span style={{ fontWeight: 600, color: 'var(--color-slate)' }}>
                  HDFC Bank Limited (Baramati Branch)
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>Account Number</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--color-slate)' }}>
                  •••• •••• •••• 4821 (IFSC: HDFC0000491)
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>Direct Helpline</span>
                <span style={{ fontWeight: 600, color: 'var(--color-slate)' }}>
                  {seller.contactPhone} • {seller.contactEmail}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
