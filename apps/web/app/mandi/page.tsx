'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Minus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  X,
} from 'lucide-react';
import AppShellLayout from '@/components/layout/AppShell';
import { MOCK_COMMODITY_DETAILS } from '@/features/mandi/data/mandi-repository';
import type { MandiCommodityDetail } from '@/types';

const emptySubscribe = () => () => {};
const useMounted = () => React.useSyncExternalStore(emptySubscribe, () => true, () => false);

export default function MandiPage() {
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCommodity, setActiveCommodity] = useState<MandiCommodityDetail | null>(null);
  const mounted = useMounted();

  const commodities = MOCK_COMMODITY_DETAILS;

  const cropNames = ['All', ...Array.from(new Set(commodities.map((c) => c.crop)))];

  const filteredCommodities = commodities.filter((c) => {
    const matchesCrop = selectedCrop === 'All' || c.crop === selectedCrop;
    const matchesSearch =
      c.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  if (!mounted) return null;

  return (
    <AppShellLayout>
      <div className="container-app" style={{ paddingBottom: 'var(--space-2xl)' }}>
        {/* Breadcrumb & Header */}
        <div style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
            <Link href="/home" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>APMC Mandi Intelligence</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="text-h1" style={{ margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Activity size={26} style={{ color: 'var(--color-forest)' }} />
                Institutional Market Intelligence
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                Official APMC modal rates, arrivals volume, and inter-mandi price spreads across Indian terminal markets
              </p>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-forest-50, #EAF6EF)',
                color: 'var(--color-forest)',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Latest Available APMC Data
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {/* Crop pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {cropNames.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 13,
                  fontWeight: selectedCrop === crop ? 600 : 500,
                  background: selectedCrop === crop ? 'var(--color-forest)' : 'var(--color-surface)',
                  color: selectedCrop === crop ? '#fff' : 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--motion-fast) var(--ease-standard)',
                }}
              >
                {crop}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }}
            />
            <input
              type="text"
              placeholder="Search commodity or market..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                fontSize: 13,
                color: 'var(--color-text-primary)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Mandi Benchmark Table (Desktop Dense Institutional Grid) */}
        <div
          className="card-base"
          style={{
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-variant)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Commodity</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Benchmark APMC</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'right' }}>Modal Price</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'right' }}>Daily Delta</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'right' }}>Price Band (Min - Max)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'right' }}>Daily Arrivals</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommodities.map((item) => {
                  const isUp = item.trend === 'up';
                  const isDown = item.trend === 'down';
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        transition: 'background var(--motion-fast) var(--ease-standard)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-variant)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => setActiveCommodity(item)}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.crop}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{item.variety}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: 'var(--color-text-primary)' }}>{item.market}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{item.state}</div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--color-forest)', fontSize: 15 }}>
                        ₹{item.modalPrice.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--color-text-tertiary)' }}>/ qtl</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            fontWeight: 600,
                            fontSize: 12.5,
                            color: isUp ? 'var(--color-success)' : isDown ? 'var(--color-error)' : 'var(--color-text-tertiary)',
                          }}
                        >
                          {isUp && <ArrowUpRight size={14} />}
                          {isDown && <ArrowDownRight size={14} />}
                          {!isUp && !isDown && <Minus size={14} />}
                          {item.change}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--color-text-secondary)', fontSize: 13 }}>
                        ₹{item.minPrice.toLocaleString()} – ₹{item.maxPrice.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                        {item.arrivalVolumeTonnes.toLocaleString()} MT
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCommodity(item);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--color-surface-variant)',
                            border: '1px solid var(--color-border)',
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--color-forest)',
                            cursor: 'pointer',
                          }}
                        >
                          Deep Dive
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commodity Detail Modal / Drawer */}
        {activeCommodity && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: 20,
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setActiveCommodity(null)}
          >
            <div
              className="card-base"
              style={{
                width: '100%',
                maxWidth: 640,
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-forest)' }}>
                    Commodity Profile
                  </span>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', margin: '4px 0 2px' }}>
                    {activeCommodity.crop} ({activeCommodity.variety})
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', margin: 0 }}>
                    Primary Benchmark: {activeCommodity.market}, {activeCommodity.state} • {activeCommodity.updatedAt}
                  </p>
                </div>
                <button
                  onClick={() => setActiveCommodity(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-tertiary)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Price Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-variant)' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 2 }}>Modal Price</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-forest)' }}>
                    ₹{activeCommodity.modalPrice.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: activeCommodity.trend === 'up' ? 'var(--color-success)' : 'var(--color-error)' }}>
                    {activeCommodity.change}
                  </div>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-variant)' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 2 }}>Min / Max Band</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    ₹{activeCommodity.minPrice} – ₹{activeCommodity.maxPrice}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>₹/quintal</div>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-variant)' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 2 }}>Daily Arrivals</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {activeCommodity.arrivalVolumeTonnes} MT
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Reported Volume</div>
                </div>
              </div>

              {/* Sparkline Visualization */}
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-variant)', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    7-Day Price Trajectory (₹/qtl)
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-forest)' }}>
                    Current: ₹{activeCommodity.sparkline[activeCommodity.sparkline.length - 1]}
                  </span>
                </div>

                {/* SVG Line Chart */}
                <div style={{ height: 90, width: '100%', position: 'relative' }}>
                  <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <polyline
                      fill="none"
                      stroke="var(--color-forest)"
                      strokeWidth="2.5"
                      points={activeCommodity.sparkline
                        .map((val, idx) => {
                          const min = Math.min(...activeCommodity.sparkline);
                          const max = Math.max(...activeCommodity.sparkline);
                          const range = max - min || 1;
                          const x = (idx / (activeCommodity.sparkline.length - 1)) * 560;
                          const y = 80 - ((val - min) / range) * 70;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>
              </div>

              {/* Inter-Mandi Comparison Table */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 10px' }}>
                  Cross-Market Price Arbitrage
                </h4>
                <div style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: 'var(--color-surface-variant)', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--color-text-secondary)' }}>APMC Terminal</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>Modal Rate</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>Spread vs Benchmark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCommodity.marketComparisons.map((comp) => (
                        <tr key={comp.marketName} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '8px 12px', fontWeight: 500 }}>{comp.marketName}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>₹{comp.modalPrice.toLocaleString()}</td>
                          <td
                            style={{
                              padding: '8px 12px',
                              textAlign: 'right',
                              fontWeight: 600,
                              color: comp.difference.startsWith('+')
                                ? 'var(--color-success)'
                                : comp.difference.startsWith('-')
                                ? 'var(--color-error)'
                                : 'var(--color-text-tertiary)',
                            }}
                          >
                            {comp.difference}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShellLayout>
  );
}
