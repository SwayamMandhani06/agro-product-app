import 'dart:math';
import '../../cart_checkout/domain/order.dart';
import '../domain/logistics_provider.dart';
import '../domain/shipment.dart';

class DemoLogisticsProvider implements LogisticsProvider {
  DemoLogisticsProvider() {
    _seedInitialShipments();
  }

  @override
  String get providerId => 'demo_logistics';

  @override
  String get displayName => 'AgriTrade Rural Express (Demo)';

  final Map<String, Shipment> _shipments = {};

  static const _agentRahul = DeliveryAgent(
    id: 'agt_pune_01',
    name: 'Rahul Shinde',
    phone: '+91 98230 11234',
    carrier: 'Delhivery Rural Express',
    vehicleType: 'Three-Wheeler Cargo EV',
    vehicleNumber: 'MH-12-TR-4921',
    rating: 4.9,
  );

  static const _agentVikram = DeliveryAgent(
    id: 'agt_baramati_02',
    name: 'Vikram Deshmukh',
    phone: '+91 97654 22345',
    carrier: 'AgriExpress Freight',
    vehicleType: 'Tata Ace Gold EV',
    vehicleNumber: 'MH-42-AQ-8890',
    rating: 4.8,
  );

  void _seedInitialShipments() {
    final now = DateTime.now();

    final s1 = Shipment(
      id: 'SHP-1001',
      orderId: 'ORD-1001',
      userId: 'usr_default',
      provider: 'delhivery_rural',
      trackingNumber: 'AGRI-EXP-88921-IN',
      status: ShipmentStatus.inTransit,
      originLocation: 'AgriTrade Central Warehouse, Pune',
      destinationLocation: 'Survey No. 42, Farm House, Haveli Road, Pune 412207',
      currentLocation: 'Hadapsar Regional Sorting Hub (Bay 4)',
      estimatedDeliveryStart: now.add(const Duration(days: 1)),
      estimatedDeliveryEnd: now.add(const Duration(days: 2)),
      serviceZone: 'Rural Priority Route',
      distanceBand: '45 km (Intra-District)',
      deliveryAgent: _agentRahul,
      createdAt: now.subtract(const Duration(hours: 10)),
      updatedAt: now.subtract(const Duration(hours: 2)),
      events: [
        TrackingEvent(
          id: 'evt_101',
          shipmentId: 'SHP-1001',
          status: ShipmentStatus.created,
          location: 'Pune Fulfillment Center',
          description: 'Consignment manifest generated. Waybill AGRI-EXP-88921-IN registered with carrier.',
          eventTime: now.subtract(const Duration(hours: 10)),
        ),
        TrackingEvent(
          id: 'evt_102',
          shipmentId: 'SHP-1001',
          status: ShipmentStatus.pickedUp,
          location: 'Pune Central Warehouse',
          description: 'Package picked up by Delhivery Rural feeder vehicle.',
          eventTime: now.subtract(const Duration(hours: 7)),
        ),
        TrackingEvent(
          id: 'evt_103',
          shipmentId: 'SHP-1001',
          status: ShipmentStatus.inTransit,
          location: 'Hadapsar Regional Sorting Hub',
          description: 'Consignment sorted into line-haul corridor dispatch bay.',
          eventTime: now.subtract(const Duration(hours: 2)),
        ),
      ],
    );

    final s2 = Shipment(
      id: 'SHP-1002',
      orderId: 'ORD-1002',
      userId: 'usr_default',
      provider: 'demo_logistics',
      trackingNumber: 'AGRI-EXP-44102-IN',
      status: ShipmentStatus.outForDelivery,
      originLocation: 'Maharashtra Krishi Kendra Hub, Nashik',
      destinationLocation: 'Survey No. 42, Farm House, Haveli Road, Pune 412207',
      currentLocation: 'Wagholi Rural Distribution Center',
      estimatedDeliveryStart: now,
      estimatedDeliveryEnd: now.add(const Duration(hours: 4)),
      serviceZone: 'Inter-District Agri-Corridor',
      distanceBand: '185 km',
      deliveryAgent: _agentVikram,
      createdAt: now.subtract(const Duration(hours: 24)),
      updatedAt: now.subtract(const Duration(hours: 1)),
      events: [
        TrackingEvent(
          id: 'evt_201',
          shipmentId: 'SHP-1002',
          status: ShipmentStatus.created,
          location: 'Nashik Agro Terminal',
          description: 'Electronic order manifest created.',
          eventTime: now.subtract(const Duration(hours: 24)),
        ),
      ],
    );

    _shipments[s1.id] = s1;
    _shipments[s1.orderId] = s1;
    _shipments[s2.id] = s2;
    _shipments[s2.orderId] = s2;
  }

