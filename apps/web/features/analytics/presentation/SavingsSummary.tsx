// ============================================================
// AGRITRADE SAVINGS INTELLIGENCE COMPONENT
// Transparent calculation breakdown vs traditional retail pricing
// ============================================================

'use client';

import React from 'react';
import type { SavingsMetric } from '../domain/analytics';

interface SavingsSummaryProps {
  savings: SavingsMetric;
}

export function SavingsSummary({ savings }: SavingsSummaryProps) {
  return (
    <div className="space-y-5">
      {/* Top Headline KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Farmer Savings */}
        <div className="p-4 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Total Direct Savings
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
            ₹{savings.totalSavings.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1.5 flex items-center gap-1">
            <span>vs. catalog list price</span>
          </div>
        </div>

        {/* Traditional Retail Baseline */}
        <div className="p-4 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Offline Retail Estimate
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--color-text-primary)] mt-1">
            ₹{savings.traditionalRetailEstimate.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1.5 flex items-center gap-1">
            <span>+16.5% standard middleman markup</span>
          </div>
        </div>

        {/* Average Discount Realized */}
        <div className="p-4 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Average Realized Discount
          </div>
          <div className="text-2xl font-bold font-mono text-[#0B3D2E] mt-1">
            {savings.averageDiscountPercent.toFixed(1)}%
          </div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1.5">
            <span>Effective margin advantage</span>
          </div>
        </div>
      </div>

      {/* Savings Components Breakdown Table */}
      <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
        <div className="bg-[var(--color-surface-variant)] px-4 py-2.5 border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center justify-between">
          <span>Savings Component</span>
          <span>Verified Benefit</span>
        </div>

        <div className="divide-y divide-[var(--color-border-subtle)] text-sm bg-[var(--color-surface)]">
          {/* Direct Product Discounts */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-medium text-[var(--color-text-primary)]">Direct Product Discounts</div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                Direct-from-manufacturer wholesale margin pass-through
              </div>
            </div>
            <div className="font-mono font-semibold text-emerald-800">
              ₹{savings.productDiscountSavings.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Delivery Freight Subsidies */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <div className="font-medium text-[var(--color-text-primary)]">Rural Delivery Freight Subsidy</div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                Subsidized farm-gate logistics vs. private rural courier rates
              </div>
            </div>
            <div className="font-mono font-semibold text-emerald-800">
              ₹{savings.deliverySavings.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Volume / Bulk Discount */}
          {savings.bulkSavings > 0 && (
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--color-text-primary)]">Institutional Volume Rebates</div>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  Tiered bag-rate savings on bulk fertilizer and seeds
                </div>
              </div>
              <div className="font-mono font-semibold text-emerald-800">
                ₹{savings.bulkSavings.toLocaleString('en-IN')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Savings Distribution */}
      {Object.keys(savings.savingsByCategory).length > 0 && (
        <div>
          <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2.5">
            Savings by Input Category
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {Object.entries(savings.savingsByCategory).map(([category, amount]) => (
              <div
                key={category}
                className="p-2.5 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-xs"
              >
                <div className="text-stone-500 truncate">{category}</div>
                <div className="font-mono font-bold text-emerald-800 text-sm mt-0.5">
                  ₹{amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transparent Methodology Disclaimer */}
      <div className="p-3 rounded bg-[var(--color-surface-variant)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] leading-relaxed">
        <strong className="text-[var(--color-text-primary)] font-medium">Calculation Methodology:</strong>{' '}
        Direct savings represent verified reductions against printed MRP and manufacturer list prices. Traditional retail comparison is calculated from audited regional distributor benchmarks (+16.5% standard rural markup).
      </div>
    </div>
  );
}
