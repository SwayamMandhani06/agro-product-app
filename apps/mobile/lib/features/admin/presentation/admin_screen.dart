import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_radius.dart';
import '../../../core/design_system/app_spacing.dart';
import '../domain/governance_entities.dart';
import 'providers/admin_providers.dart';

class AdminScreen extends ConsumerStatefulWidget {
  const AdminScreen({super.key});

  @override
  ConsumerState<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends ConsumerState<AdminScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final riskSignalsAsync = ref.watch(riskSignalsProvider);
    final unresolvedRisks = riskSignalsAsync.maybeWhen(
      data: (signals) => signals.where((s) => !s.isResolved).length,
      orElse: () => 0,
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.stitchSlate,
        foregroundColor: Colors.white,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.shield_outlined, size: 18, color: Color(0xFF38BDF8)),
                const SizedBox(width: 6),
                const Text(
                  'AgriTrade Admin',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFF38BDF8), width: 0.8),
                  ),
                  child: const Text(
                    'CONTROL',
                    style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF38BDF8)),
                  ),
                ),
              ],
            ),
            const Text(
              'Trust, Verification & Dispute Desk',
              style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
            ),
          ],
        ),
        actions: [
          if (unresolvedRisks > 0)
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: Chip(
                avatar: const Icon(Icons.warning_amber_rounded, size: 14, color: Colors.white),
                label: Text(
                  '$unresolvedRisks Risk',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                backgroundColor: AppColors.error,
                padding: EdgeInsets.zero,
                visualDensity: VisualDensity.compact,
              ),
            ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF38BDF8),
          indicatorWeight: 3,
          labelColor: const Color(0xFF38BDF8),
          unselectedLabelColor: const Color(0xFF94A3B8),
          labelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
          tabs: const [
            Tab(icon: Icon(Icons.dashboard_outlined, size: 18), text: 'Overview'),
            Tab(icon: Icon(Icons.verified_user_outlined, size: 18), text: 'Sellers'),
            Tab(icon: Icon(Icons.inventory_2_outlined, size: 18), text: 'Moderation'),
            Tab(icon: Icon(Icons.gavel_outlined, size: 18), text: 'Disputes'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: const [
          _AdminOverviewTab(),
          _AdminSellersTab(),
          _AdminModerationTab(),
          _AdminDisputesTab(),
        ],
      ),
    );
  }
}

// =============================================================================
// TAB 1: OVERVIEW
// =============================================================================
class _AdminOverviewTab extends ConsumerWidget {
  const _AdminOverviewTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final metricsAsync = ref.watch(platformMetricsProvider);
    final alertsAsync = ref.watch(operationalAlertsProvider);
    final riskSignalsAsync = ref.watch(riskSignalsProvider);

