'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CloudRain,
  Wind,
  Droplets,
  Sun,
  AlertTriangle,
  Info,
  Clock,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import AppShellLayout from '@/components/layout/AppShell';
import {
  CURRENT_WEATHER,
  HOURLY_FORECASTS,
  DAILY_FORECASTS,
  FARM_ADVISORIES,
} from '@/features/weather/data/weather-repository';

const emptySubscribe = () => () => {};
const useMounted = () => React.useSyncExternalStore(emptySubscribe, () => true, () => false);

export default function WeatherPage() {
  const [activeAdvisoryFilter, setActiveAdvisoryFilter] = useState<'All' | 'Spraying' | 'Irrigation' | 'Field Prep'>('All');
  const mounted = useMounted();

  const filteredAdvisories = activeAdvisoryFilter === 'All'
    ? FARM_ADVISORIES
    : FARM_ADVISORIES.filter((a) => a.category === activeAdvisoryFilter);

  if (!mounted) return null;

  return (
    <AppShellLayout>
      <div className="container-app" style={{ paddingBottom: 'var(--space-2xl)' }}>
        {/* Breadcrumb & Header */}
        <div style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
            <Link href="/home" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Agro-Meteorological Intelligence</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="text-h1" style={{ margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <CloudRain size={26} style={{ color: 'var(--color-forest)' }} />
                Regional Weather & Farm Advisory
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                {CURRENT_WEATHER.location}, {CURRENT_WEATHER.state} • {CURRENT_WEATHER.updatedAt}
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
              <CheckCircle2 size={14} />
              IMD Micro-Climate Station Synced
            </div>
          </div>
        </div>

        {/* 2-Column Top Section: Current Conditions + Farm Advisory */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-xl)',
          }}
        >
          {/* Panel 1: Current Agro-Met Conditions */}
          <div
            className="card-base"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-variant) 100%)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-tertiary)' }}>
                  Current Observation
                </span>
                <h2 style={{ fontSize: 44, fontWeight: 800, color: 'var(--color-forest)', margin: '4px 0 0', letterSpacing: '-1.5px' }}>
                  {CURRENT_WEATHER.temperature}°C
                </h2>
                <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                  Feels like {CURRENT_WEATHER.feelsLike}°C • {CURRENT_WEATHER.conditionText}
                </p>
              </div>

              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <CloudRain size={30} />
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--color-text-tertiary)', fontSize: 12, marginBottom: 4 }}>
                  <Droplets size={14} style={{ color: '#0284c7' }} />
                  Relative Humidity
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {CURRENT_WEATHER.humidity}%
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginLeft: 6 }}>High</span>
              </div>

              <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--color-text-tertiary)', fontSize: 12, marginBottom: 4 }}>
                  <Wind size={14} style={{ color: '#64748b' }} />
                  Wind Velocity
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {CURRENT_WEATHER.windSpeedKmH} km/h
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginLeft: 6 }}>WSW</span>
              </div>

              <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--color-text-tertiary)', fontSize: 12, marginBottom: 4 }}>
                  <CloudRain size={14} style={{ color: 'var(--color-amber)' }} />
                  Rain Probability
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-amber)' }}>
                  {CURRENT_WEATHER.rainProbability}%
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginLeft: 6 }}>Next 24h</span>
              </div>

              <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--color-text-tertiary)', fontSize: 12, marginBottom: 4 }}>
                  <Sun size={14} style={{ color: '#eab308' }} />
                  UV Radiation Index
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {CURRENT_WEATHER.uvIndex}
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginLeft: 6 }}>Moderate</span>
              </div>
            </div>
          </div>

          {/* Panel 2: Operational Farm Advisories (Deterministic Rule-based) */}
          <div
            className="card-base"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                  Operational Farm Advisories
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--color-text-tertiary)', margin: '2px 0 0' }}>
                  Rule-based crop management guidance derived from soil & atmospheric thresholds
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto' }}>
              {(['All', 'Spraying', 'Field Prep', 'Irrigation'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveAdvisoryFilter(cat)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 12,
                    fontWeight: activeAdvisoryFilter === cat ? 600 : 500,
                    background: activeAdvisoryFilter === cat ? 'var(--color-forest)' : 'var(--color-surface-variant)',
                    color: activeAdvisoryFilter === cat ? '#fff' : 'var(--color-text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Advisory Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {filteredAdvisories.map((advisory) => {
                const isCritical = advisory.severity === 'critical';
                const isWarning = advisory.severity === 'warning';
                return (
                  <div
                    key={advisory.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: isCritical
                        ? 'rgba(183, 43, 43, 0.06)'
                        : isWarning
                        ? 'rgba(217, 119, 6, 0.06)'
                        : 'var(--color-surface-variant)',
                      borderLeft: `4px solid ${
                        isCritical ? 'var(--color-error)' : isWarning ? 'var(--color-amber)' : 'var(--color-forest)'
                      }`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      {isCritical ? (
                        <AlertTriangle size={15} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
                      ) : (
                        <Info size={15} style={{ color: isWarning ? 'var(--color-amber)' : 'var(--color-forest)', flexShrink: 0 }} />
                      )}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: isCritical ? 'var(--color-error)' : isWarning ? 'var(--color-amber)' : 'var(--color-forest)',
                        }}
                      >
                        {advisory.category} Advisory
                      </span>
                    </div>
                    <h4 style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 3px' }}>
                      {advisory.title}
                    </h4>
                    <p style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.45 }}>
                      {advisory.advice}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section: Hourly Forecast Timeline */}
        <div
          className="card-base"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--space-xl)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Clock size={18} style={{ color: 'var(--color-forest)' }} />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                24-Hour Micro-Met Forecast Timeline
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--color-text-tertiary)', margin: 0 }}>
                Hourly temperature, precipitation risk, and surface wind tracking
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: 10,
              overflowX: 'auto',
            }}
          >
            {HOURLY_FORECASTS.map((hour) => (
              <div
                key={hour.time}
                style={{
                  padding: '14px 10px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-variant)',
                  textAlign: 'center',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  {hour.time}
                </span>
                <div style={{ margin: '8px 0', display: 'flex', justifyContent: 'center' }}>
                  {hour.condition === 'rain' || hour.condition === 'thunder' ? (
                    <CloudRain size={22} style={{ color: '#0284c7' }} />
                  ) : (
                    <Sun size={22} style={{ color: '#eab308' }} />
                  )}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                  {hour.temperature}°C
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-amber)' }}>
                  {hour.rainProbability}% Rain
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                  {hour.windSpeedKmH} km/h
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: 7-Day Extended Agrarian Forecast */}
        <div
          className="card-base"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Calendar size={18} style={{ color: 'var(--color-forest)' }} />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                7-Day Extended Agrarian Forecast
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--color-text-tertiary)', margin: 0 }}>
                Weekly temperature range and moisture trend for irrigation and harvesting schedule
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {DAILY_FORECASTS.map((day) => (
              <div
                key={day.day}
                style={{
                  padding: '16px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-variant)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {day.day}
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
                  {day.date}
                </span>

                <div style={{ margin: '6px 0 10px' }}>
                  {day.condition === 'rain' || day.condition === 'thunder' ? (
                    <CloudRain size={26} style={{ color: '#0284c7' }} />
                  ) : (
                    <Sun size={26} style={{ color: '#eab308' }} />
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-forest)' }}>
                    {day.tempHigh}°
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                    {day.tempLow}°
                  </span>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: day.rainProbability > 50 ? 'rgba(2, 132, 199, 0.12)' : 'rgba(234, 179, 8, 0.12)',
                    color: day.rainProbability > 50 ? '#0284c7' : '#ca8a04',
                  }}
                >
                  {day.rainProbability}% Rain
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShellLayout>
  );
}
