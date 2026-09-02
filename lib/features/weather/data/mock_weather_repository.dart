import 'package:fpdart/fpdart.dart';

import '../../../core/error/failure.dart';
import '../domain/weather_info.dart';
import '../domain/weather_repository.dart';

class MockWeatherRepository implements WeatherRepository {
  const MockWeatherRepository();

  static const _sample = WeatherInfo(
    location: 'Pune, Maharashtra',
    temperatureCelsius: 32.5,
    condition: 'Partly cloudy',
    humidityPercent: 58,
    windSpeedKph: 12.4,
    iconCode: '02d',
  );

  @override
  Future<Result<WeatherInfo>> getCurrentWeather({String? location}) async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    if (location != null && location.toLowerCase().contains('error')) {
      return const Left(UnknownFailure('Mock weather error.'));
    }
    return Right(
      WeatherInfo(
        location: location ?? _sample.location,
        temperatureCelsius: _sample.temperatureCelsius,
        condition: _sample.condition,
        humidityPercent: _sample.humidityPercent,
        windSpeedKph: _sample.windSpeedKph,
        iconCode: _sample.iconCode,
      ),
    );
  }
}
