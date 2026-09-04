'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMarketplaceStore } from '@/features/marketplace/marketplace-store';
import { SellerPortalNav } from '@/features/marketplace/presentation/SellerPortalNav';
import { InventoryStatusBadge } from '@/features/marketplace/presentation/InventoryStatusBadge';
import { computeStockHealth } from '@/features/marketplace/domain/inventory';
import { Search, Plus, Edit3 } from 'lucide-react';

export default function SellerProductsPage() {
  const { inventory, adjustStock } = useMarketplaceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [adjustModalItem, setAdjustModalItem] = useState<{ id: string; title: string; currentStock: number } | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustNote, setAdjustNote] = useState<string>('');

  const categories = ['All', 'Fertilizers', 'Seeds', 'Crop Protection', 'Irrigation'];

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.listingStatus === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleApplyAdjustment = () => {
    if (!adjustModalItem) return;
    adjustStock(adjustModalItem.id, adjustQty, adjustQty >= 0 ? 'stock_in' : 'stock_out', adjustNote || 'Manual adjustment via catalog table');
    setAdjustModalItem(null);
    setAdjustQty(10);
    setAdjustNote('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <SellerPortalNav />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-slate)' }}>
              Product Catalog & Listing Management
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              {filteredItems.length} of {inventory.length} total SKUs displayed
            </span>
          </div>

          <Link
            href="/seller/products/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-forest)',
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <Plus size={16} /> Add Product Listing
          </Link>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            padding: '14px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* Search box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-surface-tint)',
              borderRadius: '6px',
              padding: '6px 12px',
              flex: '1',
              minWidth: '220px',
            }}
          >
            <Search size={15} color="var(--color-neutral-400)" />
            <input
              type="text"
              placeholder="Search by title, SKU, or active chemical..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '13px',
                width: '100%',
                color: 'var(--color-slate)',
              }}
            />
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  border: 'none',
                  background: categoryFilter === cat ? 'var(--color-forest)' : 'var(--color-surface-subtle)',
                  color: categoryFilter === cat ? '#FFFFFF' : 'var(--color-neutral-600)',
                  fontWeight: categoryFilter === cat ? 600 : 500,
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              border: '1px solid var(--color-surface-tint)',
              background: 'var(--color-surface-subtle)',
              color: 'var(--color-slate)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* Data Table */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-surface-tint)' }}>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Product</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>SKU</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Price / MRP</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Warehouse Stock</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-neutral-600)', fontSize: '11px', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const health = computeStockHealth(item);

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--color-surface-subtle)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '6px',
                              background: 'var(--color-surface-subtle)',
                              overflow: 'hidden',
                              position: 'relative',
                              flexShrink: 0,
                            }}
                          >
                            {item.imageUrl && (
                              <Image
                                src={item.imageUrl}
                                alt={item.productTitle}
                                fill
                                sizes="42px"
                                style={{ objectFit: 'cover' }}
                              />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--color-slate)', lineHeight: 1.3 }}>
                              {item.productTitle}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                              Unit: {item.unit} • MOQ: {item.minimumOrderQuantity}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-neutral-700)' }}>
                        {item.sku}
                      </td>

                      <td style={{ padding: '12px 16px', color: 'var(--color-neutral-700)' }}>
                        {item.category}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-slate)' }}>
                          ₹{item.price.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-neutral-400)', textDecoration: 'line-through' }}>
                          MRP ₹{item.mrp.toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <InventoryStatusBadge stockHealth={health} stockQuantity={item.stockQuantity} reorderLevel={item.reorderLevel} />
                          <button
                            onClick={() => setAdjustModalItem({ id: item.id, title: item.productTitle, currentStock: item.stockQuantity })}
                            title="Adjust inventory level"
                            style={{
                              border: '1px solid var(--color-surface-tint)',
                              background: 'var(--color-surface-subtle)',
                              borderRadius: '4px',
                              padding: '3px 6px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              color: 'var(--color-slate)',
                            }}
                          >
                            ± Stock
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <InventoryStatusBadge status={item.listingStatus} />
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link
                            href={`/seller/products/${item.id}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              border: '1px solid var(--color-surface-tint)',
                              background: 'var(--color-surface)',
                              color: 'var(--color-slate)',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '5px 8px',
                              borderRadius: '4px',
                              textDecoration: 'none',
                            }}
                          >
                            <Edit3 size={13} /> Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stock Adjustment Modal */}
        {adjustModalItem && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99,
              padding: '20px',
            }}
          >
            <div
              style={{
                background: 'var(--color-surface)',
                borderRadius: '8px',
                padding: '24px',
                width: '100%',
                maxWidth: '440px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: 'var(--color-slate)' }}>
                Stock Adjustment Audit
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'var(--color-neutral-600)' }}>
                {adjustModalItem.title}
              </p>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-600)', marginBottom: '4px' }}>
                  Current Inventory: {adjustModalItem.currentStock} units
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                    style={{
                      border: '1px solid var(--color-surface-tint)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      width: '120px',
                      background: 'var(--color-surface-subtle)',
                    }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                    New Total: <strong>{Math.max(0, adjustModalItem.currentStock + adjustQty)}</strong> units
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-600)', marginBottom: '4px' }}>
                  Audit Note / Warehouse Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inward consignment from Zuari depot"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid var(--color-surface-tint)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    background: 'var(--color-surface-subtle)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={() => setAdjustModalItem(null)}
                  style={{
                    border: '1px solid var(--color-surface-tint)',
                    background: 'var(--color-surface)',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyAdjustment}
                  style={{
                    border: 'none',
                    background: 'var(--color-forest)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Apply & Record Audit
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