    return ListView(
      padding: const EdgeInsets.all(AppSpacing.md),
      children: [
        // Active Risk Banner
        riskSignalsAsync.maybeWhen(
          data: (signals) {
            final active = signals.where((s) => !s.isResolved).toList();
            if (active.isEmpty) return const SizedBox.shrink();

            return Container(
              margin: const EdgeInsets.only(bottom: AppSpacing.md),
              padding: const EdgeInsets.all(AppSpacing.sm),
              decoration: BoxDecoration(
                color: AppColors.errorLight,
                border: Border.all(color: AppColors.error),
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.shield_outlined, color: AppColors.error, size: 18),
                      const SizedBox(width: 6),
                      Text(
                        '${active.length} Unresolved Risk Signal${active.length > 1 ? 's' : ''}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.error),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ...active.map((s) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 2),
                    child: Row(
                      children: [
                        const Icon(Icons.arrow_right, size: 16, color: AppColors.error),
                        Expanded(
                          child: Text(
                            '${s.entityLabel}: ${s.description}',
                            style: const TextStyle(fontSize: 11, color: AppColors.error),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        TextButton(
                          onPressed: () => ref.read(riskSignalsProvider.notifier).resolve(s.id),
                          child: const Text('Resolve', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  )),
                ],
              ),
            );
          },
          orElse: () => const SizedBox.shrink(),
        ),

        // KPI Summary Cards
        const Text(
          'Platform Operational Pulse',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.stitchSlate),
        ),
        const SizedBox(height: AppSpacing.sm),

        metricsAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => Text('Error loading metrics: $e'),
          data: (m) => GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: AppSpacing.sm,
            mainAxisSpacing: AppSpacing.sm,
            childAspectRatio: 1.45,
            children: [
              _KpiCard(
                title: 'Total Farmers',
                value: m.totalFarmers.toString(),
                subtitle: '+18 this week',
                icon: Icons.people_alt_outlined,
                color: AppColors.primary,
              ),
              _KpiCard(
                title: 'Verified Sellers',
                value: '${m.verifiedSellers} / ${m.totalSellers}',
                subtitle: '${m.pendingVerification} pending review',
                icon: Icons.store_outlined,
                color: AppColors.stitchAmber,
              ),
              _KpiCard(
                title: 'Active Products',
                value: m.activeProducts.toString(),
                subtitle: '${m.pendingModeration} in moderation',
                icon: Icons.category_outlined,
                color: AppColors.stitchSlate,
              ),
              _KpiCard(
                title: 'Dispute Claims',
                value: m.openDisputes.toString(),
                subtitle: m.openDisputes > 0 ? 'Action required' : 'Zero backlog',
                icon: Icons.gavel_outlined,
                color: m.openDisputes > 0 ? AppColors.error : AppColors.success,
              ),
            ],
          ),
        ),

        const SizedBox(height: AppSpacing.lg),

        // Operational Alerts
        const Text(
          'Active Operational Alerts',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.stitchSlate),
        ),
        const SizedBox(height: AppSpacing.sm),

        alertsAsync.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => Text('Error loading alerts: $e'),
          data: (alerts) => Column(
            children: alerts.map((a) {
              final isCrit = a.severity == 'critical';
              final isWarn = a.severity == 'warning';
              final color = isCrit ? AppColors.error : isWarn ? AppColors.stitchAmber : AppColors.info;

              return Card(
                margin: const EdgeInsets.only(bottom: AppSpacing.xs),
                elevation: 0.5,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  side: BorderSide(color: color.withValues(alpha: 0.3)),
                ),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: color.withValues(alpha: 0.15),
                    radius: 16,
                    child: Icon(
                      isCrit ? Icons.error_outline : Icons.notifications_none,
                      color: color,
                      size: 18,
                    ),
                  ),
                  title: Text(a.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  subtitle: Text(a.context, style: const TextStyle(fontSize: 11)),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}

class _KpiCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final IconData icon;
  final Color color;

  const _KpiCard({
    required this.title,
    required this.value,
    required this.subtitle,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title.toUpperCase(),
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textSecondary),
              ),
              Icon(icon, size: 16, color: color),
            ],
          ),
          Text(
            value,
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color),
          ),
          Text(
            subtitle,
            style: const TextStyle(fontSize: 10, color: AppColors.textTertiary),
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// TAB 2: SELLERS (VERIFICATION)
// =============================================================================
class _AdminSellersTab extends ConsumerStatefulWidget {
  const _AdminSellersTab();

  @override
  ConsumerState<_AdminSellersTab> createState() => _AdminSellersTabState();
}

class _AdminSellersTabState extends ConsumerState<_AdminSellersTab> {
  AdminVerificationStatus? _filterStatus;

  @override
  Widget build(BuildContext context) {
    final verificationsAsync = ref.watch(sellerVerificationsProvider);

    return verificationsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('Error loading sellers: $e')),
      data: (sellers) {
        final filtered = _filterStatus == null
            ? sellers
            : sellers.where((s) => s.status == _filterStatus).toList();

        return Column(
          children: [
            // Filter Bar
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
              child: Row(
                children: [
                  FilterChip(
                    label: const Text('All'),
                    selected: _filterStatus == null,
                    onSelected: (_) => setState(() => _filterStatus = null),
                  ),
                  const SizedBox(width: 6),
                  ...AdminVerificationStatus.values.map((status) => Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: FilterChip(
                      label: Text(status.label),
                      selected: _filterStatus == status,
                      onSelected: (_) => setState(() => _filterStatus = status),
                    ),
                  )),
                ],
              ),
            ),

            // Sellers List
            Expanded(
              child: filtered.isEmpty
                  ? const Center(child: Text('No sellers found.'))
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                      itemCount: filtered.length,
                      itemBuilder: (context, index) {
                        final seller = filtered[index];
                        return _SellerVerificationCard(seller: seller);
                      },
                    ),
            ),
          ],
        );
      },
    );
  }
}

class _SellerVerificationCard extends ConsumerWidget {
  final AdminSellerVerification seller;

