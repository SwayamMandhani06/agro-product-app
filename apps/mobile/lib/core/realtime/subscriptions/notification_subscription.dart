import 'dart:async';
import '../../../features/notifications/domain/notification_item.dart';

/// Broadcast stream manager for real-time incoming push/in-app notifications.
class NotificationSubscription {
  NotificationSubscription._();
  static final NotificationSubscription instance = NotificationSubscription._();

  final _controller = StreamController<NotificationItem>.broadcast();

  Stream<NotificationItem> get stream => _controller.stream;

  void emit(NotificationItem notification) {
    if (!_controller.isClosed) {
      _controller.add(notification);
    }
  }

  void dispose() {
    _controller.close();
  }
}
