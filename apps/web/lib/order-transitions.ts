// ============================================================
// AGRITRADE CANONICAL ORDER TRANSITION VALIDATION LAYER
// Stage 12: Production Readiness & Hardening
// ============================================================

import { OrderStatus } from '../types';

/**
 * Normalizes snake_case / camelCase aliases to canonical keys.
 */
export function normalizeOrderStatus(status: OrderStatus | string): OrderStatus {
  if (status === 'out_for_delivery') return 'outForDelivery';
  return status as OrderStatus;
}

/**
 * Valid state transitions for orders across AgriTrade.
 * Enforces sequential forward milestones and controlled cancellation / refund / dispute branches.
 */
export const ALLOWED_ORDER_TRANSITIONS: Record<string, OrderStatus[]> = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['packed', 'shipped', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['outForDelivery', 'delivered'],
  outForDelivery: ['delivered', 'shipped'], // 'shipped' allowed for delivery failure reschedule
  delivered: ['refund_requested', 'disputed'],
  refund_requested: ['refund_processing', 'disputed', 'delivered'],
  disputed: ['refund_processing', 'delivered'],
  refund_processing: ['refunded'],
  refunded: [],
  cancelled: [],
};

/**
 * Returns true if the requested status transition is allowed under canonical lifecycle rules.
 */
export function isValidOrderTransition(from: OrderStatus | string, to: OrderStatus | string): boolean {
  const normFrom = normalizeOrderStatus(from);
  const normTo = normalizeOrderStatus(to);

  // Identity transition is considered valid (no-op)
  if (normFrom === normTo) return true;

  const allowed = ALLOWED_ORDER_TRANSITIONS[normFrom];
  if (!allowed) return false;

  return allowed.includes(normTo) || (normTo === 'outForDelivery' && allowed.includes('out_for_delivery' as OrderStatus));
}

/**
 * Returns the list of valid next statuses from the current order status.
 */
export function getNextAllowedOrderTransitions(current: OrderStatus | string): OrderStatus[] {
  const norm = normalizeOrderStatus(current);
  return ALLOWED_ORDER_TRANSITIONS[norm] ? [...ALLOWED_ORDER_TRANSITIONS[norm]] : [];
}

/**
 * Checks if the order is in a terminal state (no further transitions allowed).
 */
export function isTerminalOrderStatus(status: OrderStatus | string): boolean {
  const norm = normalizeOrderStatus(status);
  return norm === 'delivered' || norm === 'refunded' || norm === 'cancelled';
}

/**
 * Human-friendly metadata for each order status.
 */
export interface OrderStatusMeta {
  label: string;
  description: string;
  badgeClass: string;
  isTerminal: boolean;
  isActive: boolean;
}

export const ORDER_STATUS_METADATA: Record<string, OrderStatusMeta> = {
  placed: {
    label: 'Order Placed',
    description: 'Order received and awaiting seller confirmation.',
    badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
    isTerminal: false,
    isActive: true,
  },
  confirmed: {
    label: 'Confirmed',
    description: 'Order confirmed by seller; preparing fulfillment.',
    badgeClass: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    isTerminal: false,
    isActive: true,
  },
  processing: {
    label: 'Processing',
    description: 'Order is being assembled and packaged at the hub.',
    badgeClass: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400',
    isTerminal: false,
    isActive: true,
  },
  packed: {
    label: 'Packed',
    description: 'Consignment packaged, sealed, and ready for carrier pickup.',
    badgeClass: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400',
    isTerminal: false,
    isActive: true,
  },
  shipped: {
    label: 'Shipped',
    description: 'Dispatched via rural logistics corridor.',
    badgeClass: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
    isTerminal: false,
    isActive: true,
  },
  outForDelivery: {
    label: 'Out for Delivery',
    description: 'Assigned to rural delivery partner for last-mile drop.',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
    isTerminal: false,
    isActive: true,
  },
  delivered: {
    label: 'Delivered',
    description: 'Consignment successfully delivered and verified.',
    badgeClass: 'bg-emerald-600/15 text-emerald-700 border-emerald-600/30 dark:text-emerald-300',
    isTerminal: true,
    isActive: false,
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Order was cancelled and processing halted.',
    badgeClass: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
    isTerminal: true,
    isActive: false,
  },
  refund_requested: {
    label: 'Refund Requested',
    description: 'Buyer has requested a return or refund for this order.',
    badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
    isTerminal: false,
    isActive: false,
  },
  refund_processing: {
    label: 'Refund Processing',
    description: 'Refund approved by seller/admin; funds are in transit.',
    badgeClass: 'bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400',
    isTerminal: false,
    isActive: false,
  },
  refunded: {
    label: 'Refunded',
    description: 'Full refund credited to customer original payment source.',
    badgeClass: 'bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400',
    isTerminal: true,
    isActive: false,
  },
  disputed: {
    label: 'Disputed',
    description: 'Order flagged for administrative dispute resolution.',
    badgeClass: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400',
    isTerminal: false,
    isActive: false,
  },
};

export function getOrderStatusMeta(status: OrderStatus | string): OrderStatusMeta {
  const norm = normalizeOrderStatus(status);
  return (
    ORDER_STATUS_METADATA[norm] || {
      label: String(status),
      description: '',
      badgeClass: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
      isTerminal: false,
      isActive: false,
    }
  );
}