  const _SellerVerificationCard({required this.seller});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    Color badgeBg;
    Color badgeText;
    switch (seller.status) {
      case AdminVerificationStatus.verified:
        badgeBg = AppColors.successLight;
        badgeText = AppColors.success;
        break;
      case AdminVerificationStatus.underReview:
        badgeBg = const Color(0xFFEFF6FF);
        badgeText = const Color(0xFF1D4ED8);
        break;
      case AdminVerificationStatus.submitted:
        badgeBg = AppColors.warningLight;
        badgeText = AppColors.stitchAmber;
        break;
      case AdminVerificationStatus.rejected:
      case AdminVerificationStatus.suspended:
        badgeBg = AppColors.errorLight;
        badgeText = AppColors.error;
        break;
      default:
        badgeBg = AppColors.border;
        badgeText = AppColors.textSecondary;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      elevation: 0.5,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        side: const BorderSide(color: AppColors.border),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.sm),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    seller.businessName,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: badgeBg,
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                  child: Text(
                    seller.status.label.toUpperCase(),
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: badgeText),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              'Owner: ${seller.ownerName} • ${seller.businessType.label}',
              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
            Text(
              'GSTIN: ${seller.gstNumber} • ${seller.district}, ${seller.state}',
              style: const TextStyle(fontSize: 11, color: AppColors.textTertiary),
            ),

            if (seller.riskFlags.isNotEmpty) ...[
              const SizedBox(height: 6),
              Wrap(
                spacing: 4,
                children: seller.riskFlags.map((rf) => Chip(
                  label: Text(rf.replaceAll('_', ' '), style: const TextStyle(fontSize: 9, color: AppColors.error)),
                  backgroundColor: AppColors.errorLight,
                  padding: EdgeInsets.zero,
                  visualDensity: VisualDensity.compact,
                )).toList(),
              ),
            ],

            const Divider(height: 16),

            // Action Row
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                if (seller.status != AdminVerificationStatus.verified)
                  TextButton.icon(
                    onPressed: () {
                      ref.read(sellerVerificationsProvider.notifier).updateStatus(
                        seller.id,
                        AdminVerificationStatus.verified,
                      );
                    },
                    icon: const Icon(Icons.check_circle_outline, size: 14, color: AppColors.success),
                    label: const Text('Verify', style: TextStyle(color: AppColors.success, fontSize: 12)),
                  ),
                if (seller.status != AdminVerificationStatus.rejected)
                  TextButton.icon(
                    onPressed: () => _promptRejection(context, ref, seller.id),
                    icon: const Icon(Icons.cancel_outlined, size: 14, color: AppColors.error),
                    label: const Text('Reject', style: TextStyle(color: AppColors.error, fontSize: 12)),
                  ),
                if (seller.status == AdminVerificationStatus.verified)
                  TextButton.icon(
                    onPressed: () {
                      ref.read(sellerVerificationsProvider.notifier).updateStatus(
                        seller.id,
                        AdminVerificationStatus.suspended,
                      );
                    },
                    icon: const Icon(Icons.pause_circle_outline, size: 14, color: AppColors.textSecondary),
                    label: const Text('Suspend', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _promptRejection(BuildContext context, WidgetRef ref, String id) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Reject Seller Application'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            labelText: 'Compliance Failure Reason',
            hintText: 'e.g. Expired fertilizer trading license',
          ),
          maxLines: 2,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            onPressed: () {
              if (controller.text.trim().isNotEmpty) {
                ref.read(sellerVerificationsProvider.notifier).updateStatus(
                  id,
                  AdminVerificationStatus.rejected,
                  rejectionReason: controller.text.trim(),
                );
                Navigator.pop(ctx);
              }
            },
            child: const Text('Confirm Reject'),
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// TAB 3: MODERATION
// =============================================================================
class _AdminModerationTab extends ConsumerStatefulWidget {
  const _AdminModerationTab();

  @override
  ConsumerState<_AdminModerationTab> createState() => _AdminModerationTabState();
}

class _AdminModerationTabState extends ConsumerState<_AdminModerationTab> {
  AdminModerationStatus? _filterStatus;

  @override
  Widget build(BuildContext context) {
    final moderationsAsync = ref.watch(productModerationProvider);

    return moderationsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('Error loading moderation queue: $e')),
      data: (items) {
        final filtered = _filterStatus == null
            ? items
            : items.where((m) => m.status == _filterStatus).toList();

        return Column(
          children: [
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
              child: Row(
                children: [
                  FilterChip(
                    label: const Text('All'),
                    selected: _filterStatus == null,
                    onSelected: (_) => setState(() => _filterStatus = null),
                  ),
                  const SizedBox(width: 6),
                  ...AdminModerationStatus.values.map((st) => Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: FilterChip(
                      label: Text(st.label),
                      selected: _filterStatus == st,
                      onSelected: (_) => setState(() => _filterStatus = st),
                    ),
                  )),
                ],
              ),
            ),
            Expanded(
              child: filtered.isEmpty
                  ? const Center(child: Text('No catalog submissions in queue.'))
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                      itemCount: filtered.length,
                      itemBuilder: (context, index) {
                        final item = filtered[index];
                        return _ProductModerationCard(item: item);
                      },
                    ),
            ),
          ],
        );
      },
    );
  }
}

