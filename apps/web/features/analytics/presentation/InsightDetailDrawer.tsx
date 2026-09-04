// ============================================================
// AGRITRADE INSIGHT DETAIL DRAWER
// Transparent slide-over inspector detailing audit root cause
// ============================================================

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import type { DecisionInsight } from '../domain/insight';

interface InsightDetailDrawerProps {
  insight: DecisionInsight | null;
  onClose: () => void;
}

export function InsightDetailDrawer({ insight, onClose }: InsightDetailDrawerProps) {
  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (insight) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [insight, onClose]);

  if (!insight) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-200"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-xl flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-[var(--color-border)]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded border uppercase tracking-wider bg-stone-100 text-stone-700 border-stone-200">
                {insight.badgeLabel}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded text-stone-500 hover:text-stone-900 hover:bg-[var(--color-surface-elevated)] transition-colors"
                aria-label="Close panel"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mt-3 leading-snug">
              {insight.title}
            </h3>
            <p className="text-xs font-mono text-stone-500 mt-1">Audit Telemetry: {insight.detectedAt}</p>
          </div>

          {/* Body content with the 4 transparent sections */}
          <div className="p-6 space-y-6 flex-1">
            {/* Section 1: What Happened */}
            <div>
              <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
                What Happened
              </div>
              <p className="text-sm text-[var(--color-text-primary)] leading-relaxed bg-[var(--color-surface-variant)] p-3 rounded border border-[var(--color-border-subtle)]">
                {insight.detail.whatHappened}
              </p>
            </div>

            {/* Section 2: Why It Was Detected */}
            <div>
              <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
                Why Detected (Deterministic Audit)
              </div>
              <p className="text-sm text-[var(--color-text-primary)] leading-relaxed bg-[var(--color-surface-variant)] p-3 rounded border border-[var(--color-border-subtle)]">
                {insight.detail.whyDetected}
              </p>
            </div>

            {/* Section 3: Supporting Data */}
            <div>
              <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                Supporting Verification Data
              </div>
              <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--color-surface-variant)] border-b border-[var(--color-border)] text-stone-500 font-medium">
                    <tr>
                      <th className="p-2.5">Telemetry Metric</th>
                      <th className="p-2.5">Observed Value</th>
                      <th className="p-2.5">Benchmark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-subtle)] font-mono">
                    {insight.detail.supportingData.map((d, idx) => (
                      <tr key={idx} className="hover:bg-[var(--color-surface-elevated)]">
                        <td className="p-2.5 font-sans font-medium text-[var(--color-text-primary)]">
                          {d.metric}
                        </td>
                        <td className="p-2.5 font-semibold text-[#0B3D2E]">{d.value}</td>
                        <td className="p-2.5 text-stone-500">{d.benchmark || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Recommended Consideration */}
            <div>
              <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
                Recommended Agronomic / Financial Consideration
              </div>
              <div className="text-sm text-[var(--color-text-primary)] leading-relaxed border-l-2 border-[#0B3D2E] pl-3 py-1 bg-stone-50/50">
                {insight.detail.recommendedConsideration}
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-variant)] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              Close Inspector
            </button>

            {insight.detail.actionHref && (
              <Link
                href={insight.detail.actionHref}
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0B3D2E] hover:bg-[#082a20] rounded transition-colors"
              >
                {insight.detail.actionLabel || 'View Related Records'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
