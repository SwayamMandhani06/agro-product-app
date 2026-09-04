// ============================================================
// AGRITRADE SPENDING TREND CHART
// Restrained SVG financial area/line chart with hover crosshairs
// ============================================================

'use client';

import React, { useState, useId } from 'react';
import type { SpendingTrendPoint } from '../domain/analytics';

interface SpendingTrendChartProps {
  data: SpendingTrendPoint[];
  height?: number;
}

export function SpendingTrendChart({ data, height = 240 }: SpendingTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradientId = useId();

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm border border-dashed rounded text-[var(--color-text-secondary)]"
        style={{ height, borderColor: 'var(--color-border)' }}
      >
        No spending activity recorded for this period
      </div>
    );
  }

  const maxAmount = Math.max(...data.map((d) => Math.max(d.amount, d.benchmarkAmount || 0)), 1000);
  const yAxisCeiling = Math.ceil(maxAmount * 1.15 / 1000) * 1000;

  // Viewbox coordinates
  const svgWidth = 800;
  const svgHeight = height;
  const padding = { top: 20, right: 30, bottom: 35, left: 65 };

  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const getX = (index: number) => {
    if (data.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const ratio = Math.max(0, Math.min(1, val / yAxisCeiling));
    return padding.top + chartHeight - ratio * chartHeight;
  };

  // Main curve path
  const points = data.map((d, i) => `${getX(i)},${getY(d.amount)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${getX(data.length - 1)},${padding.top + chartHeight} L ${getX(0)},${padding.top + chartHeight} Z`;

  // Benchmark dashed line path
  const benchmarkPoints = data.map((d, i) => `${getX(i)},${getY(d.benchmarkAmount || d.amount * 0.9)}`);
  const benchmarkPath = `M ${benchmarkPoints.join(' L ')}`;

  // Gridlines (4 horizontal divisions)
  const gridDivisions = [0, 0.33, 0.66, 1];

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : null;
  const activeX = hoveredIndex !== null ? getX(hoveredIndex) : null;
  const activeY = hoveredIndex !== null && activePoint ? getY(activePoint.amount) : null;

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible"
        style={{ maxHeight: height }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B3D2E" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#0B3D2E" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines & Y-axis labels */}
        {gridDivisions.map((pct, idx) => {
          const y = padding.top + chartHeight * (1 - pct);
          const value = Math.round(yAxisCeiling * pct);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={svgWidth - padding.right}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeWidth="1"
              />
              <text
                x={padding.left - 12}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--color-text-secondary)"
                className="font-mono"
              >
                ₹{value.toLocaleString('en-IN')}
              </text>
            </g>
          );
        })}

        {/* Benchmark Reference Line (Subtle Prior Trend) */}
        <path
          d={benchmarkPath}
          fill="none"
          stroke="#78716C"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeOpacity="0.6"
        />

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Active line */}
        <path
          d={linePath}
          fill="none"
          stroke="#0B3D2E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & X-axis labels */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.amount);
          const isHovered = hoveredIndex === i;

          return (
            <g key={i}>
              <text
                x={cx}
                y={svgHeight - 10}
                textAnchor="middle"
                fontSize="11"
                fill="var(--color-text-secondary)"
                className="font-sans font-medium"
              >
                {d.label}
              </text>

              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 5.5 : 3.5}
                fill={isHovered ? '#0B3D2E' : '#FFFFFF'}
                stroke="#0B3D2E"
                strokeWidth={isHovered ? 2.5 : 2}
                className="transition-all duration-150"
              />
            </g>
          );
        })}

        {/* Hover Crosshair */}
        {activeX !== null && activeY !== null && (
          <g className="pointer-events-none">
            <line
              x1={activeX}
              y1={padding.top}
              x2={activeX}
              y2={padding.top + chartHeight}
              stroke="#0B3D2E"
              strokeWidth="1"
              strokeDasharray="2 2"
              strokeOpacity="0.5"
            />
            <circle cx={activeX} cy={activeY} r="6" fill="#0B3D2E" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        )}

        {/* Invisible mouse capture zones */}
        {data.map((_, i) => {
          const stepWidth = chartWidth / (data.length - 1 || 1);
          const x = getX(i) - stepWidth / 2;

          return (
            <rect
              key={`zone-${i}`}
              x={Math.max(padding.left, x)}
              y={padding.top}
              width={stepWidth}
              height={chartHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {activePoint && activeX !== null && activeY !== null && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: `${(activeX / svgWidth) * 100}%`,
            top: `${(activeY / svgHeight) * 100}%`,
          }}
        >
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md rounded px-3 py-2 text-xs min-w-[140px]">
            <div className="text-[var(--color-text-secondary)] font-medium mb-1 flex items-center justify-between">
              <span>{activePoint.label}</span>
              <span className="font-mono text-[10px] text-stone-500">{activePoint.date}</span>
            </div>
            <div className="text-sm font-semibold text-[var(--color-text-primary)] font-mono">
              ₹{activePoint.amount.toLocaleString('en-IN')}
            </div>
            <div className="mt-1 pt-1 border-t border-[var(--color-border-subtle)] text-[11px] flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Orders:</span>
              <span className="font-semibold text-[var(--color-text-primary)]">{activePoint.orderCount}</span>
            </div>
            {activePoint.benchmarkAmount !== undefined && (
              <div className="text-[10px] text-stone-500 mt-0.5 flex items-center justify-between">
                <span>Baseline:</span>
                <span className="font-mono">₹{activePoint.benchmarkAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtle Chart Legend */}
      <div className="flex items-center justify-end gap-5 mt-2 text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-[#0B3D2E] inline-block rounded-full" />
          <span>Active Period Spend</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 border-b border-dashed border-stone-400 inline-block" />
          <span>Baseline Reference</span>
        </div>
      </div>
    </div>
  );
}
