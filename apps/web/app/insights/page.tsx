// ============================================================
// AGRITRADE FARM INSIGHTS & DECISION INTELLIGENCE WORKSPACE
// Desktop-first institutional decision support platform
// Route: /insights
// ============================================================

'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import {
  useAnalyticsStore,
  TIME_RANGE_LABELS,
  type TimeRange,
  SpendingTrendChart,
  CategoryBreakdown,
  SavingsSummary,
  DeliveryPerformanceCard,
  MarketAnalyticsWorkspace,
  InsightCard,
  InsightDetailDrawer,
} from '@/features/analytics';

const TIME_RANGES: TimeRange[] = ['7d', '30d', '3m', '6m', '1y'];

type InsightTab = 'overview' | 'spending' | 'market' | 'logistics';

export default function InsightsPage() {
  const {
    timeRange,
    snapshot,
    insights,
    selectedInsight,
    selectedCommodity,
    marketData,
    setTimeRange,
    selectInsight,
    selectCommodity,
  } = useAnalyticsStore();

  const [activeTab, setActiveTab] = useState<InsightTab>('overview');

  const spending = snapshot.spending;

  return (
    <AppShell>
      <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text-primary)] pb-16">
        {/* Institutional Workspace Header */}
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    Farm Insights
                  </h1>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Decision Support v9
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Audited capital outlay, seasonal purchasing patterns, and APMC market intelligence.
                </p>
              </div>

              {/* Time Range Selector & Telemetry Status */}
              <div className="flex items-center gap-3 self-start md:self-auto">
                <div className="text-[11px] font-mono text-stone-500 hidden sm:block">
                  Audit: <span className="font-semibold text-stone-700">{snapshot.lastUpdated}</span>
                </div>

                <div className="inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-variant)] p-0.5">
                  {TIME_RANGES.map((range) => {
                    const isActive = timeRange === range;
                    return (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                          isActive
                            ? 'bg-[#0B3D2E] text-white shadow-xs font-semibold'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        }`}
                      >
                        {TIME_RANGE_LABELS[range]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation Tabs for High Information Density */}
            <div className="flex items-center gap-6 mt-4 border-t border-[var(--color-border-subtle)] pt-3 text-xs font-medium">
              {[
                { id: 'overview' as const, label: 'Executive Intelligence' },
                { id: 'spending' as const, label: 'Input Capital & Categories' },
                { id: 'market' as const, label: 'APMC Market Terminal' },
                { id: 'logistics' as const, label: 'Logistics SLA & Delivery' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#0B3D2E] text-[#0B3D2E] font-semibold'
                      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workspace Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          {/* OVERVIEW / EXECUTIVE INTELLIGENCE TAB */}
          {(activeTab === 'overview' || activeTab === 'spending') && (
            <>
              {/* Top Financial KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Spend KPI */}
                <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Total Input Outlay
                  </div>
                  <div className="text-2xl font-bold font-mono text-[var(--color-text-primary)] mt-1.5">
                    ₹{spending.totalSpend.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs mt-1 flex items-center gap-1.5 font-mono">
                    <span
                      className={`font-semibold ${
                        spending.trendDirection === 'up'
                          ? 'text-amber-800'
                          : spending.trendDirection === 'down'
                          ? 'text-emerald-800'
                          : 'text-stone-500'
                      }`}
                    >
                      {spending.trendDirection === 'up' ? '↑' : spending.trendDirection === 'down' ? '↓' : '→'}{' '}
                      {spending.percentageChange.toFixed(1)}%
                    </span>
                    <span className="text-[var(--color-text-secondary)]">vs prior {TIME_RANGE_LABELS[timeRange]}</span>
                  </div>
                </div>

                {/* Direct Savings KPI */}
                <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Net Farmer Savings
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-800 mt-1.5">
                    ₹{snapshot.savings.totalSavings.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1 flex items-center justify-between">
                    <span>{snapshot.savings.averageDiscountPercent.toFixed(1)}% avg discount</span>
                    <span className="font-mono text-stone-500">Catalog Pass-through</span>
                  </div>
                </div>

                {/* Orders Handled */}
                <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Purchasing Frequency
                  </div>
                  <div className="text-2xl font-bold font-mono text-[var(--color-text-primary)] mt-1.5">
                    {spending.orderCount} <span className="text-sm font-normal text-stone-500">orders</span>
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1 font-mono">
                    Avg Order: ₹{Math.round(spending.averageOrderValue).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Fulfillment Reliability */}
                <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    On-Time Delivery SLA
                  </div>
                  <div className="text-2xl font-bold font-mono text-[#0B3D2E] mt-1.5">
                    {snapshot.deliveryPerformance.onTimeRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1 flex items-center justify-between">
                    <span>{snapshot.deliveryPerformance.averageDeliveryHours}h Avg window</span>
                    <span className="font-mono text-stone-500">Stage 8 Telematics</span>
                  </div>
                </div>
              </div>

              {/* Spending Financial Trend & Category Breakdown Two-Column */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 cols: Spending Trend Chart */}
                <div className="lg:col-span-2 p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[var(--color-border-subtle)] mb-4 gap-2">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                        Agricultural Input Spend Trend
                      </h2>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        Historical procurement outlay with rolling benchmark overlay ({TIME_RANGE_LABELS[timeRange]})
                      </p>
                    </div>

                    <div className="text-xs font-mono font-medium text-stone-600 bg-[var(--color-surface-variant)] px-2.5 py-1 rounded border border-[var(--color-border-subtle)] self-start sm:self-auto">
                      Total: ₹{spending.totalSpend.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <SpendingTrendChart data={snapshot.spendingTrend} height={240} />
                </div>

                {/* Right 1 col: Category Breakdown Horizontal Bars */}
                <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs">
                  <div className="pb-3 border-b border-[var(--color-border-subtle)] mb-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                      Input Category Allocation
                    </h2>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                      Where capital is distributed across farm inputs
                    </p>
                  </div>

                  <CategoryBreakdown categories={snapshot.categories} />
                </div>
              </div>

              {/* Deterministic Decision Insights Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                      Deterministic Farm Intelligence Signals
                    </h2>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Audited anomalies, market dips, and seasonal recommendations derived from verified records.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-stone-500">
                    {insights.length} active signal(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {insights.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      onInspect={(ins) => selectInsight(ins)}
                    />
                  ))}
                </div>
              </div>

              {/* Savings Intelligence Section */}
              <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs">
                <div className="pb-3 border-b border-[var(--color-border-subtle)] mb-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                    Procurement Savings & Traditional Retail Benchmark
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Audited cost differential comparing AgriTrade direct wholesale supply with local distributor markups
                  </p>
                </div>

                <SavingsSummary savings={snapshot.savings} />
              </div>
            </>
          )}

          {/* MARKET INTELLIGENCE TERMINAL TAB */}
          {(activeTab === 'overview' || activeTab === 'market') && (
            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-4">
              <div className="pb-3 border-b border-[var(--color-border-subtle)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                    APMC Commodity Performance Analytics
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Terminal market auction curves, modal prices, and 30-day volatility spreads
                  </p>
                </div>
                <div className="text-xs text-stone-500 font-mono">
                  Tracked Commodities: {marketData.length}
                </div>
              </div>

              <MarketAnalyticsWorkspace
                marketData={marketData}
                selectedCommodity={selectedCommodity}
                onSelectCommodity={(c) => selectCommodity(c)}
              />
            </div>
          )}

          {/* LOGISTICS & DELIVERY PERFORMANCE TAB */}
          {(activeTab === 'overview' || activeTab === 'logistics') && (
            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-4">
              <div className="pb-3 border-b border-[var(--color-border-subtle)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                    Order Fulfillment & Rural Delivery Operations
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Stage 8 telematics, regional transit hubs, and rural dispatch turnaround metrics
                  </p>
                </div>
                <div className="text-xs text-stone-500 font-mono">
                  SLA Target: 95.0% On-Time
                </div>
              </div>

              <DeliveryPerformanceCard metrics={snapshot.deliveryPerformance} />
            </div>
          )}
        </main>
      </div>

      {/* Insight Detail Drawer / Slide-Over */}
      <InsightDetailDrawer
        insight={selectedInsight}
        onClose={() => selectInsight(null)}
      />
    </AppShell>
  );
}
