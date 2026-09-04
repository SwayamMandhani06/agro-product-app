/// Represents regional agro-meteorological metrics and forecasts.
class WeatherInfo {
  const WeatherInfo({
    required this.location,
    required this.temperatureCelsius,
    required this.condition,
    required this.humidityPercent,
    required this.windSpeedKph,
    required this.iconCode,
    this.feelsLikeCelsius = 31.0,
    this.rainProbabilityPercent = 65,
    this.visibilityKm = 9.5,
    this.uvIndex = 6,
    this.hourly = const [],
    this.daily = const [],
    this.advisories = const [],
  });

  final String location;
  final double temperatureCelsius;
  final String condition;
  final int humidityPercent;
  final double windSpeedKph;
  final String iconCode;
  final double feelsLikeCelsius;
  final int rainProbabilityPercent;
  final double visibilityKm;
  final int uvIndex;
  final List<HourlyWeather> hourly;
  final List<DailyWeather> daily;
  final List<FarmAdvisory> advisories;
}

class HourlyWeather {
  const HourlyWeather({
    required this.time,
    required this.temperature,
    required this.rainProbability,
    required this.windSpeed,
    required this.condition,
  });

  final String time;
  final double temperature;
  final int rainProbability;
  final double windSpeed;
  final String condition;
}

class DailyWeather {
  const DailyWeather({
    required this.day,
    required this.date,
    required this.tempHigh,
    required this.tempLow,
    required this.rainProbability,
    required this.condition,
  });

  final String day;
  final String date;
  final int tempHigh;
  final int tempLow;
  final int rainProbability;
  final String condition;
}

class FarmAdvisory {
  const FarmAdvisory({
    required this.id,
    required this.title,
    required this.advice,
    required this.severity, // 'critical' | 'warning' | 'info'
    required this.category, // 'Spraying' | 'Irrigation' | 'Field Prep'
  });

  final String id;
  final String title;
  final String advice;
  final String severity;
  final String category;
}
