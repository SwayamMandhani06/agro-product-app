'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Leaf,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  CheckCircle,
  Truck,
  Sun,
  Moon,
  Sparkles,
  Layers,
  Activity,
  CloudRain,
  ChevronRight,
  Sprout,
  BarChart3,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { ProductImageResolver } from '@/lib/product-image-resolver';
import { MOCK_MANDI_PRICES, MOCK_PRODUCTS } from '@/lib/mock-data';

// Input savings metric data by crop per acre
const CROP_SAVINGS_METRICS: Record<string, { baselineInputCost: number; agritradeSavingsPct: number }> = {
  Soybean: { baselineInputCost: 5200, agritradeSavingsPct: 0.22 },
  Cotton: { baselineInputCost: 8400, agritradeSavingsPct: 0.25 },
  Wheat: { baselineInputCost: 4800, agritradeSavingsPct: 0.20 },
  Sugarcane: { baselineInputCost: 14200, agritradeSavingsPct: 0.28 },
  Vegetables: { baselineInputCost: 11500, agritradeSavingsPct: 0.24 },
};

export default function SaaSMarketingHomePage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [farmAcres, setFarmAcres] = useState<number>(5);
  const [selectedCrop, setSelectedCrop] = useState<string>('Soybean');
  const [activeHeroTab, setActiveHeroTab] = useState<'mandi' | 'logistics' | 'weather'>('mandi');
  const [tickSeconds, setTickSeconds] = useState<number>(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickSeconds((prev) => (prev > 1 ? prev - 1 : 12));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isDark = theme === 'dark';

  const cropMetric = CROP_SAVINGS_METRICS[selectedCrop] || CROP_SAVINGS_METRICS.Soybean;
  const totalStandardCost = cropMetric.baselineInputCost * farmAcres;
  const estimatedSavings = Math.round(totalStandardCost * cropMetric.agritradeSavingsPct);
  const agritradeCost = totalStandardCost - estimatedSavings;

  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);

  // Theme-aware tokens: Light mode is primary, dark mode softened
  const bgCanvas = isDark ? '#0F382B' : '#FDFBF7';
  const bgCard = isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF';
  const borderCard = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(20, 90, 67, 0.10)';
  const textPrimary = isDark ? '#FFFFFF' : '#14382D';
  const textSecondary = isDark ? 'rgba(255, 255, 255, 0.80)' : '#463D35';
  const textTertiary = isDark ? 'rgba(255, 255, 255, 0.55)' : '#7A6E63';
  const headerBg = isDark ? 'rgba(15, 56, 43, 0.94)' : 'rgba(253, 251, 247, 0.94)';
  const tickerBg = isDark ? '#0B2D22' : '#F4ECE8';

  return (
    <div
      style={{
        background: bgCanvas,
        minHeight: '100vh',
        color: textPrimary,
        transition: 'background 0.35s ease, color 0.35s ease',
        fontFamily: 'inherit',
      }}
    >
      {/* ============================================================
          1. MODERN SAAS TOP NAVIGATION BAR
          ============================================================ */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: `1px solid ${borderCard}`,
          background: headerBg,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          className="container-app"
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 68,
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #1A7A4A 0%, #145A43 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: isDark ? '0 0 16px rgba(26, 122, 74, 0.4)' : '0 2px 8px rgba(20, 90, 67, 0.15)',
              }}
            >
              <Leaf size={20} strokeWidth={2.4} />
            </div>
            <div>
              <span
                style={{
                  color: textPrimary,
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '-0.4px',
                  display: 'block',
                  lineHeight: 1,
                }}
              >
                AGRI TRADE
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: isDark ? '#34D399' : '#1A7A4A',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                Market Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              gap: 28,
              alignItems: 'center',
            }}
            className="desktop-nav"
          >
            {[
              { label: 'Catalog', href: '/products' },
              { label: 'Mandi Intelligence', href: '/mandi' },
              { label: 'Farm Insights', href: '/insights' },
              { label: 'Rural Logistics', href: '/shipments' },
              { label: 'Weather Advisory', href: '/weather' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: textSecondary,
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = isDark ? '#34D399' : '#145A43')}
                onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Quick Actions & Theme Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              title={`Switch to ${isDark ? 'Harvest Cream (Light)' : 'Forest Dark'} theme`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 20,
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(20, 90, 67, 0.08)',
                border: `1px solid ${borderCard}`,
                color: textPrimary,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {isDark ? (
                <>
                  <Sun size={14} color="#FCD34D" />
                  <span style={{ fontSize: 11 }}>Harvest Cream</span>
                </>
              ) : (
                <>
                  <Moon size={14} color="#145A43" />
                  <span style={{ fontSize: 11 }}>Forest Dark</span>
                </>
              )}
            </button>

            <Link
              href="/login"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: textPrimary,
                textDecoration: 'none',
                padding: '7px 14px',
                borderRadius: 8,
                transition: 'background 0.2s',
              }}
            >
              Sign In
            </Link>

            <Link
              href="/home"
              style={{
                background: 'linear-gradient(135deg, #D97706 0%, #B86200 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 8,
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                textDecoration: 'none',
                boxShadow: '0 2px 10px rgba(217, 119, 6, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <span>Farmer Dashboard</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((p) => !p)}
              className="md:hidden"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 8,
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(20, 90, 67, 0.08)',
                border: `1px solid ${borderCard}`,
                color: textPrimary,
                cursor: 'pointer',
              }}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden slide-down"
            style={{
              background: headerBg,
              borderBottom: `1px solid ${borderCard}`,
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {[
              { label: 'Inputs Catalog', href: '/products' },
              { label: 'Mandi Intelligence', href: '/mandi' },
              { label: 'Farm Insights', href: '/insights' },
              { label: 'Rural Logistics', href: '/shipments' },
              { label: 'Weather Advisory', href: '/weather' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: textPrimary,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  padding: '8px 0',
                  borderBottom: `1px solid ${borderCard}`,
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1, textAlign: 'center', padding: '10px' }}
              >
                Sign In
              </Link>
              <Link
                href="/home"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ flex: 1, textAlign: 'center', padding: '10px' }}
              >
                Farmer Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================
          2. STREAMLINED LIVE APMC MANDI TICKER
          ============================================================ */}
      <div
        style={{
          background: tickerBg,
          borderBottom: `1px solid ${borderCard}`,
          padding: '9px 0',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: 12,
          color: textSecondary,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, overflowX: 'auto', padding: '0 24px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              color: isDark ? '#34D399' : '#027A38',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            <Zap size={13} strokeWidth={2.5} /> LIVE APMC RATES:
          </span>
          {MOCK_MANDI_PRICES.map((m) => (
            <span key={m.crop} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ fontWeight: 600, color: textPrimary }}>{m.crop}</span>
              <span style={{ fontWeight: 700, color: textPrimary }}>{m.price}</span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 11,
                  color: m.trend === 'up' ? '#34D399' : '#EF4444',
                }}
              >
                {m.trend === 'up' ? '▲' : '▼'} {m.change}
              </span>
              <span style={{ color: textTertiary, fontSize: 11 }}>({m.market})</span>
            </span>
          ))}
        </div>
      </div>

      {/* ============================================================
          3. HERO SECTION — HIGH IMPACT MODERN SAAS
          ============================================================ */}
      <section
        style={{
          padding: '64px 0 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="container-app hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
            gap: 40,
            alignItems: 'center',
          }}
        >
          {/* Left Column: Headline, Description & CTAs */}
          <div>
            {/* Top Chip */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 20,
                background: isDark ? 'rgba(34, 197, 94, 0.12)' : 'rgba(2, 122, 56, 0.08)',
                border: isDark ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid rgba(2, 122, 56, 0.2)',
                color: isDark ? '#34D399' : '#027A38',
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              <Sparkles size={14} />
              <span>Direct Factory-to-Field Agricultural Infrastructure</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(32px, 4.5vw, 54px)',
                fontWeight: 900,
                letterSpacing: '-1.2px',
                lineHeight: 1.12,
                margin: '0 0 20px',
                color: textPrimary,
              }}
            >
              Modern Agricultural Commerce{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #10B981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}
              >
                Built for India&apos;s Farmers
              </span>
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: 16.5,
                lineHeight: 1.6,
                color: textSecondary,
                maxWidth: 540,
                margin: '0 0 32px',
              }}
            >
              Empowering progressive agriculturalists with factory-certified seed lots, direct bulk manufacturer pricing, live APMC mandi arbitration, and transparent rural consignment tracking.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
              <Link
                href="/products"
                style={{
                  background: 'linear-gradient(135deg, #145A43 0%, #0E4332 100%)',
                  color: '#ffffff',
                  padding: '13px 26px',
                  borderRadius: 10,
                  fontSize: 14.5,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: isDark ? '0 4px 20px rgba(11, 61, 46, 0.6)' : '0 4px 14px rgba(11, 61, 46, 0.25)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <span>Explore Inputs Catalog</span>
                <ArrowRight size={16} strokeWidth={2.4} />
              </Link>

              <Link
                href="/mandi"
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
                  color: textPrimary,
                  border: `1px solid ${borderCard}`,
                  padding: '13px 22px',
                  borderRadius: 10,
                  fontSize: 14.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                <Activity size={16} color={isDark ? '#34D399' : '#145A43'} />
                <span>Inspect Mandi Terminal</span>
              </Link>
            </div>

            {/* Three Pillar Badges */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: textSecondary, fontWeight: 600 }}>
                <CheckCircle size={15} color="#10B981" strokeWidth={2.5} />
                <span>100% Certified Seed Lots</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: textSecondary, fontWeight: 600 }}>
                <TrendingUp size={15} color="#F59E0B" strokeWidth={2.5} />
                <span>Real-Time APMC Feeds</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: textSecondary, fontWeight: 600 }}>
                <ShieldCheck size={15} color="#3B82F6" strokeWidth={2.5} />
                <span>Zero Middleman Markups</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Interactive Command Terminal */}
          <div
            style={{
              position: 'relative',
            }}
          >
            {/* Ambient Background Glow in dark mode */}
            {isDark && (
              <div
                style={{
                  position: 'absolute',
                  inset: -20,
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(0,0,0,0) 70%)',
                  borderRadius: 24,
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
            )}

            {/* Main Terminal Card */}
            <div
              className="glass-saas-card"
              style={{
                position: 'relative',
                zIndex: 1,
                borderRadius: 18,
                overflow: 'hidden',
                background: isDark ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF',
                border: `1px solid ${borderCard}`,
                boxShadow: isDark
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.1)'
                  : '0 20px 45px -10px rgba(11, 61, 46, 0.12)',
              }}
            >
              {/* Header Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  background: isDark ? 'rgba(2, 6, 23, 0.7)' : '#F8FAFC',
                  borderBottom: `1px solid ${borderCard}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11.5,
                      fontFamily: 'monospace',
                      color: isDark ? '#94A3B8' : '#64748B',
                    }}
                  >
                    agritrade-core: cluster-in-west-1
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#22C55E',
                      boxShadow: '0 0 8px #22C55E',
                    }}
                  />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#22C55E' }}>
                    WSS CONNECTED
                  </span>
                </div>
              </div>

              {/* Terminal Content Tabs */}
              <div style={{ padding: '16px 20px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {(['mandi', 'logistics', 'weather'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setActiveHeroTab(t)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 6,
                          border: 'none',
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: activeHeroTab === t ? (isDark ? '#1E293B' : '#E2E8F0') : 'transparent',
                          color: activeHeroTab === t ? textPrimary : textTertiary,
                          textTransform: 'uppercase',
                        }}
                      >
                        {t === 'mandi' ? 'Mandi Feeds' : t === 'logistics' ? 'Live Logistics' : 'Agro Weather'}
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: textTertiary, fontFamily: 'monospace' }}>
                    Tick in {tickSeconds}s
                  </span>
                </div>

                {/* Tab: Mandi Feeds */}
                {activeHeroTab === 'mandi' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {MOCK_MANDI_PRICES.slice(0, 3).map((item) => (
                      <div
                        key={item.crop}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 8,
                          background: isDark ? 'rgba(30, 41, 59, 0.6)' : '#F1F5F9',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #E2E8F0',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>
                            {item.crop}
                          </div>
                          <div style={{ fontSize: 11, color: textTertiary }}>
                            {item.market}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: textPrimary }}>
                            {item.price} <span style={{ fontSize: 10, color: textTertiary }}>/ qtl</span>
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: item.trend === 'up' ? '#22C55E' : '#EF4444',
                            }}
                          >
                            {item.trend === 'up' ? '▲' : '▼'} {item.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab: Live Logistics */}
                {activeHeroTab === 'logistics' && (
                  <div
                    style={{
                      padding: '14px',
                      borderRadius: 10,
                      background: isDark ? 'rgba(30, 41, 59, 0.6)' : '#F1F5F9',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #E2E8F0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B' }}>
                        🚚 Consignment: #ORD-2026-084
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, background: '#F59E0B', color: '#000', padding: '2px 6px', borderRadius: 4 }}>
                        OUT FOR DELIVERY
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px', fontSize: 12, color: textSecondary }}>
                      Courier: Delhivery Rural Express · Nashik District Distribution Center
                    </p>
                    <div style={{ height: 4, background: '#CBD5E1', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '85%', background: '#22C55E' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: textTertiary }}>
                      <span>Dispatched (08:30 AM)</span>
                      <span>ETA Today, 3:00 PM</span>
                    </div>
                  </div>
                )}

                {/* Tab: Weather */}
                {activeHeroTab === 'weather' && (
                  <div
                    style={{
                      padding: '14px',
                      borderRadius: 10,
                      background: isDark ? 'rgba(30, 41, 59, 0.6)' : '#F1F5F9',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #E2E8F0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CloudRain size={16} color="#3B82F6" /> Pune &amp; Western Belt
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                        Safe to Spray
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center', marginTop: 10 }}>
                      <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '8px 4px', borderRadius: 6 }}>
                        <div style={{ fontSize: 10, color: textTertiary }}>Rain Prob</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>15%</div>
                      </div>
                      <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '8px 4px', borderRadius: 6 }}>
                        <div style={{ fontSize: 10, color: textTertiary }}>Wind Speed</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>8 km/h</div>
                      </div>
                      <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '8px 4px', borderRadius: 6 }}>
                        <div style={{ fontSize: 10, color: textTertiary }}>Humidity</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>58%</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Callout */}
                <div
                  style={{
                    marginTop: 14,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: isDark ? 'rgba(16, 185, 129, 0.1)' : '#F0FDF4',
                    border: isDark ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid #BBF7D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: 12, color: isDark ? '#6EE7B7' : '#166534', fontWeight: 600 }}>
                    ⚡ Next Mandi price benchmark sync in {tickSeconds} seconds
                  </span>
                  <Link
                    href="/mandi"
                    style={{ fontSize: 11.5, fontWeight: 700, color: isDark ? '#34D399' : '#145A43', textDecoration: 'none' }}
                  >
                    View All Mandis →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. FARMER SAVINGS ROI CALCULATOR
          ============================================================ */}
      <section
        id="calculator"
        style={{
          padding: '60px 0',
          background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F7F4EC',
          borderTop: `1px solid ${borderCard}`,
          borderBottom: `1px solid ${borderCard}`,
        }}
      >
        <div className="container-app">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#D97706' }}>
              Direct Savings Estimator
            </span>
            <h2 style={{ fontSize: 30, fontWeight: 800, margin: '8px 0 10px', color: textPrimary, letterSpacing: '-0.5px' }}>
              How Much Do You Save With AgriTrade?
            </h2>
            <p style={{ fontSize: 15, color: textSecondary, margin: 0 }}>
              Based on audited factory-direct prices vs. typical rural distributor markups.
            </p>
          </div>

          <div
            className="glass-saas-card"
            style={{
              maxWidth: 820,
              margin: '0 auto',
              borderRadius: 16,
              padding: '36px 32px',
              background: bgCard,
              border: `1px solid ${borderCard}`,
              boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 10px 30px rgba(11, 61, 46, 0.06)',
            }}
          >
            {/* Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 32 }} className="calculator-grid">
              {/* Crop Picker */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: textPrimary }}>
                  1. Select Primary Crop
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.keys(CROP_SAVINGS_METRICS).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCrop(c)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 20,
                        border: selectedCrop === c ? '1.5px solid #D97706' : `1px solid ${borderCard}`,
                        background: selectedCrop === c ? '#D97706' : 'transparent',
                        color: selectedCrop === c ? '#ffffff' : textSecondary,
                        fontWeight: selectedCrop === c ? 700 : 500,
                        fontSize: 12.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Acreage Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>
                    2. Farm Size (Acres)
                  </label>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#D97706' }}>
                    {farmAcres} Acres
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={farmAcres}
                  onChange={(e) => setFarmAcres(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#D97706', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: textTertiary, marginTop: 4 }}>
                  <span>1 Acre</span>
                  <span>25 Acres</span>
                  <span>50+ Acres</span>
                </div>
              </div>
            </div>

            {/* Metric Comparison Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                padding: '24px',
                borderRadius: 12,
                background: isDark ? 'rgba(0, 0, 0, 0.3)' : '#F8FAFC',
                border: `1px solid ${borderCard}`,
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: textTertiary, marginBottom: 4 }}>
                  Standard Retail Cost
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: textSecondary, textDecoration: 'line-through' }}>
                  ₹{totalStandardCost.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 11, color: textTertiary, marginTop: 2 }}>
                  With distributor markups
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, color: textTertiary, marginBottom: 4 }}>
                  AgriTrade Direct Cost
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: textPrimary }}>
                  ₹{agritradeCost.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600, marginTop: 2 }}>
                  Factory-direct price
                </div>
              </div>

              <div style={{ borderLeft: `1px solid ${borderCard}`, paddingLeft: 16 }}>
                <div style={{ fontSize: 12, color: '#D97706', fontWeight: 700, marginBottom: 4 }}>
                  Your Net Estimated Savings
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#10B981' }}>
                  ₹{estimatedSavings.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 11, color: '#10B981', fontWeight: 700, marginTop: 2 }}>
                  ~{Math.round(cropMetric.agritradeSavingsPct * 100)}% Direct ROI
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. FEATURED CANONICAL INPUTS
          ============================================================ */}
      <section style={{ padding: '70px 0' }}>
        <div className="container-app">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#10B981' }}>
                Batch Tested &amp; Certified
              </span>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: textPrimary, margin: '6px 0 0', letterSpacing: '-0.5px' }}>
                Featured Agricultural Inputs
              </h2>
            </div>
            <Link
              href="/products"
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: isDark ? '#34D399' : '#145A43',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span>Explore All {MOCK_PRODUCTS.length}+ Inputs</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 20,
            }}
          >
            {featuredProducts.map((p) => {
              const imageSrc = ProductImageResolver.resolve(p.id, p.category);
              return (
                <div
                  key={p.id}
                  className="glass-card-hover"
                  style={{
                    background: bgCard,
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: `1px solid ${borderCard}`,
                    boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 14px rgba(11, 61, 46, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', height: 180, background: '#f8fafc', overflow: 'hidden' }}>
                    <img
                      src={imageSrc}
                      alt={p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        background: '#10B981',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 4,
                      }}
                    >
                      Certified Lot
                    </span>
                  </div>
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 11.5, color: textTertiary, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
                      {p.category}
                    </div>
                    <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: textPrimary, lineHeight: 1.3 }}>
                      {p.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 'auto', paddingTop: 10 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: textPrimary }}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      {p.originalPrice && (
                        <span style={{ fontSize: 13, color: textTertiary, textDecoration: 'line-through' }}>
                          ₹{p.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span style={{ marginLeft: 'auto', fontSize: 12, color: textTertiary }}>
                        per {p.unit}
                      </span>
                    </div>
                    <Link
                      href={`/products/${p.id}`}
                      style={{
                        marginTop: 14,
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 8,
                        background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-forest)',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontSize: 13,
                        fontWeight: 700,
                        textAlign: 'center',
                        display: 'block',
                      }}
                    >
                      View Specifications
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          6. FOOTER
          ============================================================ */}
      <footer
        style={{
          borderTop: `1px solid ${borderCard}`,
          background: isDark ? '#041710' : '#EDE8DF',
          padding: '48px 0 32px',
          fontSize: 13,
          color: textSecondary,
        }}
      >
        <div className="container-app">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: 'var(--color-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Leaf size={16} strokeWidth={2.2} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: textPrimary }}>
                AGRI TRADE
              </span>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <Link href="/products" style={{ color: textSecondary, textDecoration: 'none' }}>
                Products
              </Link>
              <Link href="/mandi" style={{ color: textSecondary, textDecoration: 'none' }}>
                Mandi Rates
              </Link>
              <Link href="/weather" style={{ color: textSecondary, textDecoration: 'none' }}>
                Weather
              </Link>
              <Link href="/login" style={{ color: textSecondary, textDecoration: 'none' }}>
                Sign In
              </Link>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${borderCard}`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 12, color: textTertiary }}>
            <p style={{ margin: 0 }}>
              © 2026 AgriTrade Agricultural Commerce Systems. All rights reserved.
            </p>
            <p style={{ margin: 0 }}>
              Zero Middleman Markups · CIB&amp;RC Registered Suppliers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
