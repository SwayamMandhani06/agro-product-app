// ============================================================
// LOGISTICS PROVIDER INTERFACE
// Contract for courier providers (Demo, Delhivery, Shiprocket)
// ============================================================

import type { Order } from '@/types';
import type { Shipment } from './shipment';

export interface LogisticsProvider {
  /**
   * Provider identifier (e.g. 'demo_logistics', 'delhivery_rural', 'shiprocket')
   */
  readonly providerId: string;

  /**
   * Display name of the logistics provider
   */
  readonly displayName: string;

  /**
   * Initiates shipment creation for a newly confirmed order
   */
  createShipment(order: Order): Promise<Shipment>;

  /**
   * Fetches shipment by shipment ID
   */
  getShipment(shipmentId: string): Promise<Shipment | null>;

  /**
   * Fetches shipment associated with an order
   */
  getShipmentByOrderId(orderId: string): Promise<Shipment | null>;

  /**
   * Advances the shipment to the next sequential logistics milestone
   */
  advanceMilestone(shipmentId: string): Promise<Shipment | null>;

  /**
   * Simulates an unexpected in-transit logistics exception or delay
   */
  simulateException(
    shipmentId: string,
    reason: 'weather_delay' | 'route_delay' | 'address_clarification_required'
  ): Promise<Shipment | null>;

  /**
   * Records a delivery attempt event
   */
  recordDeliveryAttempt(
    shipmentId: string,
    reason: 'customer_unavailable' | 'security_gate_locked' | 'weather_delay'
  ): Promise<Shipment | null>;

  /**
   * Marks consignment as successfully delivered
   */
  completeDelivery(shipmentId: string): Promise<Shipment | null>;
}
