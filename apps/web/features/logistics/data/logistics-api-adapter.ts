// ============================================================
// LOGISTICS API ADAPTER
// Boundary adapter for future third-party courier APIs (Shiprocket, Delhivery)
// Delegates seamlessly to DemoLogisticsProvider in free-tier / demo mode
// ============================================================

import type { Order } from '@/types';
import type { Shipment } from '../domain/shipment';
import type { LogisticsProvider } from '../domain/logistics-provider';
import { DemoLogisticsProvider } from './demo-logistics-provider';

export interface LogisticsAdapterConfig {
  mode: 'demo' | 'live';
  apiKey?: string;
  apiSecret?: string;
  endpointUrl?: string;
}

export class LogisticsApiAdapter implements LogisticsProvider {
  readonly providerId: string;
  readonly displayName: string;

  private activeProvider: LogisticsProvider;
  private config: LogisticsAdapterConfig;

  constructor(config: LogisticsAdapterConfig = { mode: 'demo' }) {
    this.config = config;
    if (config.mode === 'live' && config.apiKey) {
      // Future production courier integration boundary
      // Live courier client instantiation goes here
      this.providerId = 'delhivery_rural_live';
      this.displayName = 'Delhivery Rural Express (Production)';
      this.activeProvider = new DemoLogisticsProvider(); // Safe fallback during dev
    } else {
      this.providerId = 'demo_logistics';
      this.displayName = 'AgriTrade Rural Express (Demo)';
      this.activeProvider = new DemoLogisticsProvider();
    }
  }

  async createShipment(order: Order): Promise<Shipment> {
    return this.activeProvider.createShipment(order);
  }

  async getShipment(shipmentId: string): Promise<Shipment | null> {
    return this.activeProvider.getShipment(shipmentId);
  }

  async getShipmentByOrderId(orderId: string): Promise<Shipment | null> {
    return this.activeProvider.getShipmentByOrderId(orderId);
  }

  async advanceMilestone(shipmentId: string): Promise<Shipment | null> {
    return this.activeProvider.advanceMilestone(shipmentId);
  }

  async simulateException(
    shipmentId: string,
    reason: 'weather_delay' | 'route_delay' | 'address_clarification_required'
  ): Promise<Shipment | null> {
    return this.activeProvider.simulateException(shipmentId, reason);
  }

  async recordDeliveryAttempt(
    shipmentId: string,
    reason: 'customer_unavailable' | 'security_gate_locked' | 'weather_delay'
  ): Promise<Shipment | null> {
    return this.activeProvider.recordDeliveryAttempt(shipmentId, reason);
  }

  async completeDelivery(shipmentId: string): Promise<Shipment | null> {
    return this.activeProvider.completeDelivery(shipmentId);
  }
}
