import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../../core/routing/routes.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_loading.dart';
import 'providers/order_providers.dart';
import 'widgets/order_card.dart';

/// Full My Orders screen matching Google Stitch `7ad8777b56f748caabf7496810184e45`
/// and empty orders state `f31bfdff0f764f3c8479a562584fee6c`.
class OrdersScreen extends ConsumerWidget {
  const OrdersScreen({super.key});

  static const _filterTabs = ['All', 'Active', 'Delivered', 'Cancelled'];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(ordersProvider);
    final selectedFilter = ref.watch(selectedOrderFilterProvider);
    final filteredOrders = ref.watch(filteredOrdersProvider);

    return Scaffold(
      backgroundColor: AppColors.stitchCanvas,
      appBar: AppBar(
        title: const Text(
          'My Orders',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        centerTitle: false,
        backgroundColor: AppColors.surface,
        elevation: 0,
        scrolledUnderElevation: 1,
        actions: [
          IconButton(
            icon: const Icon(
              Icons.notifications_outlined,
              color: AppColors.textPrimary,
            ),
            tooltip: 'Notifications',
            onPressed: () => context.push(AppRoutes.notifications),
          ),
          const SizedBox(width: AppSpacing.xs),
        ],
      ),
      body: ordersAsync.when(
        loading: () => const Center(
          child: AppSpinner(size: 32),
        ),
        error: (err, stack) => Center(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.error_outline_rounded,
                  size: 48,
                  color: AppColors.error,
                ),
                const SizedBox(height: AppSpacing.md),
                const Text(
                  'Failed to load orders',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  err.toString(),
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                AppButton(
                  label: 'Retry',
                  onPressed: () =>
                      ref.read(ordersProvider.notifier).loadOrders(),
                ),
              ],
            ),
          ),
        ),
        data: (allOrders) {
          if (allOrders.isEmpty) {
            return _buildEmptyOrdersState(context);
          }

          return Column(
            children: [
              // Segmented Filter Chips
              Container(
                color: AppColors.surface,
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.md,
                  vertical: AppSpacing.sm,
                ),
                child: SizedBox(
                  height: 38,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _filterTabs.length,
                    separatorBuilder: (_, __) =>
                        const SizedBox(width: AppSpacing.sm),
                    itemBuilder: (context, index) {
                      final tab = _filterTabs[index];
                      final isSelected = selectedFilter == tab;

                      return ChoiceChip(
                        label: Text(tab),
                        selected: isSelected,
                        onSelected: (selected) {
                          if (selected) {
                            ref
                                .read(selectedOrderFilterProvider.notifier)
                                .state = tab;
                          }
                        },
                        selectedColor: AppColors.stitchForestGreen,
                        backgroundColor: AppColors.surface,
                        labelStyle: TextStyle(
                          fontSize: 13,
                          fontWeight:
                              isSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isSelected
                              ? AppColors.surface
                              : AppColors.textSecondary,
                        ),
                        side: BorderSide(
                          color: isSelected
                              ? AppColors.stitchForestGreen
                              : AppColors.neutral300,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppRadius.full),
                        ),
                        showCheckmark: false,
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.sm,
                          vertical: 0,
                        ),
                      );
                    },
                  ),
                ),
              ),
              const Divider(height: 1, color: AppColors.neutral200),

              // Orders List
              Expanded(
                child: filteredOrders.isEmpty
                    ? _buildFilteredEmptyState(context, ref, selectedFilter)
                    : RefreshIndicator(
                        onRefresh: () =>
                            ref.read(ordersProvider.notifier).loadOrders(),
                        color: AppColors.stitchForestGreen,
                        child: ListView.separated(
                          padding: const EdgeInsets.all(AppSpacing.md),
                          itemCount: filteredOrders.length,
                          separatorBuilder: (_, __) =>
                              const SizedBox(height: AppSpacing.md),
                          itemBuilder: (context, index) {
                            final order = filteredOrders[index];
                            return OrderCard(order: order);
                          },
                        ),
                      ),
              ),
            ],
          );
        },
      ),
    );
  }

  /// Polished empty state matching Google Stitch `f31bfdff0f764f3c8479a562584fee6c`.
  Widget _buildEmptyOrdersState(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Container(
          width: double.infinity,
          constraints: const BoxConstraints(maxWidth: 420),
          padding: const EdgeInsets.all(AppSpacing.xl),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(AppRadius.xl),
            boxShadow: const [
              BoxShadow(
                color: Color(0x0A000000),
                blurRadius: 16,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Minimal Line Illustration Circle
              Container(
                width: 96,
                height: 96,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.stitchCanvas,
                  border: Border.all(
                    color: AppColors.stitchForestGreen.withValues(alpha: 0.15),
                    width: 2,
                  ),
                ),
                child: const Center(
                  child: Icon(
                    Icons.inventory_2_outlined,
                    size: 44,
                    color: AppColors.stitchForestGreen,
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),

              // Heading
              const Text(
                'No orders yet',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: AppColors.stitchForestGreen,
                ),
              ),
              const SizedBox(height: AppSpacing.xs),

              // Subtext
              const Text(
                'Your agricultural purchases will appear here.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: AppSpacing.xl),

              // CTA Button: Start Shopping
              SizedBox(
                width: double.infinity,
                child: AppButton(
                  label: 'Start Shopping',
                  leadingIcon: const Icon(
                    Icons.shopping_basket_outlined,
                    size: 18,
                  ),
                  onPressed: () => context.go(AppRoutes.products),
                ),
              ),
              const SizedBox(height: AppSpacing.sm),

              // Secondary Action Link: Browse Categories
              TextButton(
                onPressed: () => context.go(AppRoutes.categories),
                child: const Text(
                  'Browse Categories',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.stitchForestGreen,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Empty state when a specific tab filter yields no results.
  Widget _buildFilteredEmptyState(
    BuildContext context,
    WidgetRef ref,
    String filter,
  ) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.filter_list_off_rounded,
              size: 40,
              color: AppColors.neutral400,
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'No $filter orders',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(
              'You do not have any orders matching "$filter".',
              style: const TextStyle(
                fontSize: 13,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            OutlinedButton(
              onPressed: () {
                ref.read(selectedOrderFilterProvider.notifier).state = 'All';
              },
              child: const Text('View All Orders'),
            ),
          ],
        ),
      ),
    );
  }
}
