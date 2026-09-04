import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/config/backend_config.dart';
import '../../data/mock_notification_repository.dart';
import '../../data/supabase_notification_repository.dart';
import '../../domain/notification_item.dart';
import '../../domain/notification_repository.dart';

/// Notification repository provider.
final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  if (BackendConfig.isConfigured) {
    return SupabaseNotificationRepository();
  }
  return MockNotificationRepository();
});

/// StateNotifier managing the notifications list and read states.
class NotificationsNotifier extends StateNotifier<AsyncValue<List<NotificationItem>>> {
  NotificationsNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadNotifications();
  }

  final NotificationRepository _repository;

  Future<void> loadNotifications() async {
    state = const AsyncValue.loading();
    final result = await _repository.getNotifications();
    result.fold(
      (failure) => state = AsyncValue.error(failure, StackTrace.current),
      (items) => state = AsyncValue.data(items),
    );
  }

  Future<void> markAsRead(String id) async {
    final current = state.value ?? [];
    final updated = current.map((n) => n.id == id ? n.copyWith(read: true) : n).toList();
    state = AsyncValue.data(updated);
    await _repository.markAsRead(id);
  }

  Future<void> markAllAsRead() async {
    final current = state.value ?? [];
    final updated = current.map((n) => n.copyWith(read: true)).toList();
    state = AsyncValue.data(updated);
    await _repository.markAllAsRead();
  }
}

/// Global provider for notifications.
final notificationsProvider =
    StateNotifierProvider<NotificationsNotifier, AsyncValue<List<NotificationItem>>>((ref) {
  final repo = ref.watch(notificationRepositoryProvider);
  return NotificationsNotifier(repo);
});

/// Selector provider for unread notification count.
final unreadNotificationsCountProvider = Provider<int>((ref) {
  final asyncVal = ref.watch(notificationsProvider);
  return asyncVal.maybeWhen(
    data: (items) => items.where((n) => !n.read).length,
    orElse: () => 0,
  );
});
