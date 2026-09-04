// ============================================================
// DEMO LOGISTICS PROVIDER
// High-fidelity, zero-cost deterministic logistics simulator
// ============================================================

import type { Order } from '@/types';
import type {
  Shipment,
  ShipmentStatus,
  TrackingEvent,
  DeliveryAgent,
  DeliveryAttempt,
} from '../domain/shipment';
import type { LogisticsProvider } from '../domain/logistics-provider';

export const DEMO_AGENTS: DeliveryAgent[] = [
  {
    id: 'agt_pune_01',
    name: 'Rahul Shinde',
    phone: '+91 98230 11234',
    carrier: 'Delhivery Rural Express',
    vehicleType: 'Three-Wheeler Cargo EV',
    vehicleNumber: 'MH-12-TR-4921',
    rating: 4.9,
  },
  {
    id: 'agt_baramati_02',
    name: 'Vikram Deshmukh',
    phone: '+91 97654 22345',
    carrier: 'AgriExpress Freight',
    vehicleType: 'Tata Ace Gold EV',
    vehicleNumber: 'MH-42-AQ-8890',
    rating: 4.8,
  },
];

export const INITIAL_MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-1001',
    orderId: 'ORD-1001',
    userId: 'usr_default',
    provider: 'delhivery_rural',
    trackingNumber: 'AGRI-EXP-88921-IN',
    status: 'inTransit',
    originLocation: 'AgriTrade Central Warehouse, Pune, MH',
    destinationLocation: 'Survey No. 42, Farm House, Haveli Road, Pune 412207',
    currentLocation: 'Hadapsar Regional Sorting Hub (Bay 4)',
    estimatedDeliveryStart: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    estimatedDeliveryEnd: new Date(Date.now() + 172800000).toISOString(),   // 2 days
    serviceZone: 'Rural Priority Route',
    distanceBand: '45 km (Intra-District)',
    deliveryAgent: DEMO_AGENTS[0],
    attempts: [],
    events: [
      {
        id: 'evt_101',
        shipmentId: 'SHP-1001',
        status: 'created',
        location: 'AgriTrade Fulfillment Platform, Pune',
        description: 'Consignment manifest generated. Waybill AGRI-EXP-88921-IN registered with carrier.',
        eventTime: new Date(Date.now() - 36000000).toISOString(),
      },
      {
        id: 'evt_102',
        shipmentId: 'SHP-1001',
        status: 'pickedUp',
        location: 'Pune Central Warehouse (Sector 9)',
        description: 'Consignment bagged, seed germination seals verified, and loaded onto feeder EV.',
        eventTime: new Date(Date.now() - 25200000).toISOString(),
      },
      {
        id: 'evt_103',
        shipmentId: 'SHP-1001',
        status: 'inTransit',
        location: 'Hadapsar Regional Sorting Hub',
        description: 'Arrived at sorting facility. Scanned into outbound rural line-haul convoy.',
        eventTime: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 36000000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'SHP-1002',
    orderId: 'ORD-1002',
    userId: 'usr_default',
    provider: 'demo_logistics',
    trackingNumber: 'AGRI-EXP-44102-IN',
    status: 'outForDelivery',
    originLocation: 'Maharashtra Krishi Kendra Hub, Nashik',
    destinationLocation: 'Survey No. 42, Farm House, Haveli Road, Pune 412207',
    currentLocation: 'Wagholi Rural Distribution Center',
    estimatedDeliveryStart: new Date().toISOString(),
    estimatedDeliveryEnd: new Date(Date.now() + 14400000).toISOString(),
    serviceZone: 'Inter-District Agri-Corridor',
    distanceBand: '185 km',
    deliveryAgent: DEMO_AGENTS[0],
    attempts: [],
    events: [
      {
        id: 'evt_201',
        shipmentId: 'SHP-1002',
        status: 'created',
        location: 'Nashik Agro Terminal',
        description: 'Electronic order manifest created.',
        eventTime: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'evt_202',
        shipmentId: 'SHP-1002',
        status: 'pickedUp',
        location: 'Nashik Central Depot',
        description: 'Loaded into refrigerated inter-city transport.',
        eventTime: new Date(Date.now() - 72000000).toISOString(),
      },
      {
        id: 'evt_203',
        shipmentId: 'SHP-1002',
        status: 'inTransit',
        location: 'Pune Regional Hub',
        description: 'Received at regional distribution center.',
        eventTime: new Date(Date.now() - 28800000).toISOString(),
      },
      {
        id: 'evt_204',
        shipmentId: 'SHP-1002',
        status: 'outForDelivery',
        location: 'Wagholi Rural Distribution Center',
        description: 'Dispatched for doorstep farm gate delivery with agent Rahul Shinde.',
        eventTime: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'SHP-1003',
    orderId: 'ORD-1003',
    userId: 'usr_default',
    provider: 'delhivery_rural',
    trackingNumber: 'AGRI-EXP-11294-IN',
    status: 'delivered',
    originLocation: 'Pune Central Fulfillment Warehouse',
    destinationLocation: 'Survey No. 42, Farm House, Haveli Road, Pune 412207',
    currentLocation: 'Farm Gate (Delivered)',
    estimatedDeliveryStart: new Date(Date.now() - 432000000).toISOString(),
    estimatedDeliveryEnd: new Date(Date.now() - 345600000).toISOString(),
    serviceZone: 'Rural Priority Route',
    distanceBand: '45 km',
    deliveryAgent: DEMO_AGENTS[1],
    attempts: [],
    events: [
      {
        id: 'evt_301',
        shipmentId: 'SHP-1003',
        status: 'created',
        location: 'Pune Central Warehouse',
        description: 'Order registered for courier pickup.',
        eventTime: new Date(Date.now() - 432000000).toISOString(),
      },
      {
        id: 'evt_302',
        shipmentId: 'SHP-1003',
        status: 'pickedUp',
        location: 'Pune Logistics Hub',
        description: 'Picked up by carrier vehicle.',
        eventTime: new Date(Date.now() - 388800000).toISOString(),
      },
      {
        id: 'evt_303',
        shipmentId: 'SHP-1003',
        status: 'outForDelivery',
        location: 'Haveli Local Outpost',
        description: 'Out for final delivery.',
        eventTime: new Date(Date.now() - 360000000).toISOString(),
      },
      {
        id: 'evt_304',
        shipmentId: 'SHP-1003',
        status: 'delivered',
        location: 'Registered Farm Address',
        description: 'Consignment signed and handed over to recipient.',
        eventTime: new Date(Date.now() - 345600000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

export class DemoLogisticsProvider implements LogisticsProvider {
  readonly providerId = 'demo_logistics';
  readonly displayName = 'AgriTrade Rural Express (Demo)';

  private shipments: Map<string, Shipment> = new Map();

  constructor() {
    INITIAL_MOCK_SHIPMENTS.forEach((s) => {
      this.shipments.set(s.id, { ...s });
      this.shipments.set(s.orderId, { ...s });
    });
  }

  async createShipment(order: Order): Promise<Shipment> {
    const shipmentId = `SHP-${order.id.replace('ORD-', '')}`;
    const trackingNumber = `AGRI-EXP-${Math.floor(10000 + Math.random() * 90000)}-IN`;
    const now = new Date().toISOString();

    const newShipment: Shipment = {
      id: shipmentId,
      orderId: order.id,
      userId: 'usr_default',
      provider: 'demo_logistics',
      trackingNumber,
      status: 'created',
      originLocation: 'AgriTrade Central Fulfillment Warehouse, Pune',
      destinationLocation: `${order.address.addressLine}, ${order.address.city}, ${order.address.state} ${order.address.pincode}`,
      currentLocation: 'Pune Central Fulfillment Warehouse',
      estimatedDeliveryStart: new Date(Date.now() + 86400000).toISOString(),
      estimatedDeliveryEnd: new Date(Date.now() + 259200000).toISOString(),
      serviceZone: 'Rural Priority Route',
      distanceBand: '100–250 km',
      deliveryAgent: DEMO_AGENTS[0],
      attempts: [],
      events: [
        {
          id: `evt_${Date.now()}`,
          shipmentId,
          status: 'created',
          location: 'Pune Central Fulfillment Hub',
          description: `Consignment created for Order #${order.id}. Waybill ${trackingNumber} registered with Delhivery Rural Express.`,
          eventTime: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.shipments.set(shipmentId, newShipment);
    this.shipments.set(order.id, newShipment);
    return newShipment;
  }

  async getShipment(shipmentId: string): Promise<Shipment | null> {
    return this.shipments.get(shipmentId) || null;
  }

  async getShipmentByOrderId(orderId: string): Promise<Shipment | null> {
    return this.shipments.get(orderId) || null;
  }

  async advanceMilestone(shipmentId: string): Promise<Shipment | null> {
    const shipment = this.shipments.get(shipmentId);
    if (!shipment || shipment.status === 'delivered' || shipment.status === 'cancelled') {
      return null;
    }

    const milestoneOrder: ShipmentStatus[] = [
      'created',
      'pickedUp',
      'processing',
      'inTransit',
      'atRegionalHub',
      'outForDelivery',
      'delivered',
    ];

    const currentIdx = milestoneOrder.indexOf(shipment.status);
    const nextStatus: ShipmentStatus =
      currentIdx >= 0 && currentIdx < milestoneOrder.length - 1
        ? milestoneOrder[currentIdx + 1]
        : 'delivered';

    const locationMap: Record<ShipmentStatus, string> = {
      created: 'Pune Central Warehouse',
      pickupScheduled: 'Pune Central Warehouse',
      pickedUp: 'Outbound Bay, Pune Fulfillment Hub',
      processing: 'Pune Fulfillment Sorting Facility',
      inTransit: 'Hadapsar Regional Transit Corridor',
      atRegionalHub: 'Baramati Regional Agro-Hub (Sector 2)',
      outForDelivery: 'Baramati Rural Feeder Vehicle',
      delivered: 'Farm Gate (Delivered)',
      deliveryAttempted: 'Baramati Rural Feeder Vehicle',
      cancelled: 'Shipment Depot',
      returned: 'Pune Central Warehouse',
    };

    const descriptionMap: Record<ShipmentStatus, string> = {
      created: 'Shipment manifest registered.',
      pickupScheduled: 'Pickup scheduled with logistics courier partner.',
      pickedUp: 'Consignment collected from seller warehouse by rural line-haul feeder.',
      processing: 'Passed botanical and seed packaging inspection at regional facility.',
      inTransit: 'Consignment moving through central agricultural logistics highway.',
      atRegionalHub: 'Arrived at district sorting center. Package sorted for last-mile route.',
      outForDelivery: 'Dispatched with delivery partner Rahul Shinde for doorstep farm delivery.',
      delivered: 'Consignment delivered successfully and accepted at farm gate.',
      deliveryAttempted: 'Delivery attempted but farm gate was closed. Re-scheduled.',
      cancelled: 'Shipment cancelled upon customer or merchant request.',
      returned: 'Consignment returned to central warehouse origin.',
    };

    const now = new Date().toISOString();
    const newEvent: TrackingEvent = {
      id: `evt_${Date.now()}`,
      shipmentId: shipment.id,
      status: nextStatus,
      location: locationMap[nextStatus],
      description: descriptionMap[nextStatus],
      eventTime: now,
    };

    const updatedShipment: Shipment = {
      ...shipment,
      status: nextStatus,
      currentLocation: locationMap[nextStatus],
      events: [...shipment.events, newEvent],
      updatedAt: now,
    };

    this.shipments.set(shipment.id, updatedShipment);
    this.shipments.set(shipment.orderId, updatedShipment);
    return updatedShipment;
  }

  async simulateException(
    shipmentId: string,
    reason: 'weather_delay' | 'route_delay' | 'address_clarification_required'
  ): Promise<Shipment | null> {
    const shipment = this.shipments.get(shipmentId);
    if (!shipment) return null;

    const reasonText: Record<string, string> = {
      weather_delay: 'Heavy unseasonal monsoon rainfall along rural access highway. Transit delay of 4–6 hours anticipated.',
      route_delay: 'Agricultural market road diversion near Baramati APMC. Driver taking alternative bypass route.',
      address_clarification_required: 'Rural survey number requires landmark clarification. Driver dispatching verification request.',
    };

    const now = new Date().toISOString();
    const newEvent: TrackingEvent = {
      id: `evt_${Date.now()}`,
      shipmentId: shipment.id,
      status: shipment.status,
      location: shipment.currentLocation,
      description: reasonText[reason] || 'Transit exception reported by carrier.',
      eventTime: now,
    };

    const updatedShipment: Shipment = {
      ...shipment,
      events: [...shipment.events, newEvent],
      updatedAt: now,
    };

    this.shipments.set(shipment.id, updatedShipment);
    this.shipments.set(shipment.orderId, updatedShipment);
    return updatedShipment;
  }

  async recordDeliveryAttempt(
    shipmentId: string,
    reason: 'customer_unavailable' | 'security_gate_locked' | 'weather_delay'
  ): Promise<Shipment | null> {
    const shipment = this.shipments.get(shipmentId);
    if (!shipment) return null;

    const reasonDescription: Record<string, string> = {
      customer_unavailable: 'Delivery partner arrived at farm premises. Recipient contact phone was unreachable.',
      security_gate_locked: 'Field entry gate was locked with no attendee present on site.',
      weather_delay: 'Torrential rain prevented safe unloading of certified moisture-sensitive seed sacks.',
    };

    const now = new Date().toISOString();
    const nextAttempt = new Date(Date.now() + 86400000).toISOString();

    const attempt: DeliveryAttempt = {
      id: `att_${Date.now()}`,
      shipmentId: shipment.id,
      attemptNumber: shipment.attempts.length + 1,
      status: 'failed',
      reason,
      notes: reasonDescription[reason],
      attemptedAt: now,
      nextAttemptDate: nextAttempt,
    };

    const newEvent: TrackingEvent = {
      id: `evt_${Date.now()}`,
      shipmentId: shipment.id,
      status: 'deliveryAttempted',
      location: shipment.currentLocation,
      description: `Delivery Attempt #${attempt.attemptNumber} Exception: ${reasonDescription[reason]} Next attempt scheduled for tomorrow morning.`,
      eventTime: now,
    };

    const updatedShipment: Shipment = {
      ...shipment,
      status: 'deliveryAttempted',
      attempts: [...shipment.attempts, attempt],
      events: [...shipment.events, newEvent],
      updatedAt: now,
    };

    this.shipments.set(shipment.id, updatedShipment);
    this.shipments.set(shipment.orderId, updatedShipment);
    return updatedShipment;
  }

  async completeDelivery(shipmentId: string): Promise<Shipment | null> {
    const shipment = this.shipments.get(shipmentId);
    if (!shipment) return null;

    const now = new Date().toISOString();
    const newEvent: TrackingEvent = {
      id: `evt_${Date.now()}`,
      shipmentId: shipment.id,
      status: 'delivered',
      location: shipment.destinationLocation,
      description: 'Consignment signed and accepted at farm gate premises.',
      eventTime: now,
    };

    const updatedShipment: Shipment = {
      ...shipment,
      status: 'delivered',
      currentLocation: 'Farm Gate (Delivered)',
      events: [...shipment.events, newEvent],
      updatedAt: now,
    };

    this.shipments.set(shipment.id, updatedShipment);
    this.shipments.set(shipment.orderId, updatedShipment);
    return updatedShipment;
  }
}
