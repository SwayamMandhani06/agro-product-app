import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:fpdart/fpdart.dart';

import '../../../core/config/backend_config.dart';
import '../../../core/error/failure.dart';
import '../domain/notification_item.dart';
import '../domain/notification_repository.dart';
import 'mock_notification_repository.dart';

/// Supabase PostgREST implementation of [NotificationRepository] with mock fallback.
class SupabaseNotificationRepository implements NotificationRepository {
  SupabaseNotificationRepository({Dio? dio})
      : _dio = dio ?? Dio(),
        _mock = MockNotificationRepository();

  final Dio _dio;
  final MockNotificationRepository _mock;

  @override
  Future<Result<List<NotificationItem>>> getNotifications() async {
    if (!BackendConfig.isConfigured) return _mock.getNotifications();

    try {
      final response = await _dio.get(
        '${BackendConfig.restBaseUrl}/notifications',
        queryParameters: {'order': 'created_at.desc'},
        options: Options(headers: BackendConfig.headers),
      );

      final rows = response.data as List;
      if (rows.isEmpty) return _mock.getNotifications();

      final items = rows.map((r) => NotificationItem(
            id: r['id'] as String,
            title: r['title'] as String,
            message: r['message'] as String,
            type: r['type'] as String,
            createdAt: DateTime.tryParse(r['created_at'] as String? ?? '') ?? DateTime.now(),
            read: r['is_read'] as bool? ?? false,
            actionUrl: r['action_url'] as String?,
          )).toList();

      return right(items);
    } catch (e) {
      debugPrint('[SupabaseNotificationRepository] getNotifications error: $e');
      return _mock.getNotifications();
    }
  }

  @override
  Future<Result<Unit>> markAsRead(String notificationId) async {
    if (!BackendConfig.isConfigured) return _mock.markAsRead(notificationId);

    try {
      await _dio.patch(
        '${BackendConfig.restBaseUrl}/notifications',
        queryParameters: {'id': 'eq.$notificationId'},
        data: {'is_read': true},
        options: Options(headers: BackendConfig.headers),
      );
      await _mock.markAsRead(notificationId);
      return right(unit);
    } catch (e) {
      debugPrint('[SupabaseNotificationRepository] markAsRead error: $e');
      return _mock.markAsRead(notificationId);
    }
  }

  @override
  Future<Result<Unit>> markAllAsRead() async {
    if (!BackendConfig.isConfigured) return _mock.markAllAsRead();

    try {
      await _dio.patch(
        '${BackendConfig.restBaseUrl}/notifications',
        data: {'is_read': true},
        options: Options(headers: BackendConfig.headers),
      );
      await _mock.markAllAsRead();
      return right(unit);
    } catch (e) {
      debugPrint('[SupabaseNotificationRepository] markAllAsRead error: $e');
      return _mock.markAllAsRead();
    }
  }

  @override
  Future<Result<int>> getUnreadCount() async {
    final notifsResult = await getNotifications();
    return notifsResult.map((list) => list.where((n) => !n.read).length);
  }
}
