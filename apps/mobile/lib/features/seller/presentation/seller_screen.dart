// ============================================================
// AGRITRADE SELLER PORTAL SCREEN (FLUTTER)
// Role-based marketplace management: Dashboard, Inventory,
// Orders, Payouts, and Cooperative Campaigns.
// ============================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_radius.dart';
import '../../../core/design_system/app_spacing.dart';
import '../domain/seller_entities.dart';
import 'providers/marketplace_providers.dart';

class SellerScreen extends ConsumerStatefulWidget {
  const SellerScreen({super.key});

  @override
  ConsumerState<SellerScreen> createState() => _SellerScreenState();
}

class _SellerScreenState extends ConsumerState<SellerScreen>
    with TickerProviderStateMixin {
  late final TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(sellerProfileProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              profile.businessName,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            Row(
              children: [
                Container(
                  width: 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: profile.verificationStatus ==
                            SellerVerificationStatus.verified
                        ? AppColors.success
                        : AppColors.warning,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 4),
                Text(
                  profile.verificationStatus ==
                          SellerVerificationStatus.verified
                      ? 'Verified Seller'
                      : 'Verification Pending',
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppColors.textTertiary,
                  ),
                ),
              ],
            ),
          ],
        ),
        backgroundColor: AppColors.surface,
        elevation: 0,
        scrolledUnderElevation: 1,
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textTertiary,
          indicatorColor: AppColors.primary,
          indicatorWeight: 2,
          labelStyle: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
          unselectedLabelStyle: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w400,
          ),
          tabAlignment: TabAlignment.start,
          tabs: const [
            Tab(text: 'Dashboard'),
            Tab(text: 'Inventory'),
            Tab(text: 'Orders'),
            Tab(text: 'Payouts'),
            Tab(text: 'Co-op Campaigns'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _DashboardTab(profile: profile),
          const _InventoryTab(),
          const _OrdersTab(),
          const _PayoutsTab(),
          const _CooperativeCampaignsTab(),
        ],
      ),
    );
  }
}

