class WeatherInfo {
  const WeatherInfo({
    required this.location,
    required this.temperatureCelsius,
    required this.condition,
    required this.humidityPercent,
    required this.windSpeedKph,
    required this.iconCode,
  });

  final String location;
  final double temperatureCelsius;
  final String condition;
  final int humidityPercent;
  final double windSpeedKph;
  final String iconCode;
}
