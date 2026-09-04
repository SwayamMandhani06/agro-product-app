import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_radius.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/realtime/realtime_connection_state.dart';
import '../../../core/realtime/realtime_service.dart';
import '../../../core/widgets/app_empty_state.dart';
import '../../../core/widgets/app_error_state.dart';
import '../../../core/widgets/app_loading.dart';
import '../domain/mandi_price.dart';
import 'providers/mandi_prices_provider.dart';

/// Full Mandi Intelligence & APMC Rates screen for farmers.
class MandiPricesScreen extends ConsumerStatefulWidget {
  const MandiPricesScreen({super.key});

  @override
  ConsumerState<MandiPricesScreen> createState() => _MandiPricesScreenState();
}

class _MandiPricesScreenState extends ConsumerState<MandiPricesScreen> {
  String _selectedCrop = 'All';

  static const List<String> _crops = [
    'All',
    'Soybean',
    'Cotton',
    'Wheat',
    'Onion',
    'Chana',
  ];

  @override
  Widget build(BuildContext context) {
    final pricesAsync = ref.watch(mandiPricesProvider);
    final connState = ref.watch(realtimeConnectionStateProvider).valueOrNull ?? RealtimeConnectionState.connected;

    return Scaffold(
      backgroundColor: AppColors.stitchCanvas,
      appBar: AppBar(
        title: const Text('Mandi Intelligence (APMC)'),
        backgroundColor: AppColors.stitchCanvas,
        elevation: 0,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: connState.isConnected
                      ? AppColors.stitchForestGreen.withValues(alpha: 0.1)
                      : AppColors.error.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: connState.isConnected ? AppColors.stitchForestGreen : AppColors.error,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 5),
                    Text(
                      connState.isConnected ? 'LIVE' : connState.label.toUpperCase(),
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: connState.isConnected ? AppColors.stitchForestGreen : AppColors.error,
                        letterSpacing: 0.4,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Offline banner
          if (connState.isOffline)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              color: AppColors.error.withValues(alpha: 0.08),
              child: const Row(
                children: [
                  Icon(Icons.wifi_off_rounded, size: 14, color: AppColors.error),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "You're offline. Showing the latest available information.",
                      style: TextStyle(fontSize: 12, color: AppColors.error, fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ),
          // Crop Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
            child: Row(
              children: _crops.map((crop) {
                final isSelected = _selectedCrop == crop;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    selected: isSelected,
                    label: Text(crop),
                    labelStyle: TextStyle(
                      fontSize: 12.5,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                      color: isSelected ? Colors.white : AppColors.textPrimary,
                    ),
                    selectedColor: AppColors.stitchForestGreen,
                    backgroundColor: AppColors.surface,
                    checkmarkColor: Colors.white,
                    side: BorderSide(
                      color: isSelected ? AppColors.stitchForestGreen : AppColors.neutral200,
                    ),
                    onSelected: (_) => setState(() => _selectedCrop = crop),
                  ),
                );
              }).toList(),
            ),
          ),
          const Divider(height: 1, color: AppColors.neutral200),

          // Commodity Cards List
          Expanded(
            child: pricesAsync.when(
              data: (prices) {
                final filtered = _selectedCrop == 'All'
                    ? prices
                    : prices
                        .where((p) => p.commodity.toLowerCase().contains(_selectedCrop.toLowerCase()))
                        .toList();

                if (filtered.isEmpty) {
                  return AppEmptyState(
                    title: 'No Market Data for $_selectedCrop',
                    message: 'Official arrivals have not been recorded for this crop today.',
                    icon: Icons.store_mall_directory_outlined,
                  );
                }

                return RefreshIndicator(
                  onRefresh: () async => ref.refresh(mandiPricesProvider),
                  color: AppColors.stitchForestGreen,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    itemCount: filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
                    itemBuilder: (context, index) {
                      final item = filtered[index];
                      return _buildCommodityCard(context, item);
                    },
                  ),
                );
              },
              loading: () => const Center(child: AppSpinner(size: 36)),
              error: (error, _) => Center(
                child: AppErrorState(
                  title: 'Failed to load mandi rates',
                  message: error.toString(),
                  onRetry: () => ref.refresh(mandiPricesProvider),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCommodityCard(BuildContext context, MandiPrice item) {
    final isUp = item.trend == 'up';
    final isDown = item.trend == 'down';
    final trendColor = isUp
        ? AppColors.stitchForestGreen
        : isDown
            ? AppColors.error
            : AppColors.neutral600;

    return InkWell(
      borderRadius: AppRadius.card,
      onTap: () => _showDetailSheet(context, item),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: AppRadius.card,
          border: Border.all(color: AppColors.neutral200),
          boxShadow: const [
            BoxShadow(color: Color(0x05000000), blurRadius: 6, offset: Offset(0, 2)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Commodity & APMC Location
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.commodity,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Text(
                        '${item.variety} • ${item.market}, ${item.state}',
                        style: const TextStyle(
                          fontSize: 11.5,
                          color: AppColors.textTertiary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: trendColor.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(AppRadius.xs),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isUp
                            ? Icons.arrow_upward_rounded
                            : isDown
                                ? Icons.arrow_downward_rounded
                                : Icons.remove_rounded,
                        size: 13,
                        color: trendColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        item.trendDiff,
                        style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w700,
                          color: trendColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.md),

            // Middle Row: Modal Price + Daily Arrivals
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Modal Price',
                      style: TextStyle(fontSize: 10.5, color: AppColors.textTertiary),
                    ),
                    Text(
                      '₹${item.pricePerQuintal.toInt().toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')}',
                      style: const TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ],
                ),
                Text(
                  'Arrivals: ${item.arrivalsQuintals} qtl',
                  style: const TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),

            if (item.minPrice != null && item.maxPrice != null) ...[
              const SizedBox(height: AppSpacing.sm),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Min: ₹${item.minPrice!.toInt()}', style: const TextStyle(fontSize: 10.5, color: AppColors.textTertiary)),
                  const Text('•', style: TextStyle(fontSize: 10.5, color: AppColors.neutral300)),
                  Text('Max: ₹${item.maxPrice!.toInt()}', style: const TextStyle(fontSize: 10.5, color: AppColors.textTertiary)),
                  const Spacer(),
                  const Text('Tap for Arbitrage & Trends →', style: TextStyle(fontSize: 10.5, color: AppColors.stitchForestGreen, fontWeight: FontWeight.w600)),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  void _showDetailSheet(BuildContext context, MandiPrice item) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: const BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: AppSpacing.md),
                  decoration: BoxDecoration(
                    color: AppColors.neutral300,
                    borderRadius: BorderRadius.circular(AppRadius.full),
                  ),
                ),
              ),
              Text(
                '${item.commodity} (${item.variety})',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
              ),
              Text(
                '${item.market}, ${item.state} • Daily Modal: ₹${item.pricePerQuintal.toInt()}/qtl',
                style: const TextStyle(fontSize: 12.5, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 16),

              // Sparkline Visualizer
              if (item.history.isNotEmpty) ...[
                const Text('7-Day Price Movement (₹/qtl)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                  decoration: BoxDecoration(
                    color: AppColors.stitchCanvas,
                    borderRadius: AppRadius.card,
                    border: Border.all(color: AppColors.neutral200),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: item.history.map((price) {
                      return Column(
                        children: [
                          Text('₹${price.toInt()}', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 4),
                          Container(
                            width: 8,
                            height: ((price - 2000) / 100).clamp(12.0, 40.0),
                            decoration: BoxDecoration(
                              color: AppColors.stitchForestGreen,
                              borderRadius: BorderRadius.circular(AppRadius.xs),
                            ),
                          ),
                        ],
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Market Comparison / Arbitrage
              if (item.marketComparisons.isNotEmpty) ...[
                const Text('Regional Market Comparison & Arbitrage', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                ...item.marketComparisons.map((c) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 6),
                    padding: const EdgeInsets.all(AppSpacing.sm),
                    decoration: BoxDecoration(
                      color: AppColors.stitchCanvas,
                      borderRadius: AppRadius.card,
                      border: Border.all(color: AppColors.neutral200),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(c.mandi, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700)),
                            Text('${c.state} • ${c.distanceKm} km', style: const TextStyle(fontSize: 10.5, color: AppColors.textTertiary)),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text('₹${c.modalPrice.toInt()}/qtl', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800)),
                            Text(
                              c.diffFromLocal,
                              style: TextStyle(
                                fontSize: 10.5,
                                fontWeight: FontWeight.w600,
                                color: c.diffFromLocal.startsWith('+') ? AppColors.stitchForestGreen : AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                }),
              ],
              const SizedBox(height: 14),
            ],
          ),
        );
      },
    );
  }
}
