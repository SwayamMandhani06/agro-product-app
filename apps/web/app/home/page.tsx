'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/features/auth/store';
import { useOrdersStore } from '@/features/orders/store';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_MANDI_PRICES } from '@/lib/mock-data';
import Link from 'next/link';
import CategoryIcon from '@/components/icons/CategoryIcon';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  Activity,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sprout,
  Truck,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { ProductImageResolver } from '@/lib/product-image-resolver';
import { useRecentlyViewedStore } from '@/features/products/recently-viewed-store';

// 7-day trend data sets for different commodities
const CROP_TRENDS: Record<string, { days: string[]; prices: number[]; market: string; base: number }> = {
  Soybean: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    prices: [4180, 4220, 4200, 4260, 4290, 4280, 4320],
    market: 'Indore APMC',
    base: 4180,
  },
  Cotton: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    prices: [6350, 6380, 6420, 6400, 6460, 6440, 6450],
    market: 'Akola Mandi',
    base: 6350,
  },
  Wheat: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    prices: [2200, 2210, 2190, 2185, 2195, 2180, 2180],
    market: 'Dewas Mandi',
    base: 2200,
  },
  Mustard: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    prices: [5400, 5420, 5450, 5440, 5480, 5460, 5450],
    market: 'Alwar APMC',
    base: 5400,
  },
};