// =============================================================================
// TAB 1: Dashboard
// =============================================================================
class _DashboardTab extends StatelessWidget {
  final SellerProfile profile;
  const _DashboardTab({required this.profile});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Revenue Overview
          _buildSectionHeader('Revenue Overview'),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(
                child: _MetricCard(
                  label: 'Total Revenue',
                  value: _formatCurrency(profile.totalRevenue),
                  icon: Icons.account_balance_wallet_outlined,
                  iconColor: AppColors.primary,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: _MetricCard(
                  label: 'Available Balance',
                  value: _formatCurrency(profile.availableBalance),
                  icon: Icons.payments_outlined,
                  iconColor: AppColors.success,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(
                child: _MetricCard(
                  label: 'Pending Payout',
                  value: _formatCurrency(profile.pendingPayoutAmount),
                  icon: Icons.schedule_outlined,
                  iconColor: AppColors.warning,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: _MetricCard(
                  label: 'Commission Rate',
                  value: '${profile.commissionRate}%',
                  icon: Icons.percent_outlined,
                  iconColor: AppColors.textTertiary,
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.lg),

          // Operational Metrics
          _buildSectionHeader('Operations'),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(
                child: _MetricCard(
                  label: 'Active Orders',
                  value: '${profile.activeOrders}',
                  icon: Icons.local_shipping_outlined,
                  iconColor: AppColors.info,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: _MetricCard(
                  label: 'Delivered',
                  value: '${profile.deliveredOrders}',
                  icon: Icons.check_circle_outline,
                  iconColor: AppColors.success,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(
                child: _MetricCard(
                  label: 'On-Time Dispatch',
                  value: '${profile.onTimeDispatchRate}%',
                  icon: Icons.timer_outlined,
                  iconColor: AppColors.primary,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: _MetricCard(
                  label: 'Low Stock Items',
                  value: '${profile.lowStockCount}',
                  icon: Icons.inventory_2_outlined,
                  iconColor: profile.lowStockCount > 0
                      ? AppColors.error
                      : AppColors.textTertiary,
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.lg),

          // Seller Profile Card
          _buildSectionHeader('Seller Profile'),
          const SizedBox(height: AppSpacing.sm),
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(AppRadius.sm),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: AppColors.primaryLight,
                        borderRadius: BorderRadius.circular(AppRadius.xs),
                      ),
                      child: const Icon(
                        Icons.storefront_outlined,
                        color: AppColors.primary,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            profile.businessName,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${profile.location} \u2022 ${profile.district}, ${profile.state}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),
                const Divider(height: 1, color: AppColors.divider),
                const SizedBox(height: AppSpacing.sm),
                _ProfileDetailRow(
                  label: 'Legal Name',
                  value: profile.legalName,
                ),
                _ProfileDetailRow(
                  label: 'GST Number',
                  value: profile.gstNumber,
                ),
                _ProfileDetailRow(
                  label: 'Rating',
                  value:
                      '${profile.rating}/5.0 (${profile.totalReviews} reviews)',
                ),
                _ProfileDetailRow(
                  label: 'Dispatch SLA',
                  value: '${profile.dispatchSlaHours}h',
                ),
                _ProfileDetailRow(
                  label: 'Contact',
                  value: profile.contactPhone,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
        letterSpacing: -0.2,
      ),
    );
  }

  String _formatCurrency(double amount) {
    if (amount >= 100000) {
      return '\u20B9${(amount / 100000).toStringAsFixed(1)}L';
    } else if (amount >= 1000) {
      return '\u20B9${(amount / 1000).toStringAsFixed(1)}K';
    }
    return '\u20B9${amount.toStringAsFixed(0)}';
  }
}

// =============================================================================
// TAB 2: Inventory
// =============================================================================
class _InventoryTab extends ConsumerWidget {
  const _InventoryTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final inventory = ref.watch(sellerInventoryProvider);
    final healthyCt =
        inventory.where((i) => i.stockHealth == StockHealth.healthy).length;
    final lowCt =
        inventory.where((i) => i.stockHealth == StockHealth.lowStock).length;
    final outCt =
        inventory.where((i) => i.stockHealth == StockHealth.outOfStock).length;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stock Health Summary
          Row(
            children: [
              _StockChip(
                label: 'Healthy',
                count: healthyCt,
                color: AppColors.success,
              ),
              const SizedBox(width: AppSpacing.xs),
              _StockChip(
                label: 'Low Stock',
                count: lowCt,
                color: AppColors.warning,
              ),
              const SizedBox(width: AppSpacing.xs),
              _StockChip(
                label: 'Out of Stock',
                count: outCt,
                color: AppColors.error,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          // Inventory Items
          ...inventory.map((item) => _InventoryItemCard(item: item)),
          const SizedBox(height: AppSpacing.xl),
        ],
      ),
    );
  }
}

class _InventoryItemCard extends ConsumerWidget {
  final SellerInventoryItem item;
  const _InventoryItemCard({required this.item});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final healthColor = switch (item.stockHealth) {
      StockHealth.healthy => AppColors.success,
      StockHealth.lowStock => AppColors.warning,
      StockHealth.outOfStock => AppColors.error,
    };

    final healthLabel = switch (item.stockHealth) {
      StockHealth.healthy => 'Healthy',
      StockHealth.lowStock => 'Low Stock',
      StockHealth.outOfStock => 'Out of Stock',
    };

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.sm),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.productTitle,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'SKU: ${item.sku} \u2022 ${item.category}',
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.textTertiary,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: healthColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.xs),
                ),
                child: Text(
                  healthLabel,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: healthColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          const Divider(height: 1, color: AppColors.divider),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              _InventoryStatCol(
                label: 'Stock',
                value: '${item.stockQuantity}',
              ),
              _InventoryStatCol(
                label: 'Reserved',
                value: '${item.reservedQuantity}',
              ),
              _InventoryStatCol(
                label: 'Available',
                value: '${item.availableStock}',
              ),
              _InventoryStatCol(
                label: 'Price',
                value: '\u20B9${item.price.toStringAsFixed(0)}',
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              _SmallActionButton(
                label: 'Restock +10',
                onPressed: () {
                  ref
                      .read(sellerInventoryProvider.notifier)
                      .adjustStock(item.id, 10);
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// TAB 3: Orders
// =============================================================================
class _OrdersTab extends ConsumerWidget {
  const _OrdersTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orders = ref.watch(sellerOrdersProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '${orders.length} Active Orders',
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          ...orders.map((order) => _OrderCard(order: order)),
          const SizedBox(height: AppSpacing.xl),
        ],
      ),
    );
  }
}

class _OrderCard extends ConsumerWidget {
  final SellerOrder order;
  const _OrderCard({required this.order});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statusColor = switch (order.fulfillmentStatus) {
      FulfillmentStatus.pending => AppColors.warning,
      FulfillmentStatus.packed => AppColors.info,
      FulfillmentStatus.dispatched => AppColors.primary,
      FulfillmentStatus.delivered => AppColors.success,
      FulfillmentStatus.cancelled => AppColors.error,
    };

    final statusLabel = switch (order.fulfillmentStatus) {
      FulfillmentStatus.pending => 'Pending',
      FulfillmentStatus.packed => 'Packed',
      FulfillmentStatus.dispatched => 'Dispatched',
      FulfillmentStatus.delivered => 'Delivered',
      FulfillmentStatus.cancelled => 'Cancelled',
    };

    // Build the next action label
    final nextAction = switch (order.fulfillmentStatus) {
      FulfillmentStatus.pending => 'Mark Packed',
      FulfillmentStatus.packed => 'Mark Dispatched',
      FulfillmentStatus.dispatched => 'Mark Delivered',
      _ => null,
    };

    final nextStatus = switch (order.fulfillmentStatus) {
      FulfillmentStatus.pending => FulfillmentStatus.packed,
      FulfillmentStatus.packed => FulfillmentStatus.dispatched,
      FulfillmentStatus.dispatched => FulfillmentStatus.delivered,
      _ => null,
    };

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.sm),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                order.orderNumber,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                  letterSpacing: -0.3,
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.xs),
                ),
                child: Text(
                  statusLabel,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: statusColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          _OrderInfoRow(
            icon: Icons.person_outline,
            text: '${order.customerName} \u2022 ${order.customerVillage}',
          ),
          _OrderInfoRow(
            icon: Icons.inventory_2_outlined,
            text: order.items
                .map((i) => '${i.title} \u00D7${i.quantity}')
                .join(', '),
          ),
          _OrderInfoRow(
            icon: Icons.payments_outlined,
            text:
                '\u20B9${order.totalAmount.toStringAsFixed(0)} \u2022 ${order.paymentMethod}',
          ),
          if (nextAction != null && nextStatus != null) ...[
            const SizedBox(height: AppSpacing.sm),
            const Divider(height: 1, color: AppColors.divider),
            const SizedBox(height: AppSpacing.sm),
            Align(
              alignment: Alignment.centerRight,
              child: _SmallActionButton(
                label: nextAction,
                onPressed: () {
                  ref
                      .read(sellerOrdersProvider.notifier)
                      .updateOrderStatus(order.id, nextStatus);
                },
              ),
            ),
          ],
        ],
      ),
    );
  }
}

