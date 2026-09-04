/// Platform notification entity in AgriTrade mobile.
class NotificationItem {
  const NotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.type, // 'order' | 'mandi' | 'weather' | 'system'
    required this.createdAt,
    this.read = false,
    this.actionUrl,
  });

  final String id;
  final String title;
  final String message;
  final String type;
  final DateTime createdAt;
  final bool read;
  final String? actionUrl;

  NotificationItem copyWith({
    String? id,
    String? title,
    String? message,
    String? type,
    DateTime? createdAt,
    bool? read,
    String? actionUrl,
  }) {
    return NotificationItem(
      id: id ?? this.id,
      title: title ?? this.title,
      message: message ?? this.message,
      type: type ?? this.type,
      createdAt: createdAt ?? this.createdAt,
      read: read ?? this.read,
      actionUrl: actionUrl ?? this.actionUrl,
    );
  }
}