  @override
  Future<Shipment> createShipment(Order order) async {
    final shipmentId = 'SHP-${order.id.replaceAll('ORD-', '')}';
    final randomDigits = 10000 + Random().nextInt(90000);
    final trackingNumber = 'AGRI-EXP-$randomDigits-IN';
    final now = DateTime.now();

    final newShipment = Shipment(
      id: shipmentId,
      orderId: order.id,
      userId: 'usr_default',
      provider: 'demo_logistics',
      trackingNumber: trackingNumber,
      status: ShipmentStatus.created,
      originLocation: 'AgriTrade Central Warehouse, Pune',
      destinationLocation: order.address.formattedAddress,
      currentLocation: 'Pune Fulfillment Warehouse',
      estimatedDeliveryStart: now.add(const Duration(days: 1)),
      estimatedDeliveryEnd: now.add(const Duration(days: 3)),
      serviceZone: 'Rural Priority Route',
      distanceBand: '100–250 km',
      deliveryAgent: _agentRahul,
      createdAt: now,
      updatedAt: now,
      events: [
        TrackingEvent(
          id: 'evt_${now.millisecondsSinceEpoch}',
          shipmentId: shipmentId,
          status: ShipmentStatus.created,
          location: 'Pune Central Warehouse',
          description: 'Shipment created for Order #${order.id}. Waybill registered with Delhivery Rural Express.',
          eventTime: now,
        ),
      ],
    );

    _shipments[shipmentId] = newShipment;
    _shipments[order.id] = newShipment;
    return newShipment;
  }

  @override
  Future<Shipment?> getShipment(String shipmentId) async {
    return _shipments[shipmentId];
  }

  @override
  Future<Shipment?> getShipmentByOrderId(String orderId) async {
    return _shipments[orderId];
  }

  @override
  Future<Shipment?> advanceMilestone(String shipmentId) async {
    final current = _shipments[shipmentId];
    if (current == null) return null;

    final progression = [
      ShipmentStatus.created,
      ShipmentStatus.pickedUp,
      ShipmentStatus.processing,
      ShipmentStatus.inTransit,
      ShipmentStatus.atRegionalHub,
      ShipmentStatus.outForDelivery,
      ShipmentStatus.delivered,
    ];

    final currentIndex = progression.indexOf(current.status);
    if (currentIndex == -1 || currentIndex >= progression.length - 1) {
      return current;
    }

    final nextStatus = progression[currentIndex + 1];
    final now = DateTime.now();

    String nextLocation = current.currentLocation;
    String description = 'Milestone reached: ${nextStatus.displayName}';

    switch (nextStatus) {
      case ShipmentStatus.pickedUp:
        nextLocation = 'Pune Central Depot (Gate 3)';
        description = 'Package collected and loaded into regional feeder transport.';
      case ShipmentStatus.processing:
        nextLocation = 'Hadapsar Sorting Hub (Bay 4)';
        description = 'Package weight verified and scheduled for line-haul dispatch.';
      case ShipmentStatus.inTransit:
        nextLocation = 'NH-48 Rural Highway Corridor';
        description = 'Dispatched from central hub in line-haul convoy.';
      case ShipmentStatus.atRegionalHub:
        nextLocation = 'Wagholi Rural Distribution Center';
        description = 'Arrived at local regional distribution outpost.';
      case ShipmentStatus.outForDelivery:
        nextLocation = 'Wagholi Delivery Sector 2';
        description = 'Out for final doorstep farm gate delivery with agent ${current.deliveryAgent?.name ?? "Rahul Shinde"}.';
      case ShipmentStatus.delivered:
        nextLocation = 'Registered Farm Gate';
        description = 'Consignment handed over and signed by recipient.';
      default:
        break;
    }

    final newEvent = TrackingEvent(
      id: 'evt_${now.millisecondsSinceEpoch}',
      shipmentId: current.id,
      status: nextStatus,
      location: nextLocation,
      description: description,
      eventTime: now,
    );

    final updated = current.copyWith(
      status: nextStatus,
      currentLocation: nextLocation,
      updatedAt: now,
      events: [...current.events, newEvent],
    );

    _shipments[current.id] = updated;
    _shipments[current.orderId] = updated;
    return updated;
  }

