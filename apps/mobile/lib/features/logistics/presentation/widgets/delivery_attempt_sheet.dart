import 'package:flutter/material.dart';
import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../../core/widgets/app_button.dart';

class DeliveryAttemptSheet extends StatefulWidget {
  const DeliveryAttemptSheet({
    super.key,
    required this.shipmentId,
    required this.onSubmit,
  });

  final String shipmentId;
  final void Function(String reason, String? notes) onSubmit;

  static Future<void> show(
    BuildContext context, {
    required String shipmentId,
    required void Function(String reason, String? notes) onSubmit,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
      ),
      builder: (_) => DeliveryAttemptSheet(
        shipmentId: shipmentId,
        onSubmit: onSubmit,
      ),
    );
  }

  @override
  State<DeliveryAttemptSheet> createState() => _DeliveryAttemptSheetState();
}

class _DeliveryAttemptSheetState extends State<DeliveryAttemptSheet> {
  String _selectedReason = 'customer_unavailable';
  final _notesController = TextEditingController();

  final _reasons = const [
    (
      'customer_unavailable',
      'Customer Unavailable',
      'Recipient unavailable at farm gate or phone unanswered',
    ),
    (
      'address_clarification_required',
      'Address Clarification Required',
      'Rural survey number or landmark needs clarification',
    ),
    (
      'weather_delay',
      'Unseasonal Weather Delay',
      'Heavy monsoon showers or impassable farm access road',
    ),
    (
      'route_delay',
      'Rural Highway Route Delay',
      'APMC tractor convoy or road diversion on feeder route',
    ),
  ];

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: AppSpacing.lg,
        right: AppSpacing.lg,
        top: AppSpacing.lg,
        bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.xl,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.neutral300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          const Row(
            children: [
              Icon(
                Icons.report_problem_outlined,
                color: AppColors.warning,
                size: 24,
              ),
              SizedBox(width: AppSpacing.xs),
              Text(
                'Log Delivery Exception',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'Record delivery attempt issue for #${widget.shipmentId}. Automatically reschedules next carrier attempt.',
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.md),
          ..._reasons.map((r) {
            final isSelected = _selectedReason == r.$1;
            return InkWell(
              onTap: () => setState(() => _selectedReason = r.$1),
              borderRadius: BorderRadius.circular(AppRadius.md),
              child: Container(
                margin: const EdgeInsets.only(bottom: AppSpacing.xs),
                padding: const EdgeInsets.all(AppSpacing.sm),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.stitchForestGreen.withValues(alpha: 0.06) : Colors.transparent,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(
                    color: isSelected ? AppColors.stitchForestGreen : AppColors.neutral200,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 20,
                      height: 20,
                      margin: const EdgeInsets.symmetric(horizontal: 8),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isSelected ? AppColors.stitchForestGreen : AppColors.neutral400,
                          width: 2,
                        ),
                      ),
                      child: isSelected
                          ? Center(
                              child: Container(
                                width: 10,
                                height: 10,
                                decoration: const BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: AppColors.stitchForestGreen,
                                ),
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            r.$2,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          Text(
                            r.$3,
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
              ),
            );
          }),
          const SizedBox(height: AppSpacing.sm),
          TextField(
            controller: _notesController,
            maxLines: 2,
            decoration: InputDecoration(
              hintText: 'Additional dispatcher notes (optional)',
              hintStyle: const TextStyle(fontSize: 13, color: AppColors.neutral400),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppRadius.md),
                borderSide: const BorderSide(color: AppColors.neutral300),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppRadius.md),
                borderSide: const BorderSide(color: AppColors.stitchForestGreen),
              ),
              contentPadding: const EdgeInsets.all(AppSpacing.sm),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadius.md),
                    ),
                  ),
                  child: const Text('Cancel'),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: AppButton(
                  label: 'Record Exception',
                  onPressed: () {
                    widget.onSubmit(
                      _selectedReason,
                      _notesController.text.trim().isNotEmpty
                          ? _notesController.text.trim()
                          : null,
                    );
                    Navigator.of(context).pop();
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
