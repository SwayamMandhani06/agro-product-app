// ============================================================
// AGRITRADE MARKET ANALYTICS WORKSPACE
// Bloomberg-lite APMC commodity price intelligence & comparison
// ============================================================

'use client';

import React, { useState } from 'react';
import type { MarketComparison } from '../domain/analytics';

interface MarketAnalyticsWorkspaceProps {
  marketData: MarketComparison[];
  selectedCommodity: string;
  onSelectCommodity: (commodity: string) => void;
}

export function MarketAnalyticsWorkspace({
  marketData,
  selectedCommodity,
  onSelectCommodity,
}: MarketAnalyticsWorkspaceProps) {
  const currentItem =
    marketData.find((c) => c.commodity.toLowerCase() === selectedCommodity.toLowerCase()) ||
    marketData[0];

  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  if (!currentItem) return null;

  const prices = currentItem.historicalPrices;
  const minP = currentItem.minPrice * 0.96;
  const maxP = currentItem.maxPrice * 1.04;
  const priceRange = maxP - minP || 1;

  const svgWidth = 600;
  const svgHeight = 180;
  const pad = { top: 15, right: 25, bottom: 25, left: 55 };
  const w = svgWidth - pad.left - pad.right;
  const h = svgHeight - pad.top - pad.bottom;

  const getX = (idx: number) => {
    if (prices.length <= 1) return pad.left + w / 2;
    return pad.left + (idx / (prices.length - 1)) * w;
  };

  const getY = (val: number) => {
    const ratio = (val - minP) / priceRange;
    return pad.top + h - ratio * h;
  };

  const linePoints = prices.map((p, i) => `${getX(i)},${getY(p.price)}`).join(' L ');
  const areaPoints = `M ${linePoints} L ${getX(prices.length - 1)},${pad.top + h} L ${getX(0)},${pad.top + h} Z`;

  const activePoint = hoveredPointIndex !== null ? prices[hoveredPointIndex] : null;
  const activeX = hoveredPointIndex !== null ? getX(hoveredPointIndex) : null;
  const activeY = hoveredPointIndex !== null && activePoint ? getY(activePoint.price) : null;

  return (
    <div className="space-y-4">
      {/* Top Commodity Tab Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[var(--color-border-subtle)]">
        {marketData.map((item) => {
          const isSelected = item.commodity.toLowerCase() === currentItem.commodity.toLowerCase();
          return (
            <button
              key={item.commodity}
              type="button"
              onClick={() => onSelectCommodity(item.commodity)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors shrink-0 ${
                isSelected
                  ? 'bg-[#0B3D2E] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)]'
              }`}
            >
              {item.commodity}
            </button>
          );
        })}
      </div>

      {/* Terminal Market & Headline Spread Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1">
        {/* Spot Modal Price */}
        <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] col-span-2 md:col-span-1">
          <div className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Spot Price
          </div>
          <div className="text-xl font-bold font-mono text-[var(--color-text-primary)] mt-1">
            ₹{currentItem.currentPrice.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] font-mono mt-0.5 flex items-center gap-1">
            <span
              className={
                currentItem.movementPercent >= 0 ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'
              }
            >
              {currentItem.movementPercent >= 0 ? `+${currentItem.movementPercent}%` : `${currentItem.movementPercent}%`}
            </span>
            <span className="text-stone-400">vs 7d avg</span>
          </div>
        </div>

        {/* 30d Average */}
        <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            30d Average
          </div>
          <div className="text-xl font-bold font-mono text-stone-700 mt-1">
            ₹{currentItem.avgPrice.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5 font-mono">Rolling APMC Mean</div>
        </div>

        {/* 30d High */}
        <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            30d High
          </div>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1">
            ₹{currentItem.maxPrice.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Peak trade auction</div>
        </div>

        {/* 30d Low */}
        <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            30d Low
          </div>
          <div className="text-xl font-bold font-mono text-rose-800 mt-1">
            ₹{currentItem.minPrice.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Floor trade auction</div>
        </div>

        {/* Terminal Market */}
        <div className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Terminal Market
          </div>
          <div className="text-sm font-bold text-[var(--color-text-primary)] mt-1 truncate">
            {currentItem.mandi}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5 truncate">{currentItem.state}</div>
        </div>
      </div>

      {/* SVG Price Trend Line */}
      <div className="relative p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
          <span>{currentItem.commodity} ({currentItem.variety}) — Price Curve</span>
          <span className="font-mono text-stone-500">{currentItem.unit}</span>
        </div>

        <div className="relative w-full select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible"
            style={{ maxHeight: 180 }}
          >
            {/* Horizontal Grid lines */}
            {[0, 0.5, 1].map((pct, idx) => {
              const y = pad.top + h * (1 - pct);
              const val = Math.round(minP + priceRange * pct);
              return (
                <g key={idx}>
                  <line
                    x1={pad.left}
                    y1={y}
                    x2={svgWidth - pad.right}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity="0.08"
                    strokeWidth="1"
                  />
                  <text
                    x={pad.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="var(--color-text-secondary)"
                    className="font-mono"
                  >
                    ₹{val}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path
              d={areaPoints}
              fill="#0B3D2E"
              fillOpacity="0.08"
            />

            {/* Price Line */}
            <path
              d={`M ${linePoints}`}
              fill="none"
              stroke="#0B3D2E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Historical points */}
            {prices.map((p, i) => {
              const cx = getX(i);
              const cy = getY(p.price);
              const isHovered = hoveredPointIndex === i;

              return (
                <g key={i}>
                  <text
                    x={cx}
                    y={svgHeight - 6}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--color-text-secondary)"
                    className="font-sans"
                  >
                    {p.label}
                  </text>

                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 5 : 3}
                    fill={isHovered ? '#0B3D2E' : '#FFFFFF'}
                    stroke="#0B3D2E"
                    strokeWidth={isHovered ? 2.5 : 2}
                  />
                </g>
              );
            })}

            {/* Crosshair on hover */}
            {activeX !== null && activeY !== null && (
              <g className="pointer-events-none">
                <line
                  x1={activeX}
                  y1={pad.top}
                  x2={activeX}
                  y2={pad.top + h}
                  stroke="#0B3D2E"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  strokeOpacity="0.5"
                />
              </g>
            )}

            {/* Invisible mouse hover zones */}
            {prices.map((_, i) => {
              const stepW = w / (prices.length - 1 || 1);
              const x = getX(i) - stepW / 2;
              return (
                <rect
                  key={`zone-${i}`}
                  x={Math.max(pad.left, x)}
                  y={pad.top}
                  width={stepW}
                  height={h}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPointIndex(i)}
                  onMouseLeave={() => setHoveredPointIndex(null)}
                />
              );
            })}
          </svg>

          {/* Floating Tooltip */}
          {activePoint && activeX !== null && activeY !== null && (
            <div
              className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
              style={{
                left: `${(activeX / svgWidth) * 100}%`,
                top: `${(activeY / svgHeight) * 100}%`,
              }}
            >
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md rounded px-2.5 py-1.5 text-xs whitespace-nowrap">
                <div className="text-[10px] text-stone-500 font-mono">{activePoint.date}</div>
                <div className="font-mono font-bold text-[var(--color-text-primary)]">
                  ₹{activePoint.price.toLocaleString('en-IN')} / Qtl
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
