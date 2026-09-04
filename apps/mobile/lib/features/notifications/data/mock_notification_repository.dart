import 'package:fpdart/fpdart.dart';

import '../../../core/error/failure.dart';
import '../domain/notification_item.dart';
import '../domain/notification_repository.dart';

/// In-memory mock notification repository with rich realistic platform alerts.
class MockNotificationRepository implements NotificationRepository {
  MockNotificationRepository({List<NotificationItem>? initialItems})
      : _items = initialItems != null
            ? List.from(initialItems)
            : [
                NotificationItem(
                  id: 'notif_1',
                  title: 'Order Dispatched — AgriGrow Direct',
                  message:
                      'Your order #ORD-2026-8901 containing Hybrid Soybean Seeds (5kg) is out for delivery from the Pune Hub.',
                  type: 'order',
                  createdAt: DateTime.now().subtract(const Duration(minutes: 25)),
                  read: false,
                  actionUrl: '/orders/ord_1',
                ),
                NotificationItem(
                  id: 'notif_2',
                  title: 'Mandi Surge Alert: Soybean Up +₹120/qtl',
                  message:
                      'Modal rate at Latur APMC reached ₹4,680/qtl due to tight arrivals across Marathwada mandis.',
                  type: 'mandi',
                  createdAt: DateTime.now().subtract(const Duration(hours: 2)),
                  read: false,
                  actionUrl: '/mandi-prices',
                ),
                NotificationItem(
                  id: 'notif_3',
                  title: 'Weather Advisory: Postpone Chemical Spraying',
                  message:
                      'IMD predicts gusty winds (18 km/h) and 65% precipitation over the next 36 hours.',
                  type: 'weather',
                  createdAt: DateTime.now().subtract(const Duration(hours: 5)),
                  read: true,
                  actionUrl: '/weather',
                ),
                NotificationItem(
                  id: 'notif_4',
                  title: 'Subsidized Micronutrient Scheme Open',
                  message:
                      'Soil Health Card holders in Maharashtra are eligible for 25% direct benefit transfer on zinc sulphate.',
                  type: 'system',
                  createdAt: DateTime.now().subtract(const Duration(days: 1)),
                  read: true,
                ),
              ];

  final List<NotificationItem> _items;

  @override
  Future<Result<List<NotificationItem>>> getNotifications() async {
    return right(List.unmodifiable(_items));
  }

  @override
  Future<Result<Unit>> markAsRead(String notificationId) async {
    final index = _items.indexWhere((n) => n.id == notificationId);
    if (index != -1) {
      _items[index] = _items[index].copyWith(read: true);
    }
    return right(unit);
  }

  @override
  Future<Result<Unit>> markAllAsRead() async {
    for (var i = 0; i < _items.length; i++) {
      _items[i] = _items[i].copyWith(read: true);
    }
    return right(unit);
  }

  @override
  Future<Result<int>> getUnreadCount() async {
    final count = _items.where((n) => !n.read).length;
    return right(count);
  }
}
