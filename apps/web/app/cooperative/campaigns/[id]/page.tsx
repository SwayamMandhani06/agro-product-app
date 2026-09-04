'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMarketplaceStore } from '@/features/marketplace/marketplace-store';
import { CampaignProgressBar } from '@/features/marketplace/presentation/CampaignProgressBar';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const { campaigns, participations, joinCampaign, leaveCampaign } = useMarketplaceStore();

  const campaign = campaigns.find((c) => c.id === id);
  const campaignParticipations = participations.filter((p) => p.campaignId === id);

  // Check if current user has joined
  const currentFarmerId = 'usr_001'; // Rahul Sharma demo account
  const existingPtc = campaignParticipations.find((p) => p.farmerId === currentFarmerId);

  const [quantity, setQuantity] = useState<number>(existingPtc?.quantity || 15);
  const [justCommitted, setJustCommitted] = useState(false);

  if (!campaign) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-neutral-600)' }}>Procurement campaign not found.</p>
          <Link href="/cooperative/campaigns" style={{ color: 'var(--color-forest)', fontWeight: 600 }}>
            Back to Active Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const unitSavings = campaign.retailPrice - campaign.bulkPrice;
  const calculatedTotal = quantity * campaign.bulkPrice;
  const calculatedSavings = quantity * unitSavings;

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    joinCampaign(campaign.id, currentFarmerId, 'Rahul Sharma', quantity, 'Malegaon Budruk');
    setJustCommitted(true);
    setTimeout(() => setJustCommitted(false), 4000);
  };

  const handleWithdraw = () => {
    leaveCampaign(campaign.id, currentFarmerId);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      {/* Header */}
      <header style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-surface-tint)', marginBottom: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '18px 24px' }}>
          <Link
            href="/cooperative/campaigns"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-600)', textDecoration: 'none', marginBottom: '10px' }}
          >
            <ArrowLeft size={14} /> Back to Procurement Drives
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--color-slate)' }}>
                  {campaign.title}
                </h1>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background:
                      campaign.status === 'processing'
                        ? '#EFF6FF'
                        : campaign.status === 'threshold_reached'
                        ? '#EAF6EF'
                        : '#FEF3C7',
                    color:
                      campaign.status === 'processing'
                        ? '#1E40AF'
                        : campaign.status === 'threshold_reached'
                        ? '#01421E'
                        : '#92400E',
                    textTransform: 'uppercase',
                  }}
                >
                  {campaign.status.replace('_', ' ')}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-neutral-600)', marginTop: '4px' }}>
                Organized by <strong>{campaign.cooperativeName}</strong> • Fulfillment Partner: {campaign.sellerName || 'Verified Depot'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>Drive Closes</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-slate)' }}>
                {new Date(campaign.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        {justCommitted && (
          <div
            style={{
              background: '#EAF6EF',
              border: '1px solid #CEEAD9',
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#01421E',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} color="#027A38" />
            Commitment updated! Your volume allocation of {quantity} {campaign.unit} is recorded in the group batch ledger.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {/* Progress and Specifications Panel */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '24px',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 700, color: 'var(--color-slate)' }}>
              Procurement Volume & Tier Progression
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <CampaignProgressBar campaign={campaign} />
            </div>

            <div style={{ background: 'var(--color-surface-subtle)', borderRadius: '6px', padding: '16px', border: '1px solid var(--color-surface-tint)', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600, color: 'var(--color-slate)' }}>
                Drive Objective & Terms
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-neutral-600)', lineHeight: 1.6 }}>
                {campaign.description}
              </p>
            </div>

            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 600, color: 'var(--color-slate)' }}>
              Procurement Specifications
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '12px' }}>
              <div style={{ border: '1px solid var(--color-surface-tint)', borderRadius: '6px', padding: '10px 12px' }}>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>Product Grade</span>
                <span style={{ fontWeight: 600, color: 'var(--color-slate)' }}>{campaign.productTitle}</span>
              </div>
              <div style={{ border: '1px solid var(--color-surface-tint)', borderRadius: '6px', padding: '10px 12px' }}>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>Batch Minimum Threshold</span>
                <span style={{ fontWeight: 600, color: 'var(--color-slate)' }}>{campaign.minimumQuantity} {campaign.unit}</span>
              </div>
              <div style={{ border: '1px solid var(--color-surface-tint)', borderRadius: '6px', padding: '10px 12px' }}>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>Target Aggregation Volume</span>
                <span style={{ fontWeight: 600, color: 'var(--color-slate)' }}>{campaign.targetQuantity} {campaign.unit}</span>
              </div>
              <div style={{ border: '1px solid var(--color-surface-tint)', borderRadius: '6px', padding: '10px 12px' }}>
                <span style={{ color: 'var(--color-neutral-500)', display: 'block' }}>Estimated Group Savings</span>
                <span style={{ fontWeight: 700, color: 'var(--color-forest)' }}>
                  ₹{(campaign.currentQuantity * unitSavings).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Farmer Participation Box */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 700, color: 'var(--color-slate)' }}>
                {existingPtc ? 'Your Group Commitment' : 'Join Group Procurement'}
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'var(--color-neutral-600)' }}>
                Aggregate your farm demand with fellow members to secure wholesale rates.
              </p>

              <form onSubmit={handleCommit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
                    Select Volume Allocation ({campaign.unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-surface-tint)',
                      background: 'var(--color-surface-subtle)',
                      fontSize: '15px',
                      fontWeight: 700,
                    }}
                  />
                </div>

                <div
                  style={{
                    background: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-surface-tint)',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '20px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-neutral-600)' }}>Bulk Unit Rate</span>
                    <strong style={{ color: 'var(--color-slate)' }}>₹{campaign.bulkPrice} / {campaign.unit}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-neutral-600)' }}>Total Procurement Cost</span>
                    <strong style={{ color: 'var(--color-slate)' }}>₹{calculatedTotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--color-surface-tint)', paddingTop: '6px', marginTop: '6px' }}>
                    <span style={{ color: '#D97706', fontWeight: 600 }}>Your Direct Savings</span>
                    <strong style={{ color: 'var(--color-forest)', fontSize: '13px' }}>₹{calculatedSavings.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--color-forest)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  {existingPtc ? 'Update Commitment Volume' : 'Commit Volume to Group'}
                </button>
              </form>
            </div>

            {existingPtc && (
              <div style={{ borderTop: '1px solid var(--color-surface-subtle)', paddingTop: '16px', marginTop: '16px' }}>
                <button
                  onClick={handleWithdraw}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #FECACA',
                    background: '#FFF1F2',
                    color: '#9F1239',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Withdraw from Campaign
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Participating Farmers Table */}
        <section
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-surface-tint)' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--color-slate)' }}>
              Participating Farmers Ledger ({campaignParticipations.length})
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              Volume pooling commitments across member villages
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-surface-tint)' }}>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Farmer</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Village / Cluster</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Committed Volume</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Order Value</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Farmer Savings</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {campaignParticipations.map((ptc) => (
                  <tr key={ptc.id} style={{ borderBottom: '1px solid var(--color-surface-subtle)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-slate)' }}>
                      {ptc.farmerName} {ptc.farmerId === currentFarmerId && <span style={{ fontSize: '10px', color: 'var(--color-forest)', background: '#EAF6EF', padding: '1px 5px', borderRadius: '3px' }}>(You)</span>}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-neutral-700)' }}>
                      {ptc.village}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-slate)' }}>
                      {ptc.quantity} {campaign.unit}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-slate)' }}>
                      ₹{ptc.totalPrice.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-forest)' }}>
                      ₹{ptc.potentialSavings.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: '#EAF6EF',
                          color: '#01421E',
                          textTransform: 'uppercase',
                        }}
                      >
                        {ptc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
