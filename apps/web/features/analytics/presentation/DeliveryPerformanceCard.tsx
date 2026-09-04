// ============================================================
// AGRITRADE DELIVERY PERFORMANCE ANALYTICS
// Integrates Stage 8 rural telematics & dispatch intelligence
// ============================================================

'use client';

import React from 'react';
import type { DeliveryPerformanceMetric } from '../domain/analytics';

interface DeliveryPerformanceCardProps {
  metrics: DeliveryPerformanceMetric;
}

export function DeliveryPerformanceCard({ metrics }: DeliveryPerformanceCardProps) {
  return (
    <div className="space-y-4">
      {/* Primary Operational Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* On-Time Delivery Rate */}
        <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            On-Time Delivery
          </div>
          <div className="text-xl font-bold font-mono text-[#145A43] mt-1">
            {metrics.onTimeRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">SLA window compliance</div>
        </div>

        {/* Avg Delivery Duration */}
        <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Avg Turnaround
          </div>
          <div className="text-xl font-bold font-mono text-[var(--color-text-primary)] mt-1">
            {metrics.averageDeliveryHours}h
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Order to farm gate</div>
        </div>

        {/* First-Attempt Success */}
        <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Attempt Success
          </div>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1">
            {metrics.deliveryAttemptRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">First-attempt drop-off</div>
        </div>

        {/* Total Orders Handled */}
        <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Total Orders
          </div>
          <div className="text-xl font-bold font-mono text-[var(--color-text-primary)] mt-1">
            {metrics.totalOrders}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Logged shipments</div>
        </div>

        {/* Delivered Orders */}
        <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Delivered
          </div>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1">
            {metrics.deliveredOrders}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Confirmed receipts</div>
        </div>

        {/* Active Shipments */}
        <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Active in Transit
          </div>
          <div className="text-xl font-bold font-mono text-amber-800 mt-1">
            {metrics.activeShipments}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Live routing</div>
        </div>
      </div>

      {/* Historical Trend Sparkline / Timeline */}
      {metrics.historyTrend.length > 0 && (
        <div className="p-3.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-variant)]">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
            <span>On-Time Compliance Trend</span>
            <span className="text-[#145A43] font-mono">Stage 8 Verified</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {metrics.historyTrend.map((item, idx) => (
              <div key={idx} className="flex-1 text-center">
                <div className="text-[10px] text-stone-500 truncate mb-1">{item.period}</div>
                <div className="w-full bg-[var(--color-surface)] h-2 rounded-full overflow-hidden border border-[var(--color-border-subtle)]">
                  <div
                    className="bg-[#145A43] h-full rounded-full"
                    style={{ width: `${item.onTimeRate}%` }}
                  />
                </div>
                <div className="text-[11px] font-mono font-semibold text-[var(--color-text-primary)] mt-1">
                  {item.onTimeRate.toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
