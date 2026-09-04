import 'package:flutter/foundation.dart';
import '../../cart_checkout/domain/order.dart';

/// Granular shipment statuses for rural logistics and line-haul tracking
enum ShipmentStatus {
  created,
  pickupScheduled,
  pickedUp,
  processing,
  inTransit,
  atRegionalHub,
  outForDelivery,
  delivered,
  deliveryAttempted,
  cancelled,
  returned;

  String get displayName => switch (this) {
        ShipmentStatus.created => 'Shipment Created',
        ShipmentStatus.pickupScheduled => 'Pickup Scheduled',
        ShipmentStatus.pickedUp => 'Package Picked Up',
        ShipmentStatus.processing => 'Hub Processing',
        ShipmentStatus.inTransit => 'In Transit',
        ShipmentStatus.atRegionalHub => 'At Regional Sorting Hub',
        ShipmentStatus.outForDelivery => 'Out for Delivery',
        ShipmentStatus.delivered => 'Consignment Delivered',
        ShipmentStatus.deliveryAttempted => 'Delivery Attempted',
        ShipmentStatus.cancelled => 'Shipment Cancelled',
        ShipmentStatus.returned => 'Returned to Origin',
      };

  bool get isActive =>
      this != ShipmentStatus.delivered &&
      this != ShipmentStatus.cancelled &&
      this != ShipmentStatus.returned;

  /// Maps granular ShipmentStatus to backward-compatible OrderStatus
  OrderStatus toOrderStatus() {
    switch (this) {
      case ShipmentStatus.created:
      case ShipmentStatus.pickupScheduled:
        return OrderStatus.confirmed;
      case ShipmentStatus.pickedUp:
      case ShipmentStatus.processing:
        return OrderStatus.processing;
      case ShipmentStatus.inTransit:
      case ShipmentStatus.atRegionalHub:
        return OrderStatus.shipped;
      case ShipmentStatus.outForDelivery:
      case ShipmentStatus.deliveryAttempted:
        return OrderStatus.outForDelivery;
      case ShipmentStatus.delivered:
        return OrderStatus.delivered;
      case ShipmentStatus.cancelled:
      case ShipmentStatus.returned:
        return OrderStatus.cancelled;
    }
  }
}

@immutable
class DeliveryAgent {
  const DeliveryAgent({
    required this.id,
    required this.name,
    required this.phone,
    required this.carrier,
    required this.vehicleType,
    required this.vehicleNumber,
    required this.rating,
  });

  final String id;
  final String name;
  final String phone;
  final String carrier;
  final String vehicleType;
  final String vehicleNumber;
  final double rating;

