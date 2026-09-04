// ============================================================
// AGRITRADE DECISION INSIGHT CARD
// Restrained, explainable agronomic card with slide-over trigger
// ============================================================

'use client';

import React from 'react';
import type { DecisionInsight } from '../domain/insight';

interface InsightCardProps {
  insight: DecisionInsight;
  onInspect: (insight: DecisionInsight) => void;
}

export function InsightCard({ insight, onInspect }: InsightCardProps) {
  // Severity accent mapping
  const badgeColors: Record<string, string> = {
    warning: 'text-amber-800 bg-amber-50 border-amber-200',
    positive: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    info: 'text-stone-700 bg-stone-100 border-stone-200',
    alert: 'text-rose-800 bg-rose-50 border-rose-200',
  };

  return (
    <div
      onClick={() => onInspect(insight)}
      className="group p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] hover:border-stone-400 cursor-pointer transition-all duration-150 flex flex-col justify-between"
    >
      <div>
        {/* Top badge and telemetry timestamp */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
              badgeColors[insight.severity] || badgeColors.info
            }`}
          >
            {insight.badgeLabel}
          </span>
          <span className="text-[11px] font-mono text-stone-500">{insight.detectedAt}</span>
        </div>

        {/* Headline */}
        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[#0B3D2E] transition-colors leading-snug">
          {insight.title}
        </h4>

        {/* Summary */}
        <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
          {insight.summary}
        </p>
      </div>

      {/* Footer link & supporting metric */}
      <div className="mt-3 pt-2.5 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] text-stone-500 font-medium">
          {insight.supportingMetric}
        </span>
        <span className="text-[#0B3D2E] font-medium text-xs group-hover:underline flex items-center gap-1">
          Inspect Diagnosis →
        </span>
      </div>
    </div>
  );
}
