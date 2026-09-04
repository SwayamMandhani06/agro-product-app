import 'package:fpdart/fpdart.dart';
import '../../../core/error/failure.dart';
import 'notification_item.dart';

/// Contract for notification operations.
abstract class NotificationRepository {
  Future<Result<List<NotificationItem>>> getNotifications();
  Future<Result<Unit>> markAsRead(String notificationId);
  Future<Result<Unit>> markAllAsRead();
  Future<Result<int>> getUnreadCount();
}
