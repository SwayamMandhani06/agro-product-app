import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_radius.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/widgets/app_error_state.dart';
import '../../../core/widgets/app_loading.dart';
import '../domain/weather_info.dart';
import 'providers/weather_provider.dart';

/// Comprehensive Agro-Meteorological & Farm Advisory screen.
class WeatherScreen extends ConsumerWidget {
  const WeatherScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final weatherAsync = ref.watch(currentWeatherProvider);

    return Scaffold(
      backgroundColor: AppColors.stitchCanvas,
      appBar: AppBar(
        title: const Text('Weather & Advisory'),
        backgroundColor: AppColors.stitchCanvas,
        elevation: 0,
      ),
      body: weatherAsync.when(
        data: (weather) => RefreshIndicator(
          onRefresh: () => ref.refresh(currentWeatherProvider.future),
          color: AppColors.stitchForestGreen,
          child: ListView(
            padding: const EdgeInsets.all(AppSpacing.md),
            children: [
              // 1. Current Conditions Hero Card
              _buildCurrentHeroCard(weather),
              const SizedBox(height: AppSpacing.lg),

              // 2. Operational Farm Advisories
              _buildAdvisoriesSection(weather.advisories),
              const SizedBox(height: AppSpacing.lg),

              // 3. 24-Hour Forecast Timeline
              _buildHourlyTimeline(weather.hourly),
              const SizedBox(height: AppSpacing.lg),

              // 4. 7-Day Agrarian Outlook
              _buildDailyForecast(weather.daily),
              const SizedBox(height: AppSpacing.xl),
            ],
          ),
        ),
        loading: () => const Center(child: AppSpinner(size: 36)),
        error: (error, _) => Center(
          child: AppErrorState(
            title: 'Failed to load weather data',
            message: error.toString(),
            onRetry: () => ref.invalidate(currentWeatherProvider),
          ),
        ),
      ),
    );
  }

  Widget _buildCurrentHeroCard(WeatherInfo weather) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(color: AppColors.neutral200),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    weather.location,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${weather.temperatureCelsius.toStringAsFixed(1)}°C',
                    style: const TextStyle(
                      fontSize: 40,
                      fontWeight: FontWeight.w800,
                      color: AppColors.stitchForestGreen,
                      letterSpacing: -1.0,
                    ),
                  ),
                  Text(
                    'Feels like ${weather.feelsLikeCelsius}°C • ${weather.condition}',
                    style: const TextStyle(
                      fontSize: 12.5,
                      color: AppColors.textTertiary,
                    ),
                  ),
                ],
              ),
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: AppColors.stitchForestGreen,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                child: const Icon(
                  Icons.cloudy_snowing,
                  color: Colors.white,
                  size: 30,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          const Divider(height: 1, color: AppColors.neutral200),
          const SizedBox(height: AppSpacing.md),

          // Micro-grid stats
          Row(
            children: [
              _buildStatChip(
                icon: Icons.water_drop_outlined,
                color: const Color(0xFF0284C7),
                label: 'Humidity',
                value: '${weather.humidityPercent}%',
              ),
              _buildStatChip(
                icon: Icons.air_rounded,
                color: const Color(0xFF64748B),
                label: 'Wind',
                value: '${weather.windSpeedKph} km/h',
              ),
              _buildStatChip(
                icon: Icons.umbrella_outlined,
                color: AppColors.stitchAmber,
                label: 'Rain Risk',
                value: '${weather.rainProbabilityPercent}%',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatChip({
    required IconData icon,
    required Color color,
    required String label,
    required String value,
  }) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
        decoration: BoxDecoration(
          color: AppColors.stitchCanvas,
          borderRadius: BorderRadius.circular(AppRadius.sm),
          border: Border.all(color: AppColors.neutral200),
        ),
        child: Column(
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(fontSize: 10, color: AppColors.textTertiary),
            ),
            Text(
              value,
              style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAdvisoriesSection(List<FarmAdvisory> advisories) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Operational Farm Advisories',
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 4),
        const Text(
          'Rule-based agronomic guidance based on soil and weather thresholds',
          style: TextStyle(fontSize: 11.5, color: AppColors.textTertiary),
        ),
        const SizedBox(height: 10),
        ...advisories.map((advisory) {
          final isCritical = advisory.severity == 'critical';
          final isWarning = advisory.severity == 'warning';
          final borderColor = isCritical
              ? AppColors.error
              : isWarning
                  ? AppColors.stitchAmber
                  : AppColors.stitchForestGreen;

          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(AppRadius.sm),
              border: Border(left: BorderSide(color: borderColor, width: 4)),
              boxShadow: const [
                BoxShadow(color: Color(0x06000000), blurRadius: 4, offset: Offset(0, 2)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      isCritical ? Icons.warning_amber_rounded : Icons.info_outline_rounded,
                      size: 15,
                      color: borderColor,
                    ),
                    const SizedBox(width: 5),
                    Text(
                      '${advisory.category.toUpperCase()} ADVISORY',
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w700,
                        color: borderColor,
                        letterSpacing: 0.3,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  advisory.title,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  advisory.advice,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildHourlyTimeline(List<HourlyWeather> hourly) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '24-Hour Forecast Timeline',
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 110,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: hourly.length,
            itemBuilder: (context, index) {
              final h = hourly[index];
              return Container(
                width: 78,
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(AppRadius.sm),
                  border: Border.all(color: AppColors.neutral200),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(h.time, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                    Icon(
                      h.condition == 'rain' || h.condition == 'thunder'
                          ? Icons.cloudy_snowing
                          : Icons.wb_sunny_rounded,
                      size: 20,
                      color: h.condition == 'rain' ? const Color(0xFF0284C7) : const Color(0xFFEAB308),
                    ),
                    Text(
                      '${h.temperature.toStringAsFixed(0)}°C',
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                    ),
                    Text(
                      '${h.rainProbability}%',
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.stitchAmber),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDailyForecast(List<DailyWeather> daily) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '7-Day Agrarian Outlook',
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(AppRadius.sm),
            border: Border.all(color: AppColors.neutral200),
          ),
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: daily.length,
            separatorBuilder: (_, __) => const Divider(height: 1, color: AppColors.neutral100),
            itemBuilder: (context, index) {
              final d = daily[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                child: Row(
                  children: [
                    SizedBox(
                      width: 80,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(d.day, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700)),
                          Text(d.date, style: const TextStyle(fontSize: 10.5, color: AppColors.textTertiary)),
                        ],
                      ),
                    ),
                    Icon(
                      d.condition == 'rain' || d.condition == 'thunder'
                          ? Icons.cloudy_snowing
                          : Icons.wb_sunny_rounded,
                      size: 18,
                      color: d.condition == 'rain' ? const Color(0xFF0284C7) : const Color(0xFFEAB308),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: d.rainProbability > 50
                            ? const Color(0x1A0284C7)
                            : const Color(0x1AEAB308),
                        borderRadius: BorderRadius.circular(AppRadius.xs),
                      ),
                      child: Text(
                        '${d.rainProbability}% Rain',
                        style: TextStyle(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w700,
                          color: d.rainProbability > 50 ? const Color(0xFF0284C7) : const Color(0xFFB45309),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Text(
                      '${d.tempHigh}° / ${d.tempLow}°',
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