  @override
  Future<Shipment?> simulateException(String shipmentId, String reason) async {
    final current = _shipments[shipmentId];
    if (current == null) return null;

    final now = DateTime.now();
    final newEvent = TrackingEvent(
      id: 'evt_${now.millisecondsSinceEpoch}',
      shipmentId: current.id,
      status: current.status,
      location: current.currentLocation,
      description: 'Transit Advisory: Line-haul route delay due to unseasonal monsoon showers / road diversions ($reason).',
      eventTime: now,
    );

    final updated = current.copyWith(
      updatedAt: now,
      events: [...current.events, newEvent],
    );

    _shipments[current.id] = updated;
    _shipments[current.orderId] = updated;
    return updated;
  }

  @override
  Future<Shipment?> recordDeliveryAttempt(String shipmentId, String reason, [String? notes]) async {
    final current = _shipments[shipmentId];
    if (current == null) return null;

    final now = DateTime.now();
    final attemptNumber = current.attempts.length + 1;

    final attempt = DeliveryAttempt(
      id: 'att_${now.millisecondsSinceEpoch}',
      shipmentId: current.id,
      attemptNumber: attemptNumber,
      status: 'rescheduled',
      reason: reason,
      notes: notes ?? 'Customer unavailable at farm entrance. Delivery rescheduled for tomorrow morning.',
      attemptedAt: now,
      nextAttemptDate: now.add(const Duration(days: 1)),
    );

    final newEvent = TrackingEvent(
      id: 'evt_att_${now.millisecondsSinceEpoch}',
      shipmentId: current.id,
      status: ShipmentStatus.deliveryAttempted,
      location: current.currentLocation,
      description: 'Delivery attempt #$attemptNumber recorded: ${attempt.notes}',
      eventTime: now,
    );

    final updated = current.copyWith(
      status: ShipmentStatus.deliveryAttempted,
      updatedAt: now,
      attempts: [...current.attempts, attempt],
      events: [...current.events, newEvent],
    );

    _shipments[current.id] = updated;
    _shipments[current.orderId] = updated;
    return updated;
  }

  @override
  Future<Shipment?> completeDelivery(String shipmentId) async {
    final current = _shipments[shipmentId];
    if (current == null) return null;

    final now = DateTime.now();
    final newEvent = TrackingEvent(
      id: 'evt_del_${now.millisecondsSinceEpoch}',
      shipmentId: current.id,
      status: ShipmentStatus.delivered,
      location: 'Recipient Farm Gate',
      description: 'Consignment successfully delivered and confirmed.',
      eventTime: now,
    );

    final updated = current.copyWith(
      status: ShipmentStatus.delivered,
      currentLocation: 'Farm Gate (Delivered)',
      updatedAt: now,
      events: [...current.events, newEvent],
    );

    _shipments[current.id] = updated;
    _shipments[current.orderId] = updated;
    return updated;
  }
}
