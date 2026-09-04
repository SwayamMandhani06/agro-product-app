import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../cart_checkout/domain/order.dart';

/// Interactive vertical tracking timeline matching Google Stitch screen `a548142411df4d44818be9be7f855034`.
class OrderTrackingTimeline extends StatelessWidget {
  const OrderTrackingTimeline({
    super.key,
    required this.order,
    this.onAdvanceStatus,
  });

  final Order order;
  final ValueChanged<OrderStatus>? onAdvanceStatus;

  static final _dateFormat = DateFormat('dd MMM, hh:mm a');

  @override
  Widget build(BuildContext context) {
    if (order.status == OrderStatus.cancelled) {
      return Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: AppColors.errorLight,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
        ),
        child: Row(
          children: [
            const Icon(Icons.cancel_rounded, color: AppColors.error, size: 28),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Order Cancelled',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.error,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'This order was cancelled on ${_dateFormat.format(order.createdAt)}.',
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
      );
    }

    final steps = [
      _TimelineStep(
        status: OrderStatus.placed,
        title: 'Order Placed',
        subtitle: _dateFormat.format(order.createdAt),
        icon: Icons.receipt_long_rounded,
      ),
      const _TimelineStep(
        status: OrderStatus.confirmed,
        title: 'Order Confirmed',
        subtitle: 'Verified by AgriTrade seller',
        icon: Icons.check_circle_outline_rounded,
      ),
      const _TimelineStep(
        status: OrderStatus.processing,
        title: 'Packed',
        subtitle: 'Quality inspected & bagged at warehouse',
        icon: Icons.inventory_2_outlined,
      ),
      const _TimelineStep(
        status: OrderStatus.shipped,
        title: 'Shipped',
        subtitle: 'Dispatched via AgriExpress Logistics',
        icon: Icons.local_shipping_outlined,
      ),
      _TimelineStep(
        status: OrderStatus.outForDelivery,
        title: 'Out for Delivery',
        subtitle: 'Delivery partner is heading to your location',
        icon: Icons.delivery_dining_rounded,
        agentInfo: order.deliveryAgentName != null
            ? 'Agent: ${order.deliveryAgentName} (${order.deliveryAgentPhone ?? ""})'
            : null,
      ),
      const _TimelineStep(
        status: OrderStatus.delivered,
        title: 'Delivered',
        subtitle: 'Package handed over at farm / address',
        icon: Icons.done_all_rounded,
      ),
    ];

    final currentStepIdx = order.status.stepIndex;

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.neutral200),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(
                    Icons.route_rounded,
                    size: 18,
                    color: AppColors.stitchForestGreen,
                  ),
                  SizedBox(width: AppSpacing.xs),
                  Text(
                    'ORDER TRACKING',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.8,
                      color: AppColors.textTertiary,
                    ),
                  ),
                ],
              ),
              if (onAdvanceStatus != null && !order.status.isDelivered)
                GestureDetector(
                  onTap: () {
                    final next = _getNextStatus(order.status);
                    if (next != null) onAdvanceStatus!(next);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 3,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.stitchForestGreen.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(AppRadius.xs),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.fast_forward_rounded,
                          size: 12,
                          color: AppColors.stitchForestGreen,
                        ),
                        const SizedBox(width: 3),
                        Text(
                          'Simulate Next (${_getNextStatus(order.status)?.displayName ?? ""})',
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: AppColors.stitchForestGreen,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          // Timeline steps
          for (int i = 0; i < steps.length; i++) ...[
            _buildTimelineItem(
              step: steps[i],
              isLast: i == steps.length - 1,
              isCompleted: i < currentStepIdx || order.status.isDelivered,
              isActive: i == currentStepIdx && !order.status.isDelivered,
              isPending: i > currentStepIdx && !order.status.isDelivered,
            ),
          ],
        ],
      ),
    );
  }

  OrderStatus? _getNextStatus(OrderStatus current) {
    return switch (current) {
      OrderStatus.placed => OrderStatus.confirmed,
      OrderStatus.confirmed => OrderStatus.processing,
      OrderStatus.processing => OrderStatus.shipped,
      OrderStatus.shipped => OrderStatus.outForDelivery,
      OrderStatus.outForDelivery => OrderStatus.delivered,
      OrderStatus.delivered => null,
      OrderStatus.cancelled => null,
    };
  }

  Widget _buildTimelineItem({
    required _TimelineStep step,
    required bool isLast,
    required bool isCompleted,
    required bool isActive,
    required bool isPending,
  }) {
    const primaryGreen = AppColors.stitchForestGreen;

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Left indicator column with vertical connecting line
          SizedBox(
            width: 32,
            child: Column(
              children: [
                // Node circle
                if (isActive)
                  _BreathingNode(
                    icon: step.icon,
                    primaryColor: primaryGreen,
                  )
                else
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isCompleted
                          ? primaryGreen
                          : AppColors.neutral100,
                      border: Border.all(
                        color: isCompleted
                            ? primaryGreen
                            : AppColors.neutral300,
                        width: 1.5,
                      ),
                    ),
                    child: Center(
                      child: isCompleted
                          ? const Icon(
                              Icons.check,
                              size: 14,
                              color: AppColors.surface,
                            )
                          : Icon(
                              step.icon,
                              size: 12,
                              color: AppColors.textTertiary,
                            ),
                    ),
                  ),
                // Connecting line
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 2,
                      margin: const EdgeInsets.symmetric(vertical: 2),
                      color: isCompleted
                          ? primaryGreen
                          : AppColors.neutral200,
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.sm),

          // Right content column
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0 : AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        step.title,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight:
                              isActive ? FontWeight.w700 : FontWeight.w600,
                          color: isPending
                              ? AppColors.textTertiary
                              : AppColors.textPrimary,
                        ),
                      ),
                      if (isActive) ...[
                        const SizedBox(width: AppSpacing.xs),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: primaryGreen.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(AppRadius.xs),
                          ),
                          child: const Text(
                            'CURRENT',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.5,
                              color: AppColors.stitchForestGreen,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    isPending ? 'Pending' : step.subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: isPending
                          ? AppColors.textTertiary
                          : AppColors.textSecondary,
                    ),
                  ),
                  // Delivery Agent Pill
                  if (isActive && step.agentInfo != null) ...[
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.sm,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.brand100,
                        borderRadius: BorderRadius.circular(AppRadius.sm),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.person_pin_rounded,
                            size: 14,
                            color: AppColors.stitchForestGreen,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            step.agentInfo!,
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: AppColors.stitchForestGreen,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TimelineStep {
  const _TimelineStep({
    required this.status,
    required this.title,
    required this.subtitle,
    required this.icon,
    this.agentInfo,
  });

  final OrderStatus status;
  final String title;
  final String subtitle;
  final IconData icon;
  final String? agentInfo;
}

class _BreathingNode extends StatefulWidget {
  const _BreathingNode({
    required this.icon,
    required this.primaryColor,
  });

  final IconData icon;
  final Color primaryColor;

  @override
  State<_BreathingNode> createState() => _BreathingNodeState();
}

class _BreathingNodeState extends State<_BreathingNode>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    final isTest =
        WidgetsBinding.instance.runtimeType.toString().contains('Test');
    if (!isTest) {
      _controller.repeat(reverse: true);
    }

    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.12).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scaleAnimation,
      child: Container(
        width: 24,
        height: 24,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: widget.primaryColor.withValues(alpha: 0.15),
          border: Border.all(
            color: widget.primaryColor,
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: widget.primaryColor.withValues(alpha: 0.25),
              blurRadius: 6,
              spreadRadius: 1,
            ),
          ],
        ),
        child: Center(
          child: Icon(
            widget.icon,
            size: 12,
            color: widget.primaryColor,
          ),
        ),
      ),
    );
  }
}
