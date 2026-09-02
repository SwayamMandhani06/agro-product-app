import 'package:firebase_remote_config/firebase_remote_config.dart';

class RemoteConfigService {
  RemoteConfigService(this._remoteConfig);

  final FirebaseRemoteConfig _remoteConfig;

  static const defaults = <String, dynamic>{
    'feature_recommendations_enabled': true,
    'feature_weather_enabled': true,
    'feature_mandi_prices_enabled': true,
    'feature_forum_enabled': false,
    'min_app_version': '0.1.0',
    'maintenance_mode': false,
    'maintenance_message':
        'We are performing scheduled maintenance. Please try again shortly.',
  };

  static Future<RemoteConfigService> initialize() async {
    final remoteConfig = FirebaseRemoteConfig.instance;
    await remoteConfig.setConfigSettings(
      RemoteConfigSettings(
        fetchTimeout: const Duration(seconds: 10),
        minimumFetchInterval: const Duration(hours: 1),
      ),
    );
    await remoteConfig.setDefaults(defaults);
    try {
      await remoteConfig.fetchAndActivate();
    } catch (_) {
      // Use defaults when fetch fails (offline / first launch).
    }
    return RemoteConfigService(remoteConfig);
  }

  bool get recommendationsEnabled =>
      _remoteConfig.getBool('feature_recommendations_enabled');

  bool get weatherEnabled => _remoteConfig.getBool('feature_weather_enabled');

  bool get mandiPricesEnabled =>
      _remoteConfig.getBool('feature_mandi_prices_enabled');

  bool get forumEnabled => _remoteConfig.getBool('feature_forum_enabled');

  bool get maintenanceMode => _remoteConfig.getBool('maintenance_mode');

  String get maintenanceMessage =>
      _remoteConfig.getString('maintenance_message');
}
