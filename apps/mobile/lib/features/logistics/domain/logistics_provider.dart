import '../../cart_checkout/domain/order.dart';
import 'shipment.dart';

abstract class LogisticsProvider {
  String get providerId;
  String get displayName;

  Future<Shipment> createShipment(Order order);
  Future<Shipment?> getShipment(String shipmentId);
  Future<Shipment?> getShipmentByOrderId(String orderId);
  Future<Shipment?> advanceMilestone(String shipmentId);
  Future<Shipment?> simulateException(String shipmentId, String reason);
  Future<Shipment?> recordDeliveryAttempt(String shipmentId, String reason, [String? notes]);
  Future<Shipment?> completeDelivery(String shipmentId);
}