class _ProductModerationCard extends ConsumerWidget {
  final AdminProductModeration item;

  const _ProductModerationCard({required this.item});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Card(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      elevation: 0.5,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.md),
        side: const BorderSide(color: AppColors.border),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.sm),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    item.productTitle,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ),
                Text(
                  item.status.label,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: item.status == AdminModerationStatus.approved
                        ? AppColors.success
                        : item.status == AdminModerationStatus.rejected
                            ? AppColors.error
                            : AppColors.stitchAmber,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              'Seller: ${item.sellerName} • Category: ${item.category}',
              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
            ),
            Text(
              '₹${item.price.toStringAsFixed(0)} (MRP: ₹${item.mrp.toStringAsFixed(0)}) • Stock: ${item.stockQuantity}',
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.stitchSlate),
            ),

            if (item.rejectionReason != null) ...[
              const SizedBox(height: 4),
              Text(
                'Reason: ${item.rejectionReason}',
                style: const TextStyle(fontSize: 11, color: AppColors.error),
              ),
            ],

            const Divider(height: 14),

            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                if (item.status != AdminModerationStatus.approved)
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      visualDensity: VisualDensity.compact,
                    ),
                    onPressed: () {
                      ref.read(productModerationProvider.notifier).updateStatus(
                        item.id,
                        AdminModerationStatus.approved,
                      );
                    },
                    child: const Text('Approve', style: TextStyle(fontSize: 11)),
                  ),
                const SizedBox(width: 8),
                if (item.status != AdminModerationStatus.rejected)
                  OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.error,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      visualDensity: VisualDensity.compact,
                    ),
                    onPressed: () {
                      ref.read(productModerationProvider.notifier).updateStatus(
                        item.id,
                        AdminModerationStatus.rejected,
                        rejectionReason: 'Non-compliant batch certification',
                      );
                    },
                    child: const Text('Reject', style: TextStyle(fontSize: 11)),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// =============================================================================
// TAB 4: DISPUTES
// =============================================================================
class _AdminDisputesTab extends ConsumerWidget {
  const _AdminDisputesTab();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final disputesAsync = ref.watch(adminDisputesProvider);

    return disputesAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('Error loading disputes: $e')),
      data: (disputes) => ListView.builder(
        padding: const EdgeInsets.all(AppSpacing.md),
        itemCount: disputes.length,
        itemBuilder: (context, index) {
          final dispute = disputes[index];
          return Card(
            margin: const EdgeInsets.only(bottom: AppSpacing.sm),
            elevation: 0.5,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppRadius.md),
              side: const BorderSide(color: AppColors.border),
            ),
            child: ExpansionTile(
              leading: const CircleAvatar(
                backgroundColor: Color(0xFFF1F5F9),
                child: Icon(Icons.gavel, size: 18, color: AppColors.stitchSlate),
              ),
              title: Text(
                dispute.subject,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              ),
              subtitle: Text(
                'Order: ${dispute.orderNumber} • ${dispute.status.label}',
                style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
              ),
              children: [
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.sm),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Claimant: ${dispute.farmerName} | Seller: ${dispute.sellerName}',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        dispute.description,
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),

                      if (dispute.resolution != null) ...[
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.successLight,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'Resolution: ${dispute.resolution}',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.success),
                          ),
                        ),
                      ],

                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          if (dispute.status == AdminDisputeStatus.open)
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                visualDensity: VisualDensity.compact,
                              ),
                              onPressed: () {
                                ref.read(adminDisputesProvider.notifier).updateStatus(
                                  dispute.id,
                                  AdminDisputeStatus.underReview,
                                );
                              },
                              child: const Text('Mark Under Review', style: TextStyle(fontSize: 11)),
                            ),
                          const SizedBox(width: 6),
                          if (dispute.status != AdminDisputeStatus.resolved)
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.success,
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                visualDensity: VisualDensity.compact,
                              ),
                              onPressed: () {
                                ref.read(adminDisputesProvider.notifier).updateStatus(
                                  dispute.id,
                                  AdminDisputeStatus.resolved,
                                  resolution: '100% refund credit approved under SafeHarvest Policy',
                                );
                              },
                              child: const Text('Resolve with Refund', style: TextStyle(fontSize: 11)),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
