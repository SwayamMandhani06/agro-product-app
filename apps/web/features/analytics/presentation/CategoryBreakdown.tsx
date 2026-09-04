// ============================================================
// AGRITRADE CATEGORY SPENDING BREAKDOWN
// Horizontal financial allocation bars with Linear-style data density
// ============================================================

'use client';

import React from 'react';
import type { CategorySpending } from '../domain/analytics';

interface CategoryBreakdownProps {
  categories: CategorySpending[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  // Sort descending by amount
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);
  const maxAmount = Math.max(...categories.map((c) => c.amount), 1);

  return (
    <div className="space-y-4">
      {sortedCategories.map((cat) => {
        const widthPercent = Math.max(2, (cat.amount / maxAmount) * 100);
        const hasSpend = cat.amount > 0;

        return (
          <div
            key={cat.categoryId}
            className="group p-3 rounded-lg border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-all duration-150"
          >
            {/* Top row: Category, Growth & Amount */}
            <div className="flex items-center justify-between text-sm mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {cat.categoryName}
                </span>
                {hasSpend && (
                  <span className="text-xs text-[var(--color-text-secondary)] font-mono">
                    ({cat.percentage.toFixed(1)}%)
                  </span>
                )}
                {cat.growthRate !== 0 && hasSpend && (
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                      cat.growthRate > 0
                        ? 'text-amber-800 bg-amber-50 border border-amber-200'
                        : 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                    }`}
                  >
                    {cat.growthRate > 0 ? `+${cat.growthRate.toFixed(1)}%` : `${cat.growthRate.toFixed(1)}%`}
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="font-mono font-semibold text-[var(--color-text-primary)]">
                  ₹{cat.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Horizontal Bar */}
            <div className="w-full h-2 rounded-full bg-[var(--color-surface-variant)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: hasSpend ? '#0B3D2E' : 'transparent',
                }}
              />
            </div>

            {/* Bottom metadata row */}
            <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] mt-1.5">
              <span className="truncate max-w-[280px]">
                {hasSpend ? (
                  <>
                    <span className="text-stone-500">Top Item: </span>
                    <span className="text-[var(--color-text-primary)] font-medium">{cat.topItem}</span>
                  </>
                ) : (
                  <span className="text-stone-400 italic">No transactions this period</span>
                )}
              </span>

              <span className="font-mono text-stone-500 shrink-0">
                {cat.orderCount} {cat.orderCount === 1 ? 'order' : 'orders'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
