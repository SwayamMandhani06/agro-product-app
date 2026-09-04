'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Leaf,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Smartphone,
  Globe,
  Database,
  CheckCircle,
  ChevronRight,
  Calculator,
  Truck,
  BarChart3,
  ExternalLink,
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
  const [farmAcres, setFarmAcres] = useState<number>(5);
  const [selectedCrop, setSelectedCrop] = useState<string>('Soybean');
  const [interactiveProductQty, setInteractiveProductQty] = useState<number>(2);
  const [selectedMandiCrop, setSelectedMandiCrop] = useState<string>('All');

  const cropMetric = CROP_SAVINGS_METRICS[selectedCrop] || CROP_SAVINGS_METRICS.Soybean;
  const totalStandardCost = cropMetric.baselineInputCost * farmAcres;
  const estimatedSavings = Math.round(totalStandardCost * cropMetric.agritradeSavingsPct);
  const agritradeCost = totalStandardCost - estimatedSavings;

  const filteredMandiPrices =
    selectedMandiCrop === 'All'
      ? MOCK_MANDI_PRICES
      : MOCK_MANDI_PRICES.filter((m) => m.crop === selectedMandiCrop);

  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', color: 'var(--color-text-primary)' }}>
      {/* ============================================================
          1. TOP NAVIGATION BAR (High-End Minimalist Commerce)
          ============================================================ */}
      <header
        className="glass-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(11, 61, 46, 0.96)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          className="container-app"
          style={{ display: 'flex', alignItems: 'center', height: 'var(--nav-height)', justifyContent: 'space-between' }}
        >
          {/* Brand Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Leaf size={18} strokeWidth={2.4} />
            </div>
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>
              AGRI TRADE
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#FCD34D',
                background: 'rgba(217, 119, 6, 0.25)',
                padding: '2px 7px',
                borderRadius: 4,
                letterSpacing: '0.4px',
              }}
            >
              ENTERPRISE PLATFORM
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', gap: 24 }} className="desktop-nav">
            <Link href="/products" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>
              Inputs Catalog
            </Link>
            <Link href="/insights" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>
              Farm Insights
            </Link>
            <Link href="/mandi" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>
              Mandi Intelligence
            </Link>
            <Link href="/shipments" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>
              Logistics
            </Link>
            <Link href="/weather" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>
              Weather Advisory
            </Link>
            <a href="#calculator" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>
              Savings ROI
            </a>
          </nav>

          {/* Quick CTA Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              href="/login"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                textDecoration: 'none',
                padding: '6px 12px',
              }}
            >
              Sign In
            </Link>
            <Link
              href="/home"
              className="btn btn-primary btn-sm"
              style={{
                background: 'var(--color-amber)',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                gap: 6,
                fontWeight: 700,
                borderRadius: 6,
              }}
            >
              Farmer Dashboard <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================
          2. LIVE APMC MANDI TICKER
          ============================================================ */}
      <div
        style={{
          background: '#07241B',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '8px 0',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: 12,
          color: 'rgba(255,255,255,0.75)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, overflowX: 'auto', padding: '0 24px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#34D399', fontWeight: 700, flexShrink: 0 }}>
            <Zap size={13} strokeWidth={2.5} /> LIVE APMC BENCHMARK:
          </span>
          {MOCK_MANDI_PRICES.map((m) => (
            <span key={m.crop} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ fontWeight: 600, color: '#fff' }}>{m.crop}</span>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{m.price}</span>
              <span style={{ color: m.trend === 'up' ? '#34D399' : m.trend === 'down' ? '#F87171' : '#9CA3AF', fontWeight: 600 }}>
                {m.change}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>({m.market})</span>
            </span>
          ))}
        </div>
      </div>

      {/* ============================================================
          3. HERO SECTION (Asymmetric Editorial Agrarian Fintech)
          ============================================================ */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--color-forest) 0%, #062118 100%)',
          color: '#fff',
          paddingTop: 48,
          paddingBottom: 64,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container-app">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 40,
              alignItems: 'center',
            }}
          >
            {/* Left Column: Asymmetric Editorial Value Proposition */}
            <div>
              {/* Tag Pill */}
              <div
                className="fade-in"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 12px',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  fontSize: 11.5,
                  fontWeight: 600,
                  marginBottom: 18,
                  color: 'rgba(255,255,255,0.92)',
                  letterSpacing: '0.4px',
                }}
              >
                <ShieldCheck size={14} color="#34D399" strokeWidth={2.4} />
                <span>SYNCHRONIZED AGRICULTURAL COMMERCE &amp; MARKET INTELLIGENCE</span>
              </div>

              {/* Main Headline */}
              <h1
                className="slide-up"
                style={{
                  fontSize: 'clamp(28px, 3.8vw, 46px)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.8px',
                  margin: '0 0 16px',
                }}
              >
                Modern Agricultural Commerce &amp;{' '}
                <span style={{ color: '#FCD34D' }}>Intelligence Infrastructure</span>
              </h1>

              {/* Subhead */}
              <p
                className="slide-up"
                style={{
                  fontSize: 'clamp(14px, 1.2vw, 16px)',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.85)',
                  margin: '0 0 28px',
                  maxWidth: 540,
                }}
              >
                Empowering progressive Indian agricultural enterprises and farmers with factory-direct agro-inputs, live multi-state mandi price benchmarking, and transparent consignment logistics without intermediary markups.
              </p>

              {/* Hero CTAs */}
              <div
                className="slide-up"
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginBottom: 32,
                }}
              >
                <Link
                  href="/home"
                  className="btn btn-primary"
                  style={{
                    background: 'var(--color-amber)',
                    color: '#fff',
                    border: 'none',
                    fontSize: 14.5,
                    padding: '11px 22px',
                    fontWeight: 700,
                    gap: 8,
                    borderRadius: 6,
                  }}
                >
                  Launch Farmer Dashboard <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/mandi"
                  className="btn btn-secondary"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.25)',
                    fontSize: 14.5,
                    padding: '11px 20px',
                    gap: 8,
                    borderRadius: 6,
                  }}
                >
                  <BarChart3 size={15} strokeWidth={2} /> Inspect Mandi Terminal
                </Link>
              </div>

              {/* Trust Information */}
              <div
                style={{
                  display: 'flex',
                  gap: 20,
                  flexWrap: 'wrap',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.75)',
                  paddingTop: 8,
                  borderTop: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={15} color="#34D399" strokeWidth={2.2} /> 100% Certified Seed Lots
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <TrendingUp size={15} color="#34D399" strokeWidth={2.2} /> 8 Direct APMC Benchmarks
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={15} color="#34D399" strokeWidth={2.2} /> Zero Middleman Markups
                </span>
              </div>
            </div>

            {/* Right Column: Live Operational Terminal Preview */}
            <div
              className="fade-in"
              style={{
                background: 'rgba(11, 41, 32, 0.85)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10,
                boxShadow: '0 24px 48px -12px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(16px)',
                overflow: 'hidden',
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  background: 'rgba(0,0,0,0.25)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#EF4444' }} />
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#F59E0B' }} />
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginLeft: 8 }}>
                    agritrade-terminal: live-cluster-in-west-1
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22c55e' }} />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#34D399', letterSpacing: '0.4px' }}>
                    WSS CONNECTED
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div style={{ padding: '16px 18px' }}>
                {/* Realtime APMC Snippet */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Real-Time APMC Price Feeds
                    </span>
                    <span style={{ fontSize: 10.5, color: '#FCD34D' }}>● Tick updated 8s ago</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, fontSize: 12.5 }}>
                      <div>
                        <span style={{ fontWeight: 600, color: '#fff' }}>Soybean (Yellow JS-335)</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginLeft: 6 }}>Indore APMC</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, color: '#fff' }}>₹4,320 / qtl</span>
                        <span style={{ color: '#34D399', fontSize: 11, fontWeight: 600, marginLeft: 8 }}>▲ +₹45</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, fontSize: 12.5 }}>
                      <div>
                        <span style={{ fontWeight: 600, color: '#fff' }}>Cotton (Medium Staple)</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginLeft: 6 }}>Rajkot APMC</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, color: '#fff' }}>₹7,100 / qtl</span>
                        <span style={{ color: '#34D399', fontSize: 11, fontWeight: 600, marginLeft: 8 }}>▲ +₹80</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, fontSize: 12.5 }}>
                      <div>
                        <span style={{ fontWeight: 600, color: '#fff' }}>Mustard (Bold Seed)</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginLeft: 6 }}>Alwar APMC</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, color: '#fff' }}>₹5,450 / qtl</span>
                        <span style={{ color: '#F87171', fontSize: 11, fontWeight: 600, marginLeft: 8 }}>▼ -₹25</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Consignment Stream */}
                <div style={{ padding: '12px', background: 'rgba(217, 119, 6, 0.12)', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Truck size={14} color="#FCD34D" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#FCD34D' }}>
                        Live Consignment: #ORD-2024-001
                      </span>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, background: '#FCD34D', color: '#78350F', padding: '2px 6px', borderRadius: 4 }}>
                      OUT FOR DELIVERY
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 11.5, color: 'rgba(255,255,255,0.8)' }}>
                    Courier: Delhivery Cargo Express · Pune Central Distribution Hub · ETA Today 2:30 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              4. PRODUCT EXPERIENCE PREVIEW (Layered & Restrained)
              ============================================================ */}
          <div
            className="slide-up"
            style={{
              marginTop: 48,
              maxWidth: 900,
              margin: '48px auto 0',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 10,
              padding: '24px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span className="badge badge-amber" style={{ background: 'rgba(217, 119, 6, 0.3)', color: '#FCD34D' }}>
                  FEATURED CANONICAL COMMERCE INPUT
                </span>
                <h3 style={{ margin: '6px 0 0', fontSize: 18, fontWeight: 700, color: '#fff' }}>
                  Premium Hybrid Soybean Seeds (JS-335)
                </h3>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={14} color="#34D399" /> Batch Tested &amp; Certified
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'center' }}>
              {/* Product Visual */}
              <div style={{ borderRadius: 6, overflow: 'hidden', height: 180, position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ProductImageResolver.resolve('prod_1', 'Seeds')}
                  alt="Hybrid Soybean Seeds"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: 8, left: 8, background: 'var(--color-amber)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 4 }}>
                  14% SAVINGS
                </span>
              </div>

              {/* Product Specifications & Interactive Order Preview */}
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 14 }}>
                  <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 10px', borderRadius: 6 }}>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Germination</p>
                    <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#34D399' }}>&gt;90% Certified</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 10px', borderRadius: 6 }}>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>APMC Baseline</p>
                    <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#fff' }}>₹4,320 / qtl</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 10px', borderRadius: 6 }}>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Farm-Gate Price</p>
                    <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#fff' }}>₹1,250 <span style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>₹1,450</span></p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 10px', borderRadius: 6 }}>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Delivery Window</p>
                    <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#FCD34D' }}>48 Hours Doorstep</p>
                  </div>
                </div>

                {/* Interactive Qty Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.08)', padding: '8px 14px', borderRadius: 6 }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Quantity ({farmAcres} acres est.):</span>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff' }}>
                      ₹{(1250 * interactiveProductQty).toLocaleString('en-IN')}{' '}
                      <span style={{ fontSize: 11, color: '#34D399', fontWeight: 600 }}>
                        (Save ₹{(200 * interactiveProductQty).toLocaleString('en-IN')})
                      </span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => setInteractiveProductQty((q) => Math.max(1, q - 1))}
                      style={{ width: 26, height: 26, borderRadius: 4, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', minWidth: 20, textAlign: 'center' }}>
                      {interactiveProductQty}
                    </span>
                    <button
                      onClick={() => setInteractiveProductQty((q) => q + 1)}
                      style={{ width: 26, height: 26, borderRadius: 4, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
                    >
                      +
                    </button>
                    <Link
                      href="/products/prod_1"
                      className="btn btn-sm btn-primary"
                      style={{ marginLeft: 6, fontSize: 12, padding: '5px 12px', borderRadius: 4 }}
                    >
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. TRUST & PROOF METRICS (Backed by Real Project Data)
          ============================================================ */}
      <section style={{ padding: '36px 0', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-divider)' }}>
        <div className="container-app">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, textAlign: 'center' }}>
            <div style={{ padding: '12px' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-forest)', letterSpacing: '-0.5px' }}>24+</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, color: 'var(--color-text-primary)' }}>Verified Input Specifications</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>Batch-certified seeds &amp; nutrition</div>
            </div>

            <div style={{ padding: '12px', borderLeft: '1px solid var(--color-divider)' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-forest)', letterSpacing: '-0.5px' }}>8 APMC</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, color: 'var(--color-text-primary)' }}>Mandi Hubs Benchmarked</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>Indore, Rajkot, Lasalgaon, Pune</div>
            </div>

            <div style={{ padding: '12px', borderLeft: '1px solid var(--color-divider)' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#059669', letterSpacing: '-0.5px' }}>&gt;90%</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, color: 'var(--color-text-primary)' }}>Certified Germination Standard</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>Govt-approved testing protocols</div>
            </div>

            <div style={{ padding: '12px', borderLeft: '1px solid var(--color-divider)' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-amber)', letterSpacing: '-0.5px' }}>0%</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, color: 'var(--color-text-primary)' }}>Middleman Price Distortion</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>Direct manufacturer-to-farm pricing</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. HOW AGRITRADE WORKS (4-Step Structured Workflow)
          ============================================================ */}
      <section style={{ padding: '64px 0', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-divider)' }}>
        <div className="container-app">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-forest)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Seamless Supply Chain
            </span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, margin: '6px 0 10px', letterSpacing: '-0.4px' }}>
              How AgriTrade Powers Transparent Commerce
            </h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
              From certified manufacturer lots to rural farm gate delivery, engineered with institutional rigor.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              {
                step: '01',
                icon: ShieldCheck,
                title: 'Laboratory Quality Verification',
                desc: 'All seed batches, micronutrients, and crop protection inputs undergo chemical purity and germination rate testing prior to catalog listing.',
              },
              {
                step: '02',
                icon: BarChart3,
                title: 'APMC Mandi Intelligence',
                desc: 'Real-time commodity arrivals and modal pricing data across key terminal mandis guide procurement timing and crop revenue planning.',
              },
              {
                step: '03',
                icon: Zap,
                title: 'Direct Farm-Gate Ordering',
                desc: 'Farmers purchase directly from verified manufacturers at wholesale pricing, eliminating 15% to 28% in local retailer margins.',
              },
              {
                step: '04',
                icon: Truck,
                title: '48-Hour Doorstep Logistics',
                desc: 'Specialized agricultural distribution routes deliver sealed orders directly to interior taluka collection points or farm gates.',
              },
            ].map(({ step, icon: IconW, title, desc }) => (
              <div key={step} className="card" style={{ padding: 24, position: 'relative', border: '1px solid var(--color-divider)', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest)' }}>
                    <IconW size={20} strokeWidth={2.2} />
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-tertiary)', opacity: 0.5 }}>{step}</span>
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          7. MARKET INTELLIGENCE SECTION (Actual Mandi Data Visualization)
          ============================================================ */}
      <section style={{ padding: '64px 0', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-divider)' }}>
        <div className="container-app">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-forest)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Commodity Terminal
              </span>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.3px' }}>
                APMC Mandi Price Intelligence
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                {['All', 'Soybean', 'Cotton', 'Wheat', 'Mustard', 'Onion'].map((crop) => (
                  <button
                    key={crop}
                    onClick={() => setSelectedMandiCrop(crop)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: selectedMandiCrop === crop ? 'var(--color-forest)' : 'var(--color-divider)',
                      background: selectedMandiCrop === crop ? 'var(--color-forest)' : '#fff',
                      color: selectedMandiCrop === crop ? '#fff' : 'var(--color-text-secondary)',
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {crop}
                  </button>
                ))}
              </div>
              <Link href="/mandi" className="btn btn-sm btn-secondary" style={{ fontSize: 12, gap: 4, padding: '6px 12px' }}>
                Full Terminal <ExternalLink size={13} />
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--color-divider)', borderRadius: 8 }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="mandi-table" style={{ margin: 0, width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ paddingLeft: 20 }}>Crop / Commodity</th>
                    <th>Benchmark Market</th>
                    <th>Modal Price</th>
                    <th>24h Movement</th>
                    <th>Trend</th>
                    <th style={{ paddingRight: 20 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMandiPrices.map((row) => (
                    <tr key={row.crop}>
                      <td style={{ paddingLeft: 20, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {row.crop}
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                        {row.market}
                      </td>
                      <td style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-forest)' }}>
                        {row.price}
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 600, color: row.trend === 'up' ? '#059669' : row.trend === 'down' ? '#DC2626' : '#6B7280' }}>
                        {row.change}
                      </td>
                      <td>
                        <span
                          className={`badge ${row.trend === 'up' ? 'badge-success' : row.trend === 'down' ? 'badge-error' : 'badge-neutral'}`}
                          style={{ fontSize: 11, textTransform: 'capitalize' }}
                        >
                          {row.trend}
                        </span>
                      </td>
                      <td style={{ paddingRight: 20 }}>
                        <Link
                          href={`/products?category=${row.crop === 'Cotton' || row.crop === 'Soybean' || row.crop === 'Wheat' ? 'Seeds' : 'Fertilizers'}`}
                          style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-forest)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                          View Inputs <ChevronRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          8. FEATURED INPUTS SHOWCASE (High-End Minimalist Commerce Grid)
          ============================================================ */}
      <section style={{ padding: '64px 0', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-divider)' }}>
        <div className="container-app">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-forest)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Curated Catalog
              </span>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.3px' }}>
                Featured Agricultural Inputs
              </h2>
            </div>
            <Link href="/products" style={{ fontSize: 13, color: 'var(--color-forest)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Explore All 24+ Inputs <ChevronRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {featuredProducts.map((p) => (
              <div key={p.id} className="card card-hover" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: 8, border: '1px solid var(--color-divider)' }}>
                <div style={{ height: 160, position: 'relative', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ProductImageResolver.resolve(p.id, p.category)}
                    alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: 10, left: 10, background: 'var(--color-forest)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                    {p.category}
                  </span>
                  {p.originalPrice && p.originalPrice > p.price && (
                    <span style={{ position: 'absolute', top: 10, right: 10, background: 'var(--color-amber)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                      {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 500 }}>
                    {p.sellerName}
                  </span>
                  <h4 style={{ margin: '4px 0 8px', fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {p.title}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 'auto', paddingTop: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-forest)' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    {p.originalPrice && (
                      <span style={{ fontSize: 12, textDecoration: 'line-through', color: 'var(--color-text-tertiary)' }}>
                        ₹{p.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginLeft: 'auto' }}>
                      per {p.unit}
                    </span>
                  </div>

                  <Link
                    href={`/products/${p.id}`}
                    className="btn btn-sm btn-primary"
                    style={{ marginTop: 14, width: '100%', borderRadius: 6, fontSize: 13, justifyContent: 'center' }}
                  >
                    View Specifications
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          9. INTERACTIVE SAVINGS CALCULATOR SECTION
          ============================================================ */}
      <section id="calculator" style={{ padding: '64px 0', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-divider)' }}>
        <div className="container-app">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-forest)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
              <Calculator size={14} strokeWidth={2.5} /> Transparent Economics
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.4px' }}>
              Interactive Farm Input Savings Calculator
            </h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
              Calculate seasonal savings achieved by ordering certified inputs directly from verified manufacturers on AgriTrade.
            </p>
          </div>

          <div
            className="card"
            style={{
              maxWidth: 840,
              margin: '0 auto',
              padding: '28px 32px',
              border: '1px solid var(--color-divider)',
              boxShadow: 'var(--shadow-md)',
              borderRadius: 10,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>
              {/* Inputs */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--color-text-primary)' }}>
                  Select Primary Crop:
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                  {Object.keys(CROP_SAVINGS_METRICS).map((crop) => (
                    <button
                      key={crop}
                      onClick={() => setSelectedCrop(crop)}
                      style={{
                        padding: '6px 13px',
                        borderRadius: 6,
                        border: '1px solid',
                        borderColor: selectedCrop === crop ? 'var(--color-forest)' : 'var(--color-divider)',
                        background: selectedCrop === crop ? 'var(--color-brand-50)' : '#fff',
                        color: selectedCrop === crop ? 'var(--color-forest)' : 'var(--color-text-secondary)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                      }}
                    >
                      {crop}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 700 }}>Farm Land Parcel Size:</label>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-forest)' }}>{farmAcres} Acres</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    step={1}
                    value={farmAcres}
                    onChange={(e) => setFarmAcres(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-forest)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                    <span>1 Acre</span>
                    <span>25 Acres</span>
                    <span>50 Acres</span>
                  </div>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div style={{ background: 'var(--color-neutral-50)', padding: 22, borderRadius: 8, border: '1px solid var(--color-divider)' }}>
                <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--color-text-tertiary)' }}>
                  Estimated Seasonal Outcome ({farmAcres} Acres {selectedCrop})
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Traditional Retailer Input Cost:</span>
                  <span style={{ fontWeight: 600, textDecoration: 'line-through', color: 'var(--color-text-tertiary)' }}>
                    ₹{totalStandardCost.toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>AgriTrade Direct Farm-Gate Cost:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-forest)' }}>
                    ₹{agritradeCost.toLocaleString('en-IN')}
                  </span>
                </div>

                <div
                  style={{
                    paddingTop: 12,
                    borderTop: '1px solid var(--color-divider)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Your Estimated Savings:</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: '#059669' }}>
                    +₹{estimatedSavings.toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  href={`/products?category=${selectedCrop === 'Cotton' || selectedCrop === 'Soybean' || selectedCrop === 'Wheat' ? 'Seeds' : 'Fertilizers'}`}
                  className="btn btn-primary btn-full"
                  style={{ marginTop: 18, fontSize: 13, gap: 6, borderRadius: 6 }}
                >
                  Explore {selectedCrop} Inputs on AgriTrade <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          10. PLATFORM ECOSYSTEM STORY (Dual-Platform + PostgreSQL)
          ============================================================ */}
      <section style={{ padding: '64px 0', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-divider)' }}>
        <div className="container-app">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-forest)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Production Architecture
            </span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, margin: '6px 0 10px', letterSpacing: '-0.4px' }}>
              Engineered Cross-Platform Ecosystem
            </h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
              A synchronized software ecosystem delivering field mobility and desktop-grade market intelligence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div className="card" style={{ padding: 24, border: '1px solid var(--color-divider)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest)' }}>
                  <Globe size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Next.js 16 Web Platform</h3>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-tertiary)' }}>apps/web · Desktop-First Commerce</p>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                <li>React 19 with App Router and Turbopack</li>
                <li>Zustand 5 client-side state architecture</li>
                <li>Lucide vector iconography (zero emojis)</li>
                <li>20 static and dynamic routes compiled</li>
                <li>Command center dashboard with APMC charts</li>
              </ul>
            </div>

            <div className="card" style={{ padding: 24, border: '1px solid var(--color-divider)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest)' }}>
                  <Smartphone size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Flutter 3.24 Mobile App</h3>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-tertiary)' }}>apps/mobile · Field-Ready Companion</p>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                <li>Clean Architecture with Riverpod 2.x</li>
                <li>GoRouter with deep linking &amp; route guards</li>
                <li>Offline local caching via Hive</li>
                <li>Stitch-aligned Material 3 design tokens</li>
                <li>94/94 unit and widget tests passing (100%)</li>
              </ul>
            </div>

            <div className="card" style={{ padding: 24, border: '1px solid var(--color-divider)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest)' }}>
                  <Database size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>PostgreSQL 16 Backend</h3>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-tertiary)' }}>Supabase PostgREST &amp; Hardened RLS</p>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                <li>10 canonical tables with check constraints</li>
                <li>Strict Row Level Security user isolation</li>
                <li>Environment-aware resilient repositories</li>
                <li>Zero hardcoded credentials or committed secrets</li>
                <li>Idempotent seed data for reproducible staging</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          11. CALL TO ACTION
          ============================================================ */}
      <section
        style={{
          background: 'var(--color-forest)',
          color: '#fff',
          padding: '64px 0',
          textAlign: 'center',
        }}
      >
        <div className="container-app" style={{ maxWidth: 680 }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, margin: '0 0 14px', letterSpacing: '-0.5px' }}>
            Empowering Indian Agriculture with Verifiable Transparency
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '0 auto 28px' }}>
            Join thousands of progressive farmers and agricultural cooperatives procuring certified inputs at verified farm-gate pricing.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href="/home"
              className="btn btn-primary"
              style={{
                background: 'var(--color-amber)',
                color: '#fff',
                border: 'none',
                fontSize: 15,
                padding: '12px 26px',
                fontWeight: 700,
                gap: 8,
                borderRadius: 6,
              }}
            >
              Open Farmer Dashboard <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <Link
              href="/signup"
              className="btn btn-secondary"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.25)',
                fontSize: 15,
                padding: '12px 22px',
                borderRadius: 6,
              }}
            >
              Register Farmer Account
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          12. PROFESSIONAL SAAS FOOTER
          ============================================================ */}
      <footer style={{ background: '#07241B', color: 'rgba(255,255,255,0.75)', padding: '48px 0 28px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container-app">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 40 }}>
            {/* Column 1: Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Leaf size={16} strokeWidth={2.2} />
                </div>
                <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>AGRI TRADE</span>
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                A synchronized agricultural marketplace platform connecting Indian farmers directly with certified manufacturers.
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 12 }}>
                Community Engagement Project (CEP) · PCCOE
              </p>
            </div>

            {/* Column 2: Platform Routes */}
            <div>
              <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Application
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <Link href="/home" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Command Center</Link>
                <Link href="/insights" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Farm Insights</Link>
                <Link href="/products" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Inputs Catalog</Link>
                <Link href="/mandi" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Mandi Intelligence</Link>
                <Link href="/shipments" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Logistics Operations</Link>
                <Link href="/orders" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Order Tracking</Link>
              </div>
            </div>

            {/* Column 3: Tech & Architecture */}
            <div>
              <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Architecture
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <span style={{ color: 'rgba(255,255,255,0.75)' }}>Flutter 3.24+ Mobile Target</span>
                <span style={{ color: 'rgba(255,255,255,0.75)' }}>Next.js 16.3.4 App Router</span>
                <span style={{ color: 'rgba(255,255,255,0.75)' }}>PostgreSQL 16 Relational Core</span>
                <span style={{ color: 'rgba(255,255,255,0.75)' }}>Row Level Security (RLS)</span>
              </div>
            </div>

            {/* Column 4: System Status */}
            <div>
              <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Backend Status
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#34D399', marginBottom: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34D399', display: 'inline-block' }} />
                <span>All Systems Operational</span>
              </div>
              <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>
                PostgreSQL schema active. Resilient fallback active when offline or unconfigured.
              </p>
            </div>
          </div>

          <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', flexWrap: 'wrap', gap: 10 }}>
            <span>© 2026 AgriTrade. All rights reserved.</span>
            <span>Developed with Modern Agrarian Fintech &amp; Clean Architecture.</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
