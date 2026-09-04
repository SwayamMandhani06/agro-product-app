import 'package:fpdart/fpdart.dart';

import '../../../core/error/failure.dart';
import '../domain/weather_info.dart';
import '../domain/weather_repository.dart';

class MockWeatherRepository implements WeatherRepository {
  const MockWeatherRepository();

  static const List<HourlyWeather> _hourly = [
    HourlyWeather(time: '06:00', temperature: 24.0, rainProbability: 20, windSpeed: 8, condition: 'cloudy'),
    HourlyWeather(time: '09:00', temperature: 27.2, rainProbability: 35, windSpeed: 11, condition: 'cloudy'),
    HourlyWeather(time: '12:00', temperature: 30.5, rainProbability: 55, windSpeed: 16, condition: 'rain'),
    HourlyWeather(time: '15:00', temperature: 29.0, rainProbability: 70, windSpeed: 18, condition: 'thunder'),
    HourlyWeather(time: '18:00', temperature: 26.8, rainProbability: 60, windSpeed: 14, condition: 'rain'),
    HourlyWeather(time: '21:00', temperature: 25.1, rainProbability: 40, windSpeed: 10, condition: 'cloudy'),
    HourlyWeather(time: '00:00', temperature: 23.8, rainProbability: 25, windSpeed: 9, condition: 'cloudy'),
  ];

  static const List<DailyWeather> _daily = [
    DailyWeather(day: 'Today', date: 'Thu, Sep 3', tempHigh: 30, tempLow: 23, rainProbability: 65, condition: 'rain'),
    DailyWeather(day: 'Tomorrow', date: 'Fri, Sep 4', tempHigh: 29, tempLow: 22, rainProbability: 80, condition: 'thunder'),
    DailyWeather(day: 'Saturday', date: 'Sat, Sep 5', tempHigh: 31, tempLow: 23, rainProbability: 45, condition: 'cloudy'),
    DailyWeather(day: 'Sunday', date: 'Sun, Sep 6', tempHigh: 32, tempLow: 24, rainProbability: 20, condition: 'sunny'),
    DailyWeather(day: 'Monday', date: 'Mon, Sep 7', tempHigh: 33, tempLow: 24, rainProbability: 15, condition: 'sunny'),
    DailyWeather(day: 'Tuesday', date: 'Tue, Sep 8', tempHigh: 32, tempLow: 23, rainProbability: 30, condition: 'cloudy'),
    DailyWeather(day: 'Wednesday', date: 'Wed, Sep 9', tempHigh: 30, tempLow: 22, rainProbability: 60, condition: 'rain'),
  ];

  static const List<FarmAdvisory> _advisories = [
    FarmAdvisory(
      id: 'adv_1',
      severity: 'critical',
      title: 'Postpone Foliar & Chemical Spraying',
      advice:
          'Wind speeds exceeding 15 km/h and 65% precipitation probability will cause spray drift and wash-off. Reschedule protective pesticide applications to Sunday morning.',
      category: 'Spraying',
    ),
    FarmAdvisory(
      id: 'adv_2',
      severity: 'warning',
      title: 'Drain Standing Water from Pulse & Vegetable Beds',
      advice:
          'High rainfall expected over the next 48 hours. Clear drainage channels to avoid root asphyxiation and damping-off fungus in young soybean and tomato seedlings.',
      category: 'Field Prep',
    ),
    FarmAdvisory(
      id: 'adv_3',
      severity: 'info',
      title: 'Suspend Micro-Irrigation Cycles',
      advice:
          'Adequate soil root-zone moisture saturation (>80% field capacity). Cut off drip fertigation for 48 hours to conserve pump electricity and avoid nutrient leaching.',
      category: 'Irrigation',
    ),
  ];

  @override
  Future<Result<WeatherInfo>> getCurrentWeather({String? location}) async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    if (location != null && location.toLowerCase().contains('error')) {
      return const Left(UnknownFailure('Mock weather error.'));
    }

    return Right(
      WeatherInfo(
        location: location ?? 'Pune Regional Agricultural Zone',
        temperatureCelsius: 28.5,
        feelsLikeCelsius: 31.0,
        condition: 'Scattered Monsoon Clouds',
        humidityPercent: 74,
        windSpeedKph: 14.2,
        visibilityKm: 9.5,
        rainProbabilityPercent: 65,
        uvIndex: 6,
        iconCode: '10d',
        hourly: _hourly,
        daily: _daily,
        advisories: _advisories,
      ),
    );
  }
}
