'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplaceStore } from '@/features/marketplace/marketplace-store';
import { CampaignProgressBar } from '@/features/marketplace/presentation/CampaignProgressBar';
import {
  Users,
  Building2,
  Plus,
  ArrowRight,
} from 'lucide-react';

export default function CooperativeCampaignsPage() {
  const { campaigns, cooperatives, activeCooperativeId, createCampaign } = useMarketplaceStore();
  const coop = cooperatives.find((c) => c.id === activeCooperativeId) || cooperatives[0];

  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states for new campaign
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [productTitle, setProductTitle] = useState('Mahadhan NPK 10:26:26 Complex Fertilizer');
  const category = 'Fertilizers';
  const [retailPrice, setRetailPrice] = useState<number>(1475);
  const [bulkPrice, setBulkPrice] = useState<number>(1140);
  const [minimumQty, setMinimumQty] = useState<number>(200);
  const [targetQty, setTargetQty] = useState<number>(500);
  const unit = '50 kg Bag';

  const filteredCampaigns = campaigns.filter((c) => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const totalCollectiveSavings = campaigns.reduce((acc, c) => {
    return acc + c.currentQuantity * (c.retailPrice - c.bulkPrice);
  }, 0);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const discountPercent = Math.round(((retailPrice - bulkPrice) / retailPrice) * 1000) / 10;

    createCampaign({
      cooperativeId: coop.id,
      cooperativeName: coop.name,
      title: title.trim(),
      description: description.trim() || 'Cooperative bulk volume order aggregation drive.',
      productId: `prod_bulk_${Date.now()}`,
      productTitle,
      category,
      targetQuantity: targetQty,
      minimumQuantity: minimumQty,
      retailPrice,
      bulkPrice,
      unit,
      discountPercent,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 20 * 86400000).toISOString(),
      status: 'active',
      sellerName: 'Direct Manufacturer Depot',
    });

    setIsCreateOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      {/* Cooperative Header */}
      <header style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-surface-tint)', marginBottom: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#145A43', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--color-slate)' }}>
                  {coop.name}
                </h1>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#EAF6EF', color: '#01421E', border: '1px solid #CEEAD9' }}>
                  Registered FPO
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '3px' }}>
                Reg: {coop.registrationNumber} • {coop.memberCount} Member Farmers • District: {coop.district}, {coop.state}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsCreateOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--color-forest)',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Plus size={16} /> Initiate Bulk Drive
            </button>

            <Link
              href="/seller/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--color-surface-subtle)',
                color: 'var(--color-slate)',
                border: '1px solid var(--color-surface-tint)',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              <Building2 size={15} /> Seller Portal
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Collective Impact Summary */}
        <div
          style={{
            background: '#145A43',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          <div>
            <span style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Collective Farmer Savings
            </span>
            <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '4px', color: '#FFB46A' }}>
              ₹{totalCollectiveSavings.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '4px' }}>
              Generated via wholesale factory-gate aggregation
            </div>
          </div>

          <div>
            <span style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Procurement Drives
            </span>
            <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '4px' }}>
              {campaigns.filter((c) => c.status === 'active' || c.status === 'threshold_reached').length} Campaigns
            </div>
            <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '4px' }}>
              Across seeds, fertilizers, and micronutrients
            </div>
          </div>

          <div>
            <span style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Participating Farmers
            </span>
            <div style={{ fontSize: '28px', fontWeight: 700, marginTop: '4px' }}>
              {campaigns.reduce((acc, c) => acc + c.participantsCount, 0)} Farmers
            </div>
            <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '4px' }}>
              Pooled orders across Baramati & Indapur clusters
            </div>
          </div>
        </div>

        {/* Campaign Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-slate)' }}>
              Bulk Procurement Campaigns
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              Join active group orders to unlock tier-discounted wholesale prices
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px', background: 'var(--color-surface-subtle)', padding: '4px', borderRadius: '6px' }}>
            {['all', 'active', 'threshold_reached', 'processing'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  border: 'none',
                  background: statusFilter === st ? 'var(--color-surface)' : 'transparent',
                  color: statusFilter === st ? 'var(--color-forest)' : 'var(--color-neutral-600)',
                  fontWeight: statusFilter === st ? 600 : 500,
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  boxShadow: statusFilter === st ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {st === 'threshold_reached' ? 'Threshold Reached' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filteredCampaigns.map((camp) => {
            const savingsPerUnit = camp.retailPrice - camp.bulkPrice;

            return (
              <div
                key={camp.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-tint)',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-forest)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {camp.category}
                    </span>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background:
                          camp.status === 'processing'
                            ? '#EFF6FF'
                            : camp.status === 'threshold_reached'
                            ? '#EAF6EF'
                            : '#FEF3C7',
                        color:
                          camp.status === 'processing'
                            ? '#1E40AF'
                            : camp.status === 'threshold_reached'
                            ? '#01421E'
                            : '#92400E',
                        textTransform: 'uppercase',
                      }}
                    >
                      {camp.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 700, color: 'var(--color-slate)', lineHeight: 1.3 }}>
                    {camp.title}
                  </h3>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-neutral-600)', marginBottom: '12px' }}>
                    Product: <strong>{camp.productTitle}</strong>
                  </div>

                  {/* Pricing Comparison */}
                  <div
                    style={{
                      background: 'var(--color-surface-subtle)',
                      border: '1px solid var(--color-surface-tint)',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>Group Bulk Price</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-forest)' }}>
                        ₹{camp.bulkPrice.toLocaleString('en-IN')}{' '}
                        <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--color-neutral-600)' }}>
                          / {camp.unit}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', textDecoration: 'line-through' }}>
                        Retail: ₹{camp.retailPrice}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#D97706' }}>
                        Save {camp.discountPercent}% (₹{savingsPerUnit}/{camp.unit})
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <CampaignProgressBar campaign={camp} />
                  </div>
                </div>

                {/* Footer Link */}
                <div style={{ borderTop: '1px solid var(--color-surface-subtle)', paddingTop: '14px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-neutral-600)' }}>
                    {camp.participantsCount} Farmers joined
                  </span>

                  <Link
                    href={`/cooperative/campaigns/${camp.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'var(--color-forest)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '6px 14px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                    }}
                  >
                    Commit Volume <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Campaign Modal */}
        {isCreateOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99, padding: '20px' }}>
            <form
              onSubmit={handleCreateCampaign}
              style={{
                background: 'var(--color-surface)',
                borderRadius: '8px',
                padding: '24px',
                width: '100%',
                maxWidth: '520px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--color-slate)' }}>
                Initiate FPO Bulk Procurement Drive
              </h3>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '4px' }}>
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rabi Season Bulk NPK 10:26:26 Procurement Drive"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-tint)', background: 'var(--color-surface-subtle)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '4px' }}>
                  Product Title & Grade
                </label>
                <input
                  type="text"
                  required
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-tint)', background: 'var(--color-surface-subtle)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '4px' }}>
                    Retail Price (₹)
                  </label>
                  <input
                    type="number"
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-tint)', background: 'var(--color-surface-subtle)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '4px' }}>
                    Target Bulk Price (₹)
                  </label>
                  <input
                    type="number"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-tint)', background: 'var(--color-surface-subtle)', fontSize: '13px', fontWeight: 600 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '4px' }}>
                    Minimum MOQ Threshold
                  </label>
                  <input
                    type="number"
                    value={minimumQty}
                    onChange={(e) => setMinimumQty(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-tint)', background: 'var(--color-surface-subtle)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '4px' }}>
                    Target Volume Target
                  </label>
                  <input
                    type="number"
                    value={targetQty}
                    onChange={(e) => setTargetQty(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-surface-tint)', background: 'var(--color-surface-subtle)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  style={{ border: '1px solid var(--color-surface-tint)', background: 'var(--color-surface)', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ border: 'none', background: 'var(--color-forest)', color: '#FFFFFF', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Launch Procurement Drive
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
