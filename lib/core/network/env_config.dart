import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Reads configuration values from the loaded `.env` file.
class EnvConfig {
  const EnvConfig();

  String? get cloudinaryCloudName => dotenv.maybeGet('CLOUDINARY_CLOUD_NAME');
  String? get cloudinaryUploadPreset =>
      dotenv.maybeGet('CLOUDINARY_UPLOAD_PRESET');
  String? get geminiApiKey => dotenv.maybeGet('GEMINI_API_KEY');
  String? get openWeatherApiKey => dotenv.maybeGet('OPENWEATHER_API_KEY');
  String? get razorpayKeyId => dotenv.maybeGet('RAZORPAY_KEY_ID');
  String? get mandiApiKey => dotenv.maybeGet('MANDI_API_KEY');

  String require(String key) {
    final value = dotenv.maybeGet(key);
    if (value == null || value.isEmpty) {
      throw StateError('Missing required environment variable: $key');
    }
    return value;
  }
}
