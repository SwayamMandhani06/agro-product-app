import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_radius.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/widgets/app_empty_state.dart';
import '../../../core/widgets/app_error_state.dart';
import '../../../core/widgets/app_loading.dart';
import '../domain/notification_item.dart';
import 'providers/notification_providers.dart';

/// Full notifications & platform alerts screen.
class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  String _activeFilter = 'all';

  @override
  Widget build(BuildContext context) {
    final notifsAsync = ref.watch(notificationsProvider);
    final unreadCount = ref.watch(unreadNotificationsCountProvider);

    return Scaffold(
      backgroundColor: AppColors.stitchCanvas,
      appBar: AppBar(
        title: const Text('Notifications & Alerts'),
        backgroundColor: AppColors.stitchCanvas,
        elevation: 0,
        actions: [
          if (unreadCount > 0)
            TextButton.icon(
              icon: const Icon(Icons.done_all_rounded, size: 16, color: AppColors.stitchForestGreen),
              label: const Text(
                'Mark Read',
                style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: AppColors.stitchForestGreen),
              ),
              onPressed: () {
                ref.read(notificationsProvider.notifier).markAllAsRead();
              },
            ),
        ],
      ),
      body: Column(
        children: [
          // Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
            child: Row(
              children: [
                _buildFilterChip('all', 'All Alerts'),
                _buildFilterChip('order', 'Orders'),
                _buildFilterChip('mandi', 'Mandi Rates'),
                _buildFilterChip('weather', 'Weather'),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.neutral200),

          // Notification List
          Expanded(
            child: notifsAsync.when(
              data: (items) {
                final filtered = _activeFilter == 'all'
                    ? items
                    : items.where((i) => i.type == _activeFilter).toList();

                if (filtered.isEmpty) {
                  return const AppEmptyState(
                    title: 'No Alerts in this Category',
                    message: 'You are completely up-to-date with your orders and farm alerts.',
                    icon: Icons.notifications_none_rounded,
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  itemCount: filtered.length,
                  separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
                  itemBuilder: (context, index) {
                    final item = filtered[index];
                    return _buildNotificationCard(item);
                  },
                );
              },
              loading: () => const Center(child: AppSpinner(size: 36)),
              error: (error, _) => Center(
                child: AppErrorState(
                  title: 'Failed to load notifications',
                  message: error.toString(),
                  onRetry: () => ref.refresh(notificationsProvider),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String key, String label) {
    final isSelected = _activeFilter == key;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        selected: isSelected,
        label: Text(label),
        labelStyle: TextStyle(
          fontSize: 12.5,
          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
          color: isSelected ? Colors.white : AppColors.textPrimary,
        ),
        selectedColor: AppColors.stitchForestGreen,
        backgroundColor: AppColors.surface,
        checkmarkColor: Colors.white,
        side: BorderSide(color: isSelected ? AppColors.stitchForestGreen : AppColors.neutral200),
        onSelected: (_) => setState(() => _activeFilter = key),
      ),
    );
  }

  Widget _buildNotificationCard(NotificationItem item) {
    IconData icon;
    Color iconColor;
    Color iconBg;

    switch (item.type) {
      case 'order':
        icon = Icons.local_shipping_outlined;
        iconColor = AppColors.stitchForestGreen;
        iconBg = const Color(0x1A0B3D2E);
        break;
      case 'mandi':
        icon = Icons.trending_up_rounded;
        iconColor = AppColors.stitchAmber;
        iconBg = const Color(0x1AD97706);
        break;
      case 'weather':
        icon = Icons.cloudy_snowing;
        iconColor = const Color(0xFF0284C7);
        iconBg = const Color(0x1A0284C7);
        break;
      default:
        icon = Icons.info_outline_rounded;
        iconColor = AppColors.neutral600;
        iconBg = AppColors.neutral100;
    }

    return InkWell(
      borderRadius: AppRadius.card,
      onTap: () {
        if (!item.read) {
          ref.read(notificationsProvider.notifier).markAsRead(item.id);
        }
        if (item.actionUrl != null && item.actionUrl!.isNotEmpty) {
          context.push(item.actionUrl!);
        }
      },
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: item.read ? AppColors.surface : const Color(0xFFF4F7F4),
          borderRadius: AppRadius.card,
          border: Border.all(
            color: item.read ? AppColors.neutral200 : AppColors.stitchForestGreen.withValues(alpha: 0.35),
          ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: iconBg,
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          item.title,
                          style: TextStyle(
                            fontSize: 13.5,
                            fontWeight: item.read ? FontWeight.w600 : FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ),
                      if (!item.read)
                        Container(
                          width: 8,
                          height: 8,
                          margin: const EdgeInsets.only(left: 6),
                          decoration: const BoxDecoration(
                            color: AppColors.stitchAmber,
                            shape: BoxShape.circle,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item.message,
                    style: const TextStyle(
                      fontSize: 12.5,
                      color: AppColors.textSecondary,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    _formatDate(item.createdAt),
                    style: const TextStyle(
                      fontSize: 10.5,
                      color: AppColors.textTertiary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${dt.day}/${dt.month}/${dt.year}';
  }
}
