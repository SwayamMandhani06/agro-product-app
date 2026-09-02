import '../../../core/error/failure.dart';
import 'weather_info.dart';

abstract interface class WeatherRepository {
  Future<Result<WeatherInfo>> getCurrentWeather({String? location});
}
