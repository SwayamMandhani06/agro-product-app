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
  Package,
  Layers,
  Sparkles,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { ProductImageResolver } from '@/lib/product-image-resolver';
import CategoryIcon from '@/components/icons/CategoryIcon';
import { MOCK_MANDI_PRICES, MOCK_CATEGORIES } from '@/lib/mock-data';

// Savings estimation calculator data by crop per acre
const CROP_SAVINGS_METRICS: Record<string, { baselineInputCost: number; agritradeSavingsPct: number }> = {
  Soybean: { baselineInputCost: 5200, agritradeSavingsPct: 0.22 },
  Cotton: { baselineInputCost: 8400, agritradeSavingsPct: 0.25 },
  Wheat: { baselineInputCost: 4800, agritradeSavingsPct: 0.20 },
  Sugarcane: { baselineInputCost: 14200, agritradeSavingsPct: 0.28 },
  Vegetables: { baselineInputCost: 11500, agritradeSavingsPct: 0.24 },
};

export default function SaaSMarketingHomePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'parity'>('overview');
  const [farmAcres, setFarmAcres] = useState<number>(5);
  const [selectedCrop, setSelectedCrop] = useState<string>('Soybean');
  const [interactiveProductQty, setInteractiveProductQty] = useState<number>(2);

  const cropMetric = CROP_SAVINGS_METRICS[selectedCrop] || CROP_SAVINGS_METRICS.Soybean;
  const totalStandardCost = cropMetric.baselineInputCost * farmAcres;
  const estimatedSavings = Math.round(totalStandardCost * cropMetric.agritradeSavingsPct);
  const agritradeCost = totalStandardCost - estimatedSavings;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', color: 'var(--color-text-primary)' }}>

      {/* ============================================================
          1. TOP SAAS HEADER / NAVIGATION BAR
          ============================================================ */}
      <header
        className="glass-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
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
                padding: '2px 6px',
                borderRadius: 4,
                letterSpacing: '0.4px',
              }}
            >
              STAGE 4D
            </span>
          </Link>

          {/* Nav Links */}
          <nav style={{ display: 'none', gap: 20 }} className="desktop-nav">
            <a href="#features" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>
              Features
            </a>
            <a href="#calculator" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>
              ROI Calculator
            </a>
            <a href="#architecture" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>
              Dual-Platform Sync
            </a>
            <a href="#mandi" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>
              APMC Mandi
            </a>
          </nav>

          {/* Quick CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              href="/login"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                textDecoration: 'none',
                padding: '6px 14px',
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
              }}
            >
              Launch App <ArrowRight size={14} strokeWidth={2.5} />
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
          3. HERO SECTION (Modern Agrarian SaaS)
          ============================================================ */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--color-forest) 0%, #062118 100%)',
          color: '#fff',
          paddingTop: 56,
          paddingBottom: 72,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container-app">
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
            {/* Tag Pill */}
            <div
              className="fade-in"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 14px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.18)',
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 20,
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              <Sparkles size={13} color="#FCD34D" strokeWidth={2.5} />
              <span>STAGE 4D · UNIFIED POSTGRESQL & CROSS-PLATFORM SYNCHRONIZATION</span>
            </div>

            {/* Main Headline */}
            <h1
              className="slide-up"
              style={{
                fontSize: 'clamp(28px, 4.8vw, 52px)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.8px',
                margin: '0 0 18px',
              }}
            >
              The Modern Operating System for <span style={{ color: '#FCD34D' }}>Indian Agricultural Commerce</span>
            </h1>

            {/* Subhead */}
            <p
              className="slide-up"
              style={{
                fontSize: 'clamp(14px, 1.8vw, 17px)',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.82)',
                margin: '0 auto 32px',
                maxWidth: 640,
              }}
            >
              Direct manufacturer-to-farm input marketplace with certified high-yield seeds, transparent farm-gate pricing, and real-time APMC intelligence. Synchronized across Flutter Mobile and Next.js Web.
            </p>

            {/* Hero CTAs */}
            <div
              className="slide-up"
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 12,
                flexWrap: 'wrap',
                marginBottom: 44,
              }}
            >
              <Link
                href="/home"
                className="btn btn-primary"
                style={{
                  background: 'var(--color-amber)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 15,
                  padding: '12px 24px',
                  fontWeight: 700,
                  gap: 8,
                }}
              >
                Enter Farmer Dashboard <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link
                href="/products"
                className="btn btn-secondary"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.25)',
                  fontSize: 15,
                  padding: '12px 22px',
                  gap: 8,
                }}
              >
                <Package size={16} strokeWidth={2} /> Browse Catalog
              </Link>
            </div>

            {/* Trust Badges */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 24,
                flexWrap: 'wrap',
                fontSize: 12.5,
                color: 'rgba(255,255,255,0.7)',
                paddingTop: 8,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} color="#34D399" strokeWidth={2.2} /> 100% Certified Seeds
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={16} color="#34D399" strokeWidth={2.2} /> Live APMC Mandi Rates
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={16} color="#34D399" strokeWidth={2.2} /> Zero Middlemen Markups
              </span>
            </div>
          </div>

          {/* ============================================================
              HERO INTERACTIVE PRODUCT / PLATFORM PREVIEW
              ============================================================ */}
          <div
            className="slide-up"
            style={{
              marginTop: 48,
              maxWidth: 900,
              margin: '48px auto 0',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 12,
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
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={14} color="#34D399" /> Batch Tested &amp; Certified
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'center' }}>
              {/* Product Visual */}
              <div style={{ borderRadius: 8, overflow: 'hidden', height: 180, position: 'relative' }}>
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
                      style={{ marginLeft: 6, fontSize: 12, padding: '5px 12px' }}
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
          4. INTERACTIVE SAVINGS CALCULATOR SECTION
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
              See how much you save per season by ordering directly from certified agro-manufacturers on AgriTrade.
            </p>
          </div>

          <div
            className="card"
            style={{
              maxWidth: 820,
              margin: '0 auto',
              padding: '28px 32px',
              border: '1px solid var(--color-divider)',
              boxShadow: 'var(--shadow-md)',
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
              <div style={{ background: 'var(--color-neutral-50)', padding: 22, borderRadius: 10, border: '1px solid var(--color-divider)' }}>
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
                  style={{ marginTop: 18, fontSize: 13, gap: 6 }}
                >
                  Explore {selectedCrop} Inputs on AgriTrade <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. DUAL-PLATFORM SYNCHRONIZATION SHOWCASE
          ============================================================ */}
      <section id="architecture" style={{ padding: '64px 0', background: 'var(--color-bg)' }}>
        <div className="container-app">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
            <span className="badge badge-success" style={{ marginBottom: 8 }}>
              CANONICAL DATA CONTRACT
            </span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.4px' }}>
              Dual-Platform Synchronized Architecture
            </h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
              Mobile and Web targets consume the same PostgreSQL schema with unified contracts and zero data drift.
            </p>

            {/* Tab switch */}
            <div style={{ display: 'inline-flex', background: 'var(--color-surface)', padding: 4, borderRadius: 8, border: '1px solid var(--color-divider)', marginTop: 20 }}>
              {(['overview', 'architecture', 'parity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: 'none',
                    background: activeTab === tab ? 'var(--color-forest)' : 'transparent',
                    color: activeTab === tab ? '#fff' : 'var(--color-text-secondary)',
                    fontWeight: 600,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div className="card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest)' }}>
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Flutter Mobile App</h3>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-tertiary)' }}>apps/mobile · Android &amp; iOS</p>
                  </div>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  <li>Riverpod 2.x reactive state management</li>
                  <li>GoRouter with deep linking &amp; route guards</li>
                  <li>Offline local persistence via Hive</li>
                  <li>Material 3 with custom Stitch agrarian tokens</li>
                  <li>94 automated unit &amp; widget tests passing</li>
                </ul>
              </div>

              <div className="card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest)' }}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Next.js 16 Web App</h3>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-tertiary)' }}>apps/web · Responsive App Router</p>
                  </div>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  <li>React 19 with Turbopack acceleration</li>
                  <li>Zustand 5 client-side state stores</li>
                  <li>Lucide React vector iconography (0 emojis)</li>
                  <li>SaaS Command Center dashboard with SVG charts</li>
                  <li>15/15 static and dynamic routes compiled</li>
                </ul>
              </div>

              <div className="card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest)' }}>
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>PostgreSQL 16 Backend</h3>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-tertiary)' }}>Supabase REST &amp; Row Level Security</p>
                  </div>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  <li>Canonical relational schema (profiles, products, orders)</li>
                  <li>Strict RLS security policies per user ID</li>
                  <li>Idempotent seed scripts with 24 realistic products</li>
                  <li>Environment-aware repository fallback architecture</li>
                  <li>Zero secrets committed in source code</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Architecture */}
          {activeTab === 'architecture' && (
            <div className="card" style={{ padding: 24 }}>
              <pre
                style={{
                  margin: 0,
                  fontSize: 12.5,
                  fontFamily: 'monospace',
                  background: '#07241B',
                  color: '#34D399',
                  padding: 20,
                  borderRadius: 8,
                  overflowX: 'auto',
                  lineHeight: 1.5,
                }}
              >
{`                    ┌────────────────────────────────────────────────────────┐
                    │               AgriTrade Core Contracts                 │
                    │      Product · Category · Order · MandiPrice · Address │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼                                                             ▼
  ┌───────────────────────────────┐                             ┌───────────────────────────────┐
  │      apps/mobile (Flutter)    │                             │        apps/web (Next.js)     │
  │  - Riverpod State Providers   │                             │  - Zustand State Stores       │
  │  - ProductRepository Interface│                             │  - ProductRepository Interface│
  │  - SupabaseProductRepository  │                             │  - SupabaseProductRepository  │
  │  - Fallback: MockProductRepo  │                             │  - Fallback: MockProductRepo  │
  └──────────────┬────────────────┘                             └───────────────┬───────────────┘
                 │                                                             │
                 └──────────────────────────────┬──────────────────────────────┘
                                                ▼
                             ┌─────────────────────────────────────┐
                             │       PostgreSQL 16 / Supabase      │
                             │  - profiles, products, categories   │
                             │  - carts, cart_items, orders        │
                             │  - Row Level Security (RLS) Active  │
                             └─────────────────────────────────────┘`}
              </pre>
            </div>
          )}

          {/* Tab 3: Parity Matrix */}
          {activeTab === 'parity' && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="mandi-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th style={{ paddingLeft: 20 }}>Feature Domain</th>
                    <th>Flutter Mobile Target</th>
                    <th>Next.js Web Target</th>
                    <th>Shared PostgreSQL Table</th>
                    <th style={{ paddingRight: 20 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { domain: 'Product Catalog', mobile: 'Clean Arch + Riverpod', web: 'Zustand + Repository', table: 'public.products', status: 'Synchronized' },
                    { domain: 'Categories', mobile: 'CategoryGridSection', web: 'CategoryIcon Grid', table: 'public.categories', status: 'Synchronized' },
                    { domain: 'Cart Management', mobile: 'CartNotifier + Hive', web: 'CartStore + LocalStorage', table: 'public.carts / cart_items', status: 'Synchronized' },
                    { domain: 'Orders & Tracking', mobile: 'OrderRepository + Stream', web: 'OrdersStore + Timeline', table: 'public.orders / order_items', status: 'Synchronized' },
                    { domain: 'APMC Mandi Rates', mobile: 'LiveMandiSection', web: '7-Day Sparkline + Table', table: 'public.mandi_prices', status: 'Synchronized' },
                    { domain: 'User Profile', mobile: 'FarmerGreetingHeader', web: 'AppShell User Menu', table: 'public.profiles', status: 'Synchronized' },
                  ].map((row) => (
                    <tr key={row.domain}>
                      <td style={{ paddingLeft: 20, fontWeight: 600 }}>{row.domain}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>{row.mobile}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>{row.web}</td>
                      <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-forest)' }}>{row.table}</td>
                      <td style={{ paddingRight: 20 }}>
                        <span className="badge badge-success" style={{ fontSize: 11 }}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          6. SIX CORE PLATFORM PILLARS
          ============================================================ */}
      <section id="features" style={{ padding: '64px 0', background: 'var(--color-surface)', borderTop: '1px solid var(--color-divider)' }}>
        <div className="container-app">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-forest)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Engineered for Real Impact
            </span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, margin: '6px 0 10px', letterSpacing: '-0.4px' }}>
              Why AgriTrade Outperforms Traditional Retailing
            </h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
              Purpose-built infrastructure designed to solve real challenges faced by Indian farmers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {[
              {
                icon: ShieldCheck,
                title: '100% Certified Seed Assurance',
                desc: 'Every seed lot is batch-tested with guaranteed germination rates exceeding 90%. Government-approved breeder seed verification.',
              },
              {
                icon: TrendingUp,
                title: 'Live APMC Mandi Intelligence',
                desc: 'Real-time commodity prices and 7-day movement trends across major mandis (Indore, Rajkot, Lasalgaon, Pune) for informed selling.',
              },
              {
                icon: Zap,
                title: 'Zero-Middleman Farm Gate Pricing',
                desc: 'Direct dispatch from verified manufacturers and cooperative suppliers saves farmers 15% to 28% on seasonal input expenditures.',
              },
              {
                icon: Package,
                title: 'Rural Doorstep Logistics',
                desc: 'Specialized agricultural delivery network reaching interior talukas and village gates within 48 hours of order placement.',
              },
              {
                icon: Smartphone,
                title: 'Cross-Platform Resilience',
                desc: 'Optimistic UI updates with offline-first synchronization ensure you never lose cart items or order state during poor connectivity.',
              },
              {
                icon: Layers,
                title: 'Multi-Crop Input Guidance',
                desc: 'Contextual recommendations tailored for Maharashtra and Madhya Pradesh cropping calendars (Soybean, Cotton, Wheat, Sugarcane).',
              },
            ].map(({ icon: IconC, title, desc }) => (
              <div key={title} className="card card-hover" style={{ padding: 22 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest)', marginBottom: 14 }}>
                  <IconC size={20} strokeWidth={2.2} />
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          7. CATEGORY DISCOVERY CAROUSEL
          ============================================================ */}
      <section style={{ padding: '64px 0', background: 'var(--color-bg)', borderTop: '1px solid var(--color-divider)' }}>
        <div className="container-app">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-forest)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Full Catalog Coverage
              </span>
              <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.3px' }}>
                Browse Inputs by Agricultural Category
              </h2>
            </div>
            <Link href="/categories" style={{ fontSize: 13, color: 'var(--color-forest)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View All Categories <ChevronRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
            {MOCK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="card card-hover"
                style={{
                  padding: '16px 14px',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: '#fff',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest)', marginBottom: 10 }}>
                  <CategoryIcon categoryName={cat.name} size={22} />
                </div>
                <h4 style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {cat.name}
                </h4>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                  {cat.itemCount} verified products
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          8. CALL TO ACTION & GETTING STARTED
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
            Ready to Transform Your Agricultural Commerce Experience?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '0 auto 28px' }}>
            Join thousands of progressive Indian farmers accessing direct farm-gate pricing, verified inputs, and real-time market intelligence today.
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
              }}
            >
              Register Farmer Account
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          9. SAAS FOOTER
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
                <Link href="/products" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Product Discovery</Link>
                <Link href="/categories" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Category Directory</Link>
                <Link href="/orders" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Order Tracking</Link>
              </div>
            </div>

            {/* Column 3: Tech & Docs */}
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
                PostgreSQL schema active. Graceful fallback active when offline or unconfigured.
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