  factory DeliveryAgent.fromJson(Map<String, dynamic> json) {
    return DeliveryAgent(
      id: json['id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String,
      carrier: json['carrier'] as String? ?? 'Delhivery Rural Express',
      vehicleType: json['vehicle_type'] as String? ?? 'EV Three-Wheeler',
      vehicleNumber: json['vehicle_number'] as String? ?? 'MH-12-TR-4921',
      rating: (json['rating'] as num?)?.toDouble() ?? 4.8,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'phone': phone,
        'carrier': carrier,
        'vehicle_type': vehicleType,
        'vehicle_number': vehicleNumber,
        'rating': rating,
      };
}

@immutable
class TrackingEvent {
  const TrackingEvent({
    required this.id,
    required this.shipmentId,
    required this.status,
    required this.location,
    required this.description,
    required this.eventTime,
  });

  final String id;
  final String shipmentId;
  final ShipmentStatus status;
  final String location;
  final String description;
  final DateTime eventTime;

  factory TrackingEvent.fromJson(Map<String, dynamic> json) {
    return TrackingEvent(
      id: json['id'] as String,
      shipmentId: json['shipment_id'] as String,
      status: ShipmentStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => ShipmentStatus.created,
      ),
      location: json['location'] as String,
      description: json['description'] as String,
      eventTime: DateTime.parse(json['event_time'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'shipment_id': shipmentId,
        'status': status.name,
        'location': location,
        'description': description,
        'event_time': eventTime.toIso8601String(),
      };
}

@immutable
class DeliveryAttempt {
  const DeliveryAttempt({
    required this.id,
    required this.shipmentId,
    required this.attemptNumber,
    required this.status,
    required this.reason,
    required this.attemptedAt,
    this.notes,
    this.nextAttemptDate,
  });

  final String id;
  final String shipmentId;
  final int attemptNumber;
  final String status;
  final String reason;
  final DateTime attemptedAt;
  final String? notes;
  final DateTime? nextAttemptDate;

  factory DeliveryAttempt.fromJson(Map<String, dynamic> json) {
    return DeliveryAttempt(
      id: json['id'] as String,
      shipmentId: json['shipment_id'] as String,
      attemptNumber: json['attempt_number'] as int? ?? 1,
      status: json['status'] as String? ?? 'rescheduled',
      reason: json['reason'] as String,
      attemptedAt: DateTime.parse(json['attempted_at'] as String),
      notes: json['notes'] as String?,
      nextAttemptDate: json['next_attempt_date'] != null
          ? DateTime.parse(json['next_attempt_date'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'shipment_id': shipmentId,
        'attempt_number': attemptNumber,
        'status': status,
        'reason': reason,
        'attempted_at': attemptedAt.toIso8601String(),
        'notes': notes,
        'next_attempt_date': nextAttemptDate?.toIso8601String(),
      };
}

@immutable
class Shipment {
  const Shipment({
    required this.id,
    required this.orderId,
    required this.userId,
    required this.provider,
    required this.trackingNumber,
    required this.status,
    required this.originLocation,
    required this.destinationLocation,
    required this.currentLocation,
    required this.estimatedDeliveryStart,
    required this.estimatedDeliveryEnd,
    required this.serviceZone,
    required this.distanceBand,
    required this.createdAt,
    required this.updatedAt,
    this.deliveryAgent,
    this.attempts = const [],
    this.events = const [],
  });

  final String id;
  final String orderId;
  final String userId;
  final String provider;
  final String trackingNumber;
  final ShipmentStatus status;
  final String originLocation;
  final String destinationLocation;
  final String currentLocation;
  final DateTime estimatedDeliveryStart;
  final DateTime estimatedDeliveryEnd;
  final String serviceZone;
  final String distanceBand;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DeliveryAgent? deliveryAgent;
  final List<DeliveryAttempt> attempts;
  final List<TrackingEvent> events;

  Shipment copyWith({
    String? id,
    String? orderId,
    String? userId,
    String? provider,
    String? trackingNumber,
    ShipmentStatus? status,
    String? originLocation,
    String? destinationLocation,
    String? currentLocation,
    DateTime? estimatedDeliveryStart,
    DateTime? estimatedDeliveryEnd,
    String? serviceZone,
    String? distanceBand,
    DateTime? createdAt,
    DateTime? updatedAt,
    DeliveryAgent? deliveryAgent,
    List<DeliveryAttempt>? attempts,
    List<TrackingEvent>? events,
  }) {
    return Shipment(
      id: id ?? this.id,
      orderId: orderId ?? this.orderId,
      userId: userId ?? this.userId,
      provider: provider ?? this.provider,
      trackingNumber: trackingNumber ?? this.trackingNumber,
      status: status ?? this.status,
      originLocation: originLocation ?? this.originLocation,
      destinationLocation: destinationLocation ?? this.destinationLocation,
      currentLocation: currentLocation ?? this.currentLocation,
      estimatedDeliveryStart: estimatedDeliveryStart ?? this.estimatedDeliveryStart,
      estimatedDeliveryEnd: estimatedDeliveryEnd ?? this.estimatedDeliveryEnd,
      serviceZone: serviceZone ?? this.serviceZone,
      distanceBand: distanceBand ?? this.distanceBand,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      deliveryAgent: deliveryAgent ?? this.deliveryAgent,
      attempts: attempts ?? this.attempts,
      events: events ?? this.events,
    );
  }
}
