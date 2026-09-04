'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  Minus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  X,
  ExternalLink,
  WifiOff,
} from 'lucide-react';
import AppShellLayout from '@/components/layout/AppShell';
import { MOCK_COMMODITY_DETAILS } from '@/features/mandi/data/mandi-repository';
import type { MandiCommodityDetail, MandiPrice } from '@/types';
import { connectionManager, type ConnectionState } from '@/lib/realtime/connection-manager';
import { subscribeToMandiPrices } from '@/lib/realtime/subscriptions/mandi';

const emptySubscribe = () => () => {};
const useMounted = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

export default function MandiPage() {
  const [commodities, setCommodities] = useState<MandiCommodityDetail[]>(MOCK_COMMODITY_DETAILS);
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCommodity, setActiveCommodity] = useState<MandiCommodityDetail | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>(connectionManager.getState());
  const [secondsAgo, setSecondsAgo] = useState(6);
  const [recentlyUpdatedCrop, setRecentlyUpdatedCrop] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'modalPrice' | 'arrivalVolumeTonnes' | 'crop'>('modalPrice');
  const [sortAsc, setSortAsc] = useState(false);
  const mounted = useMounted();

  // 1. Subscribe to Connection Lifecycle
  useEffect(() => {
    const unsub = connectionManager.subscribe((state) => {
      setConnectionState(state);
    });
    return unsub;
  }, []);

  // 2. Seconds Ago Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Real-Time APMC Price Updates
  useEffect(() => {
    const unsub = subscribeToMandiPrices((updatedPrice: MandiPrice) => {
      setCommodities((prev) =>
        prev.map((c) => {
          if (c.crop === updatedPrice.crop) {
            const numericPrice =
              parseInt(updatedPrice.price.replace(/[^0-9]/g, ''), 10) || c.modalPrice;
            const updatedSparkline = [...c.sparkline.slice(1), numericPrice];
            return {
              ...c,
              modalPrice: numericPrice,
              change: updatedPrice.change,
              trend: updatedPrice.trend,
              updatedAt: 'Just now',
              sparkline: updatedSparkline,
            };
          }
          return c;
        })
      );

      setRecentlyUpdatedCrop(updatedPrice.crop);
      setSecondsAgo(0);

      // Clear animation highlight after 2.2 seconds (disciplined motion system)
      const clearTimer = setTimeout(() => {
        setRecentlyUpdatedCrop((curr) => (curr === updatedPrice.crop ? null : curr));
      }, 2200);

      return () => clearTimeout(clearTimer);
    });

    return unsub;
  }, []);

  const cropNames = ['All', ...Array.from(new Set(commodities.map((c) => c.crop)))];

  const filteredCommodities = commodities
    .filter((c) => {
      const matchesCrop = selectedCrop === 'All' || c.crop === selectedCrop;
      const matchesSearch =
        c.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.state.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCrop && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'modalPrice') {
        comparison = a.modalPrice - b.modalPrice;
      } else if (sortField === 'arrivalVolumeTonnes') {
        comparison = a.arrivalVolumeTonnes - b.arrivalVolumeTonnes;
      } else {
        comparison = a.crop.localeCompare(b.crop);
      }
      return sortAsc ? comparison : -comparison;
    });

  if (!mounted) return null;

  return (
    <AppShellLayout>
      <div className="container-app" style={{ paddingBottom: 'var(--space-2xl)' }}>
        {/* Offline / Degraded Mode Warning Banner */}
        {connectionState === 'offline' && (
          <div
            style={{
              marginTop: 16,
              padding: '10px 16px',
              borderRadius: 8,
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 13,
              color: '#92400E',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <WifiOff size={16} />
              <span>You&apos;re offline. Showing the latest available market information.</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600 }}>Cached</span>
          </div>
        )}

        {/* Breadcrumb & Header */}
        <div style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
            <Link href="/home" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Mandi Intelligence</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="text-h1" style={{ margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Activity size={26} style={{ color: 'var(--color-forest)' }} />
                Mandi Intelligence Terminal
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                Live wholesale spot prices, arrivals volume, and inter-mandi price spreads across Indian APMCs
              </p>
            </div>

            {/* Subtle Live Status Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '5px 12px',
                  borderRadius: 20,
                  background: connectionState === 'connected' ? '#ECFDF5' : connectionState === 'reconnecting' ? '#FFFBEB' : '#F3F4F6',
                  border: `1px solid ${connectionState === 'connected' ? '#A7F3D0' : connectionState === 'reconnecting' ? '#FDE68A' : '#E5E7EB'}`,
                  color: connectionState === 'connected' ? '#065F46' : connectionState === 'reconnecting' ? '#92400E' : '#4B5563',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: connectionState === 'connected' ? '#10B981' : connectionState === 'reconnecting' ? '#F59E0B' : '#9CA3AF',
                    display: 'inline-block',
                  }}
                />
                <span>
                  {connectionState === 'connected'
                    ? `LIVE · Updated ${secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}`
                    : connectionState === 'reconnecting'
                    ? 'Reconnecting to stream...'
                    : 'Offline · Latest Cached Data'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filter & Sort Controls */}
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
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: selectedCrop === crop ? 600 : 500,
                  background: selectedCrop === crop ? 'var(--color-forest)' : '#fff',
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

          {/* Search box & Sort */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 280 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={15}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }}
              />
              <input
                type="text"
                placeholder="Search commodity, APMC, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  background: '#fff',
                  fontSize: 13,
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                }}
              />
            </div>

            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as typeof sortField)}
              style={{
                padding: '8px 10px',
                borderRadius: 6,
                border: '1px solid var(--color-border)',
                background: '#fff',
                fontSize: 12.5,
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
              }}
            >
              <option value="modalPrice">Price</option>
              <option value="arrivalVolumeTonnes">Volume</option>
              <option value="crop">Name</option>
            </select>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              title="Toggle sort direction"
              style={{
                padding: '8px 10px',
                borderRadius: 6,
                border: '1px solid var(--color-border)',
                background: '#fff',
                fontSize: 12,
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
              }}
            >
              {sortAsc ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {/* Mandi Benchmark Table (Institutional Information Density) */}
        <div
          className="card-base"
          style={{
            borderRadius: 8,
            background: '#fff',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Commodity</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Benchmark APMC</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'right' }}>Modal Price</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'right' }}>24h Movement</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'right' }}>Price Band (Min - Max)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'right' }}>Daily Arrivals</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-secondary)', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommodities.map((item) => {
                  const isUp = item.trend === 'up';
                  const isDown = item.trend === 'down';
                  const isJustUpdated = recentlyUpdatedCrop === item.crop;

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        background: isJustUpdated ? '#F0FDF4' : 'transparent',
                        transition: 'background 400ms ease, border-color 400ms ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isJustUpdated) e.currentTarget.style.background = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        if (!isJustUpdated) e.currentTarget.style.background = 'transparent';
                      }}
                      onClick={() => setActiveCommodity(item)}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.crop}</span>
                          {isJustUpdated && (
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                background: '#10B981',
                                color: '#fff',
                                padding: '1px 5px',
                                borderRadius: 3,
                                letterSpacing: '0.3px',
                              }}
                            >
                              LIVE TICK
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{item.variety}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: 'var(--color-text-primary)' }}>{item.market}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{item.state}</div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--color-forest)', fontSize: 15 }}>
                        ₹{item.modalPrice.toLocaleString('en-IN')} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--color-text-tertiary)' }}>/ qtl</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            fontWeight: 600,
                            fontSize: 12.5,
                            color: isUp ? '#059669' : isDown ? '#DC2626' : '#6B7280',
                          }}
                        >
                          {isUp && <ArrowUpRight size={14} />}
                          {isDown && <ArrowDownRight size={14} />}
                          {!isUp && !isDown && <Minus size={14} />}
                          {item.change}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--color-text-secondary)', fontSize: 13 }}>
                        ₹{item.minPrice.toLocaleString('en-IN')} – ₹{item.maxPrice.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                        {item.arrivalVolumeTonnes.toLocaleString('en-IN')} MT
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCommodity(item);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 6,
                            background: '#F1F5F9',
                            border: '1px solid var(--color-border)',
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--color-forest)',
                            cursor: 'pointer',
                          }}
                        >
                          Inspect Spread
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
              background: 'rgba(0,0,0,0.45)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setActiveCommodity(null)}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 10,
                width: '100%',
                maxWidth: 680,
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '1px solid var(--color-border)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--color-forest)',
                  color: '#fff',
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#FCD34D', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    APMC Benchmark Intelligence
                  </div>
                  <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800 }}>
                    {activeCommodity.crop} — {activeCommodity.variety}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveCommodity(null)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: 24 }}>
                {/* 4 KPI Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                  <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 6, border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Modal Benchmark</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-forest)', marginTop: 2 }}>
                      ₹{activeCommodity.modalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 6, border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>24h Delta</div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: activeCommodity.trend === 'up' ? '#059669' : '#DC2626',
                        marginTop: 2,
                      }}
                    >
                      {activeCommodity.change}
                    </div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 6, border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Arrivals Volume</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', marginTop: 2 }}>
                      {activeCommodity.arrivalVolumeTonnes.toLocaleString('en-IN')} MT
                    </div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 6, border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Primary APMC</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginTop: 2 }}>
                      {activeCommodity.market}
                    </div>
                  </div>
                </div>

                {/* 7-Day Trend Chart (Clean SVG Line) */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>7-Day APMC Benchmark Price Movement</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Daily Modal Spot (₹/qtl)</div>
                  </div>

                  <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: 8, padding: 16 }}>
                    <div style={{ height: 100, display: 'flex', alignItems: 'flex-end', gap: 14 }}>
                      {activeCommodity.sparkline.map((val, idx) => {
                        const min = Math.min(...activeCommodity.sparkline);
                        const max = Math.max(...activeCommodity.sparkline);
                        const range = max - min || 1;
                        const heightPct = Math.max(15, Math.min(100, ((val - min) / range) * 80 + 20));

                        return (
                          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>₹{val}</span>
                            <div
                              style={{
                                width: '100%',
                                height: `${heightPct}%`,
                                background: idx === activeCommodity.sparkline.length - 1 ? 'var(--color-forest)' : '#94A3B8',
                                borderRadius: '4px 4px 0 0',
                                transition: 'height 400ms ease',
                              }}
                            />
                            <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>D-{6 - idx}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Inter-Mandi Arbitrage Spreads */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Inter-Mandi Arbitrage Comparison</div>
                  <div style={{ border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border)' }}>
                          <th style={{ padding: '8px 12px', textAlign: 'left' }}>Market Center</th>
                          <th style={{ padding: '8px 12px', textAlign: 'right' }}>Modal Rate</th>
                          <th style={{ padding: '8px 12px', textAlign: 'right' }}>Spread vs Benchmark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeCommodity.marketComparisons.map((comp) => (
                          <tr key={comp.marketName} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: '8px 12px', fontWeight: 600 }}>{comp.marketName}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{comp.modalPrice}</td>
                            <td
                              style={{
                                padding: '8px 12px',
                                textAlign: 'right',
                                fontWeight: 600,
                                color: comp.difference.startsWith('+') ? '#059669' : comp.difference === 'Benchmark' ? 'var(--color-forest)' : '#DC2626',
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

                {/* Direct CTA */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    onClick={() => setActiveCommodity(null)}
                    className="btn btn-secondary"
                    style={{ fontSize: 13, padding: '8px 16px' }}
                  >
                    Close
                  </button>
                  <Link
                    href={`/products?category=${activeCommodity.crop === 'Cotton' || activeCommodity.crop === 'Soybean' || activeCommodity.crop === 'Wheat' ? 'Seeds' : 'Fertilizers'}`}
                    className="btn btn-primary"
                    style={{ fontSize: 13, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    View Related Inputs <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShellLayout>
  );
}
