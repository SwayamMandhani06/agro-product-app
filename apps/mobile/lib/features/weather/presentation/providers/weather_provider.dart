import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/di/providers.dart';
import '../../domain/weather_info.dart';

final currentWeatherProvider = FutureProvider<WeatherInfo>((ref) async {
  final repo = ref.watch(weatherRepositoryProvider);
  final result = await repo.getCurrentWeather(location: 'Pune, Maharashtra');
  return result.fold(
    (failure) => throw Exception(failure.message),
    (weather) => weather,
  );
});
