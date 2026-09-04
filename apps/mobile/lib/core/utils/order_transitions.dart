import '../../features/cart_checkout/domain/order.dart';

/// AgriTrade Canonical Order Transition Validator for Mobile (Stage 12).
///
/// Mirrors apps/web/lib/order-transitions.ts to ensure 100% cross-platform
/// lifecycle consistency across buyer, seller, admin, and logistics flows.
class OrderTransitionValidator {
  const OrderTransitionValidator._();

  static const Map<OrderStatus, List<OrderStatus>> _allowedTransitions = {
    OrderStatus.placed: [OrderStatus.confirmed, OrderStatus.cancelled],
    OrderStatus.confirmed: [OrderStatus.processing, OrderStatus.cancelled],
    OrderStatus.processing: [
      OrderStatus.packed,
      OrderStatus.shipped,
      OrderStatus.cancelled,
    ],
    OrderStatus.packed: [OrderStatus.shipped, OrderStatus.cancelled],
    OrderStatus.shipped: [OrderStatus.outForDelivery, OrderStatus.delivered],
    OrderStatus.outForDelivery: [OrderStatus.delivered, OrderStatus.shipped],
    OrderStatus.delivered: [
      OrderStatus.refundRequested,
      OrderStatus.disputed,
    ],
    OrderStatus.refundRequested: [
      OrderStatus.refundProcessing,
      OrderStatus.disputed,
      OrderStatus.delivered,
    ],
    OrderStatus.disputed: [
      OrderStatus.refundProcessing,
      OrderStatus.delivered,
    ],
    OrderStatus.refundProcessing: [OrderStatus.refunded],
    OrderStatus.refunded: [],
    OrderStatus.cancelled: [],
  };

  /// Returns true if [from] -> [to] is a valid state transition under canonical lifecycle rules.
  static bool isValidTransition(OrderStatus from, OrderStatus to) {
    if (from == to) return true;
    final allowed = _allowedTransitions[from];
    return allowed != null && allowed.contains(to);
  }

  /// Returns the list of valid next statuses from [current].
  static List<OrderStatus> getNextAllowedTransitions(OrderStatus current) {
    return _allowedTransitions[current] ?? const [];
  }

  /// Checks if [status] is a terminal state.
  static bool isTerminal(OrderStatus status) {
    return status == OrderStatus.delivered ||
        status == OrderStatus.refunded ||
        status == OrderStatus.cancelled;
  }

  /// Parses a backend string into canonical [OrderStatus].
  static OrderStatus parseOrderStatus(String? value, {OrderStatus fallback = OrderStatus.placed}) {
    if (value == null) return fallback;
    final cleaned = value.trim().toLowerCase().replaceAll('-', '_');
    switch (cleaned) {
      case 'placed':
        return OrderStatus.placed;
      case 'confirmed':
        return OrderStatus.confirmed;
      case 'processing':
        return OrderStatus.processing;
      case 'packed':
        return OrderStatus.packed;
      case 'shipped':
        return OrderStatus.shipped;
      case 'outfordelivery':
      case 'out_for_delivery':
        return OrderStatus.outForDelivery;
      case 'delivered':
        return OrderStatus.delivered;
      case 'cancelled':
        return OrderStatus.cancelled;
      case 'refundrequested':
      case 'refund_requested':
        return OrderStatus.refundRequested;
      case 'refundprocessing':
      case 'refund_processing':
        return OrderStatus.refundProcessing;
      case 'refunded':
        return OrderStatus.refunded;
      case 'disputed':
        return OrderStatus.disputed;
      default:
        return fallback;
    }
  }

  /// Converts [OrderStatus] to canonical API string format.
  static String toApiString(OrderStatus status) {
    switch (status) {
      case OrderStatus.placed:
        return 'placed';
      case OrderStatus.confirmed:
        return 'confirmed';
      case OrderStatus.processing:
        return 'processing';
      case OrderStatus.packed:
        return 'packed';
      case OrderStatus.shipped:
        return 'shipped';
      case OrderStatus.outForDelivery:
        return 'out_for_delivery';
      case OrderStatus.delivered:
        return 'delivered';
      case OrderStatus.cancelled:
        return 'cancelled';
      case OrderStatus.refundRequested:
        return 'refund_requested';
      case OrderStatus.refundProcessing:
        return 'refund_processing';
      case OrderStatus.refunded:
        return 'refunded';
      case OrderStatus.disputed:
        return 'disputed';
    }
  }
}
