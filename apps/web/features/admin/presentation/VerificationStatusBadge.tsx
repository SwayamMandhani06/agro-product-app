'use client';

import React from 'react';
import { SellerVerificationStatus, VERIFICATION_STATUS_LABELS } from '../domain/governance';

interface Props {
  status: SellerVerificationStatus;
}

export function VerificationStatusBadge({ status }: Props) {
  const getColors = () => {
    switch (status) {
      case 'verified':
        return { bg: '#EAF6EF', text: '#15803D', border: '#BBF7D0' };
      case 'under_review':
        return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' };
      case 'submitted':
        return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
      case 'rejected':
        return { bg: '#FEE2E2', text: '#B91C1C', border: '#FECACA' };
      case 'suspended':
        return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
      case 'draft':
      default:
        return { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' };
    }
  };

  const c = getColors();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {VERIFICATION_STATUS_LABELS[status] || status}
    </span>
  );
}
