// ============================================================
// LOGISTICS & SHIPMENT DOMAIN ENTITIES
// Platform-neutral contracts shared across Web and Mobile
// ============================================================

import type { OrderStatus } from '@/types';

export type ShipmentStatus =
  | 'created'
  | 'pickupScheduled'
  | 'pickedUp'
  | 'processing'
  | 'inTransit'
  | 'atRegionalHub'
  | 'outForDelivery'
  | 'delivered'
  | 'deliveryAttempted'
  | 'cancelled'
  | 'returned';

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  carrier: string;
  vehicleType: string;
  vehicleNumber: string;
  rating: number;
}

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  location: string;
  description: string;
  eventTime: string;
}

export interface DeliveryAttempt {
  id: string;
  shipmentId: string;
  attemptNumber: number;
  status: 'failed' | 'rescheduled' | 'delivered';
  reason:
    | 'customer_unavailable'
    | 'address_clarification_required'
    | 'weather_delay'
    | 'route_delay'
    | 'security_gate_locked';
  notes?: string;
  attemptedAt: string;
  nextAttemptDate?: string;
}

export interface EstimatedDeliveryWindow {
  start: string;
  end: string;
  serviceZone: string;
  ruralConfidenceScore: number; // e.g. 96 (%)
  advisory?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  userId: string;
  provider: string; // 'demo_logistics' | 'delhivery_rural' | 'shiprocket'
  trackingNumber: string;
  status: ShipmentStatus;
  originLocation: string;
  destinationLocation: string;
  currentLocation: string;
  estimatedDeliveryStart: string;
  estimatedDeliveryEnd: string;
  deliveryAgent?: DeliveryAgent;
  serviceZone: string; // e.g. 'Rural Priority Route', 'Intra-District Tier 2'
  distanceBand: string; // e.g. '145 km', 'Zone B (100–250 km)'
  attempts: DeliveryAttempt[];
  events: TrackingEvent[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
  created: 'Shipment Created',
  pickupScheduled: 'Pickup Scheduled',
  pickedUp: 'Package Picked Up',
  processing: 'Hub Processing',
  inTransit: 'In Transit',
  atRegionalHub: 'At Regional Sorting Hub',
  outForDelivery: 'Out for Delivery',
  delivered: 'Consignment Delivered',
  deliveryAttempted: 'Delivery Attempted',
  cancelled: 'Shipment Cancelled',
  returned: 'Returned to Origin',
};

export const SHIPMENT_STATUS_COLORS: Record<ShipmentStatus, { bg: string; color: string }> = {
  created: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
  pickupScheduled: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
  pickedUp: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
  processing: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  inTransit: { bg: 'var(--color-amber-50)', color: 'var(--color-amber-600)' },
  atRegionalHub: { bg: 'var(--color-amber-50)', color: 'var(--color-amber-600)' },
  outForDelivery: { bg: 'var(--color-amber-50)', color: 'var(--color-amber-600)' },
  delivered: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  deliveryAttempted: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  cancelled: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
  returned: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

/**
 * Sequential linear progression of canonical logistics milestones for UI rendering
 */
export const SHIPMENT_PROGRESSION_STEPS: ShipmentStatus[] = [
  'created',
  'pickedUp',
  'processing',
  'inTransit',
  'atRegionalHub',
  'outForDelivery',
  'delivered',
];

/**
 * Maps a granular ShipmentStatus into the high-level backward-compatible OrderStatus
 */
export function shipmentStatusToOrderStatus(status: ShipmentStatus): OrderStatus {
  switch (status) {
    case 'created':
    case 'pickupScheduled':
      return 'confirmed';
    case 'pickedUp':
    case 'processing':
      return 'processing';
    case 'inTransit':
    case 'atRegionalHub':
      return 'shipped';
    case 'outForDelivery':
    case 'deliveryAttempted':
      return 'outForDelivery';
    case 'delivered':
      return 'delivered';
    case 'cancelled':
    case 'returned':
      return 'cancelled';
    default:
      return 'confirmed';
  }
}