// =============================================================================
// TAB 4: Payouts
// =============================================================================
class _PayoutsTab extends ConsumerWidget {
  const _PayoutsTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final payouts = ref.watch(sellerPayoutsProvider);
    final profile = ref.watch(sellerProfileProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Request Payout CTA
          Container(
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.primaryLight,
              borderRadius: BorderRadius.circular(AppRadius.sm),
              border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Available Balance',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '\u20B9${profile.availableBalance.toStringAsFixed(0)}',
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                          letterSpacing: -0.5,
                        ),
                      ),
                    ],
                  ),
                ),
                FilledButton.icon(
                  onPressed: profile.availableBalance > 0
                      ? () {
                          final payout = ref
                              .read(sellerPayoutsProvider.notifier)
                              .requestPayout(profile.availableBalance);
                          if (payout != null) {
                            ref
                                .read(sellerProfileProvider.notifier)
                                .deductBalanceAfterPayout(
                                    profile.availableBalance);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  'Payout of \u20B9${payout.amount.toStringAsFixed(0)} initiated',
                                ),
                                behavior: SnackBarBehavior.floating,
                              ),
                            );
                          }
                        }
                      : null,
                  icon: const Icon(Icons.send_outlined, size: 16),
                  label: const Text('Request Payout'),
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: AppColors.onPrimary,
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.md,
                      vertical: AppSpacing.sm,
                    ),
                    textStyle: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadius.sm),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          // Payout History
          const Text(
            'Payout History',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          ...payouts.map((payout) => _PayoutCard(payout: payout)),
          const SizedBox(height: AppSpacing.xl),
        ],
      ),
    );
  }
}

class _PayoutCard extends StatelessWidget {
  final SellerPayout payout;
  const _PayoutCard({required this.payout});

  @override
  Widget build(BuildContext context) {
    final statusColor = switch (payout.status) {
      PayoutStatus.paid => AppColors.success,
      PayoutStatus.processing => AppColors.info,
      PayoutStatus.pending => AppColors.warning,
      PayoutStatus.failed => AppColors.error,
    };

    final statusLabel = switch (payout.status) {
      PayoutStatus.paid => 'Paid',
      PayoutStatus.processing => 'Processing',
      PayoutStatus.pending => 'Pending',
      PayoutStatus.failed => 'Failed',
    };

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.sm),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '\u20B9${payout.amount.toStringAsFixed(0)}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                  letterSpacing: -0.3,
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.xs),
                ),
                child: Text(
                  statusLabel,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: statusColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          _PayoutDetailRow(
            label: 'Orders',
            value: '${payout.orderCount} orders',
          ),
          _PayoutDetailRow(
            label: 'Gross Revenue',
            value: '\u20B9${payout.grossRevenue.toStringAsFixed(0)}',
          ),
          _PayoutDetailRow(
            label: 'Commission',
            value: '-\u20B9${payout.commissionDeducted.toStringAsFixed(0)}',
          ),
          _PayoutDetailRow(
            label: 'Bank',
            value: payout.bankAccountMasked,
          ),
          _PayoutDetailRow(
            label: 'UTR',
            value: payout.utrReference,
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// TAB 5: Cooperative Campaigns
// =============================================================================
class _CooperativeCampaignsTab extends ConsumerWidget {
  const _CooperativeCampaignsTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final campaigns = ref.watch(cooperativeCampaignsProvider);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Active Cooperative Procurement Campaigns',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Pool demand with nearby farmers for bulk discounts',
            style: TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          ...campaigns.map((c) => _CampaignCard(campaign: c)),
          const SizedBox(height: AppSpacing.xl),
        ],
      ),
    );
  }
}

