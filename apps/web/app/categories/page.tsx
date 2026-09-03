'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import CategoryIcon from '@/components/icons/CategoryIcon';
import { Search, ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="container-app" style={{ paddingTop: 24, paddingBottom: 32 }}>
        {/* Page header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.3px' }}>
            Shop by Category
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Find products tailored to your farming needs
          </p>
        </div>

        {/* Search */}
        <div className="search-input-wrap" style={{ marginBottom: 24 }}>
          <span className="search-icon">
            <Search size={16} strokeWidth={2} />
          </span>
          <input
            id="categories-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories…"
            className="input-base"
          />
        </div>

        {/* Category list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filtered.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              id={`category-${cat.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  background: '#fff',
                  border: '1px solid var(--color-divider)',
                  borderRadius: 10,
                  marginBottom: 8,
                  transition: 'box-shadow 150ms ease',
                }}
                className="card-hover"
              >
                {/* Icon */}
                <div
                  className="cat-icon-wrap"
                  style={{ width: 48, height: 48, borderRadius: 8, flexShrink: 0 }}
                >
                  <CategoryIcon categoryName={cat.name} size={22} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {cat.name}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                    {cat.itemCount?.toLocaleString('en-IN')} products available
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight size={16} strokeWidth={2} color="var(--color-text-tertiary)" />
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Search size={28} strokeWidth={1.5} />
            </div>
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
