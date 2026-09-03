'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { MOCK_CATEGORIES } from '@/lib/mock-data';

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const CATEGORY_COLORS = [
    { bg: '#EAF6EF', border: '#CEEAD9', text: '#01421E' }, // green
    { bg: '#FFF3E0', border: '#FFDEB8', text: '#914D00' }, // amber
    { bg: '#DCF0FB', border: '#B8DFF5', text: '#1B6BAA' }, // blue
    { bg: '#F0EAE6', border: '#DDD6D0', text: '#463D35' }, // warm
    { bg: '#EAF6EF', border: '#CEEAD9', text: '#01421E' }, // green
    { bg: '#FFF3E0', border: '#FFDEB8', text: '#914D00' }, // amber
  ];

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 24, paddingBottom: 24 }}>
        {/* Page header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Shop by Category
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Find products tailored to your farming needs
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>
            🔍
          </span>
          <input
            id="categories-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="input-base"
            style={{ paddingLeft: 44 }}
          />
        </div>

        {/* Category grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {filtered.map((cat, idx) => {
            const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            return (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                id={`category-${cat.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="card card-hover"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '20px 20px',
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 18,
                      background: color.bg,
                      border: `1.5px solid ${color.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 30,
                      flexShrink: 0,
                    }}
                  >
                    {cat.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: '0 0 4px',
                        fontSize: 17,
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {cat.name}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {cat.itemCount?.toLocaleString('en-IN')} products
                    </p>
                  </div>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: 20 }}>›</span>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>No categories found</p>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
