'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuthStore } from '@/features/auth/store';
import { useOrdersStore } from '@/features/orders/store';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_MANDI_PRICES } from '@/lib/mock-data';
import Link from 'next/link';
import CategoryIcon from '@/components/icons/CategoryIcon';
import { FadeIn, SlideUp } from '@/components/common/Motion';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  Package,
  Activity,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

// 7-day trend data for market visualization
const SEVEN_DAY_TREND = [
  { day: 'Mon', price: 4180 },
  { day: 'Tue', price: 4220 },
  { day: 'Wed', price: 4200 },
  { day: 'Thu', price: 4260 },
  { day: 'Fri', price: 4290 },
  { day: 'Sat', price: 4280 },
  { day: 'Sun', price: 4320 },
];

function MarketTrendSparkline() {
  const minPrice = 4150;
  const maxPrice = 4350;
  const range = maxPrice - minPrice;
  const width = 340;
  const height = 90;
  const paddingX = 20;
  const paddingY = 16;

  const points = SEVEN_DAY_TREND.map((d, i) => {
    const x = paddingX + (i / (SEVEN_DAY_TREND.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((d.price - minPrice) / range) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div style={{ position: 'relative', width: '100%', height: height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-forest)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-forest)" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#trendGradient)" />
        <path d={pathD} fill="none" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle
            key={p.day}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 4.5 : 3}
            fill={i === points.length - 1 ? 'var(--color-forest)' : '#fff'}
            stroke="var(--color-forest)"
            strokeWidth={i === points.length - 1 ? 2.5 : 1.5}
          />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px 0', fontSize: 11, color: 'var(--color-text-tertiary)' }}>
        {SEVEN_DAY_TREND.map((d) => (
          <span key={d.day}>{d.day}</span>
        ))}
      </div>
    </div>
  );
}

import ProductCard from '@/components/common/ProductCard';
import { useRecentlyViewedStore } from '@/features/products/recently-viewed-store';

export default function HomePage() {
  const { user } = useAuthStore();
  const { orders } = useOrdersStore();
  const recentItems = useRecentlyViewedStore((s) => s.items);

  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'Farmer';

  const activeOrders = orders.filter((o) =>
    ['placed', 'confirmed', 'processing', 'shipped', 'outForDelivery'].includes(o.status)
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
            1. COMMAND CENTER HEADER (SaaS standard)
            ============================================================ */}
        <section style={{ background: 'var(--color-forest)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="container-app" style={{ paddingTop: 28, paddingBottom: 32 }}>
            <FadeIn>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="badge badge-amber" style={{ background: 'rgba(217, 119, 6, 0.25)', color: '#FCD34D', border: '1px solid rgba(217, 119, 6, 0.4)' }}>
                      MARKET ACTIVE
                    </span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} strokeWidth={2} /> {currentDate}
                    </span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} strokeWidth={2} /> Pune, Maharashtra
                    </span>
                  </div>
                  <h1 style={{ margin: '0 0 4px', color: '#fff', fontSize: 24, fontWeight: 700, letterSpacing: '-0.3px' }}>
                    {greeting}, {firstName}
                  </h1>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
                    Here&apos;s your daily agricultural market overview and curated input supplies.
                  </p>
                </div>

                {/* Quick Search */}
                <div style={{ minWidth: 260, maxWidth: 360, width: '100%' }}>
                  <Link href="/products" style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.22)',
                        borderRadius: 8,
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        color: 'rgba(255,255,255,0.65)',
                        fontSize: 13,
                        transition: 'background var(--motion-fast) var(--ease-standard)',
                      }}
                    >
                      <Search size={15} strokeWidth={2} />
                      <span>Search seeds, fertilizers, tools…</span>
                    </div>
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* ============================================================
                2. COMPACT KPI METRICS BAR
                ============================================================ */}
            <SlideUp delayMs={80}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 12,
                  marginTop: 24,
                }}
              >
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Mandi Benchmark
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 700 }}>₹4,320</span>
                    <span style={{ fontSize: 12, color: '#34D399', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                      <TrendingUp size={12} strokeWidth={2.5} /> +1.2%
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Indore APMC · Soybean</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Tracked Commodities
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 700 }}>6 Mandis</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Live APMC Feed</span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Updated 30 mins ago</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Active Orders
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 700 }}>{activeOrders.length} Shipments</span>
                    <span style={{ fontSize: 12, color: '#FCD34D', fontWeight: 600 }}>In Transit</span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Est. delivery tomorrow</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Season Savings
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 700 }}>₹1,240</span>
                    <span style={{ fontSize: 12, color: '#34D399', fontWeight: 600 }}>Saved via AgriTrade</span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Direct farm-gate pricing</p>
                </div>
              </div>
            </SlideUp>
          </div>
        </section>

        {/* ============================================================
            3. DASHBOARD MAIN BODY
            ============================================================ */}
        <div className="container-app" style={{ paddingTop: 24, paddingBottom: 40 }}>

          {/* Quick Shortcuts Bar */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 24, paddingBottom: 4 }}>
            {[
              { label: 'Browse Catalog', href: '/products', Icon: Package },
              { label: 'Shop Categories', href: '/categories', Icon: Layers },
              { label: 'Track Orders', href: '/orders', Icon: Activity },
              { label: 'Certified Inputs', href: '/products?category=Seeds', Icon: ShieldCheck },
            ].map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={href}
                className="card-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 14px',
                  background: '#fff',
                  border: '1px solid var(--color-divider)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                <Icon size={15} strokeWidth={2} color="var(--color-forest)" />
                <span>{label}</span>
                <ArrowRight size={13} strokeWidth={2} color="var(--color-text-tertiary)" />
              </Link>
            ))}
          </div>

          {/* ============================================================
              4. MARKET INTELLIGENCE & SHORTCUTS (2-column layout)
              ============================================================ */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: 20,
              marginBottom: 32,
            }}
            className="market-intelligence-grid"
          >
            {/* Left: Mandi Rates Snapshot & Chart */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Live Mandi Rates & 7-Day Movement
                  </h2>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                    APMC benchmark rates updated daily for western region
                  </p>
                </div>
                <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Zap size={11} strokeWidth={2.5} /> LIVE FEED
                </span>
              </div>

              {/* Sparkline trend view */}
              <div style={{ padding: '16px 20px 8px', background: 'var(--color-neutral-50)', borderBottom: '1px solid var(--color-divider)' }}>
                <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  7-Day Trend · Soybean (₹ / qtl)
                </p>
                <MarketTrendSparkline />
              </div>

              {/* Rates Table */}
              <table className="mandi-table" style={{ margin: 0 }}>
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
                      <td style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: 14 }}>
                        {mp.price}
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }} className={mp.trend === 'up' ? 'mandi-change-up' : mp.trend === 'down' ? 'mandi-change-down' : ''}>
                          {mp.trend === 'up'   && <TrendingUp   size={13} strokeWidth={2.5} />}
                          {mp.trend === 'down' && <TrendingDown size={13} strokeWidth={2.5} />}
                          {mp.trend === 'flat' && <Minus        size={13} strokeWidth={2.5} style={{ color: 'var(--color-text-tertiary)' }} />}
                          {mp.change}
                        </span>
                      </td>
                      <td style={{ paddingRight: 20, color: 'var(--color-text-tertiary)', fontSize: 13 }}>
                        {mp.market}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right: Category Navigation Panel */}
            <div className="card" style={{ padding: 20, height: 'fit-content' }}>
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
                    className="card-hover"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      background: 'var(--color-neutral-50)',
                      border: '1px solid var(--color-divider)',
                      borderRadius: 8,
                      textDecoration: 'none',
                    }}
                  >
                    <div className="cat-icon-wrap" style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 6 }}>
                      <CategoryIcon categoryName={cat.name} size={16} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cat.name}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                        {cat.itemCount} items
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Advisory Box */}
              <div
                style={{
                  marginTop: 18,
                  padding: '12px 14px',
                  background: 'var(--color-brand-50)',
                  border: '1px solid var(--color-brand-100)',
                  borderRadius: 8,
                }}
              >
                <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: 'var(--color-forest)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ShieldCheck size={14} strokeWidth={2.2} /> Certified Agro Inputs
                </p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  All suppliers are vetted and certified for Indian agricultural standards with farm-gate batch testing.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================
              5. FEATURED COMMERCE PRODUCTS
              ============================================================ */}
          <div>
            <div className="section-header">
              <div>
                <h2 style={{ margin: '0 0 2px', fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Featured Agricultural Products
                </h2>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                  Curated certified seeds, fertilizers, and farm equipment for this season
                </p>
              </div>
              <Link
                href="/products"
                id="home-see-all-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-forest)', fontWeight: 600, textDecoration: 'none' }}
              >
                View Catalog <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14 }}>
              {MOCK_PRODUCTS.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Link href="/products" className="btn btn-secondary" id="home-browse-all-btn" style={{ fontSize: 14, gap: 8 }}>
                <Package size={15} strokeWidth={2} />
                Explore Complete Marketplace ({MOCK_PRODUCTS.length} Products)
              </Link>
            </div>
          </div>

          {/* Recently Viewed Products */}
          {recentItems.length > 0 && (
            <div style={{ marginTop: 36, borderTop: '1px solid var(--color-border)', paddingTop: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
                    Recently Inspected
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', margin: '2px 0 0' }}>
                    Quickly revisit inputs you checked recently
                  </p>
                </div>
                <Link href="/products" style={{ fontSize: 13, color: 'var(--color-forest)', fontWeight: 600, textDecoration: 'none' }}>
                  Browse Catalog →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                {recentItems.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} compact />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .market-intelligence-grid {
            grid-template-columns: 1fr 340px !important;
          }
        }
      `}</style>
    </AppShell>
  );
}
