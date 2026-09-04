'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useMarketplaceStore } from '@/features/marketplace/marketplace-store';
import { SellerPortalNav } from '@/features/marketplace/presentation/SellerPortalNav';
import type { ListingStatus, SellerInventoryItem } from '@/features/marketplace/domain/inventory';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

function EditForm({ item }: { item: SellerInventoryItem }) {
  const router = useRouter();
  const { updateInventoryItem } = useMarketplaceStore();

  const [title, setTitle] = useState(item.productTitle);
  const [category, setCategory] = useState(item.category);
  const [sku] = useState(item.sku);
  const [price, setPrice] = useState<number>(item.price);
  const [mrp, setMrp] = useState<number>(item.mrp);
  const [stockQuantity, setStockQuantity] = useState<number>(item.stockQuantity);
  const [reorderLevel, setReorderLevel] = useState<number>(item.reorderLevel);
  const [moq, setMoq] = useState<number>(item.minimumOrderQuantity);
  const [unit, setUnit] = useState(item.unit);
  const [listingStatus, setListingStatus] = useState<ListingStatus>(item.listingStatus);
  const [highlights, setHighlights] = useState(item.highlights?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateInventoryItem(item.id, {
      productTitle: title.trim(),
      category,
      price,
      mrp,
      stockQuantity,
      reorderLevel,
      minimumOrderQuantity: moq,
      unit,
      listingStatus,
      highlights: highlights.split(',').map((h) => h.trim()).filter(Boolean),
    });
    router.push('/seller/products');
  };

  return (
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
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
            Product Title *
          </label>
          <input
            type="text"
            required
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
            SKU (Immutable)
          </label>
          <input
            type="text"
            disabled
            value={sku}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-surface-tint)',
              background: 'var(--color-surface-muted)',
              fontSize: '13px',
              fontFamily: 'monospace',
              color: 'var(--color-neutral-600)',
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
            <option value="out_of_stock">Out of Stock</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: '6px' }}>
            Reorder Level
          </label>
          <input
            type="number"
            min="1"
            value={reorderLevel}
            onChange={(e) => setReorderLevel(Number(e.target.value))}
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
            Minimum Order Quantity (MOQ)
          </label>
          <input
            type="number"
            min="1"
            value={moq}
            onChange={(e) => setMoq(Number(e.target.value))}
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--color-surface-tint)',
          paddingTop: '20px',
          marginTop: '10px',
        }}
      >
        <button
          type="button"
          onClick={() => {
            updateInventoryItem(item.id, { listingStatus: 'archived' });
            router.push('/seller/products');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1px solid #FECACA',
            background: '#FFF1F2',
            color: '#9F1239',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Trash2 size={14} /> Archive Listing
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
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
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}

export default function EditProductPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const { inventory } = useMarketplaceStore();
  const item = inventory.find((i) => i.id === id);

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
        <SellerPortalNav />
        <main style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-neutral-600)' }}>Product not found in seller inventory.</p>
          <Link href="/seller/products" style={{ color: 'var(--color-forest)', fontWeight: 600 }}>
            Return to Product Catalog
          </Link>
        </main>
      </div>
    );
  }

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
            Edit Listing: {item.sku}
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
            Update commercial pricing, buffer reserves, or listing availability
          </span>
        </div>

        <EditForm item={item} />
      </main>
    </div>
  );
}
