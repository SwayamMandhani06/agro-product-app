'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import type { Product } from '@/types';
import { ProductImageResolver } from '@/lib/product-image-resolver';
import { useWishlistStore } from '@/features/wishlist/wishlist-store';
import { useCartStore } from '@/features/cart/store';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const isSaved = useWishlistStore((s) => s.isSaved(product.id));
  const toggleSaved = useWishlistStore((s) => s.toggleSaved);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = React.useState(false);

  const imageUrl = ProductImageResolver.resolve(product.category, product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(product.id);
  };

  if (compact) {
    return (
      <div
        className="card-base"
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          transition: 'transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard)',
        }}
      >
        <Link
          href={`/products/${product.id}`}
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1.2', background: 'var(--color-surface-variant)', overflow: 'hidden' }}>
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 220px"
              style={{ objectFit: 'cover' }}
            />
            <button
              onClick={handleToggleFavorite}
              title={isSaved ? 'Remove from saved' : 'Save product'}
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.92)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isSaved ? '#dc2626' : 'var(--color-text-secondary)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              }}
            >
              <Heart size={14} fill={isSaved ? '#dc2626' : 'none'} />
            </button>
          </div>

          <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <p style={{ fontSize: 11, color: 'var(--color-forest)', fontWeight: 600, margin: '0 0 2px' }}>
              {product.category}
            </p>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                margin: '0 0 6px',
                lineHeight: 1.35,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: 1,
              }}
            >
              {product.title}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-forest)' }}>
                ₹{product.price.toLocaleString()}
              </span>
              <button
                onClick={handleAddToCart}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-xs)',
                  background: added ? 'var(--color-success)' : 'var(--color-forest)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {added ? <Check size={12} /> : <ShoppingCart size={12} />}
                {added ? 'Added' : 'Add'}
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="card-base"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        transition: 'transform var(--motion-base) var(--ease-standard), box-shadow var(--motion-base) var(--ease-standard)',
      }}
    >
      <Link
        href={`/products/${product.id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1.25', background: 'var(--color-surface-variant)', overflow: 'hidden' }}>
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
            style={{ objectFit: 'cover' }}
          />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 6 }}>
            {product.category && (
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(11, 61, 46, 0.88)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  backdropFilter: 'blur(4px)',
                }}
              >
                {product.category}
              </span>
            )}
            {!product.inStock && (
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(183, 43, 43, 0.90)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                Out of Stock
              </span>
            )}
          </div>

          {/* Favorite heart */}
          <button
            onClick={handleToggleFavorite}
            title={isSaved ? 'Remove from saved' : 'Save product'}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.92)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isSaved ? '#dc2626' : 'var(--color-text-secondary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              transition: 'transform var(--motion-fast) var(--ease-standard)',
            }}
          >
            <Heart size={16} fill={isSaved ? '#dc2626' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, color: 'var(--color-amber)' }}>
              <Star size={13} fill="currentColor" />
              {product.rating ?? 4.8}
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
              ({product.reviewCount ?? 12})
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginLeft: 'auto' }}>
              {product.sellerName ?? 'AgriTrade Verified'}
            </span>
          </div>

          <h3
            style={{
              fontSize: 14.5,
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              margin: '0 0 10px',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {product.title}
          </h3>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-forest)', letterSpacing: '-0.3px' }}>
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
            <span style={{ fontSize: 11.5, color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>
              / {product.unit}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            style={{
              width: '100%',
              padding: '9px 14px',
              borderRadius: 'var(--radius-sm)',
              background: added
                ? 'var(--color-success)'
                : product.inStock
                ? 'var(--color-forest)'
                : 'var(--color-surface-variant)',
              color: product.inStock ? '#fff' : 'var(--color-text-tertiary)',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: product.inStock ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              transition: 'background var(--motion-fast) var(--ease-standard)',
            }}
          >
            {added ? <Check size={15} /> : <ShoppingCart size={15} />}
            {added ? 'Added to Cart' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </Link>
    </div>
  );
}