class _CampaignCard extends ConsumerWidget {
  final CooperativeCampaign campaign;
  const _CampaignCard({required this.campaign});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statusColor = switch (campaign.status) {
      CampaignStatus.active => AppColors.info,
      CampaignStatus.thresholdReached => AppColors.success,
      CampaignStatus.processing => AppColors.warning,
      CampaignStatus.completed => AppColors.primary,
      CampaignStatus.draft => AppColors.textTertiary,
      CampaignStatus.cancelled => AppColors.error,
    };

    final statusLabel = switch (campaign.status) {
      CampaignStatus.active => 'Active',
      CampaignStatus.thresholdReached => 'Threshold Met',
      CampaignStatus.processing => 'Processing',
      CampaignStatus.completed => 'Completed',
      CampaignStatus.draft => 'Draft',
      CampaignStatus.cancelled => 'Cancelled',
    };

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.sm),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  campaign.title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppRadius.xs),
                ),
                child: Text(
                  statusLabel,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: statusColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            campaign.cooperativeName,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          // Progress bar
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${campaign.currentQuantity} / ${campaign.targetQuantity} ${campaign.unit}',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    '${campaign.progressPercentage}%',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: statusColor,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(2),
                child: LinearProgressIndicator(
                  value: campaign.progressPercentage / 100.0,
                  backgroundColor: AppColors.surfaceMuted,
                  valueColor: AlwaysStoppedAnimation(statusColor),
                  minHeight: 6,
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.sm),
          const Divider(height: 1, color: AppColors.divider),
          const SizedBox(height: AppSpacing.sm),

          // Pricing
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Retail Price',
                      style: TextStyle(
                        fontSize: 11,
                        color: AppColors.textTertiary,
                      ),
                    ),
                    Text(
                      '\u20B9${campaign.retailPrice.toStringAsFixed(0)}',
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                        decoration: TextDecoration.lineThrough,
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Bulk Price',
                      style: TextStyle(
                        fontSize: 11,
                        color: AppColors.textTertiary,
                      ),
                    ),
                    Text(
                      '\u20B9${campaign.bulkPrice.toStringAsFixed(0)}',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.success,
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Savings',
                      style: TextStyle(
                        fontSize: 11,
                        color: AppColors.textTertiary,
                      ),
                    ),
                    Text(
                      '-${campaign.discountPercent}%',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.success,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.sm),

          // Participation info + CTA
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${campaign.participantsCount} farmers participating',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textTertiary,
                ),
              ),
              if (campaign.status == CampaignStatus.active ||
                  campaign.status == CampaignStatus.thresholdReached)
                _SmallActionButton(
                  label: 'Join +5',
                  onPressed: () {
                    ref
                        .read(cooperativeCampaignsProvider.notifier)
                        .joinCampaign(campaign.id, 5);
                  },
                ),
            ],
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// Shared Widgets
// =============================================================================

class _MetricCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color iconColor;

  const _MetricCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.sm),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: iconColor),
          const SizedBox(height: AppSpacing.sm),
          Text(
            value,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              color: AppColors.textTertiary,
            ),
          ),
        ],
      ),
    );
  }
}

class _StockChip extends StatelessWidget {
  final String label;
  final int count;
  final Color color;

  const _StockChip({
    required this.label,
    required this.count,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(AppRadius.xs),
      ),
      child: Text(
        '$label ($count)',
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }
}

class _InventoryStatCol extends StatelessWidget {
  final String label;
  final String value;

  const _InventoryStatCol({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 10,
              color: AppColors.textTertiary,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}

class _SmallActionButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;

  const _SmallActionButton({
    required this.label,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        foregroundColor: AppColors.primary,
        textStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.xs),
          side: BorderSide(color: AppColors.primary.withValues(alpha: 0.3)),
        ),
        minimumSize: Size.zero,
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      ),
      child: Text(label),
    );
  }
}

class _ProfileDetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _ProfileDetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textTertiary,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: AppColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _OrderInfoRow extends StatelessWidget {
  final IconData icon;
  final String text;

  const _OrderInfoRow({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 14, color: AppColors.textTertiary),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}

class _PayoutDetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _PayoutDetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textTertiary,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