function InteractiveMarketChart() {
  const [selectedCrop, setSelectedCrop] = useState<string>('Soybean');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = CROP_TRENDS[selectedCrop] ?? CROP_TRENDS.Soybean;
  const prices = data.prices;
  const minPrice = Math.min(...prices) * 0.985;
  const maxPrice = Math.max(...prices) * 1.015;
  const range = maxPrice - minPrice;

  const width = 560;
  const height = 130;
  const paddingX = 24;
  const paddingY = 18;

  const points = prices.map((p, i) => {
    const x = paddingX + (i / (prices.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((p - minPrice) / range) * (height - 2 * paddingY);
    return { x, y, price: p, day: data.days[i] };
  });

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const latestPrice = prices[prices.length - 1];
  const delta = latestPrice - data.base;
  const deltaPct = ((delta / data.base) * 100).toFixed(1);
  const isUp = delta >= 0;

  return (
    <div style={{ padding: '16px 20px 20px' }}>
      {/* Crop Selection Bar & Metric Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {Object.keys(CROP_TRENDS).map((crop) => (
            <button
              key={crop}
              type="button"
              onClick={() => {
                setSelectedCrop(crop);
                setHoveredIndex(null);
              }}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                border: selectedCrop === crop ? '1.5px solid var(--color-forest)' : '1px solid var(--color-divider)',
                background: selectedCrop === crop ? 'rgba(11, 61, 46, 0.08)' : '#ffffff',
                color: selectedCrop === crop ? 'var(--color-forest)' : 'var(--color-text-secondary)',
                fontWeight: selectedCrop === crop ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {crop}
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-primary)' }}>
              ₹{hoveredIndex !== null ? points[hoveredIndex].price.toLocaleString('en-IN') : latestPrice.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>/ qtl</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: isUp ? '#16A34A' : '#DC2626',
                background: isUp ? '#DCFCE7' : '#FEE2E2',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {isUp ? '+' : ''}{delta} ({isUp ? '+' : ''}{deltaPct}%)
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
            {data.market} · {hoveredIndex !== null ? points[hoveredIndex].day : '7-Day Trend'}
          </span>
        </div>
      </div>

      {/* SVG Canvas with Separate Clean Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: height,
          background: 'linear-gradient(180deg, rgba(11, 61, 46, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
          borderRadius: 8,
          border: '1px solid var(--color-border-subtle)',
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B3D2E" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0B3D2E" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="rgba(0,0,0,0.04)" strokeDasharray="3 3" />
          <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="rgba(0,0,0,0.04)" strokeDasharray="3 3" />
          <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="rgba(0,0,0,0.04)" strokeDasharray="3 3" />

          {/* Filled Area */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#0B3D2E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={p.day}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : i === points.length - 1 ? 5 : 3.5}
                  fill={isHovered ? '#D97706' : i === points.length - 1 ? '#0B3D2E' : '#ffffff'}
                  stroke="#0B3D2E"
                  strokeWidth={isHovered ? 3 : 2}
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Days Legend Row — Clearly separated below SVG, preventing overlap with table headers */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 12px 0',
          fontSize: 11,
          color: 'var(--color-text-tertiary)',
          fontWeight: 600,
        }}
      >
        {data.days.map((day, idx) => (
          <span
            key={day}
            style={{
              color: hoveredIndex === idx ? 'var(--color-forest)' : 'inherit',
              fontWeight: hoveredIndex === idx ? 700 : 500,
            }}
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuthStore();
  const { orders } = useOrdersStore();
  const recentItems = useRecentlyViewedStore((s) => s.items);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'Farmer';

  const activeOrders = orders.filter((o) =>
    ['placed', 'confirmed', 'processing', 'packed', 'shipped', 'outForDelivery', 'out_for_delivery'].includes(o.status)
  );

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <AppShell>
      <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - var(--nav-height))' }}>

        {/* ============================================================
            1. COMMAND CENTER HEADER (Clean Agrarian SaaS)
            ============================================================ */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0B3D2E 0%, #024A22 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            color: '#ffffff',
          }}
        >
          <div className="container-app" style={{ paddingTop: 26, paddingBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: 'rgba(217, 119, 6, 0.25)',
                      color: '#FCD34D',
                      padding: '2px 8px',
                      borderRadius: 12,
                      border: '1px solid rgba(217, 119, 6, 0.4)',
                    }}
                  >
                    FARMER COMMAND CENTER
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} strokeWidth={2} /> {currentDate}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} strokeWidth={2} /> Maharashtra Belt
                  </span>
                </div>
                <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.4px', color: '#ffffff' }}>
                  {greeting}, {firstName}
                </h1>
                <p style={{ margin: 0, fontSize: 13.5, color: 'rgba(255,255,255,0.8)' }}>
                  Here is your daily agricultural market overview, verified input supplies, and consignment status.
                </p>
              </div>

              {/* Quick Profile Snapshot */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'var(--color-amber)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {firstName.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                    {user?.name ?? 'Rahul Sharma'}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.65)' }}>
                    Verified Farmer · Nashik Hub
                  </div>
                </div>
              </div>
            </div>

            {/* Quick KPI Stat Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: 12,
                marginTop: 20,
              }}
            >
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.12)' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Mandi Benchmark
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 800 }}>₹4,320</span>
                  <span style={{ fontSize: 12, color: '#34D399', fontWeight: 700 }}>+1.2%</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Indore APMC · Soybean</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.12)' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Tracked Commodities
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 800 }}>6 Mandis</span>
                  <span style={{ fontSize: 11, color: '#34D399', fontWeight: 600 }}>Live Feed</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Updated every 15 mins</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.12)' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Active Orders
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 800 }}>{activeOrders.length} Shipments</span>
                  <span style={{ fontSize: 11, color: '#FCD34D', fontWeight: 700 }}>Tracking Live</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Est. delivery tomorrow</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.12)' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Estimated Savings
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#34D399' }}>₹1,240</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Direct ROI</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Zero distributor markups</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            2. MAIN DASHBOARD BODY
            ============================================================ */}
        <div className="container-app" style={{ paddingTop: 24, paddingBottom: 48 }}>

          {/* Clean Shortcuts Bar */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 24, paddingBottom: 4 }}>
            {[
              { label: 'Browse Catalog', href: '/products', Icon: Package },
              { label: 'Shop Categories', href: '/categories', Icon: Layers },
              { label: 'My Orders', href: '/orders', Icon: Activity },
              { label: 'Saved Inputs', href: '/saved', Icon: Bookmark },
              { label: 'Farm Insights', href: '/insights', Icon: Sprout },
            ].map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={href}
                className="glass-card-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 16px',
                  background: '#ffffff',
                  border: '1px solid var(--color-divider)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <Icon size={16} strokeWidth={2} color="var(--color-forest)" />
                <span>{label}</span>
                <ArrowRight size={13} strokeWidth={2} color="var(--color-text-tertiary)" />
              </Link>
            ))}
          </div>

          {/* ============================================================
              3. MARKET INTELLIGENCE & SHORTCUTS (2-column layout)
              ============================================================ */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.75fr)',
              gap: 24,
              marginBottom: 36,
            }}
            className="market-intelligence-grid"
          >
            {/* Left: Interactive Mandi Rates & Chart Card */}
            <div
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                borderRadius: 14,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                background: '#ffffff',
              }}
            >
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--color-divider)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h2 style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Live Mandi Rates &amp; 7-Day Movement
                  </h2>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                    APMC benchmark rates updated daily for western region
                  </p>
                </div>
                <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Zap size={11} strokeWidth={2.5} /> LIVE APMC FEED
                </span>
              </div>

              {/* Interactive Sparkline Chart */}
              <InteractiveMarketChart />

              {/* Rates Table with Dedicated Clean Spacing */}
              <div style={{ borderTop: '1px solid var(--color-divider)' }}>
                <table className="mandi-table" style={{ margin: 0, width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: 20 }}>Commodity</th>
                      <th>Price / qtl</th>
                      <th>Change</th>
                      <th style={{ paddingRight: 20 }}>Market Center</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_MANDI_PRICES.map((mp) => (
                      <tr key={mp.crop}>
                        <td style={{ paddingLeft: 20, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {mp.crop}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: 13.5 }}>
                          {mp.price}
                        </td>
                        <td>
                          <span
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}
                            className={mp.trend === 'up' ? 'mandi-change-up' : mp.trend === 'down' ? 'mandi-change-down' : ''}
                          >
                            {mp.trend === 'up' && <TrendingUp size={13} strokeWidth={2.5} />}
                            {mp.trend === 'down' && <TrendingDown size={13} strokeWidth={2.5} />}
                            {mp.trend === 'flat' && <Minus size={13} strokeWidth={2.5} style={{ color: 'var(--color-text-tertiary)' }} />}
                            {mp.change}
                          </span>
                        </td>
                        <td style={{ paddingRight: 20, color: 'var(--color-text-tertiary)', fontSize: 12.5 }}>
                          {mp.market}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Category Navigation Panel */}
            <div className="card" style={{ padding: 20, height: 'fit-content', borderRadius: 14, background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 700 }}>Agricultural Categories</h3>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>Direct access to inputs</p>
                </div>
                <Link href="/categories" style={{ fontSize: 12, color: 'var(--color-forest)', fontWeight: 600, textDecoration: 'none' }}>
                  All ({MOCK_CATEGORIES.length})
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {MOCK_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="glass-card-hover"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      background: 'var(--color-neutral-50)',
                      borderRadius: 10,
                      border: '1px solid var(--color-divider)',
                      textDecoration: 'none',
                      color: 'var(--color-text-primary)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      }}
                    >
                      <CategoryIcon categoryName={cat.name} size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{cat.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                        {cat.itemCount ?? 24} items
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Certified Inputs Assurance */}
              <div
                style={{
                  marginTop: 18,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: '#EAF6EF',
                  border: '1px solid #9FD4B0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                <ShieldCheck size={18} color="#0B3D2E" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0B3D2E' }}>
                    Certified Agro Inputs
                  </div>
                  <div style={{ fontSize: 11.5, color: '#166534', lineHeight: 1.4 }}>
                    All suppliers are vetted and certified for Indian agricultural standards with farm-gate batch testing.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              4. SEASONAL CROP INPUTS (Featured Products)
              ============================================================ */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 800, color: 'var(--color-text-primary)' }}>
                  Seasonal Certified Inputs
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                  Top-rated seeds and nutrients for current planting window
                </p>
              </div>
              <Link
                href="/products"
                style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-forest)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span>View All Inputs</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 18,
              }}
            >
              {MOCK_PRODUCTS.slice(0, 4).map((product) => {
                const imageSrc = ProductImageResolver.resolve(product.id, product.category);
                return (
                  <div
                    key={product.id}
                    className="glass-card-hover"
                    style={{
                      background: '#ffffff',
                      borderRadius: 12,
                      overflow: 'hidden',
                      border: '1px solid var(--color-divider)',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    <div style={{ position: 'relative', height: 160, background: '#f8fafc', overflow: 'hidden' }}>
                      <img
                        src={imageSrc}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
                        {product.category}
                      </span>
                      <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                        {product.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 'auto', paddingTop: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textDecoration: 'line-through' }}>
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--color-text-tertiary)' }}>
                          per {product.unit}
                        </span>
                      </div>
                      <Link
                        href={`/products/${product.id}`}
                        style={{
                          marginTop: 12,
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 6,
                          background: 'var(--color-forest)',
                          color: '#ffffff',
                          textDecoration: 'none',
                          fontSize: 12.5,
                          fontWeight: 700,
                          textAlign: 'center',
                          display: 'block',
                        }}
                      >
                        Inspect Product
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
