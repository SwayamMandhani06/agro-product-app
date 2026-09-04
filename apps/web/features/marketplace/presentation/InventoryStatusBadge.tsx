import React from 'react';
import type { ListingStatus } from '../domain/inventory';

interface Props {
  status?: ListingStatus;
  stockHealth?: 'healthy' | 'low_stock' | 'out_of_stock';
  stockQuantity?: number;
  reorderLevel?: number;
}

export function InventoryStatusBadge({ status, stockHealth, stockQuantity, reorderLevel }: Props) {
  if (stockHealth) {
    if (stockHealth === 'out_of_stock') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '4px',
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #FECACA',
          }}
        >
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#DC2626' }} />
          Out of Stock (0)
        </span>
      );
    }
    if (stockHealth === 'low_stock') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '4px',
            background: '#FEF3C7',
            color: '#92400E',
            border: '1px solid #FDE68A',
          }}
        >
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#D97706' }} />
          Low Stock ({stockQuantity} / {reorderLevel})
        </span>
      );
    }
    return (
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
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#027A38' }} />
        In Stock ({stockQuantity})
      </span>
    );
  }

  // Listing status badge
  const configs: Record<ListingStatus, { bg: string; text: string; border: string; label: string }> = {
    active: { bg: '#EAF6EF', text: '#01421E', border: '#CEEAD9', label: 'Active Listing' },
    draft: { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB', label: 'Draft' },
    paused: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: 'Paused' },
    out_of_stock: { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', label: 'Depleted' },
    archived: { bg: '#F4ECE8', text: '#7A6E63', border: '#DDD6D0', label: 'Archived' },
  };

  const c = configs[status || 'active'];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: '4px',
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
      }}
    >
      {c.label}
    </span>
  );
}
