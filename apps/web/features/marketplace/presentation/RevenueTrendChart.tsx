'use client';

import React, { useState } from 'react';

interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

const SAMPLE_7D: RevenueDataPoint[] = [
  { date: 'Aug 29', revenue: 42500, orders: 11 },
  { date: 'Aug 30', revenue: 56200, orders: 14 },
  { date: 'Aug 31', revenue: 38900, orders: 9 },
  { date: 'Sep 01', revenue: 74800, orders: 19 },
  { date: 'Sep 02', revenue: 68400, orders: 16 },
  { date: 'Sep 03', revenue: 92300, orders: 23 },
  { date: 'Sep 04', revenue: 84600, orders: 21 },
];

const SAMPLE_30D: RevenueDataPoint[] = [
  { date: 'W1 Aug', revenue: 210000, orders: 54 },
  { date: 'W2 Aug', revenue: 275000, orders: 68 },
  { date: 'W3 Aug', revenue: 340000, orders: 85 },
  { date: 'W4 Aug', revenue: 412000, orders: 102 },
  { date: 'W1 Sep', revenue: 486250, orders: 121 },
];

export function RevenueTrendChart() {
  const [timeRange, setTimeRange] = useState<'7D' | '30D'>('7D');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = timeRange === '7D' ? SAMPLE_7D : SAMPLE_30D;
  const maxRevenue = Math.max(...data.map((d) => d.revenue)) * 1.15;

  const width = 640;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.revenue / maxRevenue) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-tint)',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          borderBottom: '1px solid var(--color-surface-subtle)',
          paddingBottom: '12px',
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-slate)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Gross Revenue & Dispatch Velocity
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
            Realtime settlement accruals across wholesale & retail dispatches
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: 'var(--color-surface-subtle)', padding: '3px', borderRadius: '6px' }}>
          {(['7D', '30D'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                border: 'none',
                background: timeRange === range ? 'var(--color-surface)' : 'transparent',
                color: timeRange === range ? 'var(--color-forest)' : 'var(--color-neutral-600)',
                fontWeight: timeRange === range ? 600 : 500,
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                boxShadow: timeRange === range ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 120ms ease',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#145A43" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#145A43" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="var(--color-neutral-200)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  fontSize="9"
                  textAnchor="end"
                  fill="var(--color-neutral-400)"
                  fontFamily="system-ui, sans-serif"
                >
                  ₹{Math.round((maxRevenue * ratio) / 1000)}k
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#revGrad)" />

          {/* Line stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#145A43"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 5 : 3.5}
                fill={hoveredIdx === i ? '#D97706' : '#145A43'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                style={{ cursor: 'pointer', transition: 'r 150ms ease' }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
              <text
                x={pt.x}
                y={height - 10}
                fontSize="10"
                textAnchor="middle"
                fill="var(--color-neutral-500)"
                fontFamily="system-ui, sans-serif"
              >
                {pt.date}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating details banner */}
        {hoveredIdx !== null && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              background: 'var(--color-slate)',
              color: '#FFFFFF',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ color: 'var(--color-neutral-400)' }}>Date:</span>{' '}
              <strong>{points[hoveredIdx].date}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-neutral-400)' }}>Revenue:</span>{' '}
              <strong style={{ color: '#FFB46A' }}>₹{points[hoveredIdx].revenue.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-neutral-400)' }}>Orders:</span>{' '}
              <strong>{points[hoveredIdx].orders} units</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
