import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/design_system/app_colors.dart';
import '../../../../core/design_system/app_radius.dart';
import '../../../../core/design_system/app_spacing.dart';
import '../../../../core/routing/routes.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../weather/domain/weather_info.dart';

/// Weather summary card for the Farmer Dashboard matching Stitch visual specifications.
class WeatherHeroCard extends StatelessWidget {
  const WeatherHeroCard({
    super.key,
    required this.weather,
  });

  final WeatherInfo weather;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(AppSpacing.cardPadding),
      borderRadius: BorderRadius.circular(AppRadius.xl),
      variant: AppCardVariant.elevated,
      elevation: 1.0,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Row 1: Location + Subtitle (Left) and Temperature + Icon (Right)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.location_on_rounded,
                          size: 18,
                          color: AppColors.stitchForestGreen,
                        ),
                        const SizedBox(width: AppSpacing.xs),
                        Expanded(
                          child: Text(
                            weather.location,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: AppColors.stitchForestGreen,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      "Today's forecast",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),

              // Temperature and Condition
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '${weather.temperatureCelsius.round()}°C',
                    style: const TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w800,
                      color: AppColors.stitchForestGreen,
                      letterSpacing: -0.5,
                      height: 1.1,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.cloud_queue_rounded,
                        size: 15,
                        color: AppColors.textSecondary,
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Text(
                        weather.condition,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.base),
          const Divider(color: AppColors.neutral100, height: 1),
          const SizedBox(height: AppSpacing.md),

          // Row 2: Humidity and Wind metrics
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Humidity',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textTertiary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${weather.humidityPercent}%',
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: AppColors.stitchForestGreen,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                width: 1,
                height: 32,
                color: AppColors.neutral100,
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Wind',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textTertiary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${weather.windSpeedKph.round()} km/h',
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: AppColors.stitchForestGreen,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.md),

          // Action link: View detailed forecast →
          InkWell(
            onTap: () => context.push(AppRoutes.weather),
            borderRadius: BorderRadius.circular(AppRadius.xs),
            child: const Padding(
              padding: EdgeInsets.symmetric(vertical: 4),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'View detailed forecast',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.stitchForestGreen,
                    ),
                  ),
                  SizedBox(width: AppSpacing.xs),
                  Icon(
                    Icons.arrow_forward_rounded,
                    size: 14,
                    color: AppColors.stitchForestGreen,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
