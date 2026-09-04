import 'dart:async';
import '../../../features/logistics/domain/shipment.dart';

class ShipmentStatusUpdate {
  const ShipmentStatusUpdate({
    required this.shipmentId,
    required this.orderId,
    required this.status,
    required this.currentLocation,
    required this.timestamp,
    this.deliveryAgent,
  });

  final String shipmentId;
  final String orderId;
  final ShipmentStatus status;
  final String currentLocation;
  final DateTime timestamp;
  final DeliveryAgent? deliveryAgent;
}

/// Broadcast stream manager for real-time shipment updates.
class ShipmentSubscription {
  ShipmentSubscription._();
  static final ShipmentSubscription instance = ShipmentSubscription._();

  final _controller = StreamController<ShipmentStatusUpdate>.broadcast();

  Stream<ShipmentStatusUpdate> get stream => _controller.stream;

  void emit(ShipmentStatusUpdate update) {
    if (!_controller.isClosed) {
      _controller.add(update);
    }
  }

  void dispose() {
    _controller.close();
  }
}
