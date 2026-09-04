'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMarketplaceStore } from '@/features/marketplace/marketplace-store';
import { useCartStore } from '@/features/cart/store';
import { InventoryStatusBadge } from '@/features/marketplace/presentation/InventoryStatusBadge';
import { computeStockHealth } from '@/features/marketplace/domain/inventory';
import {
  ShieldCheck,
  MapPin,
  Clock,
  ArrowLeft,
  ShoppingCart,
  Check,
} from 'lucide-react';

export default function PublicSellerProfilePage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const { sellerProfiles, inventory } = useMarketplaceStore();
  const addItem = useCartStore((s) => s.addItem);
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const seller = sellerProfiles.find((s) => s.id === id) || sellerProfiles[0];
  const sellerProducts = inventory.filter((item) => item.sellerId === seller.id && item.listingStatus === 'active');

  const handleAddToCart = (item: (typeof inventory)[0]) => {
    addItem({
      id: item.productId,
      title: item.productTitle,
      price: item.price,
      originalPrice: item.mrp,
      unit: item.unit,
      imageUrl: item.imageUrl,
      category: item.category,
      sellerName: seller.businessName,
      inStock: item.stockQuantity > 0,
      isFavorite: false,
      stockCount: item.stockQuantity,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', paddingBottom: '60px' }}>
      {/* Top Banner */}
      <header style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-surface-tint)', marginBottom: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 24px' }}>
          <Link
            href="/products"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-600)', textDecoration: 'none', marginBottom: '12px' }}
          >
            <ArrowLeft size={14} /> Back to Products Marketplace
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '10px',
                  background: 'var(--color-forest)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '24px',
                }}
              >
                {seller.businessName.charAt(0)}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--color-slate)' }}>
                    {seller.businessName}
                  </h1>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: '#EAF6EF',
                      color: '#01421E',
                      border: '1px solid #CEEAD9',
                    }}
                  >
                    <ShieldCheck size={14} color="#027A38" />
                    Verified Seller
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--color-neutral-600)', marginTop: '4px' }}>
                  Legal Entity: {seller.legalName}
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {seller.location}, {seller.state}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {seller.dispatchSlaHours}h Dispatch Guarantee
                  </span>
                  <span>•</span>
                  <span>GSTIN: {seller.gstNumber}</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-slate)' }}>
                ★ {seller.rating.toFixed(1)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                {seller.totalReviews} verified ratings
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        {/* Performance metrics banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '14px 18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
              On-Time Dispatch Rate
            </span>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-forest)', marginTop: '4px' }}>
              {seller.metrics?.onTimeDispatchRate ?? 98.6}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
              Measured across last 90 days
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '14px 18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
              Total Orders Fulfilled
            </span>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '4px' }}>
              {seller.metrics?.deliveredOrders ?? 142} Orders
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
              Rural village delivery coverage
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-surface-tint)', borderRadius: '8px', padding: '14px 18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-neutral-500)', textTransform: 'uppercase' }}>
              APMC Licensed Facility
            </span>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-slate)', marginTop: '4px' }}>
              Baramati Yard
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
              Audited storage conditions
            </div>
          </div>
        </div>

        {/* Product Catalog Section */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-slate)' }}>
              Verified Products Sold by {seller.businessName}
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              {sellerProducts.length} certified input listings available for direct dispatch
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {sellerProducts.map((item) => {
            const health = computeStockHealth(item);
            const isAdded = addedId === item.id;

            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-surface-tint)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div>
                  <div style={{ position: 'relative', width: '100%', height: '160px', background: 'var(--color-surface-subtle)' }}>
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.productTitle}
                        fill
                        sizes="260px"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>

                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-forest)', textTransform: 'uppercase' }}>
                        {item.category}
                      </span>
                      <InventoryStatusBadge stockHealth={health} stockQuantity={item.stockQuantity} reorderLevel={item.reorderLevel} />
                    </div>

                    <h3 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 600, color: 'var(--color-slate)', lineHeight: 1.3 }}>
                      {item.productTitle}
                    </h3>
                    <div style={{ fontSize: '11px', color: 'var(--color-neutral-500)', marginBottom: '12px' }}>
                      Unit: {item.unit} • SKU: {item.sku}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-slate)' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)', textDecoration: 'line-through' }}>
                        ₹{item.mrp.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0 16px 16px' }}>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.stockQuantity <= 0}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: isAdded ? '#027A38' : item.stockQuantity > 0 ? 'var(--color-forest)' : 'var(--color-neutral-300)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: item.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                      transition: 'background 120ms ease',
                    }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} /> Added to Cart
                      </>
                    ) : item.stockQuantity > 0 ? (
                      <>
                        <ShoppingCart size={14} /> Add to Cart
                      </>
                    ) : (
                      'Out of Stock'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
