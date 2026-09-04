'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMarketplaceStore } from '@/features/marketplace/marketplace-store';
import { SellerPortalNav } from '@/features/marketplace/presentation/SellerPortalNav';
import type { ListingStatus } from '@/features/marketplace/domain/inventory';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const { addInventoryItem, activeSellerId } = useMarketplaceStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fertilizers');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(1200);
  const [mrp, setMrp] = useState<number>(1400);
  const [stockQuantity, setStockQuantity] = useState<number>(100);
  const reorderLevel = 20;
  const moq = 1;
  const [unit, setUnit] = useState('50 kg Bag');
  const [listingStatus, setListingStatus] = useState<ListingStatus>('active');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState('Certified organic, High germination, Tested laboratory grade');
  const [specs, setSpecs] = useState('Nitrogen: 20%\nPurity: 99%\nMoisture: 10% Max');
  const imageUrl = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sku.trim()) return;

    const parsedSpecs: Record<string, string> = {};
    specs.split('\n').forEach((line) => {
      const parts = line.split(':');
      if (parts.length === 2) {
        parsedSpecs[parts[0].trim()] = parts[1].trim();
      }
    });

    addInventoryItem({
      productId: `prod_${Date.now()}`,
      productTitle: title.trim(),
      sellerId: activeSellerId,
      sku: sku.trim().toUpperCase(),
      category,
      stockQuantity,
      reservedQuantity: 0,
      reorderLevel,
      minimumOrderQuantity: moq,
      unit,
      listingStatus,
      price,
      mrp,
      imageUrl,
      highlights: highlights.split(',').map((h) => h.trim()).filter(Boolean),
      specifications: parsedSpecs,
    });

    router.push('/seller/products');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      <SellerPortalNav />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link
            href="/seller/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-neutral-600)',
              textDecoration: 'none',
              marginBottom: '8px',
            }}
          >
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--color-slate)' }}>
            Create New Product Listing
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
            Publish verified agro-inputs to marketplace farmers and cooperative aggregations
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-tint)',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Basic Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mahadhan NPK 10:26:26 Complex Fertilizer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-surface-tint)',
                  background: 'var(--color-surface-subtle)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-surface-tint)',
                  background: 'var(--color-surface-subtle)',
                  fontSize: '13px',
                }}
              >
                <option value="Fertilizers">Fertilizers</option>
                <option value="Seeds">Seeds</option>
                <option value="Crop Protection">Crop Protection</option>
                <option value="Irrigation">Irrigation</option>
                <option value="Tools & Implements">Tools & Implements</option>
                <option value="Organic Inputs">Organic Inputs</option>
              </select>
            </div>
          </div>

          {/* SKU & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
                Stock Keeping Unit (SKU) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. FERT-NPK-1026-50KG"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-surface-tint)',
                  background: 'var(--color-surface-subtle)',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
                Listing Status
              </label>
              <select
                value={listingStatus}
                onChange={(e) => setListingStatus(e.target.value as ListingStatus)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-surface-tint)',
                  background: 'var(--color-surface-subtle)',
                  fontSize: '13px',
                }}
              >
                <option value="active">Active Listing</option>
                <option value="draft">Draft (Unpublished)</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
                Selling Price (₹) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-surface-tint)',
                  background: 'var(--color-surface-subtle)',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
                MRP (₹) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-surface-tint)',
                  background: 'var(--color-surface-subtle)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
                Stock Units *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-surface-tint)',
                  background: 'var(--color-surface-subtle)',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
                Unit Specifier
              </label>
              <input
                type="text"
                placeholder="50 kg Bag"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-surface-tint)',
                  background: 'var(--color-surface-subtle)',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>

          {/* Description & Image */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
              Product Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide technical agronomic specifications, application dose, and manufacturer details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-surface-tint)',
                background: 'var(--color-surface-subtle)',
                fontSize: '13px',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Highlights & Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
                Key Highlights (Comma separated)
              </label>
              <input
                type="text"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-surface-tint)',
                  background: 'var(--color-surface-subtle)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
                Specifications (Key: Value per line)
              </label>
              <textarea
                rows={3}
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-surface-tint)',
                  background: 'var(--color-surface-subtle)',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              />
            </div>
          </div>

          {/* Footer Save Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              borderTop: '1px solid var(--color-surface-tint)',
              paddingTop: '20px',
              marginTop: '10px',
            }}
          >
            <Link
              href="/seller/products"
              style={{
                padding: '10px 18px',
                borderRadius: '6px',
                border: '1px solid var(--color-surface-tint)',
                background: 'var(--color-surface)',
                color: 'var(--color-slate)',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Cancel
            </Link>

            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--color-forest)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Save size={16} /> Save Product Listing
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
